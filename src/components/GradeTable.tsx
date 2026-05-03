import React from "react";
import { Student } from "../types";
import { cn } from "../lib/utils";
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  UserCircle2,
  AlertCircle,
  ChevronRight,
} from "lucide-react";

interface GradeTableProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
}

export const GradeTable = ({ students, onSelectStudent }: GradeTableProps) => {
  return (
    <div className="glass-card rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100">
      <div className="overflow-x-auto">
        <table
          className="w-full text-right border-collapse min-w-full"
          dir="rtl"
        >
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200/50 text-right">
              <th className="px-2 md:px-5 py-3 md:py-4 font-black text-slate-400 text-[8px] md:text-[10px] uppercase tracking-widest max-w-[120px] md:max-w-none">
                التلميذ (الرتبة والاسم)
              </th>
              <th className="px-2 md:px-5 py-3 md:py-4 font-black text-slate-400 text-[8px] md:text-[10px] uppercase tracking-widest text-center whitespace-nowrap">
                المعدل الفصلي
              </th>
              <th className="px-2 md:px-5 py-3 md:py-4 font-black text-slate-400 text-[8px] md:text-[10px] uppercase tracking-widest whitespace-nowrap hidden sm:table-cell">
                توقعات الحالة
              </th>
              <th className="px-2 md:px-5 py-3 md:py-4 font-black text-slate-400 text-[8px] md:text-[10px] uppercase tracking-widest text-center whitespace-nowrap">
                إجراءات
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/50">
            {students.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-32 text-center">
                  <div className="flex flex-col items-center gap-4 opacity-40">
                    <UserCircle2 className="w-16 h-16 text-slate-200" />
                    <p className="font-bold text-slate-400">
                      لا توجد بيانات حالياً. يرجى رفع ملف إكسل.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-emerald-600 hover:text-white transition-all duration-500 group cursor-pointer relative"
                  onClick={() => onSelectStudent(student)}
                >
                  <td className="px-2 md:px-5 py-2 md:py-3">
                    <div className="flex items-center gap-1.5 md:gap-4">
                      {student.rank && student.rank <= 3 ? (
                        <div className="flex items-center gap-1 md:gap-2 min-w-[24px] md:min-w-[40px]">
                          <div
                            className={cn(
                              "w-5 h-5 md:w-8 md:h-8 rounded-[0.3rem] md:rounded-lg flex items-center justify-center font-black text-[9px] md:text-xs shadow-md transition-all duration-500 group-hover:scale-110 group-hover:bg-white group-hover:text-emerald-600",
                              student.rank === 1
                                ? "bg-amber-100 text-amber-600 shadow-amber-100"
                                : student.rank === 2
                                  ? "bg-slate-100 text-slate-600 shadow-slate-100"
                                  : "bg-orange-50 text-orange-600 shadow-orange-100",
                            )}
                          >
                            {student.rank}
                          </div>
                          <Trophy
                            className={cn(
                              "w-3.5 h-3.5 md:w-4 md:h-4 group-hover:text-white transition-colors duration-500",
                              student.rank === 1
                                ? "text-amber-500"
                                : "text-slate-300",
                            )}
                          />
                        </div>
                      ) : (
                        <div className="min-w-[24px] md:min-w-[40px] flex items-center justify-center">
                          <div className="w-5 h-5 md:w-8 md:h-8 rounded-[0.3rem] md:rounded-lg bg-slate-50 flex items-center justify-center font-black font-mono text-[9px] md:text-xs md:text-slate-400 group-hover:bg-white/10 group-hover:text-white transition-all">
                            {student.rank}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-1.5 md:gap-3">
                        <div
                          className={cn(
                            "w-7 h-7 md:w-10 md:h-10 rounded-lg md:rounded-xl shrink-0 flex items-center justify-center transition-all duration-500 border group-hover:border-white/20 shadow-sm",
                            "bg-slate-50 text-slate-400 group-hover:bg-white/10 group-hover:text-white",
                          )}
                        >
                          <UserCircle2 className="w-4 h-4 md:w-6 md:h-6" />
                        </div>
                        <span className="font-black text-slate-800 text-[11px] xs:text-xs sm:text-sm md:text-base tracking-tight group-hover:text-white transition-colors duration-300 whitespace-nowrap overflow-hidden text-ellipsis">
                          {student.name}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 md:px-5 py-2 md:py-3 text-center">
                    <span className="font-black text-sm md:text-xl font-mono tracking-tight group-hover:text-white transition-colors duration-300">
                      {student.overallAverage?.toFixed(2) || "0.00"}
                    </span>
                  </td>
                  <td className="px-2 md:px-5 py-2 md:py-3 hidden sm:table-cell">
                    <div
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2 md:px-3 py-1 md:py-1.5 rounded-lg font-black text-[9px] md:text-[10px] uppercase tracking-widest transition-all duration-500 whitespace-nowrap",
                        (student.overallAverage || 0) >= 10
                          ? "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white"
                          : "bg-rose-50 text-rose-600 group-hover:bg-rose-500 group-hover:text-white",
                      )}
                    >
                      {(student.overallAverage || 0) >= 10 ? (
                        <>
                          <TrendingUp className="w-3 h-3" /> <span>ناجح</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3 h-3" /> <span>راسب</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-3 md:px-5 py-2 md:py-3 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectStudent(student);
                      }}
                      className="p-1.5 md:p-2 bg-white/50 text-slate-400 rounded-lg md:rounded-xl hover:bg-white hover:text-emerald-600 transition-all border border-slate-200/50 group-hover:bg-white group-hover:text-emerald-600 shadow-sm group-hover:shadow-lg group-hover:rotate-6 active:scale-90"
                    >
                      <ChevronRight className="w-4 h-4 md:w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
