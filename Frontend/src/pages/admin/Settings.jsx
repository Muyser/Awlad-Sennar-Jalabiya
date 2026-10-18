import { useState, useEffect } from "react";
import { Check, Loader2 } from "lucide-react";
import { Card, PageHeader, Field, inputClass, SectionTitle } from "@/components/admin/ui";

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // حالة حقول الإعدادات
  const [formData, setFormData] = useState({
    storeName: "",
    phone: "",
    whatsapp: "",
    address: "",
    currency: "RWF",
    facebook: "",
    instagram: "",
    activityType: "",
    commercialRecord: "",
    defaultOrderStatus: "جديد",
    prepDays: "3",
    tailoringDays: "14",
    minDeposit: "50",
    notifications: {
      "إشعار طلب جديد": true,
      "إشعار طلب تفصيل جديد": true,
      "إشعار منخفض المخزون": true,
      "إشعار دفع جديد": true,
    }
  });

  // دالة استخراج التوكن الذكية
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

  // جلب الإعدادات من الخادم عند تحميل الصفحة
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const token = getAuthToken();

        const response = await fetch("/api/settings", {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
          }
        });

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("الخادم لم يُرجع بيانات JSON صحيحة.");
        }

        const data = await response.json();
        if (data.success && data.data) {
          setFormData(prev => ({ ...prev, ...data.data }));
        }
      } catch (error) {
        console.error("خطأ في جلب الإعدادات:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (key) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };

  // حفظ الإعدادات وإرسالها للباك إند
  const handleSaveAll = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const token = getAuthToken();

      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify(formData)
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("الخادم لم يُرجع استجابة JSON صحيحة أثناء الحفظ.");
      }

      const data = await response.json();
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert(data.message || "حدث خطأ أثناء حفظ الإعدادات");
      }
    } catch (error) {
      console.error("خطأ أثناء الحفظ:", error);
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-[#1a2c6b]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#FFFFFF] min-h-screen text-[#1a2c6b] p-3 sm:p-6 transition-all">
      <PageHeader title="الإعدادات" subtitle="إعدادات المتجر والنظام" />

      <form onSubmit={handleSaveAll} className="space-y-6 max-w-4xl">
        {/* معلومات المتجر */}
        <Card className="p-6 space-y-5 bg-white border border-[#1a2c6b]/10 rounded-lg shadow-sm">
          <SectionTitle className="text-[#1a2c6b] font-bold text-base border-b border-[#1a2c6b]/10 pb-2">معلومات المتجر</SectionTitle>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="اسم المتجر">
              <input value={formData.storeName || ""} onChange={(e) => handleChange("storeName", e.target.value)} className={inputClass} required />
            </Field>
            <Field label="رقم الهاتف">
              <input value={formData.phone || ""} onChange={(e) => handleChange("phone", e.target.value)} className={inputClass} dir="ltr" required />
            </Field>
            <Field label="رقم واتساب">
              <input value={formData.whatsapp || ""} onChange={(e) => handleChange("whatsapp", e.target.value)} className={inputClass} dir="ltr" required />
            </Field>
            <Field label="العنوان">
              <input value={formData.address || ""} onChange={(e) => handleChange("address", e.target.value)} className={inputClass} />
            </Field>
            <Field label="العملة">
              <select value={formData.currency || "RWF"} onChange={(e) => handleChange("currency", e.target.value)} className={`${inputClass} bg-white cursor-pointer`}>
                <option value="RWF">RWF (الفرنك الرواندي)</option>
                <option value="USD">USD (دولار أمريكي)</option>
                <option value="EUR">EUR (يورو)</option>
              </select>
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-5 pt-2 border-t border-[#1a2c6b]/5">
            <Field label="فيسبوك">
              <input value={formData.facebook || ""} onChange={(e) => handleChange("facebook", e.target.value)} className={inputClass} placeholder="/sennar.jallabia" dir="ltr" />
            </Field>
            <Field label="إنستغرام">
              <input value={formData.instagram || ""} onChange={(e) => handleChange("instagram", e.target.value)} className={inputClass} placeholder="@awlad_sennar" dir="ltr" />
            </Field>
          </div>
        </Card>

        {/* معلومات النشاط التجاري */}
        <Card className="p-6 space-y-5 bg-white border border-[#1a2c6b]/10 rounded-lg shadow-sm">
          <SectionTitle className="text-[#1a2c6b] font-bold text-base border-b border-[#1a2c6b]/10 pb-2">معلومات النشاط التجاري</SectionTitle>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="نوع النشاط">
              <input value={formData.activityType || ""} onChange={(e) => handleChange("activityType", e.target.value)} className={inputClass} />
            </Field>
            <Field label="السجل التجاري">
              <input value={formData.commercialRecord || ""} onChange={(e) => handleChange("commercialRecord", e.target.value)} className={inputClass} dir="ltr" />
            </Field>
          </div>
        </Card>

        {/* إعدادات الطلبات */}
        <Card className="p-6 space-y-5 bg-white border border-[#1a2c6b]/10 rounded-lg shadow-sm">
          <SectionTitle className="text-[#1a2c6b] font-bold text-base border-b border-[#1a2c6b]/10 pb-2">إعدادات الطلبات</SectionTitle>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="حالة الطلب الافتراضية">
              <select value={formData.defaultOrderStatus || "جديد"} onChange={(e) => handleChange("defaultOrderStatus", e.target.value)} className={`${inputClass} bg-white cursor-pointer`}>
                <option>جديد</option>
                <option>تم التأكيد</option>
              </select>
            </Field>
            <Field label="مهلة تجهيز الطلب (أيام)">
              <input type="number" value={formData.prepDays || "3"} onChange={(e) => handleChange("prepDays", e.target.value)} className={inputClass} min="1" />
            </Field>
          </div>
        </Card>

        {/* إعدادات التفصيل */}
        <Card className="p-6 space-y-5 bg-white border border-[#1a2c6b]/10 rounded-lg shadow-sm">
          <SectionTitle className="text-[#1a2c6b] font-bold text-base border-b border-[#1a2c6b]/10 pb-2">إعدادات التفصيل</SectionTitle>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="مهلة التفصيل الافتراضية (أيام)">
              <input type="number" value={formData.tailoringDays || "14"} onChange={(e) => handleChange("tailoringDays", e.target.value)} className={inputClass} min="1" />
            </Field>
            <Field label="الحد الأدنى للدفعة المقدمة (%)">
              <input type="number" value={formData.minDeposit || "50"} onChange={(e) => handleChange("minDeposit", e.target.value)} className={inputClass} min="0" max="100" />
            </Field>
          </div>
        </Card>

        {/* إعدادات الإشعارات */}
        <Card className="p-6 space-y-5 bg-white border border-[#1a2c6b]/10 rounded-lg shadow-sm">
          <SectionTitle className="text-[#1a2c6b] font-bold text-base border-b border-[#1a2c6b]/10 pb-2">إعدادات الإشعارات</SectionTitle>
          <div className="grid sm:grid-cols-2 gap-4">
            {Object.keys(formData.notifications || {}).map((n) => (
              <label key={n} className="flex items-center gap-3 text-sm text-[#1a2c6b]/80 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={formData.notifications[n]} 
                  onChange={() => handleCheckboxChange(n)} 
                  className="w-4 h-4 accent-[#f28c28] rounded cursor-pointer" 
                /> 
                {n}
              </label>
            ))}
          </div>
        </Card>

        {/* زر الحفظ */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {saved && (
            <span className="text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded-sm flex items-center gap-1.5 animate-fadeIn">
              <Check className="w-4 h-4" /> تم حفظ الإعدادات بنجاح
            </span>
          )}
          <button 
            type="submit" 
            disabled={saving}
            className="py-3 px-6 bg-[#f28c28] hover:bg-[#e07b1e] text-white font-medium text-sm transition-colors rounded-sm shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {saving ? "جاري الحفظ..." : "حفظ الإعدادات"}
          </button>
        </div>
      </form>
    </div>
  );
}