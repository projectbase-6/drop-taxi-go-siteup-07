
import { useTariffs } from '@/hooks/useTariffs';
import { useVehicleTypes } from '@/hooks/useVehicleTypes';

export const useFareCalculation = () => {
  const { data: tariff } = useTariffs();
  const { data: vehicleTypes } = useVehicleTypes();

  const calculateFare = (
    distance: number, 
    duration: number = 0, 
    tripType: 'oneway' | 'roundtrip' = 'oneway',
    vehicleTypeName?: string,
    numberOfDays: number = 1
  ) => {
    // Implement tiered pricing model
    const vehicleType = vehicleTypeName ? 
      vehicleTypes?.find(v => v.name.toLowerCase() === vehicleTypeName.toLowerCase()) : null;
    
    if (vehicleType) {
      // For round trips, minimum 250km coverage
      if (tripType === 'roundtrip') {
        const minDistance = 250;
        const effectiveDistance = Math.max(distance * 2, minDistance);
        const perKmRate = vehicleType.round_trip_rate_per_km || 12;
        return Math.round(effectiveDistance * perKmRate + 400);
      }
      
      // For one-way trips, implement tiered pricing:
      // ≤20km: Use minimum fare
      // 21-135km: Charge for 135km
      // >135km: Charge actual distance
      
      if (distance <= 20) {
        // Use minimum fare for distances ≤20km
        return Math.round(vehicleType.min_20km_fare || 680);
      } else if (distance <= 135) {
        // Charge for 135km for distances 21-135km
        const perKmRate = vehicleType.drop_trip_rate_per_km || 14;
        return Math.round(135 * perKmRate + 400);
      } else {
        // Charge actual distance for distances >135km
        const perKmRate = vehicleType.drop_trip_rate_per_km || 14;
        return Math.round(distance * perKmRate + 400);
      }
    }
    
    // Fallback to general tariff with tiered pricing
    const perKmRate = tripType === 'roundtrip' 
      ? (Number(tariff?.round_trip_rate_per_km) || 12)
      : (Number(tariff?.drop_trip_rate_per_km) || 14);
    
    if (tripType === 'roundtrip') {
      const minDistance = 250;
      const effectiveDistance = Math.max(distance * 2, minDistance);
      return Math.round(effectiveDistance * perKmRate + 400);
    }
    
    // One-way fallback with tiered pricing
    if (distance <= 20) {
      return Math.round(20 * perKmRate + 400);
    } else if (distance <= 135) {
      return Math.round(135 * perKmRate + 400);
    } else {
      return Math.round(distance * perKmRate + 400);
    }
  };

  const getTariffRates = (vehicleTypeName?: string) => {
    const vehicleType = vehicleTypeName ? 
      vehicleTypes?.find(v => v.name.toLowerCase() === vehicleTypeName.toLowerCase()) : null;
    
    return {
      baseFare: vehicleType?.base_fare || Number(tariff?.base_fare) || 50,
      dropTripRate: vehicleType?.drop_trip_rate_per_km || Number(tariff?.drop_trip_rate_per_km) || 14,
      roundTripRate: vehicleType?.round_trip_rate_per_km || Number(tariff?.round_trip_rate_per_km) || 12,
      perMinuteRate: vehicleType?.per_minute_rate || Number(tariff?.per_minute_rate) || 2,
      currency: tariff?.currency || 'INR'
    };
  };

  return {
    calculateFare,
    getTariffRates,
    isLoading: !tariff || !vehicleTypes
  };
};
