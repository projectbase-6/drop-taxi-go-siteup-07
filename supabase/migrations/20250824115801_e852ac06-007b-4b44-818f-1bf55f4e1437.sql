-- Fix the INSERT policy for queries table to allow anyone to create queries without authentication
DROP POLICY IF EXISTS "Anyone can create queries" ON public.queries;

CREATE POLICY "Anyone can create queries" 
ON public.queries 
FOR INSERT 
TO public
WITH CHECK (true);