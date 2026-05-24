-- Allow public to upload files to the 'Classes' bucket from the Admin Portal
CREATE POLICY "Allow public uploads to Classes"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'Classes');

-- Allow public to read files from the 'Classes' bucket (for playing the videos)
CREATE POLICY "Allow public read access to Classes"
ON storage.objects
FOR SELECT
USING (bucket_id = 'Classes');
