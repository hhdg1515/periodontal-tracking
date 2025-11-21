# Supabase Setup Guide

This guide will help you set up Supabase for the PerioTrack AI application.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Fill in project details:
   - **Project Name**: PerioTrack AI
   - **Database Password**: (save this securely)
   - **Region**: Choose closest to your location
5. Click "Create new project"
6. Wait for the project to be provisioned (2-3 minutes)

## Step 2: Get API Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Find and copy the following:
   - **Project URL** (under Configuration)
   - **anon/public key** (under Project API keys)
   - **service_role key** (under Project API keys - keep this secret!)

## Step 3: Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   \`\`\`bash
   cp .env.local.example .env.local
   \`\`\`

2. Edit `.env.local` and fill in your Supabase credentials:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   \`\`\`

## Step 4: Run Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the entire contents of `lib/supabase/schema.sql`
4. Paste into the SQL editor
5. Click "Run" or press Cmd/Ctrl + Enter
6. You should see "Success. No rows returned"

## Step 5: Create Storage Bucket for X-rays

1. In your Supabase dashboard, go to **Storage**
2. Click "Create a new bucket"
3. Bucket name: `xrays`
4. **Public bucket**: ✅ Enable (so X-rays can be viewed in the app)
5. Click "Create bucket"

### Set Storage Policies

After creating the bucket, you need to set up access policies:

1. Click on the `xrays` bucket
2. Go to "Policies" tab
3. Click "New Policy"

#### Policy 1: Allow Public Read Access
\`\`\`sql
-- Policy name: Allow public read access to X-rays
-- Allowed operation: SELECT
-- Policy definition:
true
\`\`\`

#### Policy 2: Allow Authenticated Users to Upload
\`\`\`sql
-- Policy name: Allow authenticated users to upload
-- Allowed operation: INSERT
-- Policy definition:
(bucket_id = 'xrays'::text)
\`\`\`

#### Policy 3: Allow Authenticated Users to Delete
\`\`\`sql
-- Policy name: Allow authenticated users to delete
-- Allowed operation: DELETE
-- Policy definition:
(bucket_id = 'xrays'::text)
\`\`\`

## Step 6: Insert Demo Clinic Data

For MVP testing, we'll insert a demo clinic:

1. Go to **SQL Editor** in Supabase
2. Run this query:
   \`\`\`sql
   INSERT INTO clinics (id, name, email, subscription_tier)
   VALUES (
     'demo-clinic-id',
     'Demo Dental Clinic',
     'demo@periothack.ai',
     'professional'
   );
   \`\`\`

## Step 7: Test the Connection

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

3. Open http://localhost:3000/dashboard/patients
4. Try adding a patient - it should save to Supabase!

## Verification Checklist

- [ ] Supabase project created
- [ ] API credentials copied to `.env.local`
- [ ] Database schema executed successfully
- [ ] All 7 tables created (check Table Editor)
- [ ] Storage bucket `xrays` created with public access
- [ ] Storage policies configured
- [ ] Demo clinic inserted
- [ ] App running locally
- [ ] Can add and view patients

## Troubleshooting

### Error: "No API key found"
- Make sure `.env.local` exists in the project root
- Check that variable names match exactly: `NEXT_PUBLIC_SUPABASE_URL` etc.
- Restart the dev server after changing `.env.local`

### Error: "Permission denied for schema public"
- Your database password might be incorrect
- Try resetting the database password in Supabase settings

### Error: "Bucket not found"
- Make sure you created the `xrays` bucket exactly as specified
- Check that it's marked as public

### Storage upload fails
- Check that storage policies are configured correctly
- Make sure the bucket is public
- Verify file size limits (default is 50MB)

## Security Notes for Production

1. **Row Level Security (RLS)**: The schema enables RLS but policies need to be added based on your auth implementation
2. **Service Role Key**: Never expose this in client-side code
3. **API Keys**: The anon key can be in client code, but add proper RLS policies
4. **Storage**: Consider making the bucket private in production and using signed URLs

## Next Steps

- Implement authentication (Supabase Auth)
- Add Row Level Security policies
- Configure email templates for patient reports
- Set up database backups
- Add monitoring and logging

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
