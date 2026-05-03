import React, { forwardRef } from 'react';
import { Student } from '../types';

interface PrintableReportProps {
  students: Student[];
  className: string;
}

export const PrintableReport = forwardRef<HTMLDivElement, PrintableReportProps>(({ students, className }, ref) => {
  return (
    <div className="absolute top-[-9999px] left-[-9999px] w-[1000px]">
      <div ref={ref} id="content-to-download" className="p-10 w-full" dir="rtl" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
        <div className="text-center mb-8 pb-4" style={{ borderBottom: '2px solid #000000' }}>
          <h1 className="text-3xl font-black mb-2">الجمهورية الجزائرية الديمقراطية الشعبية</h1>
          <h2 className="text-2xl font-bold mb-4">كشف النقاط التحليلي للمادة</h2>
          <div className="flex justify-between items-center text-lg font-bold">
            <div>القسم: {className === 'ALL' ? 'جميع الأقسام' : className}</div>
            <div>تاريخ الطبع: {new Date().toLocaleDateString('ar-DZ')}</div>
            <div>الأستاذ: بلحية ياسين</div>
          </div>
        </div>
        
        <table className="w-full text-right border-collapse mb-8 mt-4" style={{ border: '1px solid #000000' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc' }}>
               <th className="px-4 py-3 font-bold" style={{ border: '1px solid #000000' }}>الرتبة</th>
               <th className="px-4 py-3 font-bold" style={{ border: '1px solid #000000' }}>رقم التعريف</th>
               <th className="px-4 py-3 font-bold text-right" style={{ width: '30%', border: '1px solid #000000' }}>الاسم واللقب</th>
               <th className="px-4 py-3 font-bold text-center" style={{ border: '1px solid #000000' }}>التقويم</th>
               <th className="px-4 py-3 font-bold text-center" style={{ border: '1px solid #000000' }}>أعمال تطبيقية</th>
               <th className="px-4 py-3 font-bold text-center" style={{ border: '1px solid #000000' }}>معدل الفروض</th>
               <th className="px-4 py-3 font-bold text-center" style={{ border: '1px solid #000000' }}>الاختبار</th>
               <th className="px-4 py-3 font-bold text-center" style={{ border: '1px solid #000000' }}>المعدل النهائي</th>
               <th className="px-4 py-3 font-bold text-center" style={{ border: '1px solid #000000' }}>الملاحظة</th>
             </tr>
          </thead>
          <tbody>
            {students.map((student, i) => {
              const mainGrade = (Object.values(student.grades)[0] || {}) as any;
              return (
                <tr key={student.id} className="text-sm">
                  <td className="px-4 py-2 font-bold text-center" style={{ border: '1px solid #000000' }}>{student.rank || '-'}</td>
                  <td className="px-4 py-2 font-mono text-center" style={{ border: '1px solid #000000' }}>{student.studentNumber || '-'}</td>
                  <td className="px-4 py-2 font-bold text-right" style={{ border: '1px solid #000000' }}>{student.name}</td>
                  <td className="px-4 py-2 text-center font-mono" style={{ border: '1px solid #000000' }}>{mainGrade.evaluation ?? '-'}</td>
                  <td className="px-4 py-2 text-center font-mono" style={{ border: '1px solid #000000' }}>{mainGrade.practical ?? '-'}</td>
                  <td className="px-4 py-2 text-center font-mono" style={{ border: '1px solid #000000' }}>{mainGrade.quiz ?? '-'}</td>
                  <td className="px-4 py-2 text-center font-mono" style={{ border: '1px solid #000000' }}>{mainGrade.exam ?? '-'}</td>
                  <td className="px-4 py-2 text-center font-black font-mono text-base" style={{ border: '1px solid #000000' }}>{student.overallAverage?.toFixed(2) || '-'}</td>
                  <td className="px-4 py-2 text-center font-bold text-[10px]" style={{ border: '1px solid #000000' }}>{student.observations || '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="flex justify-between items-start mt-12 text-sm font-bold px-8">
          <div className="text-center">
            <p>توقيع الأستاذ</p>
            <div className="h-20"></div>
          </div>
          <div className="text-center">
            <p>توقيع الإدارة (المدير / الناظر)</p>
            <div className="h-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
});

PrintableReport.displayName = 'PrintableReport';
