const normalize = (text: string) => text.toLowerCase().replace(/[أإآا]/g, 'ا').replace(/[يى]/g, 'ي').replace(/[ةه]/g, 'ه').replace(/\s+/g, ' ').trim();
const findColumnIndex = (headers: string[], keywords: string[]) => headers.findIndex(h => {
  if (!h) return false;
  const cleanH = normalize(h.toString());
  if (keywords.some(k => cleanH === normalize(k))) return true;
  return keywords.some(k => cleanH.includes(normalize(k)));
});

const KEYWORDS = {
  EVALUATION: ['تقويم', 'التقويم', 'مستمر', 'التقييم المستمر', 'نشاط', 'مشاركة', 'evaluation', 'controll', 'moyen', 'cc', 'note1', 'eval', 'تقويم مستمر', 'معدل تقويم النشاطات', 'تقويم النشاطات'],
  PRACTICAL: ['أعمال تطبيقية', 'اعمال تطبيقية', 'تطبيقية', 'تعبير شفوي', 'تعبير', 'tp', 'travaux pratiques', 'oral', 'application'],
  QUIZ: ['فرض', 'فردي', 'راقية', 'quiz', 'interrogation', 'test', 'note2', 'وظيفة', 'الفرض', 'فرض محروس', 'الفرض الأول', 'الفرض الثاني', 'معدل الفروض', 'معدل الفروض / 20'],
  EXAM: ['اختبار', 'نهائي', 'فصل', 'exam', 'composition', 'examen', 'note3', 'إختبار', 'الاختبار', 'اختار الفصل', 'الامتحان'],
};
const headers = ['تاريخ الميلاد', 'معدل تقويم النشاطات /20', 'الإختبار /20', 'الفرض / 20', 'التقديرات'];
console.log("Eval:", findColumnIndex(headers, KEYWORDS.EVALUATION));
console.log("Quiz:", findColumnIndex(headers, KEYWORDS.QUIZ));
console.log("Exam:", findColumnIndex(headers, KEYWORDS.EXAM));
