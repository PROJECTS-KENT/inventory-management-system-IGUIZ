import { Response } from "express";
import * as customerService from "../services/customer.service";

export async function getProfile(req: any, res: Response) {
  try {
    const customer = await customerService.getCustomer(req.customer.id);

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.json(customer);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to load profile",
    });
  }
}

export async function updateProfile(req: any, res: Response) {
  try {
    const customer = await customerService.updateCustomer(
      req.customer.id,
      req.body
    );

    res.json(customer);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update profile",
    });
  }
}

export async function getOrders(req: any, res: Response) {
  try {
    const orders =
      await customerService.getCustomerOrders(
        req.customer.id
      );

    res.json(orders);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to load orders",
    });
  }
}

// ===============================
// NEW - Get One Customer Order
// ===============================

export async function getOrder(req: any, res: Response) {
  try {
    const order =
      await customerService.getCustomerOrder(
        req.customer.id,
        req.params.id
      );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json(order);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to load order",
    });
  }
}