
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";

const JWT_SECRET = process.env.JWT_SECRET;

export interface CustomerRequest extends Request {
  customer?: {
    id: string;
    type: "CUSTOMER";
  };
}

export async function authenticateCustomer(
  req: CustomerRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!JWT_SECRET) {
    res.status(500).json({ message: "Authentication is not configured" });
    return;
  }

  const auth = req.headers.authorization;

  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const token = auth.slice("Bearer ".length).trim();

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (
      typeof decoded === "string" ||
      decoded.type !== "CUSTOMER" ||
      typeof decoded.id !== "string"
    ) {
      res.status(401).json({ message: "Invalid customer token" });
      return;
    }

    const customer = await prisma.customer.findUnique({
      where: { id: decoded.id },
      select: { id: true },
    });

    if (!customer) {
      res.status(401).json({ message: "Customer account not found" });
      return;
    }

    req.customer = {
      id: customer.id,
      type: "CUSTOMER",
    };

    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: "Session expired" });
      return;
    }

    res.status(401).json({ message: "Invalid token" });
  }
}
