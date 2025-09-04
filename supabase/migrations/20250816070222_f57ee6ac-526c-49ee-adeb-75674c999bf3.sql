-- Enable RLS on bookings table if not already enabled
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert bookings (since this is a public booking system)
CREATE POLICY "Allow public booking creation" ON bookings
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow users to view all bookings (for admin purposes)
CREATE POLICY "Allow viewing all bookings" ON bookings
FOR SELECT
USING (true);

-- Create policy to allow updating bookings (for status updates)
CREATE POLICY "Allow booking updates" ON bookings
FOR UPDATE
USING (true);

-- Create policy to allow deleting bookings (for admin purposes)  
CREATE POLICY "Allow booking deletion" ON bookings
FOR DELETE
USING (true);