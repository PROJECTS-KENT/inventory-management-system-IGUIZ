import { Request, Response } from "express";
import {
  createCategory,
  getCategories,
} from "../services/category.service";

export async function create(req: Request, res: Response) {
  try {
    const { name } = req.body;

    const category = await createCategory(name);

    res.status(201).json({
      success: true,
      category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
}

export async function list(req: Request, res: Response) {
  const categories = await getCategories();

  res.json({
    success: true,
    categories,
  });
}