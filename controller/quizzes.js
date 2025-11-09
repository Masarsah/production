import * as quizModule from "../modules/quizzes.js";

export const createQuiz = async (req, res) => {
  try {
    const {
      classId,
      unitId,
      title,
      instructions,
      maxScore,
      timeLimitSeconds,
      maxAttempts,
      availableFrom,
      dueAt,
      gradingRule
    } = req.body;

    const newQuiz = await quizModule.createQuiz({
      classId,
      unitId,
      title,
      instructions,
      maxScore,
      timeLimitSeconds,
      maxAttempts,
      availableFrom,
      dueAt,
      gradingRule
    });

    res.json({
      success: true,
      message: "Quiz created successfully",
      data: newQuiz
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create quiz",
      error: error.message
    });
  }
};

export const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await quizModule.getAllQuizzes();
    res.json({
      success: true,
      message: "Quizzes retrieved successfully",
      data: quizzes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve quizzes",
      error: error.message
    });
  }
};

export const getQuizById = async (req, res) => {
  try {
    const quiz = await quizModule.getQuizById(req.params.id);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found"
      });
    }
    res.json({
      success: true,
      message: "Quiz retrieved successfully",
      data: quiz
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve quiz",
      error: error.message
    });
  }
};

export const updateQuiz = async (req, res) => {
  try {
    const {
      title,
      instructions,
      maxScore,
      timeLimitSeconds,
      maxAttempts,
      availableFrom,
      dueAt,
      gradingRule
    } = req.body;

    const updatedQuiz = await quizModule.updateQuiz(
      req.params.id,
      {
        title,
        instructions,
        maxScore,
        timeLimitSeconds,
        maxAttempts,
        availableFrom,
        dueAt,
        gradingRule
      }
    );

    if (!updatedQuiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found"
      });
    }

    res.json({
      success: true,
      message: "Quiz updated successfully",
      data: updatedQuiz
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update quiz",
      error: error.message
    });
  }
};

export const deleteQuiz = async (req, res) => {
  try {
    const deletedQuiz = await quizModule.deleteQuiz(req.params.id);
    if (!deletedQuiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found"
      });
    }
    res.json({
      success: true,
      message: "Quiz deleted successfully",
      data: deletedQuiz
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete quiz",
      error: error.message
    });
  }
};

export const getQuizzesByClass = async (req, res) => {
  try {
    const quizzes = await quizModule.getQuizzesByClass(req.params.classId);
    res.json({
      success: true,
      message: "Class quizzes retrieved successfully",
      data: quizzes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve class quizzes",
      error: error.message
    });
  }
};

export const addQuestionsToQuiz = async (req, res) => {
  try {
    const { questions } = req.body;
    const updatedQuiz = await quizModule.addQuestionsToQuiz(
      req.params.id,
      questions
    );
    res.json({
      success: true,
      message: "Questions added to quiz successfully",
      data: updatedQuiz
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add questions to quiz",
      error: error.message
    });
  }
};