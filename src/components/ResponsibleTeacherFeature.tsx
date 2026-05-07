import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import { Upload, FileSpreadsheet, BrainCircuit, Loader2, Printer } from "lucide-react";
import { pdfService } from "../services/pdfService";
import { geminiService } from "../services/geminiService";
import { PrintableResponsibleTeacherAnalysis } from "./PrintableResponsibleTeacherAnalysis";
import { TeacherConfig } from "../types";

interface SubjectData {
  average: number;
  successRate: number;
}

interface StudentRecord {
  name: string;
  subjects: Record<string, number>;
  overallAverage: number;
}

interface Props {
  teacherConfig: TeacherConfig;
}

export function ResponsibleTeacherFeature({ teacherConfig }: Props) {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState<StudentRecord[]>([]);
  const [subjectHeaders, setSubjectHeaders] = useState<string[]>([]);
  const [subjectStats, setSubjectStats] = useState<Record<string, SubjectData>>({});
  
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isLocalAnalysis, setIsLocalAnalysis] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Stats
  const hasData = data.length > 0;
  
  const globalAverage = hasData ? (data.reduce((acc, curr) => acc + curr.overallAverage, 0) / data.length).toFixed(2) : "0.00";
  const highestAverage = hasData ? Math.max(...data.map(d => d.overallAverage)).toFixed(2) : "0.00";
  const lowestAverage = hasData ? Math.min(...data.map(d => d.overallAverage)).toFixed(2) : "0.00";
  
  const countPassing = data.filter(d => d.overallAverage >= 10).length;
  const globalSuccessRate = hasData ? ((countPassing / data.length) * 100).toFixed(2) : "0.00";

  const brackets = {
    excellent: data.filter(d => d.overallAverage >= 18).length,
    veryGood: data.filter(d => d.overallAverage >= 16 && d.overallAverage < 18).length,
    good: data.filter(d => d.overallAverage >= 14 && d.overallAverage < 16).length,
    satisfactory: data.filter(d => d.overallAverage >= 12 && d.overallAverage < 14).length,
    acceptable: data.filter(d => d.overallAverage >= 10 && d.overallAverage < 12).length,
    insufficient: data.filter(d => d.overallAverage >= 8 && d.overallAverage < 10).length,
    weak: data.filter(d => d.overallAverage < 8).length,
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const jsa = XLSX.utils.sheet_to_json<any>(ws, { header: 1 });

      if (jsa.length < 2) return;

      const headers = jsa[0] as string[];
      let nameColIdx = -1;
      let targetSubjectIdxs: number[] = [];

      // Find name column
      nameColIdx = headers.findIndex(h => {
        if (!h) return false;
        const str = h.toString().toLowerCase();
        return str.includes("الاسم") || str.includes("اللقب") || str.includes("الطالب") || str.includes("التلميذ") || str.includes("name") || str.includes("nom");
      });

      if (nameColIdx === -1) {
        alert(t("name_column_not_found", "لم يتم العثور على عمود الاسم. يرجى التأكد من وجود عمود باسم التلميذ."));
        return;
      }

      // Identify subject columns: these are columns that have primarily numeric values in the rows
      for (let i = 0; i < headers.length; i++) {
        if (i === nameColIdx) continue;
        const hName = headers[i]?.toString().trim() || "";
        if (!hName || hName.includes("رقم") || hName.includes("المعدل") || hName.includes("ملاحظة") || hName.includes("id") || hName.includes("average") || hName.includes("moyenne")) continue;
        targetSubjectIdxs.push(i);
      }

      const parsedData: StudentRecord[] = [];
      let overallAvgColIdx = headers.findIndex(h => h && (h.toString().includes("المعدل") || h.toString().toLowerCase().includes("average") || h.toString().toLowerCase().includes("moyenne")));

      for (let i = 1; i < jsa.length; i++) {
        const row = jsa[i];
        if (!row[nameColIdx]) continue; // skip empty rows

        const studentData: StudentRecord = {
          name: row[nameColIdx].toString(),
          subjects: {},
          overallAverage: 0,
        };

        let sum = 0;
        let count = 0;

        for (const idx of targetSubjectIdxs) {
          const rawVal = row[idx];
          const val = parseFloat(rawVal);
          const subjName = headers[idx] || `Subject ${idx}`;
          if (!isNaN(val)) {
            studentData.subjects[subjName] = val;
            sum += val;
            count++;
          }
        }

        if (overallAvgColIdx !== -1 && !isNaN(parseFloat(row[overallAvgColIdx]))) {
          studentData.overallAverage = parseFloat(row[overallAvgColIdx]);
        } else {
          studentData.overallAverage = count > 0 ? sum / count : 0;
        }

        parsedData.push(studentData);
      }

      // Compute Subject Stats
      const finalSubjectHeaders = Object.keys(parsedData[0]?.subjects || {});
      const sStats: Record<string, SubjectData> = {};
      
      for (const subj of finalSubjectHeaders) {
        let sum = 0;
        let count = 0;
        let passing = 0;
        for (const st of parsedData) {
          const val = st.subjects[subj];
          if (val !== undefined && !isNaN(val)) {
            sum += val;
            count++;
            if (val >= 10) passing++;
          }
        }
        sStats[subj] = {
          average: count > 0 ? sum / count : 0,
          successRate: count > 0 ? (passing / count) * 100 : 0
        };
      }

      setSubjectHeaders(finalSubjectHeaders);
      setSubjectStats(sStats);
      setData(parsedData);
      setAiAnalysis(null);
    };
    reader.readAsBinaryString(file);
    e.target.value = ""; // reset
  };

  const loadDemoData = () => {
    const subjects = [
      t("math", "الرياضيات"), 
      t("physics", "الفيزياء"), 
      t("arabic", "اللغة العربية"), 
      t("english", "الإنجليزية"), 
      t("history_geo", "التاريخ والجغرافيا")
    ];
    const studentsNames = [
      "محمد بن عودة", "خديجة بلقاسم", "عبد القادر علوي", "زهرة بومدين", 
      "ياسين زروقي", "ليلى إبراهيمي", "هشام بن طيب", "مريم شريف", 
      "حمزة مسعودي", "صوفيا بن ناصر"
    ];

    const initialGrades = [
      [14.5, 12, 16, 11, 15],
      [18.5, 17.5, 19.5, 15, 18.5],
      [9, 8.5, 11, 7, 10],
      [16, 15.5, 17.5, 14, 16.5],
      [7, 6, 9.5, 5.5, 8],
      [12, 13, 14.5, 12.5, 13],
      [19.5, 19, 20, 19.5, 19],
      [11.5, 10.5, 12, 10, 11],
      [5.5, 4.5, 7.5, 3.5, 6],
      [15, 14.5, 16.5, 13.5, 15.5]
    ];

    const parsedData: StudentRecord[] = studentsNames.map((name, sIdx) => {
      const studentSubjects: Record<string, number> = {};
      let sum = 0;
      subjects.forEach((subj, idx) => {
        const grade = initialGrades[sIdx][idx];
        studentSubjects[subj] = grade;
        sum += grade;
      });
      return {
        name,
        subjects: studentSubjects,
        overallAverage: sum / subjects.length,
      };
    });

    const sStats: Record<string, SubjectData> = {};
    for (const subj of subjects) {
      let sum = 0;
      let passing = 0;
      for (const st of parsedData) {
        const val = st.subjects[subj];
        sum += val;
        if (val >= 10) passing++;
      }
      sStats[subj] = {
        average: sum / parsedData.length,
        successRate: (passing / parsedData.length) * 100
      };
    }

    setSubjectHeaders(subjects);
    setSubjectStats(sStats);
    setData(parsedData);
    setAiAnalysis(null);
    setIsLocalAnalysis(false);
  };

  const generateLocalAnalysis = () => {
    const subjects = subjectHeaders.map(h => ({
      name: h,
      avg: subjectStats[h].average,
      rate: subjectStats[h].successRate
    }));

    const strongSubjects = subjects.filter(s => s.rate >= 70).map(s => s.name);
    const weakSubjects = subjects.filter(s => s.rate < 50).map(s => s.name);
    
    let analysis = t("statistical_analysis_local", "**تحليل إحصائي محلي (بدون إنترنت):**") + "\n\n";
    
    analysis += t("overview_analysis_msg", { 
      rate: globalSuccessRate, 
      avg: globalAverage, 
      strong: brackets.excellent + brackets.veryGood, 
      weak: brackets.insufficient + brackets.weak 
    }) + "\n\n";
    
    if (strongSubjects.length > 0) {
      analysis += t("strong_subjects_msg", { subjects: strongSubjects.join('، ') }) + "\n\n";
    }
    
    if (weakSubjects.length > 0) {
      analysis += t("weak_subjects_msg", { subjects: weakSubjects.join('، ') }) + "\n\n";
    }

    const gap = parseFloat(highestAverage) - parseFloat(lowestAverage);
    if (gap > 8) {
      analysis += t("pedagogical_gap_msg", { gap: gap.toFixed(2) }) + "\n\n";
    }

    analysis += t("recommendation_msg") + "";
    
    setAiAnalysis(analysis);
    setIsLocalAnalysis(true);
  };

  const generateAnalysis = async () => {
    setIsAnalyzing(true);
    setIsLocalAnalysis(false);
    try {
      const reportLines = [
        `Student count: ${data.length}`,
        `Class average: ${globalAverage}`,
        `Success rate: ${globalSuccessRate}%`,
        `Max average: ${highestAverage}`,
        `Min average: ${lowestAverage}`,
        "",
        "Distribution:",
        `- Excellent: ${brackets.excellent}`,
        `- Very Good: ${brackets.veryGood}`,
        `- Good: ${brackets.good}`,
        `- Satisfactory: ${brackets.satisfactory}`,
        `- Acceptable: ${brackets.acceptable}`,
        `- Insufficient: ${brackets.insufficient}`,
        `- Weak: ${brackets.weak}`,
        "",
        "Subjects details:"
      ];

      subjectHeaders.forEach(subj => {
        reportLines.push(`- ${subj}: Avg (${subjectStats[subj].average.toFixed(2)}), Rate (${subjectStats[subj].successRate.toFixed(2)}%)`);
      });

      const reportStr = reportLines.join('\n');
      const result = await geminiService.analyzeClassOverallPerformance(reportStr);
      setAiAnalysis(result);
      setIsLocalAnalysis(false);
    } catch (e) {
      console.error("Gemini failed, falling back to local analysis", e);
      generateLocalAnalysis();
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      const filename = i18n.language === 'ar' ? "تحليل_الاستاذ_المسؤول" : "Responsible_Teacher_Analysis";
      await pdfService.downloadHtmlAsPdf("print-responsible-teacher", filename);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const isRTL = i18n.language === 'ar';

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-indigo-900 dark:text-indigo-100 flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            {t("responsible_teacher_feature", "خاصية الأستاذ المسؤول")}
          </h2>
          <p className="text-indigo-700 dark:text-indigo-300 mt-2 font-medium">
            {t("responsible_teacher_desc", "قم برفع ملف Excel الخاص بالقسم (يحتوي على أسماء التلاميذ وعلامات كل مادة) للحصول على تحليل دقيق.")}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button 
            onClick={loadDemoData}
            className="flex items-center justify-center px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg font-bold transition-all w-full md:w-auto"
          >
            <BrainCircuit className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t("demo_data", "بيانات تجريبية")}
          </button>
          <div className="relative">
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <button className="flex items-center justify-center px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg pointer-events-none w-full md:w-auto font-bold transition-all">
              <Upload className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t("upload_excel", "رفع ملف Excel")}
            </button>
          </div>
        </div>
      </div>

      {hasData && (
        <div className="space-y-6">
          <div className="flex justify-end gap-3 flex-wrap">
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="flex items-center px-4 py-2 rounded-lg border-2 font-bold transition-all disabled:opacity-50 border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/50"
            >
              {isGeneratingPdf ? <Loader2 className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'} animate-spin`} /> : <Printer className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />}
              {t("download_report", "تحميل التقرير")}
            </button>
            <button 
              onClick={generateAnalysis} 
              disabled={isAnalyzing}
              className="flex items-center px-4 py-2 rounded-lg font-bold transition-all disabled:opacity-50 bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
            >
              {isAnalyzing ? <Loader2 className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'} animate-spin`} /> : <BrainCircuit className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />}
              {t("smart_analysis_btn", "تحليل ذكي للنتائج")}
            </button>
          </div>

          <div id="responsible-teacher-report-id" className="space-y-6 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
            
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase mb-2">
                {t("statistical_analysis_title", "التحليل الإحصائي لنتائج القسم")}
              </h2>
              <p className="text-slate-500">{t("responsible_teacher", "الأستاذ المسؤول")}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="rounded-xl border bg-indigo-50 dark:bg-indigo-900/40 border-indigo-100 dark:border-indigo-800">
                <div className="p-4 flex flex-col items-center justify-center text-center">
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-1">{t("overall_average", "المعدل العام")}</span>
                  <span className="text-2xl font-black text-indigo-900 dark:text-indigo-100">{globalAverage}</span>
                </div>
              </div>
              <div className="rounded-xl border bg-emerald-50 dark:bg-emerald-900/40 border-emerald-100 dark:border-emerald-800">
                <div className="p-4 flex flex-col items-center justify-center text-center">
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-1">{t("success_rate", "نسبة النجاح")}</span>
                  <span className="text-2xl font-black text-emerald-900 dark:text-emerald-100">%{globalSuccessRate}</span>
                </div>
              </div>
              <div className="rounded-xl border bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800">
                <div className="p-4 flex flex-col items-center justify-center text-center">
                  <span className="text-sm font-bold text-amber-600 dark:text-amber-400 mb-1">{t("highest_average", "أعلى معدل")}</span>
                  <span className="text-2xl font-black text-amber-900 dark:text-amber-100">{highestAverage}</span>
                </div>
              </div>
              <div className="rounded-xl border bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800">
                <div className="p-4 flex flex-col items-center justify-center text-center">
                  <span className="text-sm font-bold text-rose-600 dark:text-rose-400 mb-1">{t("lowest_average", "أدنى معدل")}</span>
                  <span className="text-2xl font-black text-rose-900 dark:text-rose-100">{lowestAverage}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-black text-slate-800 dark:text-white mb-4 border-b-2 border-indigo-100 dark:border-indigo-900 pb-2">
                  {t("averages_distribution", "توزيع المعدلات")}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm font-bold bg-slate-50 dark:bg-slate-800/50 p-2 rounded">
                    <span>{t("excellent_range_rt", "ممتاز (18 - 20)")}</span>
                    <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full">{brackets.excellent}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold bg-slate-50 dark:bg-slate-800/50 p-2 rounded">
                    <span>{t("very_good_range_rt", "جيد جدا (16 - 17.99)")}</span>
                    <span className="bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300 px-3 py-1 rounded-full">{brackets.veryGood}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold bg-slate-50 dark:bg-slate-800/50 p-2 rounded">
                    <span>{t("good_range_rt", "جيد (14 - 15.99)")}</span>
                    <span className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full">{brackets.good}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold bg-slate-50 dark:bg-slate-800/50 p-2 rounded">
                    <span>{t("average_range_rt", "متوسط (12 - 13.99)")}</span>
                    <span className="bg-lime-100 dark:bg-lime-900 text-lime-700 dark:text-lime-300 px-3 py-1 rounded-full">{brackets.satisfactory}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold bg-slate-50 dark:bg-slate-800/50 p-2 rounded">
                    <span>{t("acceptable_range_rt", "مقبول (10 - 11.99)")}</span>
                    <span className="bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-full">{brackets.acceptable}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold bg-slate-50 dark:bg-slate-800/50 p-2 rounded">
                    <span>{t("insufficient_range_rt", "دون المتوسط (8 - 9.99)")}</span>
                    <span className="bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 px-3 py-1 rounded-full">{brackets.insufficient}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold bg-slate-50 dark:bg-slate-800/50 p-2 rounded">
                    <span>{t("poor_range_rt", "ضعيف (أقل من 8)")}</span>
                    <span className="bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300 px-3 py-1 rounded-full">{brackets.weak}</span>
                  </div>
                </div>
              </div>
              
              {aiAnalysis && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-xl border border-purple-100 dark:border-purple-800/50">
                    <h3 className="text-lg font-black text-purple-900 dark:text-purple-100 mb-4 flex items-center justify-between border-b-2 border-purple-200 dark:border-purple-800 pb-2">
                      <div className="flex items-center gap-2">
                        <BrainCircuit className="w-5 h-5" />
                        {t("analysis_and_directions", "التحليل والتوجيهات")}
                      </div>
                      {isLocalAnalysis && (
                        <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded text-slate-600 dark:text-slate-400">
                          {t("local_analysis_offline", "تحليل محلي (أوفلاين)")}
                        </span>
                      )}
                    </h3>
                    <div className="text-sm dark:text-purple-200 text-purple-800 whitespace-pre-line leading-relaxed font-bold">
                      {aiAnalysis}
                    </div>
                  </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-300 dark:border-slate-700 text-sm md:text-base">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800">
                    <th className="border border-slate-300 dark:border-slate-700 p-2 min-w-[150px]">{t("name_and_surname", "الاسم واللقب")}</th>
                    {subjectHeaders.map(h => (
                      <th key={h} className="border border-slate-300 dark:border-slate-700 p-2 whitespace-nowrap">{h}</th>
                    ))}
                    <th className="border border-slate-300 dark:border-slate-700 p-2 whitespace-nowrap bg-indigo-50 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200">{t("overall_average", "المعدل العام")}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((student, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className={`border border-slate-300 dark:border-slate-700 p-2 font-bold ${isRTL ? 'text-right' : 'text-left'}`}>{student.name}</td>
                      {subjectHeaders.map(h => (
                        <td key={h} className="border border-slate-300 dark:border-slate-700 p-2 text-center">{student.subjects[h]?.toFixed(2) || '-'}</td>
                      ))}
                      <td className="border border-slate-300 dark:border-slate-700 p-2 text-center font-black bg-indigo-50/50 dark:bg-indigo-900/10 text-indigo-700 dark:text-indigo-300">{student.overallAverage.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-emerald-50 dark:bg-emerald-900/20 font-bold border-t-2 border-emerald-200 dark:border-emerald-800">
                    <td className={`border border-slate-300 dark:border-slate-700 p-2 text-emerald-800 dark:text-emerald-200 ${isRTL ? 'text-right' : 'text-left'}`}>{t("subject_avg", "معدل المادة")}</td>
                    {subjectHeaders.map(h => (
                      <td key={h} className="border border-slate-300 dark:border-slate-700 p-2 text-center text-emerald-700 dark:text-emerald-300">{subjectStats[h].average.toFixed(2)}</td>
                    ))}
                    <td className="border border-slate-300 dark:border-slate-700 p-2 text-center bg-indigo-100 dark:bg-indigo-900/40 text-indigo-900 dark:text-indigo-100">{globalAverage}</td>
                  </tr>
                  <tr className="bg-blue-50 dark:bg-blue-900/20 font-bold">
                    <td className={`border border-slate-300 dark:border-slate-700 p-2 text-blue-800 dark:text-blue-200 ${isRTL ? 'text-right' : 'text-left'}`}>{t("success_rate_percent", "نسبة النجاح %")}</td>
                    {subjectHeaders.map(h => (
                      <td key={h} className={`border border-slate-300 dark:border-slate-700 p-2 text-center ${subjectStats[h].successRate >= 50 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {subjectStats[h].successRate.toFixed(2)}%
                      </td>
                    ))}
                    <td className={`border border-slate-300 dark:border-slate-700 p-2 text-center ${parseFloat(globalSuccessRate) >= 50 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {globalSuccessRate}%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

          </div>
        </div>
      )}

      {hasData && (
        <div className="absolute left-[-9999px] top-[-9999px] w-[800px] pointer-events-none">
          <PrintableResponsibleTeacherAnalysis
            id="print-responsible-teacher"
            data={data}
            subjectHeaders={subjectHeaders}
            subjectStats={subjectStats}
            globalAverage={globalAverage}
            globalSuccessRate={globalSuccessRate}
            highestAverage={highestAverage}
            lowestAverage={lowestAverage}
            brackets={brackets}
            teacherConfig={teacherConfig}
            aiAnalysis={aiAnalysis}
          />
        </div>
      )}
    </div>
  );
}
