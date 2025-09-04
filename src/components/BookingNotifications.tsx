
import React, { useEffect } from 'react';
import { useBookings } from '@/hooks/useBookings';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const BookingNotifications: React.FC = () => {
  const { refetch } = useBookings();
  const { toast } = useToast();

  useEffect(() => {
    // Set up real-time subscription for new bookings
    const channel = supabase
      .channel('booking-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bookings'
        },
        async (payload) => {
          console.log('New booking received:', payload.new);
          
          // Show toast notification
          toast({
            title: "🚖 New Booking Alert!",
            description: `New ride from ${payload.new.pickup_location} to ${payload.new.destination}`,
            duration: 8000,
          });

          // Send notification via edge function
          try {
            const { error } = await supabase.functions.invoke('send-booking-notification', {
              body: {
                ...payload.new,
                vehicle_type: payload.new.vehicle_type || 'sedan',
                trip_type: payload.new.trip_type || 'one-way',
                distance_km: payload.new.distance_km || 0,
                duration_minutes: payload.new.duration_minutes || 0
              },
            });

            if (error) {
              console.error('Failed to send booking notification:', error);
            } else {
              console.log('Booking notification sent successfully');
            }
          } catch (notificationError) {
            console.error('Error sending notification:', notificationError);
          }

          // Refresh bookings list
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast, refetch]);

  return null; // This is a notification handler component, no UI
};

export default BookingNotifications;
