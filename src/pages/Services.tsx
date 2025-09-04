
import React from 'react';
import { Link } from 'react-router-dom';
import { Car, ArrowLeft, MapPin, Clock, Route, Users, Shield, CreditCard, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Services = () => {
  const services = [{
    title: "One‑Way Taxi Rides",
    description: "Perfect for single journey needs with competitive and transparent pricing. No hidden charges, no return fees - just pay for what you travel.",
    icon: Car,
    features: [
      "No return charges - pay only for drop",
      "Fixed and transparent pricing with no surprises", 
      "Professional and verified drivers",
      "GPS tracking for safety and route optimization",
      "24/7 customer support",
      "Multiple payment options available"
    ],
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80",
    detailsLink: "/one-way-trips"
  }, {
    title: "Outstation Trips", 
    description: "Long‑distance travel across states and cities with comfort, safety, and reliability. Perfect for business trips, family vacations, and inter-city travel.",
    icon: Route,
    features: [
      "Interstate and inter-city travel coverage",
      "Safety assured with experienced drivers",
      "Comfortable and well-maintained vehicles",
      "24/7 support throughout your journey",
      "Flexible pickup and drop timings",
      "Fuel and toll charges included"
    ],
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80"
  }, {
    title: "Local Drop Trips",
    description: "Short excursions within the city or nearby regions at competitive hourly or distance‑based rates. Ideal for local sightseeing, shopping, and business meetings.",
    icon: MapPin,
    features: [
      "Flexible hourly and distance-based rates",
      "Complete city and suburban coverage",
      "Quick booking with instant confirmation",
      "Wait time charges are minimal",
      "Multiple stops allowed",
      "Local area expertise of drivers"
    ],
    image: "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=800&q=80"
  }, {
    title: "Round‑Trip Packages",
    description: "Cost-effective solution for customers wanting return journeys or hourly hire packages. Best value for round trips with special discounts and dedicated service.",
    icon: Clock,
    features: [
      "Return journey with same vehicle",
      "Package deals with up to 20% savings",
      "Hourly hire options available",
      "Most cost-effective for return trips",
      "Driver waiting time included",
      "Priority booking and dedicated support"
    ],
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=800&q=80",
    detailsLink: "/round-trips"
  }];

  const additionalFeatures = [
    {
      icon: Shield,
      title: "Safety First",
      description: "All vehicles undergo regular maintenance and safety checks. Our drivers are background verified and trained for safe driving."
    },
    {
      icon: CreditCard,
      title: "Multiple Payment Options",
      description: "Pay via cash, card, UPI, or digital wallets. We accept all major payment methods for your convenience."
    },
    {
      icon: Phone,
      title: "24/7 Customer Support",
      description: "Round-the-clock customer support available via phone, WhatsApp, and email for any assistance you need."
    },
    {
      icon: Users,
      title: "Group Travel",
      description: "Special vehicles and packages available for group travel, family trips, and corporate transportation needs."
    }
  ];

  return <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-gray-900 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/c9287985-6bd6-415a-9ed2-5cd34fe0be2d.png" 
                alt="DropTaxi Logo" 
                className="h-12 w-12"
              />
              <div>
                <h1 className="text-2xl font-bold">Drop Taxi Go</h1>
                <p className="text-sm opacity-80">Your Trusted Travel Partner</p>
              </div>
            </Link>
            <Link to="/">
              <Button variant="outline" className="border-white/30 hover:bg-white text-slate-950">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Comprehensive Taxi Services</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
            Experience premium taxi solutions designed to meet all your travel needs across South India. 
            From quick city rides to long-distance journeys, we've got you covered with professional service and competitive pricing.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold">500+</div>
              <div className="text-sm opacity-80">Daily Rides</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">50+</div>
              <div className="text-sm opacity-80">Cities Covered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">4.8★</div>
              <div className="text-sm opacity-80">Customer Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-sm opacity-80">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="space-y-16">
            {services.map((service, index) => {
            const IconComponent = service.icon;
            return <div key={index} className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`} id={service.title === "Round‑Trip Packages" ? "round-trips" : undefined}>
                  <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="bg-orange-100 p-3 rounded-lg">
                        <IconComponent className="h-8 w-8 text-orange-600" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-800">{service.title}</h2>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                      {service.description}
                    </p>
                    <div className="space-y-4 mb-6">
                      <h4 className="font-semibold text-gray-800 mb-3">Key Features & Benefits:</h4>
                      <ul className="space-y-3">
                        {service.features.map((feature, featureIndex) => <li key={featureIndex} className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-600">{feature}</span>
                          </li>)}
                      </ul>
                    </div>
                    {service.detailsLink && (
                      <Link to={service.detailsLink}>
                        <Button className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white">
                          Learn More & Book Now
                        </Button>
                      </Link>
                    )}
                  </div>
                  <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                    <img src={service.image} alt={service.title} className="rounded-lg w-full h-80 object-cover shadow-lg" />
                  </div>
                </div>;
          })}
          </div>
        </div>
      </section>

      {/* Additional Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Drop Taxi Go?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We go beyond just transportation to provide a complete travel experience with safety, comfort, and reliability at the forefront.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="bg-orange-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <IconComponent className="h-8 w-8 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Book Your Ride?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience our premium taxi services today. Book now for a comfortable, safe, and reliable journey at competitive prices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white px-8 py-3 text-lg">
                Book Now
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="px-8 py-3 text-lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>;
};

export default Services;
