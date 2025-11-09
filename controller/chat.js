// controller/chat.js
import * as chatModel from "../modules/chat.js";
import { ChatGPTService } from "../ollama.js";

const ollama = new ChatGPTService();

/**
 * 💬 إرسال رسالة + إنشاء رد من الذكاء الصناعي
 */
export const sendMessage = async (req, res) => {
  try {
    const { userId, message } = req.body;
    console.log(userId, message);

    // حفظ رسالة الطالبة في قاعدة البيانات
    const userMsg = await chatModel.createMessage({
      userId,
      sender: "student",
      text: message,
    });

    // ابحث في ملفات الـ PDF عن محتوى ذي صلة
    const matches = await pdfService.searchInPDFs(message);
    let context = "";
    if (matches.length) {
      context = matches
        .map((m) => `ملف: ${m.file}\nالمقتطف: ${m.snippet}`)
        .join("\n\n---\n\n");
    }

    // استدعاء Ollama (ChatGPT) للرد مع السياق
    const aiReply = await ollama.generateResponse(message, context);

    console.log(aiReply);

    // حفظ رد الذكاء الصناعي
    const aiMsg = await chatModel.createMessage({
      userId,
      sender: "ai",
      text: aiReply,
      meta: { sourceMatches: matches.map(m => ({ file: m.file })) }, // optional
    });

    // إعادة الرسائل معاً
    return res.status(200).json({
      success: true,
      messages: [userMsg, aiMsg],
    });
  } catch (error) {
    console.error("❌ ChatController sendMessage error:", error);
    return res.status(500).json({
      success: false,
      message: "فشل إرسال الرسالة أو توليد الرد",
      error: error.message,
    });
  }
};
/**
 * 📜 استرجاع المحادثة لطالبة معينة
 */
export const getChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await chatModel.getMessagesByUser(userId);

    if (!messages || messages.length === 0) {
      return res.status(200).json({
        success: true,
        message: "لا توجد رسائل سابقة لهذه الطالبة.",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error("❌ ChatController getChatHistory error:", error);
    return res.status(500).json({
      success: false,
      message: "فشل تحميل المحادثة",
      error: error.message,
    });
  }
};


