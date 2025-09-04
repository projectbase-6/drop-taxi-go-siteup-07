
import React from 'react';
import { ArrowRight, Navigation, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ServiceTypeSelectorProps {
  selectedService: string;
  onServiceSelect: (service: string) => void;
  onBookNow: () => void;
}

const ServiceTypeSelector: React.FC<ServiceTypeSelectorProps> = ({
  selectedService,
  onServiceSelect,
  onBookNow
}) => {
  const services = [
    {
      id: "oneway",
      title: "One Way Trip",
      description: "Perfect for your single journey needs with competitive pricing",
      icon: ArrowRight,
      color: "blue",
      features: ["No return charges", "Transparent pricing", "Professional drivers"]
    },
    {
      id: "roundtrip",
      title: "Round Trip",
      description: "Best value for return journeys with special discounts",
      icon: Navigation,
      color: "green", 
      features: ["Up to 20% savings", "Flexible timing", "Dedicated vehicle"]
    },
    {
      id: "airport",
      title: "Airport Transfer",
      description: "Hassle-free airport transfers with flight tracking",
      icon: MapPin,
      color: "purple",
      features: ["Flight tracking", "Meet & greet", "24/7 availability"]
    }
  ];

  const colorClasses = {
    blue: "bg-blue-500 text-white hover:bg-blue-600",
    green: "bg-green-500 text-white hover:bg-green-600",
    purple: "bg-purple-500 text-white hover:bg-purple-600"
  };

  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {services.map((service) => {
        const IconComponent = service.icon;
        const isSelected = selectedService === service.id;
        
        return (
          <Card 
            key={service.id} 
            className={`text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer ${
              isSelected ? 'ring-2 ring-orange-500 shadow-lg' : ''
            }`}
            onClick={() => onServiceSelect(service.id)}
          >
            <CardContent className="p-8">
              <div className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center ${
                isSelected ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                <IconComponent className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">{service.title}</h3>
              <p className="text-gray-600 mb-6">{service.description}</p>
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center justify-center text-sm text-gray-500">
                    <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button 
                className={`w-full ${
                  isSelected 
                    ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                    : colorClasses[service.color as keyof typeof colorClasses]
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onServiceSelect(service.id);
                  onBookNow();
                }}
              >
                {isSelected ? 'Selected - Book Now' : 'Book Now'}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ServiceTypeSelector;
