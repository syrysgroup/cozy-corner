import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  import_log_id: string;
  user_id: string;
  user_email: string;
  file_name: string;
  success_count: number;
  error_count: number;
  warning_count: number;
  geocoded_count: number;
  total_rows: number;
  status: 'completed' | 'failed';
  errors?: Array<{ row_number: number; error: string }>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const resend = new Resend(resendApiKey);
    const data: NotificationRequest = await req.json();

    console.log('Sending import notification email:', {
      user_email: data.user_email,
      file_name: data.file_name,
      status: data.status,
      success_count: data.success_count,
      error_count: data.error_count
    });

    const isSuccess = data.status === 'completed' && data.error_count === 0;
    const hasWarnings = data.warning_count > 0;
    const hasErrors = data.error_count > 0;

    // Build error summary if there are errors
    let errorSummaryHtml = '';
    if (data.errors && data.errors.length > 0) {
      const displayErrors = data.errors.slice(0, 5);
      errorSummaryHtml = `
        <div style="margin-top: 20px; padding: 15px; background-color: #fef2f2; border-radius: 8px; border-left: 4px solid #ef4444;">
          <h3 style="margin: 0 0 10px 0; color: #991b1b; font-size: 14px;">Error Details (showing first ${displayErrors.length} of ${data.errors.length}):</h3>
          <ul style="margin: 0; padding-left: 20px; color: #991b1b;">
            ${displayErrors.map(e => `<li style="margin-bottom: 5px;">Row ${e.row_number}: ${e.error}</li>`).join('')}
          </ul>
          ${data.errors.length > 5 ? `<p style="margin: 10px 0 0 0; font-size: 12px; color: #991b1b;">... and ${data.errors.length - 5} more errors</p>` : ''}
        </div>
      `;
    }

    const statusColor = isSuccess ? '#10b981' : hasErrors ? '#ef4444' : '#f59e0b';
    const statusText = isSuccess ? 'Completed Successfully' : hasErrors ? 'Completed with Errors' : 'Completed with Warnings';
    const statusEmoji = isSuccess ? '✅' : hasErrors ? '❌' : '⚠️';

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1e3a5f 0%, #0f2940 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Bulk Import ${statusEmoji}</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0 0;">Your import has finished processing</p>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
            <div style="background-color: ${statusColor}15; border-radius: 8px; padding: 15px; margin-bottom: 20px; border-left: 4px solid ${statusColor};">
              <p style="margin: 0; color: ${statusColor}; font-weight: 600; font-size: 16px;">${statusText}</p>
            </div>

            <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #1e3a5f;">Import Summary</h2>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">File Name:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: 500;">${data.file_name}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Total Rows:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: 500;">${data.total_rows}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Successful:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: 500; color: #10b981;">${data.success_count}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Geocoded:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: 500; color: #3b82f6;">${data.geocoded_count}</td>
              </tr>
              ${data.warning_count > 0 ? `
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Warnings:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: 500; color: #f59e0b;">${data.warning_count}</td>
              </tr>
              ` : ''}
              ${data.error_count > 0 ? `
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Failed:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: 500; color: #ef4444;">${data.error_count}</td>
              </tr>
              ` : ''}
            </table>

            ${errorSummaryHtml}

            <div style="margin-top: 25px; text-align: center;">
              <a href="https://multilisting.lovable.app/dashboard/properties" 
                 style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 500;">
                View Your Listings
              </a>
            </div>
          </div>

          <div style="background: #f9fafb; padding: 20px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none; text-align: center;">
            <p style="margin: 0; font-size: 12px; color: #6b7280;">
              This is an automated message from Multilisting.<br>
              Please do not reply to this email.
            </p>
          </div>
        </body>
      </html>
    `;

    const { error: emailError } = await resend.emails.send({
      from: 'Multilisting <onboarding@resend.dev>',
      to: [data.user_email],
      subject: `${statusEmoji} Bulk Import ${statusText} - ${data.file_name}`,
      html: emailHtml,
    });

    if (emailError) {
      console.error('Error sending email:', emailError);
      return new Response(
        JSON.stringify({ error: 'Failed to send email', details: emailError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Email sent successfully to:', data.user_email);

    return new Response(
      JSON.stringify({ success: true, message: 'Email notification sent' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in notify-import-complete:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
