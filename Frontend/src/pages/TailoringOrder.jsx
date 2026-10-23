import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Send } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import { inputClass, Field } from "@/components/admin/ui";
import { CATEGORIES } from "@/components/site/constants";

const FABRICS = ["بوليستر", "قطن هندي", "قطن انجليزي", "كتان", "خليط قطن بوليستر"];
const COLORS = ["أسود", "بني", "كحلي", "زيتي", "لبني", "أخضر", "مزركش", "وردي", "أحمر", "أبيض", "أزرق", "سماوي"];

export default function TailoringOrder() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    type: "جلابية سودانية",
    color: "أبيض",
    fabric: "قطن مصري",
    chest: "",
    length: "",
    sleeve: "",
    shoulder: "",
    notes: "",
    delivery: "",
    total: 0, // يمكنك تعيين سعر افتراضي للتفصيل أو جعله ديناميكياً
    paid: 0,
  });

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  // دالة إتمام وحفظ الطلب وإرسال رسالة الواتساب
  const handleTailoringCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      // 1. إرسال الطلب للـ Backend لحفظه تلقائياً
      const response = await fetch("/api/tailoring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: form.name,
            phone: form.phone,
          },
          type: form.type,
          fabric: form.fabric,
          color: form.color,
          measurements: {
            chest: form.chest,
            length: form.length,
            sleeve: form.sleeve,
            shoulder: form.shoulder,
          },
          notes: form.notes,
          delivery: form.delivery || new Date().toISOString().split("T")[0],
          total: Number(form.total) || 0,
          paid: Number(form.paid) || 0,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "حدث خطأ ما أثناء الحفظ");

      if (data.success) {
        const newOrder = data.data;

        // 2. تجهيز رسالة الواتساب ليرسلها العميل لمتجرك
        const message = `مرحباً، أرغب في تأكيد طلب تفصيل جديد:
      📦 *رقم الطلب:* ${newOrder.orderId}
      👤 *الاسم:* ${newOrder.customer.name}
      📱 *الهاتف:* ${newOrder.customer.phone}
      👔 *نوع الجلابية:* ${newOrder.type}
      🧶 *القماش:* ${newOrder.fabric}
      🎨 *اللون:* ${newOrder.color}
      📏 *المقاسات:* (طول اليد: ${form.chest || '-'}، طول: ${form.length || '-'}، كم: ${form.sleeve || '-'}، كتف: ${form.shoulder || '-'})
      📝 *ملاحظات:* ${form.notes || 'لا يوجد'}
      📅 *تاريخ التسليم:* ${newOrder.delivery}
      📍 يرجى اعتماد الطلب وشكراً!`;

        const storeWhatsAppNumber = "250794420606";
        const whatsappUrl = `https://wa.me/${storeWhatsAppNumber}?text=${encodeURIComponent(message)}`;

        // فتح واتساب في نافذة جديدة
        window.open(whatsappUrl, "_blank");

        // 3. الانتقال لصفحة تأكيد الطلب
        navigate("/order-confirmation", {
          state: {
            order: newOrder.orderId,
            type: "تفصيل",
          },
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(error.message || "حدث خطأ أثناء إتمام الطلب");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHero
        title="طلب التفصيل"
        subtitle="صمّم جلابيتك بطريقتك — اختر النوع والقماش واللون وأرسل مقاساتك وملاحظاتك."
        crumb="طلب التفصيل"
      />
      <section className="py-12 lg:py-16 bg-[#FFFFFF] rtl text-right">
        <div className="max-w-3xl mx-auto px-5 lg:px-8">
          <form
            onSubmit={handleTailoringCheckout}
            className="bg-[#FFFFFF] border border-[#1a2c6b]/10 p-6 lg:p-8 space-y-6 rounded-lg shadow-sm"
          >
            {/* رسالة الخطأ إن وجدت */}
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded text-sm">
                {errorMessage}
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="الاسم الكامل">
                <input
                  required
                  value={form.name}
                  onChange={set("name")}
                  className={`${inputClass} border-[#1a2c6b]/15 text-[#1a2c6b] focus:border-[#f28c28] rounded-sm`}
                  placeholder="مثال: أحمد عبدالله"
                />
              </Field>
              <Field label="رقم الهاتف">
                <input
                  required
                  value={form.phone}
                  onChange={set("phone")}
                  className={`${inputClass} border-[#1a2c6b]/15 text-[#1a2c6b] focus:border-[#f28c28] rounded-sm`}
                  placeholder="09xxxxxxxx"
                />
              </Field>
            </div>

            <div className="grid sm:grid-cols-3 gap-5">
              <Field label="نوع الجلابية">
                <select
                  value={form.type}
                  onChange={set("type")}
                  className={`${inputClass} border-[#1a2c6b]/15 text-[#1a2c6b] focus:border-[#f28c28] rounded-sm`}
                >
                  {CATEGORIES.slice(0, 5).map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="اللون">
                <select
                  value={form.color}
                  onChange={set("color")}
                  className={`${inputClass} border-[#1a2c6b]/15 text-[#1a2c6b] focus:border-[#f28c28] rounded-sm`}
                >
                  {COLORS.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="نوع القماش">
                <select
                  value={form.fabric}
                  onChange={set("fabric")}
                  className={`${inputClass} border-[#1a2c6b]/15 text-[#1a2c6b] focus:border-[#f28c28] rounded-sm`}
                >
                  {FABRICS.map((f) => (
                    <option key={f}>{f}</option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="pt-2">
              <p className="text-sm font-medium text-[#1a2c6b]/80 mb-3">المقاسات (سم)</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Field label="طول اليد">
                  <input
                    value={form.chest}
                    onChange={set("chest")}
                    className={`${inputClass} border-[#1a2c6b]/15 text-[#1a2c6b] focus:border-[#f28c28] rounded-sm`}
                    placeholder="50"
                  />
                </Field>
                <Field label="الطول">
                  <input
                    value={form.length}
                    onChange={set("length")}
                    className={`${inputClass} border-[#1a2c6b]/15 text-[#1a2c6b] focus:border-[#f28c28] rounded-sm`}
                    placeholder="140"
                  />
                </Field>
                <Field label="الكم">
                  <input
                    value={form.sleeve}
                    onChange={set("sleeve")}
                    className={`${inputClass} border-[#1a2c6b]/15 text-[#1a2c6b] focus:border-[#f28c28] rounded-sm`}
                    placeholder="60"
                  />
                </Field>
                <Field label="الكتف">
                  <input
                    value={form.shoulder}
                    onChange={set("shoulder")}
                    className={`${inputClass} border-[#1a2c6b]/15 text-[#1a2c6b] focus:border-[#f28c28] rounded-sm`}
                    placeholder="18"
                  />
                </Field>
              </div>
            </div>

            <Field label="ملاحظات إضافية">
              <textarea
                value={form.notes}
                onChange={set("notes")}
                rows={3}
                className={`${inputClass} border-[#1a2c6b]/15 text-[#1a2c6b] focus:border-[#f28c28] rounded-sm`}
                placeholder="أي تفاصيل خاصة عن الياقة، التطريز، أو القصّة..."
              />
            </Field>

            <Field label="تاريخ التسليم المطلوب">
              <input
                type="date"
                value={form.delivery}
                onChange={set("delivery")}
                className={`${inputClass} border-[#1a2c6b]/15 text-[#1a2c6b] focus:border-[#f28c28] rounded-sm`}
              />
            </Field>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 py-4 bg-[#1a2c6b] text-[#FFFFFF] hover:bg-[#2a3fae] transition-colors rounded-sm font-medium shadow-sm disabled:opacity-50"
            >
              <Send className="w-4 h-4 text-[#f28c28]" />
              {loading ? "جاري حفظ الطلب والتحويل..." : "إرسال طلب التفصيل عبر الواتساب والحفظ"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}