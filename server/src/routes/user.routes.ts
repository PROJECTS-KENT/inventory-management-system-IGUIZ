
import { Router } from "express";
import {
  getAll,
  create,
  toggleStatus,
} from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

// Only authenticated Admins can manage users
router.get("/", authenticate, authorize("ADMIN"), getAll);

router.post("/", authenticate, authorize("ADMIN"), create);

router.put(
  "/:id/toggle-status",
  authenticate,
  authorize("ADMIN"),
  toggleStatus
);

export default router;
