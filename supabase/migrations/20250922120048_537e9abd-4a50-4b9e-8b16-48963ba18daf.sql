-- Add new columns to user_settings table for the questionnaire
ALTER TABLE public.user_settings 
ADD COLUMN IF NOT EXISTS reminder_frequency_minutes integer DEFAULT 15,
ADD COLUMN IF NOT EXISTS minutes_per_exercise_rep integer DEFAULT 1;