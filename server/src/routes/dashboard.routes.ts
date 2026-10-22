
import { Router } from "express";
import { dashboard } from "../controllers/dashboard.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

// Only authenticated administrators can access dashboard data.
router.get("/", authenticate, authorize("ADMIN"), dashboard);

export default router;
