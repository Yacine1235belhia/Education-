import Papa from 'papaparse';
import { Student } from '../types';

export const csvService = {
  parseMassarCsv: (file: File): Promise<Student[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        
        Papa.parse(text, {
          skipEmptyLines: true,
          complete: function(results) {
            const allRows = results.data as any[];
            
            if (allRows.length < 8) {
              resolve([]); // Not enough rows
              return;
            }
            
            // Extract metadata if you need it
            const metadata = allRows.slice(0, 6); 
            
            let className = 'غير مصنف';
            let subjectName = 'المادة';
            
            metadata.forEach((row: any[]) => {
              if (!row) return;
              const rowStr = row.join(' ');
              const classMatch = rowStr.match(/الفوج التربوي\s*:\s*([^:]+?)(?=\s*مادة|$)/) || rowStr.match(/القسم\s*:\s*([^:]+)/);
              if (classMatch) className = classMatch[1].trim();
              const subjectMatch = rowStr.match(/مادة\s*:\s*([^:]+)/);
              if (subjectMatch) subjectName = subjectMatch[1].trim();
            });
            
            // Extract only the student rows (starts at index 8)
            const studentRows = allRows.slice(8);

            const parseValue = (v: any) => {
              if (v === undefined || v === null || v.toString().trim() === '') return NaN;
              const str = v.toString().trim().replace(',', '.').replace(/[^0-9.-]/g, '');
              return parseFloat(str);
            };

            // Map rows to objects
            const students = studentRows
              // remove obviously empty rows
              .filter(row => row && row.length > 2 && row[0])
              .map(row => {
              const ev = parseValue(row[4]);
              const pr = parseValue(row[5]);
              const qz = parseValue(row[6]);
              const ex = parseValue(row[7]);

              // Default Formula: (Eval + TP + Quiz + Exam * 2) / 5
              let avg = 0;
              
              let total = 0;
              let divisor = 0;
              if (!isNaN(ev)) { total += ev; divisor++; }
              if (!isNaN(pr)) { total += pr; divisor++; }
              if (!isNaN(qz)) { total += qz; divisor++; }
              
              if (!isNaN(ex)) {
                 avg = (total + (ex * 2)) / (divisor + 2);
              } else if (divisor > 0) {
                 avg = total / divisor;
              }

              const safeAvg = isNaN(avg) ? 0 : Number(avg.toFixed(2));

              const student: Student = {
                id: row[0] || Math.random().toString(36).substr(2, 9),
                lastName: row[1] || '',
                firstName: row[2] || '',
                name: `${row[1] || ''} ${row[2] || ''}`.trim(),
                dob: row[3],
                studentNumber: row[0] || '',
                className: className,
                grades: {
                  [subjectName]: {
                    evaluation: !isNaN(ev) ? ev : undefined,
                    practical: !isNaN(pr) ? pr : undefined,
                    quiz: !isNaN(qz) ? qz : undefined,
                    exam: !isNaN(ex) ? ex : undefined,
                    average: safeAvg
                  }
                },
                overallAverage: safeAvg,
                observations: row[8] || '',
                deficiencies: [],
                recommendations: row[9] || ''
              };
              return student;
            });

            // Calculate Ranks
            const sorted = [...students].sort((a, b) => (b.overallAverage || 0) - (a.overallAverage || 0));
            sorted.forEach((student, index) => {
              const found = students.find(s => s.id === student.id);
              if (found) found.rank = index + 1;
            });

            resolve(students);
          },
          error: function(err: any) {
            console.error("PapaParse error:", err);
            reject(err);
          }
        });
      };
      
      reader.onerror = () => reject(new Error("Failed to read CSV"));
      reader.readAsText(file);
    });
  }
};
