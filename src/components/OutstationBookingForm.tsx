import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, ArrowRightLeft } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LocationAutocomplete from './LocationAutocomplete';

const OutstationBookingForm = () => {
  const [activeTab, setActiveTab] = useState('outstation-oneway');
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [departureDate, setDepartureDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [pickupTime, setPickupTime] = useState('');

  const swapLocations = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Card className="bg-white shadow-xl border-0 rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          {/* Tab Headers */}
          <div className="bg-white border-b border-gray-200">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-transparent rounded-none h-auto p-0 border-0">
                <TabsTrigger 
                  value="outstation-oneway" 
                  className={cn(
                    "relative px-6 py-4 rounded-none border-0 font-medium text-gray-600 hover:text-primary",
                    "data-[state=active]:text-primary data-[state=active]:bg-transparent",
                    "data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-primary"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    Outstation One-Way
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="outstation-roundtrip" 
                  className={cn(
                    "relative px-6 py-4 rounded-none border-0 font-medium text-gray-600 hover:text-primary",
                    "data-[state=active]:text-primary data-[state=active]:bg-transparent",
                    "data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-primary"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full border-2 border-gray-400"></div>
                    Outstation Round-Trip
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="airport-transfers" 
                  className={cn(
                    "relative px-6 py-4 rounded-none border-0 font-medium text-gray-600 hover:text-primary",
                    "data-[state=active]:text-primary data-[state=active]:bg-transparent",
                    "data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-primary"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full border-2 border-gray-400"></div>
                    Airport Transfers
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="hourly-rentals" 
                  className={cn(
                    "relative px-6 py-4 rounded-none border-0 font-medium text-gray-600 hover:text-primary",
                    "data-[state=active]:text-primary data-[state=active]:bg-transparent",
                    "data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-primary"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full border-2 border-gray-400"></div>
                    <span className="flex items-center gap-1">
                      Hourly Rentals
                      <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">new</span>
                    </span>
                  </div>
                </TabsTrigger>
              </TabsList>

              {/* Content for all tabs */}
              <TabsContent value="outstation-oneway" className="mt-0">
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    {/* From Location */}
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">From</Label>
                      <LocationAutocomplete
                        value={fromLocation}
                        onChange={setFromLocation}
                        placeholder="Mumbai"
                        className="h-12 text-lg font-semibold"
                      />
                    </div>

                    {/* Swap Button */}
                    <div className="flex justify-center pb-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={swapLocations}
                        className="p-2 hover:bg-gray-100 rounded-full"
                      >
                        <ArrowRightLeft className="h-4 w-4 text-gray-400" />
                      </Button>
                    </div>

                    {/* To Location */}
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">To</Label>
                      <LocationAutocomplete
                        value={toLocation}
                        onChange={setToLocation}
                        placeholder="Pune"
                        className="h-12 text-lg font-semibold"
                      />
                    </div>

                    {/* Departure Date */}
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Departure</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "h-12 justify-start text-left font-normal",
                              !departureDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            <div className="flex flex-col items-start">
                              <span className="text-sm font-semibold">
                                {departureDate ? format(departureDate, "d") : "1"}
                              </span>
                              <span className="text-xs text-gray-500">
                                {departureDate ? format(departureDate, "MMM'yy") : "Aug'25"}
                              </span>
                              <span className="text-xs text-gray-500">
                                {departureDate ? format(departureDate, "EEEE") : "Friday"}
                              </span>
                            </div>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={departureDate}
                            onSelect={setDepartureDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Pickup Time */}
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Pickup-Time</Label>
                      <Select value={pickupTime} onValueChange={setPickupTime}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="10:00">
                            <div className="flex flex-col items-start">
                              <span className="text-lg font-semibold">
                                {pickupTime || "10:00"}
                              </span>
                              <span className="text-xs text-gray-500">
                                {pickupTime ? (pickupTime.includes('AM') || pickupTime.includes('PM') ? '' : 'AM') : 'AM'}
                              </span>
                            </div>
                          </SelectValue>
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
                          <SelectItem value="19:00">07:00 PM</SelectItem>
                          <SelectItem value="20:00">08:00 PM</SelectItem>
                          <SelectItem value="21:00">09:00 PM</SelectItem>
                          <SelectItem value="22:00">10:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Add Stops */}
                  <div className="mt-4">
                    <Button variant="link" className="text-primary p-0 h-auto font-normal">
                      + Add Stops <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full ml-2">new</span>
                    </Button>
                  </div>

                  {/* Search Button */}
                  <div className="mt-6">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-lg font-semibold rounded-lg">
                      SEARCH
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="outstation-roundtrip" className="mt-0">
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                    {/* From Location */}
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">From</Label>
                      <LocationAutocomplete
                        value={fromLocation}
                        onChange={setFromLocation}
                        placeholder="Mumbai"
                        className="h-12 text-lg font-semibold"
                      />
                    </div>

                    {/* Swap Button */}
                    <div className="flex justify-center pb-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={swapLocations}
                        className="p-2 hover:bg-gray-100 rounded-full"
                      >
                        <ArrowRightLeft className="h-4 w-4 text-gray-400" />
                      </Button>
                    </div>

                    {/* To Location */}
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">To</Label>
                      <LocationAutocomplete
                        value={toLocation}
                        onChange={setToLocation}
                        placeholder="Pune"
                        className="h-12 text-lg font-semibold"
                      />
                    </div>

                    {/* Departure Date */}
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Departure</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "h-12 justify-start text-left font-normal",
                              !departureDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            <div className="flex flex-col items-start">
                              <span className="text-sm font-semibold">
                                {departureDate ? format(departureDate, "d") : "1"}
                              </span>
                              <span className="text-xs text-gray-500">
                                {departureDate ? format(departureDate, "MMM'yy") : "Aug'25"}
                              </span>
                              <span className="text-xs text-gray-500">
                                {departureDate ? format(departureDate, "EEEE") : "Friday"}
                              </span>
                            </div>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={departureDate}
                            onSelect={setDepartureDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Return Date */}
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Return</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "h-12 justify-start text-left font-normal",
                              !returnDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            <div className="flex flex-col items-start">
                              <span className="text-xs text-gray-500">
                                {returnDate ? "Return date" : "Tap to add a return date"}
                              </span>
                              <span className="text-xs text-gray-500">
                                {returnDate ? format(returnDate, "d MMM'yy") : "for bigger discounts"}
                              </span>
                            </div>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={returnDate}
                            onSelect={setReturnDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Pickup Time */}
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Pickup-Time</Label>
                      <Select value={pickupTime} onValueChange={setPickupTime}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="10:00">
                            <div className="flex flex-col items-start">
                              <span className="text-lg font-semibold">
                                {pickupTime || "10:00"}
                              </span>
                              <span className="text-xs text-gray-500">
                                {pickupTime ? (pickupTime.includes('AM') || pickupTime.includes('PM') ? '' : 'AM') : 'AM'}
                              </span>
                            </div>
                          </SelectValue>
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
                          <SelectItem value="19:00">07:00 PM</SelectItem>
                          <SelectItem value="20:00">08:00 PM</SelectItem>
                          <SelectItem value="21:00">09:00 PM</SelectItem>
                          <SelectItem value="22:00">10:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Add Stops */}
                  <div className="mt-4">
                    <Button variant="link" className="text-primary p-0 h-auto font-normal">
                      + Add Stops <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full ml-2">new</span>
                    </Button>
                  </div>

                  {/* Search Button */}
                  <div className="mt-6">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-lg font-semibold rounded-lg">
                      SEARCH
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="airport-transfers" className="mt-0">
                <div className="p-6 text-center text-gray-500">
                  Airport transfers booking form coming soon...
                </div>
              </TabsContent>

              <TabsContent value="hourly-rentals" className="mt-0">
                <div className="p-6 text-center text-gray-500">
                  Hourly rentals booking form coming soon...
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OutstationBookingForm;