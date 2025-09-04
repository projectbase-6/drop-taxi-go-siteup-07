
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MapPin, Calendar, Clock, User, Phone, Car, Loader2, CheckCircle, Navigation } from 'lucide-react';
import { useTariffs } from '@/hooks/useTariffs';
import { useCreateBooking } from '@/hooks/useBookings';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import LocationAutocomplete from './LocationAutocomplete';
import MapLocationPicker from './MapLocationPicker';

interface SimpleBookingFormProps {
  selectedService?: string;
  prefilledPickup?: string;
  prefilledDrop?: string;
  prefilledPrice?: number;
}

const SimpleBookingForm: React.FC<SimpleBookingFormProps> = ({
  selectedService = 'oneway',
  prefilledPickup = '',
  prefilledDrop = '',
  prefilledPrice = 0
}) => {
  const { data: tariff } = useTariffs();
  const createBooking = useCreateBooking();
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [showDetailedForm, setShowDetailedForm] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [mapPickerType, setMapPickerType] = useState<'pickup' | 'drop'>('pickup');
  
  const [formData, setFormData] = useState({
    pickup_location: '',
    destination: '',
    pickup_date: '',
    pickup_time: '',
    passenger_name: '',
    passenger_phone: '',
    passenger_email: '',
    trip_type: 'oneway',
    selected_vehicle: 'sedan',
    num_passengers: '1',
  });

  // Update form when props change
  useEffect(() => {
    if (prefilledPickup || prefilledDrop || selectedService) {
      setFormData(prev => ({
        ...prev,
        pickup_location: prefilledPickup || prev.pickup_location,
        destination: prefilledDrop || prev.destination,
        trip_type: selectedService || prev.trip_type
      }));
      
      // Show detailed form if locations are prefilled
      if (prefilledPickup && prefilledDrop) {
        setShowDetailedForm(true);
      }
    }
  }, [prefilledPickup, prefilledDrop, selectedService]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Show detailed form when basic details are filled
    if (field === 'pickup_date' && value && formData.pickup_location && formData.destination) {
      setShowDetailedForm(true);
    }
  };

  const getCurrentLocation = async () => {
    setIsGettingLocation(true);
    
    try {
      // Use Capacitor Geolocation for better mobile support
      const { Geolocation } = await import('@capacitor/geolocation');
      const { Capacitor } = await import('@capacitor/core');
      
      let position;
      
      if (Capacitor.isNativePlatform()) {
        // Request permissions for native platforms
        const permissions = await Geolocation.requestPermissions();
        if (permissions.location !== 'granted') {
          toast({
            title: "Permission Required",
            description: "Location permission is required to get your current location.",
            variant: "destructive",
          });
          setIsGettingLocation(false);
          return;
        }
        
        position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000
        });
      } else {
        // Fallback to web geolocation with better error handling
        if (!navigator.geolocation) {
          toast({
            title: "Location Not Available",
            description: "Your device doesn't support location services. Please enter your location manually.",
            variant: "destructive",
          });
          setIsGettingLocation(false);
          return;
        }
        
        position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve,
            reject,
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 300000 // 5 minutes
            }
          );
        });
      }
      
      const { latitude, longitude } = position.coords;
      
      // Get Mapbox token from edge function and use reverse geocoding
      const { data: tokenData, error: tokenError } = await supabase.functions.invoke('mapbox-token');
      
      if (tokenError || !tokenData?.token) {
        throw new Error('Failed to get location services');
      }

      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${tokenData.token}`
      );
      
      if (response.ok) {
        const data = await response.json();
        const address = data.features[0]?.place_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        
        handleInputChange('pickup_location', address);
        toast({
          title: "Location Found",
          description: "Your current location has been set as pickup location.",
        });
      } else {
        // Fallback to coordinates if geocoding fails
        const coordinates = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        handleInputChange('pickup_location', coordinates);
        toast({
          title: "Location Found",
          description: "Your coordinates have been set as pickup location.",
        });
      }
    } catch (error: any) {
      console.error('Error getting location:', error);
      let errorMessage = "Unable to get your location. Please try again.";
      
      if (error.code === 1) {
        errorMessage = "Location access denied. Please enable location permissions in your device settings and try again.";
      } else if (error.code === 2) {
        errorMessage = "Location unavailable. Please check your GPS settings and try again.";
      } else if (error.code === 3) {
        errorMessage = "Location request timed out. Please try again.";
      } else if (error.message && error.message.includes('location services')) {
        errorMessage = "Location services are not available. Please enter your location manually.";
      }
      
      toast({
        title: "Location Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGettingLocation(false);
    }
  };

  const calculateFare = () => {
    if (prefilledPrice > 0) return prefilledPrice;
    if (!tariff) return 1000;
    
    const baseFare = Number(tariff.base_fare) || 50;
    const perKmRate = Number(tariff.drop_trip_rate_per_km || 0);
    const estimatedDistance = 50; // Default distance
    
    return baseFare + (estimatedDistance * perKmRate);
  };

  const handleMapLocationSelect = (location: string, coordinates: [number, number]) => {
    const field = mapPickerType === 'pickup' ? 'pickup_location' : 'destination';
    handleInputChange(field, location);
    setShowMapPicker(false);
    toast({
      title: "Location Selected",
      description: `Your ${mapPickerType} location has been set from the map.`,
    });
  };

  const openMapPicker = (type: 'pickup' | 'drop') => {
    setMapPickerType(type);
    setShowMapPicker(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (bookingSuccess) return;
    
    const currentDate = new Date();
    const currentDateStr = currentDate.toISOString().split('T')[0];
    const currentTimeStr = currentDate.toTimeString().slice(0, 5);
    
    const bookingData = {
      pickup_location: formData.pickup_location,
      destination: formData.destination,
      pickup_date: formData.pickup_date || currentDateStr,
      pickup_time: formData.pickup_time || currentTimeStr,
      passenger_name: formData.passenger_name,
      passenger_phone: formData.passenger_phone,
      passenger_email: formData.passenger_email || null,
      estimated_fare: calculateFare(),
      distance_km: 50,
      status: 'pending',
      trip_type: formData.trip_type,
      vehicle_type: formData.selected_vehicle,
    };

    try {
      await createBooking.mutateAsync(bookingData);
      setBookingSuccess(true);
      toast({
        title: "Booking Successful!",
        description: "Your ride has been booked successfully. You will receive a confirmation shortly.",
      });
      setTimeout(() => {
        setBookingSuccess(false);
        setShowDetailedForm(false);
        setFormData({
          pickup_location: '',
          destination: '',
          pickup_date: '',
          pickup_time: '',
          passenger_name: '',
          passenger_phone: '',
          passenger_email: '',
          trip_type: 'oneway',
          selected_vehicle: 'sedan',
          num_passengers: '1',
        });
      }, 100); // Reduced from 5000ms to 100ms
    } catch (error) {
      console.error('Booking failed:', error);
      toast({
        title: "Booking Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!showDetailedForm) {
    // Simple booking form (like 2nd image)
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-black mb-2 drop-shadow-lg" style={{textShadow: '0 0 10px rgba(0,0,0,0.3)'}}>
            BOOK OUTSTATION ONE WAY DROP TAXI ONLINE
          </h2>
        </div>

        <form className="space-y-6">
          {/* Trip Type Selection */}
          <RadioGroup
            value={formData.trip_type}
            onValueChange={(value) => handleInputChange('trip_type', value)}
            className="flex space-x-6 mb-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="oneway" id="oneway" className="border-orange-500 text-orange-500" />
              <Label htmlFor="oneway" className="text-lg font-semibold text-black drop-shadow-sm" style={{textShadow: '0 0 8px rgba(0,0,0,0.2)'}}>One Way</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="roundtrip" id="roundtrip" className="border-gray-400 text-gray-400" />
              <Label htmlFor="roundtrip" className="text-lg font-semibold text-gray-700 drop-shadow-sm" style={{textShadow: '0 0 8px rgba(0,0,0,0.2)'}}>Round Trip</Label>
            </div>
          </RadioGroup>

          {/* Pickup Location */}
          <div className="relative">
            <LocationAutocomplete
              value={formData.pickup_location}
              onChange={(value) => handleInputChange('pickup_location', value)}
              placeholder="Pickup location"
              className="h-14 pl-12 pr-20 text-lg border-gray-300 rounded-xl text-black placeholder:text-gray-500"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => openMapPicker('pickup')}
                className="p-2 hover:bg-orange-50"
                title="Pin location on map"
              >
                <MapPin className="h-5 w-5 text-orange-500" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
                className="p-2 hover:bg-orange-50"
                title="Use current location"
              >
                {isGettingLocation ? (
                  <Loader2 className="h-5 w-5 animate-spin text-orange-500" />
                ) : (
                  <Navigation className="h-5 w-5 text-orange-500" />
                )}
              </Button>
            </div>
          </div>

          {/* Drop Location */}
          <div className="relative">
            <LocationAutocomplete
              value={formData.destination}
              onChange={(value) => handleInputChange('destination', value)}
              placeholder="Drop location"
              className="h-14 pl-12 pr-16 text-lg border-gray-300 rounded-xl text-black placeholder:text-gray-500"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => openMapPicker('drop')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 hover:bg-orange-50"
              title="Pin location on map"
            >
              <MapPin className="h-5 w-5 text-orange-500" />
            </Button>
          </div>

          {/* Pickup Date */}
          <div className="relative">
            <Input
              type="date"
              placeholder="Pickup Date"
              value={formData.pickup_date}
              onChange={(e) => handleInputChange('pickup_date', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="h-14 pl-12 text-lg border-gray-300 rounded-xl text-black"
              required
            />
            <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-600" />
          </div>
        </form>

        {/* Map Location Picker Dialog */}
        <MapLocationPicker
          isOpen={showMapPicker}
          onClose={() => setShowMapPicker(false)}
          onLocationSelect={handleMapLocationSelect}
          initialLocation={mapPickerType === 'pickup' ? formData.pickup_location : formData.destination}
          pickerType={mapPickerType}
        />
      </div>
    );
  }

  // Detailed booking form (like 3rd image)
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-black mb-2 drop-shadow-lg" style={{textShadow: '0 0 10px rgba(0,0,0,0.3)'}}>
          BOOK OUTSTATION ONE WAY DROP TAXI ONLINE
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Trip Type Selection */}
        <RadioGroup
          value={formData.trip_type}
          onValueChange={(value) => handleInputChange('trip_type', value)}
          className="flex space-x-6 mb-6"
          disabled={bookingSuccess}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="oneway" id="oneway" className="border-orange-500 text-orange-500" />
            <Label htmlFor="oneway" className="text-lg font-semibold text-black drop-shadow-sm" style={{textShadow: '0 0 8px rgba(0,0,0,0.2)'}}>One Way</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="roundtrip" id="roundtrip" className="border-gray-400 text-gray-400" />
            <Label htmlFor="roundtrip" className="text-lg font-semibold text-gray-700 drop-shadow-sm" style={{textShadow: '0 0 8px rgba(0,0,0,0.2)'}}>Round Trip</Label>
          </div>
        </RadioGroup>

        {/* Location Fields */}
        <div className="grid grid-cols-1 gap-4">
          <div className="relative">
            <LocationAutocomplete
              value={formData.pickup_location}
              onChange={(value) => handleInputChange('pickup_location', value)}
              placeholder="Pickup location"
              className="h-12 pl-8 pr-16 text-sm border-gray-300 rounded-lg text-black"
              disabled={bookingSuccess}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => openMapPicker('pickup')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-orange-50"
              title="Pin pickup location on map"
            >
              <MapPin className="h-4 w-4 text-orange-500" />
            </Button>
          </div>
          
          <div className="relative">
            <LocationAutocomplete
              value={formData.destination}
              onChange={(value) => handleInputChange('destination', value)}
              placeholder="Drop location"
              className="h-12 pl-8 pr-16 text-sm border-gray-300 rounded-lg text-black"
              disabled={bookingSuccess}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => openMapPicker('drop')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-orange-50"
              title="Pin drop location on map"
            >
              <MapPin className="h-4 w-4 text-orange-500" />
            </Button>
          </div>
        </div>

        {/* Date Field */}
        <div className="relative">
          <Input
            type="date"
            value={formData.pickup_date}
            onChange={(e) => handleInputChange('pickup_date', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="h-12 pl-8 text-sm border-gray-300 rounded-lg text-black"
            disabled={bookingSuccess}
            required
          />
          <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600" />
        </div>

        {/* Vehicle Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div 
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              formData.selected_vehicle === 'sedan' 
                ? 'border-orange-500 bg-orange-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onClick={() => handleInputChange('selected_vehicle', 'sedan')}
          >
            <div className="text-center">
              <Car className="h-12 w-12 mx-auto mb-2 text-gray-700" />
              <div className="font-semibold text-black drop-shadow-sm" style={{textShadow: '0 0 6px rgba(0,0,0,0.2)'}}>SEDAN</div>
              <div className="text-lg font-bold text-orange-600 drop-shadow-sm" style={{textShadow: '0 0 8px rgba(255,165,0,0.3)'}}>
                ₹{calculateFare().toFixed(0)}
              </div>
            </div>
          </div>
          
          <div 
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              formData.selected_vehicle === 'suv' 
                ? 'border-orange-500 bg-orange-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onClick={() => handleInputChange('selected_vehicle', 'suv')}
          >
            <div className="text-center">
              <Car className="h-12 w-12 mx-auto mb-2 text-gray-700" />
              <div className="font-semibold text-black drop-shadow-sm" style={{textShadow: '0 0 6px rgba(0,0,0,0.2)'}}>SUV</div>
              <div className="text-lg font-bold text-orange-600 drop-shadow-sm" style={{textShadow: '0 0 8px rgba(255,165,0,0.3)'}}>
                ₹{(calculateFare() * 1.3).toFixed(0)}
              </div>
            </div>
          </div>
        </div>

        {/* Personal Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <Input
              placeholder="Name"
              value={formData.passenger_name}
              onChange={(e) => handleInputChange('passenger_name', e.target.value)}
              className="h-12 pl-8 text-sm border-gray-300 rounded-lg text-black placeholder:text-gray-500"
              disabled={bookingSuccess}
              required
            />
            <User className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600" />
          </div>
          
          <div className="relative">
            <Input
              type="tel"
              placeholder="Phone Number"
              value={formData.passenger_phone}
              onChange={(e) => handleInputChange('passenger_phone', e.target.value)}
              className="h-12 pl-8 text-sm border-gray-300 rounded-lg text-black placeholder:text-gray-500"
              disabled={bookingSuccess}
              required
            />
            <Phone className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600" />
          </div>
        </div>

        {/* Additional Details */}
        <div className="grid grid-cols-2 gap-4">
          <Select value={formData.pickup_time} onValueChange={(value) => handleInputChange('pickup_time', value)}>
            <SelectTrigger className="h-12 text-sm border-gray-300 rounded-lg text-black">
              <SelectValue placeholder="Pickup Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="06:00">06:00 AM</SelectItem>
              <SelectItem value="07:00">07:00 AM</SelectItem>
              <SelectItem value="08:00">08:00 AM</SelectItem>
              <SelectItem value="09:00">09:00 AM</SelectItem>
              <SelectItem value="10:00">10:00 AM</SelectItem>
              <SelectItem value="11:00">11:00 AM</SelectItem>
              <SelectItem value="12:00">12:00 PM</SelectItem>
              <SelectItem value="13:00">01:00 PM</SelectItem>
              <SelectItem value="14:00">02:00 PM</SelectItem>
              <SelectItem value="15:00">03:00 PM</SelectItem>
              <SelectItem value="16:00">04:00 PM</SelectItem>
              <SelectItem value="17:00">05:00 PM</SelectItem>
              <SelectItem value="18:00">06:00 PM</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={formData.num_passengers} onValueChange={(value) => handleInputChange('num_passengers', value)}>
            <SelectTrigger className="h-12 text-sm border-gray-300 rounded-lg text-black">
              <SelectValue placeholder="No of Persons" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Person</SelectItem>
              <SelectItem value="2">2 Persons</SelectItem>
              <SelectItem value="3">3 Persons</SelectItem>
              <SelectItem value="4">4 Persons</SelectItem>
              <SelectItem value="5">5 Persons</SelectItem>
              <SelectItem value="6">6 Persons</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Book Button and Map Button */}
        <div className="flex gap-3">
          <Button 
            type="submit" 
            className={`flex-1 h-14 text-lg font-bold rounded-full transition-all duration-300 ${
              bookingSuccess 
                ? 'bg-green-600 hover:bg-green-600 animate-pulse text-white'
                : createBooking.isPending 
                  ? 'animate-pulse bg-gradient-to-r from-orange-400 to-yellow-400 text-white' 
                  : 'bg-gradient-to-r from-orange-400 to-yellow-400 hover:opacity-90 hover:scale-105 hover:shadow-lg text-white'
            }`}
            disabled={createBooking.isPending || bookingSuccess}
            style={{textShadow: '0 0 10px rgba(0,0,0,0.3)'}}
          >
            {bookingSuccess ? (
              <>
                <CheckCircle className="h-5 w-5 animate-bounce mr-2" />
                <span>Booked Successfully!</span>
              </>
            ) : createBooking.isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                <span>Booking Your Ride...</span>
              </>
            ) : (
              <span>BOOK TAXI</span>
            )}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowMapPicker(true)}
            className="h-14 w-14 rounded-full border-2 border-orange-400 hover:bg-orange-50 flex items-center justify-center"
            disabled={bookingSuccess}
            title="Pin location on map"
          >
            <MapPin className="h-6 w-6 text-orange-500" />
          </Button>
        </div>
      </form>

      {/* Map Location Picker Dialog */}
      <MapLocationPicker
        isOpen={showMapPicker}
        onClose={() => setShowMapPicker(false)}
        onLocationSelect={handleMapLocationSelect}
        initialLocation={mapPickerType === 'pickup' ? formData.pickup_location : formData.destination}
        pickerType={mapPickerType}
      />
    </div>
  );
};

export default SimpleBookingForm;
