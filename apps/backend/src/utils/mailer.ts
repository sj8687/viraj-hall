import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export const sendBookingEmail = async (booking: any) => {
  try {
    await resend.emails.send({
      from:"Viraj Hall <noreply@be.virajmultipurposehall.site>", 
      to: booking.email!,
      subject: "🎉 Booking Confirmed - Viraj Multipurpose Hall",
      html: `
        <h2>Dear ${booking.customer},</h2>
        <p>Your booking has been <strong>successfully confirmed</strong>!</p>
        <ul>
          <li><strong>Date:</strong> ${booking.date}</li>
          <li><strong>Time:</strong> ${booking.timeSlot}</li>
          <li><strong>Plan:</strong> ${booking.plan}</li>
          <li><strong>Guests:</strong> ${booking.guests}</li>
          <li><strong>Function:</strong> ${booking.functionType}</li>
        </ul>
        <p>Thank you for choosing <strong>Viraj Multipurpose Hall</strong>. We look forward to hosting your special occasion!</p>
        <br/>
        <p style="font-size: 0.9rem; color: gray;">This is an automated email. Do not reply.</p>
      `,
    });
    console.log("✅ Booking confirmation email sent to:", booking.email);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
  }
};






