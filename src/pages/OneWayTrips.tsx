import React from 'react';
import { Link } from 'react-router-dom';
import { Car, ArrowLeft, MapPin, Clock, Route, Star, Shield, CreditCard, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import experiencedDrivers from '@/assets/experienced-drivers.jpg';
import gpsNavigation from '@/assets/gps-navigation.jpg';
import taxiFleet from '@/assets/taxi-fleet.jpg';
const OneWayTrips = () => {
  const benefits = ["No return charges - pay only for your actual journey", "Transparent pricing with no hidden fees", "Professional and verified drivers", "Real-time GPS tracking for safety", "Multiple vehicle options to suit your needs", "Instant booking confirmation", "24/7 customer support", "Flexible pickup and drop locations"];
  const vehicleTypes = [{
    name: "Sedan",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80",
    capacity: "4 passengers",
    luggage: "2-3 bags",
    features: ["AC", "GPS", "Music System"],
    priceRange: "₹10-14/km"
  }, {
    name: "SUV",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80",
    capacity: "6-7 passengers",
    luggage: "4-5 bags",
    features: ["AC", "GPS", "Music System", "Extra Space"],
    priceRange: "₹14-18/km"
  }, {
    name: "Innova",
    image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=800&q=80",
    capacity: "7 passengers",
    luggage: "5-6 bags",
    features: ["AC", "GPS", "Music System", "Premium Comfort"],
    priceRange: "₹16-20/km"
  }];
  const popularRoutes = [{
    from: "Chennai",
    to: "Bangalore",
    distance: "347 km",
    price: "₹4,200"
  }, {
    from: "Chennai",
    to: "Coimbatore",
    distance: "507 km",
    price: "₹6,100"
  }, {
    from: "Bangalore",
    to: "Mysore",
    distance: "144 km",
    price: "₹1,700"
  }, {
    from: "Chennai",
    to: "Pondicherry",
    distance: "162 km",
    price: "₹1,950"
  }, {
    from: "Coimbatore",
    to: "Ooty",
    distance: "89 km",
    price: "₹1,100"
  }, {
    from: "Chennai",
    to: "Tirupati",
    distance: "138 km",
    price: "₹1,650"
  }];
  return <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-gray-900 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-3">
              <img src="/lovable-uploads/c9287985-6bd6-415a-9ed2-5cd34fe0be2d.png" alt="DropTaxi Logo" className="h-12 w-12" />
              <div>
                <h1 className="text-2xl font-bold">Drop Taxi Go</h1>
                <p className="text-sm opacity-80">Your Trusted Travel Partner</p>
              </div>
            </Link>
            <Link to="/services">
              <Button variant="outline" className="border-white/30 hover:bg-white text-slate-950">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Services
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <Car className="h-16 w-16 mx-auto mb-6 text-white" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">One-Way Taxi Trips</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
            Perfect for single journey needs with competitive pricing. No return charges, no hidden fees - 
            just transparent pricing for your one-way travel across South India.
          </p>
          <div className="inline-flex items-center bg-white/20 rounded-full px-6 py-3">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span className="font-semibold">Pay Only for Drop Trip • No Return Charges</span>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose One-Way Trips?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <img src="https://images.unsplash.com/photo-1563520240349-7bb19cd5b2ea?auto=format&fit=crop&w=800&q=80" alt="One-way taxi service" className="rounded-lg w-full h-64 object-cover shadow-lg" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-6">Key Benefits</h3>
                <ul className="space-y-3">
                  {benefits.map((benefit, index) => <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicle Types Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Choose Your Vehicle</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {vehicleTypes.map((vehicle, index) => <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <img src={vehicle.image} alt={vehicle.name} className="w-full h-48 object-cover rounded-t-lg" />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3">{vehicle.name}</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Capacity:</span>
                        <span className="font-semibold">{vehicle.capacity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Luggage:</span>
                        <span className="font-semibold">{vehicle.luggage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rate:</span>
                        <span className="font-semibold text-orange-600">{vehicle.priceRange}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {vehicle.features.map((feature, idx) => <span key={idx} className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                          {feature}
                        </span>)}
                    </div>
                    <Button className="w-full bg-orange-500 hover:bg-orange-600">
                      Book {vehicle.name}
                    </Button>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Popular Routes Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Popular One-Way Routes</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {popularRoutes.map((route, index) => <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{route.from}</h3>
                      <ArrowLeft className="h-4 w-4 text-gray-400 rotate-180 my-1" />
                      <h3 className="font-bold text-lg">{route.to}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-orange-600">{route.price}</div>
                      <div className="text-sm text-gray-500">{route.distance}</div>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    Book This Route
                  </Button>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How One-Way Booking Works</h2>
          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-orange-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MapPin className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-bold mb-2">1. Enter Details</h3>
              <p className="text-gray-600 text-sm">Enter pickup and drop locations with date and time</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Car className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-bold mb-2">2. Choose Vehicle</h3>
              <p className="text-gray-600 text-sm">Select from sedan, SUV, or Innova based on your needs</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CreditCard className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-bold mb-2">3. Confirm Booking</h3>
              <p className="text-gray-600 text-sm">Review fare and confirm your booking with payment</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-bold mb-2">4. Enjoy Trip</h3>
              <p className="text-gray-600 text-sm">Get picked up and enjoy your comfortable one-way journey</p>
            </div>
          </div>
        </div>
      </section>

      {/* Extra Content: Highlights */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Explore One-Way Trip Highlights</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <img src={experiencedDrivers} alt="Experienced professional drivers" loading="lazy" className="w-full h-48 object-cover rounded-t-lg" />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Experienced Drivers</h3>
                  <p className="text-gray-600">Background-verified drivers with deep route knowledge for smooth journeys.</p>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <img src={gpsNavigation} alt="Live GPS navigation for safety" loading="lazy" className="w-full h-48 object-cover rounded-t-lg" />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Live GPS Tracking</h3>
                  <p className="text-gray-600">Real-time tracking and optimized routes to reach faster and safer.</p>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <img src={taxiFleet} alt="Comfortable taxi fleet" loading="lazy" className="w-full h-48 object-cover rounded-t-lg" />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Comfortable Fleet</h3>
                  <p className="text-gray-600">Clean, well-maintained vehicles for a comfortable one-way ride.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-400 to-yellow-400">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Book Your One-Way Trip?</h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Get instant fare quotes and book your one-way taxi trip with just a few clicks. 
            No return charges, just transparent pricing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                Book One-Way Trip Now
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="border-white hover:bg-white px-8 py-3 text-lg text-orange-600">
                Get Quote
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>;
};
export default OneWayTrips;