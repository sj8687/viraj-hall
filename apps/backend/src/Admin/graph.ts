import { prisma } from "@repo/db";
import { Router } from "express";
import { middleware } from "../middleware/adminmiddle";
export const graph = Router();

graph.get("/admin/user-growth",middleware, async (req, res) => {
 try {
     const rangeDays = parseInt(req.query.range as string);
     const start = new Date();
     start.setDate(start.getDate() - rangeDays + 1);
     start.setHours(0, 0, 0, 0);
   
     const users = await prisma.user.findMany({
       where: {
         createdAt: { gte: start },
       },
     });
   
     const counts: { [date: string]: number } = {};
     users.forEach((u) => {
       const d = u.createdAt.toISOString().slice(0, 10);
       counts[d] = (counts[d] || 0) + 1;
     });
   
     const dates = [];
     for (let i = 0; i < rangeDays; i++) {
       const d = new Date(start);
       d.setDate(start.getDate() + i);
       dates.push(d.toISOString().slice(0, 10));
     }
   
     const data = dates.map((d) => ({ date: d, count: counts[d] || 0 }));
     res.json(data);
 } catch (error) {
   
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
 }
});
