import React, { forwardRef } from 'react';
import { Student } from '../types';

interface PrintableSingleReportProps {
  student: Student;
  analysis?: string;
}

export const PrintableSingleReport = forwardRef<HTMLDivElement, PrintableSingleReportProps>(({ student, analysis }, ref) => {
  const mainGrade = (Object.values(student.grades)[0] || {}) as any;
  
  return (
    <div className="hidden">
      <div ref={ref} className="p-10 w-full bg-white text-slate-800" dir="rtl">
        <div className="text-center mb-10 border-b-2 border-slate-800 pb-6">
          <h1 className="text-3xl font-black mb-2">الجمهورية الجزائرية الديمقراطية الشعبية</h1>
          <h2 className="text-2xl font-bold mb-4">كشف نقاط المادة التحليلي (فردي)</h2>
          <div className="flex justify-between items-center text-lg font-bold">
            <div>القسم: {student.className}</div>
            <div>تاريخ الطبع: {new Date().toLocaleDateString('ar-DZ')}</div>
            <div>الأستاذ: بلحية ياسين</div>
          </div>
        </div>
        
        <div className="mb-10 text-xl">
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="font-bold border p-4">الاسم واللقب: {student.name}</div>
            <div className="font-bold border p-4">رقم التعريف: {student.studentNumber || '-'}</div>
            <div className="font-bold border p-4">الرتبة في القسم: {student.rank || '-'}</div>
            <div className="font-bold border p-4">المعدل النهائي: {student.overallAverage?.toFixed(2) || '-'}</div>
          </div>
          
          <table className="w-full text-center border-collapse border border-slate-800 mb-8 mt-4">
            <thead>
              <tr className="bg-slate-200">
                <th className="border border-slate-800 px-4 py-3 font-bold">التقويم</th>
                <th className="border border-slate-800 px-4 py-3 font-bold">أعمال تطبيقية</th>
                <th className="border border-slate-800 px-4 py-3 font-bold">معدل الفروض</th>
                <th className="border border-slate-800 px-4 py-3 font-bold">الاختبار</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-xl">
                <td className="border border-slate-800 px-4 py-4 font-mono font-bold">{mainGrade.evaluation ?? '-'}</td>
                <td className="border border-slate-800 px-4 py-4 font-mono font-bold">{mainGrade.practical ?? '-'}</td>
                <td className="border border-slate-800 px-4 py-4 font-mono font-bold">{mainGrade.quiz ?? '-'}</td>
                <td className="border border-slate-800 px-4 py-4 font-mono font-bold">{mainGrade.exam ?? '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {analysis && (
          <div className="mt-8 border border-slate-800 p-6 rounded-lg bg-slate-50">
            <h3 className="text-xl font-bold mb-4 underline decoration-2">تحليل وتوجيهات الأستاذ الذكي:</h3>
            <div className="text-base leading-relaxed whitespace-pre-wrap">{analysis}</div>
          </div>
        )}

        <div className="flex justify-between items-start mt-16 text-lg font-bold px-12">
          <div className="text-center">
            <p>توقيع الأستاذ</p>
            <div className="h-24"></div>
          </div>
          <div className="text-center">
            <p>توقيع الإدارة</p>
            <div className="h-24"></div>
          </div>
          <div className="text-center">
            <p>توقيع الولي</p>
            <div className="h-24"></div>
          </div>
        </div>
      </div>
    </div>
  );
});

PrintableSingleReport.displayName = 'PrintableSingleReport';
