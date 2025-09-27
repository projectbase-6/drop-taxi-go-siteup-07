
import { useTariffs } from '@/hooks/useTariffs';
import { useVehicleTypes } from '@/hooks/useVehicleTypes';

// Helper function to calculate number of days between two dates
const calculateDaysBetween = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays); // Minimum 1 day
};

export const useFareCalculation = () => {
  const { data: tariff } = useTariffs();
  const { data: vehicleTypes } = useVehicleTypes();

  const calculateFare = (
    distance: number, 
    duration: number = 0, 
    tripType: 'oneway' | 'roundtrip' = 'oneway',
    vehicleTypeName?: string,
    numberOfDays: number = 1,
    departureDate?: string,
    returnDate?: string
  ) => {
    // Calculate actual number of days if dates are provided
    let actualDays = numberOfDays;
    if (departureDate && returnDate && (tripType === 'roundtrip' || tripType === 'hourly')) {
      actualDays = calculateDaysBetween(departureDate, returnDate);
    }
    
    // Driver batta calculation based on actual days
    const driverBatta = 400 * actualDays;
    
    // Implement tiered pricing model
    const vehicleType = vehicleTypeName ? 
      vehicleTypes?.find(v => v.name.toLowerCase() === vehicleTypeName.toLowerCase()) : null;
    
    if (vehicleType) {
      // For round trips, minimum 250km coverage
      if (tripType === 'roundtrip') {
        const minDistance = 250;
        const effectiveDistance = Math.max(distance * 2, minDistance);
        const perKmRate = vehicleType.round_trip_rate_per_km || 12;
        return Math.round(effectiveDistance * perKmRate + driverBatta);
      }
      
      // For one-way trips, implement tiered pricing:
      // ≤20km: Use minimum fare
      // 21-135km: Charge for 135km
      // >135km: Charge actual distance
      
      if (distance <= 20) {
        // Use minimum fare for distances ≤20km
        return Math.round((vehicleType.min_20km_fare || 680) + (actualDays > 1 ? (actualDays - 1) * 400 : 0));
      } else if (distance <= 135) {
        // Charge for 135km for distances 21-135km
        const perKmRate = vehicleType.drop_trip_rate_per_km || 14;
        return Math.round(135 * perKmRate + driverBatta);
      } else {
        // Charge actual distance for distances >135km
        const perKmRate = vehicleType.drop_trip_rate_per_km || 14;
        return Math.round(distance * perKmRate + driverBatta);
      }
    }
    
    // Fallback to general tariff with tiered pricing
    const perKmRate = tripType === 'roundtrip' 
      ? (Number(tariff?.round_trip_rate_per_km) || 12)
      : (Number(tariff?.drop_trip_rate_per_km) || 14);
    
    if (tripType === 'roundtrip') {
      const minDistance = 250;
      const effectiveDistance = Math.max(distance * 2, minDistance);
      return Math.round(effectiveDistance * perKmRate + driverBatta);
    }
    
    // One-way fallback with tiered pricing
    if (distance <= 20) {
      return Math.round(20 * perKmRate + driverBatta);
    } else if (distance <= 135) {
      return Math.round(135 * perKmRate + driverBatta);
    } else {
      return Math.round(distance * perKmRate + driverBatta);
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

  const calculateDuration = (
    departureDate?: string,
    returnDate?: string,
    tripDurationMinutes?: number
  ): string => {
    // If we have departure and return dates, calculate days
    if (departureDate && returnDate) {
      const days = calculateDaysBetween(departureDate, returnDate);
      if (days > 1) {
        return `${days} days`;
      }
    }
    
    // Otherwise use trip duration in minutes
    if (tripDurationMinutes && tripDurationMinutes > 0) {
      const hours = Math.floor(tripDurationMinutes / 60);
      const minutes = tripDurationMinutes % 60;
      
      if (hours >= 24) {
        const days = Math.floor(hours / 24);
        const remainingHours = hours % 24;
        if (remainingHours === 0 && minutes === 0) {
          return `${days} days`;
        } else if (remainingHours === 0) {
          return `${days} days ${minutes}m`;
        } else if (minutes === 0) {
          return `${days} days ${remainingHours}h`;
        } else {
          return `${days} days ${remainingHours}h ${minutes}m`;
        }
      } else if (hours === 0) {
        return `${minutes}m`;
      } else if (minutes === 0) {
        return `${hours}h`;
      } else {
        return `${hours}h ${minutes}m`;
      }
    }
    
    return 'Duration unavailable';
  };
  return {
    calculateFare,
    getTariffRates,
    calculateDuration,
    calculateDaysBetween,
    isLoading: !tariff || !vehicleTypes
  };
};
