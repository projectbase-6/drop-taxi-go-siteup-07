import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Car, Users, Luggage, Star, Loader2 } from 'lucide-react';
import { useVehicleTypes } from '@/hooks/useVehicleTypes';
import { useFareCalculation } from '@/hooks/useFareCalculation';
interface VehicleSelectionProps {
  distance: number;
  duration?: number;
  tripType?: 'oneway' | 'roundtrip';
  onVehicleSelect: (vehicle: any, fare: number) => void;
  selectedVehicleId?: string;
  isCalculatingDistance?: boolean;
  departureDate?: string;
  returnDate?: string;
}
const VehicleSelection: React.FC<VehicleSelectionProps> = ({
  distance,
  duration = 0,
  tripType = 'oneway',
  onVehicleSelect,
  selectedVehicleId,
  isCalculatingDistance = false,
  departureDate,
  returnDate
}) => {
  const {
    data: vehicleTypes = [],
    isLoading
  } = useVehicleTypes();
  const {
    calculateFare,
    calculateDaysBetween
  } = useFareCalculation();
  const calculateVehicleFare = (vehicle: any) => {
    // Return 0 if distance is not available or being calculated
    if (!distance || distance === 0 || isCalculatingDistance) {
      return 0;
    }

    // Calculate number of days for multi-day trips
    let numberOfDays = 1;
    if (departureDate && returnDate && (tripType === 'roundtrip' || tripType === 'hourly')) {
      numberOfDays = calculateDaysBetween(departureDate, returnDate);
    }

    // Use the new tiered pricing calculation
    return calculateFare(distance, 0, tripType, vehicle.name, numberOfDays, departureDate, returnDate);
  };
  const getVehicleIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'sedan':
        return <Car className="h-8 w-8 text-amber-600" />;
      case 'etios':
        return <Car className="h-8 w-8 text-gray-600" />;
      case 'suv':
        return <Car className="h-8 w-8 text-blue-600" />;
      case 'innova':
        return <Car className="h-8 w-8 text-green-600" />;
      case 'innova crysta':
        return <Car className="h-8 w-8 text-purple-600" />;
      default:
        return <Car className="h-8 w-8 text-primary" />;
    }
  };

  // Vehicle-specific data based on the new car types
  const getMockVehicleData = (vehicleName: string) => {
    const name = vehicleName.toLowerCase();
    if (name === 'sedan') {
      return {
        max_passengers: 4,
        luggage_capacity: 3,
        is_popular: true
      };
    }
    if (name === 'etios') {
      return {
        max_passengers: 4,
        luggage_capacity: 2,
        is_popular: false
      };
    }
    if (name === 'suv') {
      return {
        max_passengers: 7,
        luggage_capacity: 4,
        is_popular: true
      };
    }
    if (name === 'innova') {
      return {
        max_passengers: 7,
        luggage_capacity: 5,
        is_popular: true
      };
    }
    if (name === 'innova crysta') {
      return {
        max_passengers: 8,
        luggage_capacity: 6,
        is_popular: true
      };
    }
    return {
      max_passengers: 4,
      luggage_capacity: 2,
      is_popular: false
    };
  };
  if (isLoading) {
    return <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Available Vehicles</h3>
        <div className="grid gap-4">
          {[1, 2, 3].map(i => <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>)}
        </div>
      </div>;
  }
  if (vehicleTypes.length === 0) {
    return <div className="text-center py-8">
        <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No vehicle types available</p>
      </div>;
  }
  const filteredVehicles = selectedVehicleId ? vehicleTypes.filter(vehicle => vehicle.id === selectedVehicleId) : vehicleTypes.sort((a, b) => {
    const order = ['SEDAN', 'ETIOS', 'SUV', 'INNOVA', 'INNOVA CRYSTA'];
    const indexA = order.indexOf(a.name.toUpperCase());
    const indexB = order.indexOf(b.name.toUpperCase());
    return indexA - indexB;
  });
  const handleReselectCar = () => {
    onVehicleSelect(null, 0);
  };
  return <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Choose Your Vehicle</h3>
        {selectedVehicleId && <button onClick={handleReselectCar} className="text-primary hover:text-primary/80 text-sm font-medium underline">
            Reselect Car
          </button>}
      </div>
      <div className="grid gap-4">
        {filteredVehicles.map(vehicle => {
        const fare = calculateVehicleFare(vehicle);
        const isSelected = selectedVehicleId === vehicle.id;
        const mockData = getMockVehicleData(vehicle.name);
        return <Card key={vehicle.id} className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? 'ring-2 ring-primary border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'}`} onClick={() => onVehicleSelect(vehicle, fare)}>
              <CardContent className="p-2 sm:p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start space-x-2 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      {getVehicleIcon(vehicle.name)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-1 mb-1">
                        <h4 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                          {vehicle.name}
                        </h4>
                        {mockData.is_popular && <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs flex-shrink-0">
                            Popular
                          </Badge>}
                      </div>
                      
                      <p className="text-gray-600 text-xs mb-1 line-clamp-1">
                        {vehicle.description || 'Comfortable and reliable vehicle'}
                      </p>
                      
                      <div className="flex items-center gap-1 sm:gap-2 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>{mockData.max_passengers}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Luggage className="h-3 w-3" />
                          <span>{mockData.luggage_capacity}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span>4.8</span>
                        </div>
                      </div>
                      
                      <div className="mt-1 text-xs text-gray-500 truncate">
                        {vehicle.category?.name} • {vehicle.price_multiplier}x
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right flex-shrink-0 min-w-[70px]">
                    {isCalculatingDistance ? <div className="flex flex-col items-center">
                        <Loader2 className="h-4 w-4 animate-spin text-primary mb-1" />
                        <div className="text-xs text-gray-500">
                          Calculating...
                        </div>
                      </div> : fare > 0 ? <>
                        <div className="text-base sm:text-lg font-bold text-primary">
                          ₹{fare}
                        </div>
                        <div className="text-xs text-gray-500">
                          Total Fare
                        </div>
                      </> : <div className="text-center">
                        <div className="text-sm text-gray-400">
                          --
                        </div>
                        <div className="text-xs text-gray-400">
                          Enter locations
                        </div>
                      </div>}
                    {isSelected && fare > 0 && <div className="mt-1">
                        <Badge className="bg-primary text-white text-xs">
                          Selected
                        </Badge>
                      </div>}
                  </div>
                </div>
              </CardContent>
            </Card>;
      })}
      </div>
    </div>;
};
export default VehicleSelection;