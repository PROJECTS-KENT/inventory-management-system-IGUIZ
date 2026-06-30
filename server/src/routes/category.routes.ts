import { Router } from "express";
import { create, list } from "../controllers/category.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authenticate, create);
router.get("/", authenticate, list);

export default router;