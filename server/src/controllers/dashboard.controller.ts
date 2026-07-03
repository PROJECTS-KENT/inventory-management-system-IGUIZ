import { Request, Response } from "express";
import { getDashboardData } from "../services/dashboard.service";

export async function dashboard(
  req: Request,
  res: Response
) {
  try {
    const data = await getDashboardData();

    res.json({
      success: true,
      dashboard: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard",
    });
  }
}