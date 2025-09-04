import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { MapPin, Calculator, CalendarIcon, Clock } from 'lucide-react';
import { format, addMinutes, parse } from 'date-fns';
import { cn } from '@/lib/utils';
import LocationAutocomplete from './LocationAutocomplete';
import MapLocationPicker from './MapLocationPicker';
import VehicleSelection from './VehicleSelection';
import BookingSuccess from './BookingSuccess';
import CustomTimePicker from './CustomTimePicker';
import { useCreateBooking } from '@/hooks/useBookings';
import { useDistanceCalculation } from '@/hooks/useDistanceCalculation';
import { toast } from 'sonner';
const EnhancedBookingForm = () => {
  const navigate = useNavigate();
  const {
    calculateDistance,
    result: distanceResult,
    isLoading: isCalculatingDistance
  } = useDistanceCalculation();

  // Tab state
  const [activeTab, setActiveTab] = useState('oneway');

  // Form states
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [bookingDate, setBookingDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [pickupTime, setPickupTime] = useState('');
  const [returnTime, setReturnTime] = useState('');

  // Calendar popover states
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isReturnDatePickerOpen, setIsReturnDatePickerOpen] = useState(false);

  // Map picker states
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [mapPickerType, setMapPickerType] = useState<'pickup' | 'destination'>('pickup');

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
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
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
      setActiveTab(event.detail);
    };
    const handleUpdateServiceCategory = (event: CustomEvent) => {
      // Handle service category if needed for enhanced form
      console.log('Service category:', event.detail);
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

  // Utility functions for formatting
  const formatDisplayDate = (date: Date | undefined) => {
    if (!date) return null;
    return format(date, 'MMM dd, yyyy');
  };
  const formatDuration = (durationInMinutes: number) => {
    if (durationInMinutes <= 0) return '-';
    const totalHours = Math.floor(durationInMinutes / 60);
    const minutes = Math.round(durationInMinutes % 60);
    if (totalHours >= 24) {
      const days = Math.floor(totalHours / 24);
      const remainingHours = totalHours % 24;
      if (remainingHours === 0 && minutes === 0) {
        return `${days}d`;
      } else if (remainingHours === 0) {
        return `${days}d ${minutes}m`;
      } else if (minutes === 0) {
        return `${days}d ${remainingHours}h`;
      } else {
        return `${days}d ${remainingHours}h ${minutes}m`;
      }
    } else if (totalHours === 0) {
      return `${minutes}m`;
    } else if (minutes === 0) {
      return `${totalHours}h`;
    } else {
      return `${totalHours}h ${minutes}m`;
    }
  };

  // Form validation
  const isFormValid = useMemo(() => {
    if (activeTab === 'oneway') {
      return fromLocation && toLocation && bookingDate && pickupTime;
    } else if (activeTab === 'roundtrip') {
      return fromLocation && toLocation && bookingDate && pickupTime && returnDate && returnTime;
    } else if (activeTab === 'hourly') {
      return fromLocation && bookingDate && pickupTime;
    }
    return false;
  }, [activeTab, fromLocation, toLocation, bookingDate, pickupTime, returnDate, returnTime]);
  const handleBookNow = async () => {
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
        pickupDate: bookingDate ? format(bookingDate, 'yyyy-MM-dd') : '',
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
  const handleShowConfirmDialog = () => {
    if (!selectedVehicle) {
      toast.error('Please select a vehicle');
      return;
    }
    setShowConfirmDialog(true);
  };
  const handleBooking = async () => {
    const bookingData = {
      pickup_location: fromLocation,
      destination: toLocation,
      pickup_date: format(bookingDate!, 'yyyy-MM-dd'),
      pickup_time: pickupTime,
      passenger_name: passengerName,
      passenger_phone: passengerPhone,
      passenger_email: passengerEmail,
      estimated_fare: estimatedFare,
      status: 'pending',
      vehicle_type: selectedVehicle.name,
      distance_km: estimatedDistance,
      trip_type: activeTab === 'roundtrip' ? 'round-trip' : 'one-way'
    };
    try {
      const result = await createBooking.mutateAsync(bookingData);
      setShowConfirmDialog(false);

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
        vehicle: selectedVehicle.name,
        distance: result.distance_km?.toString() || '',
        tripType: result.trip_type
      });

      // Navigate immediately to confirmation page
      navigate(`/booking-confirmation?${params.toString()}`);

      // Send notification asynchronously after redirect (non-blocking)
      fetch('https://skjsaxpsgepdtkykyoni.supabase.co/functions/v1/send-booking-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNranNheHBzZ2VwZHRreWt5b25pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNDg4MTQsImV4cCI6MjA2NzgyNDgxNH0.b0Mfizp4b0l-U75RBGzYWsWRSoevd3LRe2yMlJO3zao'}`
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
          trip_type: activeTab === 'roundtrip' ? 'round-trip' : 'one-way'
        })
      }).catch(error => {
        console.error('Failed to send notification:', error);
      });
    } catch (error) {
      console.error('Booking failed:', error);
      toast.error('Booking failed. Please try again.');
    }
  };
  const handleNewBooking = () => {
    // Reset all states
    setFromLocation('');
    setToLocation('');
    setBookingDate(undefined);
    setReturnDate(undefined);
    setPickupTime('');
    setReturnTime('');
    setPassengerName('');
    setPassengerPhone('');
    setPassengerEmail('');
    setShowVehicleSelection(false);
    setSelectedVehicle(null);
    setEstimatedFare(0);
    setShowBookingSuccess(false);
    setCompletedBooking(null);
  };

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

  // Calculate drop time based on pickup time and estimated travel time
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

  // Show booking success screen
  if (showBookingSuccess && completedBooking) {
    return <BookingSuccess bookingDetails={completedBooking} onNewBooking={handleNewBooking} />;
  }
  return <div className="p-4 flex items-center justify-center w-full max-w-7xl mx-auto">
      <Card className="w-full max-w-4xl mx-auto bg-white shadow-2xl border-0 rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary to-orange-500 text-white p-8 py-[29px] px-[29px] my-px">
          <CardTitle className="text-3xl font-bold text-center">
            Book Your Ride Now
          </CardTitle>
          <p className="text-center text-white/90 mt-2">
            Choose your preferred service and get instant booking confirmation
          </p>
        </CardHeader>

        <CardContent className="p-10 px-12">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-gray-100 rounded-2xl p-1 h-14">
              <TabsTrigger value="oneway" className="text-base font-semibold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-lg rounded-xl transition-all duration-300">
                One Way
              </TabsTrigger>
              <TabsTrigger value="roundtrip" className="text-base font-semibold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-lg rounded-xl transition-all duration-300">
                Round Trip
              </TabsTrigger>
              <TabsTrigger value="hourly" className="text-base font-semibold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-lg rounded-xl transition-all duration-300">
                Hourly
              </TabsTrigger>
            </TabsList>

            {/* One Way Tab */}
            <TabsContent value="oneway" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* From Location */}
                <div className="space-y-2">
                  <Label className="text-gray-700 font-semibold text-base">From</Label>
                  <div className="relative flex items-center gap-2">
                    <div className="flex-1">
                      <LocationAutocomplete value={fromLocation} onChange={setFromLocation} placeholder="Enter pickup location" className="h-10 text-base border-2 border-gray-200 focus:border-primary rounded-xl pl-4" />
                    </div>
                     
                  </div>
                </div>

                {/* To Location */}
                <div className="space-y-2">
                  <Label className="text-gray-700 font-semibold text-base">To</Label>
                  <div className="relative flex items-center gap-2">
                    <div className="flex-1">
                      <LocationAutocomplete value={toLocation} onChange={setToLocation} placeholder="Enter drop location" className="h-10 text-base border-2 border-gray-200 focus:border-primary rounded-xl pl-4" />
                    </div>
                     
                  </div>
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <Label className="text-gray-700 font-semibold text-base">Pickup Date</Label>
                  <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full h-10 justify-start text-left font-normal border-2 border-gray-200 focus:border-primary rounded-xl hover:border-primary hover:bg-white hover:text-black", !bookingDate && "text-muted-foreground hover:text-black")}>
                        <CalendarIcon className="mr-3 h-5 w-5 text-primary" />
                        {formatDisplayDate(bookingDate) || <span>Select date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={bookingDate} onSelect={date => {
                      setBookingDate(date);
                      setIsDatePickerOpen(false);
                    }} initialFocus disabled={date => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }} className="pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Modern Time Picker */}
                <div className="space-y-2">
                  <Label className="text-gray-700 font-semibold text-base">Pickup Time</Label>
                  <CustomTimePicker 
                    value={pickupTime} 
                    onChange={setPickupTime} 
                    placeholder="Select time" 
                    className="w-full h-10 px-3 border-2 border-gray-200 rounded-xl hover:border-primary focus:border-primary" 
                  />
                </div>
              </div>

              {/* Distance and Duration Display */}
              {fromLocation && toLocation && <div className="bg-blue-50 rounded-xl p-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold">Distance:</span> 
                        {isCalculatingDistance ? <span className="ml-1">Calculating...</span> : estimatedDistance > 0 ? <span className="ml-1 text-blue-600 font-bold">{estimatedDistance} km</span> : <span className="ml-1">-</span>}
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold">Duration:</span>
                        {isCalculatingDistance ? <span className="ml-1">Calculating...</span> : distanceResult.duration > 0 ? <span className="ml-1 text-blue-600 font-bold">{formatDuration(distanceResult.duration)}</span> : <span className="ml-1">-</span>}
                      </div>
                    </div>
                    {dropTime.time}
                  </div>
                </div>}
            </TabsContent>

            {/* Round Trip Tab */}
            <TabsContent value="roundtrip" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* From Location */}
                <div className="space-y-2">
                  <Label className="text-gray-700 font-semibold text-base">From</Label>
                  <div className="relative flex items-center gap-2">
                    <div className="flex-1">
                      <LocationAutocomplete value={fromLocation} onChange={setFromLocation} placeholder="Enter pickup location" className="h-10 text-base border-2 border-gray-200 focus:border-primary rounded-xl pl-4" />
                    </div>
                     
                  </div>
                </div>

                {/* To Location */}
                <div className="space-y-2">
                  <Label className="text-gray-700 font-semibold text-base">To</Label>
                  <div className="relative flex items-center gap-2">
                    <div className="flex-1">
                      <LocationAutocomplete value={toLocation} onChange={setToLocation} placeholder="Enter drop location" className="h-10 text-base border-2 border-gray-200 focus:border-primary rounded-xl pl-4" />
                    </div>
                     
                  </div>
                </div>

                {/* Departure Date */}
                <div className="space-y-2">
                  <Label className="text-gray-700 font-semibold text-base">Departure Date</Label>
                  <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full h-10 justify-start text-left font-normal border-2 border-gray-200 hover:border-primary rounded-xl hover:bg-white hover:text-black", !bookingDate && "text-muted-foreground hover:text-black")}>
                        <CalendarIcon className="mr-3 h-5 w-5 text-primary" />
                        {formatDisplayDate(bookingDate) || <span>Select date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={bookingDate} onSelect={date => {
                      setBookingDate(date);
                      setIsDatePickerOpen(false);
                    }} initialFocus disabled={date => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }} className="pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Departure Time */}
                <div className="space-y-2">
                  <Label className="text-gray-700 font-semibold text-base">Departure Time</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full h-10 justify-start text-left font-normal border-2 border-gray-200 focus:border-primary rounded-xl hover:border-primary hover:bg-white hover:text-black", !pickupTime && "text-muted-foreground hover:text-black")}>
                        <Clock className="mr-3 h-5 w-5 text-primary" />
                        {pickupTime || <span>Select time</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-4" align="start">
                      <CustomTimePicker value={pickupTime} onChange={setPickupTime} placeholder="Select time" className="w-full" />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Return Date */}
                <div className="space-y-2">
                  <Label className="text-gray-700 font-semibold text-base">Return Date</Label>
                  <Popover open={isReturnDatePickerOpen} onOpenChange={setIsReturnDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full h-10 justify-start text-left font-normal border-2 border-gray-200 hover:border-primary rounded-xl hover:bg-white hover:text-black", !returnDate && "text-muted-foreground hover:text-black")}>
                        <CalendarIcon className="mr-3 h-5 w-5 text-primary" />
                        {formatDisplayDate(returnDate) || <span>Select return date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={returnDate} onSelect={date => {
                      setReturnDate(date);
                      setIsReturnDatePickerOpen(false);
                    }} initialFocus disabled={date => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }} className="pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Return Time */}
                <div className="space-y-2">
                  <Label className="text-gray-700 font-semibold text-base">Return Time</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full h-10 justify-start text-left font-normal border-2 border-gray-200 focus:border-primary rounded-xl hover:border-primary hover:bg-white hover:text-black", !returnTime && "text-muted-foreground hover:text-black")}>
                        <Clock className="mr-3 h-5 w-5 text-primary" />
                        {returnTime || <span>Select return time</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-4" align="start">
                      <CustomTimePicker value={returnTime} onChange={setReturnTime} placeholder="Select return time" className="w-full" />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Distance and Duration Display for Round Trip */}
              {fromLocation && toLocation && <div className="bg-blue-50 rounded-xl p-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold">Distance:</span> 
                        {isCalculatingDistance ? <span className="ml-1">Calculating...</span> : estimatedDistance > 0 ? <span className="ml-1 text-blue-600 font-bold">{estimatedDistance * 2} km (Round Trip)</span> : <span className="ml-1">-</span>}
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold">Duration:</span>
                        {isCalculatingDistance ? <span className="ml-1">Calculating...</span> : distanceResult.duration > 0 ? <span className="ml-1 text-blue-600 font-bold">{formatDuration(distanceResult.duration * 2)} (Total)</span> : <span className="ml-1">-</span>}
                      </div>
                    </div>
                  </div>
                </div>}
            </TabsContent>

            {/* Hourly Tab */}
            <TabsContent value="hourly" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pickup Location */}
                <div className="space-y-2">
                  <Label className="text-gray-700 font-semibold text-base">Pickup Location</Label>
                  <div className="relative flex items-center gap-2">
                    <div className="flex-1">
                      <LocationAutocomplete value={fromLocation} onChange={setFromLocation} placeholder="Enter pickup location" className="h-10 text-base border-2 border-gray-200 focus:border-primary rounded-xl pl-4" />
                    </div>
                    
                  </div>
                </div>

                {/* Hours */}
                <div className="space-y-2">
                  <Label className="text-gray-700 font-semibold text-base">Duration (Hours)</Label>
                  <Select>
                    <SelectTrigger className="h-10 border-2 border-gray-200 focus:border-primary rounded-xl">
                      <SelectValue placeholder="Select hours" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 Hours</SelectItem>
                      <SelectItem value="4">4 Hours</SelectItem>
                      <SelectItem value="8">8 Hours</SelectItem>
                      <SelectItem value="12">12 Hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <Label className="text-gray-700 font-semibold text-base">Date</Label>
                  <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full h-10 justify-start text-left font-normal border-2 border-gray-200 hover:border-primary rounded-xl hover:bg-white hover:text-black", !bookingDate && "text-muted-foreground hover:text-black")}>
                        <CalendarIcon className="mr-3 h-5 w-5 text-primary" />
                        {formatDisplayDate(bookingDate) || <span>Select date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={bookingDate} onSelect={date => {
                      setBookingDate(date);
                      setIsDatePickerOpen(false);
                    }} initialFocus disabled={date => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }} className="pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Time */}
                <div className="space-y-2">
                  <Label className="text-gray-700 font-semibold text-base">Start Time</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full h-10 justify-start text-left font-normal border-2 border-gray-200 focus:border-primary rounded-xl hover:border-primary hover:bg-white hover:text-black", !pickupTime && "text-muted-foreground hover:text-black")}>
                        <Clock className="mr-3 h-5 w-5 text-primary" />
                        {pickupTime || <span>Select start time</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-4" align="start">
                      <CustomTimePicker value={pickupTime} onChange={setPickupTime} placeholder="Select start time" className="w-full" />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Map Location Picker */}
          <MapLocationPicker isOpen={showMapPicker} onClose={() => setShowMapPicker(false)} onLocationSelect={(address, coordinates) => {
          if (mapPickerType === 'pickup') {
            setFromLocation(address);
          } else {
            setToLocation(address);
          }
        }} pickerType={mapPickerType === 'destination' ? 'drop' : 'pickup'} />

          {/* Passenger Details - Vertical Layout with Full Width */}
          {isFormValid && !showVehicleSelection && (
            <div className="space-y-4 mb-6 mt-6">
              <div className="bg-gray-50 rounded-xl p-5">
                <Label className="text-sm font-medium text-gray-600 mb-2 block">Passenger Name *</Label>
                <Input 
                  value={passengerName} 
                  onChange={e => setPassengerName(e.target.value)} 
                  placeholder="Enter your full name" 
                  className="h-12 border-gray-200 rounded-xl bg-white w-full text-base" 
                />
              </div>
              
              <div className="bg-gray-50 rounded-xl p-5">
                <Label className="text-sm font-medium text-gray-600 mb-2 block">Phone Number *</Label>
                <Input 
                  value={passengerPhone} 
                  onChange={e => setPassengerPhone(e.target.value)} 
                  placeholder="Enter your phone number" 
                  className="h-12 border-gray-200 rounded-xl bg-white w-full text-base" 
                />
              </div>
              
              <div className="bg-gray-50 rounded-xl p-5">
                <Label className="text-sm font-medium text-gray-600 mb-2 block">Email Address (Optional)</Label>
                <Input 
                  value={passengerEmail} 
                  onChange={e => setPassengerEmail(e.target.value)} 
                  placeholder="Enter your email address" 
                  className="h-12 border-gray-200 rounded-xl bg-white w-full text-base" 
                />
              </div>
            </div>
          )}

          {/* Book Button */}
          <div className="flex justify-center mt-8">
            <Button onClick={handleBookNow} disabled={!isFormValid || isFormValid && !passengerName && !passengerPhone} className="bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-white px-12 py-4 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
              Search Vehicles
            </Button>
          </div>

          {/* Vehicle Selection */}
          {showVehicleSelection && <div className="mb-6">
              <VehicleSelection distance={estimatedDistance} duration={distanceResult.duration} tripType={activeTab === 'roundtrip' ? 'roundtrip' : 'oneway'} isCalculatingDistance={isCalculatingDistance} onVehicleSelect={handleVehicleSelect} selectedVehicleId={selectedVehicle?.id} />
            </div>}

          {/* Estimated Fare & Book Button */}
          {selectedVehicle && estimatedFare > 0 && <div className="bg-gradient-to-r from-primary/10 to-blue-50 rounded-2xl p-6 mb-6">
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-primary mb-2">
                  Estimated Fare: ₹{estimatedFare}
                </h3>
                <p className="text-gray-600">
                  {selectedVehicle.name} • {estimatedDistance} km • {dropTime.time} {dropTime.period} arrival
                </p>
              </div>
              
              <div className="flex justify-center">
                <Button onClick={handleShowConfirmDialog} disabled={createBooking.isPending} className="bg-green-600 hover:bg-green-700 text-white text-xl font-bold py-6 px-16 rounded-2xl min-w-[300px]">
                  {createBooking.isPending ? 'BOOKING...' : 'CONFIRM BOOKING'}
                </Button>
              </div>
            </div>}

          {/* Confirmation Dialog */}
          <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
            <DialogContent className="max-w-md mx-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-center text-primary">
                  Booking Confirmation
                </DialogTitle>
                <DialogDescription className="text-center text-gray-600 mt-2">
                  Please review the terms before confirming your booking
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="text-sm text-gray-700 space-y-2">
                    <p><strong>Driver Batta:</strong> ₹ 400 (included)</p>
                    <p><strong>Above 400 KM:</strong> ₹ 300 Extra</p>
                    <p><strong>For Customer Intimation:</strong> Toll Gate, Permit, Hill Station Charges Extra</p>
                    <p><strong>For Questions Contact:</strong> 7305305111</p>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <Button variant="outline" onClick={() => setShowConfirmDialog(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleBooking} disabled={createBooking.isPending} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                    {createBooking.isPending ? 'Booking...' : 'Confirm Booking'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>;
};
export default EnhancedBookingForm;