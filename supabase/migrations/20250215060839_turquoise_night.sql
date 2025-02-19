/*
  # Exam System Schema

  1. New Tables
    - `exams`
      - Basic exam information
      - Configuration and settings
    - `exam_questions`
      - Questions for each exam
      - Different types (MCQ, Coding, Essay)
    - `exam_eligibility`
      - Links users to exams they can take
      - Tracks eligibility status
    - `exam_submissions`
      - User's exam attempts and answers
      - Completion status and scores

  2. Security
    - Enable RLS on all tables
    - Policies for admin and seeker access
*/

-- Create exam table
CREATE TABLE IF NOT EXISTS exams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  duration integer NOT NULL, -- in minutes
  start_date timestamp with time zone NOT NULL,
  end_date timestamp with time zone NOT NULL,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create questions table
CREATE TABLE IF NOT EXISTS exam_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid REFERENCES exams(id) ON DELETE CASCADE,
  question_type text NOT NULL CHECK (question_type IN ('MCQ', 'Coding', 'Essay')),
  question_text text NOT NULL,
  options jsonb, -- for MCQ
  correct_answers jsonb, -- for MCQ
  programming_language text, -- for Coding
  code_template text, -- for Coding
  sample_input text, -- for Coding
  sample_output text, -- for Coding
  min_words integer, -- for Essay
  points integer NOT NULL DEFAULT 1,
  created_at timestamp with time zone DEFAULT now()
);

-- Create eligibility table
CREATE TABLE IF NOT EXISTS exam_eligibility (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid REFERENCES exams(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  is_eligible boolean DEFAULT true,
  approved_by uuid REFERENCES auth.users(id),
  approved_at timestamp with time zone DEFAULT now(),
  UNIQUE(exam_id, user_id)
);

-- Create submissions table
CREATE TABLE IF NOT EXISTS exam_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid REFERENCES exams(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at timestamp with time zone DEFAULT now(),
  completed_at timestamp with time zone,
  answers jsonb,
  score numeric,
  status text DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  UNIQUE(exam_id, user_id)
);

-- Enable RLS
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_eligibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_submissions ENABLE ROW LEVEL SECURITY;

-- Policies for exams table
CREATE POLICY "Admins can manage exams"
  ON exams
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Seekers can view available exams"
  ON exams
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM exam_eligibility
      WHERE exam_id = exams.id
      AND user_id = auth.uid()
      AND is_eligible = true
    )
  );

-- Policies for exam_questions table
CREATE POLICY "Admins can manage questions"
  ON exam_questions
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Seekers can view questions for their exams"
  ON exam_questions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM exam_eligibility
      WHERE exam_id = exam_questions.exam_id
      AND user_id = auth.uid()
      AND is_eligible = true
    )
  );

-- Policies for exam_eligibility table
CREATE POLICY "Admins can manage eligibility"
  ON exam_eligibility
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Seekers can view their eligibility"
  ON exam_eligibility
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Policies for exam_submissions table
CREATE POLICY "Admins can view all submissions"
  ON exam_submissions
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Seekers can manage their submissions"
  ON exam_submissions
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());