function normalizeArabic(text) {
  return text.toLowerCase()
    .replace(/[أإآا]/g, 'ا')
    .replace(/[يى]/g, 'ي')
    .replace(/[ةه]/g, 'ه')
    .replace(/\s+/g, ' ')
    .trim();
}

function findColumnIndex(headers, keywords) {
  return headers.findIndex(h => {
    if (!h) return false;
    const cleanH = normalizeArabic(h.toString());
    if (keywords.some(k => cleanH === normalizeArabic(k))) return true;
    return keywords.some(k => cleanH.includes(normalizeArabic(k)));
  });
}

const headers = [
  'رقم التعريف',
  'اللقب',
  'الاسم',
  'تاريخ الميلاد',
  'التقييم المستمر / 20',
  'أعمال تطبيقية أو تعبير شفوي / 20',
  'معدل الفروض / 20',
  'الاختبار / 20',
  'التقديرات',
  'درجات'
];

const EVALUATION = ['تقويم', 'التقويم', 'مستمر', 'التقييم المستمر', 'نشاط', 'مشاركة', 'evaluation', 'controll', 'moyen', 'cc', 'note1', 'eval', 'تقويم مستمر'];
const PRACTICAL = ['أعمال تطبيقية', 'اعمال تطبيقية', 'تطبيقية', 'تعبير شفوي', 'تعبير', 'tp', 'travaux pratiques', 'oral', 'application'];
const QUIZ = ['فرض', 'فردي', 'راقية', 'quiz', 'interrogation', 'test', 'note2', 'وظيفة', 'الفرض', 'فرض محروس', 'الفرض الأول', 'الفرض الثاني', 'معدل الفروض', 'معدل الفروض / 20'];
const EXAM = ['اختبار', 'نهائي', 'فصل', 'exam', 'composition', 'examen', 'note3', 'إختبار', 'الاختبار', 'اختار الفصل', 'الامتحان'];
const AVERAGE = ['المعدل', 'average', 'moyenne', 'moyen', 'معدل المادة', 'المعدل العام'];
const FIRST_NAME = ['الاسم', 'name', 'prenom', 'prénom', 'الإسم', 'اسم'];
const LAST_NAME = ['اللقب', 'last name', 'nom', 'family name', 'لقب'];

console.log("EVAL:", findColumnIndex(headers, EVALUATION)); // Expect 4
console.log("PRAC:", findColumnIndex(headers, PRACTICAL)); // Expect 5
console.log("QUIZ:", findColumnIndex(headers, QUIZ)); // Expect 6
console.log("EXAM:", findColumnIndex(headers, EXAM)); // Expect 7
console.log("AVG:", findColumnIndex(headers, AVERAGE)); // Expect -1
console.log("FIRST:", findColumnIndex(headers, FIRST_NAME)); // Expect 2
console.log("LAST:", findColumnIndex(headers, LAST_NAME)); // Expect 1
