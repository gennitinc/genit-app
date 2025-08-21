# Supabase Authentication Setup

This guide will help you set up Supabase authentication for your Gennit application.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your project URL and anon key

## 2. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Resend Configuration (for email sending)
RESEND_API_KEY=your_resend_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 3. Database Setup

Run the following SQL in your Supabase SQL editor to create the profiles table:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  username TEXT NOT NULL,
  userdp TEXT,
  metadata JSONB,
  teams JSONB,
  userPlan TEXT DEFAULT 'Starter' CHECK (userPlan IN ('Starter', 'Premium', 'Team', 'Enterprise')),
  emailVerified BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to handle new user signup
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
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

## 4. OAuth Providers Setup

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Set authorized redirect URI to: `https://your-project.supabase.co/auth/v1/callback`
6. Copy Client ID and Client Secret
7. In Supabase Dashboard → Authentication → Providers → Google
8. Enable Google provider and add your Client ID and Client Secret

### Facebook OAuth

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Set OAuth redirect URI to: `https://your-project.supabase.co/auth/v1/callback`
5. Copy App ID and App Secret
6. In Supabase Dashboard → Authentication → Providers → Facebook
7. Enable Facebook provider and add your App ID and App Secret

## 5. Email Configuration

### Resend Setup

1. Sign up at [resend.com](https://resend.com)
2. Get your API key
3. Add it to your environment variables

### Email Templates

The application includes email templates for:

- Email verification (`emails/verification-email.tsx`)
- Password reset (`emails/reset-password-email.tsx`)

## 6. Testing

1. Start your development server: `npm run dev`
2. Test signup flow at `/signup`
3. Test signin flow at `/signin`
4. Test password reset at `/recover`
5. Test OAuth providers (Google and Facebook)

## 7. Production Deployment

1. Update environment variables for production
2. Set up custom domain in Supabase if needed
3. Update OAuth redirect URIs for production domain
4. Configure email templates for production

## Troubleshooting

- Check browser console for authentication errors
- Verify environment variables are correctly set
- Ensure OAuth providers are properly configured
- Check Supabase logs for server-side errors
