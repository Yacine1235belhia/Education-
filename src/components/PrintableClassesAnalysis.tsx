import React, { forwardRef } from 'react';
import { Student, TeacherConfig } from '../types';

interface PrintableClassesAnalysisProps {
  students: Student[];
  teacherConfig: TeacherConfig;
  id?: string;
}

export const PrintableClassesAnalysis = forwardRef<HTMLDivElement, PrintableClassesAnalysisProps>(({ students, teacherConfig, id = "preview-classes-analysis-id" }, ref) => {
  // Group students by class
  const classGroups = students.reduce((acc, student) => {
    const className = student.className || 'بدون قسم';
    if (!acc[className]) {
      acc[className] = [];
    }
    acc[className].push(student);
    return acc;
  }, {} as Record<string, Student[]>);

  type ClassStat = {
    className: string;
    total: number;
    passing: number;
    successRate: string;
    average: string;
    highest: string;
    lowest: string;
  };

  const classStats: ClassStat[] = Object.keys(classGroups).map(className => {
    const classStudents = classGroups[className];
    const total = classStudents.length;
    const passing = classStudents.filter(s => (s.overallAverage || 0) >= 10).length;
    
    const classAverage = total > 0 
      ? (classStudents.reduce((sum, s) => sum + (s.overallAverage || 0), 0) / total).toFixed(2)
      : "0.00";
    
    const successRate = total > 0 
      ? ((passing / total) * 100).toFixed(2)
      : "0.00";
      
    const highest = classStudents.reduce((max, s) => Math.max(max, s.overallAverage || 0), 0).toFixed(2);
    const lowest = classStudents.reduce((min, s) => Math.min(min, s.overallAverage || 20), 20).toFixed(2);

    return {
      className,
      total,
      passing,
      successRate,
      average: classAverage,
      highest,
      lowest: total > 0 ? lowest : "0.00"
    };
  });

  // Calculate overall stats
  const totalStudents = students.length;
  const passingStudents = students.filter(s => (s.overallAverage || 0) >= 10).length;
  const globalAverage = totalStudents > 0 
    ? (students.reduce((acc, s) => acc + (s.overallAverage || 0), 0) / totalStudents).toFixed(2)
    : "0.00";
  const globalSuccessRate = totalStudents > 0 
    ? ((passingStudents / totalStudents) * 100).toFixed(2)
    : "0.00";

  return (
    <div className="w-full">
      <div ref={ref} id={id} className="w-[800px] font-sans mx-auto pdf-page bg-white dark:bg-[#050505] p-10 relative" dir="rtl" style={{ color: '#000000', minHeight: '1120px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
        
        {/* Main Header */}
        <div style={{ backgroundColor: '#f3f4f6', padding: '12px', textAlign: 'center', marginBottom: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '900', margin: '0', color: '#111827' }}>التحليل الإحصائي العام للنتائج</h1>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '8px', fontSize: '14px', fontWeight: '700', color: '#4b5563' }}>
            <span>المادة: {teacherConfig.subject}</span>
            <span>الأستاذ(ة): {teacherConfig.name}</span>
          </div>
        </div>

        {/* School Info Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '6px' }}>
            ثانوية: {teacherConfig.institution}
          </h2>
          <p style={{ fontSize: '13px', fontWeight: '700' }}>السنة الدراسية: {teacherConfig.academicYear}</p>
        </div>

        {/* Table */}
        <table style={{ width: '100%', textAlign: 'center', borderCollapse: 'collapse', border: '2px solid #000000', fontSize: '13px', tableLayout: 'fixed', marginBottom: '20px' }}>
          <thead style={{ display: 'table-header-group' }}>
            <tr style={{ backgroundColor: '#e5e7eb' }}>
               <th style={{ padding: '6px 4px', fontWeight: '900', border: '1px solid #000000', width: '25%' }}>القسم</th>
               <th style={{ padding: '6px 4px', fontWeight: '900', border: '1px solid #000000', width: '15%' }}>عدد التلاميذ</th>
               <th style={{ padding: '6px 4px', fontWeight: '900', border: '1px solid #000000', width: '12%' }}>الناجحين</th>
               <th style={{ padding: '6px 4px', fontWeight: '900', border: '1px solid #000000', width: '12%' }}>نسبة النجاح</th>
               <th style={{ padding: '6px 4px', fontWeight: '900', border: '1px solid #000000', width: '12%' }}>أعلى معدل</th>
               <th style={{ padding: '6px 4px', fontWeight: '900', border: '1px solid #000000', width: '12%' }}>أدنى معدل</th>
               <th style={{ padding: '6px 4px', fontWeight: '900', border: '1px solid #000000', width: '12%', backgroundColor: '#d1d5db' }}>معدل القسم</th>
             </tr>
          </thead>
          <tbody>
            {classStats.map((stat, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #000000' }}>
                <td style={{ padding: '6px 4px', fontWeight: '700', border: '1px solid #000000' }}>{stat.className}</td>
                <td style={{ padding: '6px 4px', fontWeight: '700', border: '1px solid #000000' }}>{stat.total}</td>
                <td style={{ padding: '6px 4px', border: '1px solid #000000' }}>{stat.passing}</td>
                <td style={{ padding: '6px 4px', border: '1px solid #000000', fontWeight: '700', color: parseFloat(stat.successRate) >= 50 ? '#059669' : '#dc2626' }}>%{stat.successRate}</td>
                <td style={{ padding: '6px 4px', border: '1px solid #000000' }}>{stat.highest}</td>
                <td style={{ padding: '6px 4px', border: '1px solid #000000' }}>{stat.lowest}</td>
                <td style={{ padding: '6px 4px', border: '1px solid #000000', fontWeight: '900', backgroundColor: '#f3f4f6' }}>{stat.average}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Global Summary */}
        <div style={{ backgroundColor: '#ffffff', padding: '16px', border: '2px solid #000000', borderRadius: '4px', width: '100%', marginTop: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '12px', borderBottom: '2px solid #000000', paddingBottom: '6px' }}>الحصيلة العامة لجميع الأقسام:</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', padding: '6px 0' }}>
            <span style={{ fontWeight: '900', fontSize: '14px' }}>العدد الإجمالي للتلاميذ والممتحنين:</span>
            <span style={{ fontWeight: '900', fontSize: '14px' }}>{totalStudents} تلميذ</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', padding: '6px 0' }}>
            <span style={{ fontWeight: '900', fontSize: '14px' }}>إجمالي عدد الناجحين:</span>
            <span style={{ fontWeight: '900', fontSize: '14px' }}>{passingStudents} تلميذ</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #000000', padding: '6px 0', marginBottom: '16px' }}>
            <span style={{ fontWeight: '900', fontSize: '14px' }}>المعدل العام للمادة:</span>
            <span style={{ fontWeight: '900', fontSize: '14px' }}>{globalAverage}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', border: '2px dashed #059669', borderRadius: '4px', backgroundColor: '#ecfdf5' }}>
            <span style={{ fontWeight: '900', fontSize: '15px', color: '#065f46' }}>نسبة النجاح العامة:</span>
            <span style={{ fontWeight: '900', fontSize: '15px', color: parseFloat(globalSuccessRate) >= 50 ? '#059669' : '#dc2626' }}>%{globalSuccessRate}</span>
          </div>
        </div>

      </div>
    </div>
  );
});

PrintableClassesAnalysis.displayName = 'PrintableClassesAnalysis';
