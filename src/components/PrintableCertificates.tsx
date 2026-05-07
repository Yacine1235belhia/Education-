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
              className="absolute inset-[30px] border-[12px] border-double rounded-[36px] z-10 pointer-events-none"
              style={{ borderColor: '#ca8a04', opacity: 0.9 }}
            ></div>
            
            {/* Inner Border */}
            <div 
              className="absolute inset-[60px] border-2 rounded-[24px] z-10 pointer-events-none"
              style={{ borderColor: '#d97706', opacity: 0.3 }}
            ></div>

            {/* Corner Arabic Ornate SVGs */}
            <div className="absolute top-10 left-10 w-24 h-24 border-t-8 border-l-8 rounded-tl-[40px] z-20" style={{ borderColor: '#b45309' }}></div>
            <div className="absolute top-10 right-10 w-24 h-24 border-t-8 border-r-8 rounded-tr-[40px] z-20" style={{ borderColor: '#b45309' }}></div>
            <div className="absolute bottom-10 left-10 w-24 h-24 border-b-8 border-l-8 rounded-bl-[40px] z-20" style={{ borderColor: '#b45309' }}></div>
            <div className="absolute bottom-10 right-10 w-24 h-24 border-b-8 border-r-8 rounded-br-[40px] z-20" style={{ borderColor: '#b45309' }}></div>

            {/* Subtle central watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] z-0">
              <svg width="600" height="600" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
            </div>

            <div className="relative z-30 w-full px-32 pt-16 pb-12 flex flex-col items-center justify-between h-full">
               
                {/* Headers */}
                <div className="flex flex-col items-center space-y-2">
                  <h1 className="text-2xl font-black tracking-[0.2em] text-slate-800">الجمهورية الجزائرية الديمقراطية الشعبية</h1>
                  <h2 className="text-lg font-bold text-slate-600">وزارة التربية الوطنية</h2>
                  <div className="flex items-center gap-10 text-base font-black text-slate-700 mt-2">
                     <div className="bg-slate-50 px-5 py-1.5 rounded-lg border border-slate-100 flex gap-2">
                        <span className="text-slate-400">مديرية التربية لولاية:</span>
                        <span className="text-slate-900">{teacherConfig.province || "........"}</span>
                     </div>
                     <div className="bg-slate-50 px-5 py-1.5 rounded-lg border border-slate-100 flex gap-2">
                        <span className="text-slate-400">المؤسسة:</span>
                        <span className="text-slate-900">{teacherConfig.institution}</span>
                     </div>
                  </div>
                </div>
               
                {/* Main Title */}
                <div className="py-2">
                  <h1 className="text-7xl font-black text-yellow-600 drop-shadow-sm mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    شهادة تقدير و تفوق
                  </h1>
                  <div className="flex items-center justify-center gap-4">
                     <div className="h-0.5 w-32 bg-yellow-600 opacity-30"></div>
                     <div className="bg-yellow-500 rounded-full p-2 shadow-md">
                        <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                     </div>
                     <div className="h-0.5 w-32 bg-yellow-600 opacity-30"></div>
                  </div>
                </div>

                {/* Appreciation text */}
                <div className="my-2">
                  <p className="text-2xl text-slate-700 leading-relaxed text-center max-w-4xl font-bold px-10">
                    إلى من أثبت(ت) أن العقل هو المحرك الأول للإبداع ؛ يسرني أنا الأستاذ(ة) <span className="text-3xl font-black text-slate-900 mx-1">{teacherConfig.name}</span> أن أكافئ التلميذ (ة):
                  </p>
                </div>

                {/* Student Name */}
                <div className="w-full max-w-4xl py-2">
                   <h2 className="text-6xl font-black text-slate-900 py-6 px-16 bg-gradient-to-r from-transparent via-yellow-100/30 to-transparent border-y-2 border-yellow-200/10">
                     {student.name}
                   </h2>
                </div>
                
                {/* Achievement Details */}
                <div className="mb-2">
                  <p className="text-xl text-slate-700 leading-loose max-w-3xl text-center font-bold">
                    لتميزه (ها) في مادة <span className="text-2xl font-black text-emerald-700 mx-1">{teacherConfig.subject}</span> ، متمنياً لك مستقبلاً مشرقاً يليق بذكائك
                  </p>
                </div>

                {/* Quote */}
                <div className="mb-4 text-center bg-emerald-50/40 px-12 py-3 rounded-2xl border border-emerald-100">
                  <p className="text-3xl font-black text-emerald-800 tracking-tight">"ثابر.. فالعالم ينتظر بصمتك الخاصة"</p>
                </div>

               {/* Footer Signatures */}
                <div className="flex w-full justify-between items-end px-16">
                   <div className="text-center w-[260px] p-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/20">
                     <p className="text-xl font-bold text-slate-800 mb-2">حرر بتاريخ</p>
                     <p className="text-xl font-black text-slate-700" dir="ltr">{new Date().toLocaleDateString('ar-DZ', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                   </div>
                   
                   {/* Decorative Seal */}
                   <div className="relative">
                     <div className="w-28 h-28 rounded-full border-4 border-yellow-500 bg-white flex items-center justify-center shadow-lg -rotate-12 z-40 relative">
                        <span className="text-yellow-600 font-extrabold text-lg text-center leading-tight">تفوق<br/>و<br/>نجاح</span>
                     </div>
                     <div className="absolute -inset-1 rounded-full border border-yellow-200 animate-pulse opacity-40"></div>
                   </div>
  
                   <div className="text-center w-[260px] p-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/20">
                     <p className="text-xl font-bold text-slate-800 mb-2">توقيع الأستاذ(ة)</p>
                     <p className="text-2xl font-black text-slate-900 font-serif italic">{teacherConfig.name}</p>
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
