import React, { useState } from 'react';
import { Lock, User, GraduationCap, Chrome, BookOpen, PenTool, Calculator, Ruler } from 'lucide-react';
import { motion } from 'motion/react';
import { loginWithGoogle } from '../lib/firebase';

interface LoginProps {
  onLogin: (success: boolean) => void;
}

export const Login = ({ onLogin }: LoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
      onLogin(true);
    } catch (err) {
      setError('فشل في تسجيل الدخول عبر Google. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#111111] p-4 font-sans relative overflow-hidden" dir="rtl">
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
            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-tighter font-display">منصة الأستاذ</h1>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-relaxed">بلحية ياسين</p>
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
                  placeholder="اسم المستخدم"
                  className="w-full pr-14 pl-6 py-5 bg-slate-50 dark:bg-[#111111] border border-slate-100 dark:border-[#262626] rounded-3xl focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-400 focus:bg-white dark:bg-[#050505] transition-all text-right font-bold"
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
                  className="w-full pr-14 pl-6 py-5 bg-slate-50 dark:bg-[#111111] border border-slate-100 dark:border-[#262626] rounded-3xl focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-400 focus:bg-white dark:bg-[#050505] transition-all text-right font-bold"
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

            <div className="flex items-center gap-4 py-2">
              <div className="flex-1 h-px bg-slate-100 dark:bg-[#1a1a1a]" />
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">أو عبر</span>
              <div className="flex-1 h-px bg-slate-100 dark:bg-[#1a1a1a]" />
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-6 bg-white dark:bg-[#050505] border-2 border-slate-100 dark:border-[#262626] text-slate-700 dark:text-[#e5e5e5] rounded-3xl font-black text-lg hover:border-emerald-400 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              <Chrome className="w-6 h-6 text-emerald-600" />
              <span>تسجيل الدخول بـ Google</span>
            </button>
          </form>

          <div className="text-center">
            <p className="text-slate-300 text-[10px] font-black uppercase tracking-widest">© 2026 • الأستاذ بلحية ياسين</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
