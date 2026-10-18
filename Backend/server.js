import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import { connectCloudinary } from "./config/cloudinary.js";

import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import posRoutes from "./routes/posRoutes.js";
import orderManagementRoutes from "./routes/orderManagementRoutes.js";
import tailoringRoutes from "./routes/tailoringRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import offerRoutes from "./routes/offerRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import depositRoutes from "./routes/depositRoutes.js";
import settingRoutes from "./routes/settingRoutes.js";

dotenv.config();

connectDB();
connectCloudinary();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Awlad Sennar Jallabia API is running successfully..." });
});

// ربط المسارات
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/pos-orders", posRoutes);
app.use("/api/orders-management", orderManagementRoutes);
app.use("/api/tailoring", tailoringRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/deposits", depositRoutes);
app.use("/api/settings", settingRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running smoothly on port ${PORT}`);
});