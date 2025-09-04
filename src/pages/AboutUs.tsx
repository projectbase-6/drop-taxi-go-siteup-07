import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Users, Clock, Star, Award, Heart, CarFront, MapPin, Navigation, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import experiencedDriversImg from '@/assets/experienced-drivers.jpg';
import taxiFleetImg from '@/assets/taxi-fleet.jpg';
import gpsNavigationImg from '@/assets/gps-navigation.jpg';
const AboutUs = () => {
  return <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-gray-900 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="p-1 rounded-lg">
                <img src="/lovable-uploads/3c2d821a-b9d5-45c1-8318-815cb5126366.png" alt="Drop Taxi Go Logo" className="h-16 w-16" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Drop Taxi Go</h1>
                <p className="text-sm opacity-80">Your Trusted Travel Partner</p>
              </div>
            </Link>
            <Link to="/">
              <Button variant="outline" className="border-white/30 hover:bg-white text-neutral-950">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 text-white" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('/lovable-uploads/3b6aa59c-dd18-4aed-be20-d9806833f184.png')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="container mx-auto px-4 text-center">
          <div className="mb-8">
            <img src="/lovable-uploads/3c2d821a-b9d5-45c1-8318-815cb5126366.png" alt="Drop Taxi Go Logo" className="h-24 w-24 mx-auto mb-6" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Drop Taxi Go</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Your trusted partner for safe, reliable, and comfortable journeys across South India
          </p>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Safety */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="rounded-full bg-red-100 p-3">
                    <Shield className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Safety First</h3>
                </div>
                <p className="text-gray-600">Ensuring your safety with well-maintained vehicles and professional drivers.</p>
              </CardContent>
            </Card>

            {/* Reliability */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="rounded-full bg-green-100 p-3">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Reliability</h3>
                </div>
                <p className="text-gray-600">Punctual and dependable service, every time you ride with us.</p>
              </CardContent>
            </Card>

            {/* Comfort */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="rounded-full bg-blue-100 p-3">
                    <CarFront className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Comfort</h3>
                </div>
                <p className="text-gray-600">Enjoy a smooth and comfortable ride in our well-equipped taxis.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Story</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <img src={taxiFleetImg} alt="Drop Taxi Go Fleet" className="rounded-lg shadow-lg w-full h-64 object-cover" />
              </div>
              <div>
                <p className="text-gray-600 text-lg leading-relaxed mb-4">
                  Drop Taxi in One Way provides world class taxi service at an affordable price. As a tourist, you can travel to any part of South India with our very knowledgeable and experienced drivers.
                </p>
                <p className="text-gray-600 text-lg leading-relaxed">
                  You can visit all the local places with regard to your business. You can reach on time to meeting halls, companies, hotels, hospitals, airport, bus station, railway station, or any other place you have to visit anywhere in Tamil Nadu, Pondicherry, Kerala, Andhra Pradesh And Bangalore.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Technology Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Advanced Technology for Safe Travel</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <div className="flex items-center space-x-3 mb-4">
                  <Navigation className="h-6 w-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-800">GPS Tracking & Route Optimization</h3>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed mb-4">
                  With the help of route maps our drivers will reach any remote places. We have GPS facility that will track your location. Hence you will be benefited with a quick and safe journey to your destination!
                </p>
                <p className="text-gray-600 text-lg leading-relaxed">
                  You can also avail Tour and Travel packages for exploring the beautiful destinations across South India.
                </p>
              </div>
              <div className="order-1 md:order-2">
                <img src={gpsNavigationImg} alt="GPS Navigation System" className="rounded-lg shadow-lg w-full h-64 object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Drivers Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Meet Our Professional Drivers</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <img src={experiencedDriversImg} alt="Experienced Professional Drivers" className="rounded-lg shadow-lg w-full h-64 object-cover" />
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                  <h3 className="text-xl font-semibold text-gray-800">Knowledgeable & Experienced</h3>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed mb-4">
                  Our drivers are highly trained professionals with extensive knowledge of South Indian routes and local attractions. They undergo regular training to ensure your safety and comfort.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">99%</div>
                    <div className="text-sm text-gray-600">Customer Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage Area Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Service Coverage</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
              {[{
              state: 'Tamil Nadu',
              icon: '🏛️'
            }, {
              state: 'Pondicherry',
              icon: '🏖️'
            }, {
              state: 'Kerala',
              icon: '🌴'
            }, {
              state: 'Andhra Pradesh',
              icon: '🏔️'
            }, {
              state: 'Bangalore',
              icon: '🏙️'
            }].map((location, index) => <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-3">{location.icon}</div>
                    <h3 className="font-semibold text-gray-800">{location.state}</h3>
                  </CardContent>
                </Card>)}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Why Choose Drop Taxi Go?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Experienced Drivers */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="rounded-full bg-yellow-100 p-3">
                    <Users className="h-6 w-6 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Experienced Drivers</h3>
                </div>
                <p className="text-gray-600">Our drivers are highly experienced and trained to provide you with a safe and comfortable journey.</p>
              </CardContent>
            </Card>

            {/* 24/7 Support */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="rounded-full bg-indigo-100 p-3">
                    <Clock className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">24/7 Support</h3>
                </div>
                <p className="text-gray-600">We offer round-the-clock customer support to assist you with any queries or concerns.</p>
              </CardContent>
            </Card>

            {/* Wide Range of Vehicles */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="rounded-full bg-purple-100 p-3">
                    <CarFront className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Wide Range of Vehicles</h3>
                </div>
                <p className="text-gray-600">Choose from a wide selection of vehicles to suit your needs and budget.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      

      {/* Awards and Recognition Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Awards and Recognition</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Award 1 */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <Award className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800">Best Taxi Service 2022</h3>
                <p className="text-gray-600">Awarded by Travel Magazine</p>
              </CardContent>
            </Card>

            {/* Award 2 */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800">Customer Choice Award</h3>
                <p className="text-gray-600">Voted by our valued customers</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission & Vision</h2>
              <p className="text-gray-600 mb-4">To make intercity and local travel safe, transparent, and delightful through reliable service, professional drivers, and technology.</p>
              <p className="text-gray-600">We envision being South India’s most trusted taxi brand, known for punctuality, comfort, and customer-first service.</p>
            </div>
            <div>
              <img src={taxiFleetImg} alt="Our mission and fleet" loading="lazy" className="rounded-lg shadow-lg w-full h-64 object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 text-white" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('/lovable-uploads/3b6aa59c-dd18-4aed-be20-d9806833f184.png')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience the Best Taxi Service?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Book your ride now and enjoy a safe, reliable, and comfortable journey with Drop Taxi Go.
          </p>
          <Link to="/">
            <Button className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
              Book Now
            </Button>
          </Link>
        </div>
      </section>
    </div>;
};
export default AboutUs;