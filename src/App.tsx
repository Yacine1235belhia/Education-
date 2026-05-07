import React, { useState, useEffect, useRef } from "react";
import { Layout } from "./components/Layout";
import { ExcelImporter } from "./components/ExcelImporter";
import { GradeTable } from "./components/GradeTable";
import { StudentAnalysis } from "./components/StudentAnalysis";
import { ClassAnalysis } from "./components/ClassAnalysis";
import { ResponsibleTeacherFeature } from "./components/ResponsibleTeacherFeature";
import { Login } from "./components/Login";
import { storageService } from "./services/storageService";
import { Student, TeacherConfig } from "./types";
import { excelService } from "./services/excelService";
import { pdfService } from "./services/pdfService";
import { PrintableReport } from "./components/PrintableReport";
import { PrintableClassesAnalysis } from "./components/PrintableClassesAnalysis";
import { PrintableCertificates } from "./components/PrintableCertificates";
import { TeacherConfigModal } from "./components/TeacherConfigModal";
import { RatingModal } from "./components/RatingModal";
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
  User as UserIcon,
  FileText,
  X,
  RefreshCcw,
  RefreshCw,
  BookOpen,
  Sun,
  Moon,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "./lib/utils";
import { useTranslation } from "react-i18next";

import { auth, db } from "./lib/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import { onSnapshot, collection, getDocs, deleteDoc } from "firebase/firestore";
import { storageService as firebaseStorage } from "./services/storageService";

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => {
  const { t, i18n } = useTranslation();
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="glass-card p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] relative overflow-hidden group transition-all duration-500 border border-slate-100 dark:border-[#262626]"
    >
      <div className="flex justify-between items-start relative z-10">
        <div className="space-y-2 md:space-y-4">
          <p className="text-slate-400 font-black text-[9px] md:text-[10px] uppercase tracking-widest">
            {title}
          </p>
          <h3 className="text-4xl md:text-6xl font-black text-slate-800 dark:text-white tracking-tighter font-mono leading-none">
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
                ? "bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400"
                : "bg-rose-50 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400",
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
            {t("compare_last_term")}
          </span>
        </div>
      )}
      <Icon className={cn("absolute -bottom-10 w-48 h-48 text-slate-900/[0.02] group-hover:scale-110 group-hover:text-slate-900/[0.05] transition-all duration-700 pointer-events-none", i18n.language === 'ar' ? "-left-10" : "-right-10")} />
    </motion.div>
  );
};

export default function App() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  
  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showPrintMenu, setShowPrintMenu] = useState(false);
  const [showTeacherConfigModal, setShowTeacherConfigModal] = useState(false);
  const [pendingPrintAction, setPendingPrintAction] = useState<string | null>(
    null,
  );
  const [previewType, setPreviewType] = useState<
    "report" | "global_analysis" | "certificates"
  >("report");
  const [isDownloading, setIsDownloading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [printingMode, setPrintingMode] = useState<
    "report" | "certificates" | null
  >(null);
  const [teacherConfig, setTeacherConfig] = useState<TeacherConfig>({
    name: "بلحية ياسين",
    institution: "ثانوية المتفوقين",
    subject: "الرياضيات",
    level: "ثانوي",
    hasPractical: false,
    academicYear: "2025/2026",
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("edugrade_theme_mode") === "dark";
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("edugrade_theme_mode", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("edugrade_theme_mode", "light");
    }
  }, [isDarkMode]);

  const executePrintAction = (action: string) => {
    if (action === "menu") {
      setShowPrintMenu(true);
    } else {
      setPreviewType(action as any);
      setShowPreviewModal(true);
    }
  };

  const handlePrintRequest = (action: string) => {
    setPendingPrintAction(action);
    setShowTeacherConfigModal(true);
  };

  const onTeacherConfigSubmit = () => {
    setShowTeacherConfigModal(false);
    if (pendingPrintAction) {
      executePrintAction(pendingPrintAction);
      setPendingPrintAction(null);
    }
  };

  const institutionId = user?.uid || "default";

  const handlePrint = async () => {
    setIsDownloading(true);
    setTimeout(async () => {
      let filename = "";
      let elementId = "";

      if (previewType === "global_analysis") {
        filename = t("analysis_filename");
        elementId = "preview-classes-analysis-id";
      } else if (previewType === "certificates") {
        filename = t("certificates_filename");
        elementId = "certificates-to-download";
      } else {
        filename = t("report_filename", { name: selectedClass || t("section_label") });
        elementId = "preview-report-id";
      }

      try {
        await pdfService.downloadHtmlAsPdf(elementId, filename);
      } catch (err) {
        console.error("PDF generation failed:", err);
      } finally {
        setIsDownloading(false);
      }
    }, 500);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsLoggedIn(true);

        // Ensure institution exists so security rules pass
        await firebaseStorage.ensureInstitution(
          currentUser.uid,
          currentUser.displayName || "مؤسستي",
        );

        // Load teacher config from Firebase
        const cloudConfig = await firebaseStorage.getTeacherConfig(
          currentUser.uid,
        );
        if (cloudConfig) {
          setTeacherConfig(cloudConfig);
          localStorage.setItem(
            "edugrade_teacher_config",
            JSON.stringify(cloudConfig),
          );
        }

        // Sync students from Firebase for this institution
        onSnapshot(
          collection(db, `institutions/${currentUser.uid}/students`),
          (snapshot) => {
            const fbStudents = snapshot.docs.map(
              (doc) => ({ id: doc.id, ...doc.data() }) as Student,
            );
            // If we have data in Firebase, use it
            if (fbStudents.length > 0) {
              setStudents(fbStudents);
              setSelectedClass((prev) => prev || fbStudents[0].className || "");
            } else {
              // If Firebase is empty, but state has students (e.g. from local migration or sample)
              // we might want to keep them or sync them up.
              // For now, if empty in cloud, we keep local until first save.
            }
          },
        );
      } else {
        const authStatus = sessionStorage.getItem("edugrade_auth");
        if (authStatus === "true") setIsLoggedIn(true);
      }
    });

    const saved = localStorage.getItem("edugrade_students");
    if (saved && !user) {
      const parsedStudents = JSON.parse(saved);
      setStudents(parsedStudents);
      if (parsedStudents.length > 0) {
        setSelectedClass(parsedStudents[0].className || "");
      }
    }

    const savedTheme = localStorage.getItem("edugrade_theme");
    if (savedTheme)
      document.documentElement.setAttribute("data-theme", savedTheme);

    const savedConfig = localStorage.getItem("edugrade_teacher_config");
    if (savedConfig) {
      setTeacherConfig(JSON.parse(savedConfig));
    }

    return () => unsubscribe();
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

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const clearAllData = async () => {
    // Clear state
    setStudents([]);
    setSelectedClass("");
    setTeacherConfig({
      name: "",
      institution: "",
      subject: "",
      level: "",
      hasPractical: false,
      academicYear: "",
    });
    
    // Clear local storage
    localStorage.removeItem("edugrade_students");
    localStorage.removeItem("edugrade_teacher_config");
    localStorage.removeItem("edugrade_responsible_students");
    localStorage.removeItem("edugrade_responsible_config");
    localStorage.removeItem("edugrade_theme_mode");
    localStorage.removeItem("edugrade_theme");
    sessionStorage.removeItem("edugrade_auth");
    
    // Clear cookies if any
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Clear Firebase if applicable
    if (user) {
      try {
        const studentRef = collection(db, `institutions/${user.uid}/students`);
        const studentSnap = await getDocs(studentRef);
        await Promise.all(studentSnap.docs.map(doc => deleteDoc(doc.ref)));

        const configRef = collection(db, `institutions/${user.uid}/config`);
        const configSnap = await getDocs(configRef);
        await Promise.all(configSnap.docs.map(doc => deleteDoc(doc.ref)));
      } catch (err) {
        console.error("Error clearing Firebase data:", err);
      }
    }
  };

  const confirmLogout = async () => {
    await clearAllData();
    setShowLogoutConfirm(false);
    setShowRatingModal(true);
  };

  const finalizeLogout = async () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem("edugrade_auth");
    setShowRatingModal(false);
    try {
      const { signOut } = await import("firebase/auth");
      await signOut(auth);
    } catch (e) {
      console.error("Error signing out:", e);
    }
    // Force reload to clear all states and start fresh
    window.location.reload();
  };

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showResetConfigConfirm, setShowResetConfigConfirm] = useState(false);

  const handleClearData = () => {
    setShowClearConfirm(true);
  };

  const confirmClearData = async () => {
    // Keep a copy of teacher config to be absolutely sure
    const currentConfig = { ...teacherConfig };

    setStudents([]);
    setSelectedClass("");
    localStorage.removeItem("edugrade_students");

    // Clear Firebase students if logged in
    if (user) {
      try {
        const q = collection(db, `institutions/${user.uid}/students`);
        const snapshot = await getDocs(q);
        const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
      } catch (error) {
        console.error("Error clearing Firebase data:", error);
      }
    }

    // Ensure teacher config remains unchanged
    setTeacherConfig(currentConfig);

    setActiveTab("dashboard");
    setShowClearConfirm(false);
  };

  const updateTeacherConfig = async (newConfig: TeacherConfig) => {
    // Check if hasPractical changed to trigger recalculation
    const hasPracticalChanged =
      teacherConfig.hasPractical !== newConfig.hasPractical;

    setTeacherConfig(newConfig);
    localStorage.setItem("edugrade_teacher_config", JSON.stringify(newConfig));

    if (user) {
      firebaseStorage.saveTeacherConfig(user.uid, newConfig).catch(e => console.error(e));
    }

    if (hasPracticalChanged) {
      const updatedStudents = students.map((student) => {
        const updatedGrades = { ...student.grades };
        Object.keys(updatedGrades).forEach((subject) => {
          const grade = updatedGrades[subject];
          const ev = grade.evaluation ?? 0;
          const pr = grade.practical ?? 0;
          const qz = grade.quiz ?? 0;
          const ex = grade.exam ?? 0;
          let avg = newConfig.hasPractical
            ? (ev + pr + qz + ex * 2) / 5
            : (ev + qz + ex * 2) / 4;
          updatedGrades[subject] = {
            ...grade,
            average: Number(avg.toFixed(2)),
          };
        });
        const allGrades = Object.values(updatedGrades) as {
          average?: number;
        }[];
        const overallAverage =
          allGrades.length > 0
            ? Number(
                (
                  allGrades.reduce(
                    (a, b: { average?: number }) => a + (b.average || 0),
                    0,
                  ) / allGrades.length
                ).toFixed(2),
              )
            : 0;
        return { ...student, grades: updatedGrades, overallAverage };
      });
      setStudents(updatedStudents);
      if (user) {
        firebaseStorage.saveStudentsBatch(institutionId, updatedStudents).catch(e => console.error(e));
      } else {
        localStorage.setItem(
          "edugrade_students",
          JSON.stringify(updatedStudents),
        );
      }
    }
  };

  const resetTeacherConfig = async () => {
    const defaultConfig: TeacherConfig = {
      name: "",
      institution: "",
      subject: "",
      level: "ثانوي",
      hasPractical: false,
      academicYear: "2025/2026",
    };

    setTeacherConfig(defaultConfig);
    localStorage.setItem(
      "edugrade_teacher_config",
      JSON.stringify(defaultConfig),
    );

    if (user) {
      firebaseStorage.saveTeacherConfig(user.uid, defaultConfig).catch(e => console.error(e));
    }

    setShowResetConfigConfirm(false);
  };

  const handleDataLoaded = async (data: Student[]) => {
    if (data.length === 0) {
      alert(
        "لم يتم العثور على بيانات تلاميذ في الملف. يرجى التأكد من وجود عمود (الاسم واللقب) أو (الاسم) و (اللقب).",
      );
      return;
    }

    setIsUploading(true);
    try {
      // Apply current practical work logic to imported data
      const stabilizedData = data.map((student) => {
        const updatedGrades = { ...student.grades };
        Object.keys(updatedGrades).forEach((subject) => {
          const grade = updatedGrades[subject];
          const ev = grade.evaluation ?? 0;
          const pr = grade.practical ?? 0;
          const qz = grade.quiz ?? 0;
          const ex = grade.exam ?? 0;

          let avg = 0;
          if (teacherConfig.hasPractical) {
            avg = (ev + pr + qz + ex * 2) / 5;
          } else {
            avg = (ev + qz + ex * 2) / 4;
          }
          updatedGrades[subject] = { ...grade, average: Number(avg.toFixed(2)) };
        });

        const allGrades = Object.values(updatedGrades) as { average?: number }[];
        const sum = allGrades.reduce(
          (a, b: { average?: number }) => a + (b.average || 0),
          0,
        );
        const overallAverage =
          allGrades.length > 0 ? Number((sum / allGrades.length).toFixed(2)) : 0;

        return { ...student, grades: updatedGrades, overallAverage };
      });

      setStudents(stabilizedData);

      if (user) {
        firebaseStorage.saveStudentsBatch(institutionId, stabilizedData).catch(e => console.error(e));
      } else {
        localStorage.setItem(
          "edugrade_students",
          JSON.stringify(stabilizedData),
        );
      }

      if (stabilizedData.length > 0) {
        const firstClass = stabilizedData[0].className || "غير مصنف";
        setSelectedClass(firstClass);
      }
      setActiveTab("students");
    } catch (e) {
      console.error("Error loading data:", e);
    } finally {
      setIsUploading(false);
    }
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
    setActiveTab("students");
  };

  const classes = Array.from(
    new Set(students.map((s) => s.className || t("not_classified", "غير مصنف"))),
  );
  const filteredStudents = (
    selectedClass === "ALL" || !selectedClass
      ? [...students]
      : students.filter((s) => (s.className || t("not_classified", "غير مصنف")) === selectedClass)
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

  if (printingMode === "certificates") {
    return (
      <div className="print-mode w-full min-h-screen bg-white dark:bg-[#050505] print:p-0">
        <PrintableCertificates
          students={filteredStudents}
          teacherConfig={teacherConfig}
        />
      </div>
    );
  }

  return (
    <>
      <Layout
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogoutClick}
        onPrintMenuClick={() => handlePrintRequest("menu")}
      >
        {activeTab === "dashboard" && (
          <div className="space-y-12 md:space-y-16">
            <header className="flex flex-col items-center gap-10 text-center">
              <div className="space-y-4 md:space-y-6">
                <h1 className="text-4xl md:text-7xl font-black text-slate-800 dark:text-white tracking-tighter leading-tight md:leading-[0.9] font-display">
                  {t("app_title", "منصة الأستاذ بلحية ياسين")}
                </h1>
                <p className="text-lg md:text-xl font-bold text-slate-400 leading-relaxed max-w-xl mx-auto">
                  {t("platform_desc", "المنصة الشاملة لإدارة وتحليل وتقييم نتائج التلاميذ بكل سهولة واحترافية.")}
                </p>
              </div>

              <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
                {classes.length > 0 && (
                  <div className="relative group w-full">
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className={cn(
                        "w-full bg-white dark:bg-[#050505] border border-slate-200 dark:border-[#404040] px-8 py-5 md:py-6 rounded-[1.5rem] md:rounded-[2rem] font-black text-slate-700 dark:text-[#e5e5e5] outline-none focus:ring-4 focus:ring-emerald-500/10 appearance-none min-w-[200px] shadow-sm cursor-pointer",
                        isRTL ? "text-right" : "text-left"
                      )}
                    >
                      <option value="ALL">{t("all_classes", "جميع الأقسام")}</option>
                      {classes.map((cls) => (
                        <option key={cls} value={cls}>
                          {cls}
                        </option>
                      ))}
                    </select>
                    <div className={cn("absolute top-1/2 -translate-y-1/2 pointer-events-none text-slate-400", isRTL ? "left-6" : "right-6")}>
                      <ChevronRight className={cn("w-5 h-5", isRTL ? "rotate-90" : "rotate-0")} />
                    </div>
                  </div>
                )}
                <button
                  onClick={() => setActiveTab("import")}
                  className="w-full bg-emerald-600 text-white px-10 py-5 md:py-6 rounded-[1.5rem] md:rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-emerald-200/50 hover:bg-emerald-700 transition-all hover:scale-105 active:scale-95 group disabled:opacity-50"
                  disabled={isUploading}
                >
                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center group-hover:rotate-90 transition-transform duration-500">
                    {isUploading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                  </div>
                  <span>{isUploading ? t("processing_report", "جاري معالجة التقرير...") : t("upload_students_data", "رفع بيانات التلاميذ")}</span>
                </button>

                {students.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full mt-2"
                  >
                    {!showClearConfirm ? (
                      <button
                        onClick={handleClearData}
                        className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-2xl font-bold text-sm hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-all group"
                      >
                        <Trash2 className="w-4 h-4 group-hover:shake" />
                        <span>{t("cancel_process", "إلغاء العملية")}</span>
                      </button>
                    ) : (
                      <div className="bg-rose-50 dark:bg-rose-950/30 rounded-2xl p-4 border border-rose-100 dark:border-rose-900/50 space-y-3">
                        <p className="font-black text-rose-600 dark:text-rose-400 text-xs text-center">
                          {t("review_before_calculation", "يرجى المراجعة قبل الحساب النهائي")}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={confirmClearData}
                            className="flex-1 py-2 bg-rose-600 text-white rounded-xl font-black text-xs hover:bg-rose-700 transition-all"
                          >
                            {t("confirm_and_import", "تأكيد واستيراد")}
                          </button>
                          <button
                            onClick={() => setShowClearConfirm(false)}
                            className="flex-1 py-2 bg-white dark:bg-[#050505] text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 rounded-xl font-black text-xs"
                          >
                            {t("cancel_process", "إلغاء العملية")}
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </header>

            {filteredStudents.length > 0 ? (
              <div className="space-y-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 px-2 md:px-0">
                  <StatCard
                    title={t("all_classes", "جميع الأقسام")}
                    value={filteredStudents.length}
                    icon={Users}
                    color="#10b981"
                  />
                  <StatCard
                    title={t("overall_average", "المعدل العام")}
                    value={classAverage.toFixed(2)}
                    icon={GraduationCap}
                    color="#059669"
                    trend={2.4}
                  />
                  <StatCard
                    title={t("success_rate", "نسبة النجاح")}
                    value={`${successRate.toFixed(1)}%`}
                    icon={TrendingUp}
                    color="#34d399"
                    trend={12}
                  />
                  <StatCard
                    title={t("excellent_range", "ممتاز (-15)")}
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
                        <h2 className="text-xl md:text-4xl font-black text-slate-800 dark:text-white tracking-tight font-display leading-tight text-center sm:text-right break-words max-w-full">
                          {t("student_results", "نتائج التلميذ(ة)")}{" "}
                          <span className="text-emerald-600">
                            {selectedClass === "ALL"
                              ? t("all_classes", "جميع الأقسام")
                              : selectedClass}
                          </span>
                        </h2>
                      </div>
                      <button
                        onClick={() => setActiveTab("students")}
                        className="px-4 md:px-6 py-2.5 md:py-3 bg-emerald-50 text-emerald-600 rounded-xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-sm border border-emerald-100 flex items-center gap-2 shrink-0"
                      >
                        <span>{t("show_more", "عرض المزيد")}</span>
                        <ChevronRight className={cn("w-4 h-4", i18n.language === 'ar' ? "rotate-180" : "rotate-0")} />
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
                      <h2 className="text-2xl md:text-4xl font-black text-slate-800 dark:text-white tracking-tighter font-display leading-none">
                        {t("status_prediction", "توقعات الحالة")}
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
                              className="flex items-center justify-between group cursor-pointer p-4 hover:bg-slate-50 dark:bg-[#111111] rounded-[1.2rem] md:rounded-[1.5rem] transition-all duration-300 border border-transparent hover:border-slate-100 dark:border-[#262626]"
                              onClick={() => setSelectedStudent(s)}
                            >
                              <div className="flex items-center gap-4 min-w-0">
                                <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-all duration-500 font-black text-base md:text-xl font-mono">
                                  {s.overallAverage?.toFixed(1)}
                                </div>
                                <div className="min-w-0">
                                  <p className={cn("font-black text-slate-800 dark:text-white text-sm md:text-lg tracking-tight group-hover:text-emerald-600 transition-colors uppercase truncate", isRTL ? "text-right" : "text-left")}>
                                    {s.name}
                                  </p>
                                  <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                    {t("insufficient_results", "نتائج غير كافية، بذل مجهود إضافي مطلوب")}
                                  </p>
                                </div>
                              </div>
                              <ChevronRight className={cn("w-4 h-4 md:w-5 md:h-5 text-slate-300 group-hover:text-emerald-600 transition-all shrink-0", i18n.language === 'ar' ? "group-hover:translate-x-1" : "group-hover:-translate-x-1 rotate-180")} />
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
                              {t("excellent_results", "نتائج ممتازة، واواصل")}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="bg-slate-50/50 p-6 border-t border-slate-100 dark:border-[#262626] text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {t("offline_works", "(يعمل بدون إنترنت)")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <ClassAnalysis
                  students={filteredStudents}
                  allStudents={students}
                />

                <div className="pt-24 border-t border-slate-100 dark:border-[#262626]">
                  <div className="bg-slate-900 rounded-[3rem] p-8 md:p-14 text-white shadow-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32 transition-all group-hover:bg-emerald-500/20" />

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                      <div className="text-center md:text-right space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-400">
                          {t("print_reports", "طباعة تقارير شاملة")}
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight">
                          {t("preview_final_report", "معاينة التقرير النهائي")} <br />{" "}
                          <span className="text-emerald-400">
                            {t("ready_for_pdf", "جاهز لاستخراج التقرير")}
                          </span>
                        </h2>
                        <p className="text-slate-400 font-bold text-lg max-w-md">
                          {t("review_data_before_pdf", "راجع البيانات قبل استخراج ملف PDF")}
                        </p>
                      </div>

                      <div className="flex flex-col gap-4 w-full md:w-auto">
                        <button
                          onClick={() => handlePrintRequest("global_analysis")}
                          className="w-full md:w-auto px-8 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-[1.2rem] font-bold text-base transition-all active:scale-95 flex items-center justify-center gap-3"
                        >
                          <TrendingUp className="w-5 h-5" />
                          <span>{t("student_analysis", "تحليلات الأقسام")}</span>
                        </button>

                        <button
                          onClick={() => handlePrintRequest("report")}
                          className="w-full md:w-auto px-12 py-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[1.8rem] font-black text-xl transition-all shadow-2xl shadow-emerald-900/40 active:scale-95 flex items-center justify-center gap-4 hover:translate-y-[-4px]"
                        >
                          <FileText className="w-7 h-7" />
                          <span>{t("preview_and_download", "معاينة وتحميل")}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
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
                      <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-slate-100 dark:bg-[#1a1a1a] flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
                        <img
                          src="/professor_belhia.jpg"
                          alt="الأستاذ بلحية ياسين"
                          className="absolute inset-0 w-full h-full object-cover z-10"
                          onError={(e) =>
                            (e.currentTarget.style.display = "none")
                          }
                          referrerPolicy="no-referrer"
                        />
                        <UserIcon className="w-10 h-10 md:w-16 md:h-16 text-slate-300" />
                      </div>
                    </div>
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-12 -translate-y-4">
                      <FileSpreadsheet className="w-8 h-8 md:w-10 md:h-10" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-3xl md:text-5xl font-black text-slate-800 dark:text-white tracking-tighter font-display leading-tight">
                      {t("student_analysis", "تحليلات الأقسام")}
                    </h2>
                    <p className="text-xl font-bold text-slate-400 max-w-md mx-auto leading-relaxed">
                      {t("upload_excel_desc", "قم برفع ملف يحتوي على أسماء التلاميذ ونقاطهم. سيرتب التطبيق النتائج ويحللها آلياً.")}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 w-full justify-center px-4">
                    <button
                      onClick={() => setActiveTab("import")}
                      className="px-10 py-6 bg-emerald-600 text-white rounded-[1.5rem] md:rounded-[2rem] font-black text-xl shadow-2xl shadow-emerald-200 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                      <span>{t("upload_excel", "رفع ملف Excel")}</span>
                      <Plus className="w-6 h-6" />
                    </button>
                    <button
                      onClick={loadSampleData}
                      className="px-10 py-6 bg-white dark:bg-[#050505] border-2 border-emerald-100 text-emerald-600 rounded-[1.5rem] md:rounded-[2rem] font-black text-xl hover:bg-emerald-50 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-md"
                    >
                      <span>{t("demo_data", "بيانات تجريبية")}</span>
                      <Sparkles className="w-6 h-6" />
                    </button>
                  </div>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    {
                      title: t("student_analysis", "تحليلات الأقسام"),
                      desc: t("auto_calc_average", "حساب تلقائي للمعدل"),
                      icon: ChartBar,
                    },
                    {
                      title: t("print_reports", "طباعة تقارير شاملة"),
                      desc: t("preview_final_report", "معاينة التقرير النهائي"),
                      icon: Download,
                    },
                    {
                      title: t("smart_analysis", "تحليل ذكي للنتائج"),
                      desc: t("offline_works", "(يعمل بدون إنترنت)"),
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
                      <div className="w-16 h-16 bg-slate-50 dark:bg-[#111111] rounded-2xl flex items-center justify-center mx-auto text-slate-400 group-hover:text-emerald-500 transition-colors">
                        <feature.icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-black text-slate-800 dark:text-white">
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
                <h1 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white tracking-tighter">
                  {t("students_list", "قائمة التلاميذ")} {selectedClass}
                </h1>
                {classes.length > 1 && (
                  <div className="w-full md:w-64">
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="w-full bg-white dark:bg-[#050505] border border-slate-200 dark:border-[#404040] px-4 py-3 rounded-xl font-bold text-slate-700 dark:text-[#e5e5e5] outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {classes.map((cls) => (
                        <option key={cls} value={cls}>
                          {cls}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              </div>
            </header>

            <GradeTable
              students={filteredStudents}
              onSelectStudent={setSelectedStudent}
            />
          </div>
        )}

        {activeTab === "import" && (
          <div className="space-y-10 py-6">
            <div>
              <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter mb-3">
                {t("upload_students_data", "رفع بيانات التلاميذ")}
              </h1>
              <p className="text-slate-500 dark:text-[#a3a3a3] font-bold text-lg">
                {t("excel_format_warning", "يرجى التأكد من أن الملف بصيغة Excel ويحتوي على الأعمدة: الاسم، والمواد.")}
              </p>
            </div>
            <div className="flex flex-col gap-8">
              <ExcelImporter 
                onDataLoaded={handleDataLoaded} 
                isLoading={isUploading} 
                teacherConfig={teacherConfig}
                updateTeacherConfig={updateTeacherConfig}
              />
            </div>
          </div>
        )}

        {activeTab === "responsible_teacher" && (
          <div className="py-6">
            <ResponsibleTeacherFeature teacherConfig={teacherConfig} />
          </div>
        )}

        {activeTab === "settings" && (
          <div className="max-w-4xl mx-auto py-12 md:py-20 space-y-12">
            <div className="space-y-4 text-center">
              <h1 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white tracking-tighter">
                {t("settings_title", "الإعدادات والتحكم")}
              </h1>
              <p className="text-xl font-bold text-slate-400 max-w-2xl mx-auto">
                {t("settings_desc", "تغيير مظهر التطبيق أو التحكم في خيارات المظهر.")}
              </p>
            </div>

            <div className="glass-card rounded-[3rem] p-8 md:p-16 border border-slate-100 dark:border-[#262626] shadow-2xl space-y-12">
              <div className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">
                      {t("theme_color", "لون المظهر الأساسي")}
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => changeTheme("emerald")}
                        className="w-10 h-10 rounded-full bg-emerald-500 ring-4 ring-emerald-50 dark:ring-emerald-900/40 hover:scale-110 transition-transform shadow-sm"
                      />
                      <button
                        onClick={() => changeTheme("blue")}
                        className="w-10 h-10 rounded-full bg-blue-500 ring-4 ring-blue-50 dark:ring-blue-900/40 hover:scale-110 transition-transform shadow-sm"
                      />
                      <button
                        onClick={() => changeTheme("violet")}
                        className="w-10 h-10 rounded-full bg-violet-500 ring-4 ring-violet-50 dark:ring-violet-900/40 hover:scale-110 transition-transform shadow-sm"
                      />
                      <button
                        onClick={() => changeTheme("rose")}
                        className="w-10 h-10 rounded-full bg-rose-500 ring-4 ring-rose-50 dark:ring-rose-900/40 hover:scale-110 transition-transform shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">
                      {t("language", "لغة التطبيق")}
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          i18n.changeLanguage('ar');
                          localStorage.setItem('appLanguage', 'ar');
                        }}
                        className={cn(
                          "flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors",
                          i18n.language === 'ar' && "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 border-emerald-200"
                        )}
                      >
                        {t("language_ar", "العربية")}
                      </button>
                      <button
                        onClick={() => {
                          i18n.changeLanguage('fr');
                          localStorage.setItem('appLanguage', 'fr');
                        }}
                        className={cn(
                          "flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors",
                          i18n.language === 'fr' && "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 border-emerald-200"
                        )}
                      >
                        {t("language_fr", "الفرنسية")}
                      </button>
                      <button
                        onClick={() => {
                          i18n.changeLanguage('en');
                          localStorage.setItem('appLanguage', 'en');
                        }}
                        className={cn(
                          "flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors",
                          i18n.language === 'en' && "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 border-emerald-200"
                        )}
                      >
                        {t("language_en", "الإنجليزية")}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">
                      {t("dark_mode_title", "الوضع الليلي والنهاري")}
                    </p>
                    <button
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      className="w-full flex items-center justify-between px-6 py-4 rounded-2xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-100 dark:border-[#404040] transition-all hover:bg-slate-100 dark:hover:bg-slate-700/80"
                    >
                      <span className="font-bold text-slate-700 dark:text-[#e5e5e5]">
                        {isDarkMode
                          ? t("dark_mode_on", "الوضع الليلي مفعل")
                          : t("dark_mode_off", "الوضع النهاري مفعل")}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#050505] shadow-sm flex items-center justify-center text-slate-500 dark:text-[#a3a3a3]">
                        {isDarkMode ? (
                          <Moon className="w-5 h-5 text-indigo-400" />
                        ) : (
                          <Sun className="w-5 h-5 text-amber-500" />
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Layout>

      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={finalizeLogout}
      />

      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white dark:bg-[#050505] rounded-[2rem] p-8 w-full max-w-lg shadow-2xl relative"
              dir={isRTL ? "rtl" : "ltr"}
            >
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="w-10 h-10 text-rose-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter">
                    {t("logout_confirm_title")}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
                    {t("logout_confirm_msg")}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    onClick={confirmLogout}
                    className="flex-1 px-8 py-4 bg-rose-600 text-white rounded-2xl font-black hover:bg-rose-700 transition-all shadow-lg shadow-rose-200"
                  >
                    {t("confirm_yes")}
                  </button>
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                  >
                    {t("confirm_no")}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPrintMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowPrintMenu(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#050505] rounded-[2rem] p-5 sm:p-8 w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto pb-8 md:pb-8"
            >
              <button
                onClick={() => setShowPrintMenu(false)}
                className="absolute top-4 sm:top-6 left-4 sm:left-6 w-10 h-10 bg-slate-100 dark:bg-[#1a1a1a] rounded-full flex items-center justify-center text-slate-500 dark:text-[#a3a3a3] hover:bg-slate-200 transition-colors"
                title={t("close", "إغلاق")}
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center mb-6">
                <div className="w-12 sm:w-16 h-12 sm:h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-3 sm:mb-4">
                  <Download className="w-6 sm:w-8 h-6 sm:h-8" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-tighter">
                  {t("download_reports_title", "تحميل التقارير")}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-[#a3a3a3] mt-2 font-bold z-10 relative">
                  {t("choose_report_type", "اختر نوع التقرير الذي تريد استخراجه")}
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowPrintMenu(false);
                    setPreviewType("global_analysis");
                    setShowPreviewModal(true);
                  }}
                  className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl border-2 border-slate-100 dark:border-[#262626] hover:border-emerald-500 hover:bg-emerald-50 transition-all group text-right"
                >
                  <div className="w-10 sm:w-12 h-10 sm:h-12 bg-white dark:bg-[#050505] rounded-xl shadow-sm flex items-center justify-center text-slate-400 group-hover:text-emerald-600 shrink-0">
                    <TrendingUp className="w-5 sm:w-6 h-5 sm:h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 dark:text-white text-sm sm:text-lg">
                      {t("comprehensive_analysis", "تحليل شامل")}
                    </h4>
                    <p className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-[#a3a3a3] mt-0.5 sm:mt-1">
                      {t("comprehensive_analysis_desc", "التحليل الإحصائي لجميع الأقسام مجمعة")}
                    </p>
                  </div>
                </button>

                <div className="p-3 sm:p-4 rounded-2xl border-2 border-slate-100 dark:border-[#262626] bg-slate-50 dark:bg-[#111111]">
                  <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                    <div className="w-10 sm:w-12 h-10 sm:h-12 bg-white dark:bg-[#050505] rounded-xl shadow-sm flex items-center justify-center text-slate-400 shrink-0">
                      <FileText className="w-5 sm:w-6 h-5 sm:h-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 dark:text-white text-sm sm:text-lg">
                        {t("class_report", "تقرير قسم")}
                      </h4>
                      <p className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-[#a3a3a3]">
                        {t("choose_class_for_report", "اختر القسم المراد استخراج تقريره")}
                      </p>
                    </div>
                  </div>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full bg-white dark:bg-[#050505] border border-slate-200 dark:border-[#404040] px-3 sm:px-4 py-2 sm:py-3 rounded-xl font-bold text-sm sm:text-base text-slate-700 dark:text-[#e5e5e5] outline-none focus:ring-2 focus:ring-emerald-500 mb-2 sm:mb-3"
                  >
                    <option value="ALL">{t("all_classes_combined", "جميع الأقسام مجمعة في كشف")}</option>
                    {classes.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      setShowPrintMenu(false);
                      setPreviewType("report");
                      setShowPreviewModal(true);
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 sm:py-3 rounded-xl text-sm sm:text-base transition-colors shadow-lg shadow-emerald-200"
                  >
                    {t("preview_and_download", "معاينة وتحميل")}
                  </button>
                </div>

                <div className="p-3 sm:p-4 rounded-2xl border-2 border-slate-100 dark:border-[#262626] bg-slate-50 dark:bg-[#111111]">
                  <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                    <div className="w-10 sm:w-12 h-10 sm:h-12 bg-white dark:bg-[#050505] rounded-xl shadow-sm flex items-center justify-center text-blue-400 shrink-0">
                      <Award className="w-5 sm:w-6 h-5 sm:h-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 dark:text-white text-sm sm:text-lg">
                        {t("certificates_of_appreciation", "شهادات التقدير")}
                      </h4>
                      <p className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-[#a3a3a3]">
                        {t("certificates_desc", "شهادات تقديرية للمتفوقين")}
                      </p>
                    </div>
                  </div>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full bg-white dark:bg-[#050505] border border-slate-200 dark:border-[#404040] px-3 sm:px-4 py-2 sm:py-3 rounded-xl font-bold text-sm sm:text-base text-slate-700 dark:text-[#e5e5e5] outline-none focus:ring-2 focus:ring-emerald-500 mb-2 sm:mb-3"
                  >
                    <option value="ALL">{t("all_classes", "جميع الأقسام")}</option>
                    {classes.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      setShowPrintMenu(false);
                      setPreviewType("certificates");
                      setShowPreviewModal(true);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-2.5 sm:py-3 rounded-xl text-sm sm:text-base transition-colors shadow-lg shadow-blue-200"
                  >
                    {t("preview_and_download_certs", "معاينة وتحميل الشهادات")}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPreviewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10"
          >
            <div
              className="absolute inset-0 bg-slate-900/90 backdrop-blur-md"
              onClick={() => setShowPreviewModal(false)}
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-5xl bg-white dark:bg-[#050505] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col h-full max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="px-8 py-6 bg-slate-50 dark:bg-[#111111] border-b border-slate-100 dark:border-[#262626] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">
                      {t("preview_final_report", "معاينة التقرير النهائي")}
                    </h3>
                    <p className="text-xs font-bold text-slate-400">
                      {t("review_data_before_pdf", "راجع البيانات قبل استخراج ملف PDF")}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handlePrint}
                    disabled={isDownloading}
                    className={cn(
                      "px-6 py-3 bg-emerald-600 text-white rounded-xl font-black text-sm flex items-center gap-2 shadow-lg shadow-emerald-200 transition-all active:scale-95",
                      isDownloading && "opacity-50 cursor-not-allowed",
                    )}
                  >
                    {isDownloading ? (
                      <RefreshCcw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    {isDownloading ? t("preparing", "جاري التحضير...") : t("download_pdf", "تحميل مستند PDF")}
                  </button>
                  <button
                    onClick={() => setShowPreviewModal(false)}
                    className="w-12 h-12 flex items-center justify-center bg-white dark:bg-[#050505] border border-slate-200 dark:border-[#404040] text-slate-400 rounded-xl hover:bg-rose-50 hover:text-rose-500 transition-all active:scale-95"
                    title={t("close", "إغلاق")}
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Modal Content - The actual Report */}
              <div className="flex-1 overflow-y-auto bg-slate-100 dark:bg-[#1a1a1a] p-4 sm:p-8 flex flex-col items-center">
                <div className="bg-white dark:bg-[#050505] shadow-2xl origin-top scale-[0.6] sm:scale-[0.8] md:scale-90 lg:scale-100 transition-all duration-500 mb-20 relative">
                  <div id="preview-report-wrapper" className="min-h-[1123px]">
                    {previewType === "global_analysis" ? (
                      <PrintableClassesAnalysis
                        id="preview-classes-analysis-id"
                        students={students}
                        teacherConfig={teacherConfig}
                      />
                    ) : previewType === "certificates" ? (
                      <PrintableCertificates
                        students={filteredStudents}
                        teacherConfig={teacherConfig}
                      />
                    ) : (
                      <PrintableReport
                        id="preview-report-id"
                        students={filteredStudents}
                        className={selectedClass}
                        teacherConfig={teacherConfig}
                      />
                    )}
                  </div>
                  {isDownloading && (
                    <div className="absolute inset-0 z-[110] flex flex-col items-center justify-center bg-white/60 backdrop-blur-md">
                      <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
                      <p className="text-xl font-black text-slate-800 dark:text-white tracking-tight">
                        {t("processing_report", "جاري معالجة التقرير...")}
                      </p>
                      <p className="text-sm font-bold text-slate-400">
                        {t("process_complete_soon", "ستكتمل العملية خلال ثوانٍ")}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer (Mobile) */}
              <div className="md:hidden p-6 bg-white dark:bg-[#050505] border-t border-slate-100 dark:border-[#262626] flex gap-3 shrink-0 z-50">
                <button
                  onClick={handlePrint}
                  disabled={isDownloading}
                  className={cn(
                    "flex-1 py-4 bg-emerald-600 text-white rounded-xl font-black text-lg shadow-lg flex items-center justify-center gap-2",
                    isDownloading && "opacity-50 cursor-not-allowed",
                  )}
                >
                  {isDownloading ? (
                    <RefreshCcw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Download className="w-5 h-5" />
                  )}
                  <span>
                    {isDownloading ? t("downloading", "جاري التحميل...") : t("download_now", "تحميل الآن")}
                  </span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTeacherConfigModal && (
          <TeacherConfigModal
            teacherConfig={teacherConfig}
            updateTeacherConfig={updateTeacherConfig}
            onSubmit={onTeacherConfigSubmit}
            onCancel={() => {
              setShowTeacherConfigModal(false);
              setPendingPrintAction(null);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedStudent && (
          <StudentAnalysis
            student={selectedStudent}
            onClose={() => setSelectedStudent(null)}
            teacherConfig={teacherConfig}
          />
        )}
      </AnimatePresence>
    </>
  );
}
