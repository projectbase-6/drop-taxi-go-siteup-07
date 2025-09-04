import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Car, Shield, Star, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
const OutstationTrips = () => {
  const destinations = [{
    city: "Bangalore",
    distance: "345 km",
    duration: "6-7 hours",
    price: "₹4,500",
    image: "https://images.unsplash.com/photo-1572649395908-de711f0e3fe0?auto=format&fit=crop&w=800&q=80"
  }, {
    city: "Pondicherry",
    distance: "160 km",
    duration: "3-4 hours",
    price: "₹2,200",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80"
  }, {
    city: "Coimbatore",
    distance: "500 km",
    duration: "8-9 hours",
    price: "₹6,500",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80"
  }, {
    city: "Mysore",
    distance: "480 km",
    duration: "8-9 hours",
    price: "₹6,200",
    image: "https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?auto=format&fit=crop&w=800&q=80"
  }, {
    city: "Kochi",
    distance: "685 km",
    duration: "11-12 hours",
    price: "₹8,500",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80"
  }, {
    city: "Madurai",
    distance: "460 km",
    duration: "7-8 hours",
    price: "₹5,800",
    image: "https://images.unsplash.com/photo-1588417444966-afd59ab9291a?auto=format&fit=crop&w=800&q=80"
  }];
  const features = [{
    icon: Car,
    title: "Well-Maintained Fleet",
    description: "Modern, clean, and comfortable vehicles for long-distance travel"
  }, {
    icon: Shield,
    title: "Licensed Drivers",
    description: "Experienced, professional drivers with valid interstate permits"
  }, {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock customer support throughout your journey"
  }, {
    icon: Star,
    title: "Transparent Pricing",
    description: "No hidden charges, fixed rates with fuel and toll included"
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
            <Link to="/">
              <Button variant="outline" className="border-black-/30 hover:bg- text-slate-950">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-orange-400 to-yellow-400 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Outstation Trips</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Comfortable and safe long-distance travel across South India with transparent pricing
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Our Outstation Service?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience hassle-free interstate travel with our premium outstation taxi services
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return <Card key={index} className="text-center shadow-lg">
                  <CardHeader>
                    <div className="bg-orange-100 p-3 rounded-lg w-fit mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-orange-600" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>;
          })}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Popular Destinations from Chennai</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore popular outstation destinations with our comfortable and reliable taxi services
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((destination, index) => <Card key={index} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img src={destination.image} alt={destination.city} className="w-full h-48 object-cover" />
                  <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full font-semibold">
                    {destination.price}
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{destination.city}</h3>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-orange-500" />
                      <span>{destination.distance} from Chennai</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <span>{destination.duration} drive time</span>
                    </div>
                  </div>
                  <Link to="/">
                    <Button className="w-full mt-4 bg-gradient-to-r from-orange-400 to-yellow-400 text-white">
                      Book Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Travel Gallery */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Outstation Travel Gallery</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {['https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1529078155058-5d716f45d604?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=800&q=80'].map((src, idx) => <img key={idx} src={src} loading="lazy" alt={`Outstation travel scenic ${idx + 1}`} className="w-full h-56 object-cover rounded-lg shadow" />)}
          </div>
        </div>
      </section>

      {/* Pricing Information */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Outstation Pricing</h2>
            <p className="text-gray-600">
              Transparent and competitive pricing for all your outstation travel needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="shadow-lg">
              <CardHeader className="bg-orange-50">
                <CardTitle className="text-orange-800">One Way Trips</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Base Rate (per km)</span>
                    <span className="font-semibold">₹14 - ₹20</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Driver Allowance</span>
                    <span className="font-semibold">₹400/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Toll & Parking</span>
                    <span className="font-semibold">As applicable</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-semibold text-orange-600">
                      <span>Total Estimate</span>
                      <span>₹2,000 - ₹10,000</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader className="bg-blue-50">
                <CardTitle className="text-blue-800">Round Trip Packages</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Package Rate (per km)</span>
                    <span className="font-semibold">₹13 - ₹19</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Driver Allowance</span>
                    <span className="font-semibold">₹400/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount</span>
                    <span className="font-semibold text-green-600">10% off</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-semibold text-blue-600">
                      <span>Total Estimate</span>
                      <span>₹3,500 - ₹18,000</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h4 className="font-semibold text-yellow-800 mb-3">Important Notes:</h4>
            <ul className="space-y-2 text-yellow-700 text-sm">
              <li>• Prices may vary based on vehicle type and peak season</li>
              <li>• Fuel surcharge may apply during price fluctuations</li>
              <li>• Advance booking recommended for outstation trips</li>
              <li>• Payment can be made in cash or online</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Booking Process */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">How to Book Outstation Trips</h2>
            <p className="text-gray-600">
              Simple 4-step process to book your outstation journey
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[{
            step: "1",
            title: "Choose Destination",
            desc: "Select your destination and travel dates"
          }, {
            step: "2",
            title: "Select Vehicle",
            desc: "Pick the right vehicle for your group size"
          }, {
            step: "3",
            title: "Confirm Booking",
            desc: "Review details and confirm your booking"
          }, {
            step: "4",
            title: "Enjoy Journey",
            desc: "Relax and enjoy your comfortable ride"
          }].map((item, index) => <div key={index} className="text-center">
                <div className="bg-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>)}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-orange-400 to-yellow-400 rounded-lg p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Ready for Your Outstation Trip?</h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Contact us to plan your perfect outstation journey with personalized service and competitive rates
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 text-lg">
                  Book Now
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="border-orange-500 hover:bg-white px-8 py-3 text-lg text-orange-500">
                  <Phone className="h-5 w-5 mr-2" />
                  Call Us
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <span>+91 7305305111</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>droptaxigo06@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>;
};
export default OutstationTrips;