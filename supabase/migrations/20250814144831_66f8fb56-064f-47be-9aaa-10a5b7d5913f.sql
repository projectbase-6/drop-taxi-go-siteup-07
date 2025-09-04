-- Insert sample bookings for admin dashboard demonstration
INSERT INTO public.bookings (
  pickup_date,
  pickup_time,
  pickup_location,
  destination,
  passenger_name,
  passenger_phone,
  passenger_email,
  status,
  estimated_fare,
  actual_fare,
  distance_km,
  duration_minutes,
  driver_name,
  driver_phone,
  vehicle_type,
  trip_type
) VALUES 
-- Active rides
('2024-01-15', '09:30:00', 'Mumbai Airport Terminal 2', 'Bandra West, Mumbai', 'Rajesh Kumar', '+91 9876543210', 'rajesh@example.com', 'in-progress', 850.00, NULL, 28.5, NULL, 'Amit Sharma', '+91 9876543211', 'sedan', 'one-way'),
('2024-01-15', '10:15:00', 'Connaught Place, New Delhi', 'Gurgaon Cyber City', 'Priya Singh', '+91 9876543212', 'priya@example.com', 'confirmed', 650.00, NULL, 22.0, NULL, 'Suresh Gupta', '+91 9876543213', 'suv', 'one-way'),

-- Completed rides (today)
('2024-01-15', '08:00:00', 'Koramangala, Bangalore', 'Electronic City', 'Arjun Mehta', '+91 9876543214', 'arjun@example.com', 'completed', 420.00, 420.00, 15.2, 45, 'Ravi Kumar', '+91 9876543215', 'hatchback', 'one-way'),
('2024-01-15', '07:45:00', 'Marine Drive, Mumbai', 'Powai Lake', 'Kavya Patel', '+91 9876543216', 'kavya@example.com', 'completed', 550.00, 550.00, 18.8, 52, 'Deepak Yadav', '+91 9876543217', 'sedan', 'one-way'),
('2024-01-15', '06:30:00', 'Sector 18, Noida', 'India Gate, Delhi', 'Ankit Jain', '+91 9876543218', 'ankit@example.com', 'completed', 380.00, 380.00, 12.5, 38, 'Manoj Singh', '+91 9876543219', 'hatchback', 'one-way'),

-- Pending bookings
('2024-01-15', '14:00:00', 'Phoenix Mall, Pune', 'Pune Airport', 'Sneha Reddy', '+91 9876543220', 'sneha@example.com', 'pending', 320.00, NULL, 11.2, NULL, NULL, NULL, 'sedan', 'one-way'),
('2024-01-15', '15:30:00', 'Jubilee Hills, Hyderabad', 'HITEC City', 'Rohit Sharma', '+91 9876543221', 'rohit@example.com', 'pending', 280.00, NULL, 8.5, NULL, NULL, NULL, 'hatchback', 'one-way'),

-- Cancelled bookings
('2024-01-15', '11:00:00', 'MG Road, Bangalore', 'Whitefield', 'Pooja Agarwal', '+91 9876543222', 'pooja@example.com', 'cancelled', 450.00, NULL, 16.8, NULL, NULL, NULL, 'suv', 'one-way'),

-- Yesterday's completed rides for revenue calculation
('2024-01-14', '20:30:00', 'Linking Road, Mumbai', 'Andheri East', 'Vikash Gupta', '+91 9876543223', 'vikash@example.com', 'completed', 320.00, 320.00, 12.3, 35, 'Raj Patel', '+91 9876543224', 'sedan', 'one-way'),
('2024-01-14', '19:15:00', 'CP Metro Station, Delhi', 'Karol Bagh', 'Neha Joshi', '+91 9876543225', 'neha@example.com', 'completed', 180.00, 180.00, 7.2, 28, 'Ajay Kumar', '+91 9876543226', 'hatchback', 'one-way');

-- Insert sample customer queries
INSERT INTO public.queries (
  full_name,
  email,
  phone,
  subject,
  message,
  status
) VALUES 
('Rahul Verma', 'rahul.verma@email.com', '+91 9876543230', 'Booking Cancellation Issue', 'I tried to cancel my booking but the system is not allowing me to do so. The booking ID is #BK12345. Please help me cancel this booking as my plans have changed.', 'pending'),

('Anjali Shah', 'anjali.shah@email.com', '+91 9876543231', 'Driver Not Found', 'I have been waiting for 30 minutes but no driver has been assigned to my booking. This is very disappointing. Please assign a driver immediately or cancel my booking.', 'in-progress'),

('Sunil Kapoor', 'sunil.kapoor@email.com', '+91 9876543232', 'Payment Gateway Issue', 'My payment was debited from my account but the booking shows as failed. Please check and resolve this issue. Transaction ID: TXN789456123', 'resolved'),

('Meera Reddy', 'meera.reddy@email.com', '+91 9876543233', 'App Performance', 'The mobile app is very slow and keeps crashing when I try to book a ride. Please fix these technical issues.', 'pending'),

('Karthik Iyer', 'karthik.iyer@email.com', '+91 9876543234', 'Corporate Account Setup', 'We would like to set up a corporate account for our company. Please provide details about corporate rates and billing process.', 'in-progress'),

('Divya Nair', 'divya.nair@email.com', '+91 9876543235', 'Feedback and Suggestions', 'Overall good service but would like to suggest adding more luxury car options and improving the ETA accuracy.', 'resolved');