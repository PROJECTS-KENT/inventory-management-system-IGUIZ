import {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";
import prisma from "../config/prisma";
import { verifyToken } from "../utils/jwt";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
    name?: string;
    email?: string;
  };
}

export const authenticate: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      message: "No valid authorization token provided",
    });
    return;
  }

  const token = authHeader.slice("Bearer ".length).trim();

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
    return;
  }

  try {
    const decoded = verifyToken(token);

    if (
      typeof decoded === "string" ||
      !("id" in decoded) ||
      typeof decoded.id !== "string"
    ) {
      res.status(401).json({
        success: false,
        message: "Invalid token",
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message:
          "Account is inactive or no longer exists. Please log in again.",
      });
      return;
    }

    (req as AuthRequest).user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.name === "PrismaClientKnownRequestError"
    ) {
      console.error("Authentication database error:", error.message);

      res.status(500).json({
        success: false,
        message: "Unable to verify account status",
      });
      return;
    }

    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};