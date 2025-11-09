import db from "../database/config.js";
import crypto from "crypto";
import jwt from "jsonwebtoken"; // Changed to ESM import

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Better to use environment variable
const TOKEN_EXPIRE = '24h';
const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt };
};

const verifyPassword = (password, hash, salt) => {
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
};

export const createTeacher = async (email, password, role) => {
  const { hash, salt } = hashPassword(password);
  return db.one(
    "INSERT INTO users(email, password_hash, role) VALUES($1, $2, $3) RETURNING id, email",
    [email, hash, role]
  );
};

export const getAllTeachers = async () => {
  return db.any("SELECT id, email FROM users");
};

export const getTeacherById = async (id) => {
  return db.oneOrNone("SELECT id, email FROM users WHERE id = $1", [id]);
};

export const updateTeacher = async (id, email, password, role) => {
  if (password) {
    const { hash, salt } = hashPassword(password);
    return db.oneOrNone(
      "UPDATE users SET email = $1, password_hash = $2 WHERE id = $3 RETURNING id, email",
      [email, hash, id]
    );
  }
  return db.oneOrNone(
    "UPDATE users SET email = $1 WHERE id = $2 RETURNING id, email",
    [email, id]
  );
};

export const deleteTeacher = async (id) => {
  return db.oneOrNone("DELETE FROM users WHERE id = $1 RETURNING id", [id]);
};

export const loginTeacher = async (email, password) => {
  const teacher = await db.oneOrNone("SELECT * FROM users WHERE email = $1", [email]);
  if (!teacher) return null;
  
  const isValid = verifyPassword(password, teacher.password_hash, teacher.password_salt);
  if (!isValid) return null;
  
  return {
    id: teacher.id,
    email: teacher.email,
    name: teacher.name,
    subject: teacher.subject
  };
};