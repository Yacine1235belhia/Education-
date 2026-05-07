import React from "react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  Users,
  FileSpreadsheet,
  Settings,
  User,
  Bell,
  LogOut,
  Plus,
  GraduationCap,
  Download,
} from "lucide-react";
import { cn } from "../lib/utils";

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const NavItem = ({ icon: Icon, label, active, onClick }: NavItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 w-full group",
      active
        ? "bg-emerald-600 text-white shadow-xl shadow-emerald-200/50"
        : "text-slate-500 dark:text-[#a3a3a3] hover:bg-slate-100 dark:bg-[#1a1a1a] hover:text-emerald-600",
    )}
  >
    <Icon
      className={cn(
        "w-6 h-6",
        active ? "text-white" : "text-slate-400 group-hover:text-emerald-600",
      )}
    />
    <span className="font-black tracking-tight">{label}</span>
  </button>
);

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  onPrintMenuClick?: () => void;
}

export const Layout = ({
  children,
  activeTab,
  setActiveTab,
  onLogout,
  onPrintMenuClick,
}: LayoutProps) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  return (
    <div
      className="flex flex-col md:flex-row min-h-screen bg-white dark:bg-[#050505] font-sans text-slate-900 dark:text-white overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Background Decor */}
      <div className="fixed inset-0 dots-bg opacity-[0.2] pointer-events-none" />
      <div className="fixed inset-0 mesh-bg opacity-[0.4] pointer-events-none" />
      <div className="fixed inset-0 paper-pattern opacity-[0.3] pointer-events-none" />
      
      {/* Floating Educational Icons */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 hidden lg:block opacity-[0.05]">
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className={cn("absolute top-20 text-emerald-900", isRTL ? "right-20" : "left-20")}
        >
          <GraduationCap size={180} />
        </motion.div>
        
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className={cn("absolute bottom-20 text-emerald-900", isRTL ? "left-20" : "right-20")}
        >
          <Plus size={160} />
        </motion.div>
        
        <motion.div 
          animate={{ x: [0, 15, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className={cn("absolute top-[40%] text-slate-900 dark:text-white", isRTL ? "left-[10%]" : "right-[10%]")}
        >
          <FileSpreadsheet size={120} />
        </motion.div>
        
        <motion.div 
          animate={{ x: [0, -15, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className={cn("absolute bottom-[40%] text-slate-900 dark:text-white", isRTL ? "right-[10%]" : "left-[10%]")}
        >
          <Settings size={130} />
        </motion.div>
      </div>

      {/* Sidebar - Desktop */}
      <aside className={cn(
        "hidden md:flex flex-col w-72 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-2xl p-8 sticky top-0 h-screen z-20 shadow-[10px_0_40px_-20px_rgba(0,0,0,0.01)]",
        isRTL ? "border-l border-slate-100 dark:border-[#262626]" : "border-r border-slate-100 dark:border-[#262626]"
      )}>
        <div className="flex items-center gap-4 mb-14 px-2">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 via-emerald-500 to-green-700 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-200/40 group transition-all duration-500 hover:rotate-3">
            <LayoutDashboard className="text-white w-8 h-8 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-slate-800 dark:text-white leading-none font-display">
              {t("app_name")}
            </h1>
            <p className="text-[10px] font-black text-slate-400 mt-1.5 uppercase tracking-widest leading-none">
              {t("analysis_results")}
            </p>
          </div>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          <NavItem
            icon={LayoutDashboard}
            label={t("dashboard", "لوحة التحكم")}
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
          />
          <NavItem
            icon={Users}
            label={t("data_entry", "قائمة التلاميذ")}
            active={activeTab === "students"}
            onClick={() => setActiveTab("students")}
          />
          <NavItem
            icon={FileSpreadsheet}
            label={t("analysis", "رفع البيانات")}
            active={activeTab === "import"}
            onClick={() => setActiveTab("import")}
          />
          <NavItem
            icon={FileSpreadsheet}
            label={t("responsible_teacher", "خاصية الأستاذ المسؤول")}
            active={activeTab === "responsible_teacher"}
            onClick={() => setActiveTab("responsible_teacher")}
          />
          <NavItem
            icon={Settings}
            label={t("settings", "الإعدادات")}
            active={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
          />
          {activeTab !== "students" && (
            <NavItem
              icon={Download}
              label={t("print_reports", "تحميل التقارير")}
              active={false}
              onClick={() => onPrintMenuClick?.()}
            />
          )}
        </nav>

        <div className="mt-auto space-y-4">
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-6 py-4 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all duration-300 w-full group border border-transparent hover:border-rose-100 font-bold"
          >
            <LogOut className={cn("w-5 h-5 transition-transform", isRTL ? "group-hover:-translate-x-1" : "group-hover:translate-x-1")} />
            <span className="tracking-tight">{t("logout", "تسجيل الخروج")}</span>
          </button>

          <div className="p-6 bg-slate-900 rounded-[2.5rem] border border-white/5 relative overflow-hidden group shadow-2xl">
            <div className="relative z-10">
              <p className="text-[10px] font-black text-slate-500 dark:text-[#a3a3a3] mb-1.5 uppercase tracking-widest leading-none">
                {t("responsible")}
              </p>
              <p className="text-sm font-black text-white leading-none">
                {t("subject_teacher")}
              </p>
            </div>
            <div className={cn("absolute top-0 p-4 opacity-10 bg-gradient-to-br from-white/20 to-transparent rounded-full -m-4 w-24 h-24", isRTL ? "right-0" : "left-0")} />
            <User className={cn("absolute -bottom-2 w-16 h-16 text-white/5 group-hover:scale-110 transition-transform", isRTL ? "-left-2" : "-right-2")} />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative">
        {/* Header Bar */}
        <header className="hidden md:flex items-center justify-between p-8 bg-white/40 dark:bg-[#050505]/40 backdrop-blur-xl sticky top-0 z-10 border-b border-slate-200/30 dark:border-white/5">
          <div className="relative group">
            <input
              type="text"
              placeholder={t("search_student") as string}
              className={cn(
                "w-80 bg-white dark:bg-[#050505] border border-slate-100 dark:border-[#262626] rounded-2xl py-3 pl-6 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-400 transition-all font-bold placeholder:text-slate-400 shadow-sm",
                isRTL ? "pr-12" : "pl-12"
              )}
            />
            <svg
              className={cn("w-5 h-5 text-slate-400 absolute top-1/2 -translate-y-1/2 group-focus-within:text-emerald-500 transition-colors", isRTL ? "right-4" : "left-4")}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-3 bg-white dark:bg-[#050505] border border-slate-100 dark:border-[#262626] rounded-2xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all relative group shadow-sm">
              <Bell className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              <span className={cn("absolute top-3 w-2 h-2 bg-rose-500 border-2 border-white rounded-full", isRTL ? "left-3" : "right-3")}></span>
            </button>
            <div className="h-10 w-px bg-slate-100 dark:bg-[#1a1a1a] mx-2"></div>
            <div className={cn("flex items-center gap-3", isRTL ? "pl-2" : "pr-2")}>
              <button
                onClick={onLogout}
                className={cn("p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-all flex items-center gap-2 border border-transparent hover:border-rose-100", isRTL ? "ml-4" : "mr-4")}
              >
                <LogOut className="w-5 h-5" />
                <span className="text-xs font-black">{t("logout_small")}</span>
              </button>
              <div>
                <p className="text-sm font-black text-slate-800 dark:text-white">
                  {t("dashboard")}
                </p>
                <div className={cn("flex items-center gap-1.5 mt-0.5", isRTL ? "justify-end" : "justify-start")}>
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                    {t("online")}
                  </p>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl border-2 border-white shadow-xl shadow-slate-200 bg-gradient-to-br from-emerald-50 to-emerald-100 p-0.5">
                <div className="w-full h-full bg-white dark:bg-[#050505] rounded-xl flex items-center justify-center overflow-hidden">
                  <User className="text-emerald-200 w-8 h-8" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Area */}
        <div className="p-3 sm:p-6 md:p-12 pb-32 max-w-7xl mx-auto relative z-[1]">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        </div>
      </main>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-xl border border-slate-100 dark:border-white/10 px-6 py-4 flex justify-between items-center z-50 rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={cn(
            "p-2 transition-transform active:scale-90",
            activeTab === "dashboard" ? "text-emerald-600" : "text-slate-300",
          )}
        >
          <LayoutDashboard className="w-6 h-6" />
        </button>
        <button
          onClick={() => setActiveTab("students")}
          className={cn(
            "p-2 transition-transform active:scale-90",
            activeTab === "students" ? "text-emerald-600" : "text-slate-300",
          )}
        >
          <Users className="w-6 h-6" />
        </button>
        <button
          onClick={() => setActiveTab("import")}
          className={cn(
            "p-3 rounded-2xl text-white -mt-10 shadow-xl transition-transform active:scale-95 border-[3px] border-white",
            activeTab === "import"
              ? "bg-emerald-700"
              : "bg-emerald-600 shadow-emerald-200/40",
          )}
        >
          <Plus className="w-6 h-6" />
        </button>
        {activeTab !== "students" && (
          <button
            onClick={() => onPrintMenuClick?.()}
            className="p-2 transition-transform active:scale-90 text-slate-300 hover:text-emerald-600"
          >
            <Download className="w-6 h-6" />
          </button>
        )}
        <button
          onClick={() => setActiveTab("responsible_teacher")}
          className={cn(
            "p-2 transition-transform active:scale-90",
            activeTab === "responsible_teacher" ? "text-emerald-600" : "text-slate-300",
          )}
        >
          <FileSpreadsheet className="w-6 h-6" />
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={cn(
            "p-2 transition-transform active:scale-90",
            activeTab === "settings" ? "text-emerald-600" : "text-slate-300",
          )}
        >
          <Settings className="w-6 h-6" />
        </button>
        <button
          onClick={onLogout}
          className="p-2 transition-transform active:scale-90 text-rose-400"
        >
          <LogOut className="w-6 h-6" />
        </button>
      </nav>
    </div>
  );
};
