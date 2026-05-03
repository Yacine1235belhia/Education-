import { excelService } from './src/services/excelService';
import * as XLSX from 'xlsx';

// mock XLSX read
const mockRawData = [
  ['الجمهورية الجزائرية الديمقراطية الشعبية'],
  ['وزارة التربية الوطنية'],
  ['مديرية التربية لولاية البيض'],
  ['ثانوية محمد بلخير (البيض)'],
  ['وثيقة حجز النقاط الخاصة بـ: الفصل الثاني السنة الدراسية : 2025-2026 الفوج التربوي : أولى ثانوي جذع مشترك آداب 3 مادة : المعلوماتية'],
  [],
  ['matricule', 'nom', 'prenom', 'date_n', '01', '02', '03', '09', 'obs', 'cons'],
  ['رقم التعريف', 'اللقب', 'الاسم', 'تاريخ الميلاد', 'التقييم المستمر / 20', 'أعمال تطبيقية أو تعبير شفوي / 20', 'معدل الفروض / 20', 'الاختبار / 20', 'التقديرات', 'درجات'],
  ['11000932010267600', 'العايد', 'حية', '2009-09-15', 15, 15, 12, '8,5', 'نتائج مرضية', 'واصل الاجتهاد'],
  ['11000832010264700', 'العايد', 'محمد سفيان', '2008-09-29', 13, 13, '9,5', '12,5', 'نتائج مرضية', 'واصل الاجتهاد'],
  ['11000932010073200', 'بختي', 'فاطمة آية', '2009-03-24', 14, 14, '6,5', 9, 'نتائج مقبولة', 'مجهودات تحتاج']
];

const mockWorkbook = XLSX.utils.book_new();
const mockWorksheet = XLSX.utils.aoa_to_sheet(mockRawData);
XLSX.utils.book_append_sheet(mockWorkbook, mockWorksheet, 'Sheet1');
const buffer = XLSX.write(mockWorkbook, { type: 'array', bookType: 'xlsx' });

const students = excelService.parseStudentExcel(buffer as ArrayBuffer);
console.log(JSON.stringify(students, null, 2));
