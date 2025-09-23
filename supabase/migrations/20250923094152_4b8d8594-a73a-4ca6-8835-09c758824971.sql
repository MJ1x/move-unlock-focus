-- Clean up duplicate columns in user_settings table
-- Remove the redundant minutes_per_rep column and keep only minutes_per_exercise_rep
ALTER TABLE public.user_settings DROP COLUMN IF EXISTS minutes_per_rep;