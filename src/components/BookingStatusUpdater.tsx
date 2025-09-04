
import React, { useEffect } from 'react';
import { useBookings } from '@/hooks/useBookings';
import { supabase } from '@/integrations/supabase/client';

const BookingStatusUpdater: React.FC = () => {
  const { refetch } = useBookings();

  useEffect(() => {
    // Set up real-time subscription for booking updates
    const channel = supabase
      .channel('booking-status-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bookings'
        },
        (payload) => {
          console.log('Booking updated:', payload);
          // Refresh the bookings list when any booking is updated
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  return null; // This is a utility component with no UI
};

export default BookingStatusUpdater;
