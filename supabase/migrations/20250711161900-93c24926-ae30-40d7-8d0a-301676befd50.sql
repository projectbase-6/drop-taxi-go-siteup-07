
-- Create tariffs table
CREATE TABLE public.tariffs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  base_fare DECIMAL(10,2) NOT NULL DEFAULT 50.00,
  per_km_rate DECIMAL(10,2) NOT NULL DEFAULT 12.00,
  per_minute_rate DECIMAL(10,2) NOT NULL DEFAULT 2.00,
  currency TEXT NOT NULL DEFAULT 'INR',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table
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
  status TEXT NOT NULL DEFAULT 'pending',
  driver_name TEXT,
  driver_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default tariff rates
INSERT INTO public.tariffs (base_fare, per_km_rate, per_minute_rate, currency) 
VALUES (50.00, 12.00, 2.00, 'INR');

-- Add check constraints for valid status values
ALTER TABLE public.bookings 
ADD CONSTRAINT bookings_status_check 
CHECK (status IN ('pending', 'confirmed', 'in-progress', 'completed', 'cancelled'));
