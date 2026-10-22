import { Router } from "express";
import { getLogs } from "../controllers/activity.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  getLogs
);

export default router;