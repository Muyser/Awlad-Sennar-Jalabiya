import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, AlertCircle, Trash2, X } from "lucide-react";
import { Card, PageHeader, StatusBadge, SectionTitle } from "@/components/admin/ui";
import { money } from "@/lib/mockData";
import { WhatsAppIcon } from "@/components/site/Icons";

const API_URL = import.meta.env.VITE_API_URL;
const TIMELINE = ["جديد", "تم التأكيد", "قيد التجهيز", "جاهز", "تم التسليم"];

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

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // حالات الرسائل والتأكيد للحذف
  const [feedback, setFeedback] = useState({ type: "", text: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const token = getAuthToken();

        const response = await fetch(`${API_URL}/api/orders-management/${id}`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        const data = await response.json();
        if (response.ok && data.success) {
          setOrder(data.data);
        } else {
          setFeedback({ type: "error", text: data.message || "الطلب غير موجود" });
        }
      } catch (err) {
        console.error("Error fetching order detail:", err);
        setFeedback({ type: "error", text: "حدث خطأ أثناء جلب تفاصيل الطلب" });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      setFeedback({ type: "", text: "" });
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/api/orders-management/${order._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "حدث خطأ أثناء تحديث الحالة");
      }

      if (data.success) {
        setOrder(data.data);
        setFeedback({ 
          type: "success", 
          text: "تم تحديث الحالة بنجاح (وخصم المخزون إذا تم التأكيد)" 
        });
      }
    } catch (err) {
      setFeedback({ type: "error", text: err.message || "حدث خطأ أثناء تحديث الحالة" });
    }
  };

  // دالة تنفيذ الحذف الفعلي بعد التأكيد من الـ Modal
  const handleDeleteOrder = async () => {
    try {
      setDeleting(true);
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/api/orders-management/${order._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "فشل حذف الطلب");
      }

      // الانتقال لصفحة الطلبات بعد الحذف بنجاح
      navigate("/admin/orders");
    } catch (err) {
      setDeleting(false);
      setShowDeleteModal(false);
      setFeedback({ type: "error", text: err.message || "حدث خطأ أثناء حذف الطلب" });
    }
  };

  if (loading) return <div className="p-8 text-center text-[#1a2c6b]">جاري التحميل...</div>;
  if (!order) return <div className="p-8 text-center text-red-600">الطلب غير موجود</div>;

  const currentIdx = TIMELINE.indexOf(order.status);

  const getWhatsAppMessageForCustomer = (status, orderNum, customerName) => {
    switch (status) {
      case "تم التأكيد":
        return `مرحباً ${customerName}، نود إعلامك بأنه قد تم *تأكيد* طلبك رقم (${orderNum}) من أولاد سنار جلابية، ونعمل على تجهيزه الآن. شكراً لتسوقك معنا!`;
      case "قيد التجهيز":
        return `مرحباً ${customerName}، طلبك رقم (${orderNum}) الآن *قيد التجهيز* والتغليف في متجر أولاد سنار جلابية.`;
      case "جاهز":
        return `عزيزي العميل ${customerName}، طلبك رقم (${orderNum}) أصبح *جاهزاً* للتسليم/الشحن!`;
      case "تم التسليم":
        return `مرحباً ${customerName}، شكراً لك لاستلام طلبك رقم (${orderNum}). نتمنى أن تنال منتجات أولاد سنار جلابية إعجابك!`;
      default:
        return `مرحباً ${customerName}، بخصوص طلبك رقم (${orderNum}) من أولاد سنار جلابية.`;
    }
  };

  const customerPhone = order.customer?.phone || "";
  const dynamicWaMsg = getWhatsAppMessageForCustomer(order.status, order.orderNumber, order.customer?.name);
  const clientWaUrl = `https://wa.me/${customerPhone}?text=${encodeURIComponent(dynamicWaMsg)}`;

  return (
    <div className="bg-[#FFFFFF] min-h-screen text-[#1a2c6b] p-3 sm:p-6 transition-all relative">
      <PageHeader
        title={`طلب ${order.orderNumber}`}
        subtitle={`العميل: ${order.customer?.name}`}
        actions={
          <div className="flex items-center gap-2">
            {/* زر الحذف الذي يفتح الـ Modal */}
            <button
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white transition-colors rounded-sm text-sm font-medium shadow-sm cursor-pointer"
            >
              <Trash2 className="w-4 h-4" /> حذف الطلب
            </button>
            <Link to="/admin/orders" className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#1a2c6b]/20 text-[#1a2c6b] hover:bg-[#1a2c6b]/5 transition-colors rounded-sm text-sm font-medium">
              <ArrowRight className="w-4 h-4" /> رجوع للطلبات
            </Link>
          </div>
        }
      />

      {/* صندوق التنبيهات الداخلية */}
      {feedback.text && (
        <div className={`mb-6 p-4 rounded-sm flex items-center gap-3 text-sm border ${
          feedback.type === "success" 
            ? "bg-green-50 border-green-200 text-green-800" 
            : "bg-red-50 border-red-200 text-red-800"
        }`}>
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 bg-white border border-[#1a2c6b]/10 rounded-lg shadow-sm">
            <SectionTitle className="text-[#1a2c6b] font-bold text-base border-b border-[#1a2c6b]/10 pb-2 mb-4">المنتجات المطلوبة</SectionTitle>
            <div className="space-y-3">
              {order.items?.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-[#1a2c6b]/10">
                  <span className="text-sm font-medium text-[#1a2c6b]">{item.name} (الكمية: {item.qty})</span>
                  <span className="font-mono text-sm text-[#1a2c6b]/80 font-semibold dir-ltr inline-block">{money(item.price * item.qty)} RWF</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-4 text-sm mt-2">
              <span className="text-[#1a2c6b]/70">الإجمالي</span>
              <span className="font-mono font-bold text-[#1a2c6b] dir-ltr inline-block">{money(order.total)} RWF</span>
            </div>
            <div className="flex justify-between text-sm pt-2">
              <span className="text-[#1a2c6b]/70">الخصم</span>
              <span className="font-mono text-[#f28c28] dir-ltr inline-block">{order.discount ? money(order.discount) : "-"} RWF</span>
            </div>
          </Card>

          <Card className="p-6 bg-white border border-[#1a2c6b]/10 rounded-lg shadow-sm">
            <SectionTitle className="text-[#1a2c6b] font-bold text-base border-b border-[#1a2c6b]/10 pb-2 mb-3">حالة الطلب (اضغط للتحديث وخصم المخزون)</SectionTitle>
            <div className="space-y-2 pt-2">
              {TIMELINE.map((s, i) => {
                const isActive = i <= currentIdx;
                const isCurrent = order.status === s;
                return (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-sm transition-colors border text-right cursor-pointer ${
                      isCurrent 
                        ? "bg-[#1a2c6b]/10 border-[#1a2c6b]/30 font-bold" 
                        : "bg-white border-[#1a2c6b]/10 hover:bg-[#1a2c6b]/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${isActive ? "bg-[#f28c28]" : "bg-[#1a2c6b]/20"}`} />
                      <span className={isActive ? "text-[#1a2c6b] text-sm font-medium" : "text-[#1a2c6b]/40 text-sm"}>{s}</span>
                    </div>
                    {isCurrent && <CheckCircle2 className="w-4 h-4 text-[#f28c28]" />}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 bg-white border border-[#1a2c6b]/10 rounded-lg shadow-sm">
            <SectionTitle className="text-[#1a2c6b] font-bold text-base border-b border-[#1a2c6b]/10 pb-2 mb-3">معلومات العميل</SectionTitle>
            <p className="text-sm font-bold text-[#1a2c6b]">{order.customer?.name}</p>
            <p className="text-sm text-[#1a2c6b]/70 font-mono mt-1" dir="ltr">{order.customer?.phone}</p>
          </Card>

          <Card className="p-6 space-y-3 bg-white border border-[#1a2c6b]/10 rounded-lg shadow-sm">
            <div className="flex justify-between text-sm">
              <span className="text-[#1a2c6b]/70">المدفوع</span>
              <span className="font-mono text-green-700 font-bold dir-ltr inline-block">{money(order.paid)} RWF</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#1a2c6b]/70">المتبقي</span>
              <span className={`font-mono font-bold dir-ltr inline-block ${order.remaining > 0 ? "text-red-600" : "text-green-700"}`}>
                {money(order.remaining)} RWF
              </span>
            </div>
            <div className="flex justify-between text-sm items-center pt-3 border-t border-[#1a2c6b]/10">
              <span className="text-[#1a2c6b]/70">الحالة العامة</span>
              <StatusBadge status={order.status} />
            </div>
          </Card>

          <a 
            href={clientWaUrl} 
            target="_blank" 
            rel="noreferrer" 
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-[#f28c28] text-white hover:bg-[#e07b1e] transition-colors rounded-sm shadow-sm font-medium text-sm cursor-pointer"
          >
            <WhatsAppIcon className="w-5 h-5" /> إرسال تحديث الحالة للعميل عبر واتساب
          </a>
        </div>
      </div>

      {/* نافذة التأكيد المنبثقة (Delete Confirmation Modal) */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-right relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setShowDeleteModal(false)}
              className="absolute left-4 top-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-[#1a2c6b]">تأكيد حذف الطلب</h3>
            </div>
            <p className="text-sm text-[#1a2c6b]/70 mb-6">
              هل أنت متأكد من رغبتك في حذف الطلب رقم <span className="font-bold font-mono text-[#1a2c6b]">({order.orderNumber})</span>؟ لا يمكن التراجع عن هذا الإجراء بعد تنفيذه.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-[#1a2c6b]/20 text-[#1a2c6b] hover:bg-[#1a2c6b]/5 rounded-sm text-sm font-medium transition-colors cursor-pointer"
                disabled={deleting}
              >
                إلغاء
              </button>
              <button
                onClick={handleDeleteOrder}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-sm text-sm font-medium transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                disabled={deleting}
              >
                {deleting ? "جاري الحذف..." : "نعم، احذف الطلب"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}