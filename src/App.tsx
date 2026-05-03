import React, { useState, useEffect, useRef } from "react";
import { Layout } from "./components/Layout";
import { ExcelImporter } from "./components/ExcelImporter";
import { GradeTable } from "./components/GradeTable";
import { StudentAnalysis } from "./components/StudentAnalysis";
import { ClassAnalysis } from "./components/ClassAnalysis";
import { Login } from "./components/Login";
import { storageService } from "./services/storageService";
import { Student } from "./types";
import { excelService } from "./services/excelService";
import { PrintableReport } from "./components/PrintableReport";
import { PrintableCertificates } from "./components/PrintableCertificates";
import { useReactToPrint } from "react-to-print";
import {
  Users,
  GraduationCap,
  Award,
  ChartBar,
  TrendingUp,
  TrendingDown,
  UserCheck,
  Plus,
  FileSpreadsheet,
  Settings,
  Download,
  Sparkles,
  AlertCircle,
  ChevronRight,
  User,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "./lib/utils";

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.02 }}
    className="glass-card p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] relative overflow-hidden group transition-all duration-500 border border-slate-100"
  >
    <div className="flex justify-between items-start relative z-10">
      <div className="space-y-2 md:space-y-4">
        <p className="text-slate-400 font-black text-[9px] md:text-[10px] uppercase tracking-widest">
          {title}
        </p>
        <h3 className="text-4xl md:text-6xl font-black text-slate-800 tracking-tighter font-mono leading-none">
          {value}
        </h3>
      </div>
      <div
        className="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl flex items-center justify-center text-white shadow-2xl transition-all duration-500 group-hover:rotate-6"
        style={{
          backgroundColor: color,
          boxShadow: `0 20px 40px -10px ${color}44`,
        }}
      >
        <Icon className="w-6 h-6 md:w-8 md:h-8" />
      </div>
    </div>
    {trend && (
      <div className="mt-8 flex items-center gap-3 relative z-10">
        <div
          className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter font-mono",
            trend > 0
              ? "bg-emerald-50 text-emerald-600"
              : "bg-rose-50 text-rose-600",
          )}
        >
          {trend > 0 ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          <span>%{Math.abs(trend)}</span>
        </div>
        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest opacity-60">
          مقارنة بالفصل الماضي
        </span>
      </div>
    )}
    <Icon className="absolute -bottom-10 -left-10 w-48 h-48 text-slate-900/[0.02] group-hover:scale-110 group-hover:text-slate-900/[0.05] transition-all duration-700 pointer-events-none" />
  </motion.div>
);

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>("");

  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = async () => {
    if (!printRef.current) return;
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.getElementById('content-to-download') || printRef.current;
      const options = {
        margin:       1,
        filename:     `نتائج_القسم_${selectedClass || "الكل"}.pdf`,
        image:        { type: 'jpeg' as const, quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' as const }
      };
      
      html2pdf().set(options).from(element).save();
    } catch (e) {
      console.error("PDF generation failed", e);
    }
  };

  const printCertificatesRef = useRef<HTMLDivElement>(null);
  const handlePrintCertificates = async () => {
    if (!printCertificatesRef.current) return;
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.getElementById('certificates-to-download') || printCertificatesRef.current;
      const options = {
        margin:       0,
        filename:     `شهادات_تقديرية_${selectedClass || "الكل"}.pdf`,
        image:        { type: 'jpeg' as const, quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'landscape' as const }
      };
      
      html2pdf().set(options).from(element).save();
    } catch (e) {
      console.error("PDF generation failed", e);
    }
  };

  useEffect(() => {
    const authStatus = sessionStorage.getItem("edugrade_auth");
    if (authStatus === "true") setIsLoggedIn(true);

    const saved = localStorage.getItem("edugrade_students");
    if (saved) {
      const parsedStudents = JSON.parse(saved);
      setStudents(parsedStudents);
      if (parsedStudents.length > 0) {
        setSelectedClass(parsedStudents[0].className || "");
      }
    }

    const savedTheme = localStorage.getItem("edugrade_theme");
    if (savedTheme)
      document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const changeTheme = (theme: string) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("edugrade_theme", theme);
  };

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsLoggedIn(true);
      sessionStorage.setItem("edugrade_auth", "true");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem("edugrade_auth");
  };

  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearData = () => {
    setShowClearConfirm(true);
  };

  const confirmClearData = () => {
    setStudents([]);
    setSelectedClass("");
    localStorage.removeItem("edugrade_students");
    setActiveTab("dashboard");
    setShowClearConfirm(false);
  };

  const handleDataLoaded = (data: Student[]) => {
    if (data.length === 0) {
      alert(
        "لم يتم العثور على بيانات تلاميذ في الملف. يرجى التأكد من وجود عمود (الاسم واللقب) أو (الاسم) و (اللقب).",
      );
      return;
    }
    setStudents(data);
    try {
      localStorage.setItem("edugrade_students", JSON.stringify(data));
    } catch (e) {
      console.error("Storage full or unavailable:", e);
    }
    if (data.length > 0) {
      const firstClass = data[0].className || "غير مصنف";
      setSelectedClass(firstClass);
    }
    setActiveTab("dashboard");
  };

  const loadSampleData = () => {
    const sampleStudents: Student[] = [
      {
        id: "1",
        name: "أحمد علي",
        className: "3 ثانوي ع ت 1",
        grades: {
          المادة: {
            evaluation: 15,
            practical: 14,
            quiz: 12,
            exam: 14,
            average: 13.8,
          },
        },
        overallAverage: 13.8,
      },
      {
        id: "2",
        name: "سارة بن محمد",
        className: "3 ثانوي ع ت 1",
        grades: {
          المادة: {
            evaluation: 18,
            practical: 19,
            quiz: 17,
            exam: 16,
            average: 16.5,
          },
        },
        overallAverage: 16.5,
      },
      {
        id: "3",
        name: "محمد الأمين",
        className: "3 ثانوي ع ت 1",
        grades: {
          المادة: {
            evaluation: 9,
            practical: 10,
            quiz: 8,
            exam: 10,
            average: 9.3,
          },
        },
        overallAverage: 9.3,
      },
      {
        id: "4",
        name: "ليلى كريم",
        className: "3 ثانوي ع ت 1",
        grades: {
          المادة: {
            evaluation: 14,
            practical: 13,
            quiz: 15,
            exam: 13,
            average: 13.7,
          },
        },
        overallAverage: 13.7,
      },
      {
        id: "5",
        name: "ياسين بلقاسم",
        className: "3 ثانوي ع ت 2",
        grades: {
          المادة: {
            evaluation: 7,
            practical: 8,
            quiz: 9,
            exam: 8,
            average: 8.2,
          },
        },
        overallAverage: 8.2,
      },
      {
        id: "6",
        name: "مريم نور",
        className: "3 ثانوي ع ت 2",
        grades: {
          المادة: {
            evaluation: 19,
            practical: 20,
            quiz: 18,
            exam: 19.5,
            average: 19.1,
          },
        },
        overallAverage: 19.1,
      },
    ];
    setStudents(sampleStudents);
    try {
      localStorage.setItem("edugrade_students", JSON.stringify(sampleStudents));
    } catch (e) {}
    setSelectedClass("3 ثانوي ع ت 1");
    setActiveTab("dashboard");
  };

  const classes = Array.from(
    new Set(students.map((s) => s.className || "غير مصنف")),
  );
  const filteredStudents = (
    selectedClass === "ALL" || !selectedClass
      ? [...students]
      : students.filter((s) => (s.className || "غير مصنف") === selectedClass)
  ).sort((a, b) => (b.overallAverage || 0) - (a.overallAverage || 0));

  const classAverage =
    filteredStudents.length > 0
      ? filteredStudents.reduce((sum, s) => sum + (s.overallAverage || 0), 0) /
        filteredStudents.length
      : 0;

  const successRate =
    filteredStudents.length > 0
      ? (filteredStudents.filter((s) => (s.overallAverage || 0) >= 10).length /
          filteredStudents.length) *
        100
      : 0;

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onLogout={handleLogout}
    >
      {activeTab === "dashboard" && (
        <div className="space-y-12 md:space-y-16">
          <header className="flex flex-col lg:flex-row justify-between items-center lg:items-end gap-10 text-center lg:text-right">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-10">
              <div className="relative group shrink-0">
                <div className="absolute -inset-1 bg-gradient-to-tr from-emerald-600 to-emerald-400 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-[2.5rem] bg-slate-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-2xl">
                  <img
                    src="/professor_belhia.jpg"
                    alt="الأستاذ بلحية ياسين"
                    className="absolute inset-0 w-full h-full object-cover z-10"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex flex-col items-center">
                    <User className="w-16 h-16 text-slate-300" />
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">
                      Photo
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-4 md:space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 mx-auto lg:mx-0">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>مركز تحليل البيانات التعليمية</span>
                </div>
                <h1 className="text-4xl md:text-7xl font-black text-slate-800 tracking-tighter leading-tight md:leading-[0.9] font-display">
                  منصة الأستاذ
                  <br />
                  <span className="text-emerald-600">بلحية ياسين</span>
                </h1>
                <p className="text-lg md:text-xl font-bold text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  نظامكم يرحب بكم. ابدأ بتحليل نتائج التلاميذ عبر رفع كشوف
                  النقاط أو تصفح الإحصائيات الحالية.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              {classes.length > 0 && (
                <div className="relative group w-full">
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full bg-white border border-slate-200 px-8 py-5 md:py-6 rounded-[1.5rem] md:rounded-[2rem] font-black text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/10 appearance-none min-w-[200px] shadow-sm cursor-pointer text-center md:text-right"
                  >
                    <option value="ALL">جميع الأقسام</option>
                    {classes.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ChevronRight className="w-5 h-5 rotate-90" />
                  </div>
                </div>
              )}
              <button
                onClick={() => setActiveTab("import")}
                className="w-full bg-emerald-600 text-white px-10 py-5 md:py-6 rounded-[1.5rem] md:rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-emerald-200/50 hover:bg-emerald-700 transition-all hover:scale-105 active:scale-95 group"
              >
                <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center group-hover:rotate-90 transition-transform duration-500">
                  <Plus className="w-5 h-5" />
                </div>
                <span>رفع كشف جديد</span>
              </button>
            </div>
          </header>

          {filteredStudents.length > 0 ? (
            <div className="space-y-16">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard
                  title="إجمالي التلاميذ (القسم)"
                  value={filteredStudents.length}
                  icon={Users}
                  color="#10b981"
                />
                <StatCard
                  title="المعدل العام (القسم)"
                  value={classAverage.toFixed(2)}
                  icon={GraduationCap}
                  color="#059669"
                  trend={2.4}
                />
                <StatCard
                  title="نسبة النجاح"
                  value={`${successRate.toFixed(1)}%`}
                  icon={TrendingUp}
                  color="#34d399"
                  trend={12}
                />
                <StatCard
                  title="فوق الـ 15"
                  value={
                    filteredStudents.filter(
                      (s) => (s.overallAverage || 0) >= 15,
                    ).length
                  }
                  icon={Award}
                  color="#f59e0b"
                />
              </div>

              <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-start">
                <div className="lg:col-span-8 space-y-6 md:space-y-8">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 sm:px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-6 md:h-10 bg-emerald-600 rounded-full shrink-0" />
                      <h2 className="text-xl md:text-4xl font-black text-slate-800 tracking-tight font-display leading-tight text-center sm:text-right break-words max-w-full">
                        نتائج{" "}
                        <span className="text-emerald-600">
                          {selectedClass === "ALL"
                            ? "جميع الأقسام"
                            : selectedClass}
                        </span>
                      </h2>
                    </div>
                    <button
                      onClick={() => setActiveTab("students")}
                      className="px-4 md:px-6 py-2.5 md:py-3 bg-emerald-50 text-emerald-600 rounded-xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-sm border border-emerald-100 flex items-center gap-2 shrink-0"
                    >
                      <span>مشاهدة القائمة</span>
                      <ChevronRight className="w-4 h-4 rotate-180" />
                    </button>
                  </div>
                  <GradeTable
                    students={filteredStudents.slice(0, 10)}
                    onSelectStudent={setSelectedStudent}
                  />
                </div>

                <div className="lg:col-span-4 space-y-6 md:space-y-8">
                  <div className="flex items-center gap-3 md:gap-4 px-4 h-auto md:h-10 justify-center sm:justify-start">
                    <div className="w-1.5 h-6 md:h-10 bg-rose-500 rounded-full" />
                    <h2 className="text-2xl md:text-4xl font-black text-slate-800 tracking-tighter font-display leading-none">
                      تنبيهات المتابعة
                    </h2>
                  </div>
                  <div className="glass-card p-1 rounded-[2rem] md:rounded-[3rem] shadow-2xl shadow-rose-100/30 overflow-hidden">
                    <div className="p-4 md:p-8 space-y-4 md:space-y-6">
                      {filteredStudents
                        .filter((s) => (s.overallAverage || 0) < 10)
                        .slice(0, 4)
                        .map((s) => (
                          <div
                            key={s.id}
                            className="flex items-center justify-between group cursor-pointer p-4 hover:bg-slate-50 rounded-[1.2rem] md:rounded-[1.5rem] transition-all duration-300 border border-transparent hover:border-slate-100"
                            onClick={() => setSelectedStudent(s)}
                          >
                            <div className="flex items-center gap-4 min-w-0">
                              <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-all duration-500 font-black text-base md:text-xl font-mono">
                                {s.overallAverage?.toFixed(1)}
                              </div>
                              <div className="min-w-0">
                                <p className="font-black text-slate-800 text-sm md:text-lg tracking-tight group-hover:text-emerald-600 transition-colors uppercase truncate">
                                  {s.name}
                                </p>
                                <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                  يحتاج لدعم إضافي
                                </p>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all shrink-0" />
                          </div>
                        ))}
                      {filteredStudents.filter(
                        (s) => (s.overallAverage || 0) < 10,
                      ).length === 0 && (
                        <div className="py-12 text-center space-y-4">
                          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                            <Sparkles className="w-10 h-10" />
                          </div>
                          <p className="font-black text-emerald-600 text-lg">
                            أخبار رائعة! جميع تلاميذك ناجحون.
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="bg-slate-50/50 p-6 border-t border-slate-100 text-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        تحديثات قائمة المتابعة تتم تلقائياً
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <ClassAnalysis
                students={filteredStudents}
                allStudents={students}
              />
            </div>
          ) : (
            <div className="space-y-12">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="py-16 md:py-24 glass-card rounded-[3rem] md:rounded-[4rem] flex flex-col items-center justify-center text-center shadow-2xl space-y-10 px-6 border-2 border-emerald-100/50"
              >
                <div className="flex -space-x-4 items-center mb-4">
                  <div className="relative group shrink-0">
                    <div className="absolute -inset-1 bg-gradient-to-tr from-emerald-600 to-emerald-400 rounded-full blur opacity-25"></div>
                    <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
                      <img
                        src="/professor_belhia.jpg"
                        alt="الأستاذ بلحية ياسين"
                        className="absolute inset-0 w-full h-full object-cover z-10"
                        onError={(e) =>
                          (e.currentTarget.style.display = "none")
                        }
                        referrerPolicy="no-referrer"
                      />
                      <User className="w-10 h-10 md:w-16 md:h-16 text-slate-300" />
                    </div>
                  </div>
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-12 -translate-y-4">
                    <FileSpreadsheet className="w-8 h-8 md:w-10 md:h-10" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h2 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tighter font-display leading-tight">
                    الأستاذ بلحية ياسين - تحليل النتائج التعليمية
                  </h2>
                  <p className="text-xl font-bold text-slate-400 max-w-md mx-auto leading-relaxed">
                    قم برفع ملف نقاط القسم بصيغة الإكسل للبدء في تحليل النتائج
                    أو جرب البيانات التجريبية.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center px-4">
                  <button
                    onClick={() => setActiveTab("import")}
                    className="px-10 py-6 bg-emerald-600 text-white rounded-[1.5rem] md:rounded-[2rem] font-black text-xl shadow-2xl shadow-emerald-200 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    <span>رفع الملف</span>
                    <Plus className="w-6 h-6" />
                  </button>
                  <button
                    onClick={loadSampleData}
                    className="px-10 py-6 bg-white border-2 border-emerald-100 text-emerald-600 rounded-[1.5rem] md:rounded-[2rem] font-black text-xl hover:bg-emerald-50 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-md"
                  >
                    <span>بيانات تجريبية</span>
                    <Sparkles className="w-6 h-6" />
                  </button>
                </div>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    title: "تحليل دقيق",
                    desc: "حساب تلقائي للمعدلات والترتيب ونسب النجاح.",
                    icon: ChartBar,
                  },
                  {
                    title: "تقارير PDF",
                    desc: "توليد تقارير احترافية لكل قسم أو تلميذ بضغطة زر.",
                    icon: Download,
                  },
                  {
                    title: "متابعة ذكية",
                    desc: "تحديد تلقائي للتلاميذ الذين يحتاجون لدعم إضافي.",
                    icon: AlertCircle,
                  },
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * i }}
                    className="glass-card p-10 rounded-[2.5rem] text-center space-y-4"
                  >
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-400 group-hover:text-emerald-500 transition-colors">
                      <feature.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-black text-slate-800">
                      {feature.title}
                    </h3>
                    <p className="text-slate-400 font-bold leading-relaxed">
                      {feature.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "students" && (
        <div className="space-y-8">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 w-full md:w-auto">
              <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tighter">
                تلاميذ {selectedClass}
              </h1>
              {classes.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  {classes.map((cls) => (
                    <button
                      key={cls}
                      onClick={() => setSelectedClass(cls)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                        selectedClass === cls
                          ? "bg-emerald-600 text-white shadow-xl shadow-emerald-200/50"
                          : "bg-white border border-slate-200 text-slate-400 hover:border-emerald-200 hover:text-emerald-600",
                      )}
                    >
                      {cls}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button
                onClick={() => handlePrintCertificates()}
                className="px-6 py-3 bg-blue-50 border border-blue-100 rounded-2xl font-black text-blue-600 hover:bg-blue-100 transition-all flex justify-center items-center gap-2 w-full sm:w-auto"
              >
                <Award className="w-5 h-5 text-blue-500" />
                <span className="hidden sm:inline">شهادات التقدير</span>
              </button>
              <button
                onClick={() => handlePrint()}
                className="px-6 py-3 bg-white border border-slate-200 rounded-2xl font-black text-slate-600 hover:bg-slate-50 transition-all flex justify-center items-center gap-2 w-full sm:w-auto"
              >
                <FileText className="w-5 h-5 text-rose-500" />
                <span className="hidden sm:inline">تحميل كشف (PDF)</span>
              </button>
              <button
                onClick={() =>
                  excelService.exportStudentsToExcel(
                    filteredStudents,
                    selectedClass,
                  )
                }
                className="px-6 py-3 bg-emerald-50 border border-emerald-100 rounded-2xl font-black text-emerald-600 hover:bg-emerald-100 transition-all flex justify-center items-center gap-2 w-full sm:w-auto"
              >
                <Download className="w-5 h-5 text-emerald-500" />
                <span className="hidden sm:inline">تصدير Excel</span>
              </button>
            </div>
          </header>

          <PrintableReport
            ref={printRef}
            students={filteredStudents}
            className={selectedClass}
          />

          <PrintableCertificates
            ref={printCertificatesRef}
            students={filteredStudents}
          />

          <GradeTable
            students={filteredStudents}
            onSelectStudent={setSelectedStudent}
          />
        </div>
      )}

      {activeTab === "import" && (
        <div className="space-y-10 py-6">
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tighter mb-3">
              رفع بيانات التلاميذ
            </h1>
            <p className="text-slate-500 font-bold text-lg">
              يرجى التأكد من أن الملف بصيغة Excel ويحتوي على الأعمدة: الاسم،
              والمواد.
            </p>
          </div>
          <ExcelImporter onDataLoaded={handleDataLoaded} />
        </div>
      )}

      {activeTab === "settings" && (
        <div className="max-w-4xl mx-auto py-20">
          <div className="glass-card rounded-[3rem] p-16 text-center space-y-10 border border-slate-100">
            <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-300 mx-auto">
              <Settings className="w-12 h-12" />
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-black text-slate-800 tracking-tighter">
                الإعدادات والتحكم
              </h1>
              <p className="text-xl font-bold text-slate-400">
                إدارة تفضيلات التطبيق والبيانات المخزنة محلياً.
              </p>
            </div>

            <div className="pt-10 border-t border-slate-100 flex flex-col items-center gap-6">
              <div className="w-full max-w-sm mb-10">
                <p className="font-black text-slate-800 tracking-tight mb-4 text-right">
                  لون التطبيق الأساسي
                </p>
                <div className="flex justify-center gap-4 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                  <button
                    onClick={() => changeTheme("emerald")}
                    className="w-10 h-10 rounded-full bg-emerald-500 hover:scale-110 transition-transform ring-4 ring-emerald-50"
                  ></button>
                  <button
                    onClick={() => changeTheme("blue")}
                    className="w-10 h-10 rounded-full bg-blue-500 hover:scale-110 transition-transform ring-4 ring-blue-50"
                  ></button>
                  <button
                    onClick={() => changeTheme("violet")}
                    className="w-10 h-10 rounded-full bg-violet-500 hover:scale-110 transition-transform ring-4 ring-violet-50"
                  ></button>
                  <button
                    onClick={() => changeTheme("rose")}
                    className="w-10 h-10 rounded-full bg-rose-500 hover:scale-110 transition-transform ring-4 ring-rose-50"
                  ></button>
                </div>
              </div>

              {!showClearConfirm ? (
                <>
                  <button
                    onClick={handleClearData}
                    className="px-10 py-5 bg-rose-50 text-rose-600 rounded-2xl font-black text-sm flex items-center gap-3 hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-95 border border-rose-100 w-full max-w-sm justify-center"
                  >
                    <AlertCircle className="w-5 h-5 ml-2" />
                    <span>مسح جميع بيانات التلاميذ</span>
                  </button>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mt-2">
                    تحذير: هذا الإجراء لا يمكن التراجع عنه.
                  </p>
                </>
              ) : (
                <div className="w-full max-w-sm bg-rose-50 p-6 rounded-3xl border border-rose-100 flex flex-col items-center gap-4 animate-in zoom-in duration-300">
                  <p className="font-black text-rose-600 text-lg">
                    هل أنت متأكد؟
                  </p>
                  <p className="text-sm font-bold text-rose-500/80 text-center mb-2">
                    سيتم حذف جميع سجلات التلاميذ بشكل دائم ولن تتمكن من
                    استعادتها.
                  </p>
                  <div className="flex gap-3 w-full">
                    <button
                      onClick={confirmClearData}
                      className="flex-1 py-3 bg-rose-500 text-white rounded-xl font-black shadow-md hover:bg-rose-600 active:scale-95 transition-all"
                    >
                      تأكيد المسح
                    </button>
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="flex-1 py-3 bg-white text-slate-600 rounded-xl font-black border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {selectedStudent && (
          <StudentAnalysis
            student={selectedStudent}
            onClose={() => setSelectedStudent(null)}
          />
        )}
      </AnimatePresence>
    </Layout>
  );
}
