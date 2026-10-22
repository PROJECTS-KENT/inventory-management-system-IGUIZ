import { Request, Response } from "express";

import {
  registerCustomer,
  loginCustomer,
} from "../services/customerAuth.service";

export async function register(
  req: Request,
  res: Response
) {
  try {
    const { name, email, password } = req.body;

    const result = await registerCustomer(
      name,
      email,
      password
    );

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Registration failed",
    });
  }
}

export async function login(
  req: Request,
  res: Response
) {
  try {
    const { email, password } = req.body;

    const result = await loginCustomer(
      email,
      password
    );

    res.json(result);
  } catch (error) {
    res.status(401).json({
      message:
        error instanceof Error
          ? error.message
          : "Login failed",
    });
  }
}