import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import imageUpload, { uploadProductImage,
} from "../middleware/productUpload";
import excelUpload from "../middleware/upload";

import {
  create,
  getAll,
  getOne,
  update,
  remove,
  lowStock,
  importProducts,
  performance,
} from "../controllers/product.controller";

const router = Router();

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/

// Anyone can view products
router.get("/", getAll);

// Low stock
router.get(
  "/low-stock",
  authenticate,
  lowStock
);

router.get("/:id/performance", performance);

// Anyone can view a single product
router.get("/:id", getOne);

/*
|--------------------------------------------------------------------------
| ADMIN / STAFF ROUTES
|--------------------------------------------------------------------------
*/


// Create product
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  imageUpload.single("image"),
uploadProductImage,
create
);

// Import Excel
router.post(
  "/import",
  authenticate,
  authorize("ADMIN"),
  excelUpload.single("file"),
  importProducts
);

// Update product
router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  imageUpload.single("image"),
  update
);

// Delete product
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  remove
);

export default router;