-- Drop and recreate the INSERT policy to ensure it works correctly
DROP POLICY IF EXISTS "Allow public booking creation" ON bookings;

-- Create a new INSERT policy that allows anyone to create bookings
CREATE POLICY "Enable public booking creation" ON bookings
FOR INSERT 
WITH CHECK (true);

-- Also create a simple SELECT policy for viewing bookings  
DROP POLICY IF EXISTS "Users can view their own bookings" ON bookings;
CREATE POLICY "Enable booking viewing" ON bookings
FOR SELECT
USING (true);