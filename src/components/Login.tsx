import React, { useState } from 'react';
import { Lock, User, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginProps {
  onLogin: (success: boolean) => void;
}

export const Login = ({ onLogin }: LoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default credentials for Professor Belhia Yassin
    if (username === 'belhia' && password === 'yassin2024') {
      onLogin(true);
      setError('');
    } else {
      setError('خطأ في اسم المستخدم أو كلمة المرور. يرجى المحاولة مرة أخرى.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans relative overflow-hidden" dir="rtl">
      {/* Background Decor */}
      <div className="absolute inset-0 dots-bg opacity-[0.2]" />
      <div className="absolute inset-0 mesh-bg opacity-[0.2]" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[3.5rem] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.1)] overflow-hidden border border-white relative z-10"
      >
        <div className="bg-slate-900 p-12 text-center text-white relative">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <GraduationCap size={160} />
          </div>
          <div className="relative z-10 space-y-6">
            <div className="w-24 h-24 bg-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/40">
              <User size={48} className="text-white" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-tighter font-display">منصة EduGrade</h1>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-relaxed">الأستاذ بلحية ياسين</p>
            </div>
          </div>
        </div>

        <div className="p-12 space-y-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest px-1">اسم المستخدم</label>
              <div className="relative">
                <User className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="belhia"
                  className="w-full pr-14 pl-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-400 focus:bg-white transition-all text-right font-bold"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest px-1">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pr-14 pl-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-400 focus:bg-white transition-all text-right font-bold"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-rose-500 text-xs font-black text-center bg-rose-50 py-4 px-6 rounded-2xl border border-rose-100"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              className="w-full py-6 bg-emerald-600 text-white rounded-3xl font-black text-xl hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-200 flex items-center justify-center gap-3 active:scale-95"
            >
              <span>تسجيل الدخول</span>
            </button>
          </form>

          <div className="space-y-4 text-center">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">بيانات الدخول التجريبية</p>
               <p className="text-slate-600 font-mono text-sm mt-1 font-bold">belhia / yassin2024</p>
            </div>
            <p className="text-slate-300 text-[10px] font-black uppercase tracking-widest">EduGrade © 2026 • الأستاذ بلحية ياسين</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
