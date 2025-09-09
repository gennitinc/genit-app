-- Migration: Add agentDescription column to business_profiles table
-- Run this in your Supabase SQL editor

-- Add the agentDescription column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'business_profiles' 
        AND column_name = 'agentDescription'
    ) THEN
        ALTER TABLE business_profiles ADD COLUMN agentDescription TEXT;
    END IF;
END $$;

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'business_profiles' 
AND column_name = 'agentDescription';
