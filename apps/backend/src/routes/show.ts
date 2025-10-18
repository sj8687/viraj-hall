import Router from "express";
import * as dotenv from "dotenv";
dotenv.config();

import { prisma } from "@repo/db";
import { userMiddleware } from "../middleware/clientmiddle";
import cache from "../utils/casche";

export const show = Router();


show.get("/show", userMiddleware, async (req, res) => {
  const user = req.email;
  const cacheKey = `bookings-${user}`;

  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    res.json(cachedData);
    return;
  }

  try {
    const bookings = await prisma.booking.findMany({
      where: { email: user },
      orderBy: { createdAt: "desc" },
    });

    cache.set(cacheKey, bookings);
    res.json(bookings);
    return; 
  } catch (error) {
    console.error("Error fetching bookings:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Something went wrong fetching bookings" });
    }
  }
});
