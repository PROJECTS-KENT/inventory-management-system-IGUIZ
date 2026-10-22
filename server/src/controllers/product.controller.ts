import { Request, Response } from "express";
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
  try {
    const data =
      await productPerformanceService.getProductPerformance(
        req.params.id
      );

    res.json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to load product performance",
    });
  }
}

export async function create(req: AuthRequest, res: Response) {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const product = await createProduct({
  ...req.body,
  price: Number(req.body.price),
  quantity: Number(req.body.quantity),
  image: req.file?.filename,
});

console.log("Authenticated user:", req.user);

const activity = await logActivity(
  req.user!.id,
  "CREATE PRODUCT",
  `Created product "${product.name}"`
);

console.log("Activity created:", activity);

    return res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      console.error(error.stack);
    }

    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed",
    });
  }
}

export async function getAll(req: Request, res: Response) {
  try {
    const search = req.query.search as string | undefined;
    const category = req.query.category as string | undefined;
    const supplier = req.query.supplier as string | undefined;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

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
        error instanceof Error ? error.message : "Failed to fetch products",
    });
  }
}

export async function getOne(req: Request, res: Response) {
  try {
    const product = await getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch product",
    });
  }
}

export async function update(req: AuthRequest, res: Response) {
  try {
    const data: any = {
      ...req.body,
      price: req.body.price ? Number(req.body.price) : undefined,
      quantity: req.body.quantity
        ? Number(req.body.quantity)
        : undefined,
    };

    if (req.file) {
      data.image = req.file.filename;
    }

    const product = await updateProduct(req.params.id, data);

    await logActivity(
      req.user!.id,
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
        error instanceof Error ? error.message : "Failed to update product",
    });
  }
}

export async function remove(req: AuthRequest, res: Response) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await deleteProduct(req.params.id);

    await logActivity(
      req.user!.id,
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
        error instanceof Error ? error.message : "Failed to delete product",
    });
  }
}

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
      return res.status(400).json({
        success: false,
        message: "No Excel file uploaded.",
      });
    }

    const result = await importProductsFromExcel(
      req.file.buffer
    );

    return res.json({
      success: true,
      message: `${result} products imported successfully.`,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Import failed",
    });
  }
}