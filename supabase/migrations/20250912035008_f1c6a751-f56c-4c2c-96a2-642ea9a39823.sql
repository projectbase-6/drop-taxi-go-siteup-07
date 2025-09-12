-- Add new columns for tiered pricing to vehicle_types table
ALTER TABLE public.vehicle_types 
ADD COLUMN min_20km_fare numeric,
ADD COLUMN min_135km_fare numeric;

-- Update existing vehicle types with the specified minimum fares
UPDATE public.vehicle_types SET 
  min_20km_fare = 680,
  min_135km_fare = CASE 
    WHEN drop_trip_rate_per_km IS NOT NULL THEN 135 * drop_trip_rate_per_km + 400
    ELSE 135 * 14 + 400
  END
WHERE LOWER(name) LIKE '%sedan%';

UPDATE public.vehicle_types SET 
  min_20km_fare = 700,
  min_135km_fare = CASE 
    WHEN drop_trip_rate_per_km IS NOT NULL THEN 135 * drop_trip_rate_per_km + 400
    ELSE 135 * 14 + 400
  END
WHERE LOWER(name) LIKE '%etios%';

UPDATE public.vehicle_types SET 
  min_20km_fare = 780,
  min_135km_fare = CASE 
    WHEN drop_trip_rate_per_km IS NOT NULL THEN 135 * drop_trip_rate_per_km + 400
    ELSE 135 * 14 + 400
  END
WHERE LOWER(name) LIKE '%suv%';

UPDATE public.vehicle_types SET 
  min_20km_fare = 800,
  min_135km_fare = CASE 
    WHEN drop_trip_rate_per_km IS NOT NULL THEN 135 * drop_trip_rate_per_km + 400
    ELSE 135 * 14 + 400
  END
WHERE LOWER(name) LIKE '%innova%' AND LOWER(name) NOT LIKE '%crysta%';

UPDATE public.vehicle_types SET 
  min_20km_fare = 860,
  min_135km_fare = CASE 
    WHEN drop_trip_rate_per_km IS NOT NULL THEN 135 * drop_trip_rate_per_km + 400
    ELSE 135 * 14 + 400
  END
WHERE LOWER(name) LIKE '%crysta%';