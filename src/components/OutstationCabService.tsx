
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, ArrowRight } from 'lucide-react';
import { useRoutes } from '@/hooks/useRoutes';

interface OutstationCabServiceProps {
  onRouteSelect: (route: any) => void;
}

const OutstationCabService: React.FC<OutstationCabServiceProps> = ({ onRouteSelect }) => {
  const { data: routes = [] } = useRoutes();
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  // Group routes by columns for display
  const groupedRoutes = routes.reduce((acc: any[], route: any, index: number) => {
    const columnIndex = index % 3;
    if (!acc[columnIndex]) acc[columnIndex] = [];
    acc[columnIndex].push(route);
    return acc;
  }, []);

  const handleRouteClick = (route: any) => {
    setSelectedRoute(route.id);
    
    // Dispatch custom events to update form fields
    window.dispatchEvent(new CustomEvent('updatePickupLocation', { detail: route.from_destination }));
    window.dispatchEvent(new CustomEvent('updateDropLocation', { detail: route.to_destination }));
    
    // Dispatch trip type event
    const tripType = route.trip_type === 'round-trip' ? 'roundtrip' : 'oneway';
    window.dispatchEvent(new CustomEvent('updateTripType', { detail: tripType }));
    
    // Call the onRouteSelect callback
    onRouteSelect(route);
    
    // Scroll to top immediately to show the form
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <section className="py-16 bg-yellow-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            SS DROP TAXI <span className="text-orange-500">OUTSTATION CAB SERVICE</span>
          </h2>
          <div className="bg-yellow-400 inline-block px-6 py-2 rounded-full mb-6">
            <h3 className="text-lg font-bold text-black">CAB SERVICE FROM CHENNAI</h3>
          </div>
        </div>

        {routes.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {groupedRoutes.map((column, columnIndex) => (
              <div key={columnIndex} className="space-y-3">
                {column.map((route: any) => (
                  <Card 
                    key={route.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105 ${
                      selectedRoute === route.id ? 'ring-2 ring-orange-500 bg-orange-50' : ''
                    }`}
                    onClick={() => handleRouteClick(route)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                            <span className="text-black font-bold text-sm">🚗</span>
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-gray-800">
                              {route.from_destination} to {route.to_destination}
                            </p>
                            <p className="text-xs text-gray-500">
                              {route.trip_type} • {route.distance_km ? `${route.distance_km}km` : 'Distance TBD'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-orange-600">₹{route.price}</p>
                          <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No routes available at the moment.</p>
            <p className="text-sm text-gray-500">Please check back later or contact us for custom routes.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default OutstationCabService;
