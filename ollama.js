import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();



const OPENAI_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_KEY) {
  throw new Error("Missing OPENAI_API_KEY in environment");
}

const client = new OpenAI({ apiKey: OPENAI_KEY });

export class ChatGPTService {
  async generateResponse(prompt, context = "") {
    const formattedPrompt = `
أنت معلم ذكي ومتفاعل.
استخدم نفس لغة الطالب في الرد (عربية فصحى، عامية، أو إنجليزية).
اشرح بأسلوب بسيط وودود وتربوي.

لا تتكلم في الدين او التاريخ او السياسه 
واذا احدسال عن هالمواضيع قل له انا معلم ولست مختص في هالمواضيع

${context ? `📚 السياق السابق:\n${context}\n` : ""}
👩‍🎓 الطالب يقول: "${prompt}"

📝 اجعل الرد منظمًا وسهل القراءة.
`;

    try {
      const result = await client.responses.create({
        model: "gpt-3.5-turbo",
        input: `You are a friendly and expert secondary-school teacher assistant... ${formattedPrompt}`,
      });

      return result.output_text || result.output?.[0]?.content?.[0]?.text;
    } catch (error) {
      console.error("❌ OpenAI API error:", error);
      throw new Error("فشل الاتصال بنموذج ChatGPT");
    }
  }
}