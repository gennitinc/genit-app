-- =====================================================
-- SUPABASE DATABASE SETUP - SIMPLIFIED VERSION
-- =====================================================
-- This script sets up the essential tables for authentication and onboarding
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES TABLE (for user authentication and basic info)
-- =====================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  userdp TEXT,
  metadata JSONB DEFAULT '{}',
  teams JSONB DEFAULT '[]',
  userPlan TEXT DEFAULT 'Starter' CHECK (userPlan IN ('Starter', 'Premium', 'Team', 'Enterprise')),
  emailVerified BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- BUSINESS PROFILES TABLE (for onboarding data)
-- =====================================================

CREATE TABLE IF NOT EXISTS business_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  userId UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  businessName TEXT NOT NULL,
  businessEmail TEXT,
  companyWebsite TEXT,
  businessBio TEXT,
  businessImage TEXT,
  industry TEXT,
  country TEXT,
  language TEXT DEFAULT 'English',
  primaryGoal TEXT,
  channels JSONB DEFAULT '[]',
  agentType TEXT,
  agentName TEXT,
  agentDescription TEXT,
  onboardingCompleted BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Policy: Allow public read access to basic profile info
CREATE POLICY "Public can view basic profile info" ON profiles
  FOR SELECT USING (true);

-- Enable RLS on business_profiles table
ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;

-- Business profile policies
CREATE POLICY "Users can view their own business profile" ON business_profiles
  FOR SELECT USING (auth.uid() = userId);

CREATE POLICY "Users can update their own business profile" ON business_profiles
  FOR UPDATE USING (auth.uid() = userId);

CREATE POLICY "Users can insert their own business profile" ON business_profiles
  FOR INSERT WITH CHECK (auth.uid() = userId);

-- =====================================================
-- TRIGGERS AND FUNCTIONS
-- =====================================================

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
  username_exists BOOLEAN;
  attempts INTEGER := 0;
  max_attempts INTEGER := 10;
BEGIN
  -- Get base username from metadata or email
  base_username := COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1));
  final_username := base_username;
  
  -- Check if username exists and generate unique one if needed
  WHILE attempts < max_attempts LOOP
    SELECT EXISTS(SELECT 1 FROM profiles WHERE username = final_username) INTO username_exists;
    
    IF NOT username_exists THEN
      EXIT; -- Username is available
    END IF;
    
    -- Generate unique username with UUID suffix
    final_username := base_username || '_' || substr(gen_random_uuid()::text, 1, 8);
    attempts := attempts + 1;
  END LOOP;
  
  -- Insert profile with unique username
  INSERT INTO profiles (id, email, username, userdp, userPlan, emailVerified, metadata, createdAt, updatedAt)
  VALUES (
    NEW.id,
    NEW.email,
    final_username,
    NEW.raw_user_meta_data->>'userdp',
    'Starter',
    NEW.email_confirmed_at IS NOT NULL,
    COALESCE(NEW.raw_user_meta_data, '{}'::jsonb),
    NEW.created_at,
    NEW.updated_at
  );
  
  -- Log the created username for debugging
  RAISE NOTICE 'Created profile for user % with username: %', NEW.email, final_username;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the signup
    RAISE WARNING 'Error creating profile for user %: %', NEW.email, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update the updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updatedAt = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profiles updatedAt
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for business_profiles updatedAt
DROP TRIGGER IF EXISTS update_business_profiles_updated_at ON business_profiles;
CREATE TRIGGER update_business_profiles_updated_at
  BEFORE UPDATE ON business_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to check if user has completed onboarding
CREATE OR REPLACE FUNCTION has_completed_onboarding(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  onboarding_completed BOOLEAN;
BEGIN
  SELECT COALESCE(bp.onboardingCompleted, FALSE) INTO onboarding_completed
  FROM business_profiles bp
  WHERE bp.userId = user_uuid;
  
  RETURN onboarding_completed;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- View for complete user profile with business info
CREATE OR REPLACE VIEW complete_user_profile AS
SELECT 
  p.*,
  bp.businessName,
  bp.businessEmail,
  bp.companyWebsite,
  bp.businessBio,
  bp.businessImage,
  bp.industry,
  bp.country,
  bp.language,
  bp.primaryGoal,
  bp.channels,
  bp.agentType,
  bp.agentName,
  bp.agentDescription,
  bp.onboardingCompleted
FROM profiles p
LEFT JOIN business_profiles bp ON p.id = bp.userId;

-- =====================================================
-- COMMENTS AND DOCUMENTATION
-- =====================================================

COMMENT ON TABLE profiles IS 'User profiles with authentication and basic info';
COMMENT ON TABLE business_profiles IS 'Business information collected during onboarding';

COMMENT ON FUNCTION handle_new_user() IS 'Automatically creates profile when user signs up';
COMMENT ON FUNCTION has_completed_onboarding(UUID) IS 'Checks if user has completed onboarding';

-- =====================================================
-- END OF SETUP SCRIPT
-- =====================================================
