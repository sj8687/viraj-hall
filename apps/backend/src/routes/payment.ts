import express, { Router } from 'express';
import { prisma } from "@repo/db"
import { razorpay } from '../utils/razerpay';
import crypto from "crypto"
import { transporter } from '../utils/otpConfig';
import { userMiddleware } from '../middleware/clientmiddle';
import cache from "../utils/casche";

export const payment = Router();


payment.post('/create',userMiddleware, async (req, res) => {
  const { bookingId } = req.body;

  if (!bookingId) {
     res.status(400).json({ error: 'Booking ID is required' });
     return
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
       res.status(404).json({ error: 'Booking not found' });
       return
    }

    const amount = booking.plan === 'PREMIUM' ? 15000000 : 7000000; // in paise

    const options = {
      amount,
      currency: 'INR',
      // receipt: `receipt_${bookingId}`,
    };

    const order = await razorpay.orders.create(options);
     cache.del(`bookings-${booking.email}`);
       cache.del("adminBookings");
    res.json({ orderId: order.id, amount, currency: order.currency });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});



payment.post("/verify",userMiddleware, async (req, res) => {
  const { order_id, payment_Id, signature, bookingId } = req.body;

  if (!order_id || !payment_Id || !signature || !bookingId) {
   res.status(400).json({ error: "Missing required fields" });
   return
}

  const secret_id = process.env.RAZORPAY_KEY_SECRET!;

  const generatedSignature = crypto
    .createHmac('sha256', secret_id)
    .update(`${order_id}|${payment_Id}`)
    .digest('hex');

  if (generatedSignature === signature) {
    try {
    const updatebooking = await prisma.booking.update({
        where: { id: bookingId },
        data: {
          paymentId: payment_Id,
          status: 'CONFIRMED',
        },
      });



        const emailSendData = await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: updatebooking.email!, // client email from DB
        subject: '🎉 Booking Confirmed - Viraj Multipurpose Hall',
        html: `
          <h2>Dear ${updatebooking.customer},</h2>
          <p>Your booking has been <strong>successfully confirmed</strong>!</p>
          <ul>
            <li><strong>Date:</strong> ${updatebooking.date}</li>
            <li><strong>Time:</strong> ${updatebooking.timeSlot}</li>
            <li><strong>Plan:</strong> ${updatebooking.plan}</li>
            <li><strong>Guests:</strong> ${updatebooking.guests}</li>
            <li><strong>Function:</strong> ${updatebooking.functionType}</li>
          </ul>
          <p>Thank you for choosing <strong>Viraj Multipurpose Hall</strong>. We look forward to hosting your special occasion!</p>
          <br />
          <p style="font-size: 0.9rem; color: gray;">This is an automated email. Do not reply.</p>
        `,
        });

      // await transporter.sendMail(mailOptions);


       cache.del(`bookings-${updatebooking.email}`);
       cache.del("adminBookings");
      res.json({ success: true });
    } catch (err) {
      console.error("Failed to update booking:", err);
      res.status(500).json({ error: "Failed to update booking rebook if payment failed" });
    }
  } else {
    res.status(400).json({ error: "Invalid signature" });
  }
});




// payment.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
//   const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;
//   const signature = req.headers['x-razorpay-signature'] as string;

//   const body = req.body;

//   const expectedSignature = crypto
//     .createHmac('sha256', webhookSecret)
//     .update(req.body.toString()) // raw body
//     .digest('hex');

//   if (signature !== expectedSignature) {
//      res.status(400).json({ error: 'Invalid signature' });
//      return
//   }

//   const event = JSON.parse(body.toString());

//   if (event.event === 'payment.captured') {
//     const paymentId = event.payload.payment.entity.id;
//     const receipt = event.payload.payment.entity.notes?.bookingId || event.payload.payment.entity.order_id;

//     try {
//       await prisma.booking.update({
//         where: { id: receipt },
//         data: {
//           paymentId,
//           status: 'CONFIRMED',
//         },
//       });

//       console.log('Payment verified and booking updated');
//     } catch (err) {
//       console.error('Failed to update booking', err);
//     }
//   }

//   res.status(200).json({ status: 'ok' });
// });


