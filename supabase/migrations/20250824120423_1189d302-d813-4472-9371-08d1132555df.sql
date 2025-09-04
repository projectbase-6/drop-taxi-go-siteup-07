-- Drop existing policies for queries table to start fresh
DROP POLICY IF EXISTS "Admin can update queries" ON public.queries;
DROP POLICY IF EXISTS "Anyone can create queries" ON public.queries;
DROP POLICY IF EXISTS "Users can view their own queries" ON public.queries;

-- Enable RLS on queries table
ALTER TABLE public.queries ENABLE ROW LEVEL SECURITY;

-- Create new policy for INSERT - Allow anyone to create queries (public access)
CREATE POLICY "Enable insert for everyone" 
ON public.queries 
FOR INSERT 
TO anon, authenticated, public
WITH CHECK (true);

-- Create policy for SELECT - Allow users to view all queries if authenticated (admin), or anyone can view queries
CREATE POLICY "Enable read for admins" 
ON public.queries 
FOR SELECT 
TO authenticated
USING (true);

-- Create policy for UPDATE - Only authenticated users (admins) can update
CREATE POLICY "Enable update for admins" 
ON public.queries 
FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);