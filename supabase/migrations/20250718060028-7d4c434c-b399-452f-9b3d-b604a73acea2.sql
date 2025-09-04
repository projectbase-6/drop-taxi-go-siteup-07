
-- Create a table for popular routes
CREATE TABLE public.routes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  from_destination TEXT NOT NULL,
  to_destination TEXT NOT NULL,
  price NUMERIC NOT NULL,
  trip_type TEXT NOT NULL CHECK (trip_type IN ('one-way', 'round-trip')),
  distance_km NUMERIC,
  rating NUMERIC DEFAULT 4.2,
  profile_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) - making routes publicly readable
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read routes (for the public user page)
CREATE POLICY "Routes are publicly readable" 
  ON public.routes 
  FOR SELECT 
  TO public 
  USING (true);

-- Only allow authenticated users to insert, update, delete routes (for admin)
CREATE POLICY "Authenticated users can manage routes" 
  ON public.routes 
  FOR ALL 
  TO authenticated 
  USING (true)
  WITH CHECK (true);
