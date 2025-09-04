import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DistanceRequest {
  origin: string;
  destination: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { origin, destination }: DistanceRequest = await req.json();
    
    if (!origin || !destination) {
      return new Response(
        JSON.stringify({ error: 'Origin and destination are required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }

    // Get Google Maps API key from environment
    const GOOGLE_MAPS_API_KEY = Deno.env.get('GOOGLE_MAPS_API_KEY');
    
    if (!GOOGLE_MAPS_API_KEY) {
      console.error('GOOGLE_MAPS_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Google Maps API key not configured' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      );
    }

    // Call Google Distance Matrix API
    const googleApiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&units=metric&key=${GOOGLE_MAPS_API_KEY}`;
    
    console.log('Calling Google Distance Matrix API for:', { origin, destination });
    
    const response = await fetch(googleApiUrl);
    const data = await response.json();

    console.log('Google API response:', JSON.stringify(data, null, 2));

    if (data.status !== 'OK') {
      throw new Error(`Google API error: ${data.status} - ${data.error_message || 'Unknown error'}`);
    }

    const element = data.rows[0]?.elements[0];
    
    if (!element || element.status !== 'OK') {
      throw new Error(`Route not found: ${element?.status || 'No route data'}`);
    }

    // Extract distance in kilometers and duration in minutes
    const distanceKm = Math.round(element.distance.value / 1000); // Convert meters to kilometers
    const durationMinutes = Math.round(element.duration.value / 60); // Convert seconds to minutes

    console.log('Calculated distance:', { distanceKm, durationMinutes });

    return new Response(
      JSON.stringify({
        distance: distanceKm,
        duration: durationMinutes,
        origin,
        destination,
        raw_data: {
          distance_text: element.distance.text,
          duration_text: element.duration.text
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error calculating distance:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error',
        details: 'Failed to calculate distance using Google Distance Matrix API'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
})