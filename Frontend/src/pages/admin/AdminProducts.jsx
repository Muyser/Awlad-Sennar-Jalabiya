import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";
import { Plus, Pencil, Trash2, Eye, EyeOff, Search, Loader2, AlertTriangle, X } from "lucide-react";
import { Card, PageHeader, Badge, Table, GoldButton } from "@/components/admin/ui";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [hidden, setHidden] = useState({});

  // حالات النافذة المنبثقة للحذف (Delete Modal)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

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

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/products");
      const data = await response.json();
      
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

  // فتح نافذة التأكيد المنبثقة
  const confirmDelete = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  // تنفيذ الحذف الفعلي بعد التأكيد من الـ Popup
  const handleDeleteExecute = async () => {
    if (!productToDelete) return;
    const productId = productToDelete._id || productToDelete.id;

    try {
      setDeleting(true);
      const token = getAuthToken();
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
        headers: {
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        }
      });

      const data = await response.json();
      if (data.success) {
        setProducts(products.filter((p) => (p._id || p.id) !== productId));
        setDeleteModalOpen(false);
        setProductToDelete(null);
      } else {
        alert(data.message || "فشل حذف المنتج");
      }
    } catch (err) {
      console.error("خطأ الحذف:", err);
      alert("حدث خطأ أثناء محاولة حذف المنتج");
    } finally {
      setDeleting(false);
    }
  };

  const toggle = (id) => setHidden((h) => ({ ...h, [id]: !h[id] }));

  const filteredProducts = products.filter((p) => 
    p.name?.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="bg-[#FFFFFF] min-h-screen text-[#1a2c6b] p-3 sm:p-6 transition-all relative">
      <PageHeader
        title="المنتجات"
        subtitle={`${products.length} منتج`}
        actions={
          <GoldButton 
            as="link" 
            to="/admin/products/new" 
            className="bg-[#f28c28] hover:bg-[#e07b1e] text-white flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> إضافة منتج
          </GoldButton>
        }
      />

      {/* شريط البحث */}
      <Card className="p-4 mb-5 bg-white border border-[#1a2c6b]/10 rounded-lg shadow-sm">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a2c6b]/40" />
          <input 
            value={q} 
            onChange={(e) => setQ(e.target.value)} 
            placeholder="ابحث عن منتج..." 
            className="w-full pr-9 pl-3 py-2.5 bg-[#FFFFFF] border border-[#1a2c6b]/15 text-sm text-[#1a2c6b] focus:outline-none focus:border-[#f28c28] rounded-sm shadow-sm" 
          />
        </div>
      </Card>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-sm text-sm">
          {error}
        </div>
      )}

      {/* جدول المنتجات */}
      <Card className="p-0 overflow-hidden bg-white border border-[#1a2c6b]/10 rounded-lg shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center p-12 text-[#1a2c6b]">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="mr-2 text-sm">جاري تحميل المنتجات...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center p-12 text-[#1a2c6b]/60 text-sm">
            لا توجد منتجات مضافة حتى الآن. اضغط على "إضافة منتج" لإدراج أول منتج.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table
              columns={[
                { 
                  key: "image", 
                  label: "الصورة", 
                  render: (p) => {
                    const imgUrl = Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : p.image;
                    return (
                      <div className="w-12 h-14 overflow-hidden rounded-sm border border-[#1a2c6b]/10 bg-[#1a2c6b]/5">
                        <Image src={imgUrl} alt="" className="w-full h-full object-cover" fittingType="fill" />
                      </div>
                    );
                  } 
                },
                { 
                  key: "name", 
                  label: "المنتج", 
                  render: (p) => (
                    <div>
                      <p className="font-medium text-[#1a2c6b]">{p.name}</p>
                      <p className="text-xs text-[#1a2c6b]/50">{p.category}</p>
                    </div>
                  ) 
                },
                { 
                  key: "price", 
                  label: "السعر", 
                  render: (p) => <span className="font-mono text-[#1a2c6b] dir-ltr">{p.price?.toLocaleString()} RWF</span> 
                },
                { 
                  key: "stock", 
                  label: "المخزون", 
                  render: (p) => (
                    <span className={p.stock <= 10 ? "text-[#f28c28] font-mono font-semibold" : "font-mono text-[#1a2c6b]"}>
                      {p.stock}
                    </span>
                  ) 
                },
                { 
                  key: "type", 
                  label: "النوع", 
                  render: (p) => <Badge variant={p.type === "جاهز" ? "dark" : "gold"} className={p.type !== "جاهز" ? "text-[#f28c28] border-[#f28c28]/30" : ""}>{p.type}</Badge> 
                },
                { 
                  key: "available", 
                  label: "التوفر", 
                  render: (p) => <Badge variant={p.available ? "green" : "red"}>{p.available ? "متوفر" : "غير متوفر"}</Badge> 
                },
                { 
                  key: "visible", 
                  label: "إظهار", 
                  render: (p) => {
                    const productId = p._id || p.id;
                    return (
                      <button 
                        onClick={() => toggle(productId)} 
                        className="text-[#1a2c6b]/60 hover:text-[#f28c28] transition-colors p-1"
                      >
                        {hidden[productId] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    );
                  } 
                },
                { 
                  key: "actions", 
                  label: "إجراءات", 
                  render: (p) => {
                    const productId = p._id || p.id;
                    return (
                      <div className="flex items-center gap-2">
                        <Link 
                          to={`/admin/products/${productId}/edit`} 
                          className="p-1.5 text-[#1a2c6b]/60 hover:text-[#f28c28] transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => confirmDelete(p)}
                          className="p-1.5 text-[#1a2c6b]/60 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  } 
                },
              ]}
              rows={filteredProducts}
            />
          </div>
        )}
      </Card>

      {/* النافذة المنبثقة للتأكيد (Delete Confirmation Modal) */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-xl border border-[#1a2c6b]/10 max-w-md w-full p-6 space-y-5 text-right relative">
            <button 
              onClick={() => setDeleteModalOpen(false)}
              className="absolute left-4 top-4 text-[#1a2c6b]/40 hover:text-[#1a2c6b] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1a2c6b]">تأكيد الحذف</h3>
                <p className="text-xs text-[#1a2c6b]/60">لا يمكن التراجع عن هذا الإجراء بعد تنفيذه</p>
              </div>
            </div>

            <p className="text-sm text-[#1a2c6b]/80 bg-[#1a2c6b]/[0.02] p-3 rounded-md border border-[#1a2c6b]/10">
              هل أنت متأكد من رغبتك في حذف المنتج <span className="font-bold text-[#1a2c6b]">"{productToDelete?.name}"</span>؟
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteExecute}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-medium text-sm rounded-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                {deleting ? "جاري الحذف..." : "نعم، حذف المنتج"}
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 py-2.5 px-4 border border-[#1a2c6b]/20 hover:bg-[#1a2c6b]/5 text-[#1a2c6b] font-medium text-sm rounded-sm transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}