/*
  # Update driver batta from 400 to 500

  1. Changes
    - Update minimum fare calculations to use 500 instead of 400 for driver batta
    - Update min_20km_fare to reflect new driver batta
    - Update min_135km_fare to use 130km calculation with new driver batta

  2. Security
    - No RLS changes needed as this is just updating existing data
*/

-- Update minimum fares to reflect new driver batta of 500
UPDATE public.vehicle_types SET 
  min_20km_fare = CASE 
    WHEN LOWER(name) LIKE '%sedan%' THEN 680 + 100  -- Add 100 for batta increase
    WHEN LOWER(name) LIKE '%etios%' THEN 700 + 100
    WHEN LOWER(name) LIKE '%suv%' THEN 780 + 100
    WHEN LOWER(name) LIKE '%innova%' AND LOWER(name) NOT LIKE '%crysta%' THEN 800 + 100
    WHEN LOWER(name) LIKE '%crysta%' THEN 860 + 100
    ELSE min_20km_fare + 100
  END,
  min_135km_fare = CASE 
    WHEN drop_trip_rate_per_km IS NOT NULL THEN 130 * drop_trip_rate_per_km + 500
    ELSE 130 * 14 + 500
  END
WHERE min_20km_fare IS NOT NULL;

-- Add comment to clarify the new driver batta amount
COMMENT ON COLUMN public.vehicle_types.min_135km_fare IS 'Minimum fare for distances 21-130km (130km × rate + 500)';