import { Request, Response } from "express";
import prisma from "../config/prisma";

export async function getLogs(req: Request, res: Response) {
  try {
    const logs = await prisma.activityLog.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      logs,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to load activity logs",
    });
  }
}