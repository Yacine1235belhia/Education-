import { Student, TeacherConfig } from '../types';

export const getFixedPedagogicalAnalysis = (student: Student, teacherConfig: TeacherConfig, lang: string = 'ar') => {
  const avg = student.overallAverage || 0;
  let analysis = "";
  
  const isAr = lang === 'ar';
  const isFr = lang === 'fr';
  const isEn = lang === 'en';

  // 1. General Assessment
  if (avg >= 16) {
    if (isAr) analysis += `التلميذ ${student.name} يحقق تميزاً باهراً بمعدل ${avg.toFixed(2)}. مستواه ممتاز جداً ويظهر استيعاباً كامل للمادة.\n\n`;
    if (isFr) analysis += `L'élève ${student.name} réalise une excellence remarquable avec une moyenne de ${avg.toFixed(2)}. Son niveau est excellent et démontre une compréhension complète du sujet.\n\n`;
    if (isEn) analysis += `The student ${student.name} achieves remarkable excellence with an average of ${avg.toFixed(2)}. Their level is excellent and demonstrates full comprehension of the subject.\n\n`;
  } else if (avg >= 14) {
    if (isAr) analysis += `التلميذ ${student.name} يحقق نتائج حسنة جداً بمعدل ${avg.toFixed(2)}. مستواه فوق المتوسط ويظهر جدية واضحة.\n\n`;
    if (isFr) analysis += `L'élève ${student.name} obtient de très bons résultats avec une moyenne de ${avg.toFixed(2)}. Son niveau est supérieur à la moyenne et il fait preuve d'un sérieux évident.\n\n`;
    if (isEn) analysis += `The student ${student.name} obtains very good results with an average of ${avg.toFixed(2)}. Their level is above average and they show clear seriousness.\n\n`;
  } else if (avg >= 12) {
    if (isAr) analysis += `التلميذ ${student.name} يحقق نتائج مستقرة بمعدل ${avg.toFixed(2)}. مستواه جيد وبإمكانه التطلع للأفضل.\n\n`;
    if (isFr) analysis += `L'élève ${student.name} obtient des résultats stables avec une moyenne de ${avg.toFixed(2)}. Son niveau est bon et il peut viser plus haut.\n\n`;
    if (isEn) analysis += `The student ${student.name} obtains stable results with an average of ${avg.toFixed(2)}. Their level is good and they can aim higher.\n\n`;
  } else if (avg >= 10) {
    if (isAr) analysis += `التلميذ ${student.name} يحقق الحد الأدنى من الكفاءة بمعدل ${avg.toFixed(2)}. النتائج متوسطة وتتطلب مراقبة لتحسينها.\n\n`;
    if (isFr) analysis += `L'élève ${student.name} atteint le niveau minimum de compétence avec une moyenne de ${avg.toFixed(2)}. Les résultats sont moyens et nécessitent un suivi pour les améliorer.\n\n`;
    if (isEn) analysis += `The student ${student.name} reaches the minimum level of competence with an average of ${avg.toFixed(2)}. The results are average and require monitoring for improvement.\n\n`;
  } else if (avg >= 8) {
    if (isAr) analysis += `التلميذ ${student.name} يعاني من نقص في التحصيل بمعدل ${avg.toFixed(2)}. المستوى دون المتوسط ويتطلب مجهوداً إضافياً.\n\n`;
    if (isFr) analysis += `L'élève ${student.name} souffre d'un manque d'acquisition avec une moyenne de ${avg.toFixed(2)}. Le niveau est inférieur à la moyenne et nécessite des efforts supplémentaires.\n\n`;
    if (isEn) analysis += `The student ${student.name} suffers from a lack of achievement with an average of ${avg.toFixed(2)}. The level is below average and requires additional effort.\n\n`;
  } else {
    if (isAr) analysis += `التلميذ ${student.name} يعاني من فجوات تعليمية كبيرة بمعدل ${avg.toFixed(2)}. المستوى ضعيف جداً ويستدعي خطة علاجية طارئة.\n\n`;
    if (isFr) analysis += `L'élève ${student.name} présente d'importantes lacunes d'apprentissage avec une moyenne de ${avg.toFixed(2)}. Son niveau est très faible et nécessite un plan de remédiation urgent.\n\n`;
    if (isEn) analysis += `The student ${student.name} has major learning gaps with an average of ${avg.toFixed(2)}. Their level is very weak and requires an urgent remediation plan.\n\n`;
  }

  // 2. Relationship between points
  for (const [subject, g] of Object.entries(student.grades)) {
    const exam = g.exam || 0;
    const continuousSum = (g.evaluation || 0) + (g.quiz || 0) + (teacherConfig.hasPractical ? (g.practical || 0) : 0);
    const continuousDiv = teacherConfig.hasPractical ? 3 : 2;
    const continuousAvg = continuousSum / continuousDiv;
    
    if (exam < continuousAvg - 3) {
      if (isAr) analysis += `⚠️ ملاحظة بيداغوجية: هناك تراجع ملحوظ في نقطة الاختبار (${exam}) مقارنة بالعمل السنوي (${continuousAvg.toFixed(2)}). قد يعود ذلك للقلق من الامتحانات أو نقص التركيز.\n\n`;
      if (isFr) analysis += `⚠️ Note pédagogique: Il y a une baisse notable de la note d'examen (${exam}) par rapport au travail annuel (${continuousAvg.toFixed(2)}). Cela peut être dû à l'anxiété liée aux examens ou à un manque de concentration.\n\n`;
      if (isEn) analysis += `⚠️ Pedagogical note: There is a notable drop in the exam score (${exam}) compared to the annual work (${continuousAvg.toFixed(2)}). This could be due to exam anxiety or a lack of concentration.\n\n`;
    } else if (exam > continuousAvg + 3) {
      if (isAr) analysis += `💡 ملاحظة بيداغوجية: نقطة الاختبار (${exam}) أعلى بشكل ملحوظ من العمل السنوي (${continuousAvg.toFixed(2)}). هذا يدل على قدرة جيدة في المراجعة الشاملة.\n\n`;
      if (isFr) analysis += `💡 Note pédagogique: La note d'examen (${exam}) est nettement supérieure au travail annuel (${continuousAvg.toFixed(2)}). Cela indique une bonne capacité de révision globale.\n\n`;
      if (isEn) analysis += `💡 Pedagogical note: The exam score (${exam}) is significantly higher than the annual work (${continuousAvg.toFixed(2)}). This indicates a good overall revision ability.\n\n`;
    }
  }

  // 3. Rank analysis
  if (student.rank && student.rank <= 3) {
    if (isAr) analysis += `🏆 التلميذ من النخبة في القسم (الرتبة: ${student.rank}). يجب تشجيعه وتوجيهه نحو تعميق معارفه.\n\n`;
    if (isFr) analysis += `🏆 L'élève fait partie de l'élite de la classe (Rang: ${student.rank}). Il doit être encouragé et guidé pour approfondir ses connaissances.\n\n`;
    if (isEn) analysis += `🏆 The student is part of the class elite (Rank: ${student.rank}). They should be encouraged and guided to deepen their knowledge.\n\n`;
  }

  // 4. Practical advice
  if (isAr) analysis += `نصائح للأستاذ ${teacherConfig.name}:\n`;
  if (isFr) analysis += `Conseils pour l'enseignant ${teacherConfig.name}:\n`;
  if (isEn) analysis += `Tips for teacher ${teacherConfig.name}:\n`;

  if (avg < 10) {
    if (isAr) analysis += `- التركيز على المفاهيم القاعدية.\n- تخصيص تمارين بسيطة لبناء الثقة.\n- محاورة التلميذ لمعرفة المعوقات.`;
    if (isFr) analysis += `- Se concentrer sur les concepts de base.\n- Assigner des exercices simples pour renforcer la confiance.\n- Discuter avec l'élève pour identifier les obstacles.`;
    if (isEn) analysis += `- Focus on basic concepts.\n- Assign simple exercises to build confidence.\n- Talk with the student to identify obstacles.`;
  } else if (avg < 14) {
    if (isAr) analysis += `- توجيه التلميذ نحو تنظيم الوقت.\n- تشجيعه على المشاركة الصفية.`;
    if (isFr) analysis += `- Guider l'élève dans la gestion du temps.\n- L'encourager à participer en classe.`;
    if (isEn) analysis += `- Guide the student in time management.\n- Encourage them to participate in class.`;
  } else {
    if (isAr) analysis += `- تحفيز التلميذ بمشكلات معقدة.\n- إشراكه في مساعدة زملائه.`;
    if (isFr) analysis += `- Stimuler l'élève avec des problèmes complexes.\n- L'impliquer dans l'aide aux camarades.`;
    if (isEn) analysis += `- Challenge the student with complex problems.\n- Involve them in helping peers.`;
  }

  return analysis;
};
