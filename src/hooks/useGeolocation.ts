import { useState, useCallback } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

interface UseGeolocationResult {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
  getCurrentLocation: () => Promise<void>;
  requestPermissions: () => Promise<boolean>;
}

export const useGeolocation = (): UseGeolocationResult => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestPermissions = useCallback(async (): Promise<boolean> => {
    try {
      if (Capacitor.isNativePlatform()) {
        const permissions = await Geolocation.requestPermissions();
        return permissions.location === 'granted';
      } else {
        // For web, we'll handle permissions in getCurrentLocation
        return true;
      }
    } catch (err) {
      console.error('Error requesting location permissions:', err);
      setError('Failed to request location permissions');
      return false;
    }
  }, []);

  const getCurrentLocation = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      if (Capacitor.isNativePlatform()) {
        // Use Capacitor Geolocation for native platforms
        const position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000
        });

        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      } else {
        // Fallback to web geolocation API
        if (!navigator.geolocation) {
          throw new Error('Geolocation is not supported by this browser');
        }

        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve,
            reject,
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 60000
            }
          );
        });

        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      }
    } catch (err: any) {
      console.error('Error getting current location:', err);
      
      if (err.code === 1) {
        setError('Location access denied. Please enable location permissions.');
      } else if (err.code === 2) {
        setError('Location unavailable. Please check your GPS settings.');
      } else if (err.code === 3) {
        setError('Location request timed out. Please try again.');
      } else {
        setError('Unable to get your location. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    location,
    loading,
    error,
    getCurrentLocation,
    requestPermissions
  };
};