import { supabase } from '@/integrations/supabase/client';

export const setupVehicleTypes = async () => {
  try {
    // First, create a default category
    const { data: category, error: categoryError } = await supabase
      .from('vehicle_categories')
      .upsert({
        name: 'Standard',
        base_multiplier: 1.0
      }, { 
        onConflict: 'name',
        ignoreDuplicates: false 
      })
      .select()
      .single();

    if (categoryError) {
      console.error('Error creating category:', categoryError);
      throw categoryError;
    }

    // Clear existing vehicle types
    await supabase.from('vehicle_types').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Create the 5 vehicle types with exact per-km rates
    const vehicleTypes = [
      {
        name: 'SEDAN',
        description: 'Comfortable sedan for city rides - ₹14/km',
        category_id: category.id,
        price_multiplier: 1.0,
        is_active: true,
        base_fare: 0,
        per_minute_rate: 0,
        drop_trip_rate_per_km: 14,
        round_trip_rate_per_km: 14
      },
      {
        name: 'ETIOS',
        description: 'Reliable Toyota Etios - ₹15/km',
        category_id: category.id,
        price_multiplier: 1.0,
        is_active: true,
        base_fare: 0,
        per_minute_rate: 0,
        drop_trip_rate_per_km: 15,
        round_trip_rate_per_km: 15
      },
      {
        name: 'SUV',
        description: 'Spacious SUV for larger groups - ₹19/km',
        category_id: category.id,
        price_multiplier: 1.0,
        is_active: true,
        base_fare: 0,
        per_minute_rate: 0,
        drop_trip_rate_per_km: 19,
        round_trip_rate_per_km: 19
      },
      {
        name: 'INNOVA',
        description: 'Premium Toyota Innova - ₹20/km',
        category_id: category.id,
        price_multiplier: 1.0,
        is_active: true,
        base_fare: 0,
        per_minute_rate: 0,
        drop_trip_rate_per_km: 20,
        round_trip_rate_per_km: 20
      },
      {
        name: 'INNOVA CRYSTA',
        description: 'Luxury Toyota Innova Crysta - ₹22/km',
        category_id: category.id,
        price_multiplier: 1.0,
        is_active: true,
        base_fare: 0,
        per_minute_rate: 0,
        drop_trip_rate_per_km: 22,
        round_trip_rate_per_km: 22
      }
    ];

    const { data, error } = await supabase
      .from('vehicle_types')
      .insert(vehicleTypes)
      .select();

    if (error) {
      console.error('Error creating vehicle types:', error);
      throw error;
    }

    console.log('Vehicle types created successfully:', data);
    return data;
  } catch (error) {
    console.error('Setup failed:', error);
    throw error;
  }
};