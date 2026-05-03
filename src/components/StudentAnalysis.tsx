import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, AlertCircle, Lightbulb, User, BookOpen, TrendingUp, Download, Award, ChevronDown, FileText } from 'lucide-react';
import { Student } from '../types';
import { geminiService } from '../services/geminiService';
import { useReactToPrint } from 'react-to-print';
import { PrintableSingleReport } from './PrintableSingleReport';
import { cn } from '../lib/utils';

interface StudentAnalysisProps {
  student: Student;
  onClose: () => void;
}

const getAppreciation = (avg: number) => {
  if (avg === 0) return { text: "في انتظار الحساب...", color: "text-slate-400", bg: "bg-slate-50" };
  if (avg < 5) return { text: "نتائج ضعيفة جداً، يجب تدارك الموقف فوراً", color: "text-rose-600", bg: "bg-rose-50" };
  if (avg < 9.99) return { text: "نتائج غير كافية، بذل مجهود إضافي مطلوب", color: "text-orange-600", bg: "bg-orange-50" };
  if (avg < 11.99) return { text: "نتائج مقبولة، يمكن تحسينها", color: "text-blue-600", bg: "bg-blue-50" };
  if (avg < 14.99) return { text: "نتائج حسنة", color: "text-blue-600", bg: "bg-blue-50" };
  return { text: "نتائج ممتازة، واصل", color: "text-blue-700", bg: "bg-blue-50" };
};

export const StudentAnalysis = ({ student, onClose }: StudentAnalysisProps) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const appreciation = getAppreciation(student.overallAverage || 0);

  const singlePrintRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: singlePrintRef,
    documentTitle: `تحليل_${student.name.replace(/\s+/g, '_')}`,
    pageStyle: `
      @page { size: portrait; margin: 10mm; }
      @media print { body { -webkit-print-color-adjust: exact; } }
    `
  });

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true);
      const result = await geminiService.analyzeStudentPerformance(student);
      setAnalysis(result);
      setLoading(false);
    };
    fetchAnalysis();
  }, [student]);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-[2rem] md:rounded-[3.5rem] w-full max-w-6xl max-h-[94vh] overflow-hidden shadow-[0_40px_140px_-20px_rgba(0,0,0,0.3)] flex flex-col border border-white"
        dir="rtl"
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
            <span className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold w-fit">ملف التلميذ البيداغوجي</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">{student.name}</h2>
            <div className={cn("px-4 py-2 rounded-full text-xs font-bold border flex items-center gap-2", appreciation.bg, appreciation.color, appreciation.bg.replace('50', '200'))}>
               <Sparkles className="w-4 h-4" />
               {appreciation.text}
            </div>
          </div>
          
          <div className="flex items-center gap-4 w-full mt-4 max-w-md mx-auto">
             <button onClick={onClose} className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all shrink-0">
                <X className="w-6 h-6" />
             </button>
             <button 
              onClick={() => handlePrint()}
              className="flex-1 px-6 py-4 bg-[#111827] text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-3 shadow-xl hover:bg-slate-800 transition-all active:scale-95"
             >
               <span className="mb-0.5">طباعة</span>
               <FileText className="w-5 h-5" />
             </button>
          </div>
        </div>

        <PrintableSingleReport ref={singlePrintRef} student={student} analysis={analysis} />

        <div className="flex-1 overflow-y-auto p-0 md:p-10 space-y-0 md:space-y-12">
          {/* Main Calculation Shield */}
          <div className="grid lg:grid-cols-12 gap-0 md:gap-10">
            {/* Calculation & Formula Panel */}
            <div className="lg:col-span-12">
               <div className="bg-blue-600 rounded-none md:rounded-[3rem] px-6 py-10 md:p-10 text-white shadow-2xl flex flex-col items-center justify-center gap-8 relative overflow-hidden">
                  <div className="space-y-4 relative z-10 text-center">
                    <h3 className="text-2xl md:text-3xl font-black tracking-tight">نتيجة الحساب النهائي</h3>
                    <p className="text-sm text-blue-50/90 font-medium max-w-xl mx-auto leading-relaxed">
                      حساب وفق النظام التربوي الجزائري: معدل المادة = (التقويم + أعمال تطبيقية + معدل الفروض + الاختبار × 2) / 5
                      <br/>
                      <span className="opacity-70 text-xs">في حالة غياب بعض العلامات، يتم تعديل القاسم (المجموع) تلقائياً</span>
                    </p>
                  </div>
                  
                  <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 relative z-10 w-full justify-center mt-6">
                    <div className="flex flex-col items-center">
                       <span className="text-xs font-bold opacity-80 mb-2 md:mb-3">رتبة التلميذ</span>
                       <div className="text-5xl md:text-6xl font-black font-mono tracking-tighter text-blue-100">
                          {student.rank}
                       </div>
                    </div>
                    <div className="w-32 md:w-px h-px md:h-16 bg-white/20" />
                    <div className="flex flex-col items-center">
                       <span className="text-xs font-bold opacity-80 mb-2 md:mb-3">المعدل العام</span>
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
                  <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tighter">تفاصيل النقاط المحسوبة</h3>
                </div>
              </div>
              
              <div className="border border-slate-100 rounded-2xl md:rounded-[2.5rem] overflow-hidden bg-white shadow-xl shadow-slate-200/10">
                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-right min-w-[600px]">
                    <thead className="bg-slate-50/50">
                      <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        <th className="px-6 md:px-8 py-5 text-right">المادة</th>
                        <th className="px-4 py-5 text-center">تقويم</th>
                        <th className="px-4 py-5 text-center">أعمال تطبيقية</th>
                        <th className="px-4 py-5 text-center">معدل الفروض</th>
                        <th className="px-4 py-5 text-center">اختبار</th>
                        <th className="px-6 md:px-8 py-5 text-center">معدل المادة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {Object.entries(student.grades).map(([subject, g]) => (
                        <tr key={subject} className="hover:bg-blue-50/30 transition-colors">
                          <td className="px-6 md:px-8 py-4 md:py-6 font-black text-slate-800 text-base md:text-lg leading-tight">{subject}</td>
                          <td className="px-4 py-4 md:py-6 text-center text-slate-500 font-mono font-bold text-base md:text-lg">{g.evaluation ?? '-'}</td>
                          <td className="px-4 py-4 md:py-6 text-center text-slate-500 font-mono font-bold text-base md:text-lg">{g.practical ?? '-'}</td>
                          <td className="px-4 py-4 md:py-6 text-center text-slate-500 font-mono font-bold text-base md:text-lg">{g.quiz ?? '-'}</td>
                          <td className="px-4 py-4 md:py-6 text-center text-slate-500 font-mono font-bold text-base md:text-lg">{g.exam ?? '-'}</td>
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
                         <h4 className="font-black text-slate-800 text-lg">{subject}</h4>
                         <div className={cn(
                           "inline-flex px-3 py-1.5 rounded-xl font-black font-mono text-base",
                           (g.average || 0) >= 10 ? "bg-blue-50 text-blue-600" : "bg-rose-50 text-rose-600"
                         )}>
                           {(g.average || 0).toFixed(2)}
                         </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] text-slate-400 font-bold">تقويم</span>
                          <span className="font-mono font-black text-slate-600">{g.evaluation ?? '-'}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] text-slate-400 font-bold">أعمال تطبيقية</span>
                          <span className="font-mono font-black text-slate-600">{g.practical ?? '-'}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] text-slate-400 font-bold">معدل الفروض</span>
                          <span className="font-mono font-black text-slate-600">{g.quiz ?? '-'}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] text-slate-400 font-bold">اختبار</span>
                          <span className="font-mono font-black text-slate-600">{g.exam ?? '-'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Smart Insight Panel */}
            <div className="lg:col-span-12 flex flex-col gap-6 md:gap-8 px-6 pb-6 md:px-0 md:pb-0">
               <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-1 h-6 md:w-1.5 md:h-8 bg-blue-600 rounded-full" />
                  <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tighter">التحليل البيداغوجي</h3>
                </div>

                <div className="flex-1 bg-slate-900 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 text-white shadow-2xl relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6 md:mb-10">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center text-blue-400">
                        <Sparkles className="w-6 h-6 md:w-7 h-7" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">مساعد الأستاذ بلحية ياسين</span>
                    </div>
                    
                    {loading ? (
                      <div className="flex flex-col items-center justify-center py-16 md:py-20 space-y-6">
                        <div className="relative">
                          <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 md:w-6 h-6 text-blue-400 animate-pulse" />
                          </div>
                        </div>
                        <p className="font-black text-slate-400 tracking-widest text-[10px] uppercase animate-pulse">جاري تحليل النتائج...</p>
                      </div>
                    ) : (
                      <div className="space-y-6 md:space-y-8">
                        <div className="space-y-4 md:space-y-6 text-slate-300 leading-relaxed font-bold text-sm md:text-lg whitespace-pre-line animate-in fade-in slide-in-from-bottom-4 duration-700">
                          {analysis}
                        </div>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(analysis);
                            alert('تم نسخ التحليل إلى الحافظة');
                          }}
                          className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border border-white/5"
                        >
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>نسخ التحليل للنظام</span>
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-600/10 via-transparent to-blue-600/10 opacity-30" />
                </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
