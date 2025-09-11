import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TestEmailRequest {
  to: string;
  message?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Test email function called');
    
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const adminEmail = Deno.env.get('ADMIN_EMAIL');
    
    console.log('Environment check:');
    console.log('RESEND_API_KEY exists:', !!resendApiKey);
    console.log('ADMIN_EMAIL:', adminEmail);
    
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }

    if (!adminEmail) {
      throw new Error('ADMIN_EMAIL environment variable is not set');
    }

    const { to, message = 'This is a test email from Drop Taxi Go' }: TestEmailRequest = await req.json();
    
    console.log('Sending test email to:', to);
    
    const resend = new Resend(resendApiKey);
    
    const emailResponse = await resend.emails.send({
      from: 'Drop Taxi Go <noreply@droptaxigo.com>',
      to: [to],
      subject: '🧪 Test Email from Drop Taxi Go',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
          <div style="background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
            <h1 style="color: #1f2937; margin: 0 0 20px 0;">🧪 Test Email</h1>
            <p style="color: #374151; font-size: 16px; margin: 0 0 20px 0;">${message}</p>
            
            <div style="background-color: #dcfce7; border-left: 4px solid #22c55e; padding: 16px; margin: 20px 0;">
              <p style="margin: 0; color: #166534; font-weight: 500;">✅ Email configuration is working correctly!</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; margin: 0 0 10px 0; font-size: 14px;">Thank you for choosing droptaxigo</p>
              <p style="color: #64748b; margin: 0; font-size: 14px;">For Questions Contact: <strong>7305305111</strong> or visit our site <strong>droptaxigo.com/ droptaxigo.in</strong></p>
            </div>
          </div>
        </div>
      `,
    });

    console.log('Test email sent successfully:', emailResponse);

    return new Response(JSON.stringify({
      success: true,
      message: 'Test email sent successfully',
      emailResponse
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Error in test-email function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        details: error.toString()
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);