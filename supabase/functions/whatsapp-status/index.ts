
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.text();
    const params = new URLSearchParams(body);
    
    const messageStatus = {
      messageSid: params.get('MessageSid'),
      messageStatus: params.get('MessageStatus'),
      to: params.get('To'),
      from: params.get('From'),
      errorCode: params.get('ErrorCode'),
      errorMessage: params.get('ErrorMessage'),
      timestamp: new Date().toISOString()
    };

    console.log('WhatsApp delivery status:', messageStatus);

    // Log specific status meanings
    switch (messageStatus.messageStatus) {
      case 'sent':
        console.log(`✅ Message ${messageStatus.messageSid} was sent to ${messageStatus.to}`);
        break;
      case 'delivered':
        console.log(`✅ Message ${messageStatus.messageSid} was delivered to ${messageStatus.to}`);
        break;
      case 'read':
        console.log(`✅ Message ${messageStatus.messageSid} was read by ${messageStatus.to}`);
        break;
      case 'failed':
        console.log(`❌ Message ${messageStatus.messageSid} failed to ${messageStatus.to}`);
        if (messageStatus.errorCode) {
          console.log(`Error code: ${messageStatus.errorCode} - ${messageStatus.errorMessage}`);
        }
        break;
      case 'undelivered':
        console.log(`⚠️ Message ${messageStatus.messageSid} was undelivered to ${messageStatus.to}`);
        if (messageStatus.errorCode) {
          console.log(`Error code: ${messageStatus.errorCode} - ${messageStatus.errorMessage}`);
        }
        break;
      default:
        console.log(`Message ${messageStatus.messageSid} status: ${messageStatus.messageStatus}`);
    }

    return new Response('OK', { 
      headers: corsHeaders,
      status: 200 
    });

  } catch (error) {
    console.error('Error processing WhatsApp status callback:', error);
    return new Response('Error', { 
      headers: corsHeaders,
      status: 500 
    });
  }
})
