
import { useState, useCallback } from 'react';

export interface ServiceState {
  selectedService: string;
  pickupLocation: string;
  dropLocation: string;
  estimatedPrice: number;
  selectedRoute: any;
  selectedVehicle: any;
  bookingStep: 'form' | 'vehicles' | 'confirmation' | 'success';
}

export const useServiceState = () => {
  const [serviceState, setServiceState] = useState<ServiceState>({
    selectedService: 'oneway',
    pickupLocation: '',
    dropLocation: '',
    estimatedPrice: 0,
    selectedRoute: null,
    selectedVehicle: null,
    bookingStep: 'form'
  });

  const updateService = useCallback((service: string) => {
    setServiceState(prev => ({
      ...prev,
      selectedService: service
    }));
  }, []);

  const updateRoute = useCallback((route: any) => {
    setServiceState(prev => ({
      ...prev,
      pickupLocation: route.from_destination,
      dropLocation: route.to_destination,
      estimatedPrice: route.price,
      selectedRoute: route
    }));
  }, []);

  const updateVehicle = useCallback((vehicle: any, fare: number) => {
    setServiceState(prev => ({
      ...prev,
      selectedVehicle: vehicle,
      estimatedPrice: fare
    }));
  }, []);

  const updateBookingStep = useCallback((step: ServiceState['bookingStep']) => {
    setServiceState(prev => ({
      ...prev,
      bookingStep: step
    }));
  }, []);

  const resetService = useCallback(() => {
    setServiceState({
      selectedService: 'oneway',
      pickupLocation: '',
      dropLocation: '',
      estimatedPrice: 0,
      selectedRoute: null,
      selectedVehicle: null,
      bookingStep: 'form'
    });
  }, []);

  return {
    serviceState,
    updateService,
    updateRoute,
    updateVehicle,
    updateBookingStep,
    resetService
  };
};
