import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Car, MapPin, Clock, Phone, MessageCircle, ArrowLeft } from 'lucide-react';
import { useDistanceCalculation } from '@/hooks/useDistanceCalculation';
import { useFareCalculation } from '@/hooks/useFareCalculation';

const BookingConfirmation: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showReceiptAnimation, setShowReceiptAnimation] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const receiptBtnRef = useRef<HTMLButtonElement | null>(null);
  const [introPos, setIntroPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [introAnimating, setIntroAnimating] = useState(false);
  const [highlightReceipt, setHighlightReceipt] = useState(false);
  const { calculateDuration, calculateDaysBetween } = useFareCalculation();

  // Extract booking details from URL parameters
  const bookingDetails = {
    id: searchParams.get('id') || '',
    pickup_location: searchParams.get('pickup') || '',
    destination: searchParams.get('destination') || '',
    pickup_date: searchParams.get('date') || '',
    pickup_time: searchParams.get('time') || '',
    passenger_name: searchParams.get('name') || '',
    passenger_phone: searchParams.get('phone') || '',
    passenger_email: searchParams.get('email') || '',
    estimated_fare: Number(searchParams.get('fare')) || 0,
    vehicle_type: searchParams.get('vehicle') || '',
    distance_km: Number(searchParams.get('distance')) || 0,
    trip_type: searchParams.get('tripType') || 'one-way',
    return_date: searchParams.get('returnDate') || ''
  };

  // Calculate distance and duration
  const { calculateDistance } = useDistanceCalculation();
  const [tripDuration, setTripDuration] = useState<string>('Calculating...');

  // Calculate trip duration when component mounts
  useEffect(() => {
    // For multi-day trips, calculate based on dates
    if (bookingDetails.return_date && (bookingDetails.trip_type === 'round-trip' || bookingDetails.trip_type === 'hourly')) {
      const duration = calculateDuration(
        bookingDetails.pickup_date,
        bookingDetails.return_date,
        0
      );
      setTripDuration(duration);
      return;
    }
    
    // For single day trips, calculate based on distance
    if (bookingDetails.pickup_location && bookingDetails.destination) {
      calculateDistance(bookingDetails.pickup_location, bookingDetails.destination)
        .then((result) => {
          if (result.status === 'success' && result.duration > 0) {
            const duration = calculateDuration(undefined, undefined, result.duration);
            setTripDuration(duration);
          } else {
            setTripDuration('Duration unavailable');
          }
        })
        .catch(() => {
          setTripDuration('Duration unavailable');
        });
    }
  }, [bookingDetails.pickup_location, bookingDetails.destination, bookingDetails.pickup_date, bookingDetails.return_date, bookingDetails.trip_type, calculateDistance, calculateDuration]);

  useEffect(() => {
    if (!receiptBtnRef.current) return;
    const target = receiptBtnRef.current;
    const startX = window.innerWidth / 2 - target.offsetWidth / 2;
    const startY = window.innerHeight / 2 - target.offsetHeight / 2;
    setIntroPos({ x: startX, y: startY });
    requestAnimationFrame(() => {
      const rect = target.getBoundingClientRect();
      setIntroAnimating(true);
      setIntroPos({ x: rect.left, y: rect.top });
    });
  }, []);

  const handleGetReceipt = () => {
    // Show animation first
    setShowReceiptAnimation(true);
    
    // After animation completes, redirect to WhatsApp
    setTimeout(() => {
      // Format date properly
      const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
      };

      // Format time properly
      const formatTime = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
      };

      // Format journey type
      const formatJourneyType = () => {
        if (bookingDetails.trip_type === 'oneway') return 'One Way';
        if (bookingDetails.trip_type === 'roundtrip') return 'Round Trip';
        if (bookingDetails.trip_type === 'round-trip') return 'Round Trip';
        if (bookingDetails.trip_type === 'hourly') return 'Hourly Rental';
        return bookingDetails.trip_type;
      };

      // Calculate driver batta for multi-day trips
      const calculateDriverBatta = () => {
        if (bookingDetails.return_date && (bookingDetails.trip_type === 'round-trip' || bookingDetails.trip_type === 'hourly')) {
          const days = calculateDaysBetween(bookingDetails.pickup_date, bookingDetails.return_date);
          return 500 * days;
        }
        return 500;
      };

      const driverBatta = calculateDriverBatta();
      const receiptMessage = `🚖 *NEW BOOKING - RECEIPT REQUEST*

📋 *BOOKING DETAILS*
━━━━━━━━━━━━━━━━━━━━━
📌 *Booking ID:* ${bookingDetails.id.slice(0, 10).toUpperCase()}
👤 *Name:* ${bookingDetails.passenger_name}
✉️ *Email ID:* ${bookingDetails.passenger_email || 'NA'}
📱 *Phone:* ${bookingDetails.passenger_phone}

📍 *JOURNEY INFORMATION*
━━━━━━━━━━━━━━━━━━━━━
🚩 *Pickup Location:* ${bookingDetails.pickup_location}
🏁 *Drop Location:* ${bookingDetails.destination}
🚗 *Vehicle Type:* ${bookingDetails.vehicle_type.toUpperCase()}
🎯 *Journey Type:* ${formatJourneyType()}

📅 *TRAVEL SCHEDULE*
━━━━━━━━━━━━━━━━━━━━━
📆 *Travel Date:* ${formatDate(bookingDetails.pickup_date)}
⏰ *Travel Time:* ${formatTime(bookingDetails.pickup_time)}
⏱️ *Trip Duration:* ${tripDuration} (Approx)

💰 *FARE DETAILS*
━━━━━━━━━━━━━━━━━━━━━
📏 *Trip Distance:* ${bookingDetails.distance_km || 'TBD'} KM
💵 *Trip Estimation:* ₹${bookingDetails.estimated_fare}.00
📊 *Extra Per KM:* ₹19.00
👨‍✈️ *Driver Batta:* ₹${driverBatta} (included)
🔺 *Above 400 KM:* ₹300 Extra

⚠️ *ADDITIONAL CHARGES*
━━━━━━━━━━━━━━━━━━━━━
• Toll Gate Charges Extra
• Permit Charges Extra  
• Hill Station Charges Extra

✅ *ACTION REQUIRED:*
Please assign driver and confirm booking.

📞 *Support:* 7305305111`;

      // Use wa.me API which works universally and doesn't get blocked
      const phoneNumber = '917305305111';
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(receiptMessage)}`;
      
      // Open WhatsApp using wa.me API that works on all devices
      window.open(whatsappUrl, '_blank');
      
      setShowReceiptAnimation(false);
    }, 300);
  };

  const handleCallSupport = () => {
    window.location.href = 'tel:+917305305111';
  };

  // If no booking ID, redirect to home
  if (!bookingDetails.id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-2">No Booking Found</h2>
            <p className="text-gray-600 mb-4">We couldn't find your booking details.</p>
            <Button onClick={() => navigate('/')} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4 relative">
      {/* Receipt Animation Popup */}
      {showReceiptAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg border animate-scale-in">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 text-primary mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Generating Receipt...</h3>
              <p className="text-sm text-gray-600">Redirecting to WhatsApp for your booking receipt</p>
              <div className="mt-4">
                <div className="animate-pulse bg-primary/20 h-2 rounded-full w-32 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {showIntro && (
        <div className="fixed inset-0 z-40 pointer-events-none">
          <div
            className="absolute"
            style={{ transform: `translate3d(${introPos.x}px, ${introPos.y}px, 0)`, transition: introAnimating ? 'transform 1200ms cubic-bezier(0.22,1,0.36,1)' : 'none' }}
            onTransitionEnd={() => {
              if (introAnimating) {
                setShowIntro(false);
                setHighlightReceipt(true);
                setTimeout(() => setHighlightReceipt(false), 500); // Reduced from 2000ms to 500ms
                handleGetReceipt();
              }
            }}
          >
            <Button variant="outline" size="sm" className="pointer-events-none">
              <MessageCircle className="h-3 w-3 mr-2" />
              Get Receipt
            </Button>
          </div>
        </div>
      )}
      
      <div className="max-w-xl mx-auto w-full">
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
                  <span className="text-gray-600 flex items-center text-sm">
                    <Clock className="h-3 w-3 mr-1" />
                    Trip Duration:
                  </span>
                  <span className="font-semibold text-sm">{tripDuration}</span>
                </div>
                
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
                onClick={() => navigate('/')}
                className="w-full bg-primary hover:bg-primary/90"
              >
                Book Another Ride
              </Button>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  size="sm"
                  onClick={handleCallSupport}
                >
                  <Phone className="h-3 w-3 mr-2" />
                  Call Support
                </Button>
                <Button 
                  variant="outline" 
                  className={`flex-1 ${highlightReceipt ? 'pulse' : ''}`} 
                  size="sm"
                  onClick={handleGetReceipt}
                  ref={receiptBtnRef}
                >
                  <MessageCircle className="h-3 w-3 mr-2" />
                  Get Receipt
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingConfirmation;