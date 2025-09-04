
import React, { useState } from 'react';
import { Car, MapPin, Clock, Star, User, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import BookingForm from '@/components/BookingForm';
import { useToast } from '@/hooks/use-toast';
import { useBookings } from '@/hooks/useBookings';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('book');
  const { toast } = useToast();
  const { data: bookings = [], isLoading } = useBookings();

  // Filter bookings for current user (in a real app, you'd filter by user ID)
  const recentRides = bookings
    .filter(booking => booking.status === 'completed')
    .slice(0, 3)
    .map(booking => ({
      id: booking.id,
      from: booking.pickup_location,
      to: booking.destination,
      date: booking.pickup_date,
      time: booking.pickup_time,
      fare: `₹${(Number(booking.actual_fare) || Number(booking.estimated_fare) || 0).toFixed(2)}`,
      status: booking.status,
      rating: 5 // Mock rating
    }));

  const upcomingRides = bookings
    .filter(booking => booking.status === 'confirmed' || booking.status === 'pending')
    .slice(0, 2)
    .map(booking => ({
      id: booking.id,
      from: booking.pickup_location,
      to: booking.destination,
      date: booking.pickup_date,
      time: booking.pickup_time,
      fare: `₹${(Number(booking.estimated_fare) || 0).toFixed(2)}`,
      status: booking.status
    }));

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">TaxiBook</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-gray-500">droptaxigo06@gmail.com</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8 w-fit">
          <Button
            variant={activeTab === 'book' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('book')}
            className="px-6"
          >
            Book a Ride
          </Button>
          <Button
            variant={activeTab === 'rides' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('rides')}
            className="px-6"
          >
            My Rides
          </Button>
          <Button
            variant={activeTab === 'profile' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('profile')}
            className="px-6"
          >
            Profile
          </Button>
        </div>

        {/* Content */}
        {activeTab === 'book' && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Book Your Ride</h2>
            <BookingForm />
          </div>
        )}

        {activeTab === 'rides' && (
          <div className="space-y-8">
            {/* Upcoming Rides */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Upcoming Rides</h2>
              {upcomingRides.length > 0 ? (
                <div className="grid gap-4">
                  {upcomingRides.map((ride) => (
                    <Card key={ride.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Clock className="h-4 w-4" />
                              <span>{ride.date} at {ride.time}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-green-600" />
                              <span className="font-medium">{ride.from}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-red-600" />
                              <span className="font-medium">{ride.to}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="secondary">
                              {ride.status === 'pending' ? 'Pending' : 'Confirmed'}
                            </Badge>
                            <p className="text-lg font-bold text-gray-800 mt-2">{ride.fare}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No upcoming rides scheduled</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Recent Rides */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Rides</h2>
              {recentRides.length > 0 ? (
                <div className="grid gap-4">
                  {recentRides.map((ride) => (
                    <Card key={ride.id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Clock className="h-4 w-4" />
                              <span>{ride.date} at {ride.time}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-green-600" />
                              <span className="font-medium">{ride.from}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-red-600" />
                              <span className="font-medium">{ride.to}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < ride.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge>Completed</Badge>
                            <p className="text-lg font-bold text-gray-800 mt-2">{ride.fare}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No recent rides found</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Settings</h2>
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Manage your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <Button variant="outline">Change Photo</Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="John" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Doe" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="droptaxigo06@gmail.com" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                </div>
                <Button className="w-full">Save Changes</Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
