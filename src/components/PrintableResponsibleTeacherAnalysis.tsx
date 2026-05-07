import React, { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { TeacherConfig } from '../types';

interface SubjectData {
  average: number;
  successRate: number;
}

interface StudentRecord {
  name: string;
  subjects: Record<string, number>;
  overallAverage: number;
}

interface PrintableResponsibleTeacherAnalysisProps {
  data: StudentRecord[];
  subjectHeaders: string[];
  subjectStats: Record<string, SubjectData>;
  globalAverage: string;
  globalSuccessRate: string;
  highestAverage: string;
  lowestAverage: string;
  brackets: Record<string, number>;
  teacherConfig: TeacherConfig;
  aiAnalysis: string | null;
  id?: string;
}

export const PrintableResponsibleTeacherAnalysis = forwardRef<HTMLDivElement, PrintableResponsibleTeacherAnalysisProps>(({ 
  data, 
  subjectHeaders, 
  subjectStats, 
  globalAverage, 
  globalSuccessRate, 
  highestAverage, 
  lowestAverage, 
  brackets,
  teacherConfig,
  aiAnalysis,
  id = "printable-responsible-teacher-id" 
}, ref) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const PAGE_1_LIMIT = 25; // Less items on page 1 because of header & stats
  const PAGE_LIMIT = 40;
  
  const studentChunks: StudentRecord[][] = [];
  const dataCopy = [...data];
  
  if (dataCopy.length > 0) {
    studentChunks.push(dataCopy.splice(0, PAGE_1_LIMIT));
  }
  while (dataCopy.length > 0) {
    studentChunks.push(dataCopy.splice(0, PAGE_LIMIT));
  }

  const TableColGroups = () => (
    <colgroup>
      <col style={{ width: '25%' }} />
      {subjectHeaders.map(h => <col key={h} style={{ width: `${60 / subjectHeaders.length}%` }} />)}
      <col style={{ width: '15%' }} />
    </colgroup>
  );

  return (
    <div className="w-full">
      <div ref={ref} id={id} className="w-[800px] font-sans mx-auto" dir={isRTL ? "rtl" : "ltr"} style={{ color: '#000000' }}>
        {studentChunks.map((chunk, index) => {
          const isFirstPage = index === 0;

          return (
            <div 
              key={`page-${index}`} 
              className="pdf-page bg-white p-10 relative" 
              style={{ minHeight: '1120px', marginBottom: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            >
              {isFirstPage && (
                <>
                  <div style={{ backgroundColor: '#f3f4f6', padding: '12px', textAlign: 'center', marginBottom: '10px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <h1 style={{ fontSize: '20px', fontWeight: '900', margin: '0', color: '#111827' }}>{t("statistical_analysis_title", "التحليل الإحصائي لنتائج القسم")}</h1>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '8px', fontSize: '14px', fontWeight: '700', color: '#4b5563' }}>
                      <span>{t("responsible_teacher_feature", "خاصية الأستاذ المسؤول")}</span>
                      <span>{t("teacher_name_print", "الأستاذ(ة):")} {teacherConfig.name}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '6px' }}>
                      {t("institution_label", "ثانوية:")} {teacherConfig.institution}
                    </h2>
                    <p style={{ fontSize: '13px', fontWeight: '700' }}>{t("academic_year_label", "السنة الدراسية:")} {teacherConfig.academicYear}</p>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                     <div style={{ flex: 1, padding: '12px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', textAlign: 'center' }}>
                       <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e40af' }}>{t("overall_average", "المعدل العام")}</div>
                       <div style={{ fontSize: '18px', fontWeight: '900', color: '#1e3a8a' }}>{globalAverage}</div>
                     </div>
                     <div style={{ flex: 1, padding: '12px', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', textAlign: 'center' }}>
                       <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#047857' }}>{t("success_rate", "نسبة النجاح")}</div>
                       <div style={{ fontSize: '18px', fontWeight: '900', color: '#064e3b' }}>%{globalSuccessRate}</div>
                     </div>
                     <div style={{ flex: 1, padding: '12px', backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', textAlign: 'center' }}>
                       <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#b45309' }}>{t("highest_average", "أعلى معدل")}</div>
                       <div style={{ fontSize: '18px', fontWeight: '900', color: '#78350f' }}>{highestAverage}</div>
                     </div>
                     <div style={{ flex: 1, padding: '12px', backgroundColor: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '8px', textAlign: 'center' }}>
                       <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#be123c' }}>{t("lowest_average", "أدنى معدل")}</div>
                       <div style={{ fontSize: '18px', fontWeight: '900', color: '#881337' }}>{lowestAverage}</div>
                     </div>
                  </div>

                  <div style={{ marginBottom: '20px', border: '1px solid #e5e7eb', padding: '10px', borderRadius: '8px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '900', marginBottom: '8px', borderBottom: '1px solid #e5e7eb', paddingBottom: '4px' }}>{t("averages_distribution", "توزيع المعدلات")}</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '12px', fontWeight: 'bold' }}>
                       <span style={{ backgroundColor: '#e0e7ff', color: '#3730a3', padding: '4px 8px', borderRadius: '4px' }}>{t("excellent_range_rt", "ممتاز (18 - 20)")}: {brackets.excellent}</span>
                       <span style={{ backgroundColor: '#cffafe', color: '#164e63', padding: '4px 8px', borderRadius: '4px' }}>{t("very_good_range_rt", "جيد جدا (16 - 17.99)")}: {brackets.veryGood}</span>
                       <span style={{ backgroundColor: '#d1fae5', color: '#065f46', padding: '4px 8px', borderRadius: '4px' }}>{t("good_range_rt", "جيد (14 - 15.99)")}: {brackets.good}</span>
                       <span style={{ backgroundColor: '#ecfccb', color: '#3f6212', padding: '4px 8px', borderRadius: '4px' }}>{t("average_range_rt", "متوسط (12 - 13.99)")}: {brackets.satisfactory}</span>
                       <span style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '4px 8px', borderRadius: '4px' }}>{t("acceptable_range_rt", "مقبول (10 - 11.99)")}: {brackets.acceptable}</span>
                       <span style={{ backgroundColor: '#ffedd5', color: '#9a3412', padding: '4px 8px', borderRadius: '4px' }}>{t("insufficient_range_rt", "دون المتوسط (8 - 9.99)")}: {brackets.insufficient}</span>
                       <span style={{ backgroundColor: '#ffe4e6', color: '#9f1239', padding: '4px 8px', borderRadius: '4px' }}>{t("poor_range_rt", "ضعيف (أقل من 8)")}: {brackets.weak}</span>
                    </div>
                  </div>
                </>
              )}

              <table style={{ width: '100%', textAlign: 'center', borderCollapse: 'collapse', border: '2px solid #000000', fontSize: '12px', tableLayout: 'fixed' }}>
                <TableColGroups />
                <thead style={{ display: 'table-header-group' }}>
                  <tr style={{ backgroundColor: '#e5e7eb' }}>
                    <th style={{ padding: '4px 2px', fontWeight: '900', border: '1px solid #000000', fontSize: '12px' }}>{t("name_and_surname", "الاسم واللقب")}</th>
                    {subjectHeaders.map(h => (
                      <th key={h} style={{ padding: '4px 2px', fontWeight: '900', border: '1px solid #000000', fontSize: '12px', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                    <th style={{ padding: '4px 2px', fontWeight: '900', border: '1px solid #000000', fontSize: '12px', backgroundColor: '#d1d5db' }}>{t("overall_average", "المعدل العام")}</th>
                  </tr>
                </thead>
                <tbody>
                  {chunk.map((student, innerIndex) => (
                    <tr key={innerIndex} style={{ borderBottom: '1px solid #000000' }}>
                      <td style={{ padding: '4px', fontWeight: '700', border: '1px solid #000000', textAlign: isRTL ? 'right' : 'left', fontSize: '11px' }}>{student.name}</td>
                      {subjectHeaders.map(h => (
                        <td key={h} style={{ padding: '4px', border: '1px solid #000000', fontSize: '11px' }}>{student.subjects[h]?.toFixed(2) || '-'}</td>
                      ))}
                      <td style={{ padding: '4px', border: '1px solid #000000', fontWeight: '900', backgroundColor: '#f3f4f6', fontSize: '12px' }}>{student.overallAverage.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                {/* Only show the summary footer on the last page */}
                {(index === studentChunks.length - 1) && (
                  <tfoot>
                    <tr style={{ backgroundColor: '#ecfdf5', fontWeight: 'bold' }}>
                      <td style={{ padding: '6px', border: '1px solid #000000', color: '#064e3b', textAlign: isRTL ? 'right' : 'left' }}>{t("subject_avg", "معدل المادة")}</td>
                      {subjectHeaders.map(h => (
                        <td key={h} style={{ padding: '6px', border: '1px solid #000000', color: '#064e3b' }}>{subjectStats[h].average.toFixed(2)}</td>
                      ))}
                      <td style={{ padding: '6px', border: '1px solid #000000', backgroundColor: '#d1fae5', color: '#064e3b' }}>{globalAverage}</td>
                    </tr>
                    <tr style={{ backgroundColor: '#eff6ff', fontWeight: 'bold' }}>
                      <td style={{ padding: '6px', border: '1px solid #000000', color: '#1e3a8a', textAlign: isRTL ? 'right' : 'left' }}>{t("success_rate_percent", "نسبة النجاح %")}</td>
                      {subjectHeaders.map(h => (
                        <td key={h} style={{ padding: '6px', border: '1px solid #000000', color: subjectStats[h].successRate >= 50 ? '#059669' : '#dc2626' }}>{subjectStats[h].successRate.toFixed(2)}%</td>
                      ))}
                      <td style={{ padding: '6px', border: '1px solid #000000', backgroundColor: '#dbeafe', color: parseFloat(globalSuccessRate) >= 50 ? '#059669' : '#dc2626' }}>{globalSuccessRate}%</td>
                    </tr>
                  </tfoot>
                )}
              </table>

              {index === studentChunks.length - 1 && aiAnalysis && (
                <div style={{ marginTop: '30px', padding: '15px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#f9fafb' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '900', marginBottom: '10px', color: '#111827', borderBottom: '1px solid #e5e7eb', paddingBottom: '5px' }}>{t("pedagogical_directions", "التحليل والتوجيهات البيداغوجية")}</h3>
                  <div style={{ fontSize: '11px', lineHeight: '1.6', color: '#374151', whiteSpace: 'pre-line' }}>
                    {aiAnalysis.replace(/\*\*/g, '')}
                  </div>
                </div>
              )}

              <div style={{ position: 'absolute', bottom: '20px', left: '0', right: '0', textAlign: 'center', fontSize: '12px', color: '#6b7280' }}>
                {t("page_label", "الصفحة")} {index + 1}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

PrintableResponsibleTeacherAnalysis.displayName = 'PrintableResponsibleTeacherAnalysis';
