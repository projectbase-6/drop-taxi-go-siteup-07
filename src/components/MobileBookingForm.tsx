import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown, MapPin, Calculator, CalendarIcon, Clock } from 'lucide-react';
import { format, addMinutes, parse } from 'date-fns';
import { cn } from '@/lib/utils';
import LocationAutocomplete from './LocationAutocomplete';
import CustomTimePicker from './CustomTimePicker';
import MapLocationPicker from './MapLocationPicker';
import VehicleSelection from './VehicleSelection';
import BookingSuccess from './BookingSuccess';
import { useCreateBooking } from '@/hooks/useBookings';
import { useDistanceCalculation } from '@/hooks/useDistanceCalculation';
import { toast } from 'sonner';
const MobileBookingForm = () => {
  const navigate = useNavigate();
  const {
    calculateDistance,
    result: distanceResult,
    isLoading: isCalculatingDistance
  } = useDistanceCalculation();
  const [serviceType, setServiceType] = useState('outstation-oneway');
  const [selectedServiceCategory, setSelectedServiceCategory] = useState('city-rides');
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [departureDate, setDepartureDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [pickupTime, setPickupTime] = useState('');
  const [returnTime, setReturnTime] = useState('');
  const [showReturnDate, setShowReturnDate] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [mapPickerType, setMapPickerType] = useState<'pickup' | 'destination'>('pickup');
  const [departureDateOpen, setDepartureDateOpen] = useState(false);
  const [returnDateOpen, setReturnDateOpen] = useState(false);

  // User details for booking
  const [passengerName, setPassengerName] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('');
  const [passengerEmail, setPassengerEmail] = useState('');

  // Booking flow states
  const [showVehicleSelection, setShowVehicleSelection] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [estimatedFare, setEstimatedFare] = useState(0);
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);
  const [completedBooking, setCompletedBooking] = useState<any>(null);
  const createBooking = useCreateBooking();

  // Listen for custom events to auto-fill form
  useEffect(() => {
    const handleUpdatePickup = (event: CustomEvent) => {
      setFromLocation(event.detail);
    };
    const handleUpdateDrop = (event: CustomEvent) => {
      setToLocation(event.detail);
    };
    const handleUpdateTripType = (event: CustomEvent) => {
      const tripType = event.detail;
      if (tripType === 'roundtrip') {
        setServiceType('outstation-roundtrip');
        setShowReturnDate(true);
      } else if (tripType === 'hourly') {
        setServiceType('hourly');
        setShowReturnDate(false);
      } else {
        setServiceType('outstation-oneway');
        setShowReturnDate(false);
      }
    };
    const handleUpdateServiceCategory = (event: CustomEvent) => {
      const category = event.detail;
      setSelectedServiceCategory(category);
    };
    window.addEventListener('updatePickupLocation', handleUpdatePickup as EventListener);
    window.addEventListener('updateDropLocation', handleUpdateDrop as EventListener);
    window.addEventListener('updateTripType', handleUpdateTripType as EventListener);
    window.addEventListener('updateServiceCategory', handleUpdateServiceCategory as EventListener);
    return () => {
      window.removeEventListener('updatePickupLocation', handleUpdatePickup as EventListener);
      window.removeEventListener('updateDropLocation', handleUpdateDrop as EventListener);
      window.removeEventListener('updateTripType', handleUpdateTripType as EventListener);
      window.removeEventListener('updateServiceCategory', handleUpdateServiceCategory as EventListener);
    };
  }, []);
  const serviceCategories = [{
    id: 'city-rides',
    label: '🚖 City Rides',
    description: 'Quick rides within the city'
  }, {
    id: 'airport-transfers',
    label: '✈ Airport Transfers',
    description: 'To and from airports'
  }, {
    id: 'outstation',
    label: '🌄 Outstation & Long-Distance Travel',
    description: 'Inter-city travel'
  }, {
    id: 'hourly-rentals',
    label: '🕒 Hourly Rentals',
    description: 'Rent by the hour'
  }, {
    id: 'corporate',
    label: '🧳 Corporate & Business Cab Services',
    description: 'Business travel solutions'
  }, {
    id: 'tourist',
    label: '🏕 Tourist Package & Holiday Cabs',
    description: 'Sightseeing and tours'
  }];

  // Form validation
  const isFormValid = useMemo(() => {
    if (serviceType === 'outstation-oneway') {
      return fromLocation && toLocation && departureDate && pickupTime;
    } else if (serviceType === 'outstation-roundtrip') {
      return fromLocation && toLocation && departureDate && pickupTime && returnDate && returnTime;
    } else if (serviceType === 'hourly') {
      return fromLocation && departureDate && pickupTime;
    }
    return false;
  }, [serviceType, fromLocation, toLocation, departureDate, pickupTime, returnDate, returnTime]);

  // Check if all required fields are filled to show passenger details
  const showPassengerDetails = useMemo(() => {
    return isFormValid;
  }, [isFormValid]);

  // Check if passenger details are filled to show vehicle selection
  const showVehicles = useMemo(() => {
    return showPassengerDetails && passengerName && passengerPhone && !showVehicleSelection;
  }, [showPassengerDetails, passengerName, passengerPhone, showVehicleSelection]);

  // Calculate estimated distance based on locations
  const estimatedDistance = useMemo(() => {
    return distanceResult.distance || 0;
  }, [distanceResult.distance]);

  // Calculate real distance when locations change
  useEffect(() => {
    if (fromLocation && toLocation && fromLocation.length > 3 && toLocation.length > 3) {
      calculateDistance(fromLocation, toLocation);
    }
  }, [fromLocation, toLocation, calculateDistance]);

  // Calculate estimated duration
  const estimatedDuration = useMemo(() => {
    return distanceResult.duration || 0;
  }, [distanceResult.duration]);
  const dropTime = useMemo(() => {
    if (!pickupTime || !distanceResult.duration) {
      return {
        time: '',
        period: ''
      };
    }
    try {
      const [time, period] = pickupTime.split(' ');
      const [hour, minute] = time.split(':');
      const hour24 = period === 'AM' ? hour === '12' ? '0' : hour : hour === '12' ? '12' : String(parseInt(hour) + 12);
      const pickupDateTime = new Date();
      pickupDateTime.setHours(parseInt(hour24), parseInt(minute), 0, 0);
      const dropDateTime = addMinutes(pickupDateTime, distanceResult.duration);
      return {
        time: format(dropDateTime, 'h:mm'),
        period: format(dropDateTime, 'a').toUpperCase()
      };
    } catch (error) {
      return {
        time: '',
        period: ''
      };
    }
  }, [pickupTime, distanceResult.duration]);

  // Get active tab equivalent for mobile form
  const activeTab = useMemo(() => {
    if (serviceType === 'outstation-roundtrip') return 'roundtrip';
    if (serviceType === 'hourly') return 'hourly';
    return 'oneway';
  }, [serviceType]);
  const handleLocationSwap = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
  };
  const handleSearchClick = async () => {
    if (!isFormValid) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Send vehicle search enquiry notification
    try {
      const enquiryData = {
        enquiryId: crypto.randomUUID(),
        fullName: passengerName || 'Guest User',
        email: passengerEmail || 'noreply@droptaxigo.in',
        phone: passengerPhone || '',
        subject: 'Vehicle Search Enquiry',
        message: `Customer is searching for vehicles for a ${activeTab} trip`,
        createdAt: new Date().toISOString(),
        enquiryType: 'vehicle-search',
        pickupLocation: fromLocation,
        dropLocation: toLocation,
        pickupDate: departureDate ? format(departureDate, 'yyyy-MM-dd') : '',
        pickupTime: pickupTime,
        tripType: activeTab,
        distance: estimatedDistance,
        duration: distanceResult.duration
      };

      console.log('Sending vehicle search enquiry:', enquiryData);
      
      fetch('https://skjsaxpsgepdtkykyoni.supabase.co/functions/v1/send-enquiry-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNranNheHBzZ2VwZHRreWt5b25pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNDg4MTQsImV4cCI6MjA2NzgyNDgxNH0.b0Mfizp4b0l-U75RBGzYWsWRSoevd3LRe2yMlJO3zao`
        },
        body: JSON.stringify(enquiryData)
      }).then(response => {
        if (!response.ok) {
          console.error('Failed to send vehicle search enquiry');
        } else {
          console.log('Vehicle search enquiry sent successfully');
        }
      }).catch(error => {
        console.error('Error sending vehicle search enquiry:', error);
      });
    } catch (error) {
      console.error('Error preparing vehicle search enquiry:', error);
    }
    
    setShowVehicleSelection(true);
  };
  const handleVehicleSelect = (vehicle: any, fare: number) => {
    setSelectedVehicle(vehicle);
    setEstimatedFare(fare);
  };
  const handleBooking = async () => {
    if (!selectedVehicle) {
      toast.error('Please select a vehicle');
      return;
    }
    
    // Validate passenger details are filled
    if (!passengerName || !passengerPhone) {
      toast.error('Please enter passenger details');
      return;
    }
    
    const bookingData = {
      pickup_location: fromLocation,
      destination: toLocation,
      pickup_date: format(departureDate!, 'yyyy-MM-dd'),
      pickup_time: pickupTime,
      passenger_name: passengerName,
      passenger_phone: passengerPhone,
      passenger_email: passengerEmail,
      estimated_fare: estimatedFare,
      status: 'pending',
      vehicle_type: selectedVehicle.name,
      distance_km: estimatedDistance,
      trip_type: serviceType === 'outstation-roundtrip' ? 'round-trip' : 
                 serviceType === 'hourly' ? 'hourly' : 'one-way'
    };
    
    try {
      const result = await createBooking.mutateAsync(bookingData);

      // Create URL parameters for the confirmation page
      const params = new URLSearchParams({
        id: result.id,
        pickup: result.pickup_location,
        destination: result.destination,
        date: result.pickup_date,
        time: result.pickup_time,
        name: result.passenger_name,
        phone: result.passenger_phone,
        email: result.passenger_email || '',
        fare: estimatedFare.toString(),
        vehicle: selectedVehicle.name || '',
        distance: result.distance_km?.toString() || '',
        tripType: result.trip_type
      });

      // Navigate to confirmation page with params
      navigate(`/booking-confirmation?${params.toString()}`);
      
      // Send notification asynchronously after redirect (non-blocking)
      fetch('https://skjsaxpsgepdtkykyoni.supabase.co/functions/v1/send-booking-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNranNheHBzZ2VwZHRreWt5b25pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNDg4MTQsImV4cCI6MjA2NzgyNDgxNH0.b0Mfizp4b0l-U75RBGzYWsWRSoevd3LRe2yMlJO3zao`
        },
        body: JSON.stringify({
          id: result.id,
          pickup_location: result.pickup_location,
          destination: result.destination,
          pickup_date: result.pickup_date,
          pickup_time: result.pickup_time,
          passenger_name: result.passenger_name,
          passenger_phone: result.passenger_phone,
          passenger_email: result.passenger_email,
          estimated_fare: estimatedFare,
          distance_km: estimatedDistance,
          duration_minutes: distanceResult.duration || 0,
          vehicle_type: selectedVehicle.name,
          trip_type: serviceType === 'outstation-roundtrip' ? 'round-trip' : 
                     serviceType === 'hourly' ? 'hourly' : 'one-way'
        })
      }).catch(error => {
        console.error('Failed to send notification:', error);
      });
    } catch (error) {
      console.error('Booking failed:', error);
      toast.error('Failed to create booking. Please try again.');
    }
  };
  return <Card className="w-full mx-auto bg-white shadow-2xl border-0 rounded-3xl overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-orange-500 text-white p-6">
          <h2 className="text-2xl font-bold text-center mb-2">
            Book Your Ride Now
          </h2>
          <p className="text-center text-white/90 text-sm">
            Choose your preferred service and get instant booking confirmation
          </p>
        </div>

        {/* Tab Selection */}
        <div className="bg-gray-100 p-4">
          <div className="grid grid-cols-3 gap-1 bg-gray-200 rounded-xl p-1">
            <button onClick={() => setServiceType('outstation-oneway')} className={cn("py-2 px-3 text-sm font-semibold rounded-lg transition-all duration-300", serviceType === 'outstation-oneway' ? "bg-white text-primary shadow-md" : "text-gray-600 hover:bg-white/50")}>
              One Way
            </button>
            <button onClick={() => setServiceType('outstation-roundtrip')} className={cn("py-2 px-3 text-sm font-semibold rounded-lg transition-all duration-300", serviceType === 'outstation-roundtrip' ? "bg-white text-primary shadow-md" : "text-gray-600 hover:bg-white/50")}>
              Round Trip
            </button>
            <button onClick={() => setServiceType('hourly')} className={cn("py-2 px-3 text-sm font-semibold rounded-lg transition-all duration-300", serviceType === 'hourly' ? "bg-white text-primary shadow-md" : "text-gray-600 hover:bg-white/50")}>
              Hourly
            </button>
          </div>
        </div>

        {/* Main Booking Form - Mobile Optimized */}
        <div className="p-4 space-y-4">
          {/* Location Fields - Stacked for Mobile */}
          <div className="space-y-4">
            {/* From Location */}
            <div className="bg-gray-50 rounded-xl p-4">
              <Label className="text-sm font-medium text-gray-500 mb-2 block">From</Label>
              <div className="flex items-center gap-2">
                <LocationAutocomplete value={fromLocation} onChange={setFromLocation} placeholder="Enter pickup location" className="border-0 bg-transparent p-0 text-lg font-semibold text-gray-900 placeholder:text-gray-400 focus:ring-0 flex-1" />
                
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <Button variant="ghost" size="sm" onClick={() => {
              const temp = fromLocation;
              setFromLocation(toLocation);
              setToLocation(temp);
            }} className="h-10 w-10 rounded-full bg-blue-50 hover:bg-blue-100 p-0">
                <ArrowUpDown className="h-5 w-5 text-blue-600" />
              </Button>
            </div>

            {/* To Location */}
            <div className="bg-gray-50 rounded-xl p-4">
              <Label className="text-sm font-medium text-gray-500 mb-2 block">To</Label>
              <div className="flex items-center gap-2">
                <LocationAutocomplete value={toLocation} onChange={setToLocation} placeholder="Enter destination" className="border-0 bg-transparent p-0 text-lg font-semibold text-gray-900 placeholder:text-gray-400 focus:ring-0 flex-1" />
                
              </div>
            </div>
          </div>

          {/* Distance Display for Mobile */}
          {fromLocation && toLocation && <div className="bg-blue-50 rounded-xl p-3 text-center">
              <div className="flex justify-center items-center space-x-4">
                <div className="text-sm">
                  <span className="font-semibold text-gray-600">Distance:</span>
                  {isCalculatingDistance ? <span className="ml-1 text-blue-600">Calculating...</span> : estimatedDistance > 0 ? <span className="ml-1 text-blue-600 font-bold">
                      {serviceType === 'outstation-roundtrip' ? estimatedDistance * 2 : estimatedDistance} km
                      {serviceType === 'outstation-roundtrip' && <span className="text-xs"> (Round Trip)</span>}
                    </span> : <span className="ml-1">-</span>}
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-gray-600">Duration:</span>
                  {isCalculatingDistance ? <span className="ml-1 text-blue-600">Calculating...</span> : estimatedDuration > 0 ? <span className="ml-1 text-blue-600 font-bold">{Math.round(estimatedDuration)} min</span> : <span className="ml-1">-</span>}
                </div>
              </div>
            </div>}

          {/* Date and Time - Mobile Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Departure Date */}
            <div className="bg-gray-50 rounded-xl p-4">
              <Label className="text-sm font-medium text-gray-500 mb-2 block">Departure ⌄</Label>
              <Popover open={departureDateOpen} onOpenChange={setDepartureDateOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="h-auto w-full justify-start text-left font-normal p-0 hover:bg-transparent">
                    <div className="flex flex-col items-start">
                      {departureDate ? <>
                          <div className="text-2xl font-bold text-gray-900">
                            {format(departureDate, 'd')}
                            <span className="text-sm ml-1">
                              {format(departureDate, "MMM''yy")}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {format(departureDate, 'EEEE')}
                          </div>
                        </> : <>
                          <div className="flex items-center text-gray-400 mb-1">
                            <CalendarIcon className="h-6 w-6 mr-2" />
                            <span className="text-sm">Select Date</span>
                          </div>
                          <div className="text-xs text-gray-400">Choose date</div>
                        </>}
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={departureDate} onSelect={date => {
                  setDepartureDate(date);
                  setDepartureDateOpen(false);
                }} initialFocus className="pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>

            {/* Pickup Time - Direct Time Picker */}
            <div className="bg-gray-50 rounded-xl p-4">
              <Label className="text-sm font-medium text-gray-500 mb-2 block break-words">Pickup Time</Label>
              <CustomTimePicker 
                value={pickupTime}
                onChange={setPickupTime}
                placeholder="Select pickup time"
                className="w-full justify-start text-left font-normal bg-white hover:bg-accent/50"
              />
            </div>
          </div>

          {/* Return Date and Time for Round Trip */}
          {serviceType === 'outstation-roundtrip' && <div className="space-y-4">
              {/* Return Date */}
              <div className="bg-gray-50 rounded-xl p-4">
                <Label className="text-sm font-medium text-gray-500 mb-2 block">Return Date</Label>
                <Popover open={returnDateOpen} onOpenChange={setReturnDateOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" className="h-auto w-full justify-start text-left font-normal p-0 hover:bg-transparent">
                      <div className="flex flex-col items-start">
                        {returnDate ? <>
                            <div className="text-2xl font-bold text-gray-900">
                              {format(returnDate, 'd')}
                              <span className="text-sm ml-1">
                                {format(returnDate, "MMM''yy")}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {format(returnDate, 'EEEE')}
                            </div>
                          </> : <>
                            <div className="flex items-center text-gray-400 mb-1">
                              <CalendarIcon className="h-6 w-6 mr-2" />
                              <span className="text-sm">Select Date</span>
                            </div>
                            <div className="text-xs text-gray-400">Choose return date</div>
                          </>}
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={returnDate} onSelect={date => {
                  setReturnDate(date);
                  setReturnDateOpen(false);
                }} initialFocus className="pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Return Time - Modern Time Picker */}
              <div className="bg-gray-50 rounded-xl p-4">
                <Label className="text-sm font-medium text-gray-500 mb-2 block">Return Time</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-white hover:bg-accent/50",
                        !returnTime && "text-muted-foreground"
                      )}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      {returnTime || "Select return time"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-4" align="start">
                    <div className="space-y-3">
                      <div className="font-medium text-sm">Select Return Time</div>
                      <CustomTimePicker 
                        value={returnTime}
                        onChange={setReturnTime}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>}

          {/* Map Location Picker */}
          <MapLocationPicker isOpen={showMapPicker} onClose={() => setShowMapPicker(false)} onLocationSelect={(address, coordinates) => {
          if (mapPickerType === 'pickup') {
            setFromLocation(address);
          } else {
            setToLocation(address);
          }
        }} pickerType={mapPickerType === 'destination' ? 'drop' : 'pickup'} />

          {/* Passenger Details - Vertical Layout Full Width */}
          {showPassengerDetails && !showVehicleSelection && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold text-gray-800">Passenger Details</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <Label className="text-sm font-medium text-gray-600 mb-2 block">Passenger Name *</Label>
                  <Input 
                    value={passengerName} 
                    onChange={e => setPassengerName(e.target.value)} 
                    placeholder="Enter your full name" 
                    className="h-12 border-gray-200 bg-white w-full text-base" 
                  />
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4">
                  <Label className="text-sm font-medium text-gray-600 mb-2 block">Phone Number *</Label>
                  <Input 
                    value={passengerPhone} 
                    onChange={e => setPassengerPhone(e.target.value)} 
                    placeholder="Enter your phone number" 
                    className="h-12 border-gray-200 bg-white w-full text-base" 
                  />
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4">
                  <Label className="text-sm font-medium text-gray-600 mb-2 block">Email Address (Optional)</Label>
                  <Input 
                    value={passengerEmail} 
                    onChange={e => setPassengerEmail(e.target.value)} 
                    placeholder="Enter your email address" 
                    className="h-12 border-gray-200 bg-white w-full text-base" 
                  />
                </div>
              </div>
            </div>
          )}

          {/* Search Button - Show when passenger details filled */}
          {showVehicles && <div className="pt-4">
              <Button onClick={handleSearchClick} className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-4 rounded-2xl">
                <Calculator className="h-5 w-5 mr-2" />
                SEARCH VEHICLES
              </Button>
            </div>}

          {/* Vehicle Selection */}
          {showVehicleSelection && <div className="pt-4">
              <VehicleSelection distance={estimatedDistance} duration={estimatedDuration} tripType={activeTab === 'roundtrip' ? 'roundtrip' : 'oneway'} isCalculatingDistance={isCalculatingDistance} onVehicleSelect={handleVehicleSelect} selectedVehicleId={selectedVehicle?.id} />
            </div>}

          {/* Estimated Fare & Book Button */}
          {selectedVehicle && estimatedFare > 0 && <div className="bg-gradient-to-r from-primary/10 to-blue-50 rounded-2xl p-4">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-primary mb-1">
                  Estimated Fare: ₹{estimatedFare}
                </h3>
                <p className="text-gray-600 text-sm">
                  {selectedVehicle.name} • {serviceType === 'outstation-roundtrip' ? estimatedDistance * 2 : estimatedDistance} km
                  {dropTime.time && ` • ${dropTime.time} ${dropTime.period} arrival`}
                </p>
              </div>

              <Button 
                onClick={handleBooking} 
                disabled={createBooking.isPending} 
                className="w-full bg-green-600 hover:bg-green-700 text-white text-lg font-bold py-4 rounded-2xl"
              >
                {createBooking.isPending ? 'BOOKING...' : 'CONFIRM BOOKING'}
              </Button>
            </div>}

          {/* Initial Search Button - Show when basic details not filled */}
          {!showPassengerDetails && <div className="pt-4">
              <Button disabled className="w-full bg-gray-400 text-white text-lg font-bold py-4 rounded-2xl cursor-not-allowed">
                SEARCH
              </Button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Please fill in pickup location, destination, date and time
              </p>
            </div>}
        </div>
      </CardContent>
    </Card>;
};
export default MobileBookingForm;