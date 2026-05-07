import { GoogleGenAI } from "@google/genai";
import { Student } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
  }

  async analyzeClassOverallPerformance(reportStr: string) {
    if (!process.env.GEMINI_API_KEY) return "يرجى ضبط مفتاح API للحصول على تحليل ذكي.";

    try {
      const prompt = `أنت مساعد تربوي ذكي، ومستشار توجيه خبير في النظام التعليمي الجزائري.
      طلب منك الأستاذ المسؤول عن القسم تقديم قراءة تحليلية دقيقة وشاملة لنتائج القسم بناء على البيانات التالية:
      
      ${reportStr}
      
      المهمة المطلوبة:
      1. اقرأ البيانات الإحصائية لكل مادة (المعدل، نسبة النجاح) وعلق على نقاط القوة والضعف في القسم.
      2. حلل التباين بين أعلى وأدنى معدل والمعدل العام.
      3. قم بقراءة لعدد التلاميذ في كل فئة من فئات المعدلات (ممتاز 18-20، جيد جدا 16-17.99، إلخ...).
      4. قدم نصائح عامة وتوجيهات للأستاذ المسؤول والفريق التربوي للقسم لتحسين المردود في الفصل القادم.
      
      الأسلوب: مهني، تحليلي، وبالعربية.`;

      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      });
      
      return response.text || "عذراً، لم نتمكن من الحصول على تحليل.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "عذراً، حدث خطأ أثناء تحليل بيانات القسم. يرجى المحاولة لاحقاً.";
    }
  }

  async analyzeStudentPerformance(student: Student, teacherConfig: any) {
    if (!process.env.GEMINI_API_KEY) return "يرجى ضبط مفتاح API للحصول على تحليل ذكي.";

    const gradesStr = Object.entries(student.grades)
      .map(([subject, g]) => {
        const hasPr = teacherConfig?.hasPractical;
        return `${subject}: التقويم ${g.evaluation}${hasPr ? `, الأعمال التطبيقية ${g.practical || 0}` : ""}, الفرض ${g.quiz}, الاختبار ${g.exam} -> المعدل: ${g.average}`;
      })
      .join('\n');

    try {
      const formulaDesc = teacherConfig?.hasPractical 
        ? "(التقويم + أعمال تطبيقية + الفرض + الاختبار × 2) / 5"
        : "(التقويم + الفرض + الاختبار × 2) / 4";

      const prompt = `أنت مساعد تربوي ذكي للأستاذ "${teacherConfig?.name || 'بلحية ياسين'}"، خبير في النظام التعليمي الجزائري. 
      
      معلومات التلميذ: ${student.name}
      المعدل العام المسجل: ${student.overallAverage?.toFixed(2)}/20
      
      تفاصيل العلامات المسجلة:
      ${gradesStr}
      
      المهمة المطلوبة:
      1. حلل العلاقة بين النقاط (مثلاً: إذا كانت نقطة الاختبار ضعيفة مقارنة بنقاط التقويم والفرض، نبه لضرورة التركيز في الامتحانات النهائية).
      2. الصيغة المعتمدة للحساب في هذا الملف هي: ${formulaDesc}.
      3. قدم تقديرات دقيقة (ممتاز، حسن، متوسط، ضعيف) بناءً على المعدل المسجل.
      4. وجه نصائح بيداغوجية عملية للأستاذ بلحية ياسين حول كيفية مساعدة هذا التلميذ في تحسين مستواه.
      
      تحدث بأسلوب مشجع، مهني، وباللغة العربية، مع ذكر اسم الأستاذ بلحية ياسين في التحليل.`;

      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      });
      
      return response.text || "عذراً، لم نتمكن من الحصول على تحليل.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "عذراً، حدث خطأ أثناء تحليل بيانات الطالب. يرجى التأكد من إعداد مفتاح API بشكل صحيح.";
    }
  }
}

export const geminiService = new GeminiService();
