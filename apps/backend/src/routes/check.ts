import express, { Router as ExpressRouter, Router } from "express";
import * as dotenv from "dotenv";
dotenv.config()
import { prisma } from "@repo/db"
import { checkAvailabilitySchema, createBookingSchema } from "@repo/zod";
import { userMiddleware } from "../middleware/clientmiddle";
import cache from "../utils/casche";
import { adminAuth } from "../utils/firebase";



declare global {
  namespace Express {
    interface Request {
      email?: string;
    }
  }
}

export const booking = Router();


booking.get('/check', async (req, res) => {
  try {
    const { date, time } = checkAvailabilitySchema.parse(req.query);

    const existing = await prisma.booking.findFirst({
      where: {
        date: new Date(date),
        timeSlot: time,
        hall: "Viraj Multipurpose Hall",
        status: { not: 'CANCELLED' },
      },
    });

    res.json({ available: !existing });
  } catch (err) {
    res.status(400).json({ error: 'Invalid query parameterss' });
  }
});





booking.post('/book', userMiddleware, async (req, res) => {
  const email = req.email;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(401).json({ error: "User not found" });
    return;
  }

  // Verify Firebase phone 
  const firebaseToken = req.headers['x-firebase-token'] as string;
  if (!firebaseToken) {
    res.status(401).json({ error: "Phone verification token missing" });
    return
  }

  try {
    const decoded = await adminAuth.verifyIdToken(firebaseToken);
    console.log("decoded", decoded);

    const verifiedPhone = decoded.phone_number;
    console.log("phn", verifiedPhone);

    if (!verifiedPhone) {
      res.status(403).json({ error: "Invalid phone token" });
      return
    }

    const {
      date,
      timeSlot,
      customer,
      contact, // Not used anymore
      plan,
      guests,
      functionType,
      additionalInfo,
    } = createBookingSchema.parse(req.body);

    const existing = await prisma.booking.findFirst({
      where: {
        date: new Date(date),
        timeSlot,
        hall: "Viraj Multipurpose Hall",
        status: { not: 'CANCELLED' },
      },
    });

    if (existing) {
      res.status(409).json({ error: "Booking already exists for this date and time slot" });
      return
    }

    const booking = await prisma.booking.create({
      data: {
        customer,
        date: new Date(date),
        timeSlot,
        contact: verifiedPhone,
        hall: "Viraj Multipurpose Hall",
        plan,
        guests,
        email,
        functionType,
        status: 'PENDING',
        additionalInfo,
        user: {
          connect: { id: user.id },
        },
      },
    });

    cache.del(`bookings-${email}`);
    cache.del("adminBookings");

    res.json(booking);
  } catch (err: any) {
    console.error("Booking Error:", err);
    res.status(400).json({ error: err.message || "Unknown error occurred" });
  }
});