import React from 'react';
import { Link } from 'react-router-dom';
import { Car, ArrowLeft, FileText, Shield, AlertCircle, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
const Terms = () => {
  const termsData = [{
    title: "Booking and Payment",
    icon: CreditCard,
    content: ["Customers agree to pay agreed fares as estimated at booking time", "Any additional charges (waiting time, night timings, permits) will be added to the final bill", "Payment can be made through cash, card, or digital payment methods", "Booking confirmation will be sent via SMS and email", "Advance payment may be required for outstation trips"]
  }, {
    title: "Cancellations and Refunds",
    icon: AlertCircle,
    content: ["Cancellations may be subject to fees depending on the notice period", "Free cancellation within 1 hour of booking (for local trips)", "For outstation trips, cancellation charges apply as per company policy", "Refund policy applies as per company rules and payment method", "Refunds will be processed within 5-7 business days"]
  }, {
    title: "Eligibility and Safety",
    icon: Shield,
    content: ["All drivers are licensed professionals with verified credentials", "By traveling, you agree to follow driver instructions and safety rules", "Passengers must provide valid identification when requested", "Children under 12 must be accompanied by adults", "Smoking and alcohol consumption is strictly prohibited in vehicles"]
  }, {
    title: "Liability and Limitations",
    icon: FileText,
    content: ["Drop Taxi is not liable for delays due to unforeseen circumstances", "This includes roadblocks, traffic jams, weather conditions, or vehicle breakdown", "The company is not responsible for personal belongings left in vehicles", "Maximum liability is limited to the fare amount paid", "Travel insurance is recommended for long-distance journeys"]
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
              <Button variant="outline" className="border-black/30 hover:bg-white text-slate-950">
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms & Conditions</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Please read our terms and conditions carefully before using our services
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-8">
            {termsData.map((section, index) => {
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

          {/* Additional Terms */}
          <div className="mt-16">
            <Card className="shadow-lg">
              <CardHeader className="bg-gray-50">
                <CardTitle>Additional Terms</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Service Availability</h4>
                    <p className="text-gray-600 text-sm">
                      Services are subject to availability and may vary based on location, weather conditions, 
                      and local regulations. The company reserves the right to modify service areas and timings.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Modification of Terms</h4>
                    <p className="text-gray-600 text-sm">
                      Drop Taxi Go reserves the right to modify these terms and conditions at any time. 
                      Updated terms will be posted on our website and communicated to customers.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Governing Law</h4>
                    <p className="text-gray-600 text-sm">
                      These terms and conditions are governed by the laws of India. Any disputes will be 
                      subject to the jurisdiction of courts in Chennai, Tamil Nadu.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Contact for Legal Matters</h4>
                    <p className="text-gray-600 text-sm">
                      For any legal correspondence, please contact us at our registered office: 
                      Sanviv Services Private Limited, 4/15, Baracka Road, 2nd Street, Nammalvarpet. Chennai-600012.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Last Updated */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">Last updated: December 2024</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Have Questions?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            If you have any questions about our terms and conditions, please don't hesitate to contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white px-8 py-3 text-lg">
                Contact Us
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="border-orange-400 text-orange-600 hover:bg-orange-50 px-8 py-3 text-lg">
                Book a Ride
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>;
};
export default Terms;