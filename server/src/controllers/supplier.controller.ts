import { Request, Response } from "express";
import {
  createSupplier,
  getSuppliers,
} from "../services/supplier.service";

export async function create(req: Request, res: Response) {
  try {
    const { name, email, phone, address } = req.body;

    const supplier = await createSupplier(
      name,
      email,
      phone,
      address
    );

    res.status(201).json({
      success: true,
      supplier,
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

export async function getAll(req: Request, res: Response) {
  try {
    const suppliers = await getSuppliers();

    res.json({
      success: true,
      suppliers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch suppliers",
    });
  }
}