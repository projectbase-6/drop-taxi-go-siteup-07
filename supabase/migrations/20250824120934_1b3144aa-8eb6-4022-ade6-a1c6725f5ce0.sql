-- Drop all existing policies for queries table
DROP POLICY IF EXISTS "Admin can update queries" ON public.queries;
DROP POLICY IF EXISTS "Anyone can create queries" ON public.queries;
DROP POLICY IF EXISTS "Users can view their own queries" ON public.queries;
DROP POLICY IF EXISTS "Enable insert for everyone" ON public.queries;
DROP POLICY IF EXISTS "Enable read for admins" ON public.queries;
DROP POLICY IF EXISTS "Enable update for admins" ON public.queries;

-- Enable RLS on queries table
ALTER TABLE public.queries ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert queries (contact form submissions)
CREATE POLICY "Allow anonymous inserts" 
ON public.queries 
FOR INSERT 
TO anon
WITH CHECK (true);

-- Allow authenticated users to view all queries (for admin dashboard)
CREATE POLICY "Authenticated users can view all queries" 
ON public.queries 
FOR SELECT 
TO authenticated
USING (true);

-- Allow authenticated users to update queries (for admin status updates)
CREATE POLICY "Authenticated users can update queries" 
ON public.queries 
FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);