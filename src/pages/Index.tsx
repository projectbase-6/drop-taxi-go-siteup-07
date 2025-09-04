import React, { useState, useEffect } from 'react';
import { useCreateQuery } from '@/hooks/useQueries';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, MapPin, Shield, Clock, MapIcon, Zap, Car, RotateCcw, Star, Users, MessageCircle, Mail, CheckCircle, Facebook, Twitter, Instagram, Chrome } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import EnhancedBookingForm from "@/components/EnhancedBookingForm";
import MobileBookingForm from "@/components/MobileBookingForm";
import PopularRoutes from "@/components/PopularRoutes";
import { Link } from "react-router-dom";
const Index = () => {
  const isMobile = useIsMobile();
  const scrollDirection = useScrollDirection();
  const createQuery = useCreateQuery();
  const handleRouteSelect = (from: string, to: string) => {
    // Auto-fill the booking form and scroll to it
    const bookingSection = document.getElementById('booking-section');
    if (bookingSection) {
      // Dispatch custom events to update form fields
      window.dispatchEvent(new CustomEvent('updatePickupLocation', {
        detail: from
      }));
      window.dispatchEvent(new CustomEvent('updateDropLocation', {
        detail: to
      }));

      // Scroll to booking section
      bookingSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  const handleServiceSelect = (serviceType: string) => {
    // Map service types to booking form types
    const serviceMapping: {
      [key: string]: {
        tripType: string;
        serviceCategory?: string;
      };
    } = {
      'city-rides': {
        tripType: 'oneway',
        serviceCategory: 'city-rides'
      },
      'airport-transfers': {
        tripType: 'oneway',
        serviceCategory: 'airport-transfers'
      },
      'outstation': {
        tripType: 'oneway'
      },
      'hourly-rentals': {
        tripType: 'hourly',
        serviceCategory: 'hourly-rentals'
      },
      'corporate': {
        tripType: 'oneway',
        serviceCategory: 'corporate'
      },
      'tourist': {
        tripType: 'roundtrip',
        serviceCategory: 'tourist'
      }
    };
    const mapping = serviceMapping[serviceType];
    if (mapping) {
      // Dispatch events to update booking form
      window.dispatchEvent(new CustomEvent('updateTripType', {
        detail: mapping.tripType
      }));
      if (mapping.serviceCategory) {
        window.dispatchEvent(new CustomEvent('updateServiceCategory', {
          detail: mapping.serviceCategory
        }));
      }

      // Scroll to booking section
      const bookingSection = document.getElementById('booking-section');
      if (bookingSection) {
        bookingSection.scrollIntoView({
          behavior: 'smooth'
        });
      }
    }
  };
  const stats = [{
    number: "10,000+",
    label: "Happy Customers"
  }, {
    number: "50,000+",
    label: "Trips Completed"
  }, {
    number: "12",
    label: "Cities Covered"
  }, {
    number: "₹14/km",
    label: "Starting From"
  }];
  const services = [{
    id: 'city-rides',
    title: "🚖 City Rides",
    description: "Quick and comfortable rides within the city for all your daily travel needs",
    icon: <Car className="h-12 w-12 text-blue-600" />,
    features: ["Quick pickup", "City coverage", "All vehicle types", "Affordable rates"],
    benefits: ["Convenient", "Fast", "Reliable"],
    buttonText: "Book City Ride",
    buttonColor: "bg-blue-600 hover:bg-blue-700",
    bgColor: "bg-blue-50 border-blue-200"
  }, {
    id: 'airport-transfers',
    title: "✈ Airport Transfers",
    description: "Hassle-free airport pickups and drops with meet & greet service",
    icon: <Car className="h-12 w-12 text-green-600" />,
    features: ["Meet & greet service", "Flight tracking", "Luggage assistance", "24/7 availability"],
    benefits: ["Punctual", "Professional", "Stress-free"],
    buttonText: "Book Airport Transfer",
    buttonColor: "bg-green-600 hover:bg-green-700",
    bgColor: "bg-green-50 border-green-200"
  }, {
    id: 'outstation',
    title: "🌄 Outstation & Long-Distance Travel",
    description: "Comfortable long-distance trips with experienced drivers and well-maintained vehicles",
    icon: <MapIcon className="h-12 w-12 text-purple-600" />,
    features: ["Experienced drivers", "Route planning", "Fuel included", "Rest stops"],
    benefits: ["Comfortable", "Safe", "Scenic routes"],
    buttonText: "Book Outstation Trip",
    buttonColor: "bg-purple-600 hover:bg-purple-700",
    bgColor: "bg-purple-50 border-purple-200"
  }, {
    id: 'hourly-rentals',
    title: "🕒 Hourly Rentals",
    description: "Rent a cab by the hour for multiple stops, shopping, or business meetings",
    icon: <Clock className="h-12 w-12 text-orange-600" />,
    features: ["Flexible timing", "Multiple stops", "Waiting included", "Dedicated driver"],
    benefits: ["Flexible", "Time-saving", "Cost-effective"],
    buttonText: "Book Hourly Rental",
    buttonColor: "bg-orange-600 hover:bg-orange-700",
    bgColor: "bg-orange-50 border-orange-200"
  }, {
    id: 'corporate',
    title: "🧳 Corporate & Business Cab Services",
    description: "Professional transportation solutions for corporate clients and business travel",
    icon: <Users className="h-12 w-12 text-indigo-600" />,
    features: ["Corporate billing", "Priority support", "Professional drivers", "Fleet management"],
    benefits: ["Professional", "Reliable", "Business-focused"],
    buttonText: "Book Corporate Service",
    buttonColor: "bg-indigo-600 hover:bg-indigo-700",
    bgColor: "bg-indigo-50 border-indigo-200"
  }, {
    id: 'tourist',
    title: "🏕 Tourist Package & Holiday Cabs",
    description: "Explore tourist destinations with our guided tour packages and holiday cab services",
    icon: <MapPin className="h-12 w-12 text-teal-600" />,
    features: ["Tourist guides", "Package deals", "Sightseeing tours", "Local expertise"],
    benefits: ["Guided tours", "Local knowledge", "All-inclusive"],
    buttonText: "Book Holiday Package",
    buttonColor: "bg-teal-600 hover:bg-teal-700",
    bgColor: "bg-teal-50 border-teal-200"
  }];
  const whyChooseUs = [{
    icon: <Shield className="h-12 w-12 text-blue-600" />,
    title: "Safe & Secure",
    description: "All drivers verified and vehicles sanitized"
  }, {
    icon: <Clock className="h-12 w-12 text-blue-600" />,
    title: "24/7 Service",
    description: "Available round the clock for your convenience"
  }, {
    icon: <MapIcon className="h-12 w-12 text-blue-600" />,
    title: "GPS Tracking",
    description: "Real-time tracking for your peace of mind"
  }, {
    icon: <Zap className="h-12 w-12 text-blue-600" />,
    title: "Instant Booking",
    description: "Book in seconds with our easy-to-use platform"
  }];
  const pricingData = [{
    route: "Chennai → Bangalore",
    distance: "347 km",
    duration: "6h 30m",
    hatchback: "₹4,164",
    sedan: "₹5,205",
    suv: "₹6,246"
  }, {
    route: "Chennai → Coimbatore",
    distance: "507 km",
    duration: "8h 45m",
    hatchback: "₹6,084",
    sedan: "₹7,605",
    suv: "₹9,126"
  }, {
    route: "Bangalore → Mysore",
    distance: "144 km",
    duration: "3h 15m",
    hatchback: "₹1,728",
    sedan: "₹2,160",
    suv: "₹2,592"
  }, {
    route: "Chennai → Pondicherry",
    distance: "162 km",
    duration: "3h 45m",
    hatchback: "₹1,944",
    sedan: "₹2,430",
    suv: "₹2,916"
  }, {
    route: "Hyderabad → Bangalore",
    distance: "569 km",
    duration: "9h 30m",
    hatchback: "₹6,828",
    sedan: "₹8,535",
    suv: "₹10,242"
  }, {
    route: "Kochi → Trivandrum",
    distance: "205 km",
    duration: "4h 15m",
    hatchback: "₹2,460",
    sedan: "₹3,075",
    suv: "₹3,690"
  }];
  const testimonials = [{
    name: "Rajesh Kumar",
    initial: "R",
    rating: 5,
    review: "Excellent service! The driver was professional and the car was clean. Highly recommend for Chennai to Bangalore trips.",
    route: "Chennai to Bangalore",
    date: "1/15/2024"
  }, {
    name: "Priya Sharma",
    initial: "P",
    rating: 5,
    review: "Very reliable service. Booking was easy and the driver arrived on time. Great experience overall!",
    route: "Bangalore to Mysore",
    date: "1/10/2024"
  }, {
    name: "Mohammed Ali",
    initial: "M",
    rating: 4,
    review: "Good service and fair pricing. The GPS tracking feature gave me peace of mind throughout the journey.",
    route: "Chennai to Coimbatore",
    date: "1/8/2024"
  }, {
    name: "Anjali Nair",
    initial: "A",
    rating: 5,
    review: "Perfect for airport transfers. Driver was waiting at the terminal and helped with luggage. Will book again!",
    route: "Kochi to Airport",
    date: "1/5/2024"
  }];
  const serviceCities = ["Chennai", "Bangalore", "Hyderabad", "Coimbatore", "Kochi", "Trivandrum", "Mysore", "Pondicherry", "Madurai", "Tirupati", "Vellore", "Salem"];
  return <div className="min-h-screen bg-white">
      {/* Header */}
      

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 bg-white shadow-md py-2 transition-transform duration-300 ${scrollDirection === 'down' ? '-translate-y-full' : 'translate-y-0'}`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src="/lovable-uploads/2f66fff6-4554-47eb-aaae-a128f3384671.png" alt="DropTaxiGo Logo" className="h-12 w-12 object-contain" />
              <span className="text-xl font-bold text-primary">DropTaxiGo</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <button onClick={() => window.scrollTo(0, 0)} className="text-gray-700 hover:text-primary font-medium text-sm">Home</button>
              <button onClick={() => document.getElementById('services')?.scrollIntoView({
              behavior: 'smooth'
            })} className="text-gray-700 hover:text-primary font-medium text-sm">Services</button>
              <button onClick={() => document.getElementById('pricing')?.scrollIntoView({
              behavior: 'smooth'
            })} className="text-gray-700 hover:text-primary font-medium text-sm">Tariff</button>
              <button onClick={() => document.getElementById('reviews')?.scrollIntoView({
              behavior: 'smooth'
            })} className="text-gray-700 hover:text-primary font-medium text-sm">Reviews</button>
              <button onClick={() => document.getElementById('contact')?.scrollIntoView({
              behavior: 'smooth'
            })} className="text-gray-700 hover:text-primary font-medium text-sm">Contact</button>
              
              {/* Contact Icons */}
              <div className="flex items-center gap-3 ml-2">
                <a 
                  href="tel:+917305305111" 
                  className="flex items-center justify-center w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors"
                  title="Call us"
                >
                  <Phone className="h-5 w-5" />
                </a>
                <a 
                  href="https://wa.me/917305305111" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors"
                  title="WhatsApp"
                >
                  <MessageCircle className="h-5 w-5" />
                </a>
              </div>
              
              <Button onClick={() => document.getElementById('booking-section')?.scrollIntoView({
              behavior: 'smooth'
            })} className="bg-primary hover:bg-primary/90 text-white px-4 py-1.5 rounded-lg text-sm">
                Book Now
              </Button>
            </div>
            
            {/* Mobile menu with contact icons */}
            <div className="md:hidden flex items-center gap-2 ml-4">
              <a 
                href="tel:+917305305111" 
                className="flex items-center justify-center w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors"
                title="Call us"
              >
                <Phone className="h-4 w-4" />
              </a>
              <a 
                href="https://wa.me/917305305111" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors"
                title="WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <Button onClick={() => document.getElementById('booking-section')?.scrollIntoView({
              behavior: 'smooth'
            })} className="bg-primary hover:bg-primary/90 text-white px-3 py-1.5 rounded-lg text-sm">
                Book
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen bg-cover bg-center bg-no-repeat text-white flex items-center" style={{
      paddingTop: '72px',
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/lovable-uploads/5330d5f4-09c6-4516-8937-ecccf41ffc7e.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      imageRendering: 'crisp-edges'
    }} onLoad={() => {
      // Preload booking form images for instant loading
      const img = new Image();
      img.src = '/lovable-uploads/c9287985-6bd6-415a-9ed2-5cd34fe0be2d.png';
    }}>
        <div className="container mx-auto px-4 flex items-center min-h-screen">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            {/* Left side - Hero content */}
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white drop-shadow-lg">
                Your Trusted Taxi Service<br />
                Across South India
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl mb-8 text-white/90 drop-shadow-md">
                Safe, reliable, and comfortable journeys with professional<br />
                drivers, GPS tracking, and sanitized vehicles
              </p>
            </div>
            
            {/* Right side - Enhanced Booking Form */}
            <div id="booking-section" className="flex justify-end">
              <div className={`w-full ${isMobile ? '' : 'max-w-md mr-8'}`}>
                {isMobile ? <MobileBookingForm /> : <EnhancedBookingForm />}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature badges and Stats Section */}
      <section className="py-16 bg-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="bg-primary/20 backdrop-blur-sm px-6 py-3 rounded-full border border-primary/30">
              <div className="flex items-center gap-2 text-primary">
                <Shield className="h-5 w-5" />
                <span className="font-medium">Verified Drivers</span>
              </div>
            </div>
            <div className="bg-primary/20 backdrop-blur-sm px-6 py-3 rounded-full border border-primary/30">
              <div className="flex items-center gap-2 text-primary">
                <Clock className="h-5 w-5" />
                <span className="font-medium">24/7 Service</span>
              </div>
            </div>
            <div className="bg-primary/20 backdrop-blur-sm px-6 py-3 rounded-full border border-primary/30">
              <div className="flex items-center gap-2 text-primary">
                <MapIcon className="h-5 w-5" />
                <span className="font-medium">GPS Tracking</span>
              </div>
            </div>
            <div className="bg-primary/20 backdrop-blur-sm px-6 py-3 rounded-full border border-primary/30">
              <div className="flex items-center gap-2 text-primary">
                <Star className="h-5 w-5" />
                <span className="font-medium">4.8/5 Rating</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2 text-primary">{stat.number}</div>
                <div className="text-gray-700 text-sm md:text-base font-medium">{stat.label}</div>
              </div>)}
          </div>
        </div>
      </section>

      {/* Popular Routes Section */}
      <PopularRoutes />

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600">
              Choose from our range of taxi services designed to meet your specific travel needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {services.map((service, index) => <Card key={index} className={`${service.bgColor} border-2 hover:shadow-lg transition-shadow`}>
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    {service.icon}
                    <h3 className="text-2xl font-bold text-gray-900 mt-4 mb-2">{service.title}</h3>
                    <p className="text-gray-600">{service.description}</p>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Features:</h4>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => <li key={idx} className="flex items-center gap-2 text-gray-700">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>{feature}</span>
                        </li>)}
                    </ul>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Benefits:</h4>
                    <div className="flex flex-wrap gap-2">
                      {service.benefits.map((benefit, idx) => <span key={idx} className="px-3 py-1 bg-white rounded-full text-sm font-medium border">
                          {benefit}
                        </span>)}
                    </div>
                  </div>
                  
                  <Button onClick={() => {
                    // Dispatch custom events based on service type
                    if (service.title === 'Airport Transfer') {
                      window.dispatchEvent(new CustomEvent('updateTripType', { detail: 'airport' }));
                    } else if (service.title === 'Outstation Trips') {
                      window.dispatchEvent(new CustomEvent('updateTripType', { detail: 'oneway' }));
                    } else if (service.title === 'Local Rides') {
                      window.dispatchEvent(new CustomEvent('updateTripType', { detail: 'local' }));
                    }
                    
                    // Scroll to top to show the booking form
                    window.scrollTo({
                      top: 0,
                      behavior: 'smooth'
                    });
                  }} className={`w-full ${service.buttonColor} text-white py-3 font-semibold`}>
                    {service.buttonText} →
                  </Button>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => <div key={index} className="text-center">
                <div className="bg-blue-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>)}
          </div>
        </div>
      </section>

      {/* Transparent Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Transparent Pricing</h2>
            <p className="text-xl text-gray-600 mb-8">
              Our competitive rates for popular routes across South India
            </p>
            
            {/* Vehicle Types */}
            <div className="flex justify-center gap-4 md:gap-8 mb-8 flex-wrap">
              <div className="text-center">
                <Car className="h-8 md:h-12 w-8 md:w-12 mx-auto mb-2 text-gray-700" />
                <div className="font-semibold text-sm md:text-base">SEDAN</div>
                <div className="text-primary font-bold text-sm md:text-base">₹14/km</div>
              </div>
              <div className="text-center">
                <Car className="h-8 md:h-12 w-8 md:w-12 mx-auto mb-2 text-gray-700" />
                <div className="font-semibold text-sm md:text-base">ETIOS</div>
                <div className="text-primary font-bold text-sm md:text-base">₹15/km</div>
              </div>
              <div className="text-center">
                <Car className="h-8 md:h-12 w-8 md:w-12 mx-auto mb-2 text-gray-700" />
                <div className="font-semibold text-sm md:text-base">SUV</div>
                <div className="text-primary font-bold text-sm md:text-base">₹19/km</div>
              </div>
              <div className="text-center">
                <Car className="h-8 md:h-12 w-8 md:w-12 mx-auto mb-2 text-gray-700" />
                <div className="font-semibold text-sm md:text-base">INNOVA</div>
                <div className="text-primary font-bold text-sm md:text-base">₹20/km</div>
              </div>
            </div>
          </div>

          {/* Mobile-Responsive Pricing Table */}
          <div className="max-w-6xl mx-auto">
            {/* Desktop Table */}
            <div className="hidden lg:block">
              <div className="text-white rounded-t-lg overflow-hidden" style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('/lovable-uploads/99c9e9be-f620-4c10-be89-150704e56d78.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
                <div className="grid grid-cols-6 gap-4 p-4 font-semibold text-center">
                  <div>Route</div>
                  <div>Distance</div>
                  <div>Duration</div>
                  <div>Hatchback</div>
                  <div>Sedan</div>
                  <div>SUV</div>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-b-lg overflow-hidden">
                {pricingData.map((row, index) => <div key={index} className="grid grid-cols-6 gap-4 p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 text-center">
                    <div className="font-medium text-gray-900">{row.route}</div>
                    <div className="text-gray-600">{row.distance}</div>
                    <div className="text-gray-600">{row.duration}</div>
                    <div className="text-primary font-semibold">{row.hatchback}</div>
                    <div className="text-primary font-semibold">{row.sedan}</div>
                    <div className="text-primary font-semibold">{row.suv}</div>
                  </div>)}
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {pricingData.map((row, index) => <Card key={index} className="overflow-hidden">
                  <CardContent className="p-0">
                    {/* Route Header */}
                      <div className="text-white p-4" style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('/lovable-uploads/99c9e9be-f620-4c10-be89-150704e56d78.png')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}>
                      <h3 className="font-bold text-lg">{row.route}</h3>
                      <div className="flex justify-between text-sm mt-2">
                        <span>Distance: {row.distance}</span>
                        <span>Duration: {row.duration}</span>
                      </div>
                    </div>
                    
                    {/* Pricing Grid */}
                    <div className="p-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-sm text-gray-600 mb-1">Hatchback</div>
                          <div className="text-lg font-bold text-primary">{row.hatchback}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600 mb-1">Sedan</div>
                          <div className="text-lg font-bold text-primary">{row.sedan}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600 mb-1">SUV</div>
                          <div className="text-lg font-bold text-primary">{row.suv}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>)}
            </div>

            {/* Tablet Table */}
            <div className="hidden md:block lg:hidden">
              <div className="space-y-4">
                {pricingData.map((row, index) => <Card key={index} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="text-white p-4" style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('/lovable-uploads/99c9e9be-f620-4c10-be89-150704e56d78.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}>
                        <div className="grid grid-cols-3 gap-4 text-center font-semibold">
                          <div>Route</div>
                          <div>Distance</div>
                          <div>Duration</div>
                        </div>
                      </div>
                      <div className="p-4 border-b">
                        <div className="grid grid-cols-3 gap-4 text-center mb-4">
                          <div className="font-medium text-gray-900">{row.route}</div>
                          <div className="text-gray-600">{row.distance}</div>
                          <div className="text-gray-600">{row.duration}</div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-sm text-gray-600">Hatchback</div>
                            <div className="text-primary font-semibold">{row.hatchback}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Sedan</div>
                            <div className="text-primary font-semibold">{row.sedan}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">SUV</div>
                            <div className="text-primary font-semibold">{row.suv}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>)}
              </div>
            </div>
          </div>

          {/* Pricing Notes */}
          <div className="max-w-4xl mx-auto mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="font-bold text-gray-900 mb-4">Pricing Notes</h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-700">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <span>Round-trip bookings get 10% discount</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <span>Airport transfers include 20% premium for priority service</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <span>Toll charges and parking fees are additional</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <span>Waiting charges: ₹2/minute after 15 minutes</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <span>Night charges (11 PM - 6 AM): Additional 25%</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <span>Cancellation free up to 2 hours before pickup</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section id="reviews" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />)}
              </div>
              <span className="text-2xl font-bold text-gray-900">4.8</span>
              <span className="text-gray-600">(4 reviews)</span>
            </div>
            <p className="text-xl text-gray-600">
              Real feedback from our satisfied customers across South India
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <Users className="h-12 w-12 text-orange-500 mx-auto mb-3" />
              <div className="text-3xl font-bold text-primary">10,000+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div className="text-center">
              <Car className="h-12 w-12 text-red-500 mx-auto mb-3" />
              <div className="text-3xl font-bold text-primary">50,000+</div>
              <div className="text-gray-600">Trips Completed</div>
            </div>
            <div className="text-center">
              <Star className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
              <div className="text-3xl font-bold text-primary">4.8/5</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
            <div className="text-center">
              <Phone className="h-12 w-12 text-blue-500 mx-auto mb-3" />
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-gray-600">Support Available</div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {testimonials.map((testimonial, index) => <Card key={index} className="bg-white hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">
                      {testimonial.initial}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />)}
                        <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">{testimonial.date}</div>
                  </div>
                  <p className="text-gray-700 mb-3 italic">"{testimonial.review}"</p>
                  <div className="text-primary text-sm font-medium">{testimonial.route}</div>
                </CardContent>
              </Card>)}
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-12 text-center text-white">
            <h3 className="text-3xl font-bold mb-4">Join Thousands of Satisfied Customers</h3>
            <p className="text-xl mb-8 text-blue-100">
              Experience the comfort and reliability that our customers love
            </p>
            <Button className="bg-white text-primary hover:bg-gray-100 px-8 py-3 font-semibold rounded-lg">
              Book Your Ride Today
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-xl text-gray-600">
              Get in touch with us for bookings, inquiries, or support. We're here to help 24/7.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Get in Touch */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Get in Touch</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Phone className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Call Us</h4>
                    <p className="text-gray-600">Available 24/7 for bookings and support</p>
                    <p className="text-primary font-semibold">+91 7305305111</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Email Us</h4>
                    <p className="text-gray-600">Send us your queries and feedback</p>
                    <p className="text-primary font-semibold">droptaxigo06@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Visit Us</h4>
                    <p className="text-gray-600">Our main office location</p>
                    <p className="text-gray-700">4/15, Baracka Road, 2nd Street, Nammalvarpet.<br />Chennai-600012.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Service Hours</h4>
                    <p className="text-gray-600">We operate round the clock</p>
                    <p className="text-gray-700">24/7 - All days of the week</p>
                  </div>
                </div>

                <div className="bg-green-600 text-white p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <MessageCircle className="h-6 w-6" />
                    <h4 className="font-semibold">WhatsApp Support</h4>
                  </div>
                  <p className="mb-4">Quick booking and instant support</p>
                  <Button className="bg-white text-green-600 hover:bg-gray-100" onClick={() => window.open('https://wa.me/917305305111', '_blank')}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat with us on WhatsApp
                  </Button>
                </div>
              </div>
            </div>

            {/* Send us a Message */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Send us a Message</h3>
              
              <form className="space-y-6" onSubmit={e => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const queryData = {
                full_name: formData.get('fullName') as string,
                email: formData.get('email') as string,
                phone: formData.get('phone') as string || undefined,
                subject: formData.get('subject') as string,
                message: formData.get('message') as string
              };
              createQuery.mutate(queryData);
              (e.target as HTMLFormElement).reset();
            }}>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName" className="text-gray-700 font-medium">Full Name *</Label>
                    <Input name="fullName" id="fullName" placeholder="Your full name" className="mt-1 border-gray-300 focus:border-primary" required />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-gray-700 font-medium">Email Address *</Label>
                    <Input name="email" id="email" type="email" placeholder="droptaxigo06@gmail.com" className="mt-1 border-gray-300 focus:border-primary" required />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number</Label>
                    <Input name="phone" id="phone" placeholder="+91 7305305111" className="mt-1 border-gray-300 focus:border-primary" />
                  </div>
                  <div>
                    <Label htmlFor="subject" className="text-gray-700 font-medium">Subject *</Label>
                    <Select name="subject" required>
                      <SelectTrigger className="mt-1 border-gray-300 focus:border-primary">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="booking">Booking Inquiry</SelectItem>
                        <SelectItem value="support">Support</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                        <SelectItem value="complaint">Complaint</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="message" className="text-gray-700 font-medium">Message *</Label>
                  <Textarea name="message" id="message" placeholder="Please describe your inquiry or message..." rows={5} className="mt-1 border-gray-300 focus:border-primary" required />
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white py-3 font-semibold" disabled={createQuery.isPending}>
                  <Mail className="h-4 w-4 mr-2" />
                  {createQuery.isPending ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Service Areas</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
            {serviceCities.map((city, index) => <Button key={index} variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                {city}
              </Button>)}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src="/lovable-uploads/2f66fff6-4554-47eb-aaae-a128f3384671.png" alt="DropTaxiGo Logo" className="h-16 w-16 object-contain" />
                <span className="text-2xl font-bold">DropTaxiGo</span>
              </div>
              <p className="text-gray-400 mb-4">
                Your trusted taxi service partner across South India. Safe, reliable, and comfortable journeys.
              </p>
              <div className="flex gap-4">
                <Facebook className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer" />
                <Twitter className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer" />
                <Instagram className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer" />
                <Chrome className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer" />
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white">Home</Link></li>
                <li><Link to="/one-way-trips" className="hover:text-white">One Way Trips</Link></li>
                <li><Link to="/round-trips" className="hover:text-white">Round Trips</Link></li>
                <li><Link to="/services" className="hover:text-white">Services</Link></li>
                <li><button onClick={() => document.getElementById('pricing')?.scrollIntoView({
                  behavior: 'smooth'
                })} className="hover:text-white text-left">Tariff</button></li>
                <li><Link to="/about" className="hover:text-white">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
              </ul>
            </div>

            {/* Our Services */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Our Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => handleRouteSelect('Chennai', 'Bangalore')} className="hover:text-white text-left">Chennai to Bangalore</button></li>
                <li><button onClick={() => handleRouteSelect('Chennai', 'Coimbatore')} className="hover:text-white text-left">Chennai to Coimbatore</button></li>
                <li><button onClick={() => handleRouteSelect('Bangalore', 'Mysore')} className="hover:text-white text-left">Bangalore to Mysore</button></li>
                <li><Link to="/corporate-travel" className="hover:text-white">Corporate Travel</Link></li>
                
                <li><Link to="/outstation-trips" className="hover:text-white">Outstation Trips</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>Call us 24/7<br />+91 7305305111</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>Email us<br />droptaxigo06@gmail.com</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-1" />
                  <span>Office Address<br />4/15, Baracka Road, 2nd Street, Nammalvarpet. Chennai-600012.</span>
                </div>
              </div>

              <div className="bg-green-600 mt-6 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="h-5 w-5" />
                  <span className="font-semibold">WhatsApp Support</span>
                </div>
                <p className="text-sm mb-3">Quick booking and support</p>
                <Button className="bg-white text-green-600 hover:bg-gray-100 w-full" onClick={() => window.open('https://wa.me/917305305111', '_blank')}>
                  Chat with us
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2024 Droptaxigo . All rights reserved.</p>
            <div className="flex justify-center gap-6 mt-4">
              <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>;
};
export default Index;