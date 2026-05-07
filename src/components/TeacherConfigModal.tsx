import React from 'react';
import { motion } from 'motion/react';
import { X, User as UserIcon, BookOpen, GraduationCap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';
import { TeacherConfig } from '../types';

interface TeacherConfigModalProps {
  teacherConfig: TeacherConfig;
  updateTeacherConfig: (config: TeacherConfig) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const TeacherConfigModal = ({ teacherConfig, updateTeacherConfig, onSubmit, onCancel }: TeacherConfigModalProps) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-10" dir={isRTL ? 'rtl' : 'ltr'}>
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
          className={cn(
            "absolute top-6 w-10 h-10 bg-slate-100 dark:bg-[#1a1a1a] rounded-full flex items-center justify-center text-slate-500 dark:text-[#a3a3a3] hover:bg-slate-200 transition-colors",
            isRTL ? "left-6" : "right-6"
          )}
        >
          <X className="w-6 h-6" />
        </button>

        <div className="space-y-4 text-center mb-10">
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter">
            {t('professional_info')}
          </h2>
          <p className="text-sm font-bold text-slate-400 max-w-sm mx-auto">
            {t('professional_info_desc')}
          </p>
        </div>

        <div className="space-y-8">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">{t('teacher_name')}</label>
              <div className="relative">
                <UserIcon className={cn("absolute top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5", isRTL ? "right-5" : "left-5")} />
                <input 
                  type="text" 
                  value={teacherConfig.name}
                  onChange={(e) => updateTeacherConfig({...teacherConfig, name: e.target.value})}
                  className={cn(
                    "w-full bg-slate-50 dark:bg-[#111111] border border-slate-100 dark:border-[#262626] py-4 rounded-[1.5rem] font-black text-slate-700 dark:text-[#e5e5e5] outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 transition-all",
                    isRTL ? "pr-14 pl-12" : "pl-14 pr-12"
                  )}
                  placeholder={t('teacher_name_placeholder') as string}
                />
                {teacherConfig.name && (
                  <button 
                    onClick={() => updateTeacherConfig({...teacherConfig, name: ''})}
                    className={cn(
                      "absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-200 hover:bg-slate-300 rounded-full flex items-center justify-center text-slate-500 dark:text-[#a3a3a3] transition-colors",
                      isRTL ? "left-4" : "right-4"
                    )}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">{t('subject')}</label>
              <div className="relative">
                <BookOpen className={cn("absolute top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5", isRTL ? "right-5" : "left-5")} />
                <input 
                  type="text" 
                  value={teacherConfig.subject}
                  onChange={(e) => updateTeacherConfig({...teacherConfig, subject: e.target.value})}
                  className={cn(
                    "w-full bg-slate-50 dark:bg-[#111111] border border-slate-100 dark:border-[#262626] py-4 rounded-[1.5rem] font-black text-slate-700 dark:text-[#e5e5e5] outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 transition-all",
                    isRTL ? "pr-14 pl-12" : "pl-14 pr-12"
                  )}
                  placeholder={t('subject_placeholder') as string}
                />
                {teacherConfig.subject && (
                  <button 
                    onClick={() => updateTeacherConfig({...teacherConfig, subject: ''})}
                    className={cn(
                      "absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-200 hover:bg-slate-300 rounded-full flex items-center justify-center text-slate-500 dark:text-[#a3a3a3] transition-colors",
                      isRTL ? "left-4" : "right-4"
                    )}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">{t('institution')}</label>
            <div className="relative">
              <GraduationCap className={cn("absolute top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5", isRTL ? "right-5" : "left-5")} />
              <input 
                type="text" 
                value={teacherConfig.institution}
                onChange={(e) => updateTeacherConfig({...teacherConfig, institution: e.target.value})}
                className={cn(
                  "w-full bg-slate-50 dark:bg-[#111111] border border-slate-100 dark:border-[#262626] py-4 rounded-[1.5rem] font-black text-slate-700 dark:text-[#e5e5e5] outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 transition-all",
                  isRTL ? "pr-14 pl-12" : "pl-14 pr-12"
                )}
                placeholder={t('institution_placeholder') as string}
              />
              {teacherConfig.institution && (
                <button 
                  onClick={() => updateTeacherConfig({...teacherConfig, institution: ''})}
                  className={cn(
                    "absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-200 hover:bg-slate-300 rounded-full flex items-center justify-center text-slate-500 dark:text-[#a3a3a3] transition-colors",
                    isRTL ? "left-4" : "right-4"
                  )}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">{t('academic_year')}</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={teacherConfig.academicYear}
                  onChange={(e) => updateTeacherConfig({...teacherConfig, academicYear: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-[#111111] border border-slate-100 dark:border-[#262626] px-12 py-4 rounded-[1.5rem] font-black text-slate-700 dark:text-[#e5e5e5] outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 transition-all text-center"
                  placeholder={t('academic_year_placeholder') as string}
                />
                {teacherConfig.academicYear && (
                  <button 
                    onClick={() => updateTeacherConfig({...teacherConfig, academicYear: ''})}
                    className={cn(
                      "absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-200 hover:bg-slate-300 rounded-full flex items-center justify-center text-slate-500 dark:text-[#a3a3a3] transition-colors",
                      isRTL ? "left-4" : "right-4"
                    )}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <div className="pt-4">
             <button
                onClick={onSubmit}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-[1.5rem] text-lg transition-all shadow-lg shadow-emerald-200 active:scale-95"
             >
                {t('confirm_print')}
             </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
