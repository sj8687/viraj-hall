import  { Request, Response, Router } from 'express';
import { prisma } from '@repo/db';
import { bugReportSchema } from '@repo/zod';
import  { cloudinaryUploader } from "./../utils/cloud";
import { userMiddleware } from '../middleware/clientmiddle';
import { middleware } from '../middleware/adminmiddle';

export const bug = Router();


bug.post('/bug-report',userMiddleware, cloudinaryUploader.single('screenshot'), async (req: Request, res: Response) => {
  try {
    const { title, description, userEmail, userName } = req.body;
    const file = req.file;

    if (!file || !title || !description || !userEmail || !userName) {
       res.status(400).json({ error: 'All fields is required' });
       return
    }

    const validation = bugReportSchema.safeParse({ title, description, userEmail, userName });
    if (!validation.success) {
       res.status(400).json({ error: validation.error });
       return
    }

    await prisma.bugReport.create({
      data: {
        title,
        description,
        screenshot: file.path,
        userEmail,
        userName,
        user: {
          connect: { email: userEmail }
        }
      },
    });

    res.status(200).json({ message: 'Bug report submitted!', imageUrl: file.path });

  } catch (err: any) {
    console.error('Bug report error:', err);
    if (err.message?.includes('Only image files are allowed')) {
       res.status(400).json({ error: 'Only image files are allowed!' });
       return
    } else if (err.message?.includes('File too large')) {
       res.status(400).json({ error: 'Image must be less than 1MB!' });
       return
    }
    res.status(500).json({ error: 'Something went wrong ohh' });
  }
});




// Fetch all bug reports
bug.get('/bug-report',middleware, async (req, res) => {
  try {
    const bugs = await prisma.bugReport.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ bugs });
  } catch (error) {
    console.error('Error fetching bug reports:', error);
    res.status(500).json({ error: 'Failed to fetch bug reports' });
  }
});
