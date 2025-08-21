-- =====================================================
-- Cleanup Script for Gennit Database
-- =====================================================
-- WARNING: This will remove all data and objects!
-- Only run this if you want to start fresh.

-- Drop triggers first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_teams_updated_at ON teams;
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
DROP TRIGGER IF EXISTS update_chat_sessions_updated_at ON chat_sessions;
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
DROP TRIGGER IF EXISTS update_usage_tracking_updated_at ON usage_tracking;

-- Drop functions
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS get_user_plan(UUID);
DROP FUNCTION IF EXISTS has_active_subscription(UUID);
DROP FUNCTION IF EXISTS get_today_usage(UUID);

-- Drop views
DROP VIEW IF EXISTS user_profile_with_subscription;
DROP VIEW IF EXISTS team_members;

-- Drop tables (in reverse dependency order)
DROP TABLE IF EXISTS usage_tracking CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS chat_sessions CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop extensions
DROP EXTENSION IF EXISTS "uuid-ossp";

-- =====================================================
-- END OF CLEANUP SCRIPT
-- =====================================================
