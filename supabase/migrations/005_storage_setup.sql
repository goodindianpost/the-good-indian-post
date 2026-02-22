-- =============================================
-- The Good Indian Post - Storage Setup
-- Migration 005: Storage Bucket & Policies
-- =============================================

-- NOTE: Run this in Supabase Dashboard → Storage → Policies
-- Or use the Supabase CLI

-- Create the media bucket (do this via Dashboard)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);

-- Storage Policies (run in SQL Editor)

-- Allow public read access to media bucket
CREATE POLICY "Public can view media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

-- Allow authenticated users to upload to media bucket
CREATE POLICY "Authenticated users can upload media"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'media' AND
    auth.role() = 'authenticated'
  );

-- Allow users to update their own uploads
CREATE POLICY "Users can update own uploads"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'media' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete own uploads"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'media' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow admins to manage all media
CREATE POLICY "Admins can manage all media"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'media' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
