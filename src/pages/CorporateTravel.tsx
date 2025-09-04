import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Mail, MapPin, Clock, Users, Shield, Car, CheckCircle, Building, CreditCard, FileText, Star, MessageCircle, ArrowRight, Calendar, Briefcase, Globe, Award, TrendingUp, Zap } from "lucide-react";
import { Link } from "react-router-dom";
const CorporateTravel = () => {
  const corporateFeatures = [{
    icon: <Building className="h-8 w-8 text-blue-600" />,
    title: "Dedicated Account Manager",
    description: "Personal account manager for your business travel needs"
  }, {
    icon: <CreditCard className="h-8 w-8 text-blue-600" />,
    title: "Corporate Billing",
    description: "Monthly invoicing with detailed trip reports and GST compliance"
  }, {
    icon: <FileText className="h-8 w-8 text-blue-600" />,
    title: "Trip Reports & Analytics",
    description: "Comprehensive reports for expense management and travel analytics"
  }, {
    icon: <Clock className="h-8 w-8 text-blue-600" />,
    title: "Priority Booking",
    description: "Guaranteed cab availability with priority support 24/7"
  }, {
    icon: <Users className="h-8 w-8 text-blue-600" />,
    title: "Multi-User Management",
    description: "Manage multiple employees and departments from one dashboard"
  }, {
    icon: <Shield className="h-8 w-8 text-blue-600" />,
    title: "Enhanced Security",
    description: "Background-verified drivers and real-time tracking for safety"
  }];
  const corporateServices = [{
    title: "Employee Transportation",
    description: "Daily office commute solutions for your workforce",
    features: ["Regular pickup/drop routes", "Flexible timing", "Cost-effective rates", "Driver consistency"],
    icon: <Users className="h-12 w-12 text-green-600" />
  }, {
    title: "Business Meetings & Events",
    description: "Professional transportation for client meetings and corporate events",
    features: ["Executive sedans & SUVs", "Professional chauffeurs", "Meet & greet service", "Corporate appearance"],
    icon: <Briefcase className="h-12 w-12 text-purple-600" />
  }, {
    title: "Airport Transfers",
    description: "Seamless airport transportation for business travelers",
    features: ["Flight tracking", "Meet & assist service", "Luggage handling", "Premium vehicles"],
    icon: <Globe className="h-12 w-12 text-orange-600" />
  }, {
    title: "Outstation Business Travel",
    description: "Long-distance travel for business meetings and conferences",
    features: ["Experienced drivers", "Route optimization", "Comfortable vehicles", "Rest stop planning"],
    icon: <Car className="h-12 w-12 text-teal-600" />
  }];
  const pricingPlans = [{
    name: "Startup",
    price: "₹15,000",
    period: "/month",
    description: "Perfect for small businesses",
    features: ["Up to 50 trips per month", "Basic reporting", "Email support", "Standard vehicles", "Monthly billing"],
    recommended: false
  }, {
    name: "Professional",
    price: "₹35,000",
    period: "/month",
    description: "Ideal for growing companies",
    features: ["Up to 150 trips per month", "Advanced analytics", "Priority support", "Premium vehicles", "Dedicated account manager", "Custom billing terms"],
    recommended: true
  }, {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations",
    features: ["Unlimited trips", "Custom reporting", "24/7 phone support", "Luxury fleet access", "On-site account management", "API integration", "Custom SLA"],
    recommended: false
  }];
  const testimonials = [{
    company: "Tech Solutions Pvt Ltd",
    logo: "TS",
    person: "Rajesh Kumar",
    position: "HR Director",
    review: "DropTaxiGo has streamlined our employee transportation completely. The billing system and trip reports are excellent for our finance team.",
    rating: 5
  }, {
    company: "Global Consulting Inc",
    logo: "GC",
    person: "Priya Sharma",
    position: "Operations Manager",
    review: "Professional service with reliable drivers. Our clients are always impressed with the quality of transportation we provide.",
    rating: 5
  }, {
    company: "Manufacturing Corp",
    logo: "MC",
    person: "Suresh Patel",
    position: "Admin Head",
    review: "Cost-effective solution for our daily employee shuttle needs. The account manager is very responsive and helpful.",
    rating: 4
  }];
  const benefits = ["Reduce transportation costs by up to 30%", "Eliminate expense reimbursement hassles", "Improve employee productivity and satisfaction", "Enhanced corporate image with professional service", "24/7 customer support and emergency assistance", "Detailed reporting for better expense management"];
  return <div className="min-h-screen bg-white">
      {/* Header Navigation */}
      <nav className="bg-white shadow-md py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-3">
              <img src="/lovable-uploads/2f66fff6-4554-47eb-aaae-a128f3384671.png" alt="DropTaxiGo Logo" className="h-12 w-12 object-contain" />
              <span className="text-xl font-bold text-primary">DropTaxiGo</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-gray-700 hover:text-primary font-medium text-sm">Home</Link>
              <Link to="/services" className="text-gray-700 hover:text-primary font-medium text-sm">Services</Link>
              <Link to="/pricing" className="text-gray-700 hover:text-primary font-medium text-sm">Tariff</Link>
              <Link to="/about" className="text-gray-700 hover:text-primary font-medium text-sm">About</Link>
              <Link to="/contact" className="text-gray-700 hover:text-primary font-medium text-sm">Contact</Link>
              <Link to="/corporate-quote">
                <Button className="bg-primary hover:bg-primary/90 text-white px-4 py-1.5 rounded-lg text-sm">
                  Get Quote
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Corporate Travel Solutions
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Streamline your business transportation with our professional corporate taxi services. 
                Reliable, cost-effective, and tailored for your business needs.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 rounded-full p-3">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Verified Professional Drivers</h3>
                    <p className="text-blue-100">Background-checked and professionally trained chauffeurs</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 rounded-full p-3">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">24/7 Service Availability</h3>
                    <p className="text-blue-100">Round-the-clock support for all your business travel needs</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 rounded-full p-3">
                    <Building className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Enterprise Solutions</h3>
                    <p className="text-blue-100">Customized transportation plans for businesses of all sizes</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-6">Why Choose DropTaxiGo for Corporate Travel?</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-1" />
                  <div>
                    <h4 className="font-semibold">Cost-Effective Solutions</h4>
                    <p className="text-blue-100 text-sm">Save up to 30% on corporate transportation costs</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-1" />
                  <div>
                    <h4 className="font-semibold">Reliable Service</h4>
                    <p className="text-blue-100 text-sm">99.5% on-time performance with real-time tracking</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-1" />
                  <div>
                    <h4 className="font-semibold">Professional Fleet</h4>
                    <p className="text-blue-100 text-sm">Well-maintained vehicles suitable for business professionals</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-1" />
                  <div>
                    <h4 className="font-semibold">Easy Expense Management</h4>
                    <p className="text-blue-100 text-sm">Automated billing and detailed trip reports</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Corporate Services */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Our Corporate Services?</h2>
            <p className="text-xl text-gray-600">Comprehensive transportation solutions designed for modern businesses</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {corporateFeatures.map((feature, index) => <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Corporate Services */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Corporate Services</h2>
            <p className="text-xl text-gray-600">Tailored transportation solutions for every business need</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {corporateServices.map((service, index) => <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="bg-gray-100 rounded-lg p-4">
                      {service.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                      <p className="text-gray-600 mb-4">{service.description}</p>
                      <ul className="space-y-2">
                        {service.features.map((feature, idx) => <li key={idx} className="flex items-center gap-2 text-gray-700">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>{feature}</span>
                          </li>)}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Benefits of Corporate Partnership</h2>
              <p className="text-xl text-gray-600 mb-8">
                Transform your business transportation with our comprehensive corporate solutions
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
                    <span className="text-gray-700 text-lg">{benefit}</span>
                  </li>)}
              </ul>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Corporate Dashboard Features</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                  <span>Real-time trip tracking and analytics</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <span>Automated expense reporting</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                  <span>Employee management system</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                  <span>Flexible billing options</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Corporate Pricing Plans</h2>
            <p className="text-xl text-gray-600">Choose the plan that fits your business needs</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => <Card key={index} className={`relative ${plan.recommended ? 'border-blue-500 border-2' : ''} hover:shadow-lg transition-shadow`}>
                {plan.recommended && <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>}
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-4">{plan.description}</p>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-primary">{plan.price}</span>
                      <span className="text-gray-600">{plan.period}</span>
                    </div>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => <li key={idx} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-gray-700">{feature}</span>
                      </li>)}
                  </ul>
                  
                  <Button className={`w-full ${plan.recommended ? 'bg-blue-500 hover:bg-blue-600' : ''}`}>
                    {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                  </Button>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Corporate Clients Say</h2>
            <p className="text-xl text-gray-600">Trusted by leading companies across South India</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">
                      {testimonial.logo}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{testimonial.company}</h4>
                      <div className="flex">
                        {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />)}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.review}"</p>
                  <div className="text-sm text-gray-600">
                    <div className="font-semibold">{testimonial.person}</div>
                    <div>{testimonial.position}</div>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Corporate Success Stories</h2>
            <p className="text-gray-600">See how businesses improved travel efficiency with DropTaxiGo</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[ 
              'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80'
            ].map((src, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="h-40 rounded-lg bg-gray-100 mb-4 overflow-hidden">
                    <img src={src} alt={`Corporate travel case study ${i + 1}`} loading="lazy" className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Case Study {i + 1}</h3>
                  <p className="text-gray-600 text-sm">Reduced monthly travel costs by 25% with centralized billing and optimized routing.</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Business Transportation?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join hundreds of companies that trust DropTaxiGo for their corporate travel needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+917305305111">
              <Button className="bg-white hover:bg-gray-100 px-8 py-3 font-semibold text-blue-400">
                <Phone className="h-4 w-4 mr-2" />
                Call +91 7305305111
              </Button>
            </a>
            <a href="mailto:droptaxigo06@gmail.com">
              <Button variant="outline" className="border-white hover:bg-white px-8 py-3 font-semibold text-blue-400">
                <Mail className="h-4 w-4 mr-2" />
                Email Us
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <img src="/lovable-uploads/d96912a8-5f37-4213-8d42-fcaf19e0c4bc.png" alt="DropTaxiGo Logo" className="h-6 w-6 object-contain" />
              <span className="text-xl font-bold">DropTaxiGo</span>
            </div>
            <div className="flex gap-6">
              <Link to="/" className="hover:text-primary">Home</Link>
              <Link to="/services" className="hover:text-primary">Services</Link>
              <Link to="/round-trips" className="hover:text-primary">Round Trips</Link>
              <Link to="/about" className="hover:text-primary">About</Link>
              <Link to="/contact" className="hover:text-primary">Contact</Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 Droptaxigo . All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>;
};
export default CorporateTravel;