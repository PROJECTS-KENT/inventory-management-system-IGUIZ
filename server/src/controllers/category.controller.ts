
import { Request, Response } from "express";

import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
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
      message:
        error instanceof Error ? error.message : "Something went wrong",
    });
  }
}

export async function list(req: Request, res: Response) {
  try {
    const categories = await getCategories();

    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch categories",
    });
  }
}

export async function update(req: Request, res: Response) {
  const id = req.params.id;

  if (typeof id !== "string") {
    res.status(400).json({
      success: false,
      message: "Invalid category ID",
    });
    return;
  }

  try {
    const category = await updateCategory(id, req.body.name);

    res.json({
      success: true,
      category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update category",
    });
  }
}

export async function remove(req: Request, res: Response) {
  const id = req.params.id;

  if (typeof id !== "string") {
    res.status(400).json({
      success: false,
      message: "Invalid category ID",
    });
    return;
  }

  try {
    await deleteCategory(id);

    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete category",
    });
  }
}
