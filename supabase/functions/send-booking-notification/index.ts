
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retryAsync<T>(
  fn: () => Promise<T>, 
  maxRetries: number = MAX_RETRIES, 
  retryDelay: number = RETRY_DELAY
): Promise<T> {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      console.log(`Attempt ${attempt} failed:`, error);
      lastError = error;
      
      if (attempt < maxRetries) {
        await delay(retryDelay * attempt); // Exponential backoff
      }
    }
  }
  
  throw lastError;
}

interface BookingData {
  id: string;
  pickup_location: string;
  destination: string;
  pickup_date: string;
  pickup_time: string;
  passenger_name: string;
  passenger_phone: string;
  passenger_email?: string;
  estimated_fare: number;
  distance_km: number;
  duration_hours?: number;
  duration_minutes?: number;
  vehicle_type: string;
  trip_type: string;
  return_date?: string;
}

const sendTelegramMessage = async (chatId: string, botToken: string, message: string) => {
  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });
    
    const result = await response.json();
    console.log('Telegram response:', result);
    return result.ok;
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    return false;
  }
};

const sendWhatsAppMessage = async (accountSid: string, authToken: string, fromNumber: string, toNumber: string, message: string) => {
  try {
    const credentials = btoa(`${accountSid}:${authToken}`);
    
    // Clean phone number - remove spaces, dashes, and ensure proper format
    let cleanToNumber = toNumber.replace(/[\s-()]/g, '');
    const cleanFromNumber = fromNumber.replace(/[\s-()]/g, '');
    
    // Add country code if not present (assuming India +91 for most cases)
    if (!cleanToNumber.startsWith('+')) {
      if (cleanToNumber.startsWith('91')) {
        cleanToNumber = '+' + cleanToNumber;
      } else if (cleanToNumber.length === 10) {
        cleanToNumber = '+91' + cleanToNumber;
      } else {
        cleanToNumber = '+91' + cleanToNumber;
      }
    }
    
    console.log(`Sending WhatsApp from: ${cleanFromNumber} to: ${cleanToNumber}`);
    console.log(`Message: ${message.substring(0, 100)}...`);
    
    // Add status callback URL for delivery tracking
    const statusCallback = `https://skjsaxpsgepdtkykyoni.supabase.co/functions/v1/whatsapp-status`;
    
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: `whatsapp:${cleanFromNumber}`,
        To: `whatsapp:${cleanToNumber}`,
        Body: message,
        StatusCallback: statusCallback,
      }),
    });
    
    const result = await response.json();
    console.log('WhatsApp API Response:', {
      status: response.status,
      statusText: response.statusText,
      result: result
    });
    
    // Check for specific WhatsApp errors
    if (!response.ok) {
      console.error('WhatsApp API Error Details:', {
        status: response.status,
        error_code: result.error_code,
        error_message: result.error_message,
        more_info: result.more_info
      });
      
      // Log specific error reasons
      if (result.error_code) {
        switch (result.error_code) {
          case 63016:
            console.error('ERROR: The destination phone number is not opted-in to receive WhatsApp messages');
            break;
          case 63017:
            console.error('ERROR: The destination phone number is not a WhatsApp number');
            break;
          case 21211:
            console.error('ERROR: Invalid phone number format');
            break;
          default:
            console.error(`ERROR: Twilio error code ${result.error_code}: ${result.error_message}`);
        }
      }
      
      return false;
    }
    
    console.log(`WhatsApp message ${result.status} - SID: ${result.sid}`);
    return response.ok;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return false;
  }
};

const sendSMSMessage = async (accountSid: string, authToken: string, fromNumber: string, toNumber: string, message: string) => {
  try {
    const credentials = btoa(`${accountSid}:${authToken}`);
    
    // Clean phone number - remove spaces, dashes, and ensure proper format
    let cleanToNumber = toNumber.replace(/[\s-()]/g, '');
    
    // Add country code if not present (assuming India +91 for most cases)
    if (!cleanToNumber.startsWith('+')) {
      if (cleanToNumber.startsWith('91')) {
        cleanToNumber = '+' + cleanToNumber;
      } else if (cleanToNumber.length === 10) {
        cleanToNumber = '+91' + cleanToNumber;
      } else {
        cleanToNumber = '+91' + cleanToNumber;
      }
    }
    
    console.log(`Sending SMS from: ${fromNumber} to: ${cleanToNumber}`);
    console.log(`Message: ${message.substring(0, 100)}...`);
    
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: fromNumber,
        To: cleanToNumber,
        Body: message,
      }),
    });
    
    const result = await response.json();
    console.log('SMS API Response:', {
      status: response.status,
      statusText: response.statusText,
      result: result
    });
    
    if (!response.ok) {
      console.error('SMS API Error Details:', {
        status: response.status,
        error_code: result.error_code,
        error_message: result.error_message,
        more_info: result.more_info
      });
      return false;
    }
    
    console.log(`SMS message ${result.status} - SID: ${result.sid}`);
    return response.ok;
  } catch (error) {
    console.error('Error sending SMS message:', error);
    return false;
  }
};

// Helper function to calculate driver batta based on trip type
const calculateDriverBatta = (tripType: string): number => {
  // One-way trips: ₹400 per day
  // Round-trip and hourly trips: ₹500 per day
  return (tripType === 'oneway' || tripType === 'one-way') ? 400 : 500;
};

const sendEmailNotification = async (resendApiKey: string, adminEmail: string, booking: BookingData, vehicleRate: number) => {
  console.log('Attempting to send admin email notification...');
  console.log('Admin Email:', adminEmail);
  console.log('Passenger Email:', booking.passenger_email);
  console.log('Vehicle Rate:', vehicleRate);
  
  try {
    const resend = new Resend(resendApiKey);
    
    const formatDuration = () => {
      if (booking.duration_hours && booking.duration_minutes) {
        return `${booking.duration_hours} hour ${booking.duration_minutes} mins (Approx)`;
      }
      if (booking.duration_minutes) {
        const hours = Math.floor(booking.duration_minutes / 60);
        const minutes = booking.duration_minutes % 60;
        if (hours > 0 && minutes > 0) {
          return `${hours} hours ${minutes} mins (Approx)`;
        } else if (hours > 0) {
          return `${hours} hours (Approx)`;
        } else {
          return `${minutes} mins (Approx)`;
        }
      }
      return 'Duration TBD';
    };

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      });
    };

    const formatTime = (timeString: string) => {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    };

    const emailHtml = `
      <html>
        <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb; margin: 0; font-size: 24px;">🚖 New Booking Alert</h1>
            </div>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
              <h2 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px;">Booking Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #475569;">Booking ID:</td>
                  <td style="padding: 8px 0; color: #1e293b;">${booking.id.substring(0, 10).toUpperCase()}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #475569;">Name:</td>
                  <td style="padding: 8px 0; color: #1e293b;">${booking.passenger_name || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #475569;">Email ID:</td>
                  <td style="padding: 8px 0; color: #1e293b;">${booking.passenger_email || 'NA'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #475569;">Phone:</td>
                  <td style="padding: 8px 0; color: #1e293b;">${booking.passenger_phone || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #475569;">Pickup Location:</td>
                  <td style="padding: 8px 0; color: #1e293b;">${booking.pickup_location}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #475569;">Drop Location:</td>
                  <td style="padding: 8px 0; color: #1e293b;">${booking.destination}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #475569;">Vehicle Type:</td>
                  <td style="padding: 8px 0; color: #1e293b;">${booking.vehicle_type.toUpperCase()}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #475569;">Journey Type:</td>
                  <td style="padding: 8px 0; color: #1e293b;">${booking.trip_type === 'oneway' ? 'One Way' : booking.trip_type === 'roundtrip' ? 'Round Trip' : booking.trip_type}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #475569;">Travel Date & Time:</td>
                  <td style="padding: 8px 0; color: #1e293b;">${formatDate(booking.pickup_date)} ${formatTime(booking.pickup_time)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #475569;">Return Date:</td>
                  <td style="padding: 8px 0; color: #1e293b;">${booking.return_date ? formatDate(booking.return_date) : 'NA'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #475569;">Trip Distance:</td>
                  <td style="padding: 8px 0; color: #1e293b;">${booking.distance_km || 'TBD'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #475569;">Trip Duration:</td>
                  <td style="padding: 8px 0; color: #1e293b;">${formatDuration()}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #475569;">Trip Estimation:</td>
                  <td style="padding: 8px 0; color: #059669; font-weight: bold;">₹ ${booking.estimated_fare}.00</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #475569;">Extra Per KM:</td>
                  <td style="padding: 8px 0; color: #1e293b;">₹ ${vehicleRate}.00</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #475569;">Driver Batta:</td>
                  <td style="padding: 8px 0; color: #1e293b;">₹ ${calculateDriverBatta(booking.trip_type)} (included)</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #475569;">Above 400 KM:</td>
                  <td style="padding: 8px 0; color: #1e293b;">₹ 300 Extra</td>
                </tr>
              </table>
            </div>
            
            <div style="background-color: #fff3cd; border: 1px solid #ffc107; border-radius: 6px; padding: 15px; margin-bottom: 20px;">
              <p style="margin: 0; color: #856404; font-weight: bold;">ℹ️ For Customer Intimation:</p>
              <p style="margin: 5px 0 0 0; color: #856404;">Toll Gate, Permit, Hill Station Charges Extra</p>
            </div>
            
            <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 15px; margin-bottom: 20px;">
              <p style="margin: 0; color: #92400e; font-weight: bold;">⚡ Action Required:</p>
              <p style="margin: 5px 0 0 0; color: #92400e;">Please assign a driver and confirm this booking as soon as possible.</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; margin: 0 0 10px 0; font-size: 14px;">Thank you for choosing droptaxigo</p>
              <p style="color: #64748b; margin: 0 0 10px 0; font-size: 14px;">For Questions Contact: <strong>7305305111</strong> or visit our site <strong>droptaxigo.com/ droptaxigo.in</strong></p>
              <p style="color: #64748b; margin: 0; font-size: 14px;">This notification was automatically generated for booking ID: ${booking.id.substring(0, 10).toUpperCase()}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send admin notification email with retry logic
    const adminEmailResult = await retryAsync(async () => {
      return await resend.emails.send({
        from: 'Drop Taxi Go <noreply@droptaxigo.com>',
        to: [adminEmail],
        subject: `🚖 New Booking Alert - ${booking.passenger_name} | ${booking.pickup_location}`,
        html: emailHtml,
      });
    });

    if (adminEmailResult.error) {
      console.error('Admin email send failed:', adminEmailResult.error);
      return false;
    }
    
    console.log('Admin email sent successfully:', adminEmailResult.data?.id);
    // Send passenger confirmation email if email provided with retry logic
    if (booking.passenger_email && booking.passenger_email.trim() !== '') {
      console.log('Sending passenger confirmation email to:', booking.passenger_email);
      
      const passengerEmailResult = await retryAsync(async () => {
        return await resend.emails.send({
          from: 'Drop Taxi Go <noreply@droptaxigo.com>',
          to: [booking.passenger_email],
          subject: `✅ Booking Confirmed - ${booking.id.substring(0, 8).toUpperCase()} | droptaxigo`,
          html: `
            <html>
              <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                  <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #2563eb; margin: 0; font-size: 24px;">🚖 Booking Confirmed!</h1>
                    <p style="color: #64748b; margin: 10px 0 0 0;">droptaxigo - Your Trusted Travel Partner</p>
                  </div>
                  
                  <div style="background-color: #f0fdf4; border: 1px solid #86efac; border-radius: 6px; padding: 20px; margin-bottom: 20px;">
                    <p style="margin: 0; color: #166534; font-weight: bold; font-size: 16px;">Dear ${booking.passenger_name},</p>
                    <p style="margin: 10px 0 0 0; color: #16a34a;">Your ride has been successfully booked! We'll assign a driver and share the details with you shortly.</p>
                  </div>
                  
                  <div style="background-color: #f8fafc; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
                    <h2 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px;">Your Booking Details</h2>
                    <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #475569;">Booking ID:</td>
                        <td style="padding: 8px 0; color: #1e293b;">${booking.id.substring(0, 10).toUpperCase()}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #475569;">Pickup Location:</td>
                        <td style="padding: 8px 0; color: #1e293b;">${booking.pickup_location}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #475569;">Drop Location:</td>
                        <td style="padding: 8px 0; color: #1e293b;">${booking.destination}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #475569;">Date & Time:</td>
                        <td style="padding: 8px 0; color: #1e293b;">${formatDate(booking.pickup_date)} ${formatTime(booking.pickup_time)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #475569;">Vehicle Type:</td>
                        <td style="padding: 8px 0; color: #1e293b;">${booking.vehicle_type.toUpperCase()}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #475569;">Trip Type:</td>
                        <td style="padding: 8px 0; color: #1e293b;">${booking.trip_type === 'oneway' ? 'One Way' : booking.trip_type === 'roundtrip' ? 'Round Trip' : booking.trip_type}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #475569;">Estimated Fare:</td>
                        <td style="padding: 8px 0; color: #059669; font-weight: bold;">₹ ${booking.estimated_fare}.00</td>
                      </tr>
                    </table>
                  </div>
                  
                  <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 15px; margin-bottom: 20px;">
                    <p style="margin: 0; color: #92400e; font-weight: bold;">📞 What's Next?</p>
                    <p style="margin: 5px 0 0 0; color: #92400e;">We'll call you shortly to confirm the driver details. For any queries, contact us at +91 7305305111</p>
                  </div>
                  
                  <div style="background-color: #fff3cd; border: 1px solid #ffc107; border-radius: 6px; padding: 15px; margin-bottom: 20px;">
                    <p style="margin: 0; color: #856404; font-weight: bold;">ℹ️ Important Notes:</p>
                    <p style="margin: 5px 0 0 0; color: #856404;">• Toll charges, permits, and hill station charges are extra<br>• Please be ready 10 minutes before pickup time<br>• Cash and digital payments accepted</p>
                  </div>
                  
                  <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                    <p style="color: #64748b; margin: 0 0 10px 0; font-size: 14px;">Thank you for choosing droptaxigo!</p>
                    <p style="color: #64748b; margin: 0; font-size: 14px;">Need Help? Call us at <strong>+91 7305305111</strong> or visit <strong>droptaxigo.com/ droptaxigo.in</strong></p>
                  </div>
                </div>
              </body>
            </html>
          `,
        });
      });
      
      if (passengerEmailResult.error) {
        console.error('Passenger email send failed:', passengerEmailResult.error);
      } else {
        console.log('Passenger email sent successfully:', passengerEmailResult.data?.id);
      }
    } else {
      console.log('No passenger email provided or email is empty');
    }

    return true;
  } catch (error) {
    console.error('Error sending email notification:', error);
    return false;
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const booking: BookingData = await req.json();
    console.log('Processing booking notification for:', booking.id);
    
    // Initialize Supabase client to fetch vehicle rates
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://skjsaxpsgepdtkykyoni.supabase.co';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY');
    
    let vehicleRate = 19; // Default fallback rate
    
    if (supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data: vehicleType, error } = await supabase
          .from('vehicle_types')
          .select('drop_trip_rate_per_km')
          .ilike('name', booking.vehicle_type)
          .single();
        
        if (!error && vehicleType?.drop_trip_rate_per_km) {
          vehicleRate = vehicleType.drop_trip_rate_per_km;
          console.log(`Found vehicle rate for ${booking.vehicle_type}: ₹${vehicleRate}/km`);
        } else {
          console.log(`Vehicle type ${booking.vehicle_type} not found, using default rate: ₹${vehicleRate}/km`);
        }
      } catch (error) {
        console.error('Error fetching vehicle rate:', error);
      }
    }
    
    // Get environment variables with the updated credentials
    const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID');
    const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID');
    const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN');
    const TWILIO_WHATSAPP_NUMBER = Deno.env.get('TWILIO_WHATSAPP_NUMBER');
    const TWILIO_SMS_NUMBER = Deno.env.get('TWILIO_SMS_NUMBER');
    const ADMIN_WHATSAPP_NUMBER = Deno.env.get('ADMIN_WHATSAPP_NUMBER');
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL');

    console.log('Environment check:', {
      telegram_configured: !!(TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID),
      twilio_configured: !!(TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN),
      whatsapp_configured: !!TWILIO_WHATSAPP_NUMBER,
      sms_configured: !!TWILIO_SMS_NUMBER,
      admin_number_set: !!ADMIN_WHATSAPP_NUMBER,
      passenger_phone: booking.passenger_phone
    });

    // Create notification message for Telegram
    const telegramMessage = `
🚖 <b>New Booking Alert!</b>

📋 <b>Booking ID:</b> ${booking.id}
👤 <b>Passenger:</b> ${booking.passenger_name}
📞 <b>Phone:</b> ${booking.passenger_phone}

🚩 <b>From:</b> ${booking.pickup_location}
🏁 <b>To:</b> ${booking.destination}

📅 <b>Date:</b> ${booking.pickup_date}
⏰ <b>Time:</b> ${booking.pickup_time}

🚗 <b>Vehicle:</b> ${booking.vehicle_type.toUpperCase()}
🎯 <b>Trip Type:</b> ${booking.trip_type}
📏 <b>Distance:</b> ${booking.distance_km} km
💰 <b>Estimated Fare:</b> ₹${booking.estimated_fare}

Please confirm and assign a driver.

Thank you for choosing droptaxigo
For Questions Contact: 7305305111 or visit our site droptaxigo.com/ droptaxigo.in
    `.trim();

    // WhatsApp message for admin
    const adminWhatsAppMessage = `
🚖 *NEW RIDE BOOKING*

📋 *ID:* ${booking.id.substring(0, 8).toUpperCase()}
👤 *Customer:* ${booking.passenger_name}
📱 *Contact:* ${booking.passenger_phone}

📍 *Pickup:* ${booking.pickup_location}
🏁 *Drop:* ${booking.destination}

📅 *Date:* ${booking.pickup_date}
⏰ *Time:* ${booking.pickup_time}

🚗 *Vehicle:* ${booking.vehicle_type.toUpperCase()}
🛣️ *Type:* ${booking.trip_type}
📏 *Distance:* ${booking.distance_km || 'TBD'} km
💰 *Fare:* ₹${booking.estimated_fare}

✅ *Action Required:* Please assign driver and confirm booking.

📊 *Rate Info:* ₹${vehicleRate}/km for ${booking.vehicle_type.toUpperCase()}
👨‍✈️ *Driver Batta:* ₹${calculateDriverBatta(booking.trip_type)}/day included

Thank you for choosing droptaxigo
For Questions Contact: 7305305111 or visit our site droptaxigo.com/ droptaxigo.in
    `.trim();

    // SMS confirmation message for passenger (plain text, no markdown)
    const passengerSMSMessage = `
BOOKING CONFIRMED!

Hi ${booking.passenger_name}! Your ride has been booked successfully.

Booking ID: ${booking.id.substring(0, 8).toUpperCase()}
Pickup: ${booking.pickup_location}
Destination: ${booking.destination}

Date: ${booking.pickup_date}
Time: ${booking.pickup_time}

Vehicle: ${booking.vehicle_type.toUpperCase()}
Estimated Fare: Rs.${booking.estimated_fare}

You'll receive driver details shortly.

Thank you for choosing droptaxigo
For Questions Contact: 7305305111 or visit our site droptaxigo.com/ droptaxigo.in
    `.trim();

    const results = {
      telegram: false,
      whatsapp_admin: false,
      sms_passenger: false,
      email_admin: false,
      email_passenger: false,
    };

    // Send Telegram notification
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      console.log('Sending Telegram notification...');
      results.telegram = await sendTelegramMessage(TELEGRAM_CHAT_ID, TELEGRAM_BOT_TOKEN, telegramMessage);
      console.log('Telegram notification result:', results.telegram);
    } else {
      console.log('Telegram credentials not configured');
    }

    // Send WhatsApp notifications
    if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_WHATSAPP_NUMBER) {
      console.log('Twilio credentials found, proceeding with WhatsApp notifications...');
      
      // Send to admin first
      if (ADMIN_WHATSAPP_NUMBER) {
        console.log(`Sending admin notification to: ${ADMIN_WHATSAPP_NUMBER}`);
        results.whatsapp_admin = await sendWhatsAppMessage(
          TWILIO_ACCOUNT_SID,
          TWILIO_AUTH_TOKEN,
          TWILIO_WHATSAPP_NUMBER,
          ADMIN_WHATSAPP_NUMBER,
          adminWhatsAppMessage
        );
        console.log('Admin WhatsApp result:', results.whatsapp_admin);
      } else {
        console.log('Admin WhatsApp number not configured');
      }

    } else {
      console.log('WhatsApp credentials not fully configured:', {
        account_sid: !!TWILIO_ACCOUNT_SID,
        auth_token: !!TWILIO_AUTH_TOKEN,
        whatsapp_number: !!TWILIO_WHATSAPP_NUMBER
      });
    }

    // Send SMS notification to passenger
    if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_SMS_NUMBER) {
      console.log('Twilio SMS credentials found, proceeding with SMS notification...');
      
      if (booking.passenger_phone) {
        console.log(`Sending passenger SMS confirmation to: ${booking.passenger_phone}`);
        results.sms_passenger = await sendSMSMessage(
          TWILIO_ACCOUNT_SID,
          TWILIO_AUTH_TOKEN,
          TWILIO_SMS_NUMBER,
          booking.passenger_phone,
          passengerSMSMessage
        );
        console.log('Passenger SMS result:', results.sms_passenger);
      } else {
        console.log('Passenger phone number not provided');
      }
    } else {
      console.log('SMS credentials not fully configured:', {
        account_sid: !!TWILIO_ACCOUNT_SID,
        auth_token: !!TWILIO_AUTH_TOKEN,
        sms_number: !!TWILIO_SMS_NUMBER
      });
    }

    // Send Email notification to admin
    if (RESEND_API_KEY && ADMIN_EMAIL) {
      console.log('Resend credentials found, proceeding with email notification...');
      console.log(`Sending admin email notification to: ${ADMIN_EMAIL}`);
      results.email_admin = await sendEmailNotification(RESEND_API_KEY, ADMIN_EMAIL, booking, vehicleRate);
      console.log('Admin email result:', results.email_admin);
    } else {
      console.log('Email credentials not fully configured:', {
        resend_api_key: !!RESEND_API_KEY,
        admin_email: !!ADMIN_EMAIL
      });
    }

    // Send passenger booking confirmation email if passenger email exists
    if (RESEND_API_KEY && booking.passenger_email) {
      console.log("Sending booking confirmation email to passenger:", booking.passenger_email);
      
      const resend = new Resend(RESEND_API_KEY);
      
      const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { 
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric' 
        });
      };

      const formatTime = (timeString: string) => {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
      };
      
      const passengerEmailHtml = `
        <html>
          <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #2563eb; margin: 0; font-size: 24px;">🚖 Booking Confirmed!</h1>
                <p style="color: #64748b; margin: 10px 0 0 0;">droptaxigo - Your Trusted Travel Partner</p>
              </div>
              
              <div style="background-color: #f0fdf4; border: 1px solid #86efac; border-radius: 6px; padding: 20px; margin-bottom: 20px;">
                <p style="margin: 0; color: #166534; font-weight: bold; font-size: 16px;">Dear ${booking.passenger_name},</p>
                <p style="margin: 10px 0 0 0; color: #16a34a;">Your ride has been successfully booked! We'll assign a driver and share the details with you shortly.</p>
              </div>
              
              <div style="background-color: #f8fafc; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
                <h2 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px;">Your Booking Details</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #475569;">Booking ID:</td>
                    <td style="padding: 8px 0; color: #1e293b;">${booking.id.substring(0, 10).toUpperCase()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #475569;">Pickup Location:</td>
                    <td style="padding: 8px 0; color: #1e293b;">${booking.pickup_location}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #475569;">Drop Location:</td>
                    <td style="padding: 8px 0; color: #1e293b;">${booking.destination}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #475569;">Date & Time:</td>
                    <td style="padding: 8px 0; color: #1e293b;">${formatDate(booking.pickup_date)} ${formatTime(booking.pickup_time)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #475569;">Vehicle Type:</td>
                    <td style="padding: 8px 0; color: #1e293b;">${booking.vehicle_type.toUpperCase()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #475569;">Trip Type:</td>
                    <td style="padding: 8px 0; color: #1e293b;">${booking.trip_type === 'oneway' ? 'One Way' : booking.trip_type === 'roundtrip' ? 'Round Trip' : booking.trip_type}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #475569;">Estimated Fare:</td>
                    <td style="padding: 8px 0; color: #059669; font-weight: bold;">₹ ${booking.estimated_fare}.00</td>
                  </tr>
                </table>
              </div>
              
              <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 15px; margin-bottom: 20px;">
                <p style="margin: 0; color: #92400e; font-weight: bold;">📞 What's Next?</p>
                <p style="margin: 5px 0 0 0; color: #92400e;">We'll call you shortly to confirm the driver details. For any queries, contact us at +91 7305305111</p>
              </div>
              
              <div style="background-color: #fff3cd; border: 1px solid #ffc107; border-radius: 6px; padding: 15px; margin-bottom: 20px;">
                <p style="margin: 0; color: #856404; font-weight: bold;">ℹ️ Important Notes:</p>
                <p style="margin: 5px 0 0 0; color: #856404;">• Toll charges, permits, and hill station charges are extra<br>• Please be ready 10 minutes before pickup time<br>• Cash and digital payments accepted</p>
              </div>
              
              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                <p style="color: #64748b; margin: 0 0 10px 0; font-size: 14px;">Thank you for choosing droptaxigo!</p>
                <p style="color: #64748b; margin: 0; font-size: 14px;">Need Help? Call us at <strong>+91 7305305111</strong> or visit <strong>droptaxigo.com/ droptaxigo.in</strong></p>
              </div>
            </div>
          </body>
        </html>
      `;

      const passengerEmailResponse = await retryAsync(async () => {
        return await resend.emails.send({
          from: 'Drop Taxi Go <noreply@droptaxigo.com>',
          to: [booking.passenger_email],
          subject: `🚖 Booking Confirmed - ${booking.id.substring(0, 8).toUpperCase()} | droptaxigo`,
          html: passengerEmailHtml,
        });
      });

      if (passengerEmailResponse.error) {
        console.error('Failed to send passenger email:', passengerEmailResponse.error);
        results.email_passenger = false;
      } else {
        console.log('Passenger email sent successfully:', passengerEmailResponse.data);
        results.email_passenger = true;
      }
    } else {
      console.log('No passenger email provided or RESEND_API_KEY missing, skipping email confirmation');
      results.email_passenger = false;
    }

    console.log('Final notification results:', results);

    return new Response(
      JSON.stringify({
        success: true,
        results,
        booking_id: booking.id,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in send-booking-notification function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
})
