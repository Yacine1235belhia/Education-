import React from "react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { Student } from "../types";
import { cn } from "../lib/utils";
import {
  Trophy,
  TrendingUp,
  UserCircle2,
  AlertCircle,
  ChevronRight,
} from "lucide-react";

interface GradeTableProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
}

export const GradeTable = ({ students, onSelectStudent }: GradeTableProps) => {
  const { t, i18n } = useTranslation();
  const [displayCount, setDisplayCount] = React.useState(50);
  
  if (students.length === 0) {
    return (
      <div className="glass-card rounded-[2rem] md:rounded-[3rem] p-12 md:p-32 text-center border border-slate-100 dark:border-[#262626] shadow-2xl shadow-slate-200/50">
        <div className="flex flex-col items-center gap-4 opacity-40">
          <UserCircle2 className="w-16 h-16 text-slate-200" />
          <p className="font-bold text-slate-400">
            {t("no_data_warning", "لا توجد بيانات حالياً. يرجى رفع ملف إكسل.")}
          </p>
        </div>
      </div>
    );
  }

  const visibleStudents = students.slice(0, displayCount);

  return (
    <div className="space-y-3 md:space-y-6">
      {/* Mobile Streamlined List (Matching Screenshot) */}
      <div className="grid grid-cols-1 gap-2.5 md:hidden">
        {visibleStudents.map((student) => (
          <motion.div
            key={student.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectStudent(student)}
            className="flex items-center justify-between p-3 bg-white dark:bg-[#0a0a0a] rounded-3xl border border-slate-50 dark:border-white/5 shadow-sm active:bg-slate-50 dark:active:bg-[#111111] transition-colors"
          >
            {/* Right side: Rank + Avatar + Name */}
            <div className={cn("flex items-center gap-2.5", i18n.language === 'ar' ? "flex-row" : "flex-row")}>
              <div className="flex items-center gap-1 shrink-0">
                <div className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center font-black text-[10px]",
                  student.rank === 1 ? "bg-amber-100 text-amber-600" :
                  student.rank === 2 ? "bg-slate-100 dark:bg-[#1a1a1a] text-slate-500 dark:text-[#a3a3a3]" :
                  student.rank === 3 ? "bg-orange-50 text-orange-600" : "bg-white dark:bg-[#050505] text-slate-400"
                )}>
                  {student.rank}
                </div>
                {student.rank && student.rank <= 3 && (
                  <Trophy className={cn(
                    "w-3.5 h-3.5",
                    student.rank === 1 ? "text-amber-500" : 
                    student.rank === 2 ? "text-slate-300" : "text-orange-300"
                  )} />
                )}
              </div>

              <div className="w-8 h-8 rounded-xl border border-slate-100 dark:border-[#262626] flex items-center justify-center bg-slate-50 dark:bg-[#111111] text-slate-400">
                <UserCircle2 className="w-5 h-5" />
              </div>

              <span className="font-black text-slate-800 dark:text-white text-[13px] tracking-tight truncate max-w-[130px]">
                {student.name}
              </span>
            </div>

            {/* Left side: Grade + Action */}
            <div className="flex items-center gap-3.5">
              <span className="font-black text-base font-mono text-slate-900 dark:text-white leading-none">
                {student.overallAverage?.toFixed(2)}
              </span>
              <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-[#111111] border border-slate-100 dark:border-[#262626] flex items-center justify-center">
                <ChevronRight className={cn("w-4 h-4 text-slate-300", i18n.language === 'ar' ? "rotate-0" : "rotate-180")} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block glass-card rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100 dark:border-[#262626] bg-white dark:bg-[#050505]">
        <div className="overflow-x-auto">
          <table
            className={cn("w-full border-collapse min-w-full", i18n.language === 'ar' ? "text-right" : "text-left")}
          >
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200/50">
                <th className={cn("px-5 py-4 font-black text-slate-400 text-[10px] uppercase tracking-widest", i18n.language === 'ar' ? "text-right" : "text-left")}>
                  {t("table_student_title", "التلميذ (الرتبة والاسم)")}
                </th>
                <th className="px-5 py-4 font-black text-slate-400 text-[10px] uppercase tracking-widest text-center whitespace-nowrap">
                  {t("table_average", "المعدل")}
                </th>
                <th className={cn("px-5 py-4 font-black text-slate-400 text-[10px] uppercase tracking-widest whitespace-nowrap", i18n.language === 'ar' ? "text-right" : "text-left")}>
                  {t("status_prediction", "توقعات الحالة")}
                </th>
                <th className="px-5 py-4 font-black text-slate-400 text-[10px] uppercase tracking-widest text-center whitespace-nowrap">
                  {t("table_actions", "إجراءات")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {visibleStudents.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-emerald-600 hover:text-white transition-all duration-500 group cursor-pointer relative"
                  onClick={() => onSelectStudent(student)}
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-4">
                      {student.rank && student.rank <= 3 ? (
                        <div className="flex items-center gap-2 min-w-[40px]">
                          <div
                            className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shadow-md transition-all duration-500 group-hover:scale-110 group-hover:bg-white dark:bg-[#050505] group-hover:text-emerald-600",
                              student.rank === 1
                                ? "bg-amber-100 text-amber-600 shadow-amber-100"
                                : student.rank === 2
                                  ? "bg-slate-100 dark:bg-[#1a1a1a] text-slate-600 dark:text-[#d4d4d4] shadow-slate-100"
                                  : "bg-orange-50 text-orange-600 shadow-orange-50",
                            )}
                          >
                            {student.rank}
                          </div>
                          <Trophy className={cn("w-4 h-4 group-hover:text-white", student.rank === 1 ? "text-amber-500" : "text-slate-300")} />
                        </div>
                      ) : (
                        <div className="min-w-[40px] flex items-center justify-center">
                          <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-[#111111] flex items-center justify-center font-black font-mono text-xs text-slate-400 group-hover:bg-white/10 group-hover:text-white transition-all">
                            {student.rank}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center transition-all duration-500 border border-slate-100 dark:border-[#262626] group-hover:border-white/20 shadow-sm bg-slate-50 dark:bg-[#111111] text-slate-400 group-hover:bg-white/10 group-hover:text-white">
                          <UserCircle2 className="w-6 h-6" />
                        </div>
                        <span className="font-black text-slate-800 dark:text-white text-base tracking-tight group-hover:text-white transition-colors duration-300">
                          {student.name}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className="font-black text-xl font-mono tracking-tight group-hover:text-white transition-colors duration-300 text-emerald-600">
                      {student.overallAverage?.toFixed(2) || "0.00"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all duration-500",
                        (student.overallAverage || 0) >= 10
                          ? "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white"
                          : "bg-rose-50 text-rose-600 group-hover:bg-rose-500 group-hover:text-white",
                      )}
                    >
                      {(student.overallAverage || 0) >= 10 ? (
                        <><TrendingUp className="w-3 h-3" /> <span>{t("passed", "ناجح")}</span></>
                      ) : (
                        <><AlertCircle className="w-3 h-3" /> <span>{t("failed", "راسب")}</span></>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <button className="p-2 bg-slate-50 dark:bg-[#111111] text-slate-400 rounded-xl hover:bg-white dark:bg-[#050505] hover:text-emerald-600 transition-all border border-slate-200/50 group-hover:bg-white dark:bg-[#050505] group-hover:text-emerald-600 shadow-sm group-hover:shadow-lg active:scale-90">
                      <ChevronRight className={cn("w-5 h-5", i18n.language === 'ar' ? "rotate-0" : "rotate-180")} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {students.length > displayCount && (
        <div className="flex justify-center py-4">
          <button
            onClick={() => setDisplayCount(prev => prev + 50)}
            className="px-10 py-4 bg-white dark:bg-[#050505] border border-slate-200 dark:border-[#404040] text-slate-600 dark:text-[#d4d4d4] rounded-2xl font-black text-sm hover:bg-slate-50 dark:bg-[#111111] transition-all flex items-center gap-2 shadow-sm"
          >
            <span>{t("show_more", "عرض المزيد")} ({students.length - displayCount})</span>
            <ChevronRight className="w-4 h-4 rotate-90" />
          </button>
        </div>
      )}
    </div>
  );
};
