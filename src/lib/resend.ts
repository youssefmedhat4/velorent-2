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
