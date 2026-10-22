import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "development_secret";

export interface CustomerRequest extends Request {
  customer?: {
    id: string;
    type: string;
  };
}

export function authenticateCustomer(
  req: CustomerRequest,
  res: Response,
  next: NextFunction
) {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const token = auth.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      JWT_SECRET
    ) as any;

    req.customer = decoded;

    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Session expired",
      });
    }

    return res.status(401).json({
      message: "Invalid token",
    });
  }
}