-- Create the bucket if it doesn't exist (ensure it's public)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('crop-scans', 'crop-scans', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to the bucket
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'crop-scans');

-- Allow anyone to upload to the bucket
CREATE POLICY "Public Uploads" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'crop-scans');
