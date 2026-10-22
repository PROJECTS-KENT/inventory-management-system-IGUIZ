import { Router } from "express";
import * as orderController from "../controllers/order.controller";
import { authenticateCustomer } from "../middleware/customerAuth.middleware";

const router = Router();

// ===============================
// Customer Routes
// ===============================

// Customer Orders
router.get(
  "/customer/orders",
  authenticateCustomer,
  orderController.customerOrders
);

// Customer Order Details (NEW)
router.get(
  "/customer/orders/:id",
  authenticateCustomer,
  orderController.customerOrderDetails
);

// Track Order
router.get(
  "/track/:reference",
  orderController.trackOrder
);

// ===============================
// Create Order
// ===============================

router.post(
  "/",
  authenticateCustomer,
  orderController.create
);

// ===============================
// Admin Routes
// ===============================

// Get All Orders
router.get("/", orderController.findAll);

// Get Order by Reference
router.get(
  "/reference/:reference",
  orderController.findByReference
);

// Notifications
router.get(
  "/notifications/unread",
  orderController.unreadCount
);

router.patch(
  "/notifications/viewed",
  orderController.markViewed
);

// Get Single Order (Admin)
router.get("/:id", orderController.findOne);

// Approve
router.patch(
  "/:id/approve",
  orderController.approve
);

// Reject
router.patch(
  "/:id/reject",
  orderController.reject
);

export default router;