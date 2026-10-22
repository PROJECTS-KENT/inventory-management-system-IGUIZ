import { Router } from "express";
import * as customerController from "../controllers/customer.controller";
import { authenticateCustomer } from "../middleware/customerAuth.middleware";

const router = Router();

// ===============================
// Customer Profile
// ===============================

router.get(
  "/me",
  authenticateCustomer,
  customerController.getProfile
);

router.put(
  "/profile",
  authenticateCustomer,
  customerController.updateProfile
);

// ===============================
// Customer Orders
// ===============================

router.get(
  "/orders",
  authenticateCustomer,
  customerController.getOrders
);

// NEW - Get one customer order
router.get(
  "/orders/:id",
  authenticateCustomer,
  customerController.getOrder
);

export default router;