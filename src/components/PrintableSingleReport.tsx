import React, { forwardRef } from 'react';
import { BookOpen } from 'lucide-react';
import { Student, TeacherConfig } from '../types';
import { getFixedPedagogicalAnalysis } from '../services/pedagogicalService';

interface PrintableSingleReportProps {
  student: Student;
  teacherConfig: TeacherConfig;
}

export const PrintableSingleReport = forwardRef<HTMLDivElement, PrintableSingleReportProps>(({ student, teacherConfig }, ref) => {
  const mainGrade = (Object.values(student.grades)[0] || {}) as any;
  
  return (
    <div className="w-full">
      <div ref={ref} id="single-report-download" className="p-10 w-full pdf-page" style={{ backgroundColor: '#ffffff', color: '#1e293b' }} dir="rtl">
        <div className="text-center mb-10 pb-6" style={{ borderBottom: '4px solid #065f46' }}>
          <div className="flex justify-between items-start mb-6">
            <div className="text-right text-xs font-bold space-y-1">
              <p>وزارة التربية الوطنية</p>
              <p>مديرية التربية لولاية ............</p>
              <p>{teacherConfig.institution}</p>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-black mb-1">الجمهورية الجزائرية الديمقراطية الشعبية</h1>
              <h2 className="text-sm font-bold" style={{ color: '#64748b' }}>{teacherConfig.subject} ({teacherConfig.level})</h2>
            </div>
            <div className="text-left text-xs font-bold">
               <p>السنة الدراسية: {teacherConfig.academicYear}</p>
            </div>
          </div>
          <h2 className="text-3xl font-black mb-4 py-2 rounded-xl inline-block px-12 italic" style={{ backgroundColor: '#ecfdf5', color: '#065f46', border: '1px solid #d1fae5' }}>بطاقة متابعة النتائج المدرسية</h2>
          <div className="flex justify-between items-center text-sm font-black mt-4 px-4" style={{ color: '#64748b' }}>
            <div className="flex items-center gap-2">القسم: <span style={{ color: '#0f172a' }}>{student.className}</span></div>
            <div className="flex items-center gap-2">تاريخ الإصدار: <span className="font-mono" style={{ color: '#0f172a' }} dir="ltr">{new Date().toLocaleDateString('ar-DZ')}</span></div>
            <div className="flex items-center gap-2">الأستاذ: <span style={{ color: '#047857' }}>{teacherConfig.name}</span></div>
          </div>
        </div>
        
        <div className="mb-10 text-xl space-y-8">
          <div className="grid grid-cols-2 gap-px rounded-2xl overflow-hidden shadow-sm" style={{ backgroundColor: '#e2e8f0', border: '1px solid #e2e8f0' }}>
            <div className="p-5 flex flex-col gap-1" style={{ backgroundColor: '#f8fafc' }}>
              <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#94a3b8' }}>الاسم واللقب</span>
              <span className="font-black text-2xl uppercase tracking-tight" style={{ color: '#0f172a' }}>{student.name}</span>
            </div>
            <div className="p-5 flex flex-col gap-1" style={{ backgroundColor: '#ffffff' }}>
              <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#94a3b8' }}>رقم التعريف</span>
              <span className="font-mono font-black italic" style={{ color: '#475569' }}>{student.studentNumber || '-'}</span>
            </div>
            <div className="p-5 flex flex-col gap-1" style={{ backgroundColor: '#ffffff' }}>
              <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#94a3b8' }}>الرتبة في القسم</span>
              <span className="font-black text-3xl font-mono" style={{ color: '#0f172a' }}>{student.rank || '-'}</span>
            </div>
            <div className="p-5 flex flex-col gap-1" style={{ backgroundColor: '#059669', color: '#ffffff' }}>
              <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#d1fae5' }}>المعدل النهائي للمادة</span>
              <span className="font-black text-4xl font-mono">{student.overallAverage?.toFixed(2) || '-'}</span>
            </div>
          </div>
          
          <div className="space-y-4">
             <h3 className="text-lg font-black flex items-center gap-2" style={{ color: '#1e293b' }}>
               <div className="w-1.5 h-5 rounded-full" style={{ backgroundColor: '#10b981' }} />
               تفاصيل العلامات المحصل عليها
             </h3>
             <table className="w-full text-center border-collapse mb-8 overflow-hidden rounded-2xl" style={{ border: '2px solid #000000', fontSize: '16px' }}>
              <thead>
                <tr style={{ backgroundColor: '#1e293b', color: '#ffffff' }}>
                   <th className="px-6 py-4 font-black uppercase tracking-widest text-xs" style={{ border: '1px solid #1e293b' }}>التقويم</th>
                   {teacherConfig.hasPractical && (
                     <th className="px-6 py-4 font-black uppercase tracking-widest text-xs" style={{ border: '1px solid #1e293b' }}>أعمال تطبيقية</th>
                   )}
                   <th className="px-6 py-4 font-black uppercase tracking-widest text-xs" style={{ border: '1px solid #1e293b' }}>معدل الفروض</th>
                   <th className="px-6 py-4 font-black uppercase tracking-widest text-xs" style={{ border: '1px solid #1e293b' }}>الاختبار المستحق</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-3xl font-black font-mono">
                   <td className="px-6 py-8" style={{ border: '1px solid #e2e8f0' }}>{mainGrade.evaluation ?? '-'}</td>
                   {teacherConfig.hasPractical && (
                     <td className="px-6 py-8" style={{ border: '1px solid #e2e8f0' }}>{mainGrade.practical ?? '-'}</td>
                   )}
                   <td className="px-6 py-8" style={{ border: '1px solid #e2e8f0' }}>{mainGrade.quiz ?? '-'}</td>
                   <td className="px-6 py-8" style={{ border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>{mainGrade.exam ?? '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 p-8 rounded-3xl relative overflow-hidden mb-6" style={{ border: '2px solid #64748b', backgroundColor: '#f8fafc' }}>
            <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: '#64748b' }} />
            <h3 className="text-xl font-black mb-4 flex items-center gap-2 italic" style={{ color: '#1e293b' }}>
                <BookOpen className="w-5 h-5" />
                التحليل والتوجيهات البيداغوجية:
            </h3>
            <div className="text-lg leading-relaxed font-bold whitespace-pre-wrap leading-relaxed" style={{ color: '#334155' }}>
                {getFixedPedagogicalAnalysis(student, teacherConfig)}
            </div>
        </div>

        <div className="flex justify-between items-start mt-20 text-sm font-black px-4 uppercase tracking-widest" style={{ color: '#94a3b8' }}>
          <div className="text-center space-y-12">
            <p>توقيع وموافقة الأستاذ</p>
            <p className="text-xl italic" style={{ color: '#065f46' }}>{teacherConfig.name}</p>
          </div>
          <div className="text-center space-y-12">
            <p>ختم وتوقيع الإدارة المدرسية</p>
            <div className="w-32 h-32 border-2 rounded-full border-dashed flex items-center justify-center text-[10px] opacity-20" style={{ borderColor: '#f1f5f9' }}>الختم هنا</div>
          </div>
          <div className="text-center space-y-12">
            <p>ملاحظة وتوقيع ولي الأمر</p>
            <div className="w-40 border-b pt-16" style={{ borderColor: '#cbd5e1' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
});

PrintableSingleReport.displayName = 'PrintableSingleReport';
