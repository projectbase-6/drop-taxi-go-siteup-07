import { useState, useCallback } from 'react';

interface DistanceResult {
  distance: number; // in kilometers
  duration: number; // in minutes
  status: 'success' | 'error' | 'loading';
  error?: string;
}

export const useDistanceCalculation = () => {
  const [result, setResult] = useState<DistanceResult>({
    distance: 0,
    duration: 0,
    status: 'success'
  });

  const calculateDistance = useCallback(async (origin: string, destination: string): Promise<DistanceResult> => {
    if (!origin || !destination) {
      return { distance: 0, duration: 0, status: 'error', error: 'Origin and destination are required' };
    }

    setResult(prev => ({ ...prev, status: 'loading' }));

    try {
      // Use Supabase edge function to call Google Distance Matrix API
      const { supabase } = await import('@/integrations/supabase/client');
      const { data, error } = await supabase.functions.invoke('calculate-distance', {
        body: { origin, destination }
      });

      if (error) {
        throw new Error(error.message || 'Failed to calculate distance');
      }

      const distanceResult = {
        distance: data.distance,
        duration: data.duration,
        status: 'success' as const
      };

      setResult(distanceResult);
      return distanceResult;

    } catch (error) {
      const errorResult = {
        distance: 0,
        duration: 0,
        status: 'error' as const,
        error: error instanceof Error ? error.message : 'Failed to calculate distance'
      };

      setResult(errorResult);
      return errorResult;
    }
  }, []);

  return {
    result,
    calculateDistance,
    isLoading: result.status === 'loading',
    isError: result.status === 'error',
    isSuccess: result.status === 'success',
  };
};