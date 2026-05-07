import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import * as XLSX from 'xlsx';
import { Upload, FileType, CheckCircle2, FileSpreadsheet } from 'lucide-react';
import { Student } from '../types';
import { cn } from '../lib/utils';
import { excelService } from '../services/excelService';

import { csvService } from '../services/csvService';

interface ExcelImporterProps {
  onDataLoaded: (students: Student[]) => void;
  isLoading?: boolean;
}

export const ExcelImporter = ({ onDataLoaded, isLoading }: ExcelImporterProps) => {
  const { t, i18n } = useTranslation();
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
          alert(t("csv_parse_error", "خطأ في قراءة ملف CSV. يرجى التأكد من التنسيق."));
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
      <div className="bg-white dark:bg-[#050505] border border-slate-200 dark:border-[#404040] rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-10 shadow-2xl space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 dark:border-[#262626] pb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div className={cn(i18n.language === 'ar' ? "text-right" : "text-left")}>
              <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white tracking-tight leading-none">{t("preview_before_import", "معاينة البيانات قبل الاستيراد")}</h3>
              <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                <span>{t("students_detected", "اكتشاف {{count}} تلاميذ في الملف", { count: previewStudents.length })}</span>
                <span className="w-1 h-1 bg-slate-200 rounded-full" />
                <span>{t("review_before_calculation", "يرجى المراجعة قبل الحساب النهائي")}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 sm:flex-none px-6 py-4 bg-slate-50 dark:bg-[#111111] text-slate-500 dark:text-[#a3a3a3] rounded-2xl font-black text-xs hover:bg-slate-100 dark:bg-[#1a1a1a] transition-all border border-slate-100 dark:border-[#262626] disabled:opacity-50"
            >
              {t("cancel_process", "إلغاء العملية")}
            </button>
            <button 
              onClick={handleConfirm}
              disabled={isLoading}
              className="flex-1 sm:flex-none px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>{isLoading ? t("importing", "جاري الاستيراد...") : t("confirm_and_import", "تأكيد واستيراد")}</span>
            </button>
          </div>
        </div>

        <div className="overflow-hidden bg-slate-50/50 rounded-[2rem] border border-slate-100 dark:border-[#262626]">
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full text-right" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
              <thead>
                <tr className="bg-slate-100/50 border-b border-slate-100 dark:border-[#262626] sticky top-0 z-20 font-bold">
                  <th className={cn("px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest", i18n.language === 'ar' ? "text-right" : "text-left")}>{t("student", "تلميذ")}</th>
                  <th className={cn("px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest", i18n.language === 'ar' ? "text-right" : "text-left")}>{t("class_label", "القسم")}</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{t("evaluation", "التقويم")}</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{t("practical_work", "أعمال تطبيقية")}</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{t("quiz", "معدل الفروض")}</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{t("exam", "الاختبار")}</th>
                  <th className="px-6 py-5 text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50/50 text-center">{t("expected_average", "المعدل المتوقع")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {previewStudents.slice(0, 50).map((student, idx) => {
                  const mainGrade = student.grades["المادة"] || Object.values(student.grades)[0] || {};
                  return (
                    <tr key={idx} className="hover:bg-white dark:bg-[#050505] transition-colors">
                      <td className={cn("px-6 py-5 font-black text-slate-700 dark:text-[#e5e5e5] text-sm", i18n.language === 'ar' ? "text-right" : "text-left")}>{student.name}</td>
                      <td className={cn("px-6 py-5 font-bold text-slate-400 text-xs", i18n.language === 'ar' ? "text-right" : "text-left")}>{student.className}</td>
                      <td className="px-6 py-5 font-mono font-bold text-slate-600 dark:text-[#d4d4d4] text-center">{mainGrade.evaluation ?? '-'}</td>
                      <td className="px-6 py-5 font-mono font-bold text-slate-600 dark:text-[#d4d4d4] text-center">{mainGrade.practical ?? '-'}</td>
                      <td className="px-6 py-5 font-mono font-bold text-slate-600 dark:text-[#d4d4d4] text-center">{mainGrade.quiz ?? '-'}</td>
                      <td className="px-6 py-5 font-mono font-bold text-slate-600 dark:text-[#d4d4d4] text-center">{mainGrade.exam ?? '-'}</td>
                      <td className="px-6 py-5 font-mono font-black text-emerald-600 bg-emerald-50/30 text-center">
                        {student.overallAverage?.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className={cn("p-6 bg-slate-50 dark:bg-[#111111] border-t border-slate-100 dark:border-[#262626] text-slate-400 text-[10px] font-black uppercase tracking-widest", i18n.language === 'ar' ? "text-right" : "text-left")}>
            {previewStudents.length > 50 
              ? t("showing_limit", "عرض أول 50 تلميذاً فقط من إجمالي {{count}} تلميذ", { count: previewStudents.length })
              : t("full_list_preview", "إظهار القائمة الكاملة ({{count}} تلميذ) لمراجعتها قبل الحساب النهائي.", { count: previewStudents.length })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#050505] border-2 border-dashed border-slate-200 dark:border-[#404040] rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 flex flex-col items-center justify-center text-center hover:border-emerald-400 transition-all group shadow-sm">
      <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        <Upload className="w-8 h-8 md:w-10 md:h-10 text-emerald-500" />
      </div>
      <h3 className="text-lg md:text-xl font-black text-slate-800 dark:text-white mb-2">{t("upload_excel_or_csv", "رفع ملف إكسل أو CSV")}</h3>
      <p className="text-sm md:text-base text-slate-500 dark:text-[#a3a3a3] max-w-sm mb-8 leading-relaxed font-bold">
        {t("upload_excel_desc", "قم برفع ملف يحتوي على أسماء التلاميذ ونقاطهم. سيرتب التطبيق النتائج ويحللها آلياً.")}
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
        <FileType className="w-5 h-5 transition-transform" />
        <span>{t("choose_excel_file", "اختيار ملف إكسل")}</span>
      </button>

      <div className={cn("mt-8 flex flex-col sm:flex-row items-center gap-4 md:gap-8 text-slate-400 text-[10px] md:text-xs font-black uppercase tracking-widest", i18n.language === 'ar' ? "flex-row-reverse" : "flex-row")}>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>{t("auto_calc_average", "حساب تلقائي للمعدل")}</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>{t("smart_analysis", "تحليل ذكي للنتائج")}</span>
        </div>
      </div>
    </div>
  );
};
