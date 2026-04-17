-- Create the submissions table
CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  monster_name TEXT NOT NULL,
  creator_nickname TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create the prompts table (cached from seed script)
CREATE TABLE IF NOT EXISTS public.prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create the posts table (Blog)
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  meta_description TEXT,
  post_type TEXT,
  category_tags TEXT[],
  body_markdown TEXT NOT NULL,
  hero_image_path TEXT,
  hero_image_alt TEXT,
  publish_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Set up Row Level Security (RLS)
-- This is CRITICAL for security. When enabled, public access via the anon key 
-- is restricted by the policies below.

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- SUBMISSIONS Table Policies
-- Allow anyone to read approved submissions (for the gallery)
CREATE POLICY "Allow public read of approved submissions"
ON public.submissions
FOR SELECT
USING (status = 'approved');

-- Allow anyone to insert new submissions (for the upload flow)
CREATE POLICY "Allow anonymous upload"
ON public.submissions
FOR INSERT
WITH CHECK (true);

-- PROMPTS Table Policies
-- Allow anyone to read all prompts
CREATE POLICY "Allow public read of prompts"
ON public.prompts
FOR SELECT
USING (true);

-- POSTS Table Policies
-- Allow anyone to read published posts
CREATE POLICY "Allow public read of posts"
ON public.posts
FOR SELECT
USING (status = 'scheduled' AND publish_date <= now());

-- NOTE: All admin operations (approve, reject, fetch pending) 
-- use the supabaseAdmin client (Service Role Key) which bypasses these RLS policies.

-- Create the avatar_videos table for RunwayML caching
CREATE TABLE IF NOT EXISTS public.avatar_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_name TEXT NOT NULL,
  runway_task_id TEXT,
  video_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for avatar_videos
ALTER TABLE public.avatar_videos ENABLE ROW LEVEL SECURITY;

-- Allow public read of all avatar videos
CREATE POLICY "Allow public read of avatar videos"
ON public.avatar_videos
FOR SELECT
USING (true);

-- Create the classes table
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  cover_art_url TEXT NOT NULL,
  intro_text TEXT NOT NULL,
  outro_text TEXT NOT NULL,
  core_video_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for classes
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

-- Allow public read of all classes
CREATE POLICY "Allow public read of classes"
ON public.classes
FOR SELECT
USING (true);

-- Insert Storage Bucket for Classes (assuming extensions enabled and permissions granted)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('Classes', 'Classes', true) 
ON CONFLICT (id) DO NOTHING;

-- Optionally, if needed, enable public access policy to the bucket securely:
-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'Classes' );
-- CREATE POLICY "Anon Insert" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'Classes' );
