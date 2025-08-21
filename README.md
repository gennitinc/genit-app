# Gennit - AI-Powered SaaS Platform

This is a [Next.js](https://nextjs.org) project with Supabase authentication, React Email, and Resend integration.

## Features

- 🔐 **Supabase Authentication** - Email/password, Google, and Facebook OAuth
- 📧 **Email System** - React Email templates with Resend for verification and password reset
- 🛡️ **Protected Routes** - Middleware-based route protection
- 🎨 **Modern UI** - Built with Tailwind CSS and Radix UI components
- 📱 **Responsive Design** - Works on all devices

## Getting Started

### 1. Environment Setup

Create a `.env.local` file in the root directory:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Resend Email Configuration
RESEND_API_KEY=your_resend_api_key

# OAuth Configuration (Optional)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL script in `database-setup.sql` in your Supabase SQL editor
3. Configure OAuth providers in Supabase Auth settings

### 3. Email Setup

1. Sign up for [Resend](https://resend.com)
2. Add your domain to Resend
3. Update the `from` email in `app/api/send-email/route.ts`

### 4. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 5. Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Protected Routes

The following routes are protected and require authentication:

- `/chat` - Chat interface
- `/dashboard` - User dashboard
- `/profile` - User profile
- `/update-password` - Password update page

Authenticated users are redirected away from:

- `/signin` - Sign in page
- `/signup` - Sign up page
- `/recover` - Password recovery page

## Email Templates

Email templates are located in the `emails/` directory:

- `verification-email.tsx` - Email verification template
- `reset-password-email.tsx` - Password reset template

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [React Email Documentation](https://react.email)
- [Resend Documentation](https://resend.com/docs)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
