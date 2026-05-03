import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "noreply@velorent.com";

export async function sendBookingConfirmation({
  to,
  userName,
  carName,
  startDate,
  endDate,
  totalPrice,
  bookingId,
}: {
  to: string;
  userName: string;
  carName: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  bookingId: string;
}) {
  const formatDate = (d: Date) =>
    new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(d);

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Booking Confirmed — ${carName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Booking Confirmation</title>
        </head>
        <body style="font-family: 'DM Sans', Arial, sans-serif; background: #0B2540; color: #ffffff; margin: 0; padding: 0;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="font-size: 32px; font-weight: 900; letter-spacing: 4px; color: #FDF5AA; margin: 0;">VELORENT</h1>
              <p style="color: #666; margin: 8px 0 0;">Premium Car Rental</p>
            </div>
            
            <div style="background: #113F67; border: 1px solid #222; border-radius: 16px; padding: 32px; margin-bottom: 24px;">
              <h2 style="color: #FDF5AA; font-size: 24px; margin: 0 0 8px;">Booking Confirmed!</h2>
              <p style="color: #aaa; margin: 0 0 24px;">Hi ${userName}, your reservation is confirmed.</p>
              
              <div style="border-top: 1px solid #222; padding-top: 24px;">
                <h3 style="color: #fff; font-size: 20px; margin: 0 0 16px;">${carName}</h3>
                
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-size: 14px;">Booking ID</td>
                    <td style="padding: 8px 0; color: #fff; font-size: 14px; text-align: right;">#${bookingId.slice(-8).toUpperCase()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-size: 14px;">Pickup Date</td>
                    <td style="padding: 8px 0; color: #fff; font-size: 14px; text-align: right;">${formatDate(startDate)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-size: 14px;">Return Date</td>
                    <td style="padding: 8px 0; color: #fff; font-size: 14px; text-align: right;">${formatDate(endDate)}</td>
                  </tr>
                  <tr style="border-top: 1px solid #222;">
                    <td style="padding: 16px 0 8px; color: #fff; font-size: 16px; font-weight: 700;">Total Paid</td>
                    <td style="padding: 16px 0 8px; color: #FDF5AA; font-size: 20px; font-weight: 700; text-align: right;">$${totalPrice.toFixed(2)}</td>
                  </tr>
                </table>
              </div>
            </div>
            
            <div style="text-align: center; padding: 24px;">
              <a href="${process.env.NEXTAUTH_URL}/bookings/${bookingId}" 
                 style="background: #FDF5AA; color: #0B2540; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 16px; display: inline-block;">
                View Booking
              </a>
            </div>
            
            <p style="text-align: center; color: #444; font-size: 12px; margin-top: 40px;">
              © ${new Date().getFullYear()} VeloRent. All rights reserved.
            </p>
          </div>
        </body>
      </html>
    `,
  });
}

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
    to,
    subject: `Booking Cancelled — ${carName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #0B2540; color: #fff;">
        <h1 style="color: #FDF5AA;">VELORENT</h1>
        <h2>Booking Cancelled</h2>
        <p>Hi ${userName}, your booking for <strong>${carName}</strong> (ID: #${bookingId.slice(-8).toUpperCase()}) has been cancelled.</p>
        <p style="color: #aaa;">If you have any questions, please contact our support team.</p>
      </div>
    `,
  });
}
