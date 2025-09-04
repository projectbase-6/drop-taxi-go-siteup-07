import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Mail, MapPin, Clock, Users, Shield, Car, Building, Calendar, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useVehicleTypes } from "@/hooks/useVehicleTypes";
import LocationAutocomplete from "@/components/LocationAutocomplete";
const CorporateQuote = () => {
  const { data: vehicleTypes, isLoading: vehicleTypesLoading } = useVehicleTypes();
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    serviceType: "",
    pickupLocation: "",
    dropLocation: "",
    date: "",
    time: "",
    passengers: "",
    vehicleType: "",
    tripType: "",
    duration: "",
    additionalRequirements: ""
  });
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['companyName', 'contactPerson', 'email', 'phone', 'serviceType', 'tripType', 'vehicleType', 'pickupLocation', 'dropLocation', 'date', 'time'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      alert('Please fill in all required fields');
      return;
    }

    // Create WhatsApp message with form data
    const message = `*Corporate Travel Quote Request*

*Company Information:*
• Company Name: ${formData.companyName}
• Contact Person: ${formData.contactPerson}
• Email: ${formData.email}
• Phone: ${formData.phone}

*Service Requirements:*
• Service Type: ${formData.serviceType}
• Trip Type: ${formData.tripType}
• Vehicle Type: ${formData.vehicleType}
${formData.passengers ? `• Number of Passengers: ${formData.passengers}` : ''}

*Travel Details:*
• Pickup Location: ${formData.pickupLocation}
• Drop Location: ${formData.dropLocation}
• Date: ${formData.date}
• Time: ${formData.time}
${formData.duration ? `• Duration: ${formData.duration}` : ''}

${formData.additionalRequirements ? `*Additional Requirements:*
${formData.additionalRequirements}

` : ''}Can I just get the quote for this trip?`;

    // Create WhatsApp URL with the message
    const whatsappURL = `https://wa.me/917305305111?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappURL, '_blank');
  };
  return <div className="min-h-screen bg-white">
      {/* Header Navigation */}
      <nav className="bg-white shadow-md py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-3">
              <img src="/lovable-uploads/2f66fff6-4554-47eb-aaae-a128f3384671.png" alt="DropTaxiGo Logo" className="h-12 w-12 object-contain" />
              <span className="text-xl font-bold text-primary">DropTaxiGo</span>
            </Link>
            <Link to="/corporate-travel" className="flex items-center gap-2 text-gray-700 hover:text-primary">
              <ArrowLeft className="h-4 w-4" />
              Back to Corporate Travel
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Get Your Corporate Travel Quote
          </h1>
          <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Fill out the form below to receive a customized quote for your corporate transportation needs. 
            Our team will get back to you within 24 hours with a detailed proposal.
          </p>
        </div>
      </section>

      {/* Quote Form */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center">Corporate Travel Quote Request</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Company Information */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Building className="h-5 w-5" />
                        Company Information
                      </h3>
                      <div>
                        <Label htmlFor="companyName">Company Name *</Label>
                        <Input id="companyName" value={formData.companyName} onChange={e => handleInputChange("companyName", e.target.value)} required />
                      </div>
                      <div>
                        <Label htmlFor="contactPerson">Contact Person *</Label>
                        <Input id="contactPerson" value={formData.contactPerson} onChange={e => handleInputChange("contactPerson", e.target.value)} required />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input id="email" type="email" value={formData.email} onChange={e => handleInputChange("email", e.target.value)} required />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input id="phone" type="tel" value={formData.phone} onChange={e => handleInputChange("phone", e.target.value)} required />
                      </div>
                    </div>

                    {/* Service Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Car className="h-5 w-5" />
                        Service Requirements
                      </h3>
                      <div>
                        <Label htmlFor="serviceType">Service Type *</Label>
                        <Select onValueChange={value => handleInputChange("serviceType", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select service type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="employee-transport">Employee Transportation</SelectItem>
                            <SelectItem value="business-meetings">Business Meetings & Events</SelectItem>
                            <SelectItem value="airport-transfers">Airport Transfers</SelectItem>
                            <SelectItem value="outstation-travel">Outstation Business Travel</SelectItem>
                            <SelectItem value="custom">Custom Requirements</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="tripType">Trip Type *</Label>
                        <Select onValueChange={value => handleInputChange("tripType", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select trip type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="one-way">One Way</SelectItem>
                            <SelectItem value="round-trip">Round Trip</SelectItem>
                            <SelectItem value="hourly">Hourly Rental</SelectItem>
                            <SelectItem value="monthly">Monthly Package</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="vehicleType">Vehicle Type *</Label>
                        <Select onValueChange={value => handleInputChange("vehicleType", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select vehicle type" />
                          </SelectTrigger>
                          <SelectContent>
                            {vehicleTypesLoading ? (
                              <SelectItem value="loading" disabled>Loading vehicle types...</SelectItem>
                            ) : (
                              vehicleTypes?.map((vehicleType) => (
                                <SelectItem key={vehicleType.id} value={vehicleType.name}>
                                  {vehicleType.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="passengers">Number of Passengers</Label>
                        <Input id="passengers" type="number" value={formData.passengers} onChange={e => handleInputChange("passengers", e.target.value)} placeholder="e.g., 4" />
                      </div>
                    </div>
                  </div>

                  {/* Travel Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Travel Details
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="pickupLocation">Pickup Location *</Label>
                        <LocationAutocomplete 
                          value={formData.pickupLocation}
                          onChange={(value) => handleInputChange("pickupLocation", value)}
                          placeholder="Enter pickup address"
                        />
                      </div>
                      <div>
                        <Label htmlFor="dropLocation">Drop Location *</Label>
                        <LocationAutocomplete 
                          value={formData.dropLocation}
                          onChange={(value) => handleInputChange("dropLocation", value)}
                          placeholder="Enter destination address"
                        />
                      </div>
                      <div>
                        <Label htmlFor="date">Preferred Date *</Label>
                        <Input id="date" type="date" value={formData.date} onChange={e => handleInputChange("date", e.target.value)} required />
                      </div>
                      <div>
                        <Label htmlFor="time">Preferred Time *</Label>
                        <Input id="time" type="time" value={formData.time} onChange={e => handleInputChange("time", e.target.value)} required />
                      </div>
                      <div>
                        <Label htmlFor="duration">Duration (if applicable)</Label>
                        <Input id="duration" value={formData.duration} onChange={e => handleInputChange("duration", e.target.value)} placeholder="e.g., 3 hours, 2 days" />
                      </div>
                    </div>
                  </div>

                  {/* Additional Requirements */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Additional Requirements</h3>
                    <div>
                      <Label htmlFor="additionalRequirements">Special Instructions or Requirements</Label>
                      <Textarea id="additionalRequirements" value={formData.additionalRequirements} onChange={e => handleInputChange("additionalRequirements", e.target.value)} placeholder="Please specify any special requirements, frequency of service, budget considerations, etc." rows={4} />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="text-center pt-6">
                    <Button type="submit" className="bg-primary hover:bg-primary/90 px-8 py-3 text-lg">
                      Request Quote
                    </Button>
                    <p className="text-sm text-gray-600 mt-4">
                      * Our team will review your requirements and send you a detailed quote within 24 hours.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Immediate Assistance?</h2>
            <p className="text-gray-600">Our corporate travel specialists are ready to help</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="text-center">
              <CardContent className="p-6">
                <Phone className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Call Us</h3>
                <p className="text-gray-600">+91 7305305111</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Mail className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Email Us</h3>
                <p className="text-gray-600">droptaxigo06@gmail.com</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Clock className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Response Time</h3>
                <p className="text-gray-600">Within 24 hours</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <img src="/lovable-uploads/2f66fff6-4554-47eb-aaae-a128f3384671.png" alt="DropTaxiGo Logo" className="h-6 w-6 object-contain" />
              <span className="text-xl font-bold">DropTaxiGo</span>
            </div>
            <div className="flex gap-6">
              <Link to="/" className="hover:text-primary">Home</Link>
              <Link to="/services" className="hover:text-primary">Services</Link>
              <Link to="/corporate-travel" className="hover:text-primary">Corporate</Link>
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
export default CorporateQuote;