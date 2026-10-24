
import { Request, Response, RequestHandler } from "express";
import { logActivity } from "../services/activity.service";
import { AuthRequest } from "../middleware/auth.middleware";
import * as productPerformanceService from "../services/productPerformance.service";
import prisma from "../config/prisma";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
  importProductsFromExcel,
} from "../services/product.service";

export async function performance(req: Request, res: Response) {
  const id = req.params.id;

  if (typeof id !== "string") {
    res.status(400).json({
      success: false,
      message: "Invalid product ID",
    });
    return;
  }

  try {
    const data =
      await productPerformanceService.getProductPerformance(id);

    res.json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to load product performance",
    });
  }
}

export const create: RequestHandler = async (req, res) => {
  const authReq = req as AuthRequest;

  try {
    if (!authReq.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const product = await createProduct({
      ...req.body,
      price: Number(req.body.price),
      quantity: Number(req.body.quantity),
      image: req.file?.path,
    });

    await logActivity(
      authReq.user.id,
      "CREATE PRODUCT",
      `Created product "${product.name}"`
    );

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed",
    });
  }
};

export async function getAll(req: Request, res: Response) {
  try {
    const search = req.query.search as string | undefined;
    const category = req.query.category as string | undefined;
    const supplier = req.query.supplier as string | undefined;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 1000;

    const result = await getProducts(
      search,
      category,
      supplier,
      page,
      limit
    );

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch products",
    });
  }
}

export async function getOne(req: Request, res: Response) {
  const id = req.params.id;

  if (typeof id !== "string") {
    res.status(400).json({
      success: false,
      message: "Invalid product ID",
    });
    return;
  }

  try {
    const product = await getProductById(id);

    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch product",
    });
  }
}

export const update: RequestHandler = async (req, res) => {
  const authReq = req as AuthRequest;
  const id = req.params.id;

  if (typeof id !== "string") {
    res.status(400).json({
      success: false,
      message: "Invalid product ID",
    });
    return;
  }

  try {
    if (!authReq.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const data: any = {
      ...req.body,
      price:
        req.body.price !== undefined && req.body.price !== ""
          ? Number(req.body.price)
          : undefined,
      quantity:
        req.body.quantity !== undefined && req.body.quantity !== ""
          ? Number(req.body.quantity)
          : undefined,
    };

    if (req.file) {
  data.image = req.file.path;
}

    const product = await updateProduct(id, data);

    await logActivity(
      authReq.user.id,
      "UPDATE PRODUCT",
      `Updated product "${product.name}"`
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
          : "Failed to update product",
    });
  }
};

export const remove: RequestHandler = async (req, res) => {
  const authReq = req as AuthRequest;
  const id = req.params.id;

  if (typeof id !== "string") {
    res.status(400).json({
      success: false,
      message: "Invalid product ID",
    });
    return;
  }

  try {
    if (!authReq.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }

    await deleteProduct(id);

    await logActivity(
      authReq.user.id,
      "DELETE PRODUCT",
      `Deleted product "${product.name}"`
    );

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete product",
    });
  }
};

export async function lowStock(req: Request, res: Response) {
  try {
    const limit = Number(req.query.limit) || 5;
    const products = await getLowStockProducts(limit);

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch low stock products",
    });
  }
}

export async function importProducts(
  req: Request,
  res: Response
) {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "No Excel file uploaded.",
      });
      return;
    }

    const result = await importProductsFromExcel(req.file.buffer);

    res.json({
      success: true,
      message: `${result} products imported successfully.`,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Import failed",
    });
  }
}
