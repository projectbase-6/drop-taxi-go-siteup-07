
-- Create tariffs table for admin to manage pricing
CREATE TABLE public.tariffs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  base_fare DECIMAL(10,2) NOT NULL DEFAULT 50.00,
  per_km_rate DECIMAL(10,2) NOT NULL DEFAULT 12.00,
  per_minute_rate DECIMAL(10,2) NOT NULL DEFAULT 2.00,
  currency VARCHAR(3) NOT NULL DEFAULT 'INR',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table to store user bookings
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pickup_location TEXT NOT NULL,
  destination TEXT NOT NULL,
  pickup_date DATE NOT NULL,
  pickup_time TIME NOT NULL,
  passenger_name TEXT NOT NULL,
  passenger_phone TEXT NOT NULL,
  passenger_email TEXT,
  estimated_fare DECIMAL(10,2),
  actual_fare DECIMAL(10,2),
  distance_km DECIMAL(8,2),
  duration_minutes INTEGER,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in-progress', 'completed', 'cancelled')),
  driver_name TEXT,
  driver_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default tariff
INSERT INTO public.tariffs (base_fare, per_km_rate, per_minute_rate, currency) 
VALUES (50.00, 12.00, 2.00, 'INR');

-- Enable Row Level Security
ALTER TABLE public.tariffs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for tariffs (public read, admin write)
CREATE POLICY "Anyone can view tariffs" 
  ON public.tariffs 
  FOR SELECT 
  USING (true);

CREATE POLICY "Only authenticated users can update tariffs" 
  ON public.tariffs 
  FOR UPDATE 
  USING (true);

-- Create policies for bookings (public create and read)
CREATE POLICY "Anyone can create bookings" 
  ON public.bookings 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can view bookings" 
  ON public.bookings 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can update bookings" 
  ON public.bookings 
  FOR UPDATE 
  USING (true);

-- Enable realtime for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.tariffs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
