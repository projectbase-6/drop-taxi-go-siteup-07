import React from 'react';
import { Link } from 'react-router-dom';
import { Car, ArrowLeft, Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
const Contact = () => {
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
              <Button variant="outline" className="border-black-/30 hover:bg-white text-neutral-950">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 text-white" style={{
      backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('/lovable-uploads/4d9f3f6a-be48-4553-b3bc-03ab0193224e.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Get in touch with us for bookings, support, or any queries. We're here to help 24/7.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Details */}
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Get in Touch</h2>
              <div className="space-y-6">
                <Card className="shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-orange-100 p-3 rounded-lg">
                        <Phone className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">24/7 Booking Support</h3>
                        <p className="text-orange-600 text-lg font-semibold">+91 7305305111</p>
                        <p className="text-gray-600 text-sm">Available round the clock for bookings and support</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-orange-100 p-3 rounded-lg">
                        <Mail className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Email Support</h3>
                        <p className="text-orange-600 text-lg font-semibold">droptaxigo06@gmail.com</p>
                        <p className="text-gray-600 text-sm">Send us your queries and feedback</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-orange-100 p-3 rounded-lg">
                        <MapPin className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Office Address</h3>
                        <p className="text-gray-800 font-medium">Sanviv Services Private Limited</p>
                        <p className="text-gray-600">4/15, Baracka Road, 2nd Street, Nammalvarpet.</p>
                        <p className="text-gray-600">Chennai-600012.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-orange-100 p-3 rounded-lg">
                        <Clock className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Service Hours</h3>
                        <p className="text-gray-600">24 hours a day, 7 days a week</p>
                        <p className="text-gray-600 text-sm">Round the clock service across all covered areas</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Image and Social Media */}
            <div className="space-y-8">
              <div>
                <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80" alt="Customer support team" className="rounded-lg w-full h-64 object-cover shadow-lg" />
              </div>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-center">Connect With Us</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-6">
                      <div className="text-center">
                        <div className="bg-blue-100 p-3 rounded-lg mb-2 mx-auto w-fit">
                          <Facebook className="h-6 w-6 text-blue-600" />
                        </div>
                        <p className="text-sm text-gray-600">Facebook</p>
                      </div>
                      <div className="text-center">
                        <div className="bg-pink-100 p-3 rounded-lg mb-2 mx-auto w-fit">
                          <Instagram className="h-6 w-6 text-pink-600" />
                        </div>
                        <p className="text-sm text-gray-600">Instagram</p>
                      </div>
                      <div className="text-center">
                        <div className="bg-blue-100 p-3 rounded-lg mb-2 mx-auto w-fit">
                          <Twitter className="h-6 w-6 text-blue-400" />
                        </div>
                        <p className="text-sm text-gray-600">Twitter</p>
                      </div>
                    </div>
                    <div className="text-center">
                      
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="bg-orange-100 p-3 rounded-lg mb-4 mx-auto w-fit">
                      <Globe className="h-6 w-6 text-orange-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">Visit Our Website</h3>
                    <p className="text-orange-600 font-medium">droptaxigo.in</p>
                    <p className="text-gray-600 text-sm mt-2">For online bookings and more information</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Service Areas */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Service Areas</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 text-center">
              {['Chennai', 'Bangalore', 'Coimbatore', 'Madurai', 'Trichy', 'Salem', 'Erode', 'Tirunelveli', 'Vellore', 'Thanjavur'].map((city, index) => <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800">{city}</h4>
                </div>)}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Help */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-10">Quick Help & Support</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="shadow-md">
              <CardContent className="p-6 text-center">
                <Phone className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Call Center</h3>
                <p className="text-gray-600">24/7 helpline for instant assistance and bookings.</p>
              </CardContent>
            </Card>
            <Card className="shadow-md">
              <CardContent className="p-6 text-center">
                <Mail className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Email Support</h3>
                <p className="text-gray-600">Get detailed responses within a few hours.</p>
              </CardContent>
            </Card>
            <Card className="shadow-md">
              <CardContent className="p-6 text-center">
                <MapPin className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Visit Office</h3>
                <p className="text-gray-600">Walk in during working hours for personalized help.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 text-white" style={{
      backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('/lovable-uploads/4d9f3f6a-be48-4553-b3bc-03ab0193224e.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Book Your Ride?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Call us now or visit our website to book your comfortable and safe journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">Call: +91 7305305111</Button>
            <Link to="/">
              <Button variant="outline" className="border-white hover:bg-white px-8 py-3 text-lg font-semibold text-orange-600">
                Book Online
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>;
};
export default Contact;