import db from "../database/config.js";

export const createUnit = async (classId, title, position) => {
  return db.one(
    "INSERT INTO units(class_id, title, position) VALUES($1, $2, $3) RETURNING *",
    [classId, title, position]
  );
};

export const getAllUnits = async () => {
  return db.any(`
    SELECT u.*, c.title as class_title 
    FROM units u
    LEFT JOIN classes c ON u.class_id = c.id
    ORDER BY u.position
  `);
};

export const getUnitById = async (id) => {
  return db.oneOrNone(`
    SELECT u.*, c.title as class_title 
    FROM units u
    LEFT JOIN classes c ON u.class_id = c.id
    WHERE u.id = $1
  `, [id]);
};

export const getUnitsByClass = async (classId) => {
  return db.any(
    "SELECT * FROM units WHERE class_id = $1 ORDER BY position",
    [classId]
  );
};

export const updateUnit = async (id, title, position) => {
  return db.oneOrNone(
    "UPDATE units SET title = $1, position = $2 WHERE id = $3 RETURNING *",
    [title, position, id]
  );
};

export const deleteUnit = async (id) => {
  return db.oneOrNone("DELETE FROM units WHERE id = $1 RETURNING *", [id]);
};

export const reorderUnits = async (classId, unitOrders) => {
  return db.tx(async t => {
    const updates = unitOrders.map(({id, position}) => {
      return t.oneOrNone(
        "UPDATE units SET position = $1 WHERE id = $2 RETURNING *",
        [position, id]
      );
    });
    return t.batch(updates);
  });
};