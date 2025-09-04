import React from 'react';
import { Link } from 'react-router-dom';
import { Car, ArrowLeft, Shield, Lock, Eye, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
const Privacy = () => {
  const privacyData = [{
    title: "Information We Collect",
    icon: UserCheck,
    content: ["Name and contact information (phone number, email address)", "Pickup and drop-off addresses for booking purposes", "Payment information (processed securely through payment gateways)", "Trip history and preferences for better service", "Device information and location data (when location services are enabled)"]
  }, {
    title: "How We Use Your Information",
    icon: Eye,
    content: ["To provide taxi booking and transportation services", "To communicate with you about your bookings and service updates", "To process payments and maintain transaction records", "To improve our services and customer experience", "To comply with legal requirements and safety regulations"]
  }, {
    title: "Data Security",
    icon: Lock,
    content: ["All personal data is stored securely using industry-standard encryption", "Access to your information is restricted to authorized personnel only", "We use secure payment gateways for all financial transactions", "Regular security audits are conducted to protect your data", "Data backup and recovery systems are in place to prevent data loss"]
  }, {
    title: "Your Rights",
    icon: Shield,
    content: ["Right to access your personal data and how it's being used", "Right to request correction of inaccurate or incomplete data", "Right to request deletion of your personal data", "Right to restrict or object to certain processing of your data", "Right to data portability (receive your data in a structured format)"]
  }];
  return <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-gray-900 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-3">
              <img src="/lovable-uploads/c9287985-6bd6-415a-9ed2-5cd34fe0be2d.png" alt="DropTaxi Logo" className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">Drop Taxi Go</h1>
                <p className="text-sm opacity-80">Your Trusted Travel Partner</p>
              </div>
            </Link>
            <Link to="/">
              <Button variant="outline" className="border-white/30 hover:bg-white text-base text-slate-950">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Your privacy is important to us. Learn how we collect, use, and protect your personal information.
          </p>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-12">
            <div className="flex items-center justify-center mb-6">
              <img src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80" alt="Data privacy and security concept with lock and shield" className="rounded-lg w-full max-w-2xl h-64 object-cover shadow-lg" />
            </div>
            <div className="text-center">
              <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
                At Drop Taxi Go, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This privacy policy explains how we collect, use, and safeguard your data when you use our services.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {privacyData.map((section, index) => {
            const IconComponent = section.icon;
            return <Card key={index} className="shadow-lg">
                  <CardHeader className="bg-gray-50">
                    <CardTitle className="flex items-center space-x-3">
                      <div className="bg-orange-100 p-2 rounded-lg">
                        <IconComponent className="h-6 w-6 text-orange-600" />
                      </div>
                      <span>{section.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ul className="space-y-3">
                      {section.content.map((item, itemIndex) => <li key={itemIndex} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-600 leading-relaxed">{item}</span>
                        </li>)}
                    </ul>
                  </CardContent>
                </Card>;
          })}
          </div>

          {/* Data Sharing */}
          <div className="mt-16">
            <Card className="shadow-lg">
              <CardHeader className="bg-gray-50">
                <CardTitle>Data Sharing and Third Parties</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <p className="text-gray-600 leading-relaxed">
                    We do not sell, trade, or rent your personal information to third parties. However, 
                    we may share your information in the following limited circumstances:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-600">
                        <strong>Service Providers:</strong> With trusted partners who help us operate our services 
                        (payment processors, mapping services, SMS providers)
                      </span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-600">
                        <strong>Legal Requirements:</strong> When required by law, court order, or government regulations
                      </span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-600">
                        <strong>Safety and Security:</strong> To protect the safety of our drivers, passengers, and public
                      </span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact for Privacy */}
          <div className="mt-16">
            <Card className="shadow-lg border-orange-200">
              <CardHeader className="bg-orange-50">
                <CardTitle className="text-orange-800">Questions About Your Privacy?</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <p className="text-gray-600">
                    If you have any questions about this privacy policy or how we handle your personal information, 
                    please contact us:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold text-gray-800">Email:</p>
                      <p className="text-orange-600">droptaxigo06@gmail.com</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Phone:</p>
                      <p className="text-orange-600">+91 73053 05133</p>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Address:</p>
                    <p className="text-gray-600">
                      Sanviv Services Private Limited<br />
                      4/15, Baracka Road, 2nd Street, Nammalvarpet.<br />
                      Chennai-600012. Tamil Nadu, India
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Last Updated */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">Last updated: December 2024</p>
            <p className="text-gray-500 text-sm mt-2">
              We may update this privacy policy from time to time. Changes will be posted on this page.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Privacy Matters</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            We're committed to protecting your privacy while providing excellent taxi services. 
            Book with confidence knowing your data is secure.
          </p>
          <Link to="/">
            <Button className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white px-8 py-3 text-lg">
              Book Your Ride
            </Button>
          </Link>
        </div>
      </section>
    </div>;
};
export default Privacy;