import db from "../database/config.js";

export const createClass = async (code, title, teacherId) => {
  console.log(code, title, teacherId)
  return db.one(
    "INSERT INTO classes(code, title, teacher_id) VALUES($1, $2, $3) RETURNING *",
    [code, title, teacherId]
  );
};

export const getAllClasses = async () => {
  return db.any(`
    SELECT c.*, u.email as teacher_email 
    FROM classes c 
    LEFT JOIN users u ON c.teacher_id = u.id
  `);
};

export const getClassById = async (id) => {
  return db.oneOrNone(`
    SELECT c.*, u.email as teacher_email 
    FROM classes c 
    LEFT JOIN users u ON c.teacher_id = u.id 
    WHERE c.id = $1
  `, [id]);
};

export const updateClass = async (id, code, title, teacherId) => {
  return db.oneOrNone(
    "UPDATE classes SET code = $1, title = $2, teacher_id = $3 WHERE id = $4 RETURNING *",
    [code, title, teacherId, id]
  );
};

export const deleteClass = async (id) => {
  return db.oneOrNone("DELETE FROM classes WHERE id = $1 RETURNING *", [id]);
};

// Enrollment functions
export const enrollUser = async (userId, classId, roleInClass) => {
  return db.one(
    "INSERT INTO enrollments(user_id, class_id, role_in_class) VALUES($1, $2, $3) RETURNING *",
    [userId, classId, roleInClass]
  );
};

export const getClassEnrollments = async (classId) => {
  return db.any(`
    SELECT e.*, u.email 
    FROM enrollments e 
    JOIN users u ON e.user_id = u.id 
    WHERE e.class_id = $1
  `, [classId]);
};