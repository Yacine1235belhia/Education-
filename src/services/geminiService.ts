import { GoogleGenAI } from "@google/genai";
import { Student } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
  }

  async analyzeStudentPerformance(student: Student) {
    if (!process.env.GEMINI_API_KEY) return "يرجى ضبط مفتاح API للحصول على تحليل ذكي.";

    const gradesStr = Object.entries(student.grades)
      .map(([subject, g]) => {
        return `${subject}: التقويم ${g.evaluation}, التطبيق/الشفوي ${g.practical || 0}, الفرض ${g.quiz}, الاختبار ${g.exam} -> المعدل: ${g.average}`;
      })
      .join('\n');

    try {
      const prompt = `أنت مساعد تربوي ذكي للأستاذ "بلحية ياسين"، خبير في النظام التعليمي الجزائري. 
      
      معلومات التلميذ: ${student.name}
      المعدل العام المسجل: ${student.overallAverage?.toFixed(2)}/20
      
      تفاصيل العلامات المسجلة:
      ${gradesStr}
      
      المهمة المطلوبة:
      1. حلل العلاقة بين النقاط (مثلاً: إذا كانت نقطة الاختبار ضعيفة مقارنة بنقاط التقويم والفرض، نبه لضرورة التركيز في الامتحانات النهائية).
      2. الصيغة المعتمدة للحساب هي: معدل المادة = (التقويم + أعمال تطبيقية + معدل الفروض + الاختبار × 2) / 5.
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
