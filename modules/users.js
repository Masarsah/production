import db from "../database/config.js";

export const createUser = async (display_name ,phone ,email, role) => {
  return db.one(
    "INSERT INTO users(display_name, email, role,phone) VALUES($1, $2,$3,$4) RETURNING *;",
    [display_name, email, role, phone]
  );
};

export const getAllUsers = async () => {
  return db.any("SELECT * FROM users;");
};

export const getUserById = async (id) => {
  return db.oneOrNone("SELECT * FROM users WHERE id = $1;", [id]);
};

export const updateUser = async (id, display_name,email, phone, role) => {
  return db.oneOrNone(
    "UPDATE users SET email = $1, display_name=$2 ,phone =$3, role = $4 WHERE id = $5 RETURNING *;",
    [email, display_name , phone, role, id]
  );
};

export const deleteUser = async (id) => {
  return db.oneOrNone("DELETE FROM users WHERE id = $1 RETURNING *;", [id]);
};