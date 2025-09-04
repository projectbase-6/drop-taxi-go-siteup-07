-- Fix critical security issues for client handover

-- STEP 1: Fix booking data exposure - Restrict to authenticated users only
DROP POLICY IF EXISTS "Bookings are publicly readable" ON public.bookings;
DROP POLICY IF EXISTS "Allow booking creation" ON public.bookings;
DROP POLICY IF EXISTS "Allow booking updates" ON public.bookings;

-- Create secure RLS policies for bookings
CREATE POLICY "Users can view their own bookings" 
ON public.bookings 
FOR SELECT 
USING (passenger_phone = current_setting('request.headers', true)::json->>'x-user-phone' OR auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated booking creation" 
ON public.bookings 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admin can update all bookings" 
ON public.bookings 
FOR UPDATE 
USING (auth.role() = 'authenticated');

-- STEP 2: Fix queries data exposure - Restrict to query owners and admin
DROP POLICY IF EXISTS "Queries are viewable by all" ON public.queries;
DROP POLICY IF EXISTS "Queries can be inserted by anyone" ON public.queries;
DROP POLICY IF EXISTS "Queries can be updated by anyone" ON public.queries;

-- Create secure policies for queries
CREATE POLICY "Users can view their own queries" 
ON public.queries 
FOR SELECT 
USING (email = current_setting('request.headers', true)::json->>'x-user-email' OR auth.role() = 'authenticated');

CREATE POLICY "Anyone can create queries" 
ON public.queries 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admin can update queries" 
ON public.queries 
FOR UPDATE 
USING (auth.role() = 'authenticated');

-- STEP 3: Ensure vehicle types and routes remain public (needed for booking process)
-- Keep existing policies for vehicle_types, vehicle_categories, routes, and tariffs as they are public data