import { Router } from "express";
import {
  create,
  list,
  update,
  remove,
} from "../controllers/category.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

router.post("/", authenticate, authorize("ADMIN"), create);

router.get("/", authenticate, list);

router.put("/:id", authenticate, authorize("ADMIN"), update);

router.delete("/:id", authenticate, authorize("ADMIN"), remove);

export default router;