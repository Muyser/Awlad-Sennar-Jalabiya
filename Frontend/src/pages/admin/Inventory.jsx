import { useState, useEffect } from "react";
import { Image } from "@/components/ui/image";
import { Plus, Minus, Pencil, Check, X, Loader2, AlertTriangle } from "lucide-react";
import { Card, PageHeader, Table, Badge, GoldButton, Field, inputClass } from "@/components/admin/ui";

const API_URL = import.meta.env.VITE_API_URL;

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingProduct, setEditingProduct] = useState(null);
  const [newStockVal, setNewStockVal] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  // جلب المنتجات من الـ Backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/products`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data || []);
      } else {
        setError(data.message || "فشل جلب المنتجات");
      }
    } catch (err) {
      console.error("خطأ في جلب المنتجات:", err);
      setError("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // تنسيق عرض العملة
  const money = (amount) => {
    return `${amount || 0} RWF`;
  };

  // تعديل الكمية مباشرة (+ أو -) عبر الـ API
  const handleUpdateStock = async (product, delta) => {
    const updatedStock = Math.max(0, (product.stock || 0) + delta);
    
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_URL}/api/products/${product._id}/stock`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ stock: updatedStock })
      });

      const data = await res.json();
      if (data.success) {
        setProducts(products.map(p => p._id === product._id ? (data.data || { ...p, stock: updatedStock }) : p));
      } else {
        handleFallbackUpdateStock(product, updatedStock);
      }
    } catch (err) {
      console.error("خطأ في تحديث المخزون:", err);
      handleFallbackUpdateStock(product, updatedStock);
    }
  };

  // دالة احتياطية لتحديث المخزون عبر الـ PUT الكامل في حال عدم توفر الـ PATCH
  const handleFallbackUpdateStock = async (product, newStock) => {
    try {
      const token = getAuthToken();
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("price", product.price);
      formData.append("stock", newStock);
      formData.append("category", product.category?._id || product.category);

      const res = await fetch(`${API_URL}/api/products/${product._id}`, {
        method: "PUT",
        headers: {
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        fetchProducts();
      } else {
        alert(data.message || "فشل تحديث المخزون");
      }
    } catch (e) {
      console.error("خطأ الاحتياطي:", e);
      alert("حدث خطأ أثناء تحديث المخزون");
    }
  };

  // فتح نافذة تعديل المخزون اليدوي
  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setNewStockVal(String(p.stock ?? 0));
  };

  // حفظ الكمية الجديدة يدويامﻦ خلال النافذة المنبثقة
  const handleSaveStock = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    const val = parseInt(newStockVal, 10);
    if (isNaN(val) || val < 0) return;

    try {
      setSubmitting(true);
      const token = getAuthToken();
      const res = await fetch(`${API_URL}/api/products/${editingProduct._id}/stock`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ stock: val })
      });

      const data = await res.json();
      if (data.success) {
        setProducts(products.map(p => p._id === editingProduct._id ? { ...p, stock: val } : p));
        setEditingProduct(null);
      } else {
        alert(data.message || "فشل حفظ المخزون الجديد");
      }
    } catch (err) {
      console.error("خطأ الحفظ اليدوي:", err);
      alert("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setSubmitting(false);
    }
  };

  // حساب الإحصائيات الحقيقية بناءً على البيانات القادمة من الـ Backend
  const totalProducts = products.length;
  const availableProducts = products.filter((p) => (p.stock || 0) > 0).length;
  const lowStockProducts = products.filter((p) => (p.stock || 0) > 0 && (p.stock || 0) <= 10).length;
  const outOfStockProducts = products.filter((p) => (p.stock || 0) === 0).length;

  return (
    <div className="bg-[#FFFFFF] min-h-screen text-[#1a2c6b] p-3 sm:p-6 transition-all">
      <PageHeader 
        title="المخزون" 
        subtitle="إدارة كميات المنتجات" 
        actions={
          <GoldButton 
            className="bg-[#f28c28] hover:bg-[#e07b1e] text-white cursor-pointer"
            onClick={() => {
              if (products.length > 0) handleOpenEdit(products[0]);
            }}
          >
            تعديل مخزون
          </GoldButton>
        } 
      />

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-sm text-sm">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "إجمالي المنتجات", value: totalProducts, customClass: "bg-[#1a2c6b] border-transparent" },
          { label: "متوفر", value: availableProducts, customClass: "border-green-500/20 text-green-700 bg-green-50/50" },
          { label: "منخفض المخزون", value: lowStockProducts, customClass: "border-[#f28c28]/30 text-[#f28c28] bg-[#f28c28]/5" },
          { label: "نفد المخزون", value: outOfStockProducts, customClass: "border-red-500/20 text-red-600 bg-red-50/50" },
        ].map((s) => (
          <Card key={s.label} className={`p-4 sm:p-5 shadow-sm border rounded-lg ${s.customClass || 'bg-white border-[#1a2c6b]/10'}`}>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-sm ${s.label === "إجمالي المنتجات" ? "bg-white/10 text-white" : ""}`}>{s.label}</span>
            <p className="font-mono text-2xl sm:text-3xl font-bold mt-2">{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Inventory Table Container */}
      <Card className="p-0 overflow-hidden bg-white border border-[#1a2c6b]/10 rounded-lg shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center p-16 text-[#1a2c6b]">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="mr-2 text-sm font-medium">جاري تحميل المخزون...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center p-16 text-[#1a2c6b]/60 text-sm">
            لا توجد منتجات مسجلة في المخزون حالياً.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table
              columns={[
                { 
                  key: "image", 
                  label: "المنتج", 
                  render: (p) => (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-12 overflow-hidden rounded-sm bg-[#1a2c6b]/5 shrink-0 border border-[#1a2c6b]/10">
                        <Image src={p.images?.[0] || p.image} alt="" className="w-full h-full object-cover" fittingType="fill" />
                      </div>
                      <span className="text-sm text-[#1a2c6b] font-medium">{p.name}</span>
                    </div>
                  ) 
                },
                { key: "category", label: "القسم", render: (p) => <span className="text-[#1a2c6b]/70">{typeof p.category === 'object' ? p.category?.name : p.category}</span> },
                { key: "stock", label: "الكمية الحالية", render: (p) => <span className="font-mono font-semibold text-[#1a2c6b]">{p.stock ?? 0}</span> },
                { 
                  key: "status", 
                  label: "الحالة", 
                  render: (p) => (p.stock ?? 0) === 0 ? (
                    <Badge variant="red" className="bg-red-100 text-red-700 border-red-200">نفد</Badge>
                  ) : (p.stock ?? 0) <= 10 ? (
                    <Badge variant="amber" className="bg-[#f28c28]/10 text-[#f28c28] border-[#f28c28]/20">منخفض</Badge>
                  ) : (
                    <Badge variant="green" className="bg-green-100 text-green-700 border-green-200">متوفر</Badge>
                  ) 
                },
                { key: "price", label: "السعر", render: (p) => <span className="font-mono text-[#1a2c6b] dir-ltr inline-block">{money(p.price)}</span> },
                { 
                  key: "actions", 
                  label: "إجراءات", 
                  render: (p) => (
                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={() => handleUpdateStock(p, 1)} 
                        className="p-1.5 border border-[#1a2c6b]/15 rounded-sm hover:border-[#f28c28] hover:text-[#f28c28] text-[#1a2c6b]/70 transition-colors cursor-pointer"
                        title="زيادة الكمية"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleUpdateStock(p, -1)} 
                        className="p-1.5 border border-[#1a2c6b]/15 rounded-sm hover:border-red-500 hover:text-red-500 text-[#1a2c6b]/70 transition-colors cursor-pointer"
                        title="تقليل الكمية"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleOpenEdit(p)} 
                        className="p-1.5 border border-[#1a2c6b]/15 rounded-sm hover:border-[#f28c28] hover:text-[#f28c28] text-[#1a2c6b]/70 transition-colors cursor-pointer"
                        title="تعديل مباشر"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </div>
                  ) 
                },
              ]}
              rows={products}
            />
          </div>
        )}
      </Card>

      {/* مودال تعديل المخزون */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative border border-[#1a2c6b]/10 text-[#1a2c6b]">
            <button onClick={() => setEditingProduct(null)} className="absolute left-4 top-4 text-[#1a2c6b]/60 hover:text-[#f28c28] cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-heading text-lg font-bold mb-2">تعديل مخزون المنتج</h3>
            <p className="text-xs text-[#1a2c6b]/60 mb-4 truncate">{editingProduct.name}</p>
            
            <form onSubmit={handleSaveStock} className="space-y-4">
              <Field label="الكمية الجديدة">
                <input 
                  type="number" 
                  min="0" 
                  value={newStockVal} 
                  onChange={(e) => setNewStockVal(e.target.value)} 
                  className={inputClass} 
                  required 
                />
              </Field>
              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full py-3 bg-[#f28c28] text-white hover:bg-[#e07b1e] transition-colors rounded-sm shadow-sm font-medium text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? "جاري الحفظ..." : <><Check className="w-4 h-4" /> حفظ التغييرات</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}