-- =====================================================
-- Gennit Database Setup Script for Supabase
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES TABLE
-- =====================================================

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  username TEXT NOT NULL,
  userdp TEXT,
  metadata JSONB DEFAULT '{}',
  teams JSONB DEFAULT '[]',
  userPlan TEXT DEFAULT 'Starter' CHECK (userPlan IN ('Starter', 'Premium', 'Team', 'Enterprise')),
  emailVerified BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

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

-- Enable RLS on business_profiles table
ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;

-- Business profile policies
CREATE POLICY "Users can view their own business profile" ON business_profiles
  FOR SELECT USING (auth.uid() = userId);

CREATE POLICY "Users can update their own business profile" ON business_profiles
  FOR UPDATE USING (auth.uid() = userId);

CREATE POLICY "Users can insert their own business profile" ON business_profiles
  FOR INSERT WITH CHECK (auth.uid() = userId);

-- Create trigger for business_profiles updatedAt
DROP TRIGGER IF EXISTS update_business_profiles_updated_at ON business_profiles;
CREATE TRIGGER update_business_profiles_updated_at
  BEFORE UPDATE ON business_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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

-- Policy: Allow public read access to basic profile info (for team features)
CREATE POLICY "Public can view basic profile info" ON profiles
  FOR SELECT USING (true);

-- =====================================================
-- TRIGGERS AND FUNCTIONS
-- =====================================================

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, username, userdp, userPlan, emailVerified)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'userdp',
    'Starter',
    NEW.email_confirmed_at IS NOT NULL
  );
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

-- Create trigger to automatically update updatedAt
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TEAMS TABLE (for team collaboration features)
-- =====================================================

CREATE TABLE IF NOT EXISTS teams (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  ownerId UUID REFERENCES profiles(id) ON DELETE CASCADE,
  members JSONB DEFAULT '[]',
  settings JSONB DEFAULT '{}',
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on teams table
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Team policies
CREATE POLICY "Team members can view their teams" ON teams
  FOR SELECT USING (
    auth.uid() = ownerId OR 
    auth.uid()::text = ANY(SELECT jsonb_array_elements_text(members))
  );

CREATE POLICY "Team owners can update their teams" ON teams
  FOR UPDATE USING (auth.uid() = ownerId);

CREATE POLICY "Team owners can delete their teams" ON teams
  FOR DELETE USING (auth.uid() = ownerId);

CREATE POLICY "Users can create teams" ON teams
  FOR INSERT WITH CHECK (auth.uid() = ownerId);

-- Create trigger for teams updatedAt
DROP TRIGGER IF EXISTS update_teams_updated_at ON teams;
CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- PROJECTS TABLE (for user projects)
-- =====================================================

CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  ownerId UUID REFERENCES profiles(id) ON DELETE CASCADE,
  teamId UUID REFERENCES teams(id) ON DELETE SET NULL,
  settings JSONB DEFAULT '{}',
  isPublic BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on projects table
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Project policies
CREATE POLICY "Users can view their own projects" ON projects
  FOR SELECT USING (auth.uid() = ownerId);

CREATE POLICY "Users can view public projects" ON projects
  FOR SELECT USING (isPublic = true);

CREATE POLICY "Team members can view team projects" ON projects
  FOR SELECT USING (
    teamId IN (
      SELECT id FROM teams 
      WHERE ownerId = auth.uid() OR 
            auth.uid()::text = ANY(SELECT jsonb_array_elements_text(members))
    )
  );

CREATE POLICY "Users can update their own projects" ON projects
  FOR UPDATE USING (auth.uid() = ownerId);

CREATE POLICY "Users can delete their own projects" ON projects
  FOR DELETE USING (auth.uid() = ownerId);

CREATE POLICY "Users can create projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = ownerId);

-- Create trigger for projects updatedAt
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- CHAT SESSIONS TABLE (for chat history)
-- =====================================================

CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  userId UUID REFERENCES profiles(id) ON DELETE CASCADE,
  projectId UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  messages JSONB DEFAULT '[]',
  settings JSONB DEFAULT '{}',
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on chat_sessions table
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

-- Chat session policies
CREATE POLICY "Users can view their own chat sessions" ON chat_sessions
  FOR SELECT USING (auth.uid() = userId);

CREATE POLICY "Users can update their own chat sessions" ON chat_sessions
  FOR UPDATE USING (auth.uid() = userId);

CREATE POLICY "Users can delete their own chat sessions" ON chat_sessions
  FOR DELETE USING (auth.uid() = userId);

CREATE POLICY "Users can create chat sessions" ON chat_sessions
  FOR INSERT WITH CHECK (auth.uid() = userId);

-- Create trigger for chat_sessions updatedAt
DROP TRIGGER IF EXISTS update_chat_sessions_updated_at ON chat_sessions;
CREATE TRIGGER update_chat_sessions_updated_at
  BEFORE UPDATE ON chat_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SUBSCRIPTIONS TABLE (for billing/plans)
-- =====================================================

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  userId UUID REFERENCES profiles(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('Starter', 'Premium', 'Team', 'Enterprise')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid')),
  stripeCustomerId TEXT,
  stripeSubscriptionId TEXT,
  currentPeriodStart TIMESTAMP WITH TIME ZONE,
  currentPeriodEnd TIMESTAMP WITH TIME ZONE,
  cancelAtPeriodEnd BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on subscriptions table
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Subscription policies
CREATE POLICY "Users can view their own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = userId);

CREATE POLICY "Users can update their own subscriptions" ON subscriptions
  FOR UPDATE USING (auth.uid() = userId);

CREATE POLICY "Users can create subscriptions" ON subscriptions
  FOR INSERT WITH CHECK (auth.uid() = userId);

-- Create trigger for subscriptions updatedAt
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- USAGE TRACKING TABLE (for API usage limits)
-- =====================================================

CREATE TABLE IF NOT EXISTS usage_tracking (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  userId UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  apiCalls INTEGER DEFAULT 0,
  tokensUsed INTEGER DEFAULT 0,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(userId, date)
);

-- Enable RLS on usage_tracking table
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

-- Usage tracking policies
CREATE POLICY "Users can view their own usage" ON usage_tracking
  FOR SELECT USING (auth.uid() = userId);

CREATE POLICY "Users can update their own usage" ON usage_tracking
  FOR UPDATE USING (auth.uid() = userId);

CREATE POLICY "Users can create usage records" ON usage_tracking
  FOR INSERT WITH CHECK (auth.uid() = userId);

-- Create trigger for usage_tracking updatedAt
DROP TRIGGER IF EXISTS update_usage_tracking_updated_at ON usage_tracking;
CREATE TRIGGER update_usage_tracking_updated_at
  BEFORE UPDATE ON usage_tracking
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to get user's current plan
CREATE OR REPLACE FUNCTION get_user_plan(user_uuid UUID)
RETURNS TEXT AS $$
DECLARE
  user_plan TEXT;
BEGIN
  SELECT userPlan INTO user_plan
  FROM profiles
  WHERE id = user_uuid;
  
  RETURN COALESCE(user_plan, 'Starter');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has active subscription
CREATE OR REPLACE FUNCTION has_active_subscription(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  subscription_exists BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM subscriptions 
    WHERE userId = user_uuid 
    AND status = 'active'
    AND (currentPeriodEnd IS NULL OR currentPeriodEnd > NOW())
  ) INTO subscription_exists;
  
  RETURN subscription_exists;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's usage for today
CREATE OR REPLACE FUNCTION get_today_usage(user_uuid UUID)
RETURNS TABLE(api_calls INTEGER, tokens_used INTEGER) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(ut.apiCalls, 0) as api_calls,
    COALESCE(ut.tokensUsed, 0) as tokens_used
  FROM usage_tracking ut
  WHERE ut.userId = user_uuid AND ut.date = CURRENT_DATE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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

-- View for user profile with subscription info
CREATE OR REPLACE VIEW user_profile_with_subscription AS
SELECT 
  p.*,
  s.plan as subscription_plan,
  s.status as subscription_status,
  s.currentPeriodEnd as subscription_end_date
FROM profiles p
LEFT JOIN subscriptions s ON p.id = s.userId AND s.status = 'active';

-- View for team members
CREATE OR REPLACE VIEW team_members AS
SELECT 
  t.id as team_id,
  t.name as team_name,
  p.id as user_id,
  p.username,
  p.email,
  p.userdp
FROM teams t
JOIN profiles p ON p.id::text = ANY(SELECT jsonb_array_elements_text(t.members))
UNION
SELECT 
  t.id as team_id,
  t.name as team_name,
  p.id as user_id,
  p.username,
  p.email,
  p.userdp
FROM teams t
JOIN profiles p ON t.ownerId = p.id;

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
-- INITIAL DATA (Optional)
-- =====================================================

-- Insert default settings for new users
-- This will be handled by the trigger when users sign up

-- =====================================================
-- COMMENTS AND DOCUMENTATION
-- =====================================================

COMMENT ON TABLE profiles IS 'User profiles with authentication and basic info';
COMMENT ON TABLE business_profiles IS 'Business information collected during onboarding';
COMMENT ON TABLE teams IS 'Teams for collaboration features';
COMMENT ON TABLE projects IS 'User projects for AI chat and other features';
COMMENT ON TABLE chat_sessions IS 'Chat history and sessions';
COMMENT ON TABLE subscriptions IS 'User subscription and billing information';
COMMENT ON TABLE usage_tracking IS 'API usage tracking for rate limiting';

COMMENT ON FUNCTION handle_new_user() IS 'Automatically creates profile when user signs up';
COMMENT ON FUNCTION get_user_plan(UUID) IS 'Returns the current plan for a user';
COMMENT ON FUNCTION has_active_subscription(UUID) IS 'Checks if user has active subscription';
COMMENT ON FUNCTION get_today_usage(UUID) IS 'Gets usage statistics for today';
COMMENT ON FUNCTION has_completed_onboarding(UUID) IS 'Checks if user has completed onboarding';

-- =====================================================
-- END OF SETUP SCRIPT
-- =====================================================
