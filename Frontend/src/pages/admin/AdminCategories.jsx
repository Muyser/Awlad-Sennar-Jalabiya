import { useState, useEffect } from "react";
import { Image } from "@/components/ui/image";
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Check, Loader2, AlertTriangle, Upload } from "lucide-react";
import { Card, PageHeader, GoldButton, Field, inputClass } from "@/components/admin/ui";

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  
  // حقول النموذج
  const [formName, setFormName] = useState("");
  const [formCount, setFormCount] = useState("");
  const [formImageFile, setFormImageFile] = useState(null); // ملف الصورة الحقيقي
  const [formImagePreview, setFormImagePreview] = useState(""); // معاينة الصورة
  const [submitting, setSubmitting] = useState(false);

  // حالات نافذة الحذف المنبثقة (Delete Modal)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
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

  // جلب الأقسام من الـ Backend
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/categories`);
      const data = await res.json();
      if (data.success) {
        setCategories(data.data || []);
      } else {
        setError(data.message || "فشل جلب الأقسام");
      }
    } catch (err) {
      console.error("خطأ في جلب الأقسام:", err);
      setError("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // فتح نافذة الإضافة
  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormName("");
    setFormCount("");
    setFormImageFile(null);
    setFormImagePreview("");
    setModalOpen(true);
  };

  // فتح نافذة التعديل
  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormName(cat.name || "");
    setFormCount(cat.count !== undefined ? String(cat.count) : "");
    setFormImageFile(null);
    setFormImagePreview(cat.image || "");
    setModalOpen(true);
  };

  // التعامل مع اختيار ملف الصورة
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormImageFile(file);
      setFormImagePreview(URL.createObjectURL(file));
    }
  };

  // حفظ القسم (إضافة أو تحديث) عبر الـ API
  const handleSave = async (e) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (!editingCategory && !formImageFile) {
      alert("صورة القسم مطلوبة عند الإضافة");
      return;
    }

    try {
      setSubmitting(true);
      const token = getAuthToken();
      const formData = new FormData();
      formData.append("name", formName);
      formData.append("count", formCount || "1");
      if (formImageFile) {
        formData.append("image", formImageFile);
      }

      const url = editingCategory ? `${API_URL}/api/categories/${editingCategory._id}` : `${API_URL}/api/categories`;
      const method = editingCategory ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: formData
      });

      const data = await res.json();
      if (data.success) {
        fetchCategories(); // إعادة جلب القائمة المحدثة
        setModalOpen(false);
      } else {
        alert(data.message || "حدث خطأ أثناء حفظ القسم");
      }
    } catch (err) {
      console.error("خطأ في الحفظ:", err);
      alert("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setSubmitting(false);
    }
  };

  // فتح نافذة تأكيد الحذف المنبثقة
  const confirmDelete = (cat) => {
    setCategoryToDelete(cat);
    setDeleteModalOpen(true);
  };

  // تنفيذ الحذف الفعلي
  const handleDeleteExecute = async () => {
    if (!categoryToDelete) return;
    const catId = categoryToDelete._id;

    try {
      setDeleting(true);
      const token = getAuthToken();
      const res = await fetch(`${API_URL}/api/categories/${catId}`, {
        method: "DELETE",
        headers: {
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        }
      });

      const data = await res.json();
      if (data.success) {
        setCategories(categories.filter(c => c._id !== catId));
        setDeleteModalOpen(false);
        setCategoryToDelete(null);
      } else {
        alert(data.message || "فشل حذف القسم");
      }
    } catch (err) {
      console.error("خطأ الحذف:", err);
      alert("حدث خطأ أثناء محاولة الحذف");
    } finally {
      setDeleting(false);
    }
  };

  // تبديل حالة الإظهار/الإخفاء
  const handleToggleVisibility = (id) => {
    setCategories(categories.map(c => c._id === id ? { ...c, visible: c.visible !== false ? false : true } : c));
  };

  return (
    <div className="bg-[#FFFFFF] min-h-screen text-[#1a2c6b] p-3 sm:p-6 transition-all relative">
      <PageHeader 
        title="الأقسام" 
        subtitle={`${categories.length} قسم`} 
        actions={
          <GoldButton onClick={handleOpenAdd} className="bg-[#f28c28] hover:bg-[#e07b1e] text-white flex items-center gap-1.5 cursor-pointer">
            <Plus className="w-4 h-4" /> إضافة قسم
          </GoldButton>
        } 
      />

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-sm text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center p-16 text-[#1a2c6b]">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="mr-2 text-sm font-medium">جاري تحميل الأقسام...</span>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center p-16 text-[#1a2c6b]/60 text-sm bg-white border border-[#1a2c6b]/10 rounded-lg shadow-sm">
          لا توجد أقسام مسجلة حالياً. اضغط على "إضافة قسم" لإدراج قسم جديد.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {categories.map((c) => {
            const isVisible = c.visible !== false;
            return (
              <Card key={c._id} className="overflow-hidden group bg-white border border-[#1a2c6b]/10 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md p-0">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#1a2c6b]/5">
                  <Image src={c.image} alt={c.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" fittingType="fill" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a2c6b]/80 via-[#1a2c6b]/20 to-transparent" />
                  <div className="absolute bottom-0 inset-x-0 p-3.5">
                    <h3 className="font-heading text-lg font-bold text-[#FFFFFF] mb-0.5">{c.name}</h3>
                    <p className="text-xs text-[#f28c28] font-mono font-semibold">{c.count} منتج</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-[#1a2c6b]/5">
                  <span className={`text-xs font-medium px-2 py-1 rounded-sm border ${isVisible ? "bg-[#1a2c6b]/5 text-[#1a2c6b] border-[#1a2c6b]/10" : "text-[#f28c28] bg-[#f28c28]/10 border-[#f28c28]/20"}`}>
                    {isVisible ? "ظاهر" : "مخفي"}
                  </span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleToggleVisibility(c._id)} className="p-1.5 text-[#1a2c6b]/60 hover:text-[#f28c28] transition-colors rounded-sm hover:bg-[#1a2c6b]/5" title={isVisible ? "إخفاء" : "إظهار"}>
                      {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button onClick={() => handleOpenEdit(c)} className="p-1.5 text-[#1a2c6b]/60 hover:text-[#f28c28] transition-colors rounded-sm hover:bg-[#1a2c6b]/5" title="تعديل">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => confirmDelete(c)} className="p-1.5 text-[#1a2c6b]/60 hover:text-red-600 transition-colors rounded-sm hover:bg-[#1a2c6b]/5" title="حذف">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* مودال الإضافة / التعديل */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative border border-[#1a2c6b]/10 text-[#1a2c6b]">
            <button onClick={() => setModalOpen(false)} className="absolute left-4 top-4 text-[#1a2c6b]/60 hover:text-[#f28c28]">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-heading text-lg font-bold mb-4">
              {editingCategory !== null ? "تعديل القسم" : "إضافة قسم جديد"}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <Field label="اسم القسم">
                <input 
                  value={formName} 
                  onChange={(e) => setFormName(e.target.value)} 
                  placeholder="مثال: جلاليب سودانية" 
                  className={inputClass} 
                  required 
                />
              </Field>

              <Field label="عدد المنتجات">
                <input 
                  type="number" 
                  value={formCount} 
                  onChange={(e) => setFormCount(e.target.value)} 
                  placeholder="1" 
                  className={inputClass} 
                />
              </Field>

              <Field label="صورة القسم">
                <div className="space-y-2">
                  <label className="border-2 border-dashed border-[#1a2c6b]/20 hover:border-[#f28c28] transition-colors rounded-lg flex flex-col items-center justify-center text-[#1a2c6b]/50 cursor-pointer bg-[#1a2c6b]/[0.02] h-32 relative overflow-hidden">
                    {formImagePreview ? (
                      <img src={formImagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <Upload className="w-6 h-6 mb-1 text-[#f28c28]" />
                        <span className="text-xs font-medium">اختر صورة القسم</span>
                      </>
                    )}
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
              </Field>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full py-3 bg-[#f28c28] text-white hover:bg-[#e07b1e] transition-colors rounded-sm shadow-sm font-medium text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? "جاري الحفظ..." : <><Check className="w-4 h-4" /> حفظ القسم</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* النافذة المنبثقة لتأكيد الحذف (Delete Confirmation Modal) */}
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
              هل أنت متأكد من رغبتك في حذف القسم <span className="font-bold text-[#1a2c6b]">"{categoryToDelete?.name}"</span>؟
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteExecute}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-medium text-sm rounded-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                {deleting ? "جاري الحذف..." : "نعم، حذف القسم"}
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 py-2.5 px-4 border border-[#1a2c6b]/20 hover:bg-[#1a2c6b]/5 text-[#1a2c6b] font-medium text-sm rounded-sm transition-colors cursor-pointer"
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