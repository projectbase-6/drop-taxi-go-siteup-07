import React from 'react';
import { Link } from 'react-router-dom';
import { Car, ArrowLeft, Users, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatedSection } from '@/components/ui/animated-section';
import { AnimatedCard } from '@/components/ui/animated-card';
const Pricing = () => {
  const vehicleTypes = [{
    type: "Sedan (4+1 seats)",
    outstation: "₹14/km",
    roundTrip: "₹12/km",
    image: "/lovable-uploads/b5bd5054-f8a8-4009-9da0-e8a737c3ada6.png",
    features: ["AC Vehicle", "Professional Driver", "Fuel Included", "Comfortable Seating"]
  }, {
    type: "MUV (Innova/Xylo, 7+1 seats)",
    outstation: "₹18-19/km",
    roundTrip: "₹16/km",
    image: "/lovable-uploads/3efc1e4a-7d29-4a14-a62d-cf016eb0a0e5.png",
    features: ["Spacious Interior", "Extra Luggage Space", "Group Travel", "Premium Comfort"]
  }];
  const cityPackages = [{
    duration: "2 hours",
    distance: "20 km",
    sedan: "₹850",
    muv: "₹1,100"
  }, {
    duration: "4 hours",
    distance: "40 km",
    sedan: "₹1,400",
    muv: "₹1,800"
  }, {
    duration: "8 hours",
    distance: "80 km",
    sedan: "₹2,400",
    muv: "₹3,100"
  }, {
    duration: "12 hours",
    distance: "120 km",
    sedan: "₹3,050",
    muv: "₹3,950"
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
              <Button variant="outline" className="border-black/30 hover:bg-white text-slate-950">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 text-white" style={{
      backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('/lovable-uploads/99c9e9be-f620-4c10-be89-150704e56d78.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection animation="fade-up" delay={200}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Transparent Pricing</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Clear and fair pricing with no hidden charges. Choose the package that suits your needs.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Pricing Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Vehicle Types */}
          <div className="mb-16">
            <AnimatedSection animation="fade-up">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Vehicle Types & Rates</h2>
            </AnimatedSection>
            <div className="grid md:grid-cols-2 gap-8">
              {vehicleTypes.map((vehicle, index) => 
                <AnimatedCard key={index} delay={index * 200}>
                  <Card className="shadow-lg overflow-hidden">
                    <div className="h-48 overflow-hidden">
                      <img src={vehicle.image} alt={vehicle.type} className="w-full h-full object-cover" />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">{vehicle.type}</h3>
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Outstation Rate:</span>
                          <span className="font-semibold text-orange-600">{vehicle.outstation}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Round Trip Rate:</span>
                          <span className="font-semibold text-orange-600">{vehicle.roundTrip}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-800">Included Features:</h4>
                        <ul className="space-y-1">
                          {vehicle.features.map((feature, featureIndex) => <li key={featureIndex} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                              <span className="text-gray-600 text-sm">{feature}</span>
                            </li>)}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedCard>
              )}
            </div>
          </div>

          {/* City Packages */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">City/Hourly Packages</h2>
            <Card className="shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white">
                <CardTitle className="text-center">Package Pricing</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left font-semibold text-gray-800">Duration</th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-800">Distance</th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-800">Sedan</th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-800">MUV</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cityPackages.map((pkg, index) => <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 font-semibold text-gray-800">{pkg.duration}</td>
                          <td className="px-6 py-4 text-gray-600">{pkg.distance}</td>
                          <td className="px-6 py-4 font-semibold text-orange-600">{pkg.sedan}</td>
                          <td className="px-6 py-4 font-semibold text-orange-600">{pkg.muv}</td>
                        </tr>)}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Information */}
          <div className="bg-gray-50 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Important Notes</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">What's Included:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">All rates include GST</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Fuel costs included</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Professional driver</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Vehicle maintenance</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Additional Charges May Apply:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-600">Waiting time charges</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-600">Night hour surcharge</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-600">Hill station fees</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-600">Inter-state entry permits</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* More About Tariffs */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-8">How We Calculate Fares</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <img src="/lovable-uploads/99c9e9be-f620-4c10-be89-150704e56d78.png" alt="Transparent taxi tariff calculation" loading="lazy" className="rounded-lg w-full h-64 object-cover shadow-lg" />
            </div>
            <div>
              <ul className="space-y-3 text-gray-700">
                <li>• Distance-based base fare by vehicle category</li>
                <li>• Driver allowance for long trips (where applicable)</li>
                <li>• Tolls and parking charged at actuals</li>
                <li>• Night or hill-station charges if applicable</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 text-white" style={{
      backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('/lovable-uploads/99c9e9be-f620-4c10-be89-150704e56d78.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection animation="fade-up">
            <h2 className="text-3xl font-bold mb-4">Ready to Book?</h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Get instant quotes and enjoy transparent pricing with no hidden charges.
            </p>
            <Link to="/">
              <Button className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                Book Your Ride Now
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>;
};
export default Pricing;