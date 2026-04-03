# Supabase Database Setup

This directory contains SQL migration files for the ArtistFlow database schema.

## Setup Instructions

1. Create a new Supabase project at https://app.supabase.com/

2. Go to SQL Editor in your Supabase dashboard

3. Run the migration files in order:
   - `001_initial_schema.sql` - Creates all tables, indexes, RLS policies, and triggers

4. Get your Supabase credentials:
   - Project URL: Found in Project Settings → API
   - Anon Key: Found in Project Settings → API
   - Service Role Key: Found in Project Settings → API (keep this secret!)

5. Add these to your backend `.env` file:
   ```
   SUPABASE_URL=your-project-url
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

6. Add these to your frontend `.env` file:
   ```
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

## Database Schema Overview

- **users**: User accounts with role (artist/company)
- **artist_profiles**: Extended profile information for artists
- **availability**: Artist availability calendar
- **events**: Events created by companies
- **event_slots**: Slots within events, assigned to artists
- **inquiries**: Messages between users
- **notifications**: System notifications and reminders

## Row Level Security (RLS)

All tables have RLS enabled with policies that ensure:
- Users can only access their own data
- Artists can view all artist profiles (for discovery)
- Companies can manage their own events
- Artists can view events they're assigned to
- Proper access control for inquiries and notifications

