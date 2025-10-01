@@ .. @@
       // Calculate driver batta for multi-day trips
       const calculateDriverBatta = () => {
         if (bookingDetails.return_date && (bookingDetails.trip_type === 'round-trip' || bookingDetails.trip_type === 'hourly')) {
           const days = calculateDaysBetween(bookingDetails.pickup_date, bookingDetails.return_date);
-          return 400 * days;
+          return 500 * days;
         }
-        return 400;
+        return 500;
       };