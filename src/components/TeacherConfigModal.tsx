import React from 'react';
import { motion } from 'motion/react';
import { X, User as UserIcon, BookOpen, GraduationCap } from 'lucide-react';
import { cn } from '../lib/utils';
import { TeacherConfig } from '../types';

interface TeacherConfigModalProps {
  teacherConfig: TeacherConfig;
  updateTeacherConfig: (config: TeacherConfig) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const TeacherConfigModal = ({ teacherConfig, updateTeacherConfig, onSubmit, onCancel }: TeacherConfigModalProps) => {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-10">
      <div 
        className="absolute inset-0 bg-slate-900/90 backdrop-blur-md"
        onClick={onCancel}
      />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-2xl bg-white dark:bg-[#050505] rounded-[3rem] shadow-2xl p-8 md:p-12 overflow-y-auto max-h-[90vh]"
      >
        <button
          onClick={onCancel}
          className="absolute top-6 left-6 w-10 h-10 bg-slate-100 dark:bg-[#1a1a1a] rounded-full flex items-center justify-center text-slate-500 dark:text-[#a3a3a3] hover:bg-slate-200 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="space-y-4 text-center mb-10">
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter">
            المعلومات المهنية
          </h2>
          <p className="text-sm font-bold text-slate-400 max-w-sm mx-auto">
            الرجاء تأكيد معلوماتك المهنية قبل استخراج التقرير لتظهر بشكل صحيح في الملف.
          </p>
        </div>

        <div className="space-y-8">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">اسم الأستاذ(ة)</label>
              <div className="relative">
                <UserIcon className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                <input 
                  type="text" 
                  value={teacherConfig.name}
                  onChange={(e) => updateTeacherConfig({...teacherConfig, name: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-[#111111] border border-slate-100 dark:border-[#262626] pr-14 pl-12 py-4 rounded-[1.5rem] font-black text-slate-700 dark:text-[#e5e5e5] outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 transition-all"
                  placeholder="مثال: بلحية ياسين"
                />
                {teacherConfig.name && (
                  <button 
                    onClick={() => updateTeacherConfig({...teacherConfig, name: ''})}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-200 hover:bg-slate-300 rounded-full flex items-center justify-center text-slate-500 dark:text-[#a3a3a3] transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">المادة العلمية</label>
              <div className="relative">
                <BookOpen className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                <input 
                  type="text" 
                  value={teacherConfig.subject}
                  onChange={(e) => updateTeacherConfig({...teacherConfig, subject: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-[#111111] border border-slate-100 dark:border-[#262626] pr-14 pl-12 py-4 rounded-[1.5rem] font-black text-slate-700 dark:text-[#e5e5e5] outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 transition-all"
                  placeholder="مثال: الرياضيات"
                />
                {teacherConfig.subject && (
                  <button 
                    onClick={() => updateTeacherConfig({...teacherConfig, subject: ''})}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-200 hover:bg-slate-300 rounded-full flex items-center justify-center text-slate-500 dark:text-[#a3a3a3] transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">المؤسسة التعليمية</label>
            <div className="relative">
              <GraduationCap className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
              <input 
                type="text" 
                value={teacherConfig.institution}
                onChange={(e) => updateTeacherConfig({...teacherConfig, institution: e.target.value})}
                className="w-full bg-slate-50 dark:bg-[#111111] border border-slate-100 dark:border-[#262626] pr-14 pl-12 py-4 rounded-[1.5rem] font-black text-slate-700 dark:text-[#e5e5e5] outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 transition-all"
                placeholder="مثال: ثانوية المتفوقين"
              />
              {teacherConfig.institution && (
                <button 
                  onClick={() => updateTeacherConfig({...teacherConfig, institution: ''})}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-200 hover:bg-slate-300 rounded-full flex items-center justify-center text-slate-500 dark:text-[#a3a3a3] transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">السنة الدراسية</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={teacherConfig.academicYear}
                  onChange={(e) => updateTeacherConfig({...teacherConfig, academicYear: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-[#111111] border border-slate-100 dark:border-[#262626] px-12 py-4 rounded-[1.5rem] font-black text-slate-700 dark:text-[#e5e5e5] outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 transition-all text-center"
                  placeholder="2025/2026"
                />
                {teacherConfig.academicYear && (
                  <button 
                    onClick={() => updateTeacherConfig({...teacherConfig, academicYear: ''})}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-200 hover:bg-slate-300 rounded-full flex items-center justify-center text-slate-500 dark:text-[#a3a3a3] transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">الحساب التلقائي</label>
              <button 
                onClick={() => {
                  updateTeacherConfig({ ...teacherConfig, hasPractical: !teacherConfig.hasPractical });
                }}
                className={cn(
                  "w-full px-6 py-4 rounded-[1.5rem] font-black flex items-center justify-between border-2 transition-all group",
                  teacherConfig.hasPractical ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-slate-50 dark:bg-[#111111] border-slate-100 dark:border-[#262626] text-slate-500 dark:text-[#a3a3a3]"
                )}
              >
                <span>أعمال تطبيقية (أ.ت)</span>
                <div className={cn(
                  "w-12 h-6 rounded-full relative transition-all duration-500",
                  teacherConfig.hasPractical ? "bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "bg-slate-300"
                )}>
                  <div className={cn(
                    "absolute top-1 w-4 h-4 rounded-full bg-white dark:bg-[#050505] transition-all duration-500 shadow-sm",
                    teacherConfig.hasPractical ? "right-1" : "right-7"
                  )} />
                </div>
              </button>
            </div>
          </div>
          
          <div className="pt-4">
             <button
                onClick={onSubmit}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-[1.5rem] text-lg transition-all shadow-lg shadow-emerald-200 active:scale-95"
             >
                تأكيد ومتابعة الطباعة
             </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
