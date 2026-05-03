import React, { forwardRef } from 'react';
import { Student } from '../types';

interface PrintableCertificatesProps {
  students: Student[];
}

export const PrintableCertificates = forwardRef<HTMLDivElement, PrintableCertificatesProps>(({ students }, ref) => {
  // Sort students by average descending, and filter top ones (average >= 15 or top 3)
  const topStudents = [...students]
    .filter(s => (s.overallAverage || 0) >= 15) // Example criteria: average >= 15
    .sort((a, b) => (b.overallAverage || 0) - (a.overallAverage || 0));

  return (
    <div className="absolute top-[-9999px] left-[-9999px] w-[1123px]"> 
      {/* 1123px width roughly corresponds to A4 landscape (11.69 inches * 96 dpi) */}
      <div ref={ref} id="certificates-to-download" className="w-full bg-white relative">
        {topStudents.map((student, index) => (
          <div 
            key={student.id} 
            className="w-[1123px] h-[794px] p-12 relative flex flex-col items-center justify-center text-center overflow-hidden"
            style={{ 
              pageBreakAfter: index < topStudents.length - 1 ? 'always' : 'auto',
              backgroundColor: '#ffffff',
              border: '20px solid #2563eb', // Blue border
              boxSizing: 'border-box'
            }}
            dir="rtl"
          >
            {/* Inner border */}
            <div className="absolute top-6 left-6 right-6 bottom-6 border-[4px] border-blue-400 opacity-60"></div>
            
            {/* Background pattern/decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-bl-[100%]"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-tr-[100%]"></div>
            
            <div className="relative z-10 w-full px-20 flex flex-col items-center">
               <h1 className="text-4xl font-black mb-14 text-blue-900 tracking-tight">الجمهورية الجزائرية الديمقراطية الشعبية</h1>
               
               <div className="mb-16">
                 <h2 className="text-7xl font-black text-blue-600 mb-6 font-display" style={{ textShadow: '2px 2px 0px #bfdbfe' }}>شــهــادة تــقــديــر</h2>
                 <p className="text-2xl font-bold text-slate-600">تمنح هذه الشهادة للتلميذ(ة) المتميز(ة)</p>
               </div>

               <h3 className="text-6xl font-black text-slate-900 mb-8 border-b-4 border-blue-500 pb-4 px-16 inline-block">{student.name}</h3>
               
               <p className="text-2xl font-bold text-slate-700 leading-relaxed max-w-3xl mb-12">
                 تقديراً لجهوده(ا) المبذولة واجتهاده(ا) وحصوله(ا) على نتائج ممتازة بمعدل <span className="font-black text-blue-700 text-3xl font-mono mx-2" dir="ltr">{student.overallAverage?.toFixed(2)}</span>
                 <br />في القسم <span className="font-black text-blue-700 text-3xl">{student.className}</span>.
               </p>

               <p className="text-xl font-bold text-slate-500 mb-20 italic">متمنين له(ا) المزيد من التألق والنجاح في مساره(ا) الدراسي.</p>
               
               <div className="flex justify-between w-full px-20">
                  <div className="text-center">
                    <p className="text-xl font-bold text-slate-800 mb-4">التاريخ</p>
                    <p className="text-lg font-bold text-slate-600 font-mono">{new Date().toLocaleDateString('ar-DZ')}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-slate-800 mb-4">توقيع الأستاذ</p>
                    <p className="text-xl font-black text-blue-600 font-serif">بلحية ياسين</p>
                  </div>
               </div>
            </div>
          </div>
        ))}

        {topStudents.length === 0 && (
          <div className="w-[1123px] h-[794px] flex items-center justify-center p-12 text-center text-4xl font-bold text-slate-500">
            لا يوجد تلاميذ بمعدل ممتاز (15 فما فوق) في هذه القائمة.
          </div>
        )}
      </div>
    </div>
  );
});

PrintableCertificates.displayName = 'PrintableCertificates';
