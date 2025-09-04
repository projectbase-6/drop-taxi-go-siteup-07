import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Car, ArrowLeft, ChevronDown, HelpCircle, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "What is a one‑way taxi?",
      answer: "A one‑way taxi charges only for the drop trip, without return leg or idle waiting time. You pay only for the distance traveled to your destination, making it cost-effective for outstation trips where you don't need the taxi to wait or return."
    },
    {
      question: "How is pricing calculated?",
      answer: "Pricing is based on vehicle type (Sedan vs. MUV), distance traveled, and applicable GST. Additional fees may apply for waiting time, night travel (11 PM to 6 AM), hill station routes, or inter‑state entry permits. All base rates are transparent and quoted upfront."
    },
    {
      question: "Can I book a return trip or hourly rental?",
      answer: "Yes, we offer round‑trip packages and hourly city‑based local hire options. Round-trip packages are cost-effective for return journeys, while hourly rentals are perfect for local sightseeing, shopping, or business trips within the city."
    },
    {
      question: "How do I cancel or modify a booking?",
      answer: "Please contact our 24/7 support at +91 73053 05133 or email us as soon as possible. For local trips, free cancellation is available within 1 hour of booking. For outstation trips, cancellation fees may apply depending on the notice period."
    },
    {
      question: "Are the fares inclusive of GST?",
      answer: "Yes — all quoted fares include the applicable GST. Any additional adjustments due to traffic delays, waiting time, or permit fees will be clearly explained on the billing voucher before payment."
    },
    {
      question: "What areas do you cover?",
      answer: "We provide services across Tamil Nadu, Kerala, Andhra Pradesh, Pondicherry, and Bangalore. Our primary service areas include Chennai, Coimbatore, Madurai, Trichy, Salem, Erode, and all major cities and towns in these regions."
    },
    {
      question: "How do I track my ride?",
      answer: "Once your booking is confirmed, you'll receive SMS updates with driver details and vehicle information. You can call our support team at any time during your journey for assistance or updates on your ride status."
    },
    {
      question: "What safety measures do you have?",
      answer: "All our drivers are licensed professionals with verified credentials and background checks. Our vehicles undergo regular maintenance and safety inspections. We also have 24/7 support for emergency assistance during your journey."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept cash, credit/debit cards, and popular digital payment methods like UPI, Paytm, and Google Pay. For outstation trips, advance payment may be required to confirm your booking."
    },
    {
      question: "Can I book in advance?",
      answer: "Yes, you can book rides in advance. We recommend booking outstation trips at least 24 hours in advance to ensure vehicle availability. For local trips, you can book up to 7 days in advance."
    },
    {
      question: "What if my driver is late?",
      answer: "Our drivers are committed to punctuality. If there's any delay, you'll be notified immediately. In case of significant delays due to traffic or other factors, we may provide compensation or alternative arrangements."
    },
    {
      question: "Do you provide child seats?",
      answer: "Child seats can be arranged upon request during booking. Please specify the age and number of children when making your reservation. Additional charges may apply for child seat installation."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
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
              <Button variant="outline" className="border-white/30 text-white hover:bg-white hover:text-gray-900">
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Find answers to common questions about our taxi services and booking process
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-12 text-center">
            <img 
              src="https://images.unsplash.com/photo-1473091534298-04dcbce3278c?auto=format&fit=crop&w=800&q=80" 
              alt="Customer support and help" 
              className="rounded-lg w-full max-w-2xl h-64 object-cover shadow-lg mx-auto mb-6"
            />
            <p className="text-gray-600 max-w-2xl mx-auto">
              Here are answers to the most common questions our customers ask. If you can't find what you're looking for, 
              please don't hesitate to contact our support team.
            </p>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <Card key={index} className="shadow-lg overflow-hidden">
                <div 
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="bg-orange-100 p-2 rounded-lg">
                        <HelpCircle className="h-5 w-5 text-orange-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">{faq.question}</h3>
                    </div>
                    <ChevronDown 
                      className={`h-5 w-5 text-gray-500 transition-transform ${
                        activeIndex === index ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </div>
                {activeIndex === index && (
                  <CardContent className="px-6 pb-6 pt-0">
                    <div className="ml-11">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {/* Still Have Questions */}
          <div className="mt-16">
            <Card className="shadow-lg border-orange-200">
              <CardContent className="p-8 text-center">
                <div className="bg-orange-100 p-4 rounded-full w-fit mx-auto mb-4">
                  <HelpCircle className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Still Have Questions?</h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Our customer support team is available 24/7 to help you with any questions or concerns. 
                  Don't hesitate to reach out to us.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white px-6 py-3">
                    <Phone className="h-4 w-4 mr-2" />
                    Call: +91 73053 05133
                  </Button>
                  <Link to="/contact">
                    <Button variant="outline" className="border-orange-400 text-orange-600 hover:bg-orange-50 px-6 py-3">
                      <Mail className="h-4 w-4 mr-2" />
                      Contact Us
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Book Your Ride?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Now that you have all the information, book your comfortable and safe taxi ride with us.
          </p>
          <Link to="/">
            <Button className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white px-8 py-3 text-lg">
              Book Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default FAQ;