import * as XLSX from 'xlsx';
import { Student } from '../types';

const KEYWORDS = {
  EVALUATION: ['تقويم', 'التقويم', 'مستمر', 'التقييم المستمر', 'نشاط', 'مشاركة', 'evaluation', 'controll', 'moyen', 'cc', 'note1', 'eval', 'تقويم مستمر', 'معدل تقويم النشاطات', 'تقويم النشاطات'],
  PRACTICAL: ['أعمال تطبيقية', 'اعمال تطبيقية', 'تطبيقية', 'تعبير شفوي', 'تعبير', 'tp', 'travaux pratiques', 'oral', 'application'],
  QUIZ: ['فرض', 'فردي', 'راقية', 'quiz', 'interrogation', 'test', 'note2', 'وظيفة', 'الفرض', 'فرض محروس', 'الفرض الأول', 'الفرض الثاني', 'معدل الفروض', 'معدل الفروض / 20'],
  EXAM: ['اختبار', 'نهائي', 'فصل', 'exam', 'composition', 'examen', 'note3', 'إختبار', 'الاختبار', 'اختار الفصل', 'الامتحان'],
  AVERAGE: ['المعدل', 'average', 'moyenne', 'moyen', 'معدل المادة', 'المعدل العام'],
  FIRST_NAME: ['الاسم', 'name', 'prenom', 'prénom', 'الإسم', 'اسم'],
  LAST_NAME: ['اللقب', 'last name', 'nom', 'family name', 'لقب'],
  FULL_NAME: ['الاسم و اللقب', 'الاسم واللقب', 'اللقب و الاسم', 'اللقب والاسم', 'اللقب والإسم', 'nom prenom', 'prenom nom', 'nom et prenom', 'full name', 'student', 'تلميذ', 'المتعلم', 'الاسم ولقب', 'الإسم واللقب'],
  NUMBER: ['الرقم التعريفي', 'رقم', 'تسجيل', 'مفتاح', 'id', 'n°', 'number', 'matricule', 'الرقم', 'م', 'ترتيب']
};

const normalizeArabic = (text: string) => {
  return text.toLowerCase()
    .replace(/[أإآا]/g, 'ا')
    .replace(/[يى]/g, 'ي')
    .replace(/[ةه]/g, 'ه')
    .replace(/\s+/g, ' ')
    .trim();
};

const findColumnIndex = (headers: string[], keywords: string[]): number => {
  return headers.findIndex(h => {
    if (!h) return false;
    const cleanH = normalizeArabic(h.toString());
    
    // Exact match first
    if (keywords.some(k => cleanH === normalizeArabic(k))) return true;
    
    // Partial match
    return keywords.some(k => cleanH.includes(normalizeArabic(k)));
  });
};

const parseNumericValue = (val: any): number | undefined => {
  if (val === undefined || val === null || val === '') return undefined;
  if (typeof val === 'number') return val;
  
  const strVal = val.toString().toLowerCase().trim();
  
  // Handle common "Absent" indicators in French/Arabic
  if (strVal === 'abs' || strVal === 'غ' || strVal === 'غائب' || strVal === 'غائب.') return 0;
  
  // Handle strings with commas (common in French/Arabic locales)
  const normalized = strVal.replace(',', '.');
  // Remove any non-numeric characters except the dot
  const cleanNum = normalized.replace(/[^0-9.]/g, '');
  const num = parseFloat(cleanNum);
  return isNaN(num) ? undefined : num;
};

export const excelService = {
  parseStudentExcel: (buffer: ArrayBuffer): Student[] => {
    const workbook = XLSX.read(buffer, { type: 'array' });
    const students: Student[] = [];
    
    workbook.SheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      // sheet_to_json with header: 1 returns an array of arrays
      const rawData = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1, defval: null });
      
      if (rawData.length < 1) return;

      // SPECIFIC MASSAR FORMAT CHECK (Starts at row index 8, specific columns)
      // Massar files often have headers at row 6 or 7, and data at 8.
      if (rawData.length >= 8 && rawData[8] && rawData[8].length >= 8) {
        // Check if row 6 or 7 contains Massar-specific headers, or just assume if it has the right shape
        const isMassar = true; // We will treat it as Massar if we can find typical massar headers
        let potentialHeadersStr = (rawData[6] || []).join(' ') + ' ' + (rawData[7] || []).join(' ');
        
        // Let's refine checks if needed, but since it's an Algerian/Moroccan system, we can just aggressively check if row 8 is a valid student
        const firstStudentRow = rawData[8];
        const isFirstStudentValid = firstStudentRow[0] && firstStudentRow[1] && firstStudentRow[2] && 
            (typeof firstStudentRow[4] === 'number' || typeof firstStudentRow[4] === 'string' || !isNaN(parseFloat(firstStudentRow[4])));
            
        if (potentialHeadersStr.includes('رقم') || potentialHeadersStr.includes('تاريخ') || isFirstStudentValid) {
          
          let detectedClassName = sheetName;
          let detectedSubject = "المادة";
          for (let i = 0; i < 6; i++) {
            const rowStr = (rawData[i] as any[] || []).join(' ');
            const classMatch = rowStr.match(/الفوج التربوي\s*:\s*([^:]+?)(?=\s*مادة|$)/) || rowStr.match(/القسم\s*:\s*([^:]+)/);
            if (classMatch) detectedClassName = classMatch[1].trim();
            const subjectMatch = rowStr.match(/مادة\s*:\s*([^:]+)/);
            if (subjectMatch) detectedSubject = subjectMatch[1].trim();
          }

          let evalIdx = 4;
          let pracIdx = 5;
          let quizIdx = 6;
          let examIdx = 7;
          
          const maxCols = Math.max((rawData[6] as any[] || []).length, (rawData[7] as any[] || []).length);
          const headerRow: string[] = [];
          for (let c = 0; c < maxCols; c++) {
            const h6 = (rawData[6]?.[c] || '').toString().trim();
            const h7 = (rawData[7]?.[c] || '').toString().trim();
            headerRow.push(`${h6} ${h7}`.trim());
          }
           
          const tempEval = findColumnIndex(headerRow, KEYWORDS.EVALUATION);
          const tempPrac = findColumnIndex(headerRow, KEYWORDS.PRACTICAL);
          const tempQuiz = findColumnIndex(headerRow, KEYWORDS.QUIZ);
          const tempExam = findColumnIndex(headerRow, KEYWORDS.EXAM);
          
          // Only apply dynamic indexing if we actually found at least two of the key columns
          // This preserves the default 4,5,6,7 format if headers are completely unreadable
          const foundCols = [tempEval, tempPrac, tempQuiz, tempExam].filter(idx => idx !== -1).length;
          
          if (foundCols >= 2) {
            evalIdx = tempEval;
            pracIdx = tempPrac;
            quizIdx = tempQuiz;
            examIdx = tempExam;
            
            // Re-adjust if quiz equals prac finding
            if (pracIdx === quizIdx && pracIdx !== -1) {
              pracIdx = headerRow.findIndex(h => h.includes('أعمال تطبيقية') || h.includes('تعبير شفوي'));
              quizIdx = headerRow.findIndex(h => h.includes('معدل الفروض') || h.includes('الفرض') || h.includes('فردي'));
            }
          }

          const studentRows = rawData.slice(8);
          studentRows.forEach(row => {
            if (!row || row.length < 3) return; // Skip empty rows
            
            const id = row[0]?.toString() || Math.random().toString(36).substr(2, 9);
            const lastName = row[1]?.toString() || '';
            const firstName = row[2]?.toString() || '';
            const name = `${lastName} ${firstName}`.trim();
            
            if (!name) return;
            
            const dob = row[3]?.toString();
            
            const ev = evalIdx !== -1 ? parseNumericValue(row[evalIdx]) : undefined;
            const pr = pracIdx !== -1 ? parseNumericValue(row[pracIdx]) : undefined;
            const qz = quizIdx !== -1 ? parseNumericValue(row[quizIdx]) : undefined;
            const ex = examIdx !== -1 ? parseNumericValue(row[examIdx]) : undefined;
            
            let total = 0;
            let divisor = 0;
            if (ev !== undefined) { total += ev; divisor++; }
            if (pr !== undefined) { total += pr; divisor++; }
            if (qz !== undefined) { total += qz; divisor++; }
            
            let avg = 0;
            if (ex !== undefined) {
               avg = (total + (ex * 2)) / (divisor + 2);
            } else if (divisor > 0) {
               avg = total / divisor;
            }

            const safeAvg = isNaN(avg) ? 0 : Number(avg.toFixed(2));
            
            const gradeEntry = {
              evaluation: ev,
              practical: pr,
              quiz: qz,
              exam: ex,
              average: safeAvg
            };
            
            let student = students.find(s => s.name === name && s.className === detectedClassName);
            if (!student) {
              student = {
                id,
                name,
                lastName,
                firstName,
                dob,
                className: detectedClassName,
                studentNumber: id,
                grades: {},
                overallAverage: 0,
                observations: row[8]?.toString() || '',
                recommendations: row[9]?.toString() || '',
                deficiencies: []
              };
              students.push(student);
            }
            
            student.grades[detectedSubject] = gradeEntry;
            const allGrades = Object.values(student.grades);
            if (allGrades.length > 0) {
              const sum = allGrades.reduce((a, b) => a + (b.average || 0), 0);
              student.overallAverage = Number((sum / allGrades.length).toFixed(2));
            } else {
              student.overallAverage = 0;
            }
          });
          
          return; // Skip normal finding logic since we matched Massar format
        }
      }
      
      // Find header row dynamically (within first 30 rows to be safe)
      let headerRowIndex = -1;
      let fullNameIndex = -1;
      let firstNameIndex = -1;
      let lastNameIndex = -1;
      let numberIndex = -1;
      let evalIndex = -1;
      let practicalIndex = -1;
      let quizIndex = -1;
      let examIndex = -1;
      let avgColIndex = -1;

      let detectedClassName = sheetName;
      let detectedSubject = "المادة";

      // Try to extract metadata from first 15 rows
      for (let i = 0; i < Math.min(rawData.length, 15); i++) {
        const rowStr = (rawData[i] as any[] || []).join(' ');
        
        // Match Class: "الفوج التربوي : أولى ثانوي جذع مشترك آداب"
        const classMatch = rowStr.match(/الفوج التربوي\s*:\s*([^:]+?)(?=\s*مادة|$)/) || rowStr.match(/القسم\s*:\s*([^:]+)/);
        if (classMatch) detectedClassName = classMatch[1].trim();

        // Match Subject: "مادة : المعلوماتية"
        const subjectMatch = rowStr.match(/مادة\s*:\s*([^:]+)/);
        if (subjectMatch) detectedSubject = subjectMatch[1].trim();
      }

      for (let i = 0; i < Math.min(rawData.length, 30); i++) {
        const potentialHeaders = (rawData[i] as any[] || []).map(h => h?.toString().trim() || '');
        
        fullNameIndex = findColumnIndex(potentialHeaders, KEYWORDS.FULL_NAME);
        firstNameIndex = findColumnIndex(potentialHeaders, KEYWORDS.FIRST_NAME);
        lastNameIndex = findColumnIndex(potentialHeaders, KEYWORDS.LAST_NAME);
        numberIndex = findColumnIndex(potentialHeaders, KEYWORDS.NUMBER);
        evalIndex = findColumnIndex(potentialHeaders, KEYWORDS.EVALUATION);
        practicalIndex = findColumnIndex(potentialHeaders, KEYWORDS.PRACTICAL);
        quizIndex = findColumnIndex(potentialHeaders, KEYWORDS.QUIZ);
        examIndex = findColumnIndex(potentialHeaders, KEYWORDS.EXAM);
        avgColIndex = findColumnIndex(potentialHeaders, KEYWORDS.AVERAGE);

        // Debug check: ensure practical and quiz indices are distinct
        if (practicalIndex === quizIndex && practicalIndex !== -1) {
          practicalIndex = potentialHeaders.findIndex(h => h.includes('أعمال تطبيقية') || h.includes('تعبير شفوي'));
          quizIndex = potentialHeaders.findIndex(h => h.includes('معدل الفروض') || h.includes('الفرض'));
        }
        
        if (fullNameIndex !== -1 || (firstNameIndex !== -1 && lastNameIndex !== -1)) {
          headerRowIndex = i;
          break;
        }
      }
      
      // If no name column found, try to assume the first column is name if it has strings
      if (headerRowIndex === -1 && rawData.length > 0) {
        for (let i = 0; i < Math.min(rawData.length, 5); i++) {
           if (typeof rawData[i]?.[0] === 'string' && rawData[i][0].length > 3) {
              headerRowIndex = i - 1; // Assume headers are right above
              fullNameIndex = 0;
              break;
           }
        }
      }

      if (headerRowIndex === -1 && fullNameIndex === -1 && firstNameIndex === -1 && lastNameIndex === -1) return; 

      const dataRows = rawData.slice(headerRowIndex + 1);
      
      dataRows.forEach((row) => {
        if (!row) return;
        
        let name = "";
        if (fullNameIndex !== -1) {
          name = row[fullNameIndex]?.toString().trim() || "";
        } else if (firstNameIndex !== -1 && lastNameIndex !== -1) {
          const first = row[firstNameIndex]?.toString().trim() || "";
          const last = row[lastNameIndex]?.toString().trim() || "";
          name = `${last} ${first}`.trim();
        } else if (firstNameIndex !== -1) {
          name = row[firstNameIndex]?.toString().trim() || "";
        } else if (lastNameIndex !== -1) {
          name = row[lastNameIndex]?.toString().trim() || "";
        }
        let studentNumber = numberIndex !== -1 ? row[numberIndex]?.toString().trim() || "" : "";
        
        // Skip rows that look like headers or repeat titles
        const isHeaderRow = Object.values(KEYWORDS).flat().some(k => name.toLowerCase() === k.toLowerCase());
        if (isHeaderRow || !name || name.length < 2) return; 
        
        const evaluation = evalIndex !== -1 ? parseNumericValue(row[evalIndex]) : undefined;
        const practical = practicalIndex !== -1 ? parseNumericValue(row[practicalIndex]) : undefined;
        const quiz = quizIndex !== -1 ? parseNumericValue(row[quizIndex]) : undefined;
        const exam = examIndex !== -1 ? parseNumericValue(row[examIndex]) : undefined;
        const sheetAvg = avgColIndex !== -1 ? parseNumericValue(row[avgColIndex]) : undefined;
        
        if (name) {
          const className = detectedClassName || sheetName || "غير مصنف";
          const subjectName = detectedSubject || "المادة";
          
          const hasEval = evaluation !== undefined;
          const hasPrac = practical !== undefined;
          const hasQuiz = quiz !== undefined;
          const hasExam = exam !== undefined;

          const ev = evaluation ?? 0;
          const pr = practical ?? 0;
          const qz = quiz ?? 0;
          const ex = exam ?? 0;
          
          let avg = 0;
          // Algerian Formula Logic:
          // If 3 columns (Eval, TP, Quiz): [(ev + pr + qz) / 3 + (ex * 2)] / 3
          // If 2 columns (Eval, Quiz): [(ev + qz) / 2 + (ex * 2)] / 3
          // If only 1 columns (Eval): [ev + (ex * 2)] / 3
          
          if (hasExam) {
             let total = 0;
             let divisor = 0;
             if (hasEval) { total += ev; divisor++; }
             if (hasPrac) { total += pr; divisor++; }
             if (hasQuiz) { total += qz; divisor++; }
             
             avg = (total + (ex * 2)) / (divisor + 2);
          } else {
             let total = 0;
             let divisor = 0;
             if (hasEval) { total += ev; divisor++; }
             if (hasPrac) { total += pr; divisor++; }
             if (hasQuiz) { total += qz; divisor++; }
             if (divisor > 0) avg = total / divisor;
          }

          // Use average from sheet if it exists and our calculation is far off
          if (sheetAvg !== undefined && (avg === 0 || Math.abs(avg - sheetAvg) > 0.5)) {
            avg = sheetAvg;
          }
          
          const gradeEntry = {
            evaluation: ev,
            practical: pr, // New field
            quiz: qz,
            exam: ex,
            average: Number(avg.toFixed(2))
          };
          
          // Only match student if name AND class match
          let student = students.find(s => s.name === name && s.className === className);
          
          if (!student) {
            student = {
              id: Math.random().toString(36).substr(2, 9),
              name,
              className,
              studentNumber,
              grades: {},
              overallAverage: 0,
              observations: "",
              deficiencies: [],
              recommendations: ""
            };
            students.push(student);
          }
          
          student.grades[subjectName] = gradeEntry;
          const allGrades = Object.values(student.grades);
          if (allGrades.length > 0) {
            const sum = allGrades.reduce((a, b) => a + (b.average || 0), 0);
            student.overallAverage = Number((sum / allGrades.length).toFixed(2));
          } else {
            student.overallAverage = 0;
          }
        }
      });
    });

    // Calculate Ranks PER CLASS
    const classes = Array.from(new Set(students.map(s => s.className)));
    classes.forEach(cls => {
      const classStudents = students.filter(s => s.className === cls);
      const sorted = [...classStudents].sort((a, b) => (b.overallAverage || 0) - (a.overallAverage || 0));
      sorted.forEach((student, index) => {
        const found = students.find(s => s.id === student.id);
        if (found) found.rank = index + 1;
      });
    });
    
    return students;
  },

  exportStudentsToExcel: (students: Student[], className?: string) => {
    // Filter by class if provided
    const dataToExport = className && className !== 'ALL' 
      ? students.filter(s => s.className === className) 
      : students;

    if (dataToExport.length === 0) return;

    const worksheetData = dataToExport.map(student => {
      const mainGrade = Object.values(student.grades)[0] || {};
      return {
        'الرتبة': student.rank || '-',
        'اللقب والاسم': student.name,
        'القسم': student.className,
        'رقم التعريف': student.studentNumber || '-',
        'التقويم': mainGrade.evaluation ?? '-',
        'أعمال تطبيقية': mainGrade.practical ?? '-',
        'معدل الفروض': mainGrade.quiz ?? '-',
        'الاختبار': mainGrade.exam ?? '-',
        'المعدل المادة': mainGrade.average ?? '-',
        'المعدل العام': student.overallAverage?.toFixed(2) ?? '-',
        'التقديرات': student.observations || '-',
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    
    // Add text direction right-to-left
    if (!worksheet['!views']) {
      worksheet['!views'] = [{ rightToLeft: true }];
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, className && className !== 'ALL' ? className : 'جميع الأقسام');

    // Create a Blob and trigger download
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = `نتائج_التلاميذ_${className && className !== 'ALL' ? className : 'الكل'}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
  },

  parseTeachersAndExams: (buffer: ArrayBuffer): { teachers: any[], exams: any[] } => {
    const workbook = XLSX.read(buffer, { type: 'array' });
    let teachers: any[] = [];
    let exams: any[] = [];
    
    return { teachers: [], exams: [] };
  }
};
