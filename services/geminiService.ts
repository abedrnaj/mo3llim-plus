
import { GoogleGenAI, Type } from "@google/genai";
import { TeachingMethod, LearningStyle } from "../types";

// Always use GEMINI_API_KEY as per the platform guidelines
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const generateLessonPlan = async (params: {
  topic: string;
  grade: string;
  method: TeachingMethod;
  style: LearningStyle;
  studentGroup: string;
}) => {
  const prompt = `
    أنت خبير تربوي عالمي ومصمم خطط دروس عبقري لموقع "معلم بلس".
    قم بإنشاء خطة درس استثنائية وشاملة جداً باللغة العربية حول الموضوع: ${params.topic}.
    المرحلة: ${params.grade}.
    المنهجية: ${params.method}.
    النمط المفضل: ${params.style}.
    فئة الطلاب: ${params.studentGroup}.

    المتطلبات الأساسية للتقرير (يجب أن يكون المحتوى غزيراً ومفصلاً):
    1. نشاط "كسر الجليد" (Ice Breaker): نشاط افتتاحي ممتع مرتبط بالموضوع.
    2. تسلسل الحصة (Lesson Flow): خطوات مرتبة زمنياً تشرح سير الحصة بدقة.
    3. خيارات متعددة للأنشطة (3 خيارات على الأقل):
       - لكل نشاط: الاسم، الهدف، الأدوات اللازمة، بدائل للأدوات (في حال عدم توفرها)، وشرح قصير يوجهه المعلم للطلاب.
    4. أنشطة غير منهجية (إيصال المعلومة بشكل غير مباشر): ألعاب أو ألغاز توصل الفكرة بعيداً عن التلقين.
    5. دعم بصري (Visual Aids): اقتراحات لرسومات، مخططات تمثيلية، وتنسيقات ألوان مرتبطة بالموضوع (مثال: ألوان دافئة للطاقة، ألوان باردة للماء).
    6. دليل الفهم العميق للمعلم (مستفيض):
       - شرح فلسفي وعلمي معمق للموضوع.
       - 5 أسئلة ذكية وغير متوقعة مع إجاباتها النموذجية.
       - نصائح للتعامل مع الفروق الفردية في هذا الدرس.
    7. تقييم الحصة: مجموعة من الأسئلة أو المعايير لقياس مدى فهم الطلاب في نهاية الحصة.

    اجعل الخطاب ملهماً واللغة فصيحة وسهلة.
    صيغة الإخراج المطلوبة: JSON فقط.
    مهم: أرجع كائن JSON صالح فقط بدون ماركداون.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            iceBreaker: {
              type: Type.OBJECT,
              properties: {
                activity: { type: Type.STRING },
                instructions: { type: Type.STRING }
              },
              required: ["activity", "instructions"]
            },
            lessonFlow: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  step: { type: Type.STRING },
                  description: { type: Type.STRING },
                  duration: { type: Type.STRING }
                },
                required: ["step", "description"]
              }
            },
            activityOptions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  goal: { type: Type.STRING },
                  tools: { type: Type.ARRAY, items: { type: Type.STRING } },
                  alternatives: { type: Type.ARRAY, items: { type: Type.STRING } },
                  teacherScript: { type: Type.STRING }
                },
                required: ["name", "goal", "tools", "teacherScript"]
              }
            },
            indirectActivities: { type: Type.ARRAY, items: { type: Type.STRING } },
            visualSupport: {
              type: Type.OBJECT,
              properties: {
                diagramIdeas: { type: Type.ARRAY, items: { type: Type.STRING } },
                colorPalette: { type: Type.ARRAY, items: { type: Type.STRING } },
                representationMethod: { type: Type.STRING }
              },
              required: ["diagramIdeas", "colorPalette"]
            },
            deepKnowledge: {
              type: Type.OBJECT,
              properties: {
                extendedExplanation: { type: Type.STRING },
                qa: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      q: { type: Type.STRING },
                      a: { type: Type.STRING }
                    },
                    required: ["q", "a"]
                  }
                }
              },
              required: ["extendedExplanation", "qa"]
            },
            evaluationQuestions: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "iceBreaker", "lessonFlow", "activityOptions", "deepKnowledge", "evaluationQuestions"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("لم يتم توليد محتوى من النموذج الذكي.");
    
    return JSON.parse(text.trim());
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};
