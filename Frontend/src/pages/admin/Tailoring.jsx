import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Card, PageHeader, Table, StatusBadge, GoldButton } from "@/components/admin/ui";
import { money } from "@/lib/mockData";

const TAILOR_MAP = { جديد: "gold", "أخذ المقاسات": "blue", "قيد التفصيل": "amber", جاهز: "green", "تم التسليم": "gray" };
const STATUSES = ["الكل", "جديد", "أخذ المقاسات", "قيد التفصيل", "جاهز", "تم التسليم"];

// دالة جلب التوكن الموحدة
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

export default function Tailoring() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("الكل");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTailoringOrders = async () => {
      try {
        setLoading(true);
        const token = getAuthToken();

        const queryParams = new URLSearchParams();
        if (status && status !== "الكل") queryParams.append("status", status);
        if (q) queryParams.append("search", q);

        const response = await fetch(`/api/tailoring?${queryParams.toString()}`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });
        
        const data = await response.json();

        if (response.ok && data.success) {
          setOrders(data.data);
        } else {
          console.error("Failed to fetch orders:", data.message);
        }
      } catch (err) {
        console.error("Error fetching tailoring orders:", err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchTailoringOrders, 300);
    return () => clearTimeout(timer);
  }, [q, status]);

  return (
    <div className="bg-[#FFFFFF] min-h-screen text-[#1a2c6b] p-3 sm:p-6 transition-all">
      <PageHeader 
        title="التفصيل" 
        subtitle={`${orders.length} طلب تفصيل`} 
        actions={<GoldButton className="bg-[#f28c28] hover:bg-[#e07b1e] text-white cursor-pointer">طلب جديد</GoldButton>} 
      />

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a2c6b]/40" />
          <input 
            value={q} 
            onChange={(e) => setQ(e.target.value)} 
            placeholder="ابحث برقم الطلب أو العميل..." 
            className="w-full pr-9 pl-3 py-2.5 bg-white border border-[#1a2c6b]/15 text-sm text-[#1a2c6b] focus:outline-none focus:border-[#f28c28] rounded-sm shadow-sm" 
          />
        </div>
        <select 
          value={status} 
          onChange={(e) => setStatus(e.target.value)} 
          className="px-3 py-2.5 bg-white border border-[#1a2c6b]/15 text-sm text-[#1a2c6b] focus:outline-none focus:border-[#f28c28] rounded-sm shadow-sm cursor-pointer"
        >
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Tailoring Table Container */}
      <Card className="p-0 overflow-hidden bg-white border border-[#1a2c6b]/10 rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-sm text-[#1a2c6b]/60">جاري تحميل طلبات التفصيل...</div>
          ) : (
            <Table
              columns={[
                { key: "orderId", label: "رقم الطلب", render: (r) => <Link to={`/admin/tailoring/${r._id}`} className="text-[#f28c28] font-mono hover:underline">{r.orderId}</Link> },
                { key: "customer", label: "العميل", render: (r) => <div><p className="text-[#1a2c6b] font-medium">{r.customer?.name}</p><p className="text-xs text-[#1a2c6b]/50 font-mono" dir="ltr">{r.customer?.phone}</p></div> },
                { key: "type", label: "نوع الجلابية", render: (r) => <span className="text-[#1a2c6b]">{r.type || "-"}</span> },
                { key: "fabric", label: "القماش", render: (r) => <span className="text-[#1a2c6b]">{r.fabric || "-"}</span> },
                { key: "color", label: "اللون", render: (r) => <span className="text-[#1a2c6b]">{r.color || "-"}</span> },
                { key: "delivery", label: "التسليم", render: (r) => <span className="font-mono text-xs text-[#1a2c6b]/60">{r.delivery?.split("T")[0]}</span> },
                { key: "paid", label: "المدفوع", render: (r) => <span className="font-mono text-[#1a2c6b] dir-ltr inline-block">{money(r.paid)} RWF</span> },
                { key: "remaining", label: "المتبقي", render: (r) => <span className={`font-mono dir-ltr inline-block ${r.remaining > 0 ? "text-[#f28c28]" : "text-[#1a2c6b]"}`}>{money(r.remaining)} RWF</span> },
                { key: "status", label: "الحالة", render: (r) => <StatusBadge status={r.status} map={TAILOR_MAP} /> },
              ]}
              rows={orders}
            />
          )}
        </div>
      </Card>
    </div>
  );
}