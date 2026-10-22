import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

import {
  exportPDF,
  exportExcel,
  analytics,
} from "../controllers/report.controller";

const router = Router();

router.get(
  "/analytics",
  authenticate,
  authorize("ADMIN"),
  analytics
);

router.get(
  "/export/pdf",
  authenticate,
  authorize("ADMIN"),
  exportPDF
);

router.get(
  "/export/excel",
  authenticate,
  authorize("ADMIN"),
  exportExcel
);

export default router;