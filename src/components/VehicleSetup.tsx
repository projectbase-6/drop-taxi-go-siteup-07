import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Car } from 'lucide-react';
import { setupVehicleTypes } from '@/utils/setupVehicleTypes';
import { useToast } from '@/hooks/use-toast';

const VehicleSetup: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSetup = async () => {
    setIsLoading(true);
    try {
      await setupVehicleTypes();
      toast({
        title: "Success",
        description: "Vehicle types have been set up with the new rates: SEDAN (₹14), ETIOS (₹15), SUV (₹19), INNOVA (₹20)",
      });
    } catch (error) {
      console.error('Setup error:', error);
      toast({
        title: "Error",
        description: "Failed to setup vehicle types. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Car className="h-5 w-5" />
          <span>Setup Vehicle Types</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600">
          <p className="mb-2">This will create 4 vehicle types with rates:</p>
          <ul className="space-y-1">
            <li>• SEDAN - ₹14</li>
            <li>• ETIOS - ₹15</li>
            <li>• SUV - ₹19</li>
            <li>• INNOVA - ₹20</li>
          </ul>
        </div>
        
        <Button 
          onClick={handleSetup} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Setting up...
            </>
          ) : (
            'Setup Vehicle Types'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default VehicleSetup;