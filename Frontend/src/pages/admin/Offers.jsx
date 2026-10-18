import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Check, X, Loader2, AlertTriangle } from "lucide-react";
import { Card, PageHeader, Table, Badge, GoldButton, Field, inputClass } from "@/components/admin/ui";

const API_URL = import.meta.env.VITE_API_URL;

export default function Offers() {
  const [offersList, setOffersList] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // حالات نافذة الحذف المنبثقة
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // حقول النموذج
  const [formName, setFormName] = useState("");
  const [formProduct, setFormProduct] = useState("");
  const [formType, setFormType] = useState("نسبة مئوية"); // متطابق تماماً مع الـ Schema لديك
  const [formValue, setFormValue] = useState("");
  const [formStart, setFormStart] = useState("");
  const [formEnd, setFormEnd] = useState("");

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

  // جلب العروض من الباك إند
  const fetchOffers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/offers`);
      const data = await res.json();
      if (data.success) {
        setOffersList(data.data || []);
      }
    } catch (error) {
      console.error("خطأ في جلب العروض:", error);
    } finally {
      setLoading(false);
    }
  };

  // جلب قائمة المنتجات للقائمة المنسدلة
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products`);
      const data = await res.json();
      if (data.success) {
        setProductsList(data.data || []);
      }
    } catch (error) {
      console.error("خطأ في جلب المنتجات:", error);
    }
  };

  useEffect(() => {
    fetchOffers();
    fetchProducts();
  }, []);

  // فتح نافذة الإنشاء
  const handleOpenAdd = () => {
    setEditingOffer(null);
    setFormName("");
    setFormProduct(""); 
    setFormType("نسبة مئوية");
    setFormValue("");
    setFormStart("");
    setFormEnd("");
    setModalOpen(true);
  };

  // فتح نافذة التعديل
  const handleOpenEdit = (offer) => {
    setEditingOffer(offer);
    setFormName(offer.name || "");
    setFormProduct(typeof offer.product === 'object' && offer.product ? offer.product._id : offer.product || "");
    setFormType(offer.type || "نسبة مئوية");
    setFormValue(offer.value || "");
    setFormStart(offer.start ? new Date(offer.start).toISOString().split('T')[0] : "");
    setFormEnd(offer.end ? new Date(offer.end).toISOString().split('T')[0] : "");
    setModalOpen(true);
  };

  // حفظ العرض (إضافة أو تعديل)
  const handleSave = async (e) => {
    e.preventDefault();
    if (!formName.trim() || !formProduct.trim() || !formValue.trim()) return;

    const token = getAuthToken();

    const offerData = {
      name: formName,
      product: formProduct,
      type: formType,
      value: formValue,
      start: formStart,
      end: formEnd,
      active: true,
    };

    try {
      setSubmitting(true);
      let res, data;
      if (editingOffer !== null) {
        res = await fetch(`${API_URL}/api/offers/${editingOffer._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
          },
          body: JSON.stringify(offerData),
        });
      } else {
        res = await fetch(`${API_URL}/api/offers`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
          },
          body: JSON.stringify(offerData),
        });
      }

      data = await res.json();

      if (data.success) {
        fetchOffers();
        setModalOpen(false);
      } else {
        alert(data.message || "حدث خطأ أثناء الحفظ");
      }
    } catch (error) {
      console.error("خطأ في حفظ العرض:", error);
      alert("حدث خطأ في الاتصال بالخادم");
    } finally {
      setSubmitting(false);
    }
  };

  // فتح نافذة تأكيد الحذف
  const confirmDelete = (offer) => {
    setOfferToDelete(offer);
    setDeleteModalOpen(true);
  };

  // تنفيذ عملية الحذف الفعلية
  const handleDelete = async () => {
    if (!offerToDelete) return;
    
    const token = getAuthToken();
    try {
      setDeleting(true);
      const res = await fetch(`${API_URL}/api/offers/${offerToDelete._id}`, {
        method: "DELETE",
        headers: {
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        }
      });
      const data = await res.json();
      if (data.success) {
        setOffersList(offersList.filter(o => o._id !== offerToDelete._id));
        setDeleteModalOpen(false);
        setOfferToDelete(null);
      } else {
        alert(data.message || "حدث خطأ أثناء الحذف");
      }
    } catch (error) {
      console.error("خطأ في حذف العرض:", error);
      alert("حدث خطأ في الاتصال بالخادم");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-[#FFFFFF] min-h-screen text-[#1a2c6b] p-3 sm:p-6 transition-all">
      <PageHeader 
        title="العروض والخصومات" 
        subtitle={loading ? "جاري التحميل..." : `${offersList.length} عرض`} 
        actions={
          <GoldButton onClick={handleOpenAdd} className="bg-[#f28c28] hover:bg-[#e07b1e] text-white flex items-center gap-1.5 cursor-pointer">
            <Plus className="w-4 h-4" /> إنشاء عرض
          </GoldButton>
        } 
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 sm:p-5 bg-white border border-[#1a2c6b]/10 rounded-lg shadow-sm">
          <p className="text-xs font-semibold text-[#1a2c6b]/60">عروض مفعّلة</p>
          <p className="font-mono text-2xl sm:text-3xl font-bold text-green-700 mt-2">
            {offersList.filter((o) => o.active).length}
          </p>
        </Card>
        <Card className="p-4 sm:p-5 bg-white border border-[#1a2c6b]/10 rounded-lg shadow-sm">
          <p className="text-xs font-semibold text-[#1a2c6b]/60">عروض متوقفة</p>
          <p className="font-mono text-2xl sm:text-3xl font-bold text-[#1a2c6b]/50 mt-2">
            {offersList.filter((o) => !o.active).length}
          </p>
        </Card>
        <Card className="p-4 sm:p-5 bg-white border border-[#1a2c6b]/10 rounded-lg shadow-sm">
          <p className="text-xs font-semibold text-[#1a2c6b]/60">إجمالي العروض</p>
          <p className="font-mono text-2xl sm:text-3xl font-bold text-[#1a2c6b] mt-2">
            {offersList.length}
          </p>
        </Card>
      </div>

      {/* Offers Table Container */}
      <Card className="p-0 overflow-hidden bg-white border border-[#1a2c6b]/10 rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
             <div className="p-16 flex items-center justify-center gap-2 text-[#1a2c6b]">
               <Loader2 className="w-6 h-6 animate-spin" />
               <span className="text-sm font-medium">جاري تحميل العروض...</span>
             </div>
          ) : offersList.length === 0 ? (
            <div className="text-center p-16 text-[#1a2c6b]/60 text-sm">
              لا توجد عروض مسجلة حالياً.
            </div>
          ) : (
            <Table
              columns={[
                { key: "name", label: "اسم العرض", render: (r) => <span className="font-medium text-[#1a2c6b]">{r.name}</span> },
                { key: "product", label: "المنتج", render: (r) => <span className="text-[#1a2c6b]/70">{r.product?.name || "منتج غير معروف"}</span> },
                { key: "type", label: "نوع الخصم", render: (r) => <span className="text-xs bg-[#1a2c6b]/5 text-[#1a2c6b] px-2 py-1 rounded-sm border border-[#1a2c6b]/10">{r.type}</span> },
                { key: "value", label: "القيمة", render: (r) => <span className="font-mono text-[#f28c28] font-bold dir-ltr inline-block">{r.value}</span> },
                { key: "start", label: "البداية", render: (r) => <span className="font-mono text-xs text-[#1a2c6b]/60">{r.start ? new Date(r.start).toLocaleDateString() : "-"}</span> },
                { key: "end", label: "النهاية", render: (r) => <span className="font-mono text-xs text-[#1a2c6b]/60">{r.end ? new Date(r.end).toLocaleDateString() : "-"}</span> },
                { key: "active", label: "الحالة", render: (r) => <Badge variant={r.active ? "green" : "gray"} className={r.active ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-600 border-gray-200"}>{r.active ? "مفعّل" : "متوقف"}</Badge> },
                { key: "actions", label: "إجراءات", render: (r) => (
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleOpenEdit(r)} className="p-1.5 text-[#1a2c6b]/60 hover:text-[#f28c28] transition-colors rounded-sm hover:bg-[#1a2c6b]/5 cursor-pointer" title="تعديل">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => confirmDelete(r)} className="p-1.5 text-[#1a2c6b]/60 hover:text-red-600 transition-colors rounded-sm hover:bg-red-50 cursor-pointer" title="حذف">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) },
              ]}
              rows={offersList}
            />
          )}
        </div>
      </Card>

      {/* مودال إنشاء / تعديل عرض */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative border border-[#1a2c6b]/10 text-[#1a2c6b]">
            <button onClick={() => setModalOpen(false)} className="absolute left-4 top-4 text-[#1a2c6b]/60 hover:text-[#f28c28] cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-heading text-lg font-bold mb-4">
              {editingOffer !== null ? "تعديل العرض" : "إنشاء عرض جديد"}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <Field label="اسم العرض">
                <input 
                  value={formName} 
                  onChange={(e) => setFormName(e.target.value)} 
                  placeholder="مثال: خصم العيد" 
                  className={inputClass} 
                  required 
                />
              </Field>

              <Field label="المنتج المستهدف">
                <select 
                  value={formProduct} 
                  onChange={(e) => setFormProduct(e.target.value)} 
                  className={`${inputClass} bg-white cursor-pointer`}
                  required 
                >
                  <option value="">-- اختر المنتج --</option>
                  {productsList.map((prod) => (
                    <option key={prod._id} value={prod._id}>
                      {prod.name} ({prod.price} RWF)
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="نوع الخصم">
                <select 
                  value={formType} 
                  onChange={(e) => setFormType(e.target.value)} 
                  className={`${inputClass} bg-white cursor-pointer`}
                  required
                >
                  <option value="نسبة مئوية">نسبة مئوية</option>
                  <option value="مبلغ ثابت">مبلغ ثابت</option>
                </select>
              </Field>

              <Field label="قيمة الخصم">
                <input 
                  value={formValue} 
                  onChange={(e) => setFormValue(e.target.value)} 
                  placeholder="مثال: 20% أو 50" 
                  className={inputClass} 
                  required 
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="تاريخ البداية">
                  <input 
                    type="date" 
                    value={formStart} 
                    onChange={(e) => setFormStart(e.target.value)} 
                    className={inputClass} 
                    required
                  />
                </Field>
                <Field label="تاريخ النهاية">
                  <input 
                    type="date" 
                    value={formEnd} 
                    onChange={(e) => setFormEnd(e.target.value)} 
                    className={inputClass} 
                    required
                  />
                </Field>
              </div>
              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full py-3 bg-[#f28c28] text-white hover:bg-[#e07b1e] transition-colors rounded-sm shadow-sm font-medium text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? "جاري الحفظ..." : <><Check className="w-4 h-4" /> حفظ العرض</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* مودال تأكيد الحذف */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative border border-[#1a2c6b]/10 text-[#1a2c6b] text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-lg font-bold mb-2">تأكيد الحذف</h3>
            <p className="text-sm text-[#1a2c6b]/70 mb-6">
              هل أنت متأكد من رغبتك في حذف العرض <span className="font-bold text-[#1a2c6b]">"{offerToDelete?.name}"</span>؟ لا يمكن التراجع عن هذا الإجراء.
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
                onClick={handleDelete}
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