import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EnquiryNotificationRequest {
  enquiryId: string;
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
  // Additional fields for vehicle search enquiry
  enquiryType?: 'contact' | 'vehicle-search';
  pickupLocation?: string;
  dropLocation?: string;
  pickupDate?: string;
  pickupTime?: string;
  tripType?: string;
  distance?: number;
  duration?: number;
  vehicleType?: string;
  estimatedFare?: number;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const enquiry: EnquiryNotificationRequest = await req.json();
    
    console.log("Processing enquiry notification for:", enquiry.enquiryId);

    // Generate enquiry reference number
    const enquiryRef = `ENQ${enquiry.enquiryId.slice(0, 8).toUpperCase()}`;
    
    // Format date
    const formattedDate = new Date(enquiry.createdAt).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Asia/Kolkata'
    });

    // Get subject badge color
    const getSubjectBadgeColor = (subject: string) => {
      const subjectLower = subject.toLowerCase();
      if (subjectLower.includes('booking')) return '#10b981'; // green
      if (subjectLower.includes('vehicle')) return '#f59e0b'; // amber for vehicle search
      if (subjectLower.includes('support')) return '#3b82f6'; // blue
      if (subjectLower.includes('feedback')) return '#8b5cf6'; // purple
      if (subjectLower.includes('complaint')) return '#ef4444'; // red
      return '#6b7280'; // gray for other
    };

    const badgeColor = getSubjectBadgeColor(enquiry.subject);
    
    // Helper function to format duration from minutes to hours and minutes
    const formatDurationFromMinutes = (minutes: number) => {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      if (hours > 0 && remainingMinutes > 0) {
        return `${hours} hours ${remainingMinutes} mins`;
      } else if (hours > 0) {
        return `${hours} hours`;
      } else {
        return `${remainingMinutes} mins`;
      }
    };
    
    // Generate vehicle search details section if applicable
    const vehicleSearchDetails = enquiry.enquiryType === 'vehicle-search' ? `
      <div style="background-color: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <h2 style="color: #166534; font-size: 18px; margin: 0 0 15px 0;">🚗 Vehicle Search Details</h2>
        <table style="width: 100%;">
          <tr>
            <td style="padding: 5px 0; color: #16a34a;">Trip Type:</td>
            <td style="padding: 5px 0; color: #166534; font-weight: 600;">${enquiry.tripType}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #16a34a;">From:</td>
            <td style="padding: 5px 0; color: #166534; font-weight: 600;">${enquiry.pickupLocation}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #16a34a;">To:</td>
            <td style="padding: 5px 0; color: #166534; font-weight: 600;">${enquiry.dropLocation || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #16a34a;">Date:</td>
            <td style="padding: 5px 0; color: #166534; font-weight: 600;">${enquiry.pickupDate}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #16a34a;">Time:</td>
            <td style="padding: 5px 0; color: #166534; font-weight: 600;">${enquiry.pickupTime}</td>
          </tr>
          ${enquiry.distance ? `
          <tr>
            <td style="padding: 5px 0; color: #16a34a;">Distance:</td>
            <td style="padding: 5px 0; color: #166534; font-weight: 600;">${enquiry.distance} km</td>
          </tr>
          ` : ''}
          ${enquiry.vehicleType ? `
          <tr>
            <td style="padding: 5px 0; color: #16a34a;">Vehicle Type:</td>
            <td style="padding: 5px 0; color: #166534; font-weight: 600;">${enquiry.vehicleType}</td>
          </tr>
          ` : ''}
          ${enquiry.estimatedFare ? `
          <tr>
            <td style="padding: 5px 0; color: #16a34a;">Amount:</td>
            <td style="padding: 5px 0; color: #166534; font-weight: 600;">₹${enquiry.estimatedFare.toFixed(2)}</td>
          </tr>
          ` : ''}
          ${enquiry.duration ? `
          <tr>
            <td style="padding: 5px 0; color: #16a34a;">Est. Duration:</td>
            <td style="padding: 5px 0; color: #166534; font-weight: 600;">${formatDurationFromMinutes(enquiry.duration)}</td>
          </tr>
          ` : ''}
        </table>
      </div>
    ` : '';

    // HTML template for admin email
    const adminHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Enquiry Alert</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">🔔 New Enquiry Alert</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;">Drop Taxi Go - Customer Service</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 30px;">
              <!-- Reference Badge -->
              <div style="text-align: center; margin-bottom: 25px;">
                <span style="background-color: #f3f4f6; padding: 8px 16px; border-radius: 20px; font-size: 14px; color: #4b5563;">
                  Reference: <strong>${enquiryRef}</strong>
                </span>
              </div>
              
              <!-- Customer Details -->
              <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                <h2 style="color: #111827; font-size: 18px; margin: 0 0 15px 0;">Customer Details</h2>
                <table style="width: 100%;">
                  <tr>
                    <td style="padding: 5px 0; color: #6b7280;">Name:</td>
                    <td style="padding: 5px 0; color: #111827; font-weight: 500;">${enquiry.fullName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #6b7280;">Email:</td>
                    <td style="padding: 5px 0; color: #111827; font-weight: 500;">
                      <a href="mailto:${enquiry.email}" style="color: #667eea; text-decoration: none;">${enquiry.email}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #6b7280;">Phone:</td>
                    <td style="padding: 5px 0; color: #111827; font-weight: 500;">
                      ${enquiry.phone ? `<a href="tel:${enquiry.phone}" style="color: #667eea; text-decoration: none;">${enquiry.phone}</a>` : 'Not Provided'}
                    </td>
                  </tr>
                </table>
              </div>
              
              ${vehicleSearchDetails}
              
              <!-- Enquiry Information -->
              <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                <h2 style="color: #111827; font-size: 18px; margin: 0 0 15px 0;">Enquiry Information</h2>
                <div style="margin-bottom: 15px;">
                  <span style="color: #6b7280; font-size: 14px;">Subject:</span>
                  <span style="display: inline-block; margin-left: 10px; background-color: ${badgeColor}; color: #ffffff; padding: 4px 12px; border-radius: 12px; font-size: 14px; font-weight: 500;">
                    ${enquiry.subject}
                  </span>
                </div>
                <div style="margin-bottom: 15px;">
                  <p style="color: #6b7280; margin: 0 0 8px 0; font-size: 14px;">Message:</p>
                  <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 6px; padding: 15px;">
                    <p style="color: #111827; margin: 0; line-height: 1.6; white-space: pre-wrap;">${enquiry.message}</p>
                  </div>
                </div>
                <div>
                  <span style="color: #6b7280; font-size: 14px;">Submitted On:</span>
                  <span style="color: #111827; font-weight: 500; margin-left: 10px;">${formattedDate}</span>
                </div>
              </div>
              
              <!-- Status & Action -->
              <div style="background-color: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                <p style="margin: 0; color: #92400e; font-weight: 500;">
                  ⚡ Status: <strong>Pending Review</strong>
                </p>
                <p style="margin: 8px 0 0 0; color: #92400e;">
                  Action Required: Please review and respond to this enquiry within 2-4 hours.
                </p>
              </div>
              
              <!-- Quick Actions -->
              <div style="text-align: center; margin-top: 30px;">
                <a href="mailto:${enquiry.email}" style="display: inline-block; background-color: #667eea; color: #ffffff; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: 500; margin: 0 10px;">
                  Reply to Customer
                </a>
                <a href="tel:${enquiry.phone || '+917305305111'}" style="display: inline-block; background-color: #10b981; color: #ffffff; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: 500; margin: 0 10px;">
                  Call Customer
                </a>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                Drop Taxi Go - Reliable Taxi Service
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 5px 0 0 0;">
                This is an automated notification. Please do not reply to this email.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    // HTML template for customer confirmation email
    const customerHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>We've Received Your Enquiry</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">✅ Thank You for Contacting Us!</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;">Drop Taxi Go - Your Trusted Travel Partner</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 30px;">
              <p style="color: #111827; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Dear ${enquiry.fullName},
              </p>
              
              <p style="color: #111827; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                We have successfully received your enquiry and appreciate you reaching out to Drop Taxi Go.
              </p>
              
              <!-- Reference Box -->
              <div style="background-color: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <p style="margin: 0; color: #166534; font-size: 14px;">
                  Your Reference Number:
                </p>
                <p style="margin: 8px 0 0 0; color: #166534; font-size: 24px; font-weight: bold;">
                  ${enquiryRef}
                </p>
                <p style="margin: 8px 0 0 0; color: #16a34a; font-size: 14px;">
                  Please keep this for your records
                </p>
              </div>
              
              <!-- What's Next -->
              <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h2 style="color: #111827; font-size: 18px; margin: 0 0 15px 0;">What Happens Next?</h2>
                <ul style="color: #4b5563; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>Our support team will review your message</li>
                  <li>We typically respond within <strong>2-4 hours</strong> during business hours</li>
                  <li>You'll receive a detailed response via email</li>
                  <li>For urgent matters, feel free to call us directly</li>
                </ul>
              </div>
              
              <!-- Your Enquiry Summary -->
              <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h2 style="color: #111827; font-size: 18px; margin: 0 0 15px 0;">Your Enquiry Summary</h2>
                <p style="color: #6b7280; margin: 0 0 8px 0;">
                  <strong>Subject:</strong> ${enquiry.subject}
                </p>
                <p style="color: #6b7280; margin: 0;">
                  <strong>Submitted:</strong> ${formattedDate}
                </p>
              </div>
              
              <!-- Contact Information -->
              <div style="background-color: #fef3c7; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
                <p style="color: #92400e; font-size: 16px; margin: 0 0 10px 0; font-weight: 500;">
                  Need Immediate Assistance?
                </p>
                <p style="color: #b45309; margin: 0 0 15px 0;">
                  Our customer service team is available to help!
                </p>
                <a href="tel:+917305305111" style="display: inline-block; background-color: #10b981; color: #ffffff; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: 500;">
                  📞 Call +91 7305305111
                </a>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
                Thank you for choosing Drop Taxi Go. We look forward to serving you!
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
                Drop Taxi Go - Reliable & Affordable Taxi Service
              </p>
              <div style="margin: 15px 0;">
                <a href="https://droptaxigo.in" style="color: #667eea; text-decoration: none; margin: 0 10px;">Website</a>
                <span style="color: #d1d5db;">|</span>
                <a href="mailto:droptaxigo06@gmail.com" style="color: #667eea; text-decoration: none; margin: 0 10px;">Email</a>
                <span style="color: #d1d5db;">|</span>
                <a href="tel:+917305305111" style="color: #667eea; text-decoration: none; margin: 0 10px;">Phone</a>
              </div>
              <p style="color: #9ca3af; font-size: 12px; margin: 10px 0 0 0;">
                © 2024 Drop Taxi Go. All rights reserved.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email to admin
    const adminEmail = Deno.env.get("ADMIN_EMAIL") || "droptaxigo06@gmail.com";
    
    console.log("Sending admin notification to:", adminEmail);
    console.log("Enquiry type:", enquiry.enquiryType);
    console.log("Using RESEND_API_KEY:", Deno.env.get("RESEND_API_KEY") ? "Present" : "Missing");
    
    // Validate and get FROM_EMAIL with safe fallback
    let fromEmail = Deno.env.get("FROM_EMAIL") || "Drop Taxi Go <onboarding@resend.dev>";
    
    // Basic validation for email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$|^.+\s*<[^\s@]+@[^\s@]+\.[^\s@]+>$/;
    if (fromEmail && !emailRegex.test(fromEmail)) {
      console.warn('FROM_EMAIL has invalid format, using fallback:', fromEmail);
      fromEmail = "Drop Taxi Go <onboarding@resend.dev>";
    }
    
    const adminEmailResponse = await resend.emails.send({
      from: fromEmail,
      to: [adminEmail],
      subject: enquiry.enquiryType === 'vehicle-search' 
        ? `🚗 Vehicle Search Enquiry - ${enquiry.fullName}` 
        : `🔔 New Enquiry Alert - ${enquiry.fullName} | ${enquiry.subject}`,
      html: adminHtml,
    });

    if (adminEmailResponse.error) {
      console.error("Failed to send admin email:", adminEmailResponse.error);
    } else {
      console.log("Admin email sent successfully:", adminEmailResponse.data?.id);
    }

    // Send confirmation email to customer
    console.log("Sending confirmation email to:", enquiry.email);
    const customerEmailResponse = await resend.emails.send({
      from: fromEmail,
      to: [enquiry.email],
      subject: enquiry.enquiryType === 'vehicle-search' 
        ? "🚗 Vehicle Search Request Received - Drop Taxi Go"
        : "✅ We've Received Your Enquiry - Drop Taxi Go",
      html: customerHtml,
    });

    if (customerEmailResponse.error) {
      console.error("Failed to send customer email:", customerEmailResponse.error);
    } else {
      console.log("Customer email sent successfully:", customerEmailResponse.data?.id);
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        enquiryRef,
        adminEmailSent: !adminEmailResponse.error,
        customerEmailSent: !customerEmailResponse.error,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-enquiry-notification function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);