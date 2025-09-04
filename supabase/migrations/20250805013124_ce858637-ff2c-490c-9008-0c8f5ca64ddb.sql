-- Add tariff rate fields to vehicle_types table
ALTER TABLE public.vehicle_types 
ADD COLUMN base_fare NUMERIC DEFAULT 50.00,
ADD COLUMN per_minute_rate NUMERIC DEFAULT 2.00,
ADD COLUMN drop_trip_rate_per_km NUMERIC DEFAULT 14.00,
ADD COLUMN round_trip_rate_per_km NUMERIC DEFAULT 12.00;

-- Update existing vehicle types with default rates
UPDATE public.vehicle_types 
SET 
  base_fare = 50.00,
  per_minute_rate = 2.00,
  drop_trip_rate_per_km = 14.00,
  round_trip_rate_per_km = 12.00
WHERE base_fare IS NULL;