import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import categoryRoutes from "./routes/category.routes";
import supplierRoutes from "./routes/supplier.routes";

import authRoutes from "./routes/auth.routes";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use("/api/categories", categoryRoutes);
app.use("/api/suppliers", supplierRoutes);

app.use("/api/auth", authRoutes);

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Inventory API is running 🚀",
  });
});

export default app;