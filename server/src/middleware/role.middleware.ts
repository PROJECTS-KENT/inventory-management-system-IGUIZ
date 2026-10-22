import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

export function authorize(...roles: string[]) {
  return (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    console.log("Decoded user:", req.user);
    console.log("Allowed roles:", roles);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have permission.",
      });
    }

    next();
  };
}