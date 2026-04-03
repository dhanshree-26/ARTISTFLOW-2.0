-- ArtistFlow Database Schema
-- Supabase PostgreSQL Migration

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('artist', 'company')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Artist profiles table
CREATE TABLE IF NOT EXISTS public.artist_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    genre TEXT,
    city TEXT,
    contact_details JSONB,
    social_links JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Availability table
CREATE TABLE IF NOT EXISTS public.availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artist_id UUID NOT NULL REFERENCES public.artist_profiles(user_id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('available', 'unavailable')),
    time_slot TEXT CHECK (time_slot IN ('morning', 'evening', 'full')),
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(artist_id, date)
);

-- Events table
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    event_name TEXT NOT NULL,
    venue TEXT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_type TEXT CHECK (recurrence_type IN ('daily', 'weekly', 'monthly')),
    recurrence_end_date DATE,
    total_slots INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event slots table
CREATE TABLE IF NOT EXISTS public.event_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    artist_id UUID REFERENCES public.artist_profiles(user_id) ON DELETE SET NULL,
    slot_number INTEGER NOT NULL,
    slot_type TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'declined')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(event_id, slot_number)
);

-- Inquiries table
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'responded', 'archived')),
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('reminder', 'cancellation', 'assignment', 'inquiry')),
    message TEXT NOT NULL,
    scheduled_at TIMESTAMPTZ,
    sent BOOLEAN DEFAULT FALSE,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_availability_artist_date ON public.availability(artist_id, date);
CREATE INDEX IF NOT EXISTS idx_events_company ON public.events(company_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(date);
CREATE INDEX IF NOT EXISTS idx_event_slots_event ON public.event_slots(event_id);
CREATE INDEX IF NOT EXISTS idx_event_slots_artist ON public.event_slots(artist_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_recipient ON public.inquiries(recipient_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_sender ON public.inquiries(sender_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_scheduled ON public.notifications(scheduled_at) WHERE sent = FALSE;

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artist_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = id);

-- Artist profiles policies
CREATE POLICY "Artists can view all profiles"
    ON public.artist_profiles FOR SELECT
    USING (true);

CREATE POLICY "Artists can manage their own profile"
    ON public.artist_profiles FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = artist_profiles.user_id
            AND users.id = auth.uid()
        )
    );

-- Availability policies
CREATE POLICY "Artists can manage their own availability"
    ON public.availability FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.artist_profiles
            WHERE artist_profiles.user_id = availability.artist_id
            AND artist_profiles.user_id = auth.uid()
        )
    );

CREATE POLICY "Companies can view artist availability"
    ON public.availability FOR SELECT
    USING (true);

-- Events policies
CREATE POLICY "Companies can manage their own events"
    ON public.events FOR ALL
    USING (
        company_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.event_slots
            WHERE event_slots.event_id = events.id
            AND EXISTS (
                SELECT 1 FROM public.artist_profiles
                WHERE artist_profiles.user_id = event_slots.artist_id
                AND artist_profiles.user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Artists can view events they're assigned to"
    ON public.events FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.event_slots
            WHERE event_slots.event_id = events.id
            AND EXISTS (
                SELECT 1 FROM public.artist_profiles
                WHERE artist_profiles.user_id = event_slots.artist_id
                AND artist_profiles.user_id = auth.uid()
            )
        )
    );

-- Event slots policies
CREATE POLICY "Companies can manage slots for their events"
    ON public.event_slots FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.events
            WHERE events.id = event_slots.event_id
            AND events.company_id = auth.uid()
        )
    );

CREATE POLICY "Artists can view their assigned slots"
    ON public.event_slots FOR SELECT
    USING (
        artist_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.events
            WHERE events.id = event_slots.event_id
            AND events.company_id = auth.uid()
        )
    );

-- Inquiries policies
CREATE POLICY "Users can view their own inquiries"
    ON public.inquiries FOR SELECT
    USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Users can create inquiries"
    ON public.inquiries FOR INSERT
    WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Recipients can update inquiry status"
    ON public.inquiries FOR UPDATE
    USING (recipient_id = auth.uid());

-- Notifications policies
CREATE POLICY "Users can view their own notifications"
    ON public.notifications FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can update their notifications"
    ON public.notifications FOR UPDATE
    USING (user_id = auth.uid());

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_artist_profiles_updated_at BEFORE UPDATE ON public.artist_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_availability_updated_at BEFORE UPDATE ON public.availability
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_slots_updated_at BEFORE UPDATE ON public.event_slots
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON public.inquiries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
