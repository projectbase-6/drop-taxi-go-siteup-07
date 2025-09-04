import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Query {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'pending' | 'resolved' | 'in-progress';
  created_at: string;
  updated_at: string;
}

export const useQueries = () => {
  return useQuery({
    queryKey: ['queries'],
    queryFn: async () => {
      console.log('useQueries: Fetching queries from Supabase...');
      const { data, error } = await supabase
        .from('queries')
        .select('*')
        .order('created_at', { ascending: false });
      
      console.log('useQueries: Query result - data:', data, 'error:', error);
      if (error) {
        console.error('useQueries: Error fetching queries:', error);
        throw error;
      }
      console.log('useQueries: Successfully fetched', data?.length || 0, 'queries');
      return data as Query[];
    },
  });
};

export const useCreateQuery = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (newQuery: Omit<Query, 'id' | 'created_at' | 'updated_at' | 'status'>) => {
      const { data, error } = await supabase
        .from('queries')
        .insert([{ ...newQuery, status: 'pending' }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queries'] });
      toast({
        title: "Success",
        description: "Your message has been sent successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to send message: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateQuery = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Query> & { id: string }) => {
      const { data, error } = await supabase
        .from('queries')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queries'] });
      toast({
        title: "Success",
        description: "Query status updated successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update query: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};