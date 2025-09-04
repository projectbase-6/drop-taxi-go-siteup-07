import React, { useState } from 'react';
import { Car, MapPin, Clock, Phone, Star, Navigation, CreditCard, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBookings } from '@/hooks/useBookings';
import { useIsMobile } from '@/hooks/use-mobile';
import EnhancedBookingForm from '@/components/EnhancedBookingForm';
import MobileBookingForm from '@/components/MobileBookingForm';
import EnhancedBookingStatus from '@/components/EnhancedBookingStatus';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('book');
  const { data: bookings = [] } = useBookings();
  const isMobile = useIsMobile();

  // Get user's recent bookings (mock user filter for demo)
  const userBookings = bookings.slice(0, 5);
  const activeBooking = userBookings.find(b => b.status === 'confirmed' || b.status === 'in-progress');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Mobile-First Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Car className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">TaxiBook</h1>
                <p className="text-xs text-gray-500">Welcome back!</p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Support</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Active Booking Alert */}
        {activeBooking && (
          <Card className="mb-6 border-l-4 border-l-blue-500 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <div>
                    <p className="font-medium text-blue-800">Active Booking</p>
                    <p className="text-sm text-blue-600">
                      {activeBooking.pickup_location} → {activeBooking.destination}
                    </p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => setActiveTab('status')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Track
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mobile Tab Navigation */}
        <div className="flex space-x-1 bg-white p-1 rounded-lg mb-6 shadow-sm overflow-x-auto">
          <Button
            variant={activeTab === 'book' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('book')}
            className="px-4 py-2 text-sm whitespace-nowrap"
          >
            <Car className="h-4 w-4 mr-2" />
            Book Ride
          </Button>
          <Button
            variant={activeTab === 'status' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('status')}
            className="px-4 py-2 text-sm whitespace-nowrap"
          >
            <Navigation className="h-4 w-4 mr-2" />
            Track
          </Button>
          <Button
            variant={activeTab === 'history' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('history')}
            className="px-4 py-2 text-sm whitespace-nowrap"
          >
            <History className="h-4 w-4 mr-2" />
            History
          </Button>
        </div>

        {/* Book Ride Tab */}
        {activeTab === 'book' && (
          <div className="space-y-6">
            {isMobile ? <MobileBookingForm /> : <EnhancedBookingForm />}
          </div>
        )}

        {/* Track Status Tab */}
        {activeTab === 'status' && (
          <div className="space-y-6">
            {activeBooking ? (
              <EnhancedBookingStatus bookingId={activeBooking.id} />
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Navigation className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No Active Bookings</h3>
                  <p className="text-gray-500 mb-4">You don't have any active rides to track</p>
                  <Button onClick={() => setActiveTab('book')}>
                    Book a Ride
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Ride History</h2>
              <Badge variant="secondary">{userBookings.length} trips</Badge>
            </div>

            {userBookings.length > 0 ? (
              <div className="space-y-4">
                {userBookings.map((booking) => (
                  <Card key={booking.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status.toUpperCase()}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {booking.pickup_date}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-3">
                        <div className="flex items-start space-x-2">
                          <MapPin className="h-4 w-4 text-green-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">From</p>
                            <p className="text-sm text-gray-600">{booking.pickup_location}</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <MapPin className="h-4 w-4 text-red-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">To</p>
                            <p className="text-sm text-gray-600">{booking.destination}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="text-lg font-bold text-primary">
                            ₹{(Number(booking.estimated_fare) || 0).toFixed(0)}
                          </span>
                          {booking.status === 'completed' && (
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="text-sm text-gray-600">4.8</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex space-x-2">
                          {booking.status === 'completed' && (
                            <Button size="sm" variant="outline">
                              <Star className="h-4 w-4 mr-1" />
                              Rate
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            Rebook
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No Ride History</h3>
                  <p className="text-gray-500 mb-4">Start your journey with your first booking</p>
                  <Button onClick={() => setActiveTab('book')}>
                    Book Your First Ride
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Quick Actions FAB for Mobile */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <Button 
          size="lg" 
          className="w-14 h-14 rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          onClick={() => setActiveTab('book')}
        >
          <Car className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default UserDashboard;