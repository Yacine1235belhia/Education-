const KEYWORDS = {
  EVALUATION: ['تقويم', 'التقويم', 'مستمر', 'التقييم المستمر', 'نشاط', 'مشاركة', 'evaluation', 'controll', 'moyen', 'cc', 'note1', 'eval', 'تقويم مستمر'],
  PRACTICAL: ['أعمال تطبيقية', 'اعمال تطبيقية', 'تطبيقية', 'تعبير شفوي', 'تعبير', 'tp', 'travaux pratiques', 'oral', 'application'],
  QUIZ: ['فرض', 'فردي', 'راقية', 'quiz', 'interrogation', 'test', 'note2', 'وظيفة', 'الفرض', 'فرض محروس', 'الفرض الأول', 'الفرض الثاني', 'معدل الفروض', 'معدل الفروض / 20'],
  EXAM: ['اختبار', 'نهائي', 'فصل', 'exam', 'composition', 'examen', 'note3', 'إختبار', 'الاختبار', 'اختار الفصل', 'الامتحان'],
  AVERAGE: ['المعدل', 'average', 'moyenne', 'moyen', 'معدل المادة', 'المعدل العام'],
  FIRST_NAME: ['الاسم', 'name', 'prenom', 'prénom', 'الإسم', 'اسم'],
  LAST_NAME: ['اللقب', 'last name', 'nom', 'family name', 'لقب'],
  FULL_NAME: ['الاسم و اللقب', 'الاسم واللقب', 'اللقب و الاسم', 'اللقب والاسم', 'اللقب والإسم', 'nom prenom', 'prenom nom', 'nom et prenom', 'full name', 'student', 'تلميذ', 'المتعلم', 'الاسم ولقب', 'الإسم واللقب'],
  NUMBER: ['الرقم التعريفي', 'რقم', 'رقم', 'تسجيل', 'مفتاح', 'id', 'n°', 'number', 'matricule', 'الرقم', 'م', 'ترتيب']
};

const normalizeArabic = (text) => text.toLowerCase().replace(/[أإآا]/g, 'ا').replace(/[يى]/g, 'ي').replace(/[ةه]/g, 'ه').replace(/\s+/g, ' ').trim();

const findColumnIndex = (headers, keywords) => headers.findIndex(h => {
  if (!h) return false;
  const cleanH = normalizeArabic(h.toString());
  if (keywords.some(k => cleanH === normalizeArabic(k))) return true;
  return keywords.some(k => cleanH.includes(normalizeArabic(k)));
});

const rawData = [
  ['الجمهورية الجزائرية الديمقراطية الشعبية'],
  ['وزارة التربية الوطنية'],
  ['مديرية التربية لولاية البيض'],
  ['ثانوية محمد بلخير (البيض)'],
  ['وثيقة حجز النقاط الخاصة بـ: الفصل الثاني السنة الدراسية : 2025-2026 الفوج التربوي : أولى ثانوي جذع مشترك آداب 3 مادة : المعلوماتية'],
  [],
  [],
  ['رقم التعريف', 'اللقب', 'الاسم', 'تاريخ الميلاد', 'التقييم المستمر / 20', 'أعمال تطبيقية أو تعبير شفوي / 20', 'معدل الفروض / 20', 'الاختبار / 20', 'التقديرات', 'درجات'],
  ['11000932010267600', 'العايد', 'حية', '2009-09-15', 15, 15, 12, '8,5', 'نتائج مرضية', 'واصل الاجتهاد'],
  ['11000832010264700', 'العايد', 'محمد سفيان', '2008-09-29', 13, 13, '9,5', '12,5', 'نتائج مرضية', 'واصل الاجتهاد'],
  ['11000932010073200', 'بختي', 'فاطمة آية', '2009-03-24', 14, 14, '6,5', 9, 'نتائج مقبولة', 'مجهودات تحتاج']
];

let headerRowIndex = -1;
let fullNameIndex = -1, firstNameIndex = -1, lastNameIndex = -1;
let numberIndex = -1, evalIndex = -1, practicalIndex = -1, quizIndex = -1, examIndex = -1, avgColIndex = -1;

for (let i = 0; i < Math.min(rawData.length, 30); i++) {
  const potentialHeaders = (rawData[i] || []).map(h => h?.toString().trim() || '');
  fullNameIndex = findColumnIndex(potentialHeaders, KEYWORDS.FULL_NAME);
  firstNameIndex = findColumnIndex(potentialHeaders, KEYWORDS.FIRST_NAME);
  lastNameIndex = findColumnIndex(potentialHeaders, KEYWORDS.LAST_NAME);
  
  if (fullNameIndex !== -1 || (firstNameIndex !== -1 && lastNameIndex !== -1)) {
    headerRowIndex = i;
    numberIndex = findColumnIndex(potentialHeaders, KEYWORDS.NUMBER);
    evalIndex = findColumnIndex(potentialHeaders, KEYWORDS.EVALUATION);
    practicalIndex = findColumnIndex(potentialHeaders, KEYWORDS.PRACTICAL);
    quizIndex = findColumnIndex(potentialHeaders, KEYWORDS.QUIZ);
    examIndex = findColumnIndex(potentialHeaders, KEYWORDS.EXAM);
    avgColIndex = findColumnIndex(potentialHeaders, KEYWORDS.AVERAGE);
    break;
  }
}

console.log("Indexes found:", { headerRowIndex, firstNameIndex, lastNameIndex, evalIndex, practicalIndex, quizIndex, examIndex });
