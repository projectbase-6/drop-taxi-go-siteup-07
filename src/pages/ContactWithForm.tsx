import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useCreateQuery } from "@/hooks/useQueries";
import { supabase } from "@/integrations/supabase/client";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  Send,
  Facebook,
  Instagram,
  Twitter,
  ChevronLeft,
  Building2,
  Users,
  Headphones,
  Globe,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ContactWithForm = () => {
  const { toast } = useToast();
  const createQuery = useCreateQuery();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubjectChange = (value: string) => {
    setFormData({
      ...formData,
      subject: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Trim whitespace from form fields
    const trimmedData = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
    };

    console.log("Form data before validation:", trimmedData);
    
    if (!trimmedData.fullName || !trimmedData.email || !trimmedData.subject || !trimmedData.message) {
      console.log("Validation failed - missing fields:", {
        fullName: !trimmedData.fullName,
        email: !trimmedData.email,
        subject: !trimmedData.subject,
        message: !trimmedData.message
      });
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Attempting to create query with data:", trimmedData);
      
      // Create the query
      const result = await createQuery.mutateAsync({
        full_name: trimmedData.fullName,
        email: trimmedData.email,
        phone: trimmedData.phone || undefined,
        subject: trimmedData.subject,
        message: trimmedData.message,
      });

      console.log("Query created successfully:", result);

      // Send email notification
      console.log("Sending email notification for enquiry:", result.id);
      
      try {
        const { data, error } = await supabase.functions.invoke('send-enquiry-notification', {
          body: {
            enquiryId: result.id,
            fullName: trimmedData.fullName,
            email: trimmedData.email,
            phone: trimmedData.phone,
            subject: trimmedData.subject,
            message: trimmedData.message,
            createdAt: result.created_at,
          }
        });

        if (error) {
          console.error("Error sending notification email:", error);
          // Don't throw error here - query was saved successfully
          toast({
            title: "Query Submitted",
            description: "Your message has been submitted successfully to our admin team! We'll get back to you soon.",
          });
        } else {
          console.log("Email notification sent successfully:", data);
          toast({
            title: "Success!",
            description: data?.enquiryRef 
              ? `Your enquiry has been received! Reference: ${data.enquiryRef}. Both you and our admin team have been notified via email.`
              : "Your message has been submitted successfully and both you and our admin team have been notified via email!",
          });
        }
      } catch (emailError) {
        console.error("Email function error:", emailError);
        // Still show success since query was saved
        toast({
          title: "Query Submitted",
          description: "Your message has been submitted successfully to our admin team! We'll get back to you soon.",
        });
      }

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

    } catch (error: any) {
      console.error("Error submitting query:", error);
      
      // More specific error messages
      if (error?.message?.includes('row-level security') || error?.message?.includes('RLS')) {
        toast({
          title: "Database Error",
          description: "There was a permissions issue saving your query. Please contact support at +91 7305305111.",
          variant: "destructive",
        });
      } else if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
        toast({
          title: "Network Error", 
          description: "Please check your internet connection and try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to send your message. Please try again or call us at +91 7305305111.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="p-1 rounded-lg">
                <img 
                  src="/lovable-uploads/3c2d821a-b9d5-45c1-8318-815cb5126366.png" 
                  alt="Drop Taxi Go Logo" 
                  className="h-16 w-16" 
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Drop Taxi Go</h1>
                <p className="text-sm text-muted-foreground">Your Trusted Travel Partner</p>
              </div>
            </Link>
            <Link to="/">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        className="py-16 text-white" 
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('/lovable-uploads/4d9f3f6a-be48-4553-b3bc-03ab0193224e.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Get in touch with us for bookings, support, or any queries. We're here to help 24/7.
          </p>
        </div>
      </section>

      {/* Contact Form and Information */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <MessageSquare className="h-6 w-6 text-primary" />
                    Send Us a Message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Select value={formData.subject} onValueChange={handleSubjectChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Booking Inquiry">Booking Inquiry</SelectItem>
                          <SelectItem value="Support">Support</SelectItem>
                          <SelectItem value="Feedback">Feedback</SelectItem>
                          <SelectItem value="Complaint">Complaint</SelectItem>
                          <SelectItem value="Partnership">Partnership</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Enter your message here..."
                        rows={5}
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground mb-6">Get in Touch</h2>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">24/7 Booking Support</h3>
                      <p className="text-primary text-lg font-semibold">+91 7305305111</p>
                      <p className="text-muted-foreground text-sm">Available round the clock</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Email Support</h3>
                      <p className="text-primary text-lg font-semibold">droptaxigo06@gmail.com</p>
                      <p className="text-muted-foreground text-sm">Send us your queries</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Office Address</h3>
                      <p className="font-medium">Sanviv Services Private Limited</p>
                      <p className="text-muted-foreground">4/15, Baracka Road, 2nd Street,</p>
                      <p className="text-muted-foreground">Nammalvarpet, Chennai-600012.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Service Hours</h3>
                      <p className="text-muted-foreground">24 hours a day, 7 days a week</p>
                      <p className="text-muted-foreground text-sm">Round the clock service</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card>
                <CardHeader>
                  <CardTitle>Connect With Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center space-x-6">
                    <div className="text-center">
                      <div className="bg-blue-100 p-3 rounded-lg mb-2">
                        <Facebook className="h-6 w-6 text-blue-600" />
                      </div>
                      <p className="text-sm text-muted-foreground">Facebook</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-pink-100 p-3 rounded-lg mb-2">
                        <Instagram className="h-6 w-6 text-pink-600" />
                      </div>
                      <p className="text-sm text-muted-foreground">Instagram</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-blue-100 p-3 rounded-lg mb-2">
                        <Twitter className="h-6 w-6 text-blue-400" />
                      </div>
                      <p className="text-sm text-muted-foreground">Twitter</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-orange-100 p-3 rounded-lg mb-2">
                        <Globe className="h-6 w-6 text-orange-600" />
                      </div>
                      <p className="text-sm text-muted-foreground">Website</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Service Areas */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Our Service Areas</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 text-center">
              {['Chennai', 'Bangalore', 'Coimbatore', 'Madurai', 'Trichy', 'Salem', 'Erode', 'Tirunelveli', 'Vellore', 'Thanjavur'].map((city, index) => (
                <div key={index} className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold">{city}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="py-16 text-white" 
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('/lovable-uploads/4d9f3f6a-be48-4553-b3bc-03ab0193224e.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Book Your Ride?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Call us now or visit our website to book your comfortable and safe journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-primary hover:bg-white/90 px-8 py-3 text-lg font-semibold">
              Call: +91 7305305111
            </Button>
            <Link to="/">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8 py-3 text-lg font-semibold">
                Book Online
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactWithForm;