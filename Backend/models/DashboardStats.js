import mongoose from "mongoose";

const monthlySalesSchema = new mongoose.Schema({
  month: { type: String, required: true }, // مثل: "ينا", "فبر", ...
  sales: { type: Number, required: true, default: 0 },
});

const dashboardStatsSchema = new mongoose.Schema(
  {
    totalSales: { type: Number, required: true, default: 0 },
    totalOrders: { type: Number, required: true, default: 0 },
    totalCustomers: { type: Number, required: true, default: 0 },
    totalExpenses: { type: Number, required: true, default: 0 },
    netSales: { type: Number, required: true, default: 0 },
    monthlyChart: [monthlySalesSchema],
  },
  {
    timestamps: true,
  }
);

const DashboardStats = mongoose.model("DashboardStats", dashboardStatsSchema);

export default DashboardStats;