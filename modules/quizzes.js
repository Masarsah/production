import db from "../database/config.js";

export const createQuiz = async (quizData) => {
  return db.one(`
    INSERT INTO quizzes (
      class_id, 
      unit_id, 
      title, 
      instructions, 
      max_score,
      time_limit_seconds, 
      max_attempts, 
      available_from, 
      due_at, 
      grading_rule
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
    ) RETURNING *
  `, [
    quizData.classId,
    quizData.unitId,
    quizData.title,
    quizData.instructions,
    quizData.maxScore,
    quizData.timeLimitSeconds,
    quizData.maxAttempts,
    quizData.availableFrom,
    quizData.dueAt,
    quizData.gradingRule
  ]);
};

export const getAllQuizzes = async () => {
  return db.any(`
    SELECT q.*, 
           c.title as class_title,
           u.title as unit_title,
           COUNT(qq.question_id) as question_count
    FROM quizzes q
    LEFT JOIN classes c ON q.class_id = c.id
    LEFT JOIN units u ON q.unit_id = u.id
    LEFT JOIN quiz_questions qq ON q.id = qq.quiz_id
    GROUP BY q.id, c.title, u.title
    ORDER BY q.created_at DESC
  `);
};

export const getQuizById = async (id) => {
  return db.oneOrNone(`
    SELECT q.*,
           json_agg(
             json_build_object(
               'id', qu.id,
               'prompt', qu.prompt,
               'qtype', qu.qtype,
               'points', qq.points,
               'position', qq.position
             )
           ) as questions
    FROM quizzes q
    LEFT JOIN quiz_questions qq ON q.id = qq.quiz_id
    LEFT JOIN questions qu ON qq.question_id = qu.id
    WHERE q.id = $1
    GROUP BY q.id
  `, [id]);
};

export const updateQuiz = async (id, quizData) => {
  return db.oneOrNone(`
    UPDATE quizzes SET
      title = $1,
      instructions = $2,
      max_score = $3,
      time_limit_seconds = $4,
      max_attempts = $5,
      available_from = $6,
      due_at = $7,
      grading_rule = $8
    WHERE id = $9
    RETURNING *
  `, [
    quizData.title,
    quizData.instructions,
    quizData.maxScore,
    quizData.timeLimitSeconds,
    quizData.maxAttempts,
    quizData.availableFrom,
    quizData.dueAt,
    quizData.gradingRule,
    id
  ]);
};

export const deleteQuiz = async (id) => {
  return db.oneOrNone('DELETE FROM quizzes WHERE id = $1 RETURNING *', [id]);
};

export const getQuizzesByClass = async (classId) => {
  return db.any(`
    SELECT q.*,
           u.title as unit_title,
           COUNT(qq.question_id) as question_count,
           COUNT(DISTINCT s.id) as submission_count
    FROM quizzes q
    LEFT JOIN units u ON q.unit_id = u.id
    LEFT JOIN quiz_questions qq ON q.id = qq.quiz_id
    LEFT JOIN submissions s ON q.id = s.quiz_id
    WHERE q.class_id = $1
    GROUP BY q.id, u.title
    ORDER BY q.created_at DESC
  `, [classId]);
};

export const addQuestionsToQuiz = async (quizId, questions) => {
  // Start a transaction to ensure all questions are added
  return db.tx(async t => {
    const insertQueries = questions.map((question, index) => {
      return t.one(`
        INSERT INTO quiz_questions (
          quiz_id, 
          question_id, 
          points, 
          position
        ) VALUES ($1, $2, $3, $4)
        RETURNING *
      `, [quizId, question.questionId, question.points, index + 1]);
    });

    const insertedQuestions = await t.batch(insertQueries);

    // Get updated quiz with questions
    return t.one(`
      SELECT q.*,
             json_agg(
               json_build_object(
                 'id', qu.id,
                 'prompt', qu.prompt,
                 'qtype', qu.qtype,
                 'points', qq.points,
                 'position', qq.position
               )
             ) as questions
      FROM quizzes q
      LEFT JOIN quiz_questions qq ON q.id = qq.quiz_id
      LEFT JOIN questions qu ON qq.question_id = qu.id
      WHERE q.id = $1
      GROUP BY q.id
    `, [quizId]);
  });
};