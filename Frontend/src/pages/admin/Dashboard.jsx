import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, ShoppingCart, Users, Receipt, Wallet, Scissors, AlertTriangle } from "lucide-react";
import { Card, StatCard, PageHeader, Table, StatusBadge, Badge, SectionTitle } from "@/components/admin/ui";
import { money } from "@/lib/mockData";

const API_URL = import.meta.env.VITE_API_URL;
const RANGES = ["اليوم", "هذا الأسبوع", "هذا الشهر", "فترة مخصصة"];

// دالة حساب تواريخ البداية والنهاية بناءً على النطاق المختار
const getDateRangeParams = (selectedRange, customStart, customEnd) => {
  const now = new Date();
  let startDate = new Date();
  let endDate = new Date();

  switch (selectedRange) {
    case "اليوم":
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      break;

    case "هذا الأسبوع": {
      const dayOfWeek = now.getDay();
      // حساب بداية الأسبوع (الأحد/الإثنين)
      const diffToStart = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      startDate = new Date(now.setDate(diffToStart));
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
      break;
    }

    case "هذا الشهر":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      endDate.setHours(23, 59, 59, 999);
      break;

    case "فترة مخصصة":
      if (!customStart || !customEnd) return null;
      startDate = new Date(customStart);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(customEnd);
      endDate.setHours(23, 59, 59, 999);
      break;

    default:
      return null;
  }

  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  };
};

export default function Dashboard() {
  const [range, setRange] = useState("هذا الشهر");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [loading, setLoading] = useState(true);

  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalSales: 0,
      totalOrders: 0,
      totalCustomers: 0,
      totalExpenses: 0,
      netSales: 0,
      activeTailoringCount: 0,
    },
    topProducts: [],
    lowStockProducts: [],
    activeTailoring: [],
    readyOrders: [],
    chartData: Array(12).fill(0),
  });

  const getAuthToken = () => {
    return (
      localStorage.getItem("admin_token") ||
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("accessToken") ||
      (() => {
        try {
          const user = JSON.parse(localStorage.getItem("user"));
          return user?.token || user?.accessToken;
        } catch {
          return null;
        }
      })()
    );
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      // إذا اختار "فترة مخصصة" ولم يحدد التاريخين بعد، ننتظر الإدخال
      if (range === "فترة مخصصة" && (!customStartDate || !customEndDate)) {
        return;
      }

      try {
        setLoading(true);
        const token = getAuthToken();
        const dateParams = getDateRangeParams(range, customStartDate, customEndDate);

        let queryUrl = `${API_URL}/api/dashboard?range=${encodeURIComponent(range)}`;
        if (dateParams) {
          queryUrl += `&startDate=${encodeURIComponent(dateParams.startDate)}&endDate=${encodeURIComponent(dateParams.endDate)}`;
        }

        const response = await fetch(queryUrl, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const data = await response.json();

        if (response.ok && data.success) {
          setDashboardData(data.data);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [range, customStartDate, customEndDate]);

  const { stats, topProducts, lowStockProducts, activeTailoring, readyOrders, chartData } = dashboardData;
  const max = chartData && chartData.length > 0 ? Math.max(...chartData, 1) : 1;

  if (loading) {
    return <div className="p-12 text-center text-[#1a2c6b] text-sm">جاري تحميل لوحة التحكم...</div>;
  }

  return (
    <div className="bg-[#FFFFFF] min-h-screen text-[#1a2c6b] p-3 sm:p-6 transition-all">
      {/* Page Header */}
      <PageHeader
        title="لوحة التحكم"
        subtitle="نظرة شاملة على أداء المتجر"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-[#FFFFFF] border border-[#1a2c6b]/15 text-sm text-[#1a2c6b] focus:outline-none focus:border-[#f28c28] rounded-sm shadow-sm cursor-pointer"
            >
              {RANGES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            {/* إظهار حقول التاريخ عند اختيار "فترة مخصصة" */}
            {range === "فترة مخصصة" && (
              <div className="flex items-center gap-2 text-xs">
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="px-2.5 py-1.5 bg-[#FFFFFF] border border-[#1a2c6b]/15 text-[#1a2c6b] rounded-sm focus:outline-none focus:border-[#f28c28]"
                />
                <span className="text-[#1a2c6b]/60">إلى</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="px-2.5 py-1.5 bg-[#FFFFFF] border border-[#1a2c6b]/15 text-[#1a2c6b] rounded-sm focus:outline-none focus:border-[#f28c28]"
                />
              </div>
            )}
          </div>
        }
      />

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 mb-6">
        <StatCard icon={TrendingUp} label="إجمالي المبيعات" value={money(stats.totalSales)} sub="RWF" />
        <StatCard icon={ShoppingCart} label="إجمالي الطلبات" value={String(stats.totalOrders)} />
        <StatCard icon={Users} label="العملاء" value={String(stats.totalCustomers)} />
        <StatCard icon={Receipt} label="المصروفات" value={money(stats.totalExpenses)} sub="RWF" />
        <StatCard icon={Wallet} label="صافي المبيعات" value={money(stats.netSales)} sub="RWF" />
        <StatCard icon={Scissors} label="طلبات التفصيل" value={String(stats.activeTailoringCount)} />
      </div>

      {/* Chart & Quick Actions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
        {/* Sales Chart */}
        <Card className="lg:col-span-2 p-4 sm:p-5 bg-[#FFFFFF] border border-[#1a2c6b]/10 rounded-lg shadow-sm">
          <SectionTitle className="text-[#1a2c6b]">مبيعات العام</SectionTitle>
          <div className="flex items-end gap-1.5 sm:gap-2 h-40 sm:h-48 mt-4 overflow-x-auto pb-2">
            {chartData.map((v, i) => (
              <div key={i} className="flex-1 min-w-[20px] flex flex-col items-center gap-1.5 h-full justify-end">
                <div className="w-full bg-[#1a2c6b]/5 rounded-t-sm relative flex items-end h-full">
                  <div className="w-full bg-[#f28c28] rounded-t-sm transition-all duration-500" style={{ height: `${(v / max) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] sm:text-xs text-[#1a2c6b]/60 font-mono mt-2 overflow-x-auto">
            {["ينا", "فبر", "مار", "أبر", "ماي", "يون", "يول", "أغس", "سبت", "أكت", "نوف", "ديس"].map((m) => (
              <span key={m} className="px-1">{m}</span>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-4 sm:p-5 bg-[#FFFFFF] border border-[#1a2c6b]/10 rounded-lg shadow-sm flex flex-col justify-between">
          <SectionTitle className="text-[#1a2c6b]">إجراءات سريعة</SectionTitle>
          <div className="space-y-3 mt-4">
            <Link to="/admin/pos" className="w-full inline-flex items-center justify-center py-3 bg-[#1a2c6b] text-[#FFFFFF] hover:bg-[#2a3fae] transition-colors rounded-sm text-sm font-medium shadow-sm">
              فتح نقطة البيع
            </Link>
            <Link to="/admin/products/new" className="w-full inline-flex items-center justify-center py-3 bg-[#f28c28] text-[#FFFFFF] hover:bg-[#e07b1e] transition-colors rounded-sm text-sm font-medium shadow-sm">
              إضافة منتج جديد
            </Link>
            <Link to="/admin/orders" className="w-full inline-flex items-center justify-center py-3 border border-[#1a2c6b] text-[#1a2c6b] hover:bg-[#1a2c6b]/5 transition-colors rounded-sm text-sm font-medium">
              عرض الطلبات
            </Link>
          </div>
        </Card>
      </div>

      {/* Top Products & Low Stock Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
        <Card className="p-4 sm:p-5 bg-[#FFFFFF] border border-[#1a2c6b]/10 rounded-lg shadow-sm">
          <SectionTitle action={<Link to="/admin/products" className="text-xs text-[#f28c28] hover:underline font-medium">عرض الكل ←</Link>} className="text-[#1a2c6b]">
            المنتجات الأكثر مبيعاً
          </SectionTitle>
          <div className="space-y-3.5 mt-4">
            {topProducts.length === 0 ? (
              <p className="text-xs text-[#1a2c6b]/60 text-center py-2">لا توجد منتجات مباعة بعد</p>
            ) : (
              topProducts.map((p, i) => (
                <div key={p._id || i} className="flex items-center gap-3 border-b border-[#1a2c6b]/5 pb-2.5 last:border-0">
                  <span className="font-mono text-sm text-[#1a2c6b]/40 w-5">{i + 1}</span>
                  <span className="flex-1 text-sm text-[#1a2c6b] font-medium truncate">{p.name}</span>
                  <span className="font-mono text-xs sm:text-sm text-[#1a2c6b]/70 bg-[#1a2c6b]/5 px-2 py-0.5 rounded-sm shrink-0">{p.sold || 0} مبيع</span>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="p-4 sm:p-5 bg-[#FFFFFF] border border-[#1a2c6b]/10 rounded-lg shadow-sm">
          <SectionTitle action={<Badge variant="red" className="bg-[#f28c28]/10 text-[#f28c28] border border-[#f28c28]/25">{lowStockProducts.length}</Badge>} className="text-[#1a2c6b]">
            منخفض المخزون
          </SectionTitle>
          <div className="space-y-3.5 mt-4">
            {lowStockProducts.length === 0 ? (
              <p className="text-xs text-[#1a2c6b]/60 text-center py-2">المخزون كافٍ لجميع المنتجات</p>
            ) : (
              lowStockProducts.map((p, i) => (
                <div key={p._id || i} className="flex items-center gap-3 border-b border-[#1a2c6b]/5 pb-2.5 last:border-0">
                  <AlertTriangle className="w-4 h-4 text-[#f28c28] shrink-0" />
                  <span className="flex-1 text-sm text-[#1a2c6b] font-medium truncate">{p.name}</span>
                  <span className="font-mono text-xs sm:text-sm text-[#f28c28] bg-[#f28c28]/10 px-2 py-0.5 rounded-sm shrink-0">{p.stock} متبقي</span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Tailoring & Ready Orders Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-5 bg-[#FFFFFF] border border-[#1a2c6b]/10 rounded-lg shadow-sm overflow-hidden">
          <SectionTitle action={<Link to="/admin/tailoring" className="text-xs text-[#f28c28] hover:underline font-medium">عرض الكل ←</Link>} className="text-[#1a2c6b]">
            طلبات التفصيل الحالية
          </SectionTitle>
          <div className="mt-4 overflow-x-auto">
            <Table
              compact
              columns={[
                { key: "orderId", label: "رقم", render: (r) => <span className="font-mono text-[#f28c28]">{r.orderId}</span> },
                { key: "customer", label: "العميل", render: (r) => <span>{r.customer?.name}</span> },
                { key: "type", label: "النوع", render: (r) => <span>{r.type || "-"}</span> },
                { key: "status", label: "الحالة", render: (r) => <StatusBadge status={r.status} map={{ جديد: "gold", "أخذ المقاسات": "blue", "قيد التفصيل": "amber", جاهز: "green" }} /> },
              ]}
              rows={activeTailoring}
            />
          </div>
        </Card>

        <Card className="p-4 sm:p-5 bg-[#FFFFFF] border border-[#1a2c6b]/10 rounded-lg shadow-sm overflow-hidden">
          <SectionTitle action={<Link to="/admin/orders" className="text-xs text-[#f28c28] hover:underline font-medium">عرض الكل ←</Link>} className="text-[#1a2c6b]">
            الطلبات الجاهزة
          </SectionTitle>
          <div className="mt-4 overflow-x-auto">
            <Table
              columns={[
                { key: "orderNumber", label: "رقم", render: (r) => <span className="font-mono text-[#f28c28]">{r.orderNumber}</span> },
                { key: "customer", label: "العميل", render: (r) => <span>{r.customer?.name}</span> },
                { key: "total", label: "الإجمالي", render: (r) => <span className="font-mono dir-ltr">{money(r.total)} RWF</span> },
                { key: "status", label: "الحالة", render: (r) => <StatusBadge status={r.status} /> },
              ]}
              rows={readyOrders}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}