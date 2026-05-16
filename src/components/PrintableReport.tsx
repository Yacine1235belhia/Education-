import React, { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Student, TeacherConfig } from '../types';
import { getAppreciation } from '../lib/utils';

interface PrintableReportProps {
  students: Student[];
  className: string;
  teacherConfig: TeacherConfig;
  id?: string;
}

export const PrintableReport = forwardRef<HTMLDivElement, PrintableReportProps>(({ students, className, teacherConfig, id = "content-to-download" }, ref) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const totalStudents = students.length;
  const passingStudents = students.filter(s => (s.overallAverage || 0) >= 10).length;
  const classAverage = totalStudents > 0 
    ? (students.reduce((acc, s) => acc + (s.overallAverage || 0), 0) / totalStudents).toFixed(2)
    : "0.00";
  const successRate = totalStudents > 0 
    ? ((passingStudents / totalStudents) * 100).toFixed(2)
    : "0.00";
  
  const sortedByAverage = [...students].sort((a, b) => (b.overallAverage || 0) - (a.overallAverage || 0));
  const highestStudent = sortedByAverage[0];
  const lowestStudent = sortedByAverage[sortedByAverage.length - 1];

  const examAverage = totalStudents > 0 
    ? (students.reduce((acc, s) => {
        const g = Object.values(s.grades)[0] as any;
        return acc + (g?.exam || 0);
      }, 0) / totalStudents).toFixed(2)
    : "0.00";
  
  const examPassCount = students.filter(s => {
    const g = Object.values(s.grades)[0] as any;
    return (g?.exam || 0) >= 10;
  }).length;
  const examSuccessRate = totalStudents > 0 
    ? ((examPassCount / totalStudents) * 100).toFixed(2)
    : "0.00";

  // Pagination Logic
  const PAGE_1_LIMIT = 30; // First page has header and school info
  const PAGE_LIMIT = 45;   // Other pages have only table headers
  
  const studentChunks: Student[][] = [];
  const studentsCopy = [...students];
  
  if (studentsCopy.length > 0) {
    studentChunks.push(studentsCopy.splice(0, PAGE_1_LIMIT));
  }
  while (studentsCopy.length > 0) {
    studentChunks.push(studentsCopy.splice(0, PAGE_LIMIT));
  }

  // If the last chunk is almost full, the analysis stats might overflow.
  // Let's decide if stats need a new page.
  const lastChunkSize = studentChunks.length > 0 ? studentChunks[studentChunks.length - 1].length : 0;
  const statsNeedNewPage = lastChunkSize > (studentChunks.length === 1 ? PAGE_1_LIMIT - 12 : PAGE_LIMIT - 12);

  const TableColGroups = () => (
    <colgroup>
      <col style={{ width: '6%' }} />
      <col style={{ width: teacherConfig.hasPractical ? '18%' : '28%' }} />
      <col style={{ width: '10%' }} />
      {teacherConfig.hasPractical && <col style={{ width: '10%' }} />}
      <col style={{ width: '10%' }} />
      <col style={{ width: '10%' }} />
      <col style={{ width: '10%' }} />
      <col style={{ width: '16%' }} />
    </colgroup>
  );

  const TableHeader = () => (
    <thead style={{ display: 'table-header-group' }}>
      <tr style={{ backgroundColor: '#e5e7eb' }}>
         <th style={{ padding: '4px 2px', fontWeight: '900', border: '1px solid #000000', fontSize: '11px' }}>{t("rank_short")}</th>
         <th style={{ padding: '4px 2px', fontWeight: '900', border: '1px solid #000000', fontSize: '12px' }}>{t("name_label", "الاسم")}</th>
         <th style={{ padding: '4px 2px', fontWeight: '900', border: '1px solid #000000', fontSize: '11px' }}>{teacherConfig.hasPractical ? t("evaluation") : t("evaluation_merged", "النشاطات")}</th>
         {teacherConfig.hasPractical && <th style={{ padding: '4px 2px', fontWeight: '900', border: '1px solid #000000', fontSize: '11px' }}>{t("practical_short")}</th>}
         <th style={{ padding: '4px 2px', fontWeight: '900', border: '1px solid #000000', fontSize: '11px' }}>{t("quiz")}</th>
         <th style={{ padding: '4px 2px', fontWeight: '900', border: '1px solid #000000', fontSize: '11px' }}>{t("exam")}</th>
         <th style={{ padding: '4px 2px', fontWeight: '900', border: '1px solid #000000', backgroundColor: '#d1d5db', fontSize: '12px' }}>{t("average")}</th>
         <th style={{ padding: '4px 2px', fontWeight: '900', border: '1px solid #000000', fontSize: '12px' }}>{t("appreciation", "التقدير")}</th>
       </tr>
    </thead>
  );

  const renderTableRow = (student: Student, index: number) => {
    const mainGrade = (Object.values(student.grades)[0] || {}) as any;
    const appreciation = getAppreciation(student.overallAverage);
    
    return (
      <tr style={{ borderBottom: '1px solid #000000' }}>
        <td style={{ padding: '2px', fontWeight: '900', border: '1px solid #000000', fontSize: '12px', backgroundColor: '#f9fafb' }}>{index}</td>
        <td style={{ padding: '4px', fontWeight: '700', border: '1px solid #000000', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '11px', textAlign: isRTL ? 'right' : 'left' }}>{student.name}</td>
        <td style={{ padding: '2px', border: '1px solid #000000', fontSize: '11px' }}>{mainGrade.evaluation ?? '-'}</td>
        {teacherConfig.hasPractical && <td style={{ padding: '2px', border: '1px solid #000000', fontSize: '11px' }}>{mainGrade.practical ?? '-'}</td>}
        <td style={{ padding: '2px', border: '1px solid #000000', fontSize: '11px' }}>{mainGrade.quiz ?? '-'}</td>
        <td style={{ padding: '2px', border: '1px solid #000000', fontSize: '11px' }}>{mainGrade.exam ?? '-'}</td>
        <td style={{ padding: '2px', border: '1px solid #000000', fontWeight: '900', backgroundColor: '#f3f4f6', fontSize: '12px' }}>{student.overallAverage?.toFixed(2) || '-'}</td>
        <td style={{ padding: '2px', border: '1px solid #000000', fontWeight: '900', fontSize: '11px' }}>{appreciation}</td>
      </tr>
    );
  };

  const AnalysisSection = () => (
    <div style={{ backgroundColor: '#ffffff', padding: '16px', border: '2px solid #000000', borderRadius: '4px', width: '100%', marginTop: '16px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '12px', borderBottom: '2px solid #000000', paddingBottom: '6px' }}>{t("statistical_analysis_title")}</h3>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', padding: '4px 0', flexDirection: isRTL ? 'row' : 'row-reverse' }}>
        <span style={{ fontWeight: '900', fontSize: '13px' }}>{t("total_students")}</span>
        <span style={{ fontWeight: '900', fontSize: '13px' }}>{totalStudents}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', padding: '4px 0', flexDirection: isRTL ? 'row' : 'row-reverse' }}>
        <span style={{ fontWeight: '900', fontSize: '13px' }}>{t("passing_students_count")}</span>
        <span style={{ fontWeight: '900', fontSize: '13px' }}>{passingStudents}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', padding: '4px 0', flexDirection: isRTL ? 'row' : 'row-reverse' }}>
        <span style={{ fontWeight: '900', fontSize: '13px' }}>{t("class_average")}</span>
        <span style={{ fontWeight: '900', fontSize: '13px' }}>{classAverage}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #000000', padding: '4px 0', marginBottom: '16px', flexDirection: isRTL ? 'row' : 'row-reverse' }}>
        <span style={{ fontWeight: '900', fontSize: '13px' }}>{t("overall_success_rate")}</span>
        <span style={{ fontWeight: '900', fontSize: '13px', color: parseFloat(successRate) >= 50 ? '#059669' : '#dc2626' }}>%{successRate}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', padding: '4px 0', marginTop: '8px', flexDirection: isRTL ? 'row' : 'row-reverse' }}>
        <span style={{ fontWeight: '900', fontSize: '13px' }}>{t("highest_average_student")}</span>
        <span style={{ fontWeight: '900', fontSize: '13px' }}>{highestStudent?.name} ({highestStudent?.overallAverage?.toFixed(2)})</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #000000', padding: '4px 0', marginBottom: '16px', flexDirection: isRTL ? 'row' : 'row-reverse' }}>
        <span style={{ fontWeight: '900', fontSize: '13px' }}>{t("lowest_average_student")}</span>
        <span style={{ fontWeight: '900', fontSize: '13px' }}>{lowestStudent?.name} ({lowestStudent?.overallAverage?.toFixed(2)})</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', padding: '4px 0', marginTop: '8px', flexDirection: isRTL ? 'row' : 'row-reverse' }}>
        <span style={{ fontWeight: '900', fontSize: '13px' }}>{t("exam_class_average")}</span>
        <span style={{ fontWeight: '900', fontSize: '13px' }}>{examAverage}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #000000', padding: '4px 0', flexDirection: isRTL ? 'row' : 'row-reverse' }}>
        <span style={{ fontWeight: '900', fontSize: '13px' }}>{t("exam_success_rate_label")}</span>
        <span style={{ fontWeight: '900', fontSize: '13px', color: parseFloat(examSuccessRate) >= 50 ? '#059669' : '#dc2626' }}>%{examSuccessRate}</span>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <div ref={ref} id={id} className="w-[800px] font-sans mx-auto" dir={isRTL ? "rtl" : "ltr"} style={{ color: '#000000' }}>
        {studentChunks.map((chunk, index) => {
          const isFirstPage = index === 0;
          const isLastChunk = index === studentChunks.length - 1;
          const showStatsHere = isLastChunk && !statsNeedNewPage;

          return (
            <div 
              key={`page-${index}`} 
              className="pdf-page bg-white p-10 relative" 
              style={{ minHeight: '1120px', marginBottom: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            >
              {isFirstPage && (
                <>
                  {/* Main Header */}
                  <div style={{ backgroundColor: '#f3f4f6', padding: '12px', textAlign: 'center', marginBottom: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <h1 style={{ fontSize: '20px', fontWeight: '900', margin: '0', color: '#111827' }}>{t("report_header_title")}</h1>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '8px', fontSize: '14px', fontWeight: '700', color: '#4b5563' }}>
                      <span>{t("subject_label")} {teacherConfig.subject}</span>
                      <span>{t("teacher_label")} {teacherConfig.name}</span>
                    </div>
                  </div>

                  {/* School Info Header */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '6px' }}>
                      {t("high_school_label")} {teacherConfig.institution} ..................... {t("class_label_small")} {className === 'ALL' ? '............' : className}
                    </h2>
                    <p style={{ fontSize: '13px', fontWeight: '700' }}>{t("academic_year_label")} {teacherConfig.academicYear}</p>
                  </div>
                </>
              )}

              {/* Table */}
              <table style={{ width: '100%', textAlign: 'center', borderCollapse: 'collapse', border: '2px solid #000000', fontSize: '14px', tableLayout: 'fixed' }}>
                <TableColGroups />
                {isFirstPage && <TableHeader />}
                <tbody>
                  {chunk.map((student, innerIndex) => {
                    const globalIndex = studentChunks.slice(0, index).reduce((acc, c) => acc + c.length, 0) + innerIndex + 1;
                    return <React.Fragment key={student.id}>{renderTableRow(student, globalIndex)}</React.Fragment>;
                  })}
                </tbody>
              </table>

              {/* Render Stats if it fits */}
              {showStatsHere && <AnalysisSection />}
              
              {/* Page Number */}
              <div style={{ position: 'absolute', bottom: '20px', left: '0', right: '0', textAlign: 'center', fontSize: '12px', color: '#6b7280' }}>
                {t("page")} {index + 1}
              </div>
            </div>
          );
        })}

        {/* Extra page for stats if it didn't fit */}
        {statsNeedNewPage && (
          <div className="pdf-page bg-white p-10 relative" style={{ minHeight: '1120px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
            <AnalysisSection />
            <div style={{ position: 'absolute', bottom: '20px', left: '0', right: '0', textAlign: 'center', fontSize: '12px', color: '#6b7280' }}>
              {t("page")} {studentChunks.length + 1}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

PrintableReport.displayName = 'PrintableReport';
