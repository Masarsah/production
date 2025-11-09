import express from "express";
import * as quizController from "../controller/quizzes.js";

const router = express.Router();

// Quiz CRUD operations
router.post("/",  quizController.createQuiz);
router.get("/", quizController.getAllQuizzes);
router.get("/:id", quizController.getQuizById);

router.delete("/:id",  quizController.deleteQuiz);

// Class-specific quiz routes
router.get("/class/:classId", quizController.getQuizzesByClass);

// Question management
router.post("/:id/questions",  quizController.addQuestionsToQuiz);
//router.put("/:id/questions",  quizController.updateQuizQuestions);
// Quiz submission
//router.post("/:id/submit",  quizController.submitQuiz);
//router.get("/:id/submissions",  quizController.getQuizSubmissions);
export default router;