import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { X, User, BookOpen, Award } from 'lucide-react';
import { Student, TeacherConfig } from '../types';
import { cn } from '../lib/utils';
import { getFixedPedagogicalAnalysis } from '../services/pedagogicalService';

interface StudentAnalysisProps {
  student: Student;
  onClose: () => void;
  teacherConfig: TeacherConfig;
}

const getAppreciation = (avg: number, t: any) => {
  if (avg === 0) return { text: t("waiting_calculation", "في انتظار الحساب..."), color: "text-slate-400", bg: "bg-slate-50 dark:bg-[#111111]" };
  if (avg < 5) return { text: t("very_weak_results", "نتائج ضعيفة جداً، يجب تدارك الموقف فوراً"), color: "text-rose-600", bg: "bg-rose-50" };
  if (avg < 9.99) return { text: t("insufficient_results", "نتائج غير كافية، بذل مجهود إضافي مطلوب"), color: "text-orange-600", bg: "bg-orange-50" };
  if (avg < 11.99) return { text: t("acceptable_results", "نتائج مقبولة، يمكن تحسينها"), color: "text-blue-600", bg: "bg-blue-50" };
  if (avg < 14.99) return { text: t("good_results", "نتائج حسنة"), color: "text-blue-600", bg: "bg-blue-50" };
  return { text: t("excellent_results", "نتائج ممتازة، واواصل"), color: "text-blue-700", bg: "bg-blue-50" };
};

export const StudentAnalysis = ({ student, onClose, teacherConfig }: StudentAnalysisProps) => {
  const { t, i18n } = useTranslation();
  const appreciation = getAppreciation(student.overallAverage || 0, t);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white dark:bg-[#050505] rounded-[2rem] md:rounded-[3.5rem] w-full max-w-6xl max-h-[94vh] overflow-hidden shadow-[0_40px_140px_-20px_rgba(0,0,0,0.3)] flex flex-col border border-white"
      >
        {/* Top Branding & Info */}
        <div className="p-6 md:p-10 flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 md:w-28 md:h-28 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-blue-500/30">
              <User className="w-12 h-12 md:w-14 md:h-14" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-500 rounded-2xl flex items-center justify-center text-white border-4 border-white shadow-lg">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <span className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold w-fit">{t("student_results", "نتائج التلميذ(ة)")} - {teacherConfig.institution}</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{student.name}</h2>
            <div className={cn("px-4 py-2 rounded-full text-xs font-bold border flex items-center gap-2", appreciation.bg, appreciation.color, appreciation.bg.replace('50', '200'))}>
               {appreciation.text}
            </div>
          </div>
          
          <div className="flex items-center justify-center w-full mt-4">
             <button onClick={onClose} className="p-4 bg-white dark:bg-[#050505] border border-slate-200 dark:border-[#404040] rounded-2xl text-slate-400 hover:text-slate-600 dark:text-[#d4d4d4] hover:bg-slate-50 dark:bg-[#111111] transition-all flex items-center justify-center gap-3">
                <X className="w-6 h-6" />
                <span className="font-bold text-sm">{t("close", "إغلاق")}</span>
             </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-0 md:p-10 space-y-0 md:space-y-12">
          {/* Main Calculation Shield */}
          <div className="grid lg:grid-cols-12 gap-0 md:gap-10">
            {/* Calculation & Formula Panel */}
            <div className="lg:col-span-12">
               <div className="bg-blue-600 rounded-none md:rounded-[3rem] px-6 py-10 md:p-10 text-white shadow-2xl flex flex-col items-center justify-center gap-8 relative overflow-hidden">
                  <div className="space-y-4 relative z-10 text-center">
                    <h3 className="text-2xl md:text-3xl font-black tracking-tight">{t("final_calculation_result", "نتيجة الحساب النهائي")}</h3>
                    <p className="text-sm text-blue-50/90 font-medium max-w-xl mx-auto leading-relaxed">
                      {t("calculation_formula_desc", "حساب وفق النظام التربوي الجزائري: معدل المادة = (التقويم {{practical}} + معدل الفروض + الاختبار × 2) / {{total}}", {
                        practical: teacherConfig.hasPractical ? t("plus_practical", "+ أعمال تطبيقية") : "",
                        total: teacherConfig.hasPractical ? "5" : "4"
                      })}
                      <br/>
                      <span className="opacity-70 text-xs">{t("absent_grade_warning", "في حالة غياب بعض العلامات، يتم تعديل القاسم (المجموع) تلقائياً")}</span>
                    </p>
                  </div>
                  
                  <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 relative z-10 w-full justify-center mt-6">
                    <div className="flex flex-col items-center">
                       <span className="text-xs font-bold opacity-80 mb-2 md:mb-3">{t("student_rank", "رتبة التلميذ")}</span>
                       <div className="text-5xl md:text-6xl font-black font-mono tracking-tighter text-blue-100">
                          {student.rank}
                       </div>
                    </div>
                    <div className="w-32 md:w-px h-px md:h-16 bg-white/20" />
                    <div className="flex flex-col items-center">
                       <span className="text-xs font-bold opacity-80 mb-2 md:mb-3">{t("overall_average", "المعدل العام")}</span>
                       <div className="text-5xl md:text-6xl font-black font-mono tracking-tighter">
                          {student.overallAverage?.toFixed(2)}
                       </div>
                    </div>
                  </div>

                  {/* Decorative */}
                  <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
               </div>
            </div>

            {/* Detailed Table Section */}
            <div className="lg:col-span-12 space-y-6 md:space-y-8 px-6 pb-6 md:px-0 md:pb-0 mt-8 md:mt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-1 h-6 md:w-1.5 md:h-8 bg-blue-600 rounded-full" />
                  <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white tracking-tighter">{t("calculated_grades_details", "تفاصيل النقاط المحسوبة")}: {teacherConfig.subject}</h3>
                </div>
              </div>
              
              <div className="border border-slate-100 dark:border-[#262626] rounded-2xl md:rounded-[2.5rem] overflow-hidden bg-white dark:bg-[#050505] shadow-xl shadow-slate-200/10">
                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-right min-w-[600px]" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
                    <thead className="bg-slate-50/50">
                      <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-[#262626]">
                        <th className={cn("px-6 md:px-8 py-5", i18n.language === 'ar' ? "text-right" : "text-left")}>{t("subject", "المادة")}</th>
                        <th className="px-4 py-5 text-center">{t("evaluation", "التقويم")}</th>
                        {teacherConfig.hasPractical && (
                          <th className="px-4 py-5 text-center">{t("practical_work", "أعمال تطبيقية")}</th>
                        )}
                        <th className="px-4 py-5 text-center">{t("quiz", "معدل الفروض")}</th>
                        <th className="px-4 py-5 text-center">{t("exam", "الاختبار")}</th>
                        <th className="px-6 md:px-8 py-5 text-center">{t("subject_average", "معدل المادة")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {Object.entries(student.grades).map(([subject, g]) => (
                        <tr key={subject} className="hover:bg-blue-50/30 transition-colors">
                          <td className={cn("px-6 md:px-8 py-4 md:py-6 font-black text-slate-800 dark:text-white text-base md:text-lg leading-tight", i18n.language === 'ar' ? "text-right" : "text-left")}>{subject}</td>
                          <td className="px-4 py-4 md:py-6 text-center text-slate-500 dark:text-[#a3a3a3] font-mono font-bold text-base md:text-lg">{g.evaluation ?? '-'}</td>
                          {teacherConfig.hasPractical && (
                            <td className="px-4 py-4 md:py-6 text-center text-slate-500 dark:text-[#a3a3a3] font-mono font-bold text-base md:text-lg">{g.practical ?? '-'}</td>
                          )}
                          <td className="px-4 py-4 md:py-6 text-center text-slate-500 dark:text-[#a3a3a3] font-mono font-bold text-base md:text-lg">{g.quiz ?? '-'}</td>
                          <td className="px-4 py-4 md:py-6 text-center text-slate-500 dark:text-[#a3a3a3] font-mono font-bold text-base md:text-lg">{g.exam ?? '-'}</td>
                          <td className="px-6 md:px-8 py-4 md:py-6 text-center">
                            <div className={cn(
                              "inline-flex px-3 md:px-4 py-1.5 md:py-2 rounded-xl md:rounded-2xl font-black font-mono text-base md:text-lg",
                              (g.average || 0) >= 10 ? "bg-blue-50 text-blue-600" : "bg-rose-50 text-rose-600"
                            )}>
                              {(g.average || 0).toFixed(2)}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden flex flex-col divide-y divide-slate-100">
                  {Object.entries(student.grades).map(([subject, g]) => (
                    <div key={subject} className="p-6 space-y-4 hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center justify-between">
                         <h4 className="font-black text-slate-800 dark:text-white text-lg">{subject}</h4>
                         <div className={cn(
                           "inline-flex px-3 py-1.5 rounded-xl font-black font-mono text-base",
                           (g.average || 0) >= 10 ? "bg-blue-50 text-blue-600" : "bg-rose-50 text-rose-600"
                         )}>
                           {(g.average || 0).toFixed(2)}
                         </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-[#111111] p-4 rounded-2xl border border-slate-100 dark:border-[#262626]">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] text-slate-400 font-bold">{t("evaluation", "التقويم")}</span>
                          <span className="font-mono font-black text-slate-600 dark:text-[#d4d4d4]">{g.evaluation ?? '-'}</span>
                        </div>
                        {teacherConfig.hasPractical && (
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-slate-400 font-bold">{t("practical_work", "أعمال تطبيقية")}</span>
                            <span className="font-mono font-black text-slate-600 dark:text-[#d4d4d4]">{g.practical ?? '-'}</span>
                          </div>
                        )}
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] text-slate-400 font-bold">{t("quiz", "معدل الفروض")}</span>
                          <span className="font-mono font-black text-slate-600 dark:text-[#d4d4d4]">{g.quiz ?? '-'}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] text-slate-400 font-bold">{t("exam", "الاختبار")}</span>
                          <span className="font-mono font-black text-slate-600 dark:text-[#d4d4d4]">{g.exam ?? '-'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pedadogical Analysis Panels */}
            <div className="lg:col-span-12 flex flex-col gap-6 md:gap-8 px-6 pb-6 md:px-0 md:pb-0">
               <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-1 h-6 md:w-1.5 md:h-8 bg-blue-600 rounded-full" />
                  <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white tracking-tighter">{t("pedagogical_analysis", "التحليل البيداغوجي")}</h3>
                </div>

                <div className="grid grid-cols-1 gap-6 md:gap-8">
                  {/* Fixed Offline Analysis */}
                  <div className="bg-white dark:bg-[#050505] rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 border-2 border-slate-100 dark:border-[#262626] shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-6 md:mb-10 text-slate-800 dark:text-white">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-100 dark:bg-[#1a1a1a] rounded-xl md:rounded-2xl flex items-center justify-center text-slate-600 dark:text-[#d4d4d4]">
                          <BookOpen className="w-6 h-6 md:w-7 h-7" />
                        </div>
                        <div className={cn("flex flex-col", i18n.language === 'ar' ? "text-right" : "text-left")}>
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t("certified_auto_analysis", "تحليل تلقائي معتمد")}</span>
                           <span className="text-xs font-bold text-slate-500 dark:text-[#a3a3a3]">{t("offline_works", "(يعمل بدون إنترنت)")}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-6 md:space-y-8">
                        <div className="space-y-4 md:space-y-6 text-slate-600 dark:text-[#d4d4d4] leading-relaxed font-bold text-sm md:text-lg whitespace-pre-line">
                          {getFixedPedagogicalAnalysis(student, teacherConfig, i18n.language)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
