
import { Request, Response } from "express";

import {
  getUsers,
  createUser,
  toggleUserStatus,
} from "../services/user.service";

export async function getAll(req: Request, res: Response) {
  try {
    const users = await getUsers();

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const user = await createUser(req.body);

    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create user",
    });
  }
}

export async function toggleStatus(req: Request, res: Response) {
  const id = req.params.id;

  if (typeof id !== "string") {
    res.status(400).json({
      success: false,
      message: "Invalid user ID",
    });
    return;
  }

  try {
    const user = await toggleUserStatus(id);

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update user",
    });
  }
}
