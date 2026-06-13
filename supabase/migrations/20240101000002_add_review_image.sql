-- Migration: Add image attachment to disease_reports reviews

ALTER TABLE disease_reports 
ADD COLUMN user_feedback_image_url TEXT;
