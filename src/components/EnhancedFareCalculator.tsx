
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, IndianRupee } from 'lucide-react';
import { useFareCalculation } from '@/hooks/useFareCalculation';

interface EnhancedFareCalculatorProps {
  distance: number;
  duration?: number;
  tripType?: 'oneway' | 'roundtrip';
  numberOfDays?: number;
  onFareCalculated?: (fare: number) => void;
}

const EnhancedFareCalculator: React.FC<EnhancedFareCalculatorProps> = ({
  distance,
  duration = 0,
  tripType = 'oneway',
  onFareCalculated
}) => {
  const { calculateFare, getTariffRates, isLoading } = useFareCalculation();
  
  const fare = calculateFare(distance, duration, tripType);
  const rates = getTariffRates();

  React.useEffect(() => {
    if (onFareCalculated && fare > 0) {
      onFareCalculated(fare);
    }
  }, [fare, onFareCalculated]);

  if (isLoading || !rates) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-6 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-golden-accent/40 bg-warm-gradient">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-golden-dark">
          <Calculator className="h-5 w-5" />
          <span>Fare Breakdown</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-golden-dark/70">Base Fare</span>
            <span className="font-medium text-golden-dark">₹{rates.baseFare}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-golden-dark/70">
              Distance ({distance} km)
            </span>
            <span className="font-medium text-golden-dark">
              ₹{(distance * (tripType === 'roundtrip' ? 2 : 1) * (tripType === 'roundtrip' ? rates.roundTripRate : rates.dropTripRate)).toFixed(2)}
            </span>
          </div>
          {duration > 0 && (
            <div className="flex justify-between">
              <span className="text-golden-dark/70">Time ({duration} min)</span>
              <span className="font-medium text-golden-dark">₹{(duration * rates.perMinuteRate).toFixed(2)}</span>
            </div>
          )}
        </div>
        
        <div className="border-t border-golden-accent/30 pt-3">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-golden-dark">Total Fare</span>
            <div className="flex items-center space-x-1">
              <IndianRupee className="h-5 w-5 text-golden-primary" />
              <span className="text-xl font-bold text-golden-primary">{fare}</span>
            </div>
          </div>
          <p className="text-xs text-golden-dark/60 mt-1">
            Rate: ₹{tripType === 'roundtrip' ? rates.roundTripRate : rates.dropTripRate}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedFareCalculator;
