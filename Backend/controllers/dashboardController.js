import Product from "../models/Product.js"; 
import OrderManagement from "../models/OrderManagement.js"; 
import TailoringManagement from "../models/TailoringManagement.js"; 
import PosOrder from "../models/PosOrder.js"; 

export const getDashboardData = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    // 1. جلب المنتجات الأكثر مبيعاً من نموذج Product
    const topProducts = await Product.find({}).sort({ sold: -1 }).limit(5);

    // 2. جلب المنتجات منخفضة المخزون من نموذج Product
    const lowStockProducts = await Product.find({ stock: { $lte: 10 } });

    // 3. جلب طلبات التفصيل النشطة من نموذج TailoringManagement
    const activeTailoring = await TailoringManagement.find({ 
      status: { $ne: "تم التسليم" } 
    });

    // 4. جلب الطلبات الجاهزة من نموذج OrderManagement
    const readyOrders = await OrderManagement.find({ status: "جاهز" });

    // 5. حساب إجمالي مبيعات POS من نموذج PosOrder
    const posSalesResult = await PosOrder.aggregate([
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);
    const totalSalesFromPOS = posSalesResult.length > 0 ? posSalesResult[0].total : 0;

    // 6. حساب إجمالي الطلبات الحقيقي من النموذجين
    const totalPosOrdersCount = await PosOrder.countDocuments();
    const totalRegularOrdersCount = await OrderManagement.countDocuments();
    const totalOrdersCount = totalPosOrdersCount + totalRegularOrdersCount;

    // 7. حساب العملاء الفريدين من النماذج
    const posPhones = await PosOrder.distinct("customer.phone", { "customer.phone": { $ne: "" } });
    const orderPhones = await OrderManagement.distinct("customer.phone", { "customer.phone": { $ne: "" } });
    const uniqueCustomersCount = new Set([...posPhones, ...orderPhones]).size;

    const totalExpenses = 0;
    const netSales = totalSalesFromPOS - totalExpenses;

    // 8. مبيعات الشهور للرسم البياني ديناميكياً من نموذج PosOrder
    const salesAggregation = await PosOrder.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31T23:59:59.999Z`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalSales: { $sum: "$total" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const chartData = Array(12).fill(0);
    salesAggregation.forEach((item) => {
      chartData[item._id - 1] = item.totalSales;
    });

    const stats = {
      totalSales: totalSalesFromPOS,
      totalOrders: totalOrdersCount,
      totalCustomers: uniqueCustomersCount,
      totalExpenses: totalExpenses,
      netSales: netSales,
      activeTailoringCount: activeTailoring.length,
    };

    res.status(200).json({
      success: true,
      data: {
        stats,
        topProducts,
        lowStockProducts,
        activeTailoring,
        readyOrders,
        chartData,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};