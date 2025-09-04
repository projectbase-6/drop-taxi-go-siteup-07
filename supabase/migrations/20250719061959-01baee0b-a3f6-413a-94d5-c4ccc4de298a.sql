
-- First, let's clean up any existing policies on routes table
DROP POLICY IF EXISTS "Routes are publicly readable" ON public.routes;
DROP POLICY IF EXISTS "Allow admin operations on routes" ON public.routes;
DROP POLICY IF EXISTS "Authenticated users can manage routes" ON public.routes;

-- Create a single comprehensive policy that allows all operations
CREATE POLICY "Allow all operations on routes" 
  ON public.routes 
  FOR ALL 
  TO public
  USING (true)
  WITH CHECK (true);

-- Ensure RLS is enabled but with permissive policies
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
