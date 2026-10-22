import { Request, Response } from "express";
import {
  stockIn,
  stockOut,
  getInventoryHistory,
} from "../services/inventory.service";

export async function addStock(req: Request, res: Response) {
  try {
    const { productId, quantity, remarks } = req.body;

    const userId = (req as any).user.id;

    const product = await stockIn(
      productId,
      Number(quantity),
      userId,
      remarks
    );

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong",
    });
  }
}

export async function removeStock(req: Request, res: Response) {
  try {
    const { productId, quantity, remarks } = req.body;

    const userId = (req as any).user.id;

    const product = await stockOut(
      productId,
      Number(quantity),
      userId,
      remarks
    );

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong",
    });
  }
}

export async function history(req: Request, res: Response) {
  try {
    const transactions = await getInventoryHistory();

    res.json({
      success: true,
      transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch history",
    });
  }
}