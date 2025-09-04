-- Fix booking creation issue - Allow public booking creation
-- The current INSERT policy is too restrictive

DROP POLICY IF EXISTS "Allow authenticated booking creation" ON public.bookings;

-- Create a policy that allows anyone to create bookings (public taxi booking system)
CREATE POLICY "Allow public booking creation" 
ON public.bookings 
FOR INSERT 
WITH CHECK (true);

-- Ensure we have the right policies for viewing bookings (keep existing)
-- Users can view their own bookings by phone number, admins can view all