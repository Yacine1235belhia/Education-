import React, { forwardRef } from 'react';
import { Student, TeacherConfig } from '../types';

interface PrintableCertificatesProps {
  students: Student[];
  teacherConfig: TeacherConfig;
}

export const PrintableCertificates = forwardRef<HTMLDivElement, PrintableCertificatesProps>(({ students, teacherConfig }, ref) => {
  // Top students (average >= 15)
  const topStudents = [...students]
    .filter(s => (s.overallAverage || 0) >= 15)
    .sort((a, b) => (b.overallAverage || 0) - (a.overallAverage || 0));

  return (
    <div className="w-[1123px] mx-auto"> 
      <div ref={ref} id="certificates-to-download" className="w-full bg-white relative">
        {topStudents.map((student, index) => (
          <div 
            key={student.id} 
            className="pdf-page w-[1123px] h-[794px] p-8 relative flex flex-col items-center justify-center text-center overflow-hidden mb-12 shadow-2xl border border-slate-200"
            style={{ 
              pageBreakAfter: 'always',
              backgroundColor: '#ffffff',
              boxSizing: 'border-box'
            }}
            dir="rtl"
          >
            {/* Elegant Outer Border Pattern */}
            <div 
              className="absolute inset-8 border-[12px] border-double rounded-3xl z-10 pointer-events-none"
              style={{ borderColor: '#ca8a04', opacity: 0.9 }}
            ></div>
            
            {/* Inner Border */}
            <div 
              className="absolute inset-[3rem] border-2 rounded-xl z-10 pointer-events-none"
              style={{ borderColor: '#d97706', opacity: 0.6 }}
            ></div>

            {/* Corner Arabic Ornate SVGs (simulated with CSS circles for now, but stylized) */}
            <div className="absolute top-6 left-6 w-20 h-20 border-t-8 border-l-8 rounded-tl-full z-20" style={{ borderColor: '#b45309' }}></div>
            <div className="absolute top-6 right-6 w-20 h-20 border-t-8 border-r-8 rounded-tr-full z-20" style={{ borderColor: '#b45309' }}></div>
            <div className="absolute bottom-6 left-6 w-20 h-20 border-b-8 border-l-8 rounded-bl-full z-20" style={{ borderColor: '#b45309' }}></div>
            <div className="absolute bottom-6 right-6 w-20 h-20 border-b-8 border-r-8 rounded-br-full z-20" style={{ borderColor: '#b45309' }}></div>

            {/* Subtle central watermark representing learning (a book icon/star) */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] z-0">
              <svg width="400" height="400" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
              </svg>
            </div>

            <div className="relative z-30 w-full px-24 flex flex-col items-center justify-center h-full">
               
               {/* Headers */}
               <div className="flex flex-col items-center space-y-1 mb-6">
                 <h1 className="text-xl md:text-2xl font-black tracking-widest text-slate-800">الجمهورية الجزائرية الديمقراطية الشعبية</h1>
                 <h2 className="text-base md:text-lg font-bold text-slate-600">وزارة التربية الوطنية</h2>
                 <div className="flex items-center gap-8 text-sm md:text-base font-bold text-slate-700 mt-2">
                    <p>مديرية التربية لولاية {teacherConfig.province || "........"}</p>
                    <p>{teacherConfig.institution}</p>
                 </div>
                 <div className="w-64 h-0.5 bg-yellow-600 my-4 opacity-30"></div>
               </div>
               
               {/* Main Title */}
               <div className="py-6 mb-4">
                 <h1 className="text-8xl font-black text-yellow-600 drop-shadow-sm mb-4" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                   شهادة تقدير و تفوق
                 </h1>
                 <div className="flex items-center justify-center gap-4">
                    <div className="h-0.5 w-16 bg-yellow-600"></div>
                    <svg className="w-6 h-6 text-yellow-600 fill-current" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                    <div className="h-0.5 w-16 bg-yellow-600"></div>
                 </div>
               </div>

               {/* Appreciation text */}
               <p className="text-xl md:text-2xl text-slate-700 leading-relaxed text-center max-w-4xl font-bold mb-8 px-10">
                 إلى من أثبت(ت) أن العقل هو المحرك الأول للإبداع ؛ يسرني أنا الأستاذ(ة) <span className="text-2xl md:text-3xl font-black text-slate-900 mx-1">{teacherConfig.name}</span> أن أكافئ التلميذ (ة):
               </p>

               {/* Student Name */}
               <h2 className="text-5xl md:text-6xl font-black text-slate-900 py-6 px-16 bg-gradient-to-r from-transparent via-yellow-100 to-transparent mb-8">
                 {student.name}
               </h2>
               
               {/* Achievement Details */}
               <p className="text-lg md:text-xl text-slate-700 leading-loose max-w-3xl text-center font-bold mb-8">
                 لتميزه (ها) في مادة <span className="text-xl md:text-2xl font-black text-emerald-700 mx-1">{teacherConfig.subject}</span> ، متمنياً لك مستقبلاً مشرقاً يليق بذكائك
               </p>

               {/* Quote */}
               <div className="mb-12 text-center">
                 <p className="text-2xl md:text-3xl font-black text-emerald-800 tracking-tight">"ثابر.. فالعالم ينتظر بصمتك الخاصة"</p>
               </div>

               {/* Footer Signatures */}
               <div className="flex w-full justify-between items-end px-20 mt-auto">
                  <div className="text-center w-64 pt-6 border-t-2 border-slate-300">
                    <p className="text-xl font-bold text-slate-800">حرر بتاريخ</p>
                    <p className="text-xl font-bold text-slate-600 mt-2" dir="ltr">{new Date().toLocaleDateString('ar-DZ')}</p>
                  </div>
                  
                  {/* Decorative Seal Placeholder */}
                  <div className="w-24 h-24 rounded-full border-4 border-yellow-500 bg-yellow-50 flex items-center justify-center opacity-80 rotate-12">
                     <span className="text-yellow-600 font-bold text-sm text-center">تفوق<br/>و<br/>نجاح</span>
                  </div>
 
                  <div className="text-center w-64 pt-6 border-t-2 border-slate-300">
                    <p className="text-xl font-bold text-slate-800">توقيع الأستاذ(ة)</p>
                    <p className="text-2xl font-black text-slate-900 font-serif italic mt-2">{teacherConfig.name}</p>
                  </div>
               </div>
            </div>
          </div>
        ))}

        {topStudents.length === 0 && (
          <div className="pdf-page w-[1123px] h-[794px] flex items-center justify-center p-12 text-center text-4xl font-bold text-slate-500">
            لا يوجد تلاميذ بمعدل ممتاز (15 فما فوق) في هذه القائمة.
          </div>
        )}
      </div>
    </div>
  );
});

PrintableCertificates.displayName = 'PrintableCertificates';
