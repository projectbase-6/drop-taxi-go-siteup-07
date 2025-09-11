import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Booking {
  id: string;
  pickup_location: string;
  destination: string;
  pickup_date: string;
  pickup_time: string;
  passenger_name: string;
  passenger_phone: string;
  passenger_email?: string;
  estimated_fare?: number;
  actual_fare?: number;
  distance_km?: number;
  duration_minutes?: number;
  status: string;
  driver_name?: string;
  driver_phone?: string;
  created_at: string;
  updated_at: string;
}

export const useBookings = () => {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      console.log('useBookings: Fetching bookings from Supabase...');
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      
      console.log('useBookings: Query result - data:', data, 'error:', error);
      if (error) {
        console.error('useBookings: Error fetching bookings:', error);
        throw error;
      }
      console.log('useBookings: Successfully fetched', data?.length || 0, 'bookings');
      return data as Booking[];
    },
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>) => {
      console.log('Creating booking:', booking);
      
      const { data, error } = await supabase
        .from('bookings')
        .insert([booking])
        .select()
        .single();

      if (error) throw error;
      
      console.log('Booking created successfully:', data);
      
      // Directly call the notification function to ensure immediate delivery
      try {
        const notificationResult = await supabase.functions.invoke('send-booking-notification', {
          body: {
            ...data,
            vehicle_type: data.vehicle_type || 'sedan',
            trip_type: data.trip_type || 'one-way',
            distance_km: data.distance_km || 0,
            duration_minutes: data.duration_minutes || 0
          },
        });
        
        if (notificationResult.error) {
          console.error('Notification sending failed:', notificationResult.error);
        } else {
          console.log('Notification sent successfully:', notificationResult.data);
        }
      } catch (notificationError) {
        console.error('Error sending notification:', notificationError);
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({
        title: "Success",
        description: "Booking created successfully! You'll receive a confirmation shortly.",
      });
    },
    onError: (error) => {
      console.error('Error creating booking:', error);
      toast({
        title: "Error",
        description: "Failed to create booking",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateBooking = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Booking> & { id: string }) => {
      const { data, error } = await supabase
        .from('bookings')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({
        title: "Success",
        description: "Booking updated successfully",
      });
    },
    onError: (error) => {
      console.error('Error updating booking:', error);
      toast({
        title: "Error",
        description: "Failed to update booking",
        variant: "destructive",
      });
    },
  });
};
