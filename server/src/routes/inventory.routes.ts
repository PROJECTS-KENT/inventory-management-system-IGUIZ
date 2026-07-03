import { Router } from "express";
import {
  addStock,
  removeStock,
  history,
} from "../controllers/inventory.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/stock-in", authenticate, addStock);
router.post("/stock-out", authenticate, removeStock);
router.get("/history", authenticate, history);

export default router;