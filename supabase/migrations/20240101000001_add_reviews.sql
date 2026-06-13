-- Migration: Add user review system to disease_reports

ALTER TABLE disease_reports 
ADD COLUMN user_rating INT CHECK (user_rating >= 1 AND user_rating <= 5);

ALTER TABLE disease_reports 
ADD COLUMN user_feedback TEXT;
