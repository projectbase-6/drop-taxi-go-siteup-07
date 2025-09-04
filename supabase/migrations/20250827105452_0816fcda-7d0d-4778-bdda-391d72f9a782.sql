-- Drop the existing insert policy that only allows anonymous users
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.queries;

-- Create a new policy that allows both anonymous and authenticated users to insert
CREATE POLICY "Allow everyone to insert queries" 
ON public.queries 
FOR INSERT 
WITH CHECK (true);

-- Ensure other policies remain intact
-- These should already exist but let's make sure
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'queries' 
        AND policyname = 'Authenticated users can view all queries'
    ) THEN
        CREATE POLICY "Authenticated users can view all queries" 
        ON public.queries 
        FOR SELECT 
        TO authenticated
        USING (true);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'queries' 
        AND policyname = 'Authenticated users can update queries'
    ) THEN
        CREATE POLICY "Authenticated users can update queries" 
        ON public.queries 
        FOR UPDATE 
        TO authenticated
        USING (true)
        WITH CHECK (true);
    END IF;
END $$;