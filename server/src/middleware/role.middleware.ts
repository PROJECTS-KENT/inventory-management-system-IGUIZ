
import { RequestHandler } from "express";
import { AuthRequest } from "./auth.middleware";

export function authorize(...roles: string[]): RequestHandler {
  return (req, res, next): void => {
    const authReq = req as AuthRequest;

    console.log("Decoded user:", authReq.user);
    console.log("Allowed roles:", roles);

    if (!authReq.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    if (!roles.includes(authReq.user.role)) {
      res.status(403).json({
        success: false,
        message: "Forbidden: You do not have permission.",
      });
      return;
    }

    next();
  };
}
