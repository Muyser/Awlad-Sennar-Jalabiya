import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowRight, Save, Check, Trash2, AlertTriangle, X } from "lucide-react";
import { Card, PageHeader, Field, inputClass, StatusBadge, SectionTitle } from "@/components/admin/ui";
import { money } from "@/lib/mockData";
import { WhatsAppIcon } from "@/components/site/Icons";

const API_URL = import.meta.env.VITE_API_URL;
const TAILOR_MAP = { جديد: "gold", "أخذ المقاسات": "blue", "قيد التفصيل": "amber", جاهز: "green", "تم التسليم": "gray" };
const STATUSES = ["جديد", "أخذ المقاسات", "قيد التفصيل", "جاهز", "تم التسليم"];

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

// دالة تنظيف وتنسيق رقم الواتساب الذكية (تدعم +250 و 250 و 07...)
const formatWhatsAppNumber = (rawPhone) => {
  if (!rawPhone) return "";
  
  // إزالة جميع الرموز والمسافات ما عدا الأرقام وعلامة الزائد
  let cleaned = rawPhone.toString().trim().replace(/[^\d+]/g, "");

  // إذا بدأ الرقم بـ 0 (مثل 0794420606)، يتم استبدال الصفر بكود دولة رواندا (250)
  if (cleaned.startsWith("0")) {
    cleaned = "250" + cleaned.substring(1);
  }
  
  // إزالة علامة الزائد (+) لأن رابط wa.me لا يقبلها
  if (cleaned.startsWith("+")) {
    cleaned = cleaned.substring(1);
  }

  // التأكد من أن الرقم صالح وطوله منطقي
  if (cleaned.length < 9) {
    return "";
  }

  return cleaned;
};

export default function TailoringDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState(false);

  // حالات النافذة المنبثقة (Popup Modal)
  const [modal, setModal] = useState({ show: false, title: "", message: "", type: "error", onConfirm: null });

  // الحقول القابلة للتعديل
  const [status, setStatus] = useState("جديد");
  const [paid, setPaid] = useState("");
  const [total, setTotal] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState("");
  const [fabric, setFabric] = useState("");
  const [color, setColor] = useState("");
  const [delivery, setDelivery] = useState("");
  const [measurements, setMeasurements] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        const token = getAuthToken();
        
        const response = await fetch(`${API_URL}/api/tailoring`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });
        
        const data = await response.json();
        if (response.ok && data.success) {
          const found = data.data.find((o) => o._id === id || o.orderId === id);
          if (found) {
            setOrder(found);
            setStatus(found.status || "جديد");
            setPaid(String(found.paid || 0));
            setTotal(String(found.total || 0));
            setCustomerName(found.customer?.name || "");
            setPhone(found.customer?.phone || "");
            setType(found.type || "");
            setFabric(found.fabric || "");
            setColor(found.color || "");
            setDelivery(found.delivery ? found.delivery.split("T")[0] : "");
            
            if (typeof found.measurements === "object" && found.measurements !== null) {
              const m = found.measurements;
              setMeasurements(`طول اليد: ${m.chest || '-'}، طول: ${m.length || '-'}، كم: ${m.sleeve || '-'}، كتف: ${m.shoulder || '-'}`);
            } else {
              setMeasurements(found.measurements || "");
            }
            setNotes(found.notes || "");
          }
        }
      } catch (err) {
        console.error("Error fetching tailoring detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetail();
  }, [id]);

  const paidNum = Number(paid) || 0;
  const totalNum = Number(total) || 0;
  const remaining = Math.max(0, totalNum - paidNum);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = getAuthToken();
      
      if (!token) {
        setModal({
          show: true,
          title: "تنبيه بالمصادقة",
          message: "الرجاء تسجيل الدخول مرة أخرى، لم يتم العثور على رمز المصادقة.",
          type: "error",
          onConfirm: null
        });
        return;
      }

      const response = await fetch(`${API_URL}/api/tailoring/${order._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          status,
          paid: paidNum,
          total: totalNum,
          customer: { name: customerName, phone },
          type,
          fabric,
          color,
          delivery,
          measurements,
          notes,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "حدث خطأ أثناء التحديث");
      }

      if (data.success) {
        setOrder(data.data);
        setSuccessMsg(true);
        setTimeout(() => setSuccessMsg(false), 3000);
      }
    } catch (err) {
      setModal({
        show: true,
        title: "خطأ في التحديث",
        message: err.message || "حدث خطأ أثناء حفظ التحديثات",
        type: "error",
        onConfirm: null
      });
    }
  };

  const confirmDelete = () => {
    setModal({
      show: true,
      title: "تأكيد الحذف",
      message: "هل أنت متأكد من رغبتك في حذف طلب التفصيل هذا؟ لا يمكن التراجع عن هذا الإجراء.",
      type: "confirm",
      onConfirm: handleDelete
    });
  };

  const handleDelete = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        setModal({ show: true, title: "خطأ", message: "الرجاء تسجيل الدخول مرة أخرى.", type: "error", onConfirm: null });
        return;
      }

      const response = await fetch(`${API_URL}/api/tailoring/${order._id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "حدث خطأ أثناء حذف الطلب");
      }

      if (data.success !== false) {
        navigate("/admin/tailoring");
      } else {
        setModal({ show: true, title: "فشل الحذف", message: data.message || "فشل حذف الطلب", type: "error", onConfirm: null });
      }
    } catch (err) {
      setModal({ show: true, title: "خطأ", message: err.message || "حدث خطأ أثناء محاولة حذف الطلب", type: "error", onConfirm: null });
    }
  };

  if (loading) return <div className="p-8 text-center text-[#1a2c6b]">جاري التحميل...</div>;
  if (!order) return <div className="p-8 text-center text-red-600">طلب التفصيل غير موجود</div>;

  const getWhatsAppMessage = (currentStatus, orderId, name) => {
    switch (currentStatus) {
      case "أخذ المقاسات":
        return `مرحباً ${name}، تم البدء بـ *أخذ المقاسات* لطلب التفصيل الخاص بك (${orderId}) في متجر أولاد سنار جلابية.`;
      case "قيد التفصيل":
        return `عزيزي العميل ${name}، طلب التفصيل الخاص بك (${orderId}) أصبح الآن *قيد التفصيل* والخياطة.`;
      case "جاهز":
        return `مرحباً ${name}، نود إعلامك بأن طلب التفصيل الخاص بك (${orderId}) أصبح *جاهزاً* للاستلام!`;
      case "تم التسليم":
        return `مرحباً ${name}، شكراً لاستلامك طلب التفصيل (${orderId}). نتمنى أن ينال إعجابك من أولاد سنار جلابية!`;
      default:
        return `مرحباً ${name}، بخصوص طلب التفصيل الخاص بك رقم (${orderId}) من أولاد سنار جلابية.`;
    }
  };

  const whatsappMsg = getWhatsAppMessage(status, order.orderId, customerName);
  const formattedPhone = formatWhatsAppNumber(phone);
  const whatsappUrl = formattedPhone ? `https://wa.me/${formattedPhone}?text=${encodeURIComponent(whatsappMsg)}` : "#";

  return (
    <div className="bg-[#FFFFFF] min-h-screen text-[#1a2c6b] p-3 sm:p-6 transition-all relative">
      <PageHeader
        title={`طلب تفصيل ${order.orderId}`}
        subtitle={`العميل: ${customerName}`}
        actions={
          <Link to="/admin/tailoring" className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#1a2c6b]/20 text-[#1a2c6b] hover:bg-[#1a2c6b]/5 transition-colors rounded-sm text-sm font-medium">
            <ArrowRight className="w-4 h-4 ml-1" /> رجوع لقائمة التفصيل
          </Link>
        }
      />

      {successMsg && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-sm flex items-center gap-2 text-sm font-medium">
          <Check className="w-5 h-5" /> تم حفظ تحديثات طلب التفصيل بنجاح في النظام.
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-4 sm:p-6 space-y-5 bg-white border border-[#1a2c6b]/10 rounded-lg shadow-sm">
            <SectionTitle className="text-[#1a2c6b] font-bold text-base border-b border-[#1a2c6b]/10 pb-2 mb-4">تفاصيل التفصيل</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="الاسم">
                <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} className={inputClass} required />
              </Field>
              <Field label="رقم الواتساب مع مفتاح الدولة">
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="مثال: 250794420606" dir="ltr" required />
              </Field>
              <Field label="نوع الجلابية">
                <input value={type} onChange={(e) => setType(e.target.value)} className={inputClass} />
              </Field>
              <Field label="القماش">
                <input value={fabric} onChange={(e) => setFabric(e.target.value)} className={inputClass} />
              </Field>
              <Field label="اللون">
                <input value={color} onChange={(e) => setColor(e.target.value)} className={inputClass} />
              </Field>
              <Field label="تاريخ التسليم">
                <input type="date" value={delivery} onChange={(e) => setDelivery(e.target.value)} className={inputClass} />
              </Field>
            </div>
            <Field label="المقاسات">
              <input value={measurements} onChange={(e) => setMeasurements(e.target.value)} className={inputClass} />
            </Field>
            <Field label="الملاحظات">
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className={inputClass} />
            </Field>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-4 sm:p-6 bg-white border border-[#1a2c6b]/10 rounded-lg shadow-sm">
            <SectionTitle className="text-[#1a2c6b] font-bold text-base border-b border-[#1a2c6b]/10 pb-2 mb-4">حالة الطلب</SectionTitle>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-[#1a2c6b]/70">الحالة الحالية</span>
              <StatusBadge status={status} map={TAILOR_MAP} />
            </div>
            <Field label="تحديث الحالة">
              <select value={status} onChange={(e) => setStatus(e.target.value)} className={`${inputClass} bg-white cursor-pointer`}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </Card>

          <Card className="p-4 sm:p-6 space-y-3 bg-white border border-[#1a2c6b]/10 rounded-lg shadow-sm">
            <SectionTitle className="text-[#1a2c6b] font-bold text-base border-b border-[#1a2c6b]/10 pb-2 mb-4">المدفوعات</SectionTitle>
            <Field label="إجمالي المبلغ (RWF)">
              <input type="number" value={total} onChange={(e) => setTotal(e.target.value)} className={inputClass} />
            </Field>
            <Field label="المبلغ المدفوع (RWF)">
              <input type="number" value={paid} onChange={(e) => setPaid(e.target.value)} className={inputClass} />
            </Field>
            <div className="flex justify-between text-sm pt-2">
              <span className="text-[#1a2c6b]/70">المتبقي</span>
              <span className={`font-mono font-bold dir-ltr inline-block ${remaining > 0 ? "text-red-600" : "text-green-700"}`}>
                {money(remaining)} RWF
              </span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-[#1a2c6b]/10">
              <span className="text-[#1a2c6b]/70">الإجمالي الصافي</span>
              <span className="font-mono font-bold text-[#1a2c6b] dir-ltr inline-block">{money(totalNum)} RWF</span>
            </div>
          </Card>

          <button 
            type="submit" 
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-[#f28c28] text-white hover:bg-[#e07b1e] transition-colors rounded-sm shadow-sm font-medium text-sm cursor-pointer"
          >
            <Save className="w-4 h-4 ml-1" /> حفظ التحديثات في النظام
          </button>

          <a 
            href={whatsappUrl} 
            target="_blank" 
            rel="noreferrer" 
            onClick={(e) => {
              if (!formatWhatsAppNumber(phone)) {
                e.preventDefault();
                setModal({
                  show: true,
                  title: "رقم الواتساب غير صالح",
                  message: "الرجاء التأكد من صحة رقم هاتف العميل قبل محاولة الإرسال عبر واتساب.",
                  type: "error",
                  onConfirm: null
                });
              }
            }}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-green-600 text-white hover:bg-green-700 transition-colors rounded-sm shadow-sm font-medium text-sm cursor-pointer"
          >
            <WhatsAppIcon className="w-5 h-5" /> إرسال التحديث للعميل عبر واتساب
          </a>

          <button 
            type="button"
            onClick={confirmDelete}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors rounded-sm shadow-sm font-medium text-sm cursor-pointer"
          >
            <Trash2 className="w-4 h-4 ml-1" /> حذف طلب التفصيل
          </button>
        </div>
      </form>

      {/* النافذة المنبثقة المخصصة (Custom Modal Popup) */}
      {modal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 border border-[#1a2c6b]/10 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4 border-b border-[#1a2c6b]/10 pb-3">
              <div className="flex items-center gap-2">
                {modal.type === "confirm" ? (
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                ) : (
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                )}
                <h3 className="text-base font-bold text-[#1a2c6b]">{modal.title}</h3>
              </div>
              <button 
                onClick={() => setModal({ ...modal, show: false })}
                className="text-[#1a2c6b]/50 hover:text-[#1a2c6b] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-[#1a2c6b]/80 mb-6 leading-relaxed">
              {modal.message}
            </p>

            <div className="flex items-center justify-end gap-3">
              {modal.type === "confirm" ? (
                <>
                  <button
                    type="button"
                    onClick={() => setModal({ ...modal, show: false })}
                    className="px-4 py-2 text-sm font-medium text-[#1a2c6b] bg-gray-100 hover:bg-gray-200 rounded-sm transition-colors cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setModal({ ...modal, show: false });
                      if (modal.onConfirm) modal.onConfirm();
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-sm transition-colors cursor-pointer"
                  >
                    نعم، احذف
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setModal({ ...modal, show: false })}
                  className="px-5 py-2 text-sm font-medium text-white bg-[#1a2c6b] hover:bg-[#152352] rounded-sm transition-colors cursor-pointer"
                >
                  حسناً
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}