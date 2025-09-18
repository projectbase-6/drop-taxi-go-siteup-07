-- Fix RLS policy for queries table to allow public insertions
DROP POLICY IF EXISTS "Allow everyone to insert queries" ON public.queries;
DROP POLICY IF EXISTS "Authenticated users can view all queries" ON public.queries;
DROP POLICY IF EXISTS "Authenticated users can update queries" ON public.queries;

-- Create new policies with proper permissions
CREATE POLICY "Enable public query creation" ON public.queries
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all query viewing" ON public.queries
FOR SELECT USING (true);

CREATE POLICY "Allow all query updates" ON public.queries  
FOR UPDATE USING (true) WITH CHECK (true);