import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";

import session from "express-session";
import passport from "./config/passport";

import categoryRoutes from "./routes/category.routes";
import supplierRoutes from "./routes/supplier.routes";
import productRoutes from "./routes/product.routes";
import authRoutes from "./routes/auth.routes";
import inventoryRoutes from "./routes/inventory.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import userRoutes from "./routes/user.routes";
import activityRoutes from "./routes/activity.routes";
import reportRoutes from "./routes/report.routes";
import orderRoutes from "./routes/order.routes";
import customerRoutes from "./routes/customer.routes";


// NEW
import customerAuthRoutes from "./routes/customerAuth.routes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

app.use(morgan("dev"));

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "inventory-secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());

app.use(passport.session());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

app.use("/api/auth", authRoutes);

// NEW
app.use("/api/customer/auth", customerAuthRoutes);

app.use("/api/categories", categoryRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/products", productRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/orders", orderRoutes);

app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);
app.use("/suppliers", supplierRoutes);
app.use("/api/customer", customerRoutes);

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Inventory API is running 🚀",
  });
});

export default app;