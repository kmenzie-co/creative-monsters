-- Create the submissions table
CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  monster_name TEXT NOT NULL,
  creator_nickname TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Set up Storage for monster images
-- NOTE: You must manually create a bucket named 'Uploaded Art' in the Supabase Dashboard
-- with Public Access enabled for the public gallery to work easily.

-- RLS policies (Optional but recommended for basic MVP safety)
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read approved submissions
CREATE POLICY "Allow public read of approved submissions"
ON public.submissions
FOR SELECT
USING (status = 'approved');

-- Allow anyone to insert new submissions (for the upload flow)
CREATE POLICY "Allow anonymous upload"
ON public.submissions
FOR INSERT
WITH CHECK (true);

-- Allow admin (service role or manual dashboard) to manage all
-- For a true MVP, we will use the service role key from server actions for admin tasks.
