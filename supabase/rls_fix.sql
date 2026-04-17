-- Enable RLS for all tables
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Allow public read of approved submissions" ON public.submissions;
DROP POLICY IF EXISTS "Allow anonymous upload" ON public.submissions;
DROP POLICY IF EXISTS "Allow public read of prompts" ON public.prompts;
DROP POLICY IF EXISTS "Allow public read of posts" ON public.posts;

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

-- STORAGE Policies
-- Note: These apply to the storage.objects table which manages files.
-- We want to allow public uploads to the 'Uploaded Art' bucket but prevent deletes/updates.

-- Allow public to upload to 'Uploaded Art' bucket
CREATE POLICY "Allow public uploads"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'Uploaded Art');

-- Allow public to read from 'Uploaded Art' bucket
CREATE POLICY "Allow public read access"
ON storage.objects
FOR SELECT
USING (bucket_id = 'Uploaded Art');

-- NOTE: All admin operations (approve, reject, fetch pending) 
-- use the supabaseAdmin client (Service Role Key) which bypasses these RLS policies.
