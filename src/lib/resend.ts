import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
const APP_URL = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "";

// In dev, Resend free plan only sends to verified emails.
// Set ADMIN_EMAIL in .env.local to receive all dev emails.
const resolveRecipient = (email: string) =>
  process.env.NODE_ENV === "production" ? email : (ADMIN_EMAIL || email);

// ── Shared helpers ─────────────────────────────────────────────────────────────
const formatDate = (d: Date) =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(d));

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

const baseStyles = `
  font-family: 'DM Sans', Arial, sans-serif;
  background: #0B2540;
  color: #ffffff;
  margin: 0;
  padding: 0;
`;

const header = `
  <div style="text-align: center; margin-bottom: 40px;">
    <h1 style="font-size: 28px; font-weight: 900; letter-spacing: 6px; color: #FDF5AA; margin: 0;">VELORENT</h1>
    <p style="color: #58A0C8; margin: 4px 0 0; font-size: 13px; letter-spacing: 2px; text-transform: uppercase;">Premium Car Rental</p>
  </div>
`;

const footer = `
  <div style="text-align: center; padding: 32px 0 0; border-top: 1px solid rgba(255,255,255,0.05);">
    <p style="color: #444; font-size: 12px; margin: 0;">
      © ${new Date().getFullYear()} VeloRent. All rights reserved.
    </p>
    <p style="color: #333; font-size: 11px; margin: 8px 0 0;">
      You received this email because you have an account on VeloRent.
    </p>
  </div>
`;

// ── 1. Booking Reserved (sent immediately when user reserves — before payment) ─
export async function sendBookingReservation({
  to,
  userName,
  carName,
  carBrand,
  startDate,
  endDate,
  totalDays,
  totalPrice,
  bookingId,
  pickupLocation,
}: {
  to: string;
  userName: string;
  carName: string;
  carBrand: string;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  totalPrice: number;
  bookingId: string;
  pickupLocation?: string;
}) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: resolveRecipient(to),
    bcc: ADMIN_EMAIL,
    subject: `Reservation Received — ${carBrand} ${carName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8" /><title>Reservation Received</title></head>
        <body style="${baseStyles}">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            ${header}

            <!-- Status banner -->
            <div style="background: rgba(88,160,200,0.1); border: 1px solid rgba(88,160,200,0.3); border-radius: 12px; padding: 16px 20px; margin-bottom: 24px; display: flex; align-items: center; gap: 12px;">
              <div style="width: 10px; height: 10px; border-radius: 50%; background: #58A0C8; flex-shrink: 0;"></div>
              <div>
                <p style="margin: 0; font-weight: 700; color: #58A0C8; font-size: 14px;">RESERVATION PENDING PAYMENT</p>
                <p style="margin: 4px 0 0; color: #aaa; font-size: 13px;">Complete your payment to confirm the booking.</p>
              </div>
            </div>

            <!-- Main card -->
            <div style="background: #113F67; border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 32px; margin-bottom: 24px;">
              <p style="color: #aaa; margin: 0 0 4px; font-size: 13px;">Hi ${userName},</p>
              <h2 style="color: #ffffff; font-size: 22px; margin: 0 0 24px; font-weight: 700;">
                Your reservation is received!
              </h2>

              <div style="border-top: 1px solid rgba(255,255,255,0.05); padding-top: 24px;">
                <p style="color: #58A0C8; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 4px;">${carBrand}</p>
                <h3 style="color: #fff; font-size: 20px; margin: 0 0 20px;">${carName}</h3>

                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px 0; color: #666; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.04);">Booking ID</td>
                    <td style="padding: 10px 0; color: #fff; font-size: 14px; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.04); font-family: monospace;">#${bookingId.slice(-8).toUpperCase()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #666; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.04);">Pickup Date</td>
                    <td style="padding: 10px 0; color: #fff; font-size: 14px; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.04);">${formatDate(startDate)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #666; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.04);">Return Date</td>
                    <td style="padding: 10px 0; color: #fff; font-size: 14px; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.04);">${formatDate(endDate)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #666; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.04);">Duration</td>
                    <td style="padding: 10px 0; color: #fff; font-size: 14px; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.04);">${totalDays} day${totalDays !== 1 ? "s" : ""}</td>
                  </tr>
                  ${pickupLocation ? `
                  <tr>
                    <td style="padding: 10px 0; color: #666; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.04);">Pickup Location</td>
                    <td style="padding: 10px 0; color: #fff; font-size: 14px; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.04);">${pickupLocation}</td>
                  </tr>` : ""}
                  <tr>
                    <td style="padding: 16px 0 8px; color: #fff; font-size: 15px; font-weight: 700;">Total Amount</td>
                    <td style="padding: 16px 0 8px; color: #FDF5AA; font-size: 22px; font-weight: 700; text-align: right;">${formatCurrency(totalPrice)}</td>
                  </tr>
                </table>
              </div>
            </div>

            <!-- CTA -->
            <div style="text-align: center; padding: 8px 0 32px;">
              <a href="${APP_URL}/bookings/${bookingId}"
                 style="background: #FDF5AA; color: #0B2540; padding: 14px 40px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 15px; display: inline-block;">
                Complete Payment →
              </a>
              <p style="color: #555; font-size: 12px; margin: 16px 0 0;">
                Your reservation will be held for 24 hours. Complete payment to confirm.
              </p>
            </div>

            ${footer}
          </div>
        </body>
      </html>
    `,
  });
}

// ── 2. Payment Confirmed (sent after successful Stripe payment) ────────────────
export async function sendBookingConfirmation({
  to,
  userName,
  carName,
  carBrand,
  startDate,
  endDate,
  totalDays,
  totalPrice,
  bookingId,
  pickupLocation,
}: {
  to: string;
  userName: string;
  carName: string;
  carBrand?: string;
  startDate: Date;
  endDate: Date;
  totalDays?: number;
  totalPrice: number;
  bookingId: string;
  pickupLocation?: string;
}) {
  const days = totalDays ?? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));

  await resend.emails.send({
    from: FROM_EMAIL,
    to: resolveRecipient(to),
    bcc: ADMIN_EMAIL,
    subject: `Payment Confirmed — ${carBrand ? carBrand + " " : ""}${carName} ✓`,
    html: `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8" /><title>Payment Confirmed</title></head>
        <body style="${baseStyles}">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            ${header}

            <!-- Status banner -->
            <div style="background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3); border-radius: 12px; padding: 16px 20px; margin-bottom: 24px;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 10px; height: 10px; border-radius: 50%; background: #22c55e; flex-shrink: 0;"></div>
                <div>
                  <p style="margin: 0; font-weight: 700; color: #22c55e; font-size: 14px;">PAYMENT CONFIRMED</p>
                  <p style="margin: 4px 0 0; color: #aaa; font-size: 13px;">Your booking is fully confirmed. See you on the road!</p>
                </div>
              </div>
            </div>

            <!-- Main card -->
            <div style="background: #113F67; border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 32px; margin-bottom: 24px;">
              <p style="color: #aaa; margin: 0 0 4px; font-size: 13px;">Hi ${userName},</p>
              <h2 style="color: #ffffff; font-size: 22px; margin: 0 0 24px; font-weight: 700;">
                Your booking is confirmed!
              </h2>

              <div style="border-top: 1px solid rgba(255,255,255,0.05); padding-top: 24px;">
                ${carBrand ? `<p style="color: #58A0C8; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 4px;">${carBrand}</p>` : ""}
                <h3 style="color: #fff; font-size: 20px; margin: 0 0 20px;">${carName}</h3>

                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px 0; color: #666; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.04);">Booking ID</td>
                    <td style="padding: 10px 0; color: #fff; font-size: 14px; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.04); font-family: monospace;">#${bookingId.slice(-8).toUpperCase()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #666; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.04);">Pickup Date</td>
                    <td style="padding: 10px 0; color: #fff; font-size: 14px; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.04);">${formatDate(startDate)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #666; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.04);">Return Date</td>
                    <td style="padding: 10px 0; color: #fff; font-size: 14px; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.04);">${formatDate(endDate)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #666; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.04);">Duration</td>
                    <td style="padding: 10px 0; color: #fff; font-size: 14px; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.04);">${days} day${days !== 1 ? "s" : ""}</td>
                  </tr>
                  ${pickupLocation ? `
                  <tr>
                    <td style="padding: 10px 0; color: #666; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.04);">Pickup Location</td>
                    <td style="padding: 10px 0; color: #fff; font-size: 14px; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.04);">${pickupLocation}</td>
                  </tr>` : ""}
                  <tr>
                    <td style="padding: 16px 0 8px; color: #fff; font-size: 15px; font-weight: 700;">Total Paid</td>
                    <td style="padding: 16px 0 8px; color: #FDF5AA; font-size: 22px; font-weight: 700; text-align: right;">${formatCurrency(totalPrice)}</td>
                  </tr>
                </table>
              </div>
            </div>

            <!-- What's next -->
            <div style="background: rgba(253,245,170,0.05); border: 1px solid rgba(253,245,170,0.1); border-radius: 12px; padding: 20px 24px; margin-bottom: 24px;">
              <p style="color: #FDF5AA; font-size: 13px; font-weight: 700; margin: 0 0 12px; text-transform: uppercase; letter-spacing: 1px;">What's next?</p>
              <ul style="color: #aaa; font-size: 14px; margin: 0; padding: 0 0 0 16px; line-height: 1.8;">
                <li>Bring a valid driver's license on pickup day</li>
                <li>Arrive at the pickup location on time</li>
                <li>Contact us if you need to make any changes</li>
              </ul>
            </div>

            <!-- CTA -->
            <div style="text-align: center; padding: 8px 0 32px;">
              <a href="${APP_URL}/bookings/${bookingId}"
                 style="background: #FDF5AA; color: #0B2540; padding: 14px 40px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 15px; display: inline-block;">
                View Booking Details →
              </a>
            </div>

            ${footer}
          </div>
        </body>
      </html>
    `,
  });
}

// ── 3. Booking Cancelled ───────────────────────────────────────────────────────
export async function sendBookingCancellation({
  to,
  userName,
  carName,
  bookingId,
}: {
  to: string;
  userName: string;
  carName: string;
  bookingId: string;
}) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: resolveRecipient(to),
    bcc: ADMIN_EMAIL,
    subject: `Booking Cancelled — ${carName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8" /><title>Booking Cancelled</title></head>
        <body style="${baseStyles}">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            ${header}
            <div style="background: #113F67; border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 32px; margin-bottom: 24px;">
              <h2 style="color: #fff; margin: 0 0 8px;">Booking Cancelled</h2>
              <p style="color: #aaa; margin: 0 0 24px;">Hi ${userName}, your booking has been cancelled.</p>
              <p style="color: #666; font-size: 14px; margin: 0;">
                Car: <span style="color: #fff;">${carName}</span><br/>
                Booking ID: <span style="color: #fff; font-family: monospace;">#${bookingId.slice(-8).toUpperCase()}</span>
              </p>
            </div>
            <div style="text-align: center; padding: 8px 0 32px;">
              <a href="${APP_URL}/cars"
                 style="background: #FDF5AA; color: #0B2540; padding: 14px 40px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 15px; display: inline-block;">
                Browse Cars →
              </a>
            </div>
            ${footer}
          </div>
        </body>
      </html>
    `,
  });
}

// ── 4. Admin: New Job Application Alert ───────────────────────────────────────
export async function sendAdminApplicationAlert({
  applicantName,
  applicantEmail,
  applicantPhone,
  jobTitle,
  jobTeam,
  linkedIn,
  portfolio,
  coverLetter,
  cvUrl,
  cvFileName,
  applicationId,
}: {
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string | null;
  jobTitle: string;
  jobTeam: string;
  linkedIn?: string | null;
  portfolio?: string | null;
  coverLetter?: string | null;
  cvUrl: string;
  cvFileName: string;
  applicationId: string;
}) {
  if (!ADMIN_EMAIL) return; // No admin email configured — skip silently

  await resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `New Application: ${jobTitle} — ${applicantName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8" /><title>New Job Application</title></head>
        <body style="${baseStyles}">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            ${header}

            <!-- Alert banner -->
            <div style="background: rgba(253,245,170,0.08); border: 1px solid rgba(253,245,170,0.25); border-radius: 12px; padding: 16px 20px; margin-bottom: 24px;">
              <p style="margin: 0; font-weight: 700; color: #FDF5AA; font-size: 14px; letter-spacing: 1px;">NEW JOB APPLICATION</p>
              <p style="margin: 4px 0 0; color: #aaa; font-size: 13px;">A new candidate has applied. Review their details below.</p>
            </div>

            <!-- Main card -->
            <div style="background: #113F67; border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 32px; margin-bottom: 24px;">
              <h2 style="color: #fff; font-size: 20px; margin: 0 0 4px;">${applicantName}</h2>
              <p style="color: #58A0C8; font-size: 13px; margin: 0 0 24px;">${jobTitle} · ${jobTeam}</p>

              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; color: #666; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.04); width: 40%;">Application ID</td>
                  <td style="padding: 10px 0; color: #fff; font-size: 14px; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.04); font-family: monospace;">#${applicationId.slice(-8).toUpperCase()}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.04);">Email</td>
                  <td style="padding: 10px 0; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.04);">
                    <a href="mailto:${applicantEmail}" style="color: #58A0C8; font-size: 14px; text-decoration: none;">${applicantEmail}</a>
                  </td>
                </tr>
                ${applicantPhone ? `
                <tr>
                  <td style="padding: 10px 0; color: #666; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.04);">Phone</td>
                  <td style="padding: 10px 0; color: #fff; font-size: 14px; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.04);">${applicantPhone}</td>
                </tr>` : ""}
                <tr>
                  <td style="padding: 10px 0; color: #666; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.04);">Role</td>
                  <td style="padding: 10px 0; color: #fff; font-size: 14px; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.04);">${jobTitle}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.04);">Team</td>
                  <td style="padding: 10px 0; color: #fff; font-size: 14px; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.04);">${jobTeam}</td>
                </tr>
                ${linkedIn ? `
                <tr>
                  <td style="padding: 10px 0; color: #666; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.04);">LinkedIn</td>
                  <td style="padding: 10px 0; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.04);">
                    <a href="${linkedIn}" style="color: #58A0C8; font-size: 14px; text-decoration: none;">View Profile →</a>
                  </td>
                </tr>` : ""}
                ${portfolio ? `
                <tr>
                  <td style="padding: 10px 0; color: #666; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.04);">Portfolio</td>
                  <td style="padding: 10px 0; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.04);">
                    <a href="${portfolio}" style="color: #58A0C8; font-size: 14px; text-decoration: none;">View Portfolio →</a>
                  </td>
                </tr>` : ""}
              </table>
            </div>

            ${coverLetter ? `
            <!-- Cover Letter -->
            <div style="background: rgba(88,160,200,0.05); border: 1px solid rgba(88,160,200,0.15); border-radius: 12px; padding: 20px 24px; margin-bottom: 24px;">
              <p style="color: #58A0C8; font-size: 12px; font-weight: 700; margin: 0 0 12px; text-transform: uppercase; letter-spacing: 1px;">Cover Letter</p>
              <p style="color: #ccc; font-size: 14px; line-height: 1.7; margin: 0; white-space: pre-wrap;">${coverLetter}</p>
            </div>` : ""}

            <!-- CV Download -->
            <div style="text-align: center; padding: 8px 0 32px;">
              ${cvUrl.startsWith("data:") || cvUrl.startsWith("https://placeholder") ? `
              <div style="background: rgba(253,245,170,0.08); border: 1px solid rgba(253,245,170,0.2); border-radius: 12px; padding: 16px 24px; margin-bottom: 16px;">
                <p style="color: #FDF5AA; font-size: 13px; font-weight: 700; margin: 0 0 6px;">📎 ${cvFileName}</p>
                <p style="color: #aaa; font-size: 12px; margin: 0 0 12px;">File storage is not configured — open the Admin Dashboard to view the CV in the browser.</p>
                <a href="${APP_URL}/admin/careers"
                   style="background: #FDF5AA; color: #0B2540; padding: 12px 32px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block;">
                  Open Admin Dashboard →
                </a>
              </div>
              ` : `
              <a href="${cvUrl}"
                 style="background: #FDF5AA; color: #0B2540; padding: 14px 40px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 15px; display: inline-block;">
                Download CV — ${cvFileName} →
              </a>
              <p style="color: #555; font-size: 12px; margin: 16px 0 0;">
                <a href="${APP_URL}/admin/careers" style="color: #58A0C8; text-decoration: none;">Open in Admin Dashboard →</a>
              </p>
              `}
            </div>

            ${footer}
          </div>
        </body>
      </html>
    `,
  });
}

// ── 5. Job Application Confirmation ───────────────────────────────────────────
export async function sendApplicationConfirmation({
  to,
  applicantName,
  jobTitle,
  jobTeam,
  applicationId,
}: {
  to: string;
  applicantName: string;
  jobTitle: string;
  jobTeam: string;
  applicationId: string;
}) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: resolveRecipient(to),
    bcc: ADMIN_EMAIL,
    subject: `Application Received — ${jobTitle} at VeloRent`,
    html: `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8" /><title>Application Received</title></head>
        <body style="${baseStyles}">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            ${header}

            <!-- Status banner -->
            <div style="background: rgba(253,245,170,0.08); border: 1px solid rgba(253,245,170,0.2); border-radius: 12px; padding: 16px 20px; margin-bottom: 24px;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 10px; height: 10px; border-radius: 50%; background: #FDF5AA; flex-shrink: 0;"></div>
                <div>
                  <p style="margin: 0; font-weight: 700; color: #FDF5AA; font-size: 14px; letter-spacing: 1px;">APPLICATION RECEIVED</p>
                  <p style="margin: 4px 0 0; color: #aaa; font-size: 13px;">We'll be in touch within 5–7 business days.</p>
                </div>
              </div>
            </div>

            <!-- Main card -->
            <div style="background: #113F67; border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 32px; margin-bottom: 24px;">
              <p style="color: #aaa; margin: 0 0 4px; font-size: 13px;">Hi ${applicantName},</p>
              <h2 style="color: #ffffff; font-size: 22px; margin: 0 0 12px; font-weight: 700;">
                Thanks for applying!
              </h2>
              <p style="color: #aaa; font-size: 14px; line-height: 1.7; margin: 0 0 24px;">
                We've received your application for the <strong style="color: #fff;">${jobTitle}</strong> role
                on the <strong style="color: #fff;">${jobTeam}</strong> team. Our hiring team will review
                your application and get back to you soon.
              </p>

              <div style="border-top: 1px solid rgba(255,255,255,0.05); padding-top: 24px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px 0; color: #666; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.04);">Application ID</td>
                    <td style="padding: 10px 0; color: #fff; font-size: 14px; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.04); font-family: monospace;">#${applicationId.slice(-8).toUpperCase()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #666; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.04);">Role</td>
                    <td style="padding: 10px 0; color: #fff; font-size: 14px; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.04);">${jobTitle}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #666; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.04);">Team</td>
                    <td style="padding: 10px 0; color: #fff; font-size: 14px; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.04);">${jobTeam}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #666; font-size: 14px;">Status</td>
                    <td style="padding: 10px 0; text-align: right;">
                      <span style="background: rgba(253,245,170,0.1); color: #FDF5AA; border: 1px solid rgba(253,245,170,0.2); border-radius: 20px; padding: 3px 12px; font-size: 12px; font-weight: 600;">PENDING REVIEW</span>
                    </td>
                  </tr>
                </table>
              </div>
            </div>

            <!-- What happens next -->
            <div style="background: rgba(88,160,200,0.05); border: 1px solid rgba(88,160,200,0.15); border-radius: 12px; padding: 20px 24px; margin-bottom: 24px;">
              <p style="color: #58A0C8; font-size: 13px; font-weight: 700; margin: 0 0 14px; text-transform: uppercase; letter-spacing: 1px;">What happens next?</p>
              <div style="space-y: 10px;">
                <div style="display: flex; gap: 12px; margin-bottom: 10px;">
                  <span style="color: #FDF5AA; font-weight: 700; font-size: 14px; flex-shrink: 0;">01</span>
                  <p style="color: #aaa; font-size: 14px; margin: 0; line-height: 1.6;">Our team reviews your application and CV — usually within 5–7 business days.</p>
                </div>
                <div style="display: flex; gap: 12px; margin-bottom: 10px;">
                  <span style="color: #FDF5AA; font-weight: 700; font-size: 14px; flex-shrink: 0;">02</span>
                  <p style="color: #aaa; font-size: 14px; margin: 0; line-height: 1.6;">If shortlisted, we'll reach out to schedule an initial call.</p>
                </div>
                <div style="display: flex; gap: 12px;">
                  <span style="color: #FDF5AA; font-weight: 700; font-size: 14px; flex-shrink: 0;">03</span>
                  <p style="color: #aaa; font-size: 14px; margin: 0; line-height: 1.6;">Either way, we'll let you know our decision by email.</p>
                </div>
              </div>
            </div>

            <!-- Footer note -->
            <p style="color: #555; font-size: 13px; text-align: center; margin: 0 0 32px; line-height: 1.6;">
              Questions? Reply to this email or reach us at
              <a href="mailto:careers@velorent.com" style="color: #58A0C8; text-decoration: none;">careers@velorent.com</a>
            </p>

            ${footer}
          </div>
        </body>
      </html>
    `,
  });
}

// ── 6. Contact Form Message ────────────────────────────────────────────────────
export async function sendContactMessage({
  name,
  email,
  subject,
  category,
  message,
}: {
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
}) {
  const categoryLabels: Record<string, string> = {
    booking: "Booking & Reservations",
    payment: "Payments & Billing",
    vehicle: "Vehicle / Damage",
    account: "Account & Profile",
    other: "Other",
  };
  const categoryLabel = categoryLabels[category] ?? category;
  const sentAt = new Intl.DateTimeFormat("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  }).format(new Date());

  // 1. Notify admin
  if (ADMIN_EMAIL) {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      replyTo: email,
      subject: `[Contact] ${categoryLabel} — ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head><meta charset="utf-8" /><title>New Contact Message</title></head>
          <body style="${baseStyles}">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              ${header}

              <div style="background: rgba(88,160,200,0.08); border: 1px solid rgba(88,160,200,0.25); border-radius: 12px; padding: 16px 20px; margin-bottom: 24px;">
                <p style="margin: 0; font-weight: 700; color: #58A0C8; font-size: 14px; letter-spacing: 1px;">NEW CONTACT MESSAGE</p>
                <p style="margin: 4px 0 0; color: #aaa; font-size: 13px;">Sent on ${sentAt}</p>
              </div>

              <div style="background: #113F67; border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 32px; margin-bottom: 24px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px 0; color: #666; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.04); width: 35%;">From</td>
                    <td style="padding: 10px 0; color: #fff; font-size: 14px; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.04);">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #666; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.04);">Email</td>
                    <td style="padding: 10px 0; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.04);">
                      <a href="mailto:${email}" style="color: #58A0C8; font-size: 14px; text-decoration: none;">${email}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #666; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.04);">Category</td>
                    <td style="padding: 10px 0; color: #fff; font-size: 14px; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.04);">${categoryLabel}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #666; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.04);">Subject</td>
                    <td style="padding: 10px 0; color: #fff; font-size: 14px; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.04);">${subject}</td>
                  </tr>
                </table>

                <div style="margin-top: 24px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 20px;">
                  <p style="color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 10px;">Message</p>
                  <p style="color: #ddd; font-size: 14px; line-height: 1.7; margin: 0; white-space: pre-wrap;">${message}</p>
                </div>
              </div>

              <div style="text-align: center; padding: 8px 0 32px;">
                <a href="mailto:${email}?subject=Re: ${subject}"
                   style="background: #FDF5AA; color: #0B2540; padding: 14px 40px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 15px; display: inline-block;">
                  Reply to ${name} →
                </a>
              </div>

              ${footer}
            </div>
          </body>
        </html>
      `,
    });
  }

  // 2. Auto-reply to the sender
  await resend.emails.send({
    from: FROM_EMAIL,
    to: resolveRecipient(email),
    subject: `We received your message — ${subject}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8" /><title>Message Received</title></head>
        <body style="${baseStyles}">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            ${header}

            <div style="background: rgba(253,245,170,0.06); border: 1px solid rgba(253,245,170,0.15); border-radius: 12px; padding: 16px 20px; margin-bottom: 24px;">
              <p style="margin: 0; font-weight: 700; color: #FDF5AA; font-size: 14px; letter-spacing: 1px;">MESSAGE RECEIVED</p>
              <p style="margin: 4px 0 0; color: #aaa; font-size: 13px;">We'll get back to you within 24 hours.</p>
            </div>

            <div style="background: #113F67; border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 32px; margin-bottom: 24px;">
              <p style="color: #aaa; margin: 0 0 4px; font-size: 13px;">Hi ${name},</p>
              <h2 style="color: #fff; font-size: 20px; margin: 0 0 16px; font-weight: 700;">Thanks for reaching out!</h2>
              <p style="color: #aaa; font-size: 14px; line-height: 1.7; margin: 0 0 24px;">
                We've received your message and our support team will review it shortly.
                You can expect a reply within <strong style="color: #fff;">24 hours</strong> on business days.
              </p>

              <div style="border-top: 1px solid rgba(255,255,255,0.05); padding-top: 20px;">
                <p style="color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px;">Your message summary</p>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.04); width: 35%;">Category</td>
                    <td style="padding: 8px 0; color: #fff; font-size: 13px; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.04);">${categoryLabel}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-size: 13px;">Subject</td>
                    <td style="padding: 8px 0; color: #fff; font-size: 13px; text-align: right;">${subject}</td>
                  </tr>
                </table>
              </div>
            </div>

            <p style="color: #555; font-size: 13px; text-align: center; margin: 0 0 32px; line-height: 1.6;">
              Need urgent help? Call us at
              <a href="tel:+18008356736" style="color: #58A0C8; text-decoration: none;">+1 (800) VELO-RENT</a>
              or email
              <a href="mailto:support@velorent.com" style="color: #58A0C8; text-decoration: none;">support@velorent.com</a>
            </p>

            ${footer}
          </div>
        </body>
      </html>
    `,
  });
}

// ── 7. Newsletter Welcome + Promo ─────────────────────────────────────────────
export async function sendNewsletterWelcome({ to }: { to: string }) {
  const PROMO_CODE = "WELCOME20";
  const PROMO_DESC = "20% off your first rental";

  await resend.emails.send({
    from: FROM_EMAIL,
    to: resolveRecipient(to),
    bcc: ADMIN_EMAIL || undefined,
    subject: `Welcome to VeloRent — Here's 20% off your first rental 🎉`,
    html: `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8" /><title>Welcome to VeloRent</title></head>
        <body style="${baseStyles}">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            ${header}

            <!-- Hero banner -->
            <div style="background: linear-gradient(135deg, rgba(253,245,170,0.12) 0%, rgba(88,160,200,0.08) 100%); border: 1px solid rgba(253,245,170,0.2); border-radius: 16px; padding: 32px; text-align: center; margin-bottom: 24px;">
              <p style="color: #FDF5AA; font-size: 13px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 12px;">Welcome to the fleet</p>
              <h2 style="color: #fff; font-size: 26px; font-weight: 900; margin: 0 0 8px;">Thanks for subscribing!</h2>
              <p style="color: #aaa; font-size: 14px; line-height: 1.6; margin: 0;">
                As a thank-you, here's an exclusive promo code just for you.
              </p>
            </div>

            <!-- Promo code card -->
            <div style="background: #113F67; border: 1px solid rgba(253,245,170,0.15); border-radius: 16px; padding: 32px; margin-bottom: 24px; text-align: center;">
              <p style="color: #aaa; font-size: 13px; margin: 0 0 16px;">Your exclusive promo code</p>
              <div style="display: inline-block; background: rgba(253,245,170,0.08); border: 2px dashed rgba(253,245,170,0.4); border-radius: 12px; padding: 16px 40px; margin-bottom: 16px;">
                <span style="font-family: monospace; font-size: 28px; font-weight: 900; letter-spacing: 6px; color: #FDF5AA;">${PROMO_CODE}</span>
              </div>
              <p style="color: #fff; font-size: 16px; font-weight: 700; margin: 0 0 6px;">${PROMO_DESC}</p>
              <p style="color: #666; font-size: 12px; margin: 0;">Valid on your first booking · No minimum spend</p>
            </div>

            <!-- How to use -->
            <div style="background: rgba(88,160,200,0.05); border: 1px solid rgba(88,160,200,0.15); border-radius: 12px; padding: 20px 24px; margin-bottom: 24px;">
              <p style="color: #58A0C8; font-size: 12px; font-weight: 700; margin: 0 0 14px; text-transform: uppercase; letter-spacing: 1px;">How to use it</p>
              <div style="display: flex; gap: 12px; margin-bottom: 10px;">
                <span style="color: #FDF5AA; font-weight: 700; font-size: 14px; flex-shrink: 0; min-width: 20px;">1.</span>
                <p style="color: #aaa; font-size: 14px; margin: 0; line-height: 1.6;">Browse our fleet and pick your perfect car.</p>
              </div>
              <div style="display: flex; gap: 12px; margin-bottom: 10px;">
                <span style="color: #FDF5AA; font-weight: 700; font-size: 14px; flex-shrink: 0; min-width: 20px;">2.</span>
                <p style="color: #aaa; font-size: 14px; margin: 0; line-height: 1.6;">Select your dates and click Reserve.</p>
              </div>
              <div style="display: flex; gap: 12px;">
                <span style="color: #FDF5AA; font-weight: 700; font-size: 14px; flex-shrink: 0; min-width: 20px;">3.</span>
                <p style="color: #aaa; font-size: 14px; margin: 0; line-height: 1.6;">Enter <strong style="color: #FDF5AA; font-family: monospace;">${PROMO_CODE}</strong> in the promo code field at checkout.</p>
              </div>
            </div>

            <!-- CTA -->
            <div style="text-align: center; padding: 8px 0 32px;">
              <a href="${APP_URL}/cars"
                 style="background: #FDF5AA; color: #0B2540; padding: 14px 48px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 15px; display: inline-block;">
                Browse Cars →
              </a>
            </div>

            ${footer}
          </div>
        </body>
      </html>
    `,
  });
}
