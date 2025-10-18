// routes/admin.js
import express, { Router } from "express";
import { prisma } from "@repo/db";
import { middleware } from "../middleware/adminmiddle";
import cache from "../utils/casche";

export const adminbooking = Router();


adminbooking.get("/admin/bookings",middleware, async (req, res) => {
  const cachedData = cache.get("adminBookings");

  if (cachedData) {
     res.json(cachedData);
     return
  }

  const bookings = await prisma.booking.findMany({
    include: { user: true },
    orderBy: { date: "desc" },
  });

  const grouped = bookings.reduce(
  (acc: Record<string, typeof bookings>, booking: typeof bookings[number]) => {
    const date = new Date(booking.date);
    const monthYear = `${date.toLocaleString("default", {
      month: "long",
    })} ${date.getFullYear()}`;

    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }

    acc[monthYear].push(booking);
    
    return acc;
  }, {}
);

  cache.set("adminBookings", grouped); // ✅ set new cache

  res.json(grouped);
});



adminbooking.delete("/admin/delete/:id", middleware, async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.booking.delete({
      where: { id: id },
    });

    cache.del("adminBookings");

    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete booking" });
  }
});



