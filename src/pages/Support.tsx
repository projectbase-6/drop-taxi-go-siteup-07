import React from 'react';
import { Link } from 'react-router-dom';
import { Car, ArrowLeft, Phone, Mail, MessageSquare, Clock, AlertCircle, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
const Support = () => {
  const supportOptions = [{
    title: "Emergency Support",
    description: "For urgent assistance during your trip",
    icon: AlertCircle,
    contact: "+91 73053 05133",
    availability: "24/7 Available",
    color: "red",
    action: "Call Now"
  }, {
    title: "General Support",
    description: "For booking queries and general assistance",
    icon: Headphones,
    contact: "droptaxigo06@gmail.com",
    availability: "Response within 2 hours",
    color: "blue",
    action: "Email Us"
  }, {
    title: "WhatsApp Support",
    description: "Quick support via WhatsApp",
    icon: MessageSquare,
    contact: "+91 7305305111",
    availability: "9 AM - 11 PM",
    color: "green",
    action: "Message Us"
  }];
  const supportCategories = [{
    title: "Booking Issues",
    icon: Phone,
    items: ["Unable to complete booking", "Payment problems", "Booking confirmation issues", "Change or modify booking", "Cancellation requests"]
  }, {
    title: "During Trip",
    icon: Car,
    items: ["Driver not arrived", "Vehicle breakdown", "Route or destination changes", "Emergency assistance", "Lost items in vehicle"]
  }, {
    title: "After Trip",
    icon: MessageSquare,
    items: ["Billing questions", "Fare disputes", "Feedback and complaints", "Receipt requests", "Refund inquiries"]
  }];
  return <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-gray-900 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="bg-orange-400 p-2 rounded-lg">
                <Car className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Drop Taxi Go</h1>
                <p className="text-sm opacity-80">Your Trusted Travel Partner</p>
              </div>
            </Link>
            <Link to="/">
              <Button variant="outline" className="border-black/30 hover:bg-white text-slate-950">
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Customer Support</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            We're here to help you 24/7. Get assistance for any issues during your trip or with our services.
          </p>
        </div>
      </section>

      {/* Emergency Banner */}
      

      {/* Support Options */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">How Can We Help You?</h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {supportOptions.map((option, index) => {
            const IconComponent = option.icon;
            const colorClasses = {
              red: 'bg-red-100 text-red-600 border-red-200',
              blue: 'bg-blue-100 text-blue-600 border-blue-200',
              green: 'bg-green-100 text-green-600 border-green-200'
            };
            return <Card key={index} className={`shadow-lg border-2 ${colorClasses[option.color as keyof typeof colorClasses]}`}>
                  <CardHeader className="text-center">
                    <div className={`p-4 rounded-full w-fit mx-auto mb-4 ${option.color === 'red' ? 'bg-red-100' : option.color === 'blue' ? 'bg-blue-100' : 'bg-green-100'}`}>
                      <IconComponent className={`h-8 w-8 ${option.color === 'red' ? 'text-red-600' : option.color === 'blue' ? 'text-blue-600' : 'text-green-600'}`} />
                    </div>
                    <CardTitle className="text-gray-800">{option.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600 mb-4">{option.description}</p>
                    <div className="space-y-2 mb-4">
                      <p className="font-semibold text-gray-800">{option.contact}</p>
                      <p className="text-sm text-gray-500">{option.availability}</p>
                    </div>
                    <Button className={`w-full ${option.color === 'red' ? 'bg-red-600 hover:bg-red-700' : option.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'} text-white`}>
                      {option.action}
                    </Button>
                  </CardContent>
                </Card>;
          })}
          </div>

          {/* Support Image */}
          <div className="mb-16 text-center">
            <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80" alt="Customer support team" className="rounded-lg w-full max-w-2xl h-64 object-cover shadow-lg mx-auto" />
          </div>

          {/* Support Categories */}
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">What Do You Need Help With?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {supportCategories.map((category, index) => {
            const IconComponent = category.icon;
            return <Card key={index} className="shadow-lg">
                  <CardHeader className="bg-gray-50">
                    <CardTitle className="flex items-center space-x-3">
                      <div className="bg-orange-100 p-2 rounded-lg">
                        <IconComponent className="h-6 w-6 text-orange-600" />
                      </div>
                      <span>{category.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ul className="space-y-3">
                      {category.items.map((item, itemIndex) => <li key={itemIndex} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-600">{item}</span>
                        </li>)}
                    </ul>
                  </CardContent>
                </Card>;
          })}
          </div>
        </div>
      </section>

      {/* Response Times */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Response Times</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center shadow-lg">
              <CardContent className="p-6">
                <div className="bg-red-100 p-3 rounded-full w-fit mx-auto mb-4">
                  <Clock className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Emergency</h3>
                <p className="text-red-600 text-xl font-bold">Immediate</p>
                <p className="text-gray-600 text-sm">24/7 emergency support</p>
              </CardContent>
            </Card>
            
            <Card className="text-center shadow-lg">
              <CardContent className="p-6">
                <div className="bg-yellow-100 p-3 rounded-full w-fit mx-auto mb-4">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Phone Support</h3>
                <p className="text-yellow-600 text-xl font-bold">Within 5 minutes</p>
                <p className="text-gray-600 text-sm">During business hours</p>
              </CardContent>
            </Card>
            
            <Card className="text-center shadow-lg">
              <CardContent className="p-6">
                <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-4">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Email Support</h3>
                <p className="text-green-600 text-xl font-bold">Within 2 hours</p>
                <p className="text-gray-600 text-sm">Detailed responses</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="shadow-lg border-orange-200">
            <CardHeader className="bg-orange-50 text-center">
              <CardTitle className="text-orange-800">Complete Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-gray-800 mb-4">Support Contacts</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="font-semibold">24/7 Support Line</p>
                        <p className="text-orange-600">+91 73053 05111</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="font-semibold">Email Support</p>
                        <p className="text-orange-600">droptaxigo06@gmail.com</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-bold text-gray-800 mb-4">Office Address</h4>
                  <div className="space-y-2">
                    <p className="font-semibold">Sanviv Services Private Limited</p>
                    <p className="text-gray-600">4/15, Baracka Road, 2nd Street, Nammalvarpet.</p>
                    <p className="text-gray-600">Chennai-600012.</p>
                    <p className="text-gray-600">Tamil Nadu, India</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>;
};
export default Support;