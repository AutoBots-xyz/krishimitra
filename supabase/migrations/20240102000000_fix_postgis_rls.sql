-- Fix: Enable RLS on PostGIS system table to satisfy Supabase security advisor.
-- spatial_ref_sys is a read-only reference table created by the postgis extension.
-- We enable RLS and add a SELECT-only policy so it remains readable (needed by
-- PostGIS functions internally) but write access is blocked for all roles.

ALTER TABLE public.spatial_ref_sys ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read spatial reference data (it is public reference data,
-- equivalent to a lookup table — no sensitive information).
CREATE POLICY "Allow public read on spatial_ref_sys"
    ON public.spatial_ref_sys
    FOR SELECT
    USING (true);
