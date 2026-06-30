import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";
import { AuthRequest } from "../middleware/auth.middleware";

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;

    const user = await registerUser(name, email, password);

    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const result = await loginUser(email, password);

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
}

export async function me(req: AuthRequest, res: Response) {
  res.json({
    success: true,
    user: req.user,
  });
}