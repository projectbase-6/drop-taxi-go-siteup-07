
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
    // Try to find vehicle-specific tariff first
    const vehicleType = vehicleTypeName ? 
      vehicleTypes?.find(v => v.name.toLowerCase() === vehicleTypeName.toLowerCase()) : null;
    
    // If vehicle type is found, use its specific rate per km
    if (vehicleType) {
      const perKmRate = tripType === 'roundtrip' 
        ? vehicleType.round_trip_rate_per_km || 12
        : vehicleType.drop_trip_rate_per_km || 14;
      
      // For roundtrip, calculate total distance (distance * 2) * rate
      const totalDistance = tripType === 'roundtrip' ? distance * 2 : distance;
      const baseFare = totalDistance * perKmRate;
      
      // Add driver bata of Rs 400
      return Math.round(baseFare + 400);
    }
    
    // Fallback to general tariff
    const baseFare = Number(tariff?.base_fare) || 0;
    const perKmRate = tripType === 'roundtrip' 
      ? (Number(tariff?.round_trip_rate_per_km) || 12)
      : (Number(tariff?.drop_trip_rate_per_km) || 14);
    const perMinuteRate = Number(tariff?.per_minute_rate) || 0;
    
    // For roundtrip with general tariff, also multiply distance by 2
    const totalDistance = tripType === 'roundtrip' ? distance * 2 : distance;
    const distanceCost = totalDistance * perKmRate;
    const timeCost = duration * perMinuteRate;
    
    // Add driver bata of Rs 400
    return Math.round(baseFare + distanceCost + timeCost + 400);
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
