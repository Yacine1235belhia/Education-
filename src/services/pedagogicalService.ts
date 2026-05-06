import { Student, TeacherConfig } from '../types';

export const getFixedPedagogicalAnalysis = (student: Student, teacherConfig: TeacherConfig) => {
  const avg = student.overallAverage || 0;
  let analysis = "";
  
  // 1. General Assessment
  if (avg >= 16) {
    analysis += `التلميذ ${student.name} يحقق تميزاً باهراً بمعدل ${avg.toFixed(2)}. مستواه ممتاز جداً ويظهر استيعاباً كاملاً للمادة.\n\n`;
  } else if (avg >= 14) {
    analysis += `التلميذ ${student.name} يحقق نتائج حسنة جداً بمعدل ${avg.toFixed(2)}. مستواه فوق المتوسط ويظهر جدية واضحة.\n\n`;
  } else if (avg >= 12) {
    analysis += `التلميذ ${student.name} يحقق نتائج مستقرة بمعدل ${avg.toFixed(2)}. مستواه جيد وبإمكانه التطلع للأفضل.\n\n`;
  } else if (avg >= 10) {
    analysis += `التلميذ ${student.name} يحقق الحد الأدنى من الكفاءة بمعدل ${avg.toFixed(2)}. النتائج متوسطة وتتطلب مراقبة لتحسينها.\n\n`;
  } else if (avg >= 8) {
    analysis += `التلميذ ${student.name} يعاني من نقص في التحصيل بمعدل ${avg.toFixed(2)}. المستوى دون المتوسط ويتطلب مجهوداً إضافياً.\n\n`;
  } else {
    analysis += `التلميذ ${student.name} يعاني من فجوات تعليمية كبيرة بمعدل ${avg.toFixed(2)}. المستوى ضعيف جداً ويستدعي خطة علاجية طارئة.\n\n`;
  }

  // 2. Relationship between points
  for (const [subject, g] of Object.entries(student.grades)) {
    const exam = g.exam || 0;
    const continuousSum = (g.evaluation || 0) + (g.quiz || 0) + (teacherConfig.hasPractical ? (g.practical || 0) : 0);
    const continuousDiv = teacherConfig.hasPractical ? 3 : 2;
    const continuousAvg = continuousSum / continuousDiv;
    
    if (exam < continuousAvg - 3) {
      analysis += `⚠️ ملاحظة بيداغوجية: هناك تراجع ملحوظ في نقطة الاختبار (${exam}) مقارنة بالعمل السنوي (${continuousAvg.toFixed(2)}). قد يعود ذلك للقلق من الامتحانات أو نقص التركيز.\n\n`;
    } else if (exam > continuousAvg + 3) {
      analysis += `💡 ملاحظة بيداغوجية: نقطة الاختبار (${exam}) أعلى بشكل ملحوظ من العمل السنوي (${continuousAvg.toFixed(2)}). هذا يدل على قدرة جيدة في المراجعة الشاملة.\n\n`;
    }
  }

  // 3. Rank analysis
  if (student.rank && student.rank <= 3) {
    analysis += `🏆 التلميذ من النخبة في القسم (الرتبة: ${student.rank}). يجب تشجيعه وتوجيهه نحو تعميق معارفه.\n\n`;
  }

  // 4. Practical advice
  analysis += `نصائح للأستاذ ${teacherConfig.name}:\n`;
  if (avg < 10) {
    analysis += `- التركيز على المفاهيم القاعدية.\n- تخصيص تمارين بسيطة لبناء الثقة.\n- محاورة التلميذ لمعرفة المعوقات.`;
  } else if (avg < 14) {
    analysis += `- توجيه التلميذ نحو تنظيم الوقت.\n- تشجيعه على المشاركة الصفية.`;
  } else {
    analysis += `- تحفيز التلميذ بمشكلات معقدة.\n- إشراكه في مساعدة زملائه.`;
  }

  return analysis;
};
