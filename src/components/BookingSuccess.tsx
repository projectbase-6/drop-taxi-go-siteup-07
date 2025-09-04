
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Car, MapPin, Clock, Phone, Mail } from 'lucide-react';

interface BookingSuccessProps {
  bookingDetails: {
    id: string;
    pickup_location: string;
    destination: string;
    pickup_date: string;
    pickup_time: string;
    passenger_name: string;
    passenger_phone: string;
    estimated_fare: number;
    vehicle_type?: string;
  };
  onNewBooking: () => void;
}

const BookingSuccess: React.FC<BookingSuccessProps> = ({ 
  bookingDetails, 
  onNewBooking 
}) => {
  return (
    <div className="max-w-xl mx-auto">
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4 text-center">
          <div className="mb-4">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-1">
              Booking Confirmed!
            </h2>
            <p className="text-green-700 text-sm">
              Your ride has been successfully booked
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 mb-4 text-left">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center text-sm">
              <Car className="h-4 w-4 mr-2" />
              Booking Details
            </h3>
            
            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-600 text-sm">Booking ID:</span>
                <span className="font-semibold text-primary text-sm">
                  #{bookingDetails.id.slice(0, 8).toUpperCase()}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <MapPin className="h-3 w-3 text-green-600 mt-1" />
                  <div>
                    <span className="text-xs text-gray-500">Pickup:</span>
                    <p className="font-medium text-sm">{bookingDetails.pickup_location}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <MapPin className="h-3 w-3 text-red-600 mt-1" />
                  <div>
                    <span className="text-xs text-gray-500">Destination:</span>
                    <p className="font-medium text-sm">{bookingDetails.destination}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-600 flex items-center text-sm">
                  <Clock className="h-3 w-3 mr-1" />
                  Date & Time:
                </span>
                <span className="font-semibold text-sm">
                  {bookingDetails.pickup_date} at {bookingDetails.pickup_time}
                </span>
              </div>
              
              {bookingDetails.vehicle_type && (
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-600 flex items-center text-sm">
                    <Car className="h-3 w-3 mr-1" />
                    Vehicle:
                  </span>
                  <span className="font-semibold text-sm">{bookingDetails.vehicle_type}</span>
                </div>
              )}
              
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-600 text-sm">Passenger:</span>
                <span className="font-semibold text-sm">{bookingDetails.passenger_name}</span>
              </div>
              
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-600 flex items-center text-sm">
                  <Phone className="h-3 w-3 mr-1" />
                  Phone:
                </span>
                <span className="font-semibold text-sm">{bookingDetails.passenger_phone}</span>
              </div>
              
              <div className="flex justify-between py-2 bg-primary/10 rounded px-3">
                <span className="text-primary font-semibold text-sm">Estimated Fare:</span>
                <span className="text-xl font-bold text-primary">
                  ₹{bookingDetails.estimated_fare}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-3 mb-4 text-left">
            <h4 className="font-semibold text-blue-800 mb-2 text-sm">What's Next?</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• You'll receive a confirmation SMS shortly</li>
              <li>• Driver details will be shared 30 minutes before pickup</li>
              <li>• You can track your ride in real-time</li>
              <li>• For any changes, call us at +91 7305305111</li>
            </ul>
          </div>

          <div className="space-y-2">
            <Button 
              onClick={onNewBooking}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Book Another Ride
            </Button>
            
            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1" size="sm">
                <Phone className="h-3 w-3 mr-2" />
                Call Support
              </Button>
              <Button variant="outline" className="flex-1" size="sm">
                <Mail className="h-3 w-3 mr-2" />
                Email Receipt
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingSuccess;
