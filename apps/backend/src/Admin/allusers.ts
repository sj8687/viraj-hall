import { Router } from "express";
import { middleware } from "../middleware/adminmiddle";
import { prisma } from "@repo/db";

export const allusers = Router();

allusers.get("/allusers", middleware, async (req, res) => {
    try {
        const PRICES = {
            basic: 70000,
            premium: 150000,
        } as const;

        const totalUsers = await prisma.user.count();
        const totalBookings = await prisma.booking.count();
        const totalBugs = await prisma.bugReport.count();
        const newUsers = await prisma.user.count({
            where: {
                createdAt: {
                    gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                }
            }
        })


        const bookings = await prisma.booking.findMany({
            where: { paymentId: { not: null } },
            select: { plan: true },
        });

        const totalRevenue = bookings.reduce((sum, { plan }) => {
            const key = (typeof plan === 'string' ? plan.toLowerCase() : '') as keyof typeof PRICES;
            return sum + (PRICES[key] || 0);
        }, 0);

        res.json({
            totalUsers,
            totalBookings,
            newUsers,
            totalRevenue,
            totalBugs,
        });

    } catch (error) {
        console.error("Error fetching user stats:", error);
        res.status(500).json({ error: "Internal server error" });
    }

})