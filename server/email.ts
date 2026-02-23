import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const NOTIFICATION_EMAIL = "alaa@theexpertsjo.com";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactNotification(data: ContactFormData): Promise<void> {
  try {
    const htmlBody = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: #1a1a1a; padding: 30px 40px; text-align: center;">
          <h1 style="color: #c8a45e; font-size: 22px; margin: 0; font-weight: 600; letter-spacing: 1px;">THE EXPERTS</h1>
          <p style="color: #999; font-size: 12px; margin: 5px 0 0; letter-spacing: 2px;">NEW CONTACT FORM MESSAGE</p>
        </div>
        <div style="padding: 35px 40px;">
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #888; font-size: 13px; width: 100px; vertical-align: top;">From</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #333; font-size: 14px; font-weight: 500;">${escapeHtml(data.name)}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #888; font-size: 13px; vertical-align: top;">Email</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #333; font-size: 14px;">
                <a href="mailto:${escapeHtml(data.email)}" style="color: #c8a45e; text-decoration: none;">${escapeHtml(data.email)}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #888; font-size: 13px; vertical-align: top;">Subject</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #333; font-size: 14px;">${escapeHtml(data.subject || "No subject")}</td>
            </tr>
          </table>
          <div style="background: #f9f9f9; border-left: 3px solid #c8a45e; padding: 20px; border-radius: 0 4px 4px 0;">
            <p style="color: #888; font-size: 12px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 1px;">Message</p>
            <p style="color: #333; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${escapeHtml(data.message)}</p>
          </div>
          <div style="margin-top: 25px; text-align: center;">
            <a href="mailto:${escapeHtml(data.email)}?subject=Re: ${escapeHtml(data.subject || "Your inquiry")}" 
               style="display: inline-block; background: #c8a45e; color: #fff; padding: 10px 30px; border-radius: 4px; text-decoration: none; font-size: 13px; font-weight: 500;">
              Reply to ${escapeHtml(data.name)}
            </a>
          </div>
        </div>
        <div style="background: #f5f5f5; padding: 20px 40px; text-align: center; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 11px; margin: 0;">This message was sent from the contact form on theexpertsjo.com</p>
        </div>
      </div>
    `;

    await resend.emails.send({
      from: "The Experts Website <onboarding@resend.dev>",
      to: NOTIFICATION_EMAIL,
      subject: `Contact Form: ${data.subject || "New message"} — from ${data.name}`,
      html: htmlBody,
      replyTo: data.email,
    });

    console.log(`Contact notification email sent to ${NOTIFICATION_EMAIL} for submission from ${data.email}`);
  } catch (error) {
    console.error("Failed to send contact notification email:", error);
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
