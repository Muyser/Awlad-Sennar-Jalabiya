import Product from "../models/Product.js"; 
import OrderManagement from "../models/OrderManagement.js"; 
import TailoringManagement from "../models/TailoringManagement.js"; 
import PosOrder from "../models/PosOrder.js"; 
import Expense from "../models/Expense.js"; 

export const getDashboardData = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    // استقبال تواريخ الفلترة من الـ Query (إن وجدت)
    const { startDate, endDate } = req.query;

    let dateQuery = {};
    if (startDate && endDate) {
      dateQuery = {
        createdAt: {
          $gte: new Date(startDate),$lte: new Date(endDate),
        },
      };
    }

    // 1. جلب المنتجات الأكثر مبيعاً من نموذج Product
    const topProducts = await Product.find({}).sort({ sold: -1 }).limit(5);

    // 2. جلب المنتجات منخفضة المخزون من نموذج Product
    const lowStockProducts = await Product.find({ stock: { $lte: 10 } });

    // 3. جلب طلبات التفصيل النشطة من نموذج TailoringManagement
    const activeTailoring = await TailoringManagement.find({ 
      status: { $ne: "تم التسليم" },
      ...dateQuery
    });

    // 4. جلب الطلبات الجاهزة من نموذج OrderManagement
    const readyOrders = await OrderManagement.find({ 
      status: "جاهز",
      ...dateQuery
    });

    // 5. جلب المصروفات وحساب إجماليها مع تطبيق الفلتر الزمني إن وجد
    const expenses = await Expense.find({ ...dateQuery }).sort({ createdAt: -1 });
    const totalExpenses = expenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);

    // 6. حساب إجمالي مبيعات POS من نموذج PosOrder مع الفلتر
    const posSalesResult = await PosOrder.aggregate([
      ...(startDate && endDate ? [{ $match: { createdAt: { $gte: new Date(startDate),$lte: new Date(endDate) } } }] : []),
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);
    const totalSalesFromPOS = posSalesResult.length > 0 ? posSalesResult[0].total : 0;

    // حساب إجمالي مبيعات الطلبات العادية من نموذج OrderManagement مع الفلتر
    const regularSalesResult = await OrderManagement.aggregate([
      ...(startDate && endDate ? [{ $match: { createdAt: { $gte: new Date(startDate),$lte: new Date(endDate) } } }] : []),
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);
    const totalSalesFromRegularOrders = regularSalesResult.length > 0 ? regularSalesResult[0].total : 0;

    const totalSalesOverall = totalSalesFromPOS + totalSalesFromRegularOrders;

    // 7. حساب إجمالي الطلبات والحسابات الأخرى مع الفلتر
    const totalPosOrdersCount = await PosOrder.countDocuments({ ...dateQuery });
    const totalRegularOrdersCount = await OrderManagement.countDocuments({ ...dateQuery });
    const totalOrdersCount = totalPosOrdersCount + totalRegularOrdersCount;

    const posPhones = await PosOrder.distinct("customer.phone", { "customer.phone": { $ne: "" }, ...dateQuery });
    const orderPhones = await OrderManagement.distinct("customer.phone", { "customer.phone": { $ne: "" }, ...dateQuery });
    const uniqueCustomersCount = new Set([...posPhones, ...orderPhones]).size;

    // 8. حساب صافي المبيعات
    const netSales = totalSalesOverall - totalExpenses;

    // 9. مبيعات الشهور للرسم البياني
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
      totalSales: totalSalesOverall,
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
        expenses,
        chartData,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};