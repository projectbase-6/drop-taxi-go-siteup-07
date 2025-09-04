-- Update vehicle rates with correct oneway and roundtrip amounts
UPDATE vehicle_types 
SET 
  drop_trip_rate_per_km = CASE 
    WHEN UPPER(name) = 'SEDAN' THEN 14
    WHEN UPPER(name) = 'ETIOS' THEN 15  
    WHEN UPPER(name) = 'SUV' THEN 19
    WHEN UPPER(name) = 'INNOVA' THEN 20
    ELSE drop_trip_rate_per_km
  END,
  round_trip_rate_per_km = CASE 
    WHEN UPPER(name) = 'SEDAN' THEN 13
    WHEN UPPER(name) = 'ETIOS' THEN 14
    WHEN UPPER(name) = 'SUV' THEN 18 
    WHEN UPPER(name) = 'INNOVA' THEN 19
    ELSE round_trip_rate_per_km
  END,
  updated_at = now()
WHERE UPPER(name) IN ('SEDAN', 'ETIOS', 'SUV', 'INNOVA');