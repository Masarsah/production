

import express from 'express';
import * as ctrl from '../controller/submissions.js';

const router = express.Router();


router.post('/s', ctrl.createSubmission);
router.get('/s/', ctrl.getSubmissions);
router.get('/s/:id', ctrl.getSubmissionById);
router.put('/s/:id', ctrl.updateSubmission);
router.delete('/s/:id', ctrl.deleteSubmission);

router.post('/a/', ctrl.createAnswer);
router.get('/a/', ctrl.getAnswers);
router.get('/a/:id', ctrl.getAnswerById);
router.put('/a/:id', ctrl.updateAnswer);
router.delete('/a/:id', ctrl.deleteAnswer);

router.post('/ai', ctrl.createAIGeneration);
router.get('/ai', ctrl.getAIGenerations);
router.get('/ai/:id', ctrl.getAIGenerationById);
router.put('/ai/:id', ctrl.updateAIGeneration);
router.delete('/ai/:id', ctrl.deleteAIGeneration);


export default router;