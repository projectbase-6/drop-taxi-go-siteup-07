
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DollarSign, Save, Loader2 } from 'lucide-react';
import { useTariffs, useUpdateTariff } from '@/hooks/useTariffs';

const TariffManager = () => {
  const { data: tariff, isLoading } = useTariffs();
  const updateTariff = useUpdateTariff();
  const [rates, setRates] = useState({
    base_fare: 0,
    per_minute_rate: 0,
    drop_trip_rate_per_km: 0,
    round_trip_rate_per_km: 0,
  });
  const [hasChanges, setHasChanges] = useState(false);

  React.useEffect(() => {
    if (tariff) {
      setRates({
        base_fare: Number(tariff.base_fare),
        per_minute_rate: Number(tariff.per_minute_rate),
        drop_trip_rate_per_km: Number(tariff.drop_trip_rate_per_km),
        round_trip_rate_per_km: Number(tariff.round_trip_rate_per_km),
      });
    }
  }, [tariff]);

  const handleInputChange = (field: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setRates(prev => ({ ...prev, [field]: numValue }));
    setHasChanges(true);
  };

  const handleSave = () => {
    if (tariff) {
      updateTariff.mutate({
        id: tariff.id,
        ...rates,
      });
      setHasChanges(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading tariff rates...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <DollarSign className="h-5 w-5" />
          <span>Tariff Management</span>
        </CardTitle>
        <CardDescription>
          Manage pricing rates for taxi bookings (in INR)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="base_fare">Base Fare (₹)</Label>
            <Input
              id="base_fare"
              type="number"
              step="0.01"
              value={rates.base_fare}
              onChange={(e) => handleInputChange('base_fare', e.target.value)}
              placeholder="50.00"
            />
          </div>
          <div>
            <Label htmlFor="per_minute_rate">Rate per Minute (₹)</Label>
            <Input
              id="per_minute_rate"
              type="number"
              step="0.01"
              value={rates.per_minute_rate}
              onChange={(e) => handleInputChange('per_minute_rate', e.target.value)}
              placeholder="2.00"
            />
          </div>
          <div>
            <Label htmlFor="drop_trip_rate_per_km">Drop Trip Rate per KM (₹)</Label>
            <Input
              id="drop_trip_rate_per_km"
              type="number"
              step="0.01"
              value={rates.drop_trip_rate_per_km}
              onChange={(e) => handleInputChange('drop_trip_rate_per_km', e.target.value)}
              placeholder="14.00"
            />
          </div>
          <div>
            <Label htmlFor="round_trip_rate_per_km">Round Trip Rate per KM (₹)</Label>
            <Input
              id="round_trip_rate_per_km"
              type="number"
              step="0.01"
              value={rates.round_trip_rate_per_km}
              onChange={(e) => handleInputChange('round_trip_rate_per_km', e.target.value)}
              placeholder="12.00"
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={handleSave}
            disabled={!hasChanges || updateTariff.isPending}
            className="min-w-32"
          >
            {updateTariff.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TariffManager;
