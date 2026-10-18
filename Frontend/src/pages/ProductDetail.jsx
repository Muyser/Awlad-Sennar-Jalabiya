import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Image } from "@/components/ui/image";
import { Minus, Plus, Check, CheckCircle2, X } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import { WhatsAppIcon } from "@/components/site/Icons";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [activeOffer, setActiveOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);

  // حالات خاصة بنموذج الطلب السريع (الاسم ورقم الهاتف)
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // حالة النافذة المنبثقة للنجاح والروابط
  const [successModal, setSuccessModal] = useState({
    show: false,
    whatsappUrl: "",
    orderNumber: "",
  });

  useEffect(() => {
    const fetchProductDetailsAndOffers = async () => {
      try {
        setLoading(true);
        const [prodRes, offersRes] = await Promise.all([
          fetch(`/api/products/${id}`),
          fetch(`/api/offers`),
        ]);

        const prodData = await prodRes.json();
        const offersData = await offersRes.json();

        if (prodRes.ok && prodData.success) {
          const currentProd = prodData.data;
          setProduct(currentProd);
          if (currentProd.colors && currentProd.colors.length > 0) setColor(currentProd.colors[0]);
          if (currentProd.sizes && currentProd.sizes.length > 0) setSize(currentProd.sizes[0]);

          // البحث عن العرض النشط المرتبط بهذا المنتج
          if (offersRes.ok && offersData.success && Array.isArray(offersData.data)) {
            const foundOffer = offersData.data.find(
              (o) =>
                (o.product && (o.product._id === currentProd._id || o.product === currentProd._id)) ||
                o.productId === currentProd._id
            );
            if (foundOffer) {
              setActiveOffer(foundOffer);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching product details or offers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetailsAndOffers();
  }, [id]);

  // حساب السعر الفعلي بعد العرض (إن وجد)
  const originalPrice = product ? product.price || 0 : 0;
  let activePrice = originalPrice;
  let hasDiscount = false;

  if (product && activeOffer) {
    const discountVal = activeOffer.value || activeOffer.discount;
    if (discountVal !== undefined && discountVal !== null && discountVal !== "") {
      const numVal = parseFloat(discountVal);
      if (!isNaN(numVal) && numVal > 0) {
        hasDiscount = true;
        if (activeOffer.type === "نسبة مئوية" || String(discountVal).includes("%")) {
          activePrice = originalPrice - (originalPrice * numVal) / 100;
        } else {
          activePrice = originalPrice - numVal;
        }
      }
    }
  } else if (product) {
    // التحقق من وجود خصم مباشر في موديل المنتج نفسه
    activePrice = product.salePrice || product.discountPrice || product.price || 0;
    if (product.oldPrice && product.oldPrice > activePrice) {
      hasDiscount = true;
    }
  }

  // دالة إتمام الطلب وإرساله للـ Backend ثم فتح النافذة المنبثقة للواتساب
  const handleStoreCheckout = async (e) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      alert("الرجاء إدخال الاسم ورقم الهاتف لإتمام الطلب");
      return;
    }

    const itemDetails = [];
    if (color) itemDetails.push(`اللون: ${color}`);
    if (size) itemDetails.push(`المقاس: ${size}`);
    const variantString = itemDetails.length > 0 ? ` (${itemDetails.join(" - ")})` : "";

    const payload = {
      customer: {
        name: customerName,
        phone: customerPhone,
      },
      items: [
        {
          id: product._id || product.id,
          name: `${product.name}${variantString}`,
          price: activePrice,
          qty: qty,
        },
      ],
      total: activePrice * qty,
      discount: hasDiscount ? (originalPrice - activePrice) * qty : 0,
      paid: 0,
    };

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/orders-management", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const newOrder = data.data || {};
        const itemsToMap = newOrder.items || payload.items;

        const itemsList = itemsToMap
          .map((item) => `• ${item.name} (الكمية: ${item.qty}) - ${(item.price * item.qty).toLocaleString()} RWF`)
          .join("\n");

        const message = `مرحباً، أرغب في تأكيد طلبي الجديد من متجر أولاد سنار جلابية:
📦 *رقم الطلب:* ${newOrder.orderNumber || "جديد"}
👤 *الاسم:* ${newOrder.customer?.name || customerName}
📱 *الهاتف:* ${newOrder.customer?.phone || customerPhone}

*المنتجات المطلوبة:*
${itemsList}

💰 *الإجمالي الكلي:* ${(newOrder.total || payload.total).toLocaleString()} RWF
📍 يرجى تأكيد الطلب وشكراً!`;

        const storeWhatsAppNumber = "250794420606";
        const whatsappUrl = `https://wa.me/${storeWhatsAppNumber}?text=${encodeURIComponent(message)}`;

        window.open(whatsappUrl, "_blank");
        
        setSuccessModal({
          show: true,
          whatsappUrl: whatsappUrl,
          orderNumber: newOrder.orderNumber || "جديد",
        });

      } else {
        alert(data.message || data.error || "حدث خطأ أثناء حفظ الطلب في النظام");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("حدث خطأ أثناء إتمام الطلب، تأكد من الاتصال بالشبكة أو بيانات السيرفر");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="py-28 text-center text-[#1a2c6b]/60">جاري تحميل تفاصيل المنتج...</div>;
  }

  if (!product) {
    return (
      <div className="py-28 text-center">
        <p className="text-lg text-[#1a2c6b] mb-4">المنتج غير موجود</p>
        <Link to="/products" className="text-sm text-[#f28c28] hover:underline">العودة إلى قائمة المنتجات</Link>
      </div>
    );
  }

  const imagesList = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <>
      <PageHero title={product.name} crumb={product.category} />
      <section className="py-12 lg:py-16 rtl text-right">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 grid lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Gallery */}
          <div>
            <div className="aspect-[3/4] overflow-hidden bg-white border border-[#1a2c6b]/15 rounded-2xl shadow-sm">
              <Image src={imagesList[active] || imagesList[0]} alt={product.name} className="w-full h-full object-cover" fittingType="fill" />
            </div>
            {imagesList.length > 0 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {imagesList.map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActive(i)} 
                    className={`w-20 h-24 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all ${active === i ? "border-[#f28c28] shadow-md" : "border-[#1a2c6b]/15 opacity-70 hover:opacity-100"}`}
                  >
                    <Image src={img} alt="" className="w-full h-full object-cover" fittingType="fill" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <span className="text-xs text-[#1a2c6b]/60 font-medium">{product.category}</span>
            <h1 className="font-heading text-3xl lg:text-4xl font-bold text-[#1a2c6b] mt-1 mb-3">{product.name}</h1>
            
            {/* Price Display */}
            <div className="flex items-baseline gap-2.5 mb-6 dir-ltr justify-end">
              <span className="text-sm text-[#1a2c6b]/60">RWF</span>
              <span className="font-mono text-3xl font-semibold text-[#1a2c6b]">
                {activePrice.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="font-mono text-base text-[#1a2c6b]/40 line-through">
                  {originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 mb-6">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${product.available ? "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20" : "bg-red-500/10 text-red-600 border border-red-500/20"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${product.available ? "bg-emerald-600" : "bg-red-600"}`} />
                {product.available ? "متوفر" : "غير متوفر"}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#1a2c6b] text-[#f28c28]">{product.type}</span>
            </div>

            <p className="text-[#1a2c6b]/80 leading-relaxed mb-7">{product.description}</p>

            <div className="mb-5">
              <span className="block text-sm font-medium text-[#1a2c6b] mb-2">
                اللون المختار: {color}
              </span>

              {/* أزرار الخيارات للون */}
              <div className="flex flex-wrap gap-2 mb-3">
                {product.colors && product.colors.map((c, i) => {
                  const bgHex = product.colorHex && product.colorHex[i] ? product.colorHex[i] : c;
                  const isSelected = color === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all ${
                        isSelected
                          ? "border-[#f28c28] bg-[#f28c28]/10 text-[#f28c28] ring-1 ring-[#f28c28]"
                          : "border-[#1a2c6b]/20 bg-white text-[#1a2c6b] hover:border-[#1a2c6b]/40"
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-black/10 inline-block shrink-0"
                        style={{ backgroundColor: bgHex }}
                      />
                      <span>{c}</span>
                    </button>
                  );
                })}
              </div>

              {/* حقل إدخال لكتابة لون مخصص */}
              <div>
                <label className="block text-xs text-[#1a2c6b]/70 mb-1">
                  أو اكتب اللون الذي تريده بنفسك:
                </label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="مثال: أبيض، كحلي، بني دافئ..."
                  className="w-full px-3 py-2 text-sm bg-white border border-[#1a2c6b]/20 rounded-xl focus:outline-none focus:border-[#f28c28]"
                />
              </div>
            </div>

            <div className="mb-6">
              <span className="block text-sm font-medium text-[#1a2c6b] mb-2">المقاس: {size}</span>
              <div className="flex flex-wrap gap-2">
                {product.sizes && product.sizes.map((s) => (
                  <button key={s} onClick={() => setSize(s)} className={`min-w-12 px-3 py-2 text-sm rounded-xl border font-medium transition-all ${size === s ? "bg-[#1a2c6b] text-white border-[#1a2c6b] shadow-sm" : "border-[#1a2c6b]/20 text-[#1a2c6b]/80 hover:border-[#1a2c6b]"}`}>{s}</button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <span className="block text-sm font-medium text-[#1a2c6b] mb-2">الكمية</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-[#1a2c6b]/20 rounded-xl overflow-hidden bg-white shadow-sm">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-2.5 hover:bg-[#1a2c6b]/5 text-[#1a2c6b] transition-colors"><Minus className="w-4 h-4" /></button>
                  <span className="px-5 font-mono text-[#1a2c6b] font-medium">{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)} className="p-2.5 hover:bg-[#1a2c6b]/5 text-[#1a2c6b] transition-colors"><Plus className="w-4 h-4" /></button>
                </div>
                <span className="text-sm text-[#1a2c6b]/60 font-medium">المخزون: {product.stock}</span>
              </div>
            </div>

            {/* نموذج إدخال بيانات العميل للطلب السريع */}
            <form onSubmit={handleStoreCheckout} className="space-y-4 mb-6 p-4 bg-[#1a2c6b]/5 rounded-2xl border border-[#1a2c6b]/10">
              <h3 className="text-sm font-bold text-[#1a2c6b]">بيانات إتمام الطلب السريع:</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#1a2c6b]/70 mb-1">الاسم الكامل</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="ادخل اسمك هنا"
                    className="w-full px-3 py-2.5 text-sm bg-white border border-[#1a2c6b]/20 rounded-xl focus:outline-none focus:border-[#f28c28]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#1a2c6b]/70 mb-1">رقم الهاتف مع مفتاح الدولة</label>
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="مثال: 250780000000"
                    className="w-full px-3 py-2.5 text-sm bg-white border border-[#1a2c6b]/20 rounded-xl focus:outline-none focus:border-[#f28c28] text-right"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#f28c28] text-white hover:bg-[#f28c28]/90 transition-colors shadow-md font-medium disabled:opacity-50"
                >
                  <WhatsAppIcon className="w-5 h-5" /> {isSubmitting ? "جاري إرسال الطلب..." : "اطلب عبر واتساب"}
                </button>
                <Link
                  to="/tailoring-order"
                  className="flex-1 inline-flex items-center justify-center py-4 px-6 text-sm border border-[#1a2c6b] text-[#1a2c6b] hover:bg-[#1a2c6b] hover:text-white transition-all rounded-xl font-medium shadow-sm text-center"
                >
                  اطلب التفصيل
                </Link>
              </div>
            </form>

            <p className="text-xs text-[#1a2c6b]/50 mt-4">لا يوجد دفع إلكتروني — يتم حفظ طلبك في النظام وتأكيده عبر واتساب.</p>
          </div>
        </div>
      </section>

      {/* Success Popup Modal */}
      {successModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-right relative border border-[#1a2c6b]/10">
            <button 
              onClick={() => setSuccessModal({ show: false, whatsappUrl: "", orderNumber: "" })}
              className="absolute left-4 top-4 text-[#1a2c6b]/40 hover:text-[#1a2c6b] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-4 text-emerald-600 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#1a2c6b] mb-1">تم حفظ طلبك بنجاح!</h3>
              <p className="text-xs font-mono text-[#f28c28] font-bold mb-3">رقم الطلب: {successModal.orderNumber}</p>
              <p className="text-sm text-[#1a2c6b]/70 leading-relaxed">
                تم حفظ طلبك في النظام بنجاح، وجاري تحويلك إلى واتساب لإرسال تفاصيل الطلب للمتجر.
              </p>
            </div>

            <div className="space-y-3">
              <a
                href={successModal.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-sm transition-colors shadow-sm"
              >
                <WhatsAppIcon className="w-5 h-5" /> فتح واتساب يدوياً (إذا لم يفتح تلقائياً)
              </a>
              <button
                onClick={() => setSuccessModal({ show: false, whatsappUrl: "", orderNumber: "" })}
                className="w-full py-3 border border-[#1a2c6b]/20 text-[#1a2c6b] hover:bg-[#1a2c6b]/5 rounded-xl font-medium text-sm transition-colors"
              >
                إغلاق والعودة للمتجر
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}