import { useState, useEffect } from "react";
import { Lock, LogOut, Mail, Phone, Briefcase, ShieldCheck, Check, Loader2 } from "lucide-react";
import { Card, PageHeader, Field, inputClass, SectionTitle } from "@/components/admin/ui";

const API_URL = import.meta.env.VITE_API_URL;
const PERMS = ["إدارة المنتجات", "إدارة الطلبات", "نقطة البيع", "إدارة التفصيل", "إدارة المخزون", "إدارة العملاء", "إدارة المصروفات", "إدارة الموظفين", "الإعدادات"];

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  
  const [profileSaved, setProfileSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  // حالات البيانات (مرتبطة بإعدادات المتجر/المدير)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("Owner / Admin");

  // حالات كلمة المرور
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

  // جلب البيانات من مسار الإعدادات عند تحميل الصفحة
  useEffect(() => {
    const fetchProfileSettings = async () => {
      try {
        setLoading(true);
        const token = getAuthToken();

        const response = await fetch(`${API_URL}/api/settings`, {
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
          // جلب الحقول المتاحة من الإعدادات (تأكد من مطابقة أسماء الحقول مع الـ Schema لديك)
          setName(data.data.storeName || data.data.name || "");
          setEmail(data.data.email || "");
          setPhone(data.data.phone || "");
        }
      } catch (error) {
        console.error("خطأ في جلب البيانات:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileSettings();
  }, []);

  // حفظ التعديلات عبر مسار الإعدادات (PUT /api/settings)
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      const token = getAuthToken();

      const response = await fetch(`${API_URL}/api/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ storeName: name, name, email, phone })
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("الخادم لم يُرجع استجابة JSON صحيحة أثناء الحفظ.");
      }

      const data = await response.json();
      if (data.success) {
        setProfileSaved(true);
        setTimeout(() => setProfileSaved(false), 3000);
      } else {
        alert(data.message || "حدث خطأ أثناء تحديث البيانات");
      }
    } catch (error) {
      console.error("خطأ أثناء الحفظ:", error);
      alert(error.message);
    } finally {
      setSavingProfile(false);
    }
  };

  // تحديث كلمة المرور
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || newPassword !== confirmPassword) {
      alert("يرجى التأكد من تطابق كلمة المرور الجديدة وملء الحقول المطلوبة.");
      return;
    }

    try {
      setSavingPassword(true);
      const token = getAuthToken();

      const response = await fetch(`${API_URL}/api/auth/change-password`, {
        method: "POST", // تم التعديل إلى POST حسب الـ Backend
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("الخادم لم يُرجع استجابة JSON صحيحة.");
      }

      const data = await response.json();
      
      if (response.ok) {
        setPasswordSaved(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setPasswordSaved(false), 3000);
      } else {
        alert(data.message || "فشل تغيير كلمة المرور");
      }
    } catch (error) {
      console.error("خطأ في تغيير كلمة المرور:", error);
      alert(error.message);
    } finally {
      setSavingPassword(false);
    }
  };

  // تسجيل الخروج
  const handleLogout = () => {
    if (window.confirm("هل أنت متأكد من رغبتك في تسجيل الخروج؟")) {
      localStorage.clear();
      window.location.href = "/admin/login";
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
      <PageHeader title="الملف الشخصي" />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* بطاقة البروفايل الجانبية */}
        <Card className="p-6 text-center bg-white border border-[#1a2c6b]/10 rounded-lg shadow-sm h-fit">
          <div className="w-24 h-24 rounded-full bg-[#1a2c6b] text-[#f28c28] flex items-center justify-center text-4xl font-bold mx-auto mb-4 shadow-sm">
            {name ? name.charAt(0) : "A"}
          </div>
          <h3 className="font-heading text-xl font-bold text-[#1a2c6b]">{name || "مدير المتجر"}</h3>
          <p className="text-sm text-[#1a2c6b]/60 mt-1">{role}</p>
          <div className="mt-3 flex justify-center">
            <span className="bg-[#1a2c6b]/10 text-[#1a2c6b] text-xs px-2.5 py-1 rounded-sm font-medium border border-[#1a2c6b]/10">الكل</span>
          </div>
          <div className="mt-6 space-y-3 text-right pt-4 border-t border-[#1a2c6b]/10">
            <p className="flex items-center gap-2.5 text-sm text-[#1a2c6b]/80">
              <Mail className="w-4 h-4 text-[#f28c28] shrink-0" /> 
              <span dir="ltr" className="truncate">{email || "غير متوفر"}</span>
            </p>
            <p className="flex items-center gap-2.5 text-sm text-[#1a2c6b]/80">
              <Phone className="w-4 h-4 text-[#f28c28] shrink-0" /> 
              <span className="font-mono" dir="ltr">{phone || "غير متوفر"}</span>
            </p>
            <p className="flex items-center gap-2.5 text-sm text-[#1a2c6b]/80">
              <Briefcase className="w-4 h-4 text-[#f28c28] shrink-0" /> 
              <span>رواندا</span>
            </p>
          </div>
        </Card>

        {/* الأقسام الرئيسية */}
        <div className="lg:col-span-2 space-y-6">
          {/* تعديل البيانات */}
          <Card className="p-6 space-y-5 bg-white border border-[#1a2c6b]/10 rounded-lg shadow-sm">
            <SectionTitle className="text-[#1a2c6b] font-bold text-base border-b border-[#1a2c6b]/10 pb-2">تعديل البيانات</SectionTitle>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="الاسم / اسم المتجر">
                  <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} required />
                </Field>
                <Field label="البريد الإلكتروني">
                  <input value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} dir="ltr" required />
                </Field>
                <Field label="رقم الهاتف">
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} dir="ltr" required />
                </Field>
                <Field label="الوظيفة">
                  <input defaultValue={role} className={`${inputClass} bg-[#1a2c6b]/5 cursor-not-allowed`} disabled />
                </Field>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                {profileSaved && (
                  <span className="text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded-sm flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> تم الحفظ بنجاح
                  </span>
                )}
                <button 
                  type="submit" 
                  disabled={savingProfile}
                  className="py-2.5 px-6 bg-[#f28c28] hover:bg-[#e07b1e] text-white font-medium text-sm transition-colors rounded-sm shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  {savingProfile ? "جاري الحفظ..." : "حفظ التغييرات"}
                </button>
              </div>
            </form>
          </Card>

          {/* الصلاحيات */}
          <Card className="p-6 space-y-5 bg-white border border-[#1a2c6b]/10 rounded-lg shadow-sm">
            <SectionTitle 
              action={<ShieldCheck className="w-5 h-5 text-[#f28c28]" />}
              className="text-[#1a2c6b] font-bold text-base border-b border-[#1a2c6b]/10 pb-2 flex items-center justify-between"
            >
              الصلاحيات الممنوحة
            </SectionTitle>
            <div className="flex flex-wrap gap-2">
              {PERMS.map((p) => (
                <span key={p} className="bg-green-100 text-green-700 border border-green-200 text-xs px-3 py-1.5 rounded-sm font-medium">
                  {p}
                </span>
              ))}
            </div>
          </Card>

          {/* تغيير كلمة المرور */}
          <Card className="p-6 space-y-5 bg-white border border-[#1a2c6b]/10 rounded-lg shadow-sm">
            <SectionTitle className="text-[#1a2c6b] font-bold text-base border-b border-[#1a2c6b]/10 pb-2">تغيير كلمة المرور</SectionTitle>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <Field label="كلمة المرور الحالية">
                <input 
                  type="password" 
                  value={currentPassword} 
                  onChange={(e) => setCurrentPassword(e.target.value)} 
                  className={inputClass} 
                  required 
                />
              </Field>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="كلمة المرور الجديدة">
                  <input 
                    type="password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    className={inputClass} 
                    required 
                  />
                </Field>
                <Field label="تأكيد كلمة المرور">
                  <input 
                    type="password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    className={inputClass} 
                    required 
                  />
                </Field>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                {passwordSaved && (
                  <span className="text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded-sm flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> تم تحديث كلمة المرور
                  </span>
                )}
                <button 
                  type="submit" 
                  disabled={savingPassword}
                  className="py-2.5 px-6 bg-[#1a2c6b] hover:bg-[#152354] text-white font-medium text-sm transition-colors rounded-sm shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {savingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                  {savingPassword ? "جاري التحديث..." : "تحديث كلمة المرور"}
                </button>
              </div>
            </form>
          </Card>

          {/* تسجيل الخروج */}
          <div>
            <button 
              onClick={handleLogout} 
              className="w-full sm:w-auto py-2.5 px-6 border border-red-600 text-red-600 hover:bg-red-50 transition-colors rounded-sm font-medium text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> تسجيل الخروج
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}