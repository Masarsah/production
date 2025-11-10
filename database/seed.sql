create database chaten;



\c chaten



-- 1) Users & auth
CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone          TEXT UNIQUE ,
  email           TEXT UNIQUE ,
  password_hash   TEXT ,
  display_name    TEXT,
  role            TEXT NOT NULL CHECK (role IN ('student','teacher','admin')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Optional: track logins
CREATE TABLE login_events (
  id         BIGSERIAL PRIMARY KEY,
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  logged_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_addr    INET,
  user_agent TEXT
);

-- 2) Classes & enrollment
CREATE TABLE classes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code        TEXT UNIQUE NOT NULL,       -- e.g., "MATH101-FA25"
  title       TEXT NOT NULL,
  teacher_id  UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Many-to-many: who is in which class
CREATE TABLE enrollments (
  user_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  class_id  UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  role_in_class TEXT NOT NULL CHECK (role_in_class IN ('student','ta','teacher')),
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, class_id)
);

-- 3) Units (chapters/modules) inside a class
CREATE TABLE units (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id   UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  position   INT  NOT NULL DEFAULT 1,     -- order in the class
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4) Questions (AI- or human-generated)
CREATE TABLE questions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id     UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  unit_id      UUID REFERENCES units(id) ON DELETE SET NULL,
  source       TEXT NOT NULL CHECK (source IN ('ai','manual')),
  qtype        TEXT NOT NULL CHECK (qtype IN ('mcq','short_text','long_text','true_false','code')),
  prompt       TEXT NOT NULL,
  -- For MCQ/TF or structured data; store AI metadata too
  metadata     JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by   UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Optional: choices for MCQ/TF (if you use structured options)
CREATE TABLE question_choices (
  id           BIGSERIAL PRIMARY KEY,
  question_id  UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  label        TEXT NOT NULL,            -- e.g., "A", "B", ...
  text         TEXT NOT NULL,
  is_correct   BOOLEAN NOT NULL DEFAULT false,
  position     INT NOT NULL DEFAULT 1
);

-- 5) Assign questions via quizzes/assignments (optional but recommended)
CREATE TABLE quizzes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id    UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  unit_id     UUID REFERENCES units(id) ON DELETE SET NULL,
  title       TEXT NOT NULL,
  instructions TEXT,
  max_score   NUMERIC(6,2) NOT NULL DEFAULT 100,
  time_limit_seconds INT,                -- null = untimed
  max_attempts INT,                      -- null = unlimited
  available_from TIMESTAMPTZ,
  due_at      TIMESTAMPTZ,
  grading_rule JSONB NOT NULL DEFAULT '{}'::jsonb, -- e.g., {"policy":"latest"|"highest"}
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE quiz_questions (
  quiz_id     UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  points      NUMERIC(6,2) NOT NULL DEFAULT 1,
  position    INT NOT NULL DEFAULT 1,
  PRIMARY KEY (quiz_id, question_id)
);

-- 6) Answers / attempts
-- A submission captures a user's attempt on a quiz
CREATE TABLE submissions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id     UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  started_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  submitted_at TIMESTAMPTZ,
  total_score NUMERIC(6,2),
  status      TEXT NOT NULL DEFAULT 'in_progress' 
              CHECK (status IN ('in_progress','submitted','graded','late','invalid'))
);

-- Each question’s answer within a submission
CREATE TABLE answers (
  id             BIGSERIAL PRIMARY KEY,
  submission_id  UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  question_id    UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  -- For MCQ: store selected choice ids, else keep text/code
  selected_choice_ids BIGINT[] DEFAULT NULL,   -- references question_choices(id); keep as array
  answer_text    TEXT,                         -- free text / code / explanation
  is_correct     BOOLEAN,                      -- nullable until auto/teacher grading
  score          NUMERIC(6,2),
  graded_by      UUID REFERENCES users(id) ON DELETE SET NULL,
  graded_at      TIMESTAMPTZ
);

-- 7) (Optional) Track AI generation details for questions
CREATE TABLE ai_generations (
  id            BIGSERIAL PRIMARY KEY,
  question_id   UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  model_name    TEXT NOT NULL,                -- e.g., "gpt-4o-mini"
  temperature   NUMERIC(3,2),
  seed          INT,
  prompt_used   TEXT,                         -- system/user prompt to generate the question
  response_raw  TEXT,                         -- raw AI output for auditing
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);


CREATE TABLE chat_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender     TEXT,
  text TEXT,
  user_id     UUID ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
  
);


CREATE TABLE IF NOT EXISTS push_subscriptions (
id SERIAL PRIMARY KEY,
endpoint TEXT UNIQUE,
subscription JSONB
);
