import * as mod from '../modules/submission.js';
import { ChatGPTService } from '../ollama.js';

const ollama = new ChatGPTService();

export const createSubmission = async (req, res) => {
  try {
    const { answer, correctAnswer, ...submissionData } = req.body;
    
    // First, evaluate the answer using Ollama
    const evaluation = await ollama.evaluateAnswer(correctAnswer, answer);
    
    // Create submission with AI evaluation
    const data = await mod.createSubmission({
      ...submissionData,
      answer,
      correctAnswer,
      aiEvaluation: evaluation,
    });

    return res.json({ 
      success: true, 
      message: 'Submission created with AI evaluation', 
      data,
      evaluation 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to create submission', 
      data: err.message 
    });
  }
};

export const getSubmissions = async (req, res) => {
try {
const rows = await mod.getSubmissions();
return res.json({ success: true, message: 'Submissions fetched', data: rows });
} catch (err) {
console.error(err);
return res.status(500).json({ success: false, message: 'Failed', data: err.message });
}
};

export const getSubmissionById = async (req, res) => {
try {
const row = await mod.getSubmissionById(req.params.id);
if (!row) return res.status(404).json({ success: false, message: 'Not found', data: null });
return res.json({ success: true, message: 'Submission fetched', data: row });
} catch (err) {
console.error(err);
return res.status(500).json({ success: false, message: 'Failed', data: err.message });
}
};

export const updateSubmission = async (req, res) => {
try {
const updated = await mod.updateSubmission(req.params.id, req.body);
return res.json({ success: true, message: 'Submission updated', data: updated });
} catch (err) {
console.error(err);
return res.status(500).json({ success: false, message: 'Failed', data: err.message });
}
};

export const deleteSubmission = async (req, res) => {
try {
const count = await mod.deleteSubmission(req.params.id);
return res.json({ success: true, message: 'Submission deleted', data: { deleted: count } });
} catch (err) {
console.error(err);
return res.status(500).json({ success: false, message: 'Failed', data: err.message });
}
};export const createAnswer = async (req, res) => {
try {
const data = await mod.createAnswer(req.body);
return res.json({ success: true, message: 'Answer created', data });
} catch (err) {
console.error(err);
return res.status(500).json({ success: false, message: 'Failed to create answer', data: err.message });
}
};

export const getAnswers = async (req, res) => {
try {
const rows = await mod.getAnswers();
return res.json({ success: true, message: 'Answers fetched', data: rows });
} catch (err) {
console.error(err);
return res.status(500).json({ success: false, message: 'Failed', data: err.message });
}
};

export const getAnswerById = async (req, res) => {
try {
const row = await mod.getAnswerById(Number(req.params.id));
if (!row) return res.status(404).json({ success: false, message: 'Answer not found', data: null });
return res.json({ success: true, message: 'Answer fetched', data: row });
} catch (err) {
console.error(err);
return res.status(500).json({ success: false, message: 'Failed', data: err.message });
}
};

export const updateAnswer = async (req, res) => {
try {
const updated = await mod.updateAnswer(Number(req.params.id), req.body);
return res.json({ success: true, message: 'Answer updated', data: updated });
} catch (err) {
console.error(err);
return res.status(500).json({ success: false, message: 'Failed', data: err.message });
}
};

export const deleteAnswer = async (req, res) => {
try {
const count = await mod.deleteAnswer(Number(req.params.id));
return res.json({ success: true, message: 'Answer deleted', data: { deleted: count } });
} catch (err) {
console.error(err);
return res.status(500).json({ success: false, message: 'Failed', data: err.message });
}
};export const createAIGeneration = async (req, res) => {
try {
const data = await mod.createAIGeneration(req.body);
return res.json({ success: true, message: 'AI generation created', data });
} catch (err) {
console.error(err);
return res.status(500).json({ success: false, message: 'Failed to create AI generation', data: err.message });
}
};

export const getAIGenerations = async (req, res) => {
try {
const rows = await mod.getAIGenerations();
return res.json({ success: true, message: 'AI generations fetched', data: rows });
} catch (err) {
console.error(err);
return res.status(500).json({ success: false, message: 'Failed', data: err.message });
}
};

export const getAIGenerationById = async (req, res) => {
try {
const row = await mod.getAIGenerationById(Number(req.params.id));
if (!row) return res.status(404).json({ success: false, message: 'Not found', data: null });
return res.json({ success: true, message: 'AI generation fetched', data: row });
} catch (err) {
console.error(err);
return res.status(500).json({ success: false, message: 'Failed', data: err.message });
}
};

export const updateAIGeneration = async (req, res) => {
try {
const updated = await mod.updateAIGeneration(Number(req.params.id), req.body);
return res.json({ success: true, message: 'AI generation updated', data: updated });
} catch (err) {
console.error(err);
return res.status(500).json({ success: false, message: 'Failed', data: err.message });
}
};

export const deleteAIGeneration = async (req, res) => {
try {
const count = await mod.deleteAIGeneration(Number(req.params.id));
return res.json({ success: true, message: 'AI generation deleted', data: { deleted: count } });
} catch (err) {
console.error(err);
return res.status(500).json({ success: false, message: 'Failed', data: err.message });
}
};