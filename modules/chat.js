// modules/chat.js
import db from "../database/config.js";

/**
 * 🗨️ إنشاء رسالة جديدة في المحادثة
 * @param {Object} params - بيانات الرسالة
 * @param {number} params.userId - رقم المستخدم (الطالبة)
 * @param {string} params.sender - 'student' أو 'ai'
 * @param {string} params.text - نص الرسالة
 */
export const createMessage = async ({ text }) => {
  return db.one(
    `INSERT INTO chat_messages ( text, created_at) 
     VALUES ($1,  NOW()) RETURNING *`,
    [ text]
  );
};

/**
 * 📋 استرجاع كل الرسائل لطالبة معينة
 */
export const getMessagesByUser = async (userId) => {
  return db.any(
    `SELECT id, user_id, sender, text, created_at 
     FROM chat_messages 
     WHERE user_id = $1 
     ORDER BY created_at ASC`,
    [userId]
  );
};

/**
 * 🧹 حذف جميع رسائل مستخدم (اختياري)
 */
export const deleteMessagesByUser = async (userId) => {
  return db.result(`DELETE FROM chat_messages WHERE user_id = $1`, [userId]);
};
