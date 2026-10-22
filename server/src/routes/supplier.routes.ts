import { Router } from "express";
import {
  create,
  getAll,
  update,
  remove,
} from "../controllers/supplier.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

router.post("/", authenticate, authorize("ADMIN"), create);

router.get("/", authenticate, getAll);

router.put("/:id", authenticate, authorize("ADMIN"), update);

router.delete("/:id", authenticate, authorize("ADMIN"), remove);

export default router;