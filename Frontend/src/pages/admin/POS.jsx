import { useState, useEffect } from "react";
import { Image } from "@/components/ui/image";
import { Search, Plus, Minus, Trash2, Check, Loader2, Receipt, Clock, AlertTriangle, X } from "lucide-react";
import { Card, PageHeader, Field, inputClass, GoldButton, Table, Badge } from "@/components/admin/ui";

export default function POS() {
  const [productsList, setProductsList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [q, setQ] = useState("");
  const [cart, setCart] = useState([]);
  const [payment, setPayment] = useState("نقدي");
  const [paid, setPaid] = useState("");
  const [customer, setCustomer] = useState({ name: "", phone: "" });
  const [done, setDone] = useState(false);

  // حالات نافذة تأكيد حذف الطلب
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // دالة مساعدة للحصول على التوكن
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

  // جلب المنتجات المتاحة
  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success) {
        setProductsList(data.data || []);
      }
    } catch (error) {
      console.error("خطأ في جلب المنتجات:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  // جلب سجل طلبات نقطة البيع
  const fetchOrders = async () => {
    const token = getAuthToken();
    try {
      setLoadingOrders(true);
      const res = await fetch("/api/pos-orders", {
        headers: {
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        }
      });
      const data = await res.json();
      if (data.success) {
        setOrdersList(data.data || []);
      }
    } catch (error) {
      console.error("خطأ في جلب الطلبات:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  // تصفية المنتجات حسب البحث والمتاحة
  const list = productsList.filter((p) => p.name.includes(q) && p.available);

  const add = (p) => {
    setCart((c) => {
      const ex = c.find((i) => i.id === p._id);
      if (ex) return c.map((i) => (i.id === p._id ? { ...i, qty: i.qty + 1 } : i));
      return [
        ...c, 
        { 
          id: p._id, 
          name: p.name, 
          price: p.price, 
          qty: 1, 
          size: p.sizes && p.sizes.length > 0 ? p.sizes[0] : "" 
        }
      ];
    });
    setDone(false);
  };

  const setQty = (id, d) => setCart((c) => c.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty + d) } : i)));
  const remove = (id) => setCart((c) => c.filter((i) => i.id !== id));

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const paidNum = Number(paid) || 0;
  const remaining = total - paidNum;

  // إتمام البيع وإرسال الطلب للسيرفر وتحديث القائمة والمخزون
  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("السلة فارغة، لا يمكن إتمام البيع");
      return;
    }

    const token = getAuthToken();
    const orderData = {
      customer: {
        name: customer.name,
        phone: customer.phone,
      },
      cart,
      payment,
      total,
      paid: paidNum,
      remaining,
    };

    try {
      setSubmitting(true);
      const res = await fetch("/api/pos-orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (data.success) {
        setDone(true);
        setCart([]);
        setPaid("");
        setCustomer({ name: "", phone: "" });
        fetchOrders(); // تحديث سجل الطلبات
        fetchProducts(); // تحديث كميات المخزون الظاهرة في الواجهة
      } else {
        alert(data.message || "حدث خطأ أثناء تسجيل عملية البيع");
      }
    } catch (error) {
      console.error("خطأ في الاتصال بالخادم:", error);
      alert("حدث خطأ في الاتصال بالخادم");
    } finally {
      setSubmitting(false);
    }
  };

  // فتح نافذة تأكيد حذف طلب بيع
  const confirmDeleteOrder = (order) => {
    setOrderToDelete(order);
    setDeleteModalOpen(true);
  };

  // تنفيذ عملية الحذف الفعلي للطلب
  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;

    const token = getAuthToken();
    try {
      setDeleting(true);
      const res = await fetch(`/api/pos-orders/${orderToDelete._id}`, {
        method: "DELETE",
        headers: {
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        }
      });
      const data = await res.json();
      if (data.success) {
        setOrdersList(ordersList.filter(o => o._id !== orderToDelete._id));
        setDeleteModalOpen(false);
        setOrderToDelete(null);
      } else {
        alert(data.message || "حدث خطأ أثناء الحذف");
      }
    } catch (error) {
      console.error("خطأ في حذف الطلب:", error);
      alert("حدث خطأ في الاتصال بالخادم");
    } finally {
      setDeleting(false);
    }
  };

  const money = (val) => Number(val || 0).toLocaleString();

  // تصفية طلبات اليوم فقط
  const todayStr = new Date().toDateString();
  const todayOrders = ordersList.filter(o => new Date(o.createdAt).toDateString() === todayStr);
  const todayTotalRevenue = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <div className="bg-[#FFFFFF] min-h-screen text-[#1a2c6b] p-3 sm:p-6 transition-all space-y-6">
      <PageHeader title="نقطة البيع" subtitle="واجهة سريعة لإتمام البيع ومتابعة مبيعات اليوم" />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        {/* Products Section */}
        <div>
          <div className="relative mb-4">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a2c6b]/40" />
            <input 
              value={q} 
              onChange={(e) => setQ(e.target.value)} 
              placeholder="ابحث عن منتج..." 
              className="w-full pr-9 pl-3 py-2.5 bg-white border border-[#1a2c6b]/15 text-sm text-[#1a2c6b] focus:outline-none focus:border-[#f28c28] rounded-sm shadow-sm" 
            />
          </div>

          {loadingProducts ? (
            <div className="p-16 flex items-center justify-center gap-2 text-[#1a2c6b]">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-sm font-medium">جاري تحميل المنتجات...</span>
            </div>
          ) : list.length === 0 ? (
            <div className="text-center p-16 text-[#1a2c6b]/60 text-sm bg-white border border-[#1a2c6b]/10 rounded-lg">
              لا توجد منتجات متاحة حالياً.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {list.map((p) => (
                <button 
                  key={p._id} 
                  onClick={() => add(p)} 
                  className="text-right bg-white border border-[#1a2c6b]/10 hover:border-[#f28c28]/60 transition-colors p-2.5 rounded-sm shadow-sm flex flex-col justify-between cursor-pointer"
                >
                  <div className="aspect-[3/4] overflow-hidden mb-2 rounded-sm bg-[#1a2c6b]/5 relative">
                    <Image src={p.images?.[0] || ""} alt="" className="w-full h-full object-cover" fittingType="fill" />
                    <span className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                      مخزون: {p.stock}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-[#1a2c6b] line-clamp-1">{p.name}</p>
                  <p className="font-mono text-sm font-semibold text-[#1a2c6b]/80 mt-1 dir-ltr inline-block">{money(p.price)} RWF</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Cart Section */}
        <Card className="p-4 sm:p-5 flex flex-col bg-white border border-[#1a2c6b]/10 rounded-lg shadow-sm h-fit">
          <h2 className="font-heading text-lg font-bold mb-3 text-[#1a2c6b]">السلة ({cart.length})</h2>
          
          <div className="flex-1 space-y-3 max-h-[260px] overflow-y-auto pr-1">
            {cart.length === 0 && <p className="text-center text-[#1a2c6b]/40 text-sm py-8">السلة فارغة — اختر منتجاً</p>}
            {cart.map((i) => (
              <div key={i.id} className="flex items-center gap-2 border-b border-[#1a2c6b]/8 pb-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#1a2c6b] font-medium truncate">{i.name}</p>
                  <p className="text-xs text-[#1a2c6b]/50 dir-ltr inline-block">مقاس {i.size || "عام"} · {money(i.price)} RWF</p>
                </div>
                <div className="flex items-center border border-[#1a2c6b]/15 rounded-sm">
                  <button onClick={() => setQty(i.id, -1)} className="p-1.5 text-[#1a2c6b] hover:bg-[#1a2c6b]/5 cursor-pointer"><Minus className="w-3.5 h-3.5" /></button>
                  <span className="px-2 font-mono text-sm text-[#1a2c6b]">{i.qty}</span>
                  <button onClick={() => setQty(i.id, 1)} className="p-1.5 text-[#1a2c6b] hover:bg-[#1a2c6b]/5 cursor-pointer"><Plus className="w-3.5 h-3.5" /></button>
                </div>
                <button onClick={() => remove(i.id)} className="p-1 text-[#f28c28] hover:opacity-80 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>

          <div className="border-t border-[#1a2c6b]/10 pt-4 mt-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="اسم العميل">
                <input 
                  value={customer.name} 
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })} 
                  className={inputClass} 
                  placeholder="اختياري"
                />
              </Field>
              <Field label="الهاتف">
                <input 
                  value={customer.phone} 
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} 
                  className={inputClass} 
                  placeholder="اختياري"
                />
              </Field>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-[#1a2c6b]/60">الإجمالي</span>
              <span className="font-mono font-semibold text-[#1a2c6b] dir-ltr inline-block">{money(total)} RWF</span>
            </div>
            
            <Field label="طريقة الدفع">
              <select value={payment} onChange={(e) => setPayment(e.target.value)} className={`${inputClass} bg-white cursor-pointer`}>
                <option value="نقدي">نقدي</option>
                <option value="تحويل">تحويل</option>
                <option value="آجل">آجل</option>
              </select>
            </Field>

            <Field label="المبلغ المدفوع (RWF)">
              <input 
                type="number" 
                value={paid} 
                onChange={(e) => setPaid(e.target.value)} 
                className={inputClass} 
                placeholder={total}
              />
            </Field>
            
            <div className="flex justify-between text-sm">
              <span className="text-[#1a2c6b]/60">المتبقي</span>
              <span className={`font-mono font-semibold dir-ltr inline-block ${remaining > 0 ? "text-[#f28c28]" : "text-[#1a2c6b]"}`}>
                {money(Math.abs(remaining))} RWF
              </span>
            </div>

            <GoldButton 
              className="w-full py-3 bg-[#f28c28] hover:bg-[#e07b1e] text-white transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50" 
              onClick={handleCheckout}
              disabled={submitting}
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? "جاري إتمام البيع..." : <><Check className="w-4 h-4 ml-1" /> تأكيد البيع</>}
            </GoldButton>
            
            {done && <p className="text-center text-xs text-green-700 font-medium bg-green-50 border border-green-200 py-2 rounded-sm">تمت العملية وتحديث المخزون بنجاح!</p>}
          </div>
        </Card>
      </div>

      {/* قسم عرض مبيعات اليوم */}
      <div className="mt-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-heading text-lg font-bold text-[#1a2c6b] flex items-center gap-2">
              <Receipt className="w-5 h-5 text-[#f28c28]" /> مبيعات اليوم
            </h3>
            <p className="text-xs text-[#1a2c6b]/60 mt-0.5">الطلبات المسجلة خلال اليوم الحالي ({todayOrders.length} طلب)</p>
          </div>
          <div className="bg-white border border-[#1a2c6b]/10 px-4 py-2 rounded-md shadow-sm flex items-center gap-3">
            <span className="text-xs text-[#1a2c6b]/60">إجمالي مبيعات اليوم:</span>
            <span className="font-mono font-bold text-[#f28c28] text-base dir-ltr inline-block">{money(todayTotalRevenue)} RWF</span>
          </div>
        </div>

        <Card className="p-0 overflow-hidden bg-white border border-[#1a2c6b]/10 rounded-lg shadow-sm">
          {loadingOrders ? (
            <div className="p-12 flex items-center justify-center gap-2 text-[#1a2c6b]">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">جاري تحميل سجل المبيعات...</span>
            </div>
          ) : todayOrders.length === 0 ? (
            <div className="text-center p-12 text-[#1a2c6b]/50 text-sm">
              لا توجد مبيعات مسجلة حتى الآن اليوم.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table
                columns={[
                  { 
                    key: "time", 
                    label: "الوقت", 
                    render: (r) => (
                      <span className="font-mono text-xs text-[#1a2c6b]/70 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#1a2c6b]/40" />
                        {new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    ) 
                  },
                  { 
                    key: "customer", 
                    label: "العميل", 
                    render: (r) => (
                      <div>
                        <p className="font-medium text-[#1a2c6b] text-xs">{r.customer?.name || "عميل نقدي"}</p>
                        {r.customer?.phone && <p className="font-mono text-[10px] text-[#1a2c6b]/50" dir="ltr">{r.customer.phone}</p>}
                      </div>
                    ) 
                  },
                  { 
                    key: "items", 
                    label: "المنتجات", 
                    render: (r) => (
                      <span className="text-xs text-[#1a2c6b]/80">
                        {r.cart?.map(i => `${i.qty}x ${i.name}`).join("، ")}
                      </span>
                    ) 
                  },
                  { 
                    key: "payment", 
                    label: "الدفع", 
                    render: (r) => (
                      <span className="text-xs bg-[#1a2c6b]/5 text-[#1a2c6b] px-2 py-0.5 rounded border border-[#1a2c6b]/10">
                        {r.payment}
                      </span>
                    ) 
                  },
                  { 
                    key: "total", 
                    label: "الإجمالي", 
                    render: (r) => <span className="font-mono font-bold text-[#1a2c6b] text-xs dir-ltr inline-block">{money(r.total)} RWF</span> 
                  },
                  { 
                    key: "paid", 
                    label: "المدفوع / المتبقي", 
                    render: (r) => (
                      <div className="text-xs font-mono dir-ltr inline-block">
                        <span className="text-green-700">{money(r.paid)}</span>
                        {r.remaining > 0 && <span className="text-[#f28c28] mr-1">({money(r.remaining)} متبقي)</span>}
                      </div>
                    ) 
                  },
                  { 
                    key: "actions", 
                    label: "إجراءات", 
                    render: (r) => (
                      <button 
                        onClick={() => confirmDeleteOrder(r)} 
                        className="p-1.5 text-[#1a2c6b]/60 hover:text-red-600 transition-colors rounded-sm hover:bg-red-50 cursor-pointer" 
                        title="حذف الطلب"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) 
                  },
                ]}
                rows={todayOrders}
              />
            </div>
          )}
        </Card>
      </div>

      {/* مودال تأكيد الحذف */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative border border-[#1a2c6b]/10 text-[#1a2c6b] text-center">
            <button onClick={() => setDeleteModalOpen(false)} className="absolute left-4 top-4 text-[#1a2c6b]/60 hover:text-[#f28c28] cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-lg font-bold mb-2">تأكيد حذف الفاتورة</h3>
            <p className="text-sm text-[#1a2c6b]/70 mb-6">
              هل أنت متأكد من رغبتك في حذف طلب العميل <span className="font-bold text-[#1a2c6b]">{orderToDelete?.customer?.name || "نقدي"}</span> بقيمة <span className="font-mono font-bold dir-ltr inline-block">{money(orderToDelete?.total)} RWF</span>؟
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                disabled={deleting}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#1a2c6b] transition-colors rounded-sm text-sm font-medium cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleDeleteOrder}
                disabled={deleting}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white transition-colors rounded-sm text-sm font-medium flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                {deleting ? "جاري الحذف..." : "حذف"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}