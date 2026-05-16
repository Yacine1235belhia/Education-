const normalize = (text: string) => {
  return text.toLowerCase()
    .replace(/[أإآا]/g, 'ا')
    .replace(/[يى]/g, 'ي')
    .replace(/[ةه]/g, 'ه')
    .replace(/\s+/g, ' ')
    .trim();
};

const findColumnIndex = (headers: string[], keywords: string[]) => {
  return headers.findIndex(h => {
    if (!h) return false;
    const cleanH = normalize(h.toString());
    if (keywords.some(k => cleanH === normalize(k))) return true;
    return keywords.some(k => cleanH.includes(normalize(k)));
  });
};

const KEYWORDS = {
  EVALUATION: ['تقويم', 'التقويم', 'مستمر', 'التقييم المستمر', 'نشاط', 'مشاركة', 'evaluation', 'controll', 'moyen', 'cc', 'note1', 'eval', 'تقويم مستمر', 'معدل تقويم النشاطات', 'تقويم النشاطات'],
  PRACTICAL: ['أعمال تطبيقية', 'اعمال تطبيقية', 'تطبيقية', 'تعبير شفوي', 'تعبير', 'tp', 'travaux pratiques', 'oral', 'application'],
  QUIZ: ['فرض', 'فردي', 'راقية', 'quiz', 'interrogation', 'test', 'note2', 'وظيفة', 'الفرض', 'فرض محروس', 'الفرض الأول', 'الفرض الثاني', 'معدل الفروض', 'معدل الفروض / 20'],
  EXAM: ['اختبار', 'نهائي', 'فصل', 'exam', 'composition', 'examen', 'note3', 'إختبار', 'الاختبار', 'اختار الفصل', 'الامتحان', 'الإختبار /20', 'الإختبار / 20'],
  AVERAGE: ['المعدل', 'average', 'moyenne', 'moyen', 'معدل المادة', 'المعدل العام'],
  NUMBER: ['رقم', 'ر', 'n°', 'num', 'numero', 'الرقم', '#']
};

const headers = ['تاريخ الميلاد', 'معدل تقويم النشاطات /20', 'الفرض / 20', 'الإختبار /20', 'التقديرات'];

console.log("Eval:", findColumnIndex(headers, KEYWORDS.EVALUATION), headers[findColumnIndex(headers, KEYWORDS.EVALUATION)]);
console.log("Practical:", findColumnIndex(headers, KEYWORDS.PRACTICAL), headers[findColumnIndex(headers, KEYWORDS.PRACTICAL)]);
console.log("Quiz:", findColumnIndex(headers, KEYWORDS.QUIZ), headers[findColumnIndex(headers, KEYWORDS.QUIZ)]);
console.log("Exam:", findColumnIndex(headers, KEYWORDS.EXAM), headers[findColumnIndex(headers, KEYWORDS.EXAM)]);
console.log("Average:", findColumnIndex(headers, KEYWORDS.AVERAGE), headers[findColumnIndex(headers, KEYWORDS.AVERAGE)]);
