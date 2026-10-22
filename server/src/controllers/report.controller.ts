import { Request, Response } from "express";
import {
  generateInventoryPDF,
  generateInventoryExcel,
  getAnalytics,
} from "../services/report.service";

export async function analytics(
  req: Request,
  res: Response
) {
  try {
    const data = await getAnalytics();

    res.json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to load analytics",
    });
  }
}


export async function exportPDF(
  req: Request,
  res: Response
) {
  try {
    const pdf = await generateInventoryPDF();

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="inventory-report.pdf"'
    );

    return res.send(pdf);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate PDF report",
    });
  }
}

export async function exportExcel(
  req: Request,
  res: Response
) {
  try {
    const excel = await generateInventoryExcel();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="inventory-report.xlsx"'
    );

    return res.send(excel);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate Excel report",
    });
  }
}