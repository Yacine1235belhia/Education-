import React, { useState } from 'react';
import { Lock, User, GraduationCap, Chrome, BookOpen, PenTool, Calculator, Ruler, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';

interface LoginProps {
  onLogin: (success: boolean) => void;
}

export const Login = ({ onLogin }: LoginProps) => {

  const { t, i18n } = useTranslation();

  const handleEnter = () => {
    onLogin(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#111111] p-4 font-sans relative overflow-hidden" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Background Decor */}
      <div className="absolute inset-0 dots-bg opacity-40" />
      <div className="absolute inset-0 mesh-bg opacity-60" />
      <div className="absolute inset-0 paper-pattern opacity-20" />
      
      {/* Abstract Pedagogical Elements */}
      <motion.div 
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-[10%] text-emerald-100 opacity-20 hidden md:block"
      >
        <BookOpen size={120} />
      </motion.div>

      <motion.div 
        animate={{ 
          y: [0, 20, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-[10%] text-emerald-100 opacity-20 hidden md:block"
      >
        <Calculator size={140} />
      </motion.div>

      <motion.div 
        animate={{ 
          x: [0, 15, 0],
          rotate: [0, 10, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[40%] right-[5%] text-slate-200 opacity-10 hidden md:block"
      >
        <Ruler size={100} />
      </motion.div>

      <motion.div 
        animate={{ 
          x: [0, -15, 0],
          rotate: [0, -10, 0]
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[40%] left-[5%] text-slate-200 opacity-10 hidden md:block"
      >
        <PenTool size={90} />
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white/90 backdrop-blur-xl rounded-[3.5rem] shadow-[0_40px_100px_-30px_rgba(16,185,129,0.15)] overflow-hidden border border-white/50 relative z-10"
      >
        <div className="bg-slate-900 p-12 text-center text-white relative">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <GraduationCap size={160} />
          </div>
          <div className="relative z-10 space-y-6">
            <div className="w-28 h-28 bg-emerald-100/50 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20 overflow-hidden border-4 border-white/20 relative">
               <GraduationCap className="w-14 h-14 text-emerald-600" />
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-black tracking-tighter font-display">{t('welcome_msg')}</h1>
              <p className="text-emerald-400 text-lg font-bold uppercase tracking-widest leading-relaxed">{t('teacher')}</p>
            </div>
          </div>
        </div>

        <div className="p-12 space-y-10">
          
          <div className="text-center space-y-4">
            <p className="text-slate-500 font-bold leading-relaxed">
              {t('platform_desc')}
            </p>
          </div>

          <button
            onClick={handleEnter}
            className="w-full py-6 bg-emerald-600 text-white rounded-3xl font-black text-xl hover:bg-emerald-700 transition-all shadow-[0_20px_40px_-10px_rgba(16,185,129,0.4)] flex items-center justify-center gap-3 active:scale-95 group"
          >
            <span>{t('enter_platform')}</span>
            <ArrowLeft className={cn("w-6 h-6 transition-transform", i18n.language === 'ar' ? "group-hover:-translate-x-2" : "group-hover:translate-x-2")} />
          </button>

          <div className="text-center">
            <p className="text-slate-300 text-[10px] font-black uppercase tracking-widest">{t('copyright')}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
