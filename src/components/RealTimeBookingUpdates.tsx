import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Car, MapPin, Clock, TrendingUp, Users } from 'lucide-react';
import { useBookings, useUpdateBooking } from '@/hooks/useBookings';
import { useToast } from '@/hooks/use-toast';

const RealTimeBookingUpdates = () => {
  const { data: bookings = [], isLoading } = useBookings();
  const updateBooking = useUpdateBooking();
  const { toast } = useToast();
  const [recentUpdates, setRecentUpdates] = useState<string[]>([]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const pendingBookings = bookings.filter(b => b.status === 'pending');
      if (pendingBookings.length > 0 && Math.random() > 0.7) {
        const randomBooking = pendingBookings[Math.floor(Math.random() * pendingBookings.length)];
        const newStatus = Math.random() > 0.5 ? 'confirmed' : 'in-progress';
        
        updateBooking.mutate({
          id: randomBooking.id,
          status: newStatus,
          driver_name: newStatus === 'confirmed' ? 'Rajesh Kumar' : randomBooking.driver_name,
          driver_phone: newStatus === 'confirmed' ? '+91 98765 43210' : randomBooking.driver_phone,
        });

        const updateMessage = `Booking ${randomBooking.id.slice(0, 8)} status updated to ${newStatus}`;
        setRecentUpdates(prev => [updateMessage, ...prev.slice(0, 4)]);
        
        toast({
          title: "Booking Update",
          description: updateMessage,
        });
      }
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, [bookings, updateBooking, toast]);

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

  const handleStatusUpdate = (bookingId: string, newStatus: string) => {
    updateBooking.mutate({
      id: bookingId,
      status: newStatus,
      ...(newStatus === 'confirmed' && {
        driver_name: 'Amit Sharma',
        driver_phone: '+91 98765 43210'
      })
    });
  };

  // Real-time stats
  const stats = {
    active: bookings.filter(b => b.status === 'in-progress' || b.status === 'confirmed').length,
    pending: bookings.filter(b => b.status === 'pending').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    revenue: bookings.filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + (Number(b.actual_fare) || Number(b.estimated_fare) || 0), 0)
  };

  return (
    <div className="space-y-6">
      {/* Real-time Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Car className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Active Rides</p>
                <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold text-purple-600">₹{stats.revenue.toFixed(0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Updates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Recent Updates</span>
            <Badge variant="secondary">{recentUpdates.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentUpdates.length > 0 ? (
            <div className="space-y-2">
              {recentUpdates.map((update, index) => (
                <div key={index} className="p-3 bg-muted rounded-lg text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span>{update}</span>
                    <span className="text-xs text-muted-foreground ml-auto">Just now</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">No recent updates</p>
          )}
        </CardContent>
      </Card>

      {/* Live Bookings Management */}
      <Card>
        <CardHeader>
          <CardTitle>Live Booking Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bookings.slice(0, 5).map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status}
                  </Badge>
                  <div>
                    <p className="font-medium">{booking.passenger_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.pickup_location} → {booking.destination}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-primary">₹{(Number(booking.estimated_fare) || 0).toFixed(0)}</span>
                  {booking.status === 'pending' && (
                    <div className="flex space-x-1">
                      <Button 
                        size="sm" 
                        onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                        disabled={updateBooking.isPending}
                      >
                        Assign
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                        disabled={updateBooking.isPending}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                  {booking.status === 'confirmed' && (
                    <Button 
                      size="sm"
                      onClick={() => handleStatusUpdate(booking.id, 'in-progress')}
                      disabled={updateBooking.isPending}
                    >
                      Start Trip
                    </Button>
                  )}
                  {booking.status === 'in-progress' && (
                    <Button 
                      size="sm"
                      onClick={() => handleStatusUpdate(booking.id, 'completed')}
                      disabled={updateBooking.isPending}
                    >
                      Complete
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeBookingUpdates;