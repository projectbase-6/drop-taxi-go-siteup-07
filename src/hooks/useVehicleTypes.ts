import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface VehicleCategory {
  id: string;
  name: string;
  base_multiplier: number;
  created_at: string;
  updated_at: string;
}

export interface VehicleType {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price_multiplier: number;
  is_active: boolean;
  base_fare?: number;
  per_minute_rate?: number;
  drop_trip_rate_per_km?: number;
  round_trip_rate_per_km?: number;
  created_at: string;
  updated_at: string;
}

export interface VehicleTypeWithCategory extends VehicleType {
  category: VehicleCategory;
}

export const useVehicleCategories = () => {
  return useQuery({
    queryKey: ['vehicle-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicle_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as VehicleCategory[];
    },
  });
};

export const useVehicleTypes = () => {
  return useQuery({
    queryKey: ['vehicle-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicle_types')
        .select(`
          *,
          category:vehicle_categories(*)
        `)
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data as VehicleTypeWithCategory[];
    },
  });
};

export const useCreateVehicleCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (category: Omit<VehicleCategory, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('vehicle_categories')
        .insert(category)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-categories'] });
      toast({
        title: "Success",
        description: "Vehicle category created successfully",
      });
    },
    onError: (error) => {
      console.error('Error creating vehicle category:', error);
      toast({
        title: "Error",
        description: "Failed to create vehicle category",
        variant: "destructive",
      });
    },
  });
};

export const useCreateVehicleType = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (vehicleType: Omit<VehicleType, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('vehicle_types')
        .insert(vehicleType)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-types'] });
      toast({
        title: "Success",
        description: "Vehicle type created successfully",
      });
    },
    onError: (error) => {
      console.error('Error creating vehicle type:', error);
      toast({
        title: "Error",
        description: "Failed to create vehicle type",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateVehicleType = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (vehicleType: Partial<VehicleType> & { id: string }) => {
      const { data, error } = await supabase
        .from('vehicle_types')
        .update({
          ...vehicleType,
          updated_at: new Date().toISOString(),
        })
        .eq('id', vehicleType.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-types'] });
      toast({
        title: "Success",
        description: "Vehicle type updated successfully",
      });
    },
    onError: (error) => {
      console.error('Error updating vehicle type:', error);
      toast({
        title: "Error",
        description: "Failed to update vehicle type",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteVehicleType = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('vehicle_types')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-types'] });
      toast({
        title: "Success",
        description: "Vehicle type deleted successfully",
      });
    },
    onError: (error) => {
      console.error('Error deleting vehicle type:', error);
      toast({
        title: "Error",
        description: "Failed to delete vehicle type",
        variant: "destructive",
      });
    },
  });
};