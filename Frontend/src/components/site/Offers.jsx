import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";
import { ArrowLeft, Clock, ImageIcon } from "lucide-react";
import Reveal from "./Reveal";

const API_URL = import.meta.env.VITE_API_URL || "https://your-backend.onrender.com";

function OfferCard({ o }) {
  const prod = o.product || {};
  const prodImg = (Array.isArray(prod.images) && prod.images.length > 0) ? prod.images[0] : (prod.image || o.image);
  const prodName = prod.name || o.name;
  const originalPrice = prod.price;
  
  // التحقق من وجود قيمة الخصم أو العرض
  let discountValue = o.value || o.discount;
  let newPrice = originalPrice;
  let hasDiscount = false;

  if (originalPrice && discountValue !== undefined && discountValue !== null && discountValue !== "") {
    const numVal = parseFloat(discountValue);
    if (!isNaN(numVal) && numVal > 0) {
      hasDiscount = true;
      if (o.type === "نسبة مئوية" || String(discountValue).includes("%")) {
        newPrice = originalPrice - (originalPrice * numVal) / 100;
      } else {
        newPrice = originalPrice - numVal;
      }
    }
  }

  return (
    <div className="group flex flex-col bg-[#FFFFFF] border border-[#1a2c6b]/10 hover:border-[#f28c28] transition-colors rounded-lg overflow-hidden shadow-sm">
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 flex items-center justify-center">
        {prodImg ? (
          <Image
            src={prodImg}
            alt={prodName}
            className="w-full h-full object-cover transition-transform duration-[1.1s] ease-out group-hover:scale-105"
            fittingType="fill"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-[#1a2c6b]/30 gap-1">
            <ImageIcon className="w-10 h-10" />
            <span className="text-xs font-medium">لا توجد صورة</span>
          </div>
        )}
        {hasDiscount && (
          <span className="absolute top-3 right-3 bg-[#f28c28] text-[#FFFFFF] px-2.5 py-1 font-mono text-xs font-semibold rounded-sm shadow-xs">
            {String(discountValue).startsWith("-") ? discountValue : `-${discountValue}`}
          </span>
        )}
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <h3 className="font-heading text-base sm:text-lg font-bold text-[#1a2c6b] mb-2 line-clamp-1">
          {prodName}
        </h3>

        {originalPrice && (
          <div className="flex items-baseline gap-2.5 mb-3 dir-ltr justify-end">
            <span className="text-xs text-[#1a2c6b]/60">RWF</span>
            <span className="font-mono text-lg sm:text-xl font-semibold text-[#1a2c6b]">
              {(hasDiscount ? newPrice : originalPrice).toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="font-mono text-xs text-[#1a2c6b]/40 line-through">
                {originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        )}

        {o.end && (
          <div className="flex items-center gap-1.5 text-xs text-[#1a2c6b]/70 mb-4 mt-auto">
            <span>ينتهي في: {o.end}</span>
            <Clock className="w-3.5 h-3.5 text-[#2a3fae]" />
          </div>
        )}

        <Link
          to={`/products/${prod._id || ""}`}
          className="inline-flex items-center justify-center gap-1.5 py-2.5 text-xs sm:text-sm bg-[#1a2c6b] text-[#FFFFFF] hover:bg-[#f28c28] transition-colors rounded-sm font-medium"
        >
          عرض المنتج <ArrowLeft className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/offers`);
        const data = await res.json();
        if (res.ok && data.success) {
          setOffers(data.data || []);
        }
      } catch (err) {
        console.error("Error fetching offers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  return (
    <section className="py-16 lg:py-24 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-10">
          <span className="text-[#f28c28] text-xs tracking-[0.35em] uppercase font-mono">
            ON SALE
          </span>
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-[#1a2c6b] mt-3">
            عروضنا
          </h2>
          <div className="w-16 h-px bg-[#f28c28] mx-auto mt-4" />
        </Reveal>

        {loading ? (
          <div className="text-center py-12 text-[#1a2c6b]/60">جاري تحميل العروض...</div>
        ) : offers.length === 0 ? (
          <div className="text-center py-12 text-[#1a2c6b]/60">لا توجد عروض متاحة حالياً.</div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {offers.map((o, i) => (
              <Reveal key={o._id || i} delay={i * 0.08}>
                <OfferCard o={o} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}