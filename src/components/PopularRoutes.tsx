import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MapPin } from 'lucide-react';
import { useRoutes } from '@/hooks/useRoutes';
import { useServiceState } from '@/hooks/useServiceState';
import { useNavigate } from 'react-router-dom';

const PopularRoutes = () => {
  const { data: routes, isLoading } = useRoutes();
  const { updateRoute } = useServiceState();
  const navigate = useNavigate();

  const handleRouteSelect = (route: any) => {
    // Dispatch custom events to update form fields
    window.dispatchEvent(new CustomEvent('updatePickupLocation', { detail: route.from_destination }));
    window.dispatchEvent(new CustomEvent('updateDropLocation', { detail: route.to_destination }));
    
    // Dispatch trip type event
    const tripType = route.trip_type === 'round-trip' ? 'roundtrip' : 'oneway';
    window.dispatchEvent(new CustomEvent('updateTripType', { detail: tripType }));
    
    // Also update service state for compatibility
    updateRoute(route);
    
    // Navigate to landing page first
    navigate('/');
    
    // Then smoothly scroll to top after a brief delay to allow navigation
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 50); // Reduced from 150ms to 50ms
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Routes</h2>
            <p className="text-gray-600">Loading popular routes...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!routes || routes.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Routes</h2>
            <p className="text-gray-600">No routes available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Routes</h2>
          <p className="text-gray-600">Choose from our most popular destinations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.slice(0, 6).map((route) => (
            <Card key={route.id} className="group hover:shadow-lg transition-shadow border border-gray-200">
              <CardContent className="p-6">
                {route.profile_image && (
                  <div className="mb-4 overflow-hidden rounded-lg">
                    <img 
                      src={route.profile_image} 
                      alt={`${route.from_destination} to ${route.to_destination}`}
                      className="w-full h-40 object-cover rounded-lg transition-transform duration-300 group-hover:translate-y-2"
                    />
                  </div>
                )}
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-lg font-semibold text-gray-900">
                      {route.from_destination} → {route.to_destination}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-primary">
                      ₹{route.price}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">
                        {route.rating || '4.8'}
                      </span>
                    </div>
                  </div>
                  
                  {route.distance_km && (
                    <div className="text-sm text-gray-600">
                      Distance: {route.distance_km} km
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500 capitalize">
                    {route.trip_type.replace('-', ' ')} trip
                  </div>
                  
                  <Button 
                    onClick={() => handleRouteSelect(route)}
                    className="w-full"
                  >
                    Select Route
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularRoutes;