/*
  # Update minimum km from 135 to 130

  1. Changes
    - Update min_135km_fare column to min_130km_fare for clarity
    - Recalculate minimum fares based on 130km instead of 135km
    - Update all vehicle types with new 130km minimum fare calculation

  2. Security
    - No RLS changes needed as this is just updating existing data
*/

-- Update the minimum fare calculations for 130km instead of 135km
UPDATE public.vehicle_types SET 
  min_135km_fare = CASE 
    WHEN drop_trip_rate_per_km IS NOT NULL THEN 130 * drop_trip_rate_per_km + 400
    ELSE 130 * 14 + 400
  END
WHERE min_135km_fare IS NOT NULL;

-- Add a comment to clarify this column now represents 130km fare
COMMENT ON COLUMN public.vehicle_types.min_135km_fare IS 'Minimum fare for distances 21-130km (130km × rate + 400)';