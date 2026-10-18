import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Save, ArrowRight, X, Plus, Check, Loader2, Trash2, Image as ImageIcon } from "lucide-react";
import { Card, PageHeader, Field, inputClass } from "@/components/admin/ui";
import { CATEGORIES } from "@/components/site/constants";

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // حقول فارغة تماماً بدون أي بيانات افتراضية
  const [form, setForm] = useState({
    name: "",
    category: CATEGORIES[0] || "",
    description: "",
    price: "",
    type: "جاهز",
    available: true,
    colors: "",
    sizes: "",
    stock: "",
  });

  const [selectedImages, setSelectedImages] = useState([]); // ملفات الصور الجديدة
  const [existingImages, setExistingImages] = useState([]); // صور السيرفر القديمة

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
    if (isEditing) {
      const fetchProduct = async () => {
        try {
          setFetching(true);
          const response = await fetch(`/api/products/${id}`);
          const data = await response.json();
          if (data.success && data.data) {
            const p = data.data;
            setForm({
              name: p.name || "",
              category: p.category || CATEGORIES[0] || "",
              description: p.description || "",
              price: p.price ? String(p.price) : "",
              type: p.type || "جاهز",
              available: p.available ?? true,
              colors: Array.isArray(p.colors) ? p.colors.join("، ") : p.colors || "",
              sizes: Array.isArray(p.sizes) ? p.sizes.join("، ") : p.sizes || "",
              stock: p.stock !== undefined ? String(p.stock) : "",
            });
            setExistingImages(p.images || []);
          } else {
            setErrorMessage("لم يتم العثور على المنتج المطلوب");
          }
        } catch (err) {
          console.error("خطأ في جلب بيانات المنتج:", err);
          setErrorMessage("فشل جلب تفاصيل المنتج");
        } finally {
          setFetching(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEditing]);

  const setField = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  // إضافة صور جديدة بحد أقصى 4 أو 5 صور إجمالاً
  const handleImageChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const totalImages = existingImages.length + selectedImages.length + filesArray.length;
      
      if (totalImages > 4) {
        alert("عذراً، الحد الأقصى المسموح به هو 4 صور.");
        return;
      }
      
      setSelectedImages((prev) => [...prev, ...filesArray]);
    }
  };

  const removeSelectedImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  // دمج كل الصور المتاحة (القديمة والجديدة) لعرضها بالترتيب في الخانات الصغيرة تحت الصندوق الكبير
  const allImages = [
    ...existingImages.map(img => ({ type: 'existing', url: img })),
    ...selectedImages.map(file => ({ type: 'new', url: URL.createObjectURL(file), file }))
  ];

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) {
      alert("يرجى إدخال اسم المنتج والسعر على الأقل.");
      return;
    }

    if (!isEditing && allImages.length === 0) {
      alert("يرجى اختيار صورة واحدة على الأقل للمنتج.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");
      const token = getAuthToken();

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("category", form.category);
      formData.append("type", form.type);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("stock", form.stock || 0);
      formData.append("available", form.available);
      formData.append("colors", form.colors);
      formData.append("sizes", form.sizes);

      existingImages.forEach((img) => {
        formData.append("existingImages", img);
      });

      selectedImages.forEach((file) => {
        formData.append("images", file);
      });

      const url = isEditing ? `/api/products/${id}` : "/api/products";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: formData,
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("الخادم لم يُرجع استجابة JSON صحيحة.");
      }

      const data = await response.json();
      if (data.success) {
        setSavedSuccess(true);
        setTimeout(() => {
          navigate("/admin/products");
        }, 1500);
      } else {
        setErrorMessage(data.message || "حدث خطأ أثناء حفظ المنتج");
      }
    } catch (err) {
      console.error("خطأ الحفظ:", err);
      setErrorMessage(err.message || "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-[#1a2c6b]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#FFFFFF] min-h-screen text-[#1a2c6b] p-3 sm:p-6 transition-all">
      <PageHeader
        title={isEditing ? "تعديل المنتج" : "إضافة منتج جديد"}
        subtitle={isEditing ? form.name : "أدخل تفاصيل المنتج الجديد"}
        actions={
          <Link to="/admin/products" className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#1a2c6b]/20 text-[#1a2c6b] hover:bg-[#1a2c6b]/5 transition-colors rounded-sm text-sm font-medium">
            <ArrowRight className="w-4 h-4" /> رجوع للمنتجات
          </Link>
        }
      />

      {savedSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-sm flex items-center gap-2 text-sm font-medium">
          <Check className="w-5 h-5" /> تم حفظ المنتج بنجاح، جاري التحويل...
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-sm text-sm font-medium">
          {errorMessage}
        </div>
      )}

      <form onSubmit={submit} className="grid lg:grid-cols-3 gap-6">
        {/* تفاصيل المنتج الأساسية */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 space-y-5 bg-white border border-[#1a2c6b]/10 rounded-lg shadow-sm">
            <Field label="اسم المنتج">
              <input 
                required 
                value={form.name} 
                onChange={setField("name")} 
                placeholder="أدخل اسم المنتج..." 
                className={inputClass} 
              />
            </Field>

            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="القسم">
                <select 
                  value={form.category} 
                  onChange={setField("category")} 
                  className={`${inputClass} bg-white cursor-pointer`}
                >
                  <option value="" disabled>اختر القسم</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>

              <Field label="نوع المنتج">
                <select 
                  value={form.type} 
                  onChange={setField("type")} 
                  className={`${inputClass} bg-white cursor-pointer`}
                >
                  <option value="جاهز">جاهز</option>
                  <option value="تفصيل">تفصيل</option>
                </select>
              </Field>
            </div>

            <Field label="الوصف">
              <textarea 
                value={form.description} 
                onChange={setField("description")} 
                rows={4} 
                placeholder="أدخل وصف المنتج..." 
                className={inputClass} 
              />
            </Field>

            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="الألوان (افصل بفاصلة)">
                <input 
                  value={form.colors} 
                  onChange={setField("colors")} 
                  className={inputClass} 
                  placeholder="مثال: أبيض، أسود" 
                />
              </Field>
              <Field label="المقاسات (افصل بفاصلة)">
                <input 
                  value={form.sizes} 
                  onChange={setField("sizes")} 
                  className={inputClass} 
                  placeholder="مثال: 52، 54، 56" 
                />
              </Field>
            </div>
          </Card>
        </div>

        {/* القسم الجانبي (السعر، المخزون، والـ Upload المطابق للصورة) */}
        <div className="space-y-6">
          <Card className="p-6 space-y-5 bg-white border border-[#1a2c6b]/10 rounded-lg shadow-sm">
            <Field label="السعر (RWF)">
              <input 
                type="number" 
                required 
                value={form.price} 
                onChange={setField("price")} 
                placeholder="0" 
                className={inputClass} 
              />
            </Field>

            <Field label="الكمية في المخزون">
              <input 
                type="number" 
                value={form.stock} 
                onChange={setField("stock")} 
                placeholder="0" 
                className={inputClass} 
              />
            </Field>

            <Field label="حالة التوفر">
              <select 
                value={form.available ? "متوفر" : "غير متوفر"} 
                onChange={(e) => setForm({ ...form, available: e.target.value === "متوفر" })} 
                className={`${inputClass} bg-white cursor-pointer`}
              >
                <option value="متوفر">متوفر</option>
                <option value="غير متوفر">غير متوفر</option>
              </select>
            </Field>
          </Card>

          {/* تصميم قسم الصور المطابق تماماً للصورة المرفقة */}
          <Card className="p-6 bg-white border border-[#1a2c6b]/10 rounded-lg shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[#1a2c6b]">صور المنتج</p>
              <span className="text-xs text-[#1a2c6b]/60 font-mono">
                ({allImages.length}/4)
              </span>
            </div>

            {/* صندوق الرفع الرئيسي الكبير في الأعلى */}
            <label className="border-2 border-dashed border-[#1a2c6b]/20 hover:border-[#f28c28] transition-colors rounded-lg flex flex-col items-center justify-center text-[#1a2c6b]/50 cursor-pointer bg-[#1a2c6b]/[0.02] h-64 block relative">
              <Plus className="w-10 h-10 mb-2 text-[#f28c28]" />
              <span className="text-xs font-medium text-[#1a2c6b]/60">اضغط لإضافة صورة</span>
              <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>

            {/* خانات المعاينة الصغيرة في الأسفل (صورة 1، صورة 2، صورة 3...) */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[0, 1, 2].map((index) => {
                const imgItem = allImages[index];
                return (
                  <div 
                    key={index} 
                    className="h-24 border border-[#1a2c6b]/15 rounded-md bg-[#1a2c6b]/[0.02] flex flex-col items-center justify-center relative overflow-hidden group"
                  >
                    {imgItem ? (
                      <>
                        <img src={imgItem.url} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            if (imgItem.type === 'existing') {
                              const originalIdx = existingImages.indexOf(imgItem.url);
                              removeExistingImage(originalIdx);
                            } else {
                              const newFilesIdx = selectedImages.findIndex(f => URL.createObjectURL(f) === imgItem.url);
                              removeSelectedImage(newFilesIdx);
                            }
                          }}
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                        >
                          <Trash2 className="w-5 h-5 text-red-400" />
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-[#1a2c6b]/40 font-medium select-none">
                        صورة {index + 1}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* أزرار الحفظ والإلغاء */}
          <div className="flex gap-3">
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 py-3 px-4 bg-[#f28c28] hover:bg-[#e07b1e] text-white font-medium text-sm transition-colors rounded-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {loading ? "جاري الحفظ..." : "حفظ المنتج"}
            </button>
            <Link 
              to="/admin/products" 
              className="flex-1 py-3 px-4 border border-[#1a2c6b]/20 hover:bg-[#1a2c6b]/5 text-[#1a2c6b] font-medium text-sm transition-colors rounded-sm flex items-center justify-center gap-2 text-center"
            >
              <X className="w-4 h-4" /> إلغاء
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}