
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Tariff {
  id: string;
  base_fare: number;
  per_minute_rate: number;
  drop_trip_rate_per_km: number;
  round_trip_rate_per_km: number;
  currency: string;
  vehicle_type: string;
  trip_type: string;
  created_at: string;
  updated_at: string;
}

export const useTariffs = () => {
  return useQuery({
    queryKey: ['tariffs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tariffs')
        .select('*')
        .limit(1)
        .single();
      
      if (error) throw error;
      return data as Tariff;
    },
  });
};

export const useUpdateTariff = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (tariff: Partial<Tariff> & { id: string }) => {
      const { data, error } = await supabase
        .from('tariffs')
        .update({
          base_fare: tariff.base_fare,
          per_minute_rate: tariff.per_minute_rate,
          drop_trip_rate_per_km: tariff.drop_trip_rate_per_km,
          round_trip_rate_per_km: tariff.round_trip_rate_per_km,
          updated_at: new Date().toISOString(),
        })
        .eq('id', tariff.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tariffs'] });
      toast({
        title: "Success",
        description: "Tariff rates updated successfully",
      });
    },
    onError: (error) => {
      console.error('Error updating tariff:', error);
      toast({
        title: "Error",
        description: "Failed to update tariff rates",
        variant: "destructive",
      });
    },
  });
};
