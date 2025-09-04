
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarDays, MapPin, Phone, User, Loader2 } from 'lucide-react';
import { useTariffs } from '@/hooks/useTariffs';
import { useCreateBooking } from '@/hooks/useBookings';
import { useDistanceCalculation } from '@/hooks/useDistanceCalculation';

const BookingForm = () => {
  const { data: tariff } = useTariffs();
  const createBooking = useCreateBooking();
  const { calculateDistance, result, isLoading: isCalculatingDistance } = useDistanceCalculation();
  
  const [formData, setFormData] = useState({
    pickup_location: '',
    destination: '',
    pickup_date: '',
    pickup_time: '',
    passenger_name: '',
    passenger_phone: '',
    passenger_email: '',
  });

  const [estimatedDistance, setEstimatedDistance] = useState(0);
  const [estimatedDuration, setEstimatedDuration] = useState(0);

  const calculateFare = () => {
    if (!tariff) return 0;
    const baseFare = Number(tariff.base_fare);
    const perKmRate = Number(tariff.drop_trip_rate_per_km); // Use drop trip rate as default
    const perMinuteRate = Number(tariff.per_minute_rate);
    
    return baseFare + (estimatedDistance * perKmRate) + (estimatedDuration * perMinuteRate);
  };

  const handleInputChange = async (field: string, value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    // Calculate real distance when both locations are available
    if (field === 'pickup_location' || field === 'destination') {
      const origin = field === 'pickup_location' ? value : formData.pickup_location;
      const destination = field === 'destination' ? value : formData.destination;
      
      if (origin && destination && origin.length > 3 && destination.length > 3) {
        try {
          const distanceResult = await calculateDistance(origin, destination);
          if (distanceResult.status === 'success') {
            setEstimatedDistance(distanceResult.distance);
            setEstimatedDuration(distanceResult.duration);
          }
        } catch (error) {
          console.error('Failed to calculate distance:', error);
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const bookingData = {
      ...formData,
      estimated_fare: calculateFare(),
      distance_km: estimatedDistance,
      duration_minutes: estimatedDuration,
      status: 'pending',
    };

    createBooking.mutate(bookingData);
  };

  const estimatedFare = calculateFare();

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <span>Book Your Taxi</span>
        </CardTitle>
        <CardDescription>
          Fill in your details to book a taxi ride
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pickup_location" className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-green-600" />
                <span>Pickup Location</span>
              </Label>
              <Input
                id="pickup_location"
                required
                value={formData.pickup_location}
                onChange={(e) => handleInputChange('pickup_location', e.target.value)}
                placeholder="Enter pickup location"
                disabled={isCalculatingDistance}
              />
            </div>
            
            <div>
              <Label htmlFor="destination" className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-red-600" />
                <span>Destination</span>
              </Label>
              <Input
                id="destination"
                required
                value={formData.destination}
                onChange={(e) => handleInputChange('destination', e.target.value)}
                placeholder="Enter destination"
                disabled={isCalculatingDistance}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pickup_date" className="flex items-center space-x-2">
                <CalendarDays className="h-4 w-4" />
                <span>Pickup Date</span>
              </Label>
              <Input
                id="pickup_date"
                type="date"
                required
                value={formData.pickup_date}
                onChange={(e) => handleInputChange('pickup_date', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div>
              <Label htmlFor="pickup_time">Pickup Time</Label>
              <Input
                id="pickup_time"
                type="time"
                required
                value={formData.pickup_time}
                onChange={(e) => handleInputChange('pickup_time', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="passenger_name" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Full Name</span>
              </Label>
              <Input
                id="passenger_name"
                required
                value={formData.passenger_name}
                onChange={(e) => handleInputChange('passenger_name', e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <Label htmlFor="passenger_phone" className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>Phone Number</span>
              </Label>
              <Input
                id="passenger_phone"
                type="tel"
                required
                value={formData.passenger_phone}
                onChange={(e) => handleInputChange('passenger_phone', e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="passenger_email">Email (Optional)</Label>
            <Input
              id="passenger_email"
              type="email"
              value={formData.passenger_email}
              onChange={(e) => handleInputChange('passenger_email', e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          {(estimatedDistance > 0 || isCalculatingDistance) && (
            <div className="bg-blue-50 p-4 rounded-lg">
              {isCalculatingDistance ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-gray-600">Calculating distance...</span>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Distance:</span>
                    <span className="font-medium">{estimatedDistance} km</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Duration:</span>
                    <span className="font-medium">{estimatedDuration} minutes</span>
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                    <span className="text-lg font-semibold text-gray-800">Estimated Fare:</span>
                    <span className="text-2xl font-bold text-blue-600">₹{estimatedFare.toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={createBooking.isPending}
          >
            {createBooking.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Booking...
              </>
            ) : (
              'Book Now'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;
