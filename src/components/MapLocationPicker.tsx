
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface MapLocationPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: string, coordinates: [number, number]) => void;
  initialLocation?: string;
  pickerType?: 'pickup' | 'drop';
}

// Global map instance management
let globalMapboxToken: string | null = null;
let tokenFetchPromise: Promise<string> | null = null;

const fetchMapboxToken = async (): Promise<string> => {
  if (globalMapboxToken) return globalMapboxToken;
  if (tokenFetchPromise) return tokenFetchPromise;
  
  tokenFetchPromise = (async () => {
    const { data: tokenData, error } = await supabase.functions.invoke('mapbox-token');
    if (error || !tokenData?.token) {
      throw new Error(`Failed to load map: ${error?.message || 'Token not available'}`);
    }
    globalMapboxToken = tokenData.token;
    mapboxgl.accessToken = tokenData.token;
    return tokenData.token;
  })();
  
  return tokenFetchPromise;
};

const MapLocationPicker: React.FC<MapLocationPickerProps> = ({
  isOpen,
  onClose,
  onLocationSelect,
  initialLocation,
  pickerType = 'pickup'
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [selectedCoordinates, setSelectedCoordinates] = useState<[number, number] | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [isMapLoading, setIsMapLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Preload token immediately when component mounts
  useEffect(() => {
    fetchMapboxToken().catch(console.error);
  }, []);

  // Optimized map initialization with faster loading
  useEffect(() => {
    if (!isOpen || !mapContainer.current) return;

    const initializeMap = async () => {
      try {
        setIsMapLoading(true);
        setError(null);
        setIsMapReady(false);

        // Get token (should be instant if preloaded)
        await fetchMapboxToken();

        // Clean up existing map if any
        if (map.current) {
          map.current.remove();
          map.current = null;
        }

        // Create new map instance with optimized settings for faster loading
        map.current = new mapboxgl.Map({
          container: mapContainer.current!,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [77.1025, 28.7041], // Default to Delhi, India
          zoom: 12,
          attributionControl: false,
          antialias: false // Disable for faster loading
        });

        // Add navigation controls
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Optimized map load event
        map.current.on('load', () => {
          setIsMapReady(true);
          setIsMapLoading(false);
        });

        // Faster geolocation with shorter timeout
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            position => {
              const { longitude, latitude } = position.coords;
              map.current?.flyTo({
                center: [longitude, latitude],
                zoom: 15,
                duration: 500 // Faster animation
              });
            },
            error => console.log('Geolocation error:', error),
            { timeout: 2000 } // Shorter timeout for faster loading
          );
        }

        // Handle map clicks
        map.current.on('click', async e => {
          const { lng, lat } = e.lngLat;
          setSelectedCoordinates([lng, lat]);

          // Remove existing marker
          if (marker.current) {
            marker.current.remove();
          }

          // Add new marker
          marker.current = new mapboxgl.Marker({
            color: '#f97316'
          }).setLngLat([lng, lat]).addTo(map.current!);

          // Reverse geocode to get address
          try {
            const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${globalMapboxToken}`);
            const data = await response.json();
            if (data.features && data.features.length > 0) {
              setSelectedAddress(data.features[0].place_name);
            }
          } catch (error) {
            console.error('Error reverse geocoding:', error);
            setSelectedAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
          }
        });

      } catch (error) {
        console.error('Error initializing map:', error);
        setError('Failed to initialize map. Please try again.');
        setIsMapLoading(false);
      }
    };

    // Small delay to ensure DOM is ready, then initialize immediately
    setTimeout(initializeMap, 50);
  }, [isOpen]);

  // Cleanup when dialog closes
  useEffect(() => {
    if (!isOpen) {
      if (marker.current) {
        marker.current.remove();
        marker.current = null;
      }
      setSelectedCoordinates(null);
      setSelectedAddress('');
      setIsMapReady(false);
    }
  }, [isOpen]);

  // Final cleanup on unmount
  useEffect(() => {
    return () => {
      if (marker.current) {
        marker.current.remove();
        marker.current = null;
      }
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  const handleConfirmLocation = () => {
    if (selectedCoordinates && selectedAddress) {
      onLocationSelect(selectedAddress, selectedCoordinates);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedCoordinates(null);
    setSelectedAddress('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-orange-500" />
            Select {pickerType === 'pickup' ? 'Pickup' : 'Drop'} Location
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-full">
          {/* Map Container - Removed excessive padding for faster rendering */}
          <div className="flex-1 relative rounded-lg overflow-hidden border">
            <div ref={mapContainer} className="w-full h-full" />
            
            {/* Simplified Loading State */}
            {isMapLoading && !error && (
              <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-gray-600">Loading map...</span>
                </div>
              </div>
            )}
            
            {/* Error State */}
            {error && (
              <div className="absolute inset-0 bg-red-50 flex items-center justify-center">
                <div className="bg-white p-4 rounded-lg border border-red-200 max-w-sm text-center">
                  <p className="text-red-600 mb-2">{error}</p>
                  <Button 
                    onClick={() => {
                      setError(null);
                      globalMapboxToken = null;
                      tokenFetchPromise = null;
                      window.location.reload();
                    }} 
                    variant="outline" 
                    size="sm"
                  >
                    Retry
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* Address Display */}
          {selectedAddress && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Selected Location:</p>
              <p className="font-medium text-foreground">{selectedAddress}</p>
            </div>
          )}
          
          {/* Instructions */}
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              📍 Click anywhere on the map to pin your {pickerType} location
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3 mt-4">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmLocation} 
              disabled={!selectedCoordinates} 
              className="flex-1 bg-orange-500 hover:bg-orange-600"
            >
              Confirm Location
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MapLocationPicker;
