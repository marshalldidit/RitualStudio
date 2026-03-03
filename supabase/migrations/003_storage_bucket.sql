-- ============================================================
-- 003_storage_bucket.sql
-- Storage bucket for user drawing uploads
-- ============================================================

-- Create the drawings bucket (private — users access via signed URLs)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'drawings',
  'drawings',
  false,
  10485760,  -- 10 MB
  array['image/jpeg', 'image/png', 'image/webp']
);

-- Storage RLS: users can upload to their own folder (user_id/*)
create policy "Users can upload their own drawings"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'drawings'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Storage RLS: users can read their own drawings
create policy "Users can read their own drawings"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'drawings'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Storage RLS: users can delete their own drawings
create policy "Users can delete their own drawings"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'drawings'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
