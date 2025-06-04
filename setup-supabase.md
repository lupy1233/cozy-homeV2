# 🚀 Supabase Setup Guide

## 📋 Step 1: Environment Variables

Create a `.env.local` file in your project root with the following content:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://qwjowtodjikqrtljzwnl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3am93dG9kamlrcXJ0bGp6d25sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MzEwMDQsImV4cCI6MjA2NDEwNzAwNH0.qkLVppg-ayo39DWeyq6UTmZOtx7lge36MxrQ-H0a_j8
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3am93dG9kamlrcXJ0bGp6d25sIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODUzMTAwNCwiZXhwIjoyMDY0MTA3MDA0fQ.PkL8IAdDIStBiISmax5mn1sBIttiaHD48ZXvFhArCUU

# Authentication
NEXTAUTH_SECRET=your-nextauth-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 📊 Step 2: Database Setup

### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project: https://supabase.com/dashboard/project/qwjowtodjikqrtljzwnl
2. Navigate to **SQL Editor**
3. Copy and paste the content from `supabase/schema.sql`
4. Run the SQL to create all tables and types
5. Copy and paste the content from `supabase/rls-policies.sql`
6. Run the SQL to set up security policies

### Option B: Using Supabase CLI (Advanced)

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref qwjowtodjikqrtljzwnl

# Apply migrations
supabase db push
```

## 🔐 Step 3: Authentication Configuration

1. In your Supabase dashboard, go to **Authentication > Settings**
2. Configure the following:

### Email Settings

- **Enable email confirmations**: ✅ Enabled
- **Enable email change confirmations**: ✅ Enabled
- **Secure email change**: ✅ Enabled

### Password Settings

- **Minimum password length**: 8
- **Password requirements**: Enable all (uppercase, numbers, symbols)

### URL Configuration

- **Site URL**: `http://localhost:3000`
- **Redirect URLs**:
  - `http://localhost:3000/auth/callback`
  - `http://localhost:3000/dashboard`

## 🔑 Step 4: Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `https://qwjowtodjikqrtljzwnl.supabase.co/auth/v1/callback`
6. In Supabase dashboard, go to **Authentication > Providers**
7. Enable Google provider and add your credentials

## 🗄️ Step 5: Storage Setup (For File Uploads)

1. In Supabase dashboard, go to **Storage**
2. Create a new bucket called `rfq-files`
3. Set bucket to **Public** if you want public file access
4. Configure RLS policies for the bucket

## 🧪 Step 6: Test the Setup

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/register`
3. Try creating a new account
4. Check if the user appears in your Supabase **Authentication** tab
5. Check if the user profile is created in the **users** table

## 📝 Step 7: Create Test Data

You can create some test manufacturers manually in the database:

```sql
-- Insert a test manufacturer
INSERT INTO public.users (
  id, email, first_name, last_name, role,
  company_name, company_description, status, is_verified
) VALUES (
  gen_random_uuid(),
  'manufacturer@test.com',
  'Test',
  'Manufacturer',
  'manufacturer',
  'Test Furniture SRL',
  'We create beautiful custom furniture',
  'active',
  true
);
```

## 🚨 Troubleshooting

### Common Issues:

1. **Environment variables not loading**

   - Restart your development server after creating `.env.local`
   - Make sure the file is in the project root

2. **Database connection errors**

   - Verify your Supabase URL and keys
   - Check if your IP is allowed in Supabase settings

3. **Authentication not working**

   - Check if email confirmation is properly configured
   - Verify redirect URLs in Supabase settings

4. **RLS policies blocking access**
   - Check the browser console for policy errors
   - Verify user roles are set correctly

## 📞 Need Help?

If you encounter any issues:

1. Check the browser console for errors
2. Check the Supabase logs in your dashboard
3. Verify all environment variables are set correctly
4. Make sure the database schema is applied correctly

## 🎯 Next Steps

Once everything is working:

1. Test user registration and login
2. Test RFQ creation
3. Test file uploads
4. Set up email templates
5. Configure production environment
