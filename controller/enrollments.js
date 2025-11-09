import * as mod from '../modules/enrollments.js';

export const createEnrollment = async (req, res) => {
try {
const data = await mod.createEnrollment(req.body);
return res.json({ success: true, message: 'Enrollment created', data });
} catch (err) {
console.error(err);
return res.status(500).json({ success: false, message: 'Failed to create enrollment', data: err.message });
}
};


export const getEnrollments = async (req, res) => {
try {
const rows = await mod.getEnrollments();
return res.json({ success: true, message: 'Enrollments fetched', data: rows });
} catch (err) {
console.error(err);
return res.status(500).json({ success: false, message: 'Failed', data: err.message });
}
};

export const getEnrollment = async (req, res) => {
try {
const { user_id, class_id } = req.params;
const row = await mod.getEnrollment(user_id, class_id);
if (!row) return res.status(404).json({ success: false, message: 'Not found', data: null });
return res.json({ success: true, message: 'Enrollment fetched', data: row });
} catch (err) {
console.error(err);
return res.status(500).json({ success: false, message: 'Failed', data: err.message });
}
};

export const updateEnrollment = async (req, res) => {
try {
const { user_id, class_id } = req.params;
const updated = await mod.updateEnrollment(user_id, class_id, req.body);
return res.json({ success: true, message: 'Enrollment updated', data: updated });
} catch (err) {
console.error(err);
return res.status(500).json({ success: false, message: 'Failed', data: err.message });
}
};

export const deleteEnrollment = async (req, res) => {
try {
const { user_id, class_id } = req.params;
const count = await mod.deleteEnrollment(user_id, class_id);
return res.json({ success: true, message: 'Enrollment deleted', data: { deleted: count } });
} catch (err) {
console.error(err);
return res.status(500).json({ success: false, message: 'Failed', data: err.message });
}
};