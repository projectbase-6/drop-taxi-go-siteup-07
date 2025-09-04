import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import LocationAutocomplete from './LocationAutocomplete';

const TaxiBookingForm = () => {
  const [date, setDate] = useState<Date>();
  const [activeTab, setActiveTab] = useState('city');
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  
  const popularCities = [
    'Chennai', 'Bangalore', 'Coimbatore', 'Madurai', 'Trichy', 'Salem'
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white shadow-xl border-0 rounded-2xl">
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 rounded-xl p-1">
            <TabsTrigger 
              value="city" 
              className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-primary rounded-lg"
            >
              City Taxi
            </TabsTrigger>
            <TabsTrigger 
              value="outstation" 
              className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-primary rounded-lg"
            >
              Outstation
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="city" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="from" className="text-gray-700 font-medium">From</Label>
                <LocationAutocomplete
                  value={fromLocation}
                  onChange={setFromLocation}
                  placeholder="Enter pickup location"
                  className="border-gray-200 focus:border-primary"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="to" className="text-gray-700 font-medium">To</Label>
                <LocationAutocomplete
                  value={toLocation}
                  onChange={setToLocation}
                  placeholder="Enter destination"
                  className="border-gray-200 focus:border-primary"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-gray-200 hover:border-primary",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Time</Label>
                <Select>
                  <SelectTrigger className="border-gray-200 focus:border-primary">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="now">Now</SelectItem>
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
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="outstation" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="from" className="text-gray-700 font-medium">From</Label>
                <LocationAutocomplete
                  value={fromLocation}
                  onChange={setFromLocation}
                  placeholder="Enter pickup city"
                  className="border-gray-200 focus:border-primary"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="to" className="text-gray-700 font-medium">To</Label>
                <LocationAutocomplete
                  value={toLocation}
                  onChange={setToLocation}
                  placeholder="Enter destination city"
                  className="border-gray-200 focus:border-primary"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Departure Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-gray-200 hover:border-primary",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Time</Label>
                <Select>
                  <SelectTrigger className="border-gray-200 focus:border-primary">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="06:00">06:00 AM</SelectItem>
                    <SelectItem value="07:00">07:00 AM</SelectItem>
                    <SelectItem value="08:00">08:00 AM</SelectItem>
                    <SelectItem value="09:00">09:00 AM</SelectItem>
                    <SelectItem value="10:00">10:00 AM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-600 mb-4 sm:mb-0">
            Estimated Fare: <span className="font-semibold text-gray-900">₹250 - ₹350</span>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 font-semibold rounded-lg">
            Book Your Ride
          </Button>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-600 mb-2">Popular Cities:</p>
          <div className="flex flex-wrap gap-2">
            {popularCities.map((city) => (
              <Button
                key={city}
                variant="outline"
                size="sm"
                className="text-xs h-7 px-3 border-gray-200 text-gray-600 hover:border-primary hover:text-primary"
              >
                {city}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxiBookingForm;