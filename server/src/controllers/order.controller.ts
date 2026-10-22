
import { Request, Response } from "express";
import * as orderService from "../services/order.service";
import { CustomerRequest } from "../middleware/customerAuth.middleware";

export async function create(req: Request, res: Response) {
  try {
    const customerId = (req as any).customer.id;

    const order = await orderService.createOrder({
      ...req.body,
      customerId,
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("ORDER ERROR:", error);

    res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to create order",
    });
  }
}

export async function findAll(req: Request, res: Response) {
  try {
    const orders = await orderService.getOrders();

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
}

export async function findOne(req: Request, res: Response) {
  const id = req.params.id;

  if (typeof id !== "string") {
    res.status(400).json({ message: "Invalid order ID" });
    return;
  }

  try {
    const order = await orderService.getOrder(id);

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    res.json(order);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch order",
    });
  }
}

export async function findByReference(
  req: Request,
  res: Response
) {
  const reference = req.params.reference;

  if (typeof reference !== "string") {
    res.status(400).json({ message: "Invalid order reference" });
    return;
  }

  try {
    const order =
      await orderService.getOrderByReference(reference);

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    res.json(order);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch order",
    });
  }
}

export async function trackOrder(
  req: Request,
  res: Response
) {
  const reference = req.params.reference;

  if (typeof reference !== "string") {
    res.status(400).json({ message: "Invalid order reference" });
    return;
  }

  try {
    const order = await orderService.trackOrder(reference);

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    res.json(order);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to track order",
    });
  }
}

export async function approve(
  req: Request,
  res: Response
) {
  const id = req.params.id;

  if (typeof id !== "string") {
    res.status(400).json({ message: "Invalid order ID" });
    return;
  }

  try {
    const order = await orderService.approveOrder(id);

    res.json({
      message: "Order approved successfully",
      order,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message:
        error instanceof Error ? error.message : "Failed to approve order",
    });
  }
}

export async function reject(
  req: Request,
  res: Response
) {
  const id = req.params.id;

  if (typeof id !== "string") {
    res.status(400).json({ message: "Invalid order ID" });
    return;
  }

  try {
    const order = await orderService.rejectOrder(id);

    res.json({
      message: "Order rejected successfully",
      order,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to reject order",
    });
  }
}

export async function customerOrders(
  req: CustomerRequest,
  res: Response
) {
  try {
    const orders = await orderService.getCustomerOrders(
      req.customer!.id
    );

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to load orders",
    });
  }
}

export async function customerOrderDetails(
  req: CustomerRequest,
  res: Response
) {
  const id = req.params.id;

  if (typeof id !== "string") {
    res.status(400).json({ message: "Invalid order ID" });
    return;
  }

  try {
    const order = await orderService.getCustomerOrderById(
      req.customer!.id,
      id
    );

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to load order",
    });
  }
}

export async function unreadCount(
  req: Request,
  res: Response
) {
  try {
    const count = await orderService.getUnreadOrdersCount();

    res.json({ count });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to load notifications",
    });
  }
}

export async function markViewed(
  req: Request,
  res: Response
) {
  try {
    await orderService.markOrdersAsViewed();

    res.json({
      message: "Notifications cleared",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed",
    });
  }
}
