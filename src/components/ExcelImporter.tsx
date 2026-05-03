import React, { useRef } from 'react';
import * as XLSX from 'xlsx';
import { Upload, FileType, CheckCircle2, FileSpreadsheet } from 'lucide-react';
import { Student } from '../types';
import { cn } from '../lib/utils';
import { excelService } from '../services/excelService';

import { csvService } from '../services/csvService';

interface ExcelImporterProps {
  onDataLoaded: (students: Student[]) => void;
}

export const ExcelImporter = ({ onDataLoaded }: ExcelImporterProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewStudents, setPreviewStudents] = React.useState<Student[] | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.name.endsWith('.csv')) {
      csvService.parseMassarCsv(file)
        .then(students => setPreviewStudents(students))
        .catch(err => {
          console.error("Error parsing CSV", err);
          alert("خطأ في قراءة ملف CSV. يرجى التأكد من التنسيق.");
        });
    } else {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        const buffer = evt.target?.result as ArrayBuffer;
        const students = excelService.parseStudentExcel(buffer);
        setPreviewStudents(students);
      };
      reader.readAsArrayBuffer(file);
    }
    // Reset input value so same file can be uploaded again if canceled
    e.target.value = '';
  };

  const handleConfirm = () => {
    if (previewStudents) {
      onDataLoaded(previewStudents);
      setPreviewStudents(null);
    }
  };

  const handleCancel = () => {
    setPreviewStudents(null);
  };

  if (previewStudents) {
    return (
      <div className="bg-white border border-slate-200 rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-10 shadow-2xl space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight leading-none">معاينة البيانات قبل الاستيراد</h3>
              <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                <span>اكتشاف {previewStudents.length} تلاميذ في الملف</span>
                <span className="w-1 h-1 bg-slate-200 rounded-full" />
                <span>يرجى المراجعة قبل الحساب النهائي</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={handleCancel}
              className="flex-1 sm:flex-none px-6 py-4 bg-slate-50 text-slate-500 rounded-2xl font-black text-xs hover:bg-slate-100 transition-all border border-slate-100"
            >
              إلغاء العملية
            </button>
            <button 
              onClick={handleConfirm}
              className="flex-1 sm:flex-none px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>تأكيد واستيراد</span>
            </button>
          </div>
        </div>

        <div className="overflow-hidden bg-slate-50/50 rounded-[2rem] border border-slate-100">
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full text-right" dir="rtl">
              <thead>
                <tr className="bg-slate-100/50 border-b border-slate-100 sticky top-0 z-20 font-bold">
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">تلميذ</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">القسم</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">التقويم</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">أعمال تطبيقية</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">معدل الفروض</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">الاختبار</th>
                  <th className="px-6 py-5 text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50/50 text-center">المعدل المتوقع</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {previewStudents.map((student, idx) => {
                  const mainGrade = student.grades["المادة"] || Object.values(student.grades)[0] || {};
                  return (
                    <tr key={idx} className="hover:bg-white transition-colors">
                      <td className="px-6 py-5 font-black text-slate-700 text-sm">{student.name}</td>
                      <td className="px-6 py-5 font-bold text-slate-400 text-xs">{student.className}</td>
                      <td className="px-6 py-5 font-mono font-bold text-slate-600 text-center">{mainGrade.evaluation ?? '-'}</td>
                      <td className="px-6 py-5 font-mono font-bold text-slate-600 text-center">{mainGrade.practical ?? '-'}</td>
                      <td className="px-6 py-5 font-mono font-bold text-slate-600 text-center">{mainGrade.quiz ?? '-'}</td>
                      <td className="px-6 py-5 font-mono font-bold text-slate-600 text-center">{mainGrade.exam ?? '-'}</td>
                      <td className="px-6 py-5 font-mono font-black text-emerald-600 bg-emerald-50/30 text-center">
                        {student.overallAverage?.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="p-6 text-center bg-slate-50 border-t border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest">
            إظهار القائمة الكاملة ({previewStudents.length} تلميذ) لمراجعتها قبل الحساب النهائي.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 flex flex-col items-center justify-center text-center hover:border-emerald-400 transition-all group shadow-sm">
      <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        <Upload className="w-8 h-8 md:w-10 md:h-10 text-emerald-500" />
      </div>
      <h3 className="text-lg md:text-xl font-black text-slate-800 mb-2">رفع ملف إكسل أو CSV</h3>
      <p className="text-sm md:text-base text-slate-500 max-w-sm mb-8 leading-relaxed font-bold">
        قم برفع ملف يحتوي على أسماء التلاميذ ونقاطهم. سيرتب التطبيق النتائج ويحللها آلياً.
      </p>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept=".xlsx, .xls, .csv"
      />
      
      <button 
        onClick={() => fileInputRef.current?.click()}
        className="w-full sm:w-auto px-8 md:px-10 py-4 mb-4 bg-emerald-600 text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-2xl shadow-emerald-200/50 hover:bg-emerald-700 transition-all active:scale-95"
      >
        <FileType className="w-5 h-5" />
        <span>اختيار ملف إكسل</span>
      </button>

      <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 md:gap-8 text-slate-400 text-[10px] md:text-xs font-black uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>حساب تلقائي للمعدل</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>تحليل ذكي للنتائج</span>
        </div>
      </div>
    </div>
  );
};
