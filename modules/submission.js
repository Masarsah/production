
import db from "../database/config.js";

export const createSubmission = async ({ quiz_id, user_id, started_at = null, submitted_at = null, total_score = null, status = 'in_progress' }) => {
const q = 'INSERT INTO submissions (quiz_id, user_id, started_at, submitted_at, total_score, status) VALUES ($1,$2,COALESCE($3, now()),$4,$5,$6) RETURNING *;'
return await db.one(q, [quiz_id, user_id, started_at, submitted_at, total_score, status]);
};

export const getSubmissions = async () => {
return await db.any('SELECT * FROM submissions ORDER BY started_at DESC');
};

export const getSubmissionById = async (id) => {
return await db.oneOrNone('SELECT * FROM submissions WHERE id=$1', [id]);
};

export const updateSubmission = async (id, { submitted_at, total_score, status }) => {
const q = 'UPDATE submissions SET submitted_at = COALESCE($2, submitted_at), total_score = COALESCE($3, total_score), status = COALESCE($4, status) WHERE id=$1 RETURNING *;'
return await db.oneOrNone(q, [id, submitted_at, total_score, status]);
};

export const deleteSubmission = async (id) => {
return await db.result('DELETE FROM submissions WHERE id=$1', [id], r => r.rowCount);
};


export const createAnswer = async ({ submission_id, question_id, selected_choice_ids = null, answer_text = null, is_correct = null, score = null, graded_by = null, graded_at = null }) => {
const q = 'INSERT INTO answers (submission_id, question_id, selected_choice_ids, answer_text, is_correct, score, graded_by, graded_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *;'
return await db.one(q, [submission_id, question_id, selected_choice_ids, answer_text, is_correct, score, graded_by, graded_at]);
};

export const getAnswers = async () => {
return await db.any('SELECT * FROM answers ORDER BY id DESC');
};

export const getAnswerById = async (id) => {
return await db.oneOrNone('SELECT * FROM answers WHERE id=$1', [id]);
};

export const updateAnswer = async (id, { selected_choice_ids, answer_text, is_correct, score, graded_by, graded_at }) => {
const q = 'UPDATE answers SET selected_choice_ids = COALESCE($2, selected_choice_ids), answer_text = COALESCE($3, answer_text), is_correct = COALESCE($4, is_correct), score = COALESCE($5, score), graded_by = COALESCE($6, graded_by), graded_at = COALESCE($7, graded_at) WHERE id=$1 RETURNING *;'
return await db.oneOrNone(q, [id, selected_choice_ids, answer_text, is_correct, score, graded_by, graded_at]);
};

export const deleteAnswer = async (id) => {
return await db.result('DELETE FROM answers WHERE id=$1', [id], r => r.rowCount);
}; 


export const createAIGeneration = async ({ question_id, model_name, temperature = null, seed = null, prompt_used = null, response_raw = null }) => { const q = 'INSERT INTO ai_generations (question_id, model_name, temperature, seed, prompt_used, response_raw) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *;'
     return await db.one(q, [question_id, model_name, temperature, seed, prompt_used, response_raw]); };
     
     export const getAIGenerations = async () => { return await db.any('SELECT * FROM ai_generations ORDER BY created_at DESC'); }; 
    
    
 export const getAIGenerationById = async (id) => { return await db.oneOrNone('SELECT * FROM ai_generations WHERE id=$1', [id]); }; 
 
 
 export const updateAIGeneration = async (id, { model_name, temperature, seed, prompt_used, response_raw }) => { const q = 'UPDATE ai_generations SET model_name = COALESCE($2, model_name), temperature = COALESCE($3, temperature), seed = COALESCE($4, seed), prompt_used = COALESCE($5, prompt_used), response_raw = COALESCE($6, response_raw) WHERE id=$1 RETURNING *;'
 return await db.oneOrNone(q, [id, model_name, temperature, seed, prompt_used, response_raw]); }; 
 
 
 export const deleteAIGeneration = async (id) => { return 
    await db.result('DELETE FROM ai_generations WHERE id=$1', [id], r => r.rowCount); }