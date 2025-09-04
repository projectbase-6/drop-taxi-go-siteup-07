import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Car, 
  MapPin, 
  Clock, 
  Phone, 
  Navigation, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  User,
  Calendar
} from 'lucide-react';
import { useBookings } from '@/hooks/useBookings';

interface BookingStatusProps {
  bookingId?: string;
}

const EnhancedBookingStatus: React.FC<BookingStatusProps> = ({ bookingId }) => {
  const { data: bookings = [] } = useBookings();
  const [selectedBooking, setSelectedBooking] = useState(bookings[0]);
  const [progress, setProgress] = useState(0);

  // Simulate real-time progress for demo
  useEffect(() => {
    if (selectedBooking?.status === 'in-progress') {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 5;
          return newProgress > 100 ? 100 : newProgress;
        });
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [selectedBooking]);

  useEffect(() => {
    if (bookingId) {
      const booking = bookings.find(b => b.id === bookingId);
      if (booking) setSelectedBooking(booking);
    } else if (bookings.length > 0) {
      setSelectedBooking(bookings[0]);
    }
  }, [bookingId, bookings]);

  if (!selectedBooking) return null;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: Clock,
          iconColor: 'text-yellow-600',
          message: 'Searching for nearby drivers...',
          progress: 25
        };
      case 'confirmed':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: CheckCircle2,
          iconColor: 'text-blue-600',
          message: 'Driver assigned and on the way!',
          progress: 50
        };
      case 'in-progress':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: Navigation,
          iconColor: 'text-green-600',
          message: 'Your ride is in progress',
          progress: progress
        };
      case 'completed':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: CheckCircle2,
          iconColor: 'text-green-600',
          message: 'Trip completed successfully!',
          progress: 100
        };
      case 'cancelled':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: AlertCircle,
          iconColor: 'text-red-600',
          message: 'Booking cancelled',
          progress: 0
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: Clock,
          iconColor: 'text-gray-600',
          message: 'Processing...',
          progress: 0
        };
    }
  };

  const statusConfig = getStatusConfig(selectedBooking.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <Card className="border-2 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <StatusIcon className={`h-6 w-6 ${statusConfig.iconColor}`} />
              <span>Booking Status</span>
            </CardTitle>
            <Badge className={statusConfig.color}>
              {selectedBooking.status.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{statusConfig.message}</p>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(statusConfig.progress)}%</span>
            </div>
            <Progress value={statusConfig.progress} className="h-2" />
          </div>

          {/* Trip Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Pickup</p>
                  <p className="text-sm text-muted-foreground">{selectedBooking.pickup_location}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-red-600" />
                <div>
                  <p className="text-sm font-medium">Destination</p>
                  <p className="text-sm text-muted-foreground">{selectedBooking.destination}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Date & Time</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedBooking.pickup_date} at {selectedBooking.pickup_time}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="text-sm font-medium">Passenger</p>
                  <p className="text-sm text-muted-foreground">{selectedBooking.passenger_name}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Driver Information (when assigned) */}
      {(selectedBooking.status === 'confirmed' || selectedBooking.status === 'in-progress') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Car className="h-5 w-5" />
              <span>Driver Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {selectedBooking.driver_name ? selectedBooking.driver_name.charAt(0) : 'D'}
                </div>
                <div>
                  <p className="font-semibold">{selectedBooking.driver_name || 'Driver Assigned'}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedBooking.driver_phone || '+91 98XXX XXXXX'}
                  </p>
                  <div className="flex items-center space-x-1 mt-1">
                    <div className="flex text-yellow-400">
                      {'★'.repeat(5)}
                    </div>
                    <span className="text-sm text-muted-foreground">4.9</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Button size="sm" className="w-full">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Driver
                </Button>
                <Button size="sm" variant="outline" className="w-full">
                  <Navigation className="h-4 w-4 mr-2" />
                  Track Live
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fare Information */}
      <Card>
        <CardHeader>
          <CardTitle>Fare Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Base Fare</span>
              <span>₹50.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Distance ({selectedBooking.distance_km || 'TBD'} km)</span>
              <span>₹{((selectedBooking.distance_km || 10) * 12).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time Charges</span>
              <span>₹40.00</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total Fare</span>
                <span className="text-primary">₹{(Number(selectedBooking.estimated_fare) || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {selectedBooking.status === 'pending' && (
        <div className="space-y-2">
          <Button variant="destructive" className="w-full">
            Cancel Booking
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Free cancellation within 5 minutes
          </p>
        </div>
      )}
    </div>
  );
};

export default EnhancedBookingStatus;