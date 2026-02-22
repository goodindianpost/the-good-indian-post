# Supabase Setup Guide

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Configure:
   - **Name:** `the-good-indian-post`
   - **Database Password:** (save this!)
   - **Region:** Choose closest to your users
4. Wait for project to be created (~2 minutes)

## Step 2: Get API Credentials

1. Go to **Settings → API**
2. Copy these values to your `.env.local` file:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

## Step 3: Run Database Migrations

Go to **SQL Editor** in Supabase Dashboard and run each file in order:

1. `migrations/001_create_tables.sql` - Creates all tables
2. `migrations/002_functions_triggers.sql` - Creates functions and triggers
3. `migrations/003_rls_policies.sql` - Sets up Row Level Security
4. `migrations/004_seed_categories.sql` - Seeds initial categories

Or copy the entire `combined_migration.sql` file and run it all at once.

## Step 4: Create Storage Bucket

1. Go to **Storage** in Supabase Dashboard
2. Click "New bucket"
3. Configure:
   - **Name:** `media`
   - **Public bucket:** ✅ Yes
4. Click "Create bucket"
5. Go to **Storage → Policies** and run `migrations/005_storage_setup.sql`

## Step 5: Create Admin User

1. Go to **Authentication → Users**
2. Click "Add user" → "Create new user"
3. Enter your email and password
4. After user is created, go to **Table Editor → profiles**
5. Find your user and change `role` to `admin`

## Step 6: Enable Email Auth

1. Go to **Authentication → Providers**
2. Ensure **Email** is enabled
3. Configure email templates if needed

## Verification Checklist

- [ ] All 6 tables created (profiles, categories, articles, tags, article_tags, media)
- [ ] RLS enabled on all tables
- [ ] Functions and triggers created
- [ ] 6 categories seeded
- [ ] Media storage bucket created
- [ ] Storage policies applied
- [ ] Admin user created and role set
- [ ] `.env.local` configured with credentials

## Testing the Setup

Run the app locally:
```bash
npm run dev
```

If you see errors about missing environment variables, double-check your `.env.local` file.
