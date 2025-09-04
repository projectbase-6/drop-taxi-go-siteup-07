
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Route {
  id: string;
  from_destination: string;
  to_destination: string;
  price: number;
  trip_type: 'one-way' | 'round-trip' | 'airport';
  distance_km?: number;
  rating?: number;
  profile_image?: string;
  created_at: string;
  updated_at: string;
}

export const useRoutes = () => {
  return useQuery({
    queryKey: ['routes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('routes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Route[];
    },
  });
};

export const useCreateRoute = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (newRoute: Omit<Route, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('routes')
        .insert([newRoute])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      toast({
        title: "Success",
        description: "Route created successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create route: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateRoute = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Route> & { id: string }) => {
      const { data, error } = await supabase
        .from('routes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      toast({
        title: "Success",
        description: "Route updated successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update route: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteRoute = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('routes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      toast({
        title: "Success",
        description: "Route deleted successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete route: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};
