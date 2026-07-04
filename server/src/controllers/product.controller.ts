import { Request, Response } from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
} from "../services/product.service";

export async function create(req: Request, res: Response) {
  try {
    const product = await createProduct(req.body);

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create product",
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

export async function update(req: Request, res: Response) {
  try {
    const product = await updateProduct(req.params.id, req.body);

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

export async function remove(req: Request, res: Response) {
  try {
    await deleteProduct(req.params.id);

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
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