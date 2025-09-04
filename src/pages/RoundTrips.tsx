import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navigation, ArrowLeft, MapPin, Clock, Route, Star, Shield, CreditCard, CheckCircle, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
const RoundTrips = () => {
  const navigate = useNavigate();
  const benefits = ["Up to 20% savings compared to two one-way trips", "Same vehicle for entire journey", "Driver waiting time included in package", "Flexible return timing within package duration", "Priority booking and dedicated support", "No separate booking needed for return", "Cost-effective for return journeys", "Professional drivers familiar with your route"];
  const packages = [{
    name: "Day Package",
    duration: "8 hours / 80 km",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80",
    features: ["8 hours duration", "80 km included", "Driver allowance included", "Multiple stops allowed"],
    vehicles: {
      sedan: "₹1,800",
      suv: "₹2,400",
      innova: "₹2,800"
    },
    ideal: "City tours, shopping, business meetings"
  }, {
    name: "Outstation Package",
    duration: "2 days / 300 km",
    image: "https://images.unsplash.com/photo-1593950315186-76a92975b60c?auto=format&fit=crop&w=800&q=80",
    features: ["2 days coverage", "300 km included", "Driver accommodation", "Flexible itinerary"],
    vehicles: {
      sedan: "₹5,200",
      suv: "₹6,800",
      innova: "₹7,600"
    },
    ideal: "Weekend getaways, hill station trips"
  }, {
    name: "Extended Package",
    duration: "3 days / 500 km",
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80",
    features: ["3 days coverage", "500 km included", "All driver expenses", "Custom itinerary"],
    vehicles: {
      sedan: "₹8,500",
      suv: "₹11,200",
      innova: "₹12,800"
    },
    ideal: "Long vacations, family trips, pilgrimages"
  }];
  const popularDestinations = [{
    name: "Chennai - Ooty - Chennai",
    duration: "2 days",
    distance: "920 km",
    image: "/lovable-uploads/3e0f30ee-8eba-4d39-8a3c-5221db915df6.png",
    highlights: ["Hill station beauty", "Tea gardens", "Pleasant weather"],
    startingPrice: "₹5,800"
  }, {
    name: "Bangalore - Mysore - Bangalore",
    duration: "1 day",
    distance: "290 km",
    image: "/lovable-uploads/8891dcfd-7f3f-48af-a6db-fc96924d017e.png",
    highlights: ["Royal palace", "Historic sites", "Same day return"],
    startingPrice: "₹2,200"
  }, {
    name: "Chennai - Pondicherry - Chennai",
    duration: "1 day",
    distance: "325 km",
    image: "/lovable-uploads/cd31a30e-16e2-43bf-971a-8abcea4442bf.png",
    highlights: ["French architecture", "Beaches", "Day trip perfect"],
    startingPrice: "₹2,500"
  }, {
    name: "Coimbatore - Kodaikanal - Coimbatore",
    duration: "2 days",
    distance: "480 km",
    image: "/lovable-uploads/e7d7c699-95b6-4fd7-bbbd-49ab107b2639.png",
    highlights: ["Lake views", "Cool climate", "Scenic beauty"],
    startingPrice: "₹4,200"
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
            <Button variant="outline" onClick={() => navigate(-1)} className="border-black/30 hover:bg- text-slate-950">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-16 bg-cover bg-center bg-no-repeat text-white" style={{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/lovable-uploads/5330d5f4-09c6-4516-8937-ecccf41ffc7e.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
        <div className="container mx-auto px-4 text-center">
          <Navigation className="h-16 w-16 mx-auto mb-6 text-white" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Round Trip Packages</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
            Best value for return journeys with special discounts and dedicated service. 
            Perfect for weekend getaways, business trips, and family vacations across South India.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="inline-flex items-center bg-white/20 rounded-full px-6 py-3">
              <Percent className="h-5 w-5 mr-2" />
              <span className="font-semibold">Save up to 20% on Return Trips</span>
            </div>
            <div className="inline-flex items-center bg-white/20 rounded-full px-6 py-3">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span className="font-semibold">Same Vehicle • Driver Waiting</span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Round Trip Packages?</h2>
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
              <div>
                <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80" alt="Round trip taxi service" className="rounded-lg w-full h-80 object-cover shadow-lg" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-6">Package Benefits</h3>
                <ul className="space-y-3">
                  {benefits.map((benefit, index) => <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>)}
                </ul>
              </div>
            </div>
            
            {/* Additional Images Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <img src="/lovable-uploads/1fb70b40-331c-41da-b0b9-e3b303795b92.png" alt="Professional taxi driver" className="rounded-lg w-full h-48 object-cover shadow-md mb-4" />
                <h4 className="font-semibold text-lg mb-2">Professional Drivers</h4>
                <p className="text-gray-600">Experienced and courteous drivers who know the routes well</p>
              </div>
              <div className="text-center">
                <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80" alt="Scenic mountain road trip" className="rounded-lg w-full h-48 object-cover shadow-md mb-4" />
                <h4 className="font-semibold text-lg mb-2">Scenic Routes</h4>
                <p className="text-gray-600">Enjoy beautiful landscapes and comfortable journeys</p>
              </div>
              <div className="text-center">
                <img src="/lovable-uploads/9219b7dc-c2df-497f-ab03-41a58464cffb.png" alt="Family enjoying car travel" className="rounded-lg w-full h-48 object-cover shadow-md mb-4" />
                <h4 className="font-semibold text-lg mb-2">Family Comfort</h4>
                <p className="text-gray-600">Spacious vehicles perfect for family trips and group travel</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Package Types Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Choose Your Round Trip Package</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packages.map((pkg, index) => <Card key={index} className="hover:shadow-xl transition-shadow">
                <CardContent className="p-0">
                  <img src={pkg.image} alt={pkg.name} className="w-full h-48 object-cover rounded-t-lg" />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
                    <p className="text-orange-600 font-semibold mb-4">{pkg.duration}</p>
                    
                    <div className="space-y-2 mb-4">
                      {pkg.features.map((feature, idx) => <div key={idx} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </div>)}
                    </div>

                    <div className="border-t pt-4 mb-4">
                      <h4 className="font-semibold mb-2">Starting Prices:</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Sedan:</span>
                          <span className="font-semibold">{pkg.vehicles.sedan}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>SUV:</span>
                          <span className="font-semibold">{pkg.vehicles.suv}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Innova:</span>
                          <span className="font-semibold">{pkg.vehicles.innova}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 mb-4">Ideal for: {pkg.ideal}</p>
                    
                    <Button className="w-full bg-green-500 hover:bg-green-600">
                      Book {pkg.name}
                    </Button>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Popular Destinations Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Round Trip Destinations</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {popularDestinations.map((destination, index) => <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-0">
                  <img src={destination.image} alt={destination.name} className="w-full h-40 object-cover rounded-t-lg" />
                  <div className="p-4">
                    <h3 className="font-bold text-sm mb-2">{destination.name}</h3>
                    <div className="flex justify-between text-xs text-gray-500 mb-3">
                      <span>{destination.duration}</span>
                      <span>{destination.distance}</span>
                    </div>
                    <ul className="text-xs text-gray-600 mb-3 space-y-1">
                      {destination.highlights.map((highlight, idx) => <li key={idx} className="flex items-center space-x-1">
                          <span className="w-1 h-1 bg-orange-400 rounded-full"></span>
                          <span>{highlight}</span>
                        </li>)}
                    </ul>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-green-600">{destination.startingPrice}</span>
                      <Button size="sm" variant="outline" className="text-xs h-7">
                        Book Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How Round Trip Booking Works</h2>
          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MapPin className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-bold mb-2">1. Select Package</h3>
              <p className="text-gray-600 text-sm">Choose package duration and enter your travel details</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Navigation className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-bold mb-2">2. Plan Itinerary</h3>
              <p className="text-gray-600 text-sm">Customize your trip with multiple stops and timings</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CreditCard className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-bold mb-2">3. Confirm & Pay</h3>
              <p className="text-gray-600 text-sm">Review package details and make secure payment</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-bold mb-2">4. Enjoy Journey</h3>
              <p className="text-gray-600 text-sm">Travel comfortably with same vehicle for entire trip</p>
            </div>
          </div>
        </div>
      </section>

      {/* Extra Content: Trip Highlights & Tips */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Round Trip Travel Highlights</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Flexible Itineraries</h3>
                <p className="text-gray-600">Plan multiple stops and customize timings within your package.</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Same Vehicle Comfort</h3>
                <p className="text-gray-600">Enjoy the convenience of the same vehicle and driver throughout.</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Great Savings</h3>
                <p className="text-gray-600">Save up to 20% compared to booking two separate one-way trips.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-500 to-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Book Your Round Trip?</h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Save money with our round trip packages and enjoy hassle-free return journeys 
            with the same vehicle and driver throughout your trip.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                Book Round Trip Package
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="border-white hover:bg-green px-8 py-3 text-lg text-green-600">
                Custom Package Quote
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>;
};
export default RoundTrips;