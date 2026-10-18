import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";
import { ArrowLeft, ImageIcon } from "lucide-react";
import { waLink } from "./constants";
import { WhatsAppIcon } from "./Icons";
import Reveal from "./Reveal";

function ProductCard({ p }) {
  // استخدام العنصر الأول من مصفوفة images أو دعم أي حقل بديل إن وجد
  const prodImg = p.images?.[0] || p.img || p.image || p.imageUrl;
  const prodColors = p.colors || [];
  const prodSizes = p.sizes || [];
  const isAvailable = p.available !== false && p.stock !== 0;

  return (
    <div className="group flex flex-col bg-white border border-[#1a2c6b]/15 hover:border-[#f28c28] transition-all rounded-2xl overflow-hidden shadow-sm">
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 flex items-center justify-center">
        {prodImg ? (
          <Image
            src={prodImg}
            alt={p.name}
            className="w-full h-full object-cover transition-transform duration-[1.1s] ease-out group-hover:scale-105"
            fittingType="fill"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-[#1a2c6b]/30 gap-1">
            <ImageIcon className="w-10 h-10" />
            <span className="text-xs font-medium">لا توجد صورة</span>
          </div>
        )}

        {p.badge && (
          <span
            className={`absolute top-2 right-2 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-mono tracking-wide rounded-lg shadow-sm ${
              p.badge === "عرض" ? "bg-[#f28c28] text-white" : "bg-[#1a2c6b] text-white"
            }`}
          >
            {p.badge}
          </span>
        )}
        <span
          className={`absolute top-2 left-2 px-2.5 py-0.5 text-[10px] sm:text-[11px] rounded-lg shadow-sm ${
            isAvailable ? "bg-emerald-600 text-white" : "bg-[#1a2c6b]/70 text-white/80"
          }`}
        >
          {isAvailable ? "متوفر" : "غير متوفر"}
        </span>
      </div>

      <div className="p-3 sm:p-5 flex flex-col flex-1 text-right">
        <h3 className="font-heading text-sm sm:text-lg font-bold text-[#1a2c6b] mb-1.5 line-clamp-1">{p.name}</h3>

        {prodColors.length > 0 && (
          <div className="flex items-center gap-1 mb-2 flex-wrap">
            {prodColors.map((c, idx) => (
              c.startsWith("#") ? (
                <span
                  key={idx}
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border border-[#1a2c6b]/20 shadow-xs"
                  style={{ backgroundColor: c }}
                />
              ) : (
                <span
                  key={idx}
                  className="px-1.5 py-0.5 text-[10px] sm:text-[11px] text-[#1a2c6b] bg-[#1a2c6b]/5 border border-[#1a2c6b]/15 rounded-md"
                >
                  {c}
                </span>
              )
            ))}
          </div>
        )}

        {prodSizes.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {prodSizes.map((s) => (
              <span
                key={s}
                className="px-1.5 py-0.5 text-[10px] sm:text-[11px] font-mono text-[#1a2c6b]/80 border border-[#1a2c6b]/15 rounded-md"
              >
                {s}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-baseline gap-1.5 mb-3 mt-auto dir-ltr justify-end">
          <span className="text-[10px] sm:text-xs text-[#1a2c6b]/60">RWF</span>
          <span className="font-mono text-base sm:text-xl font-semibold text-[#1a2c6b]">
            {typeof p.price === "number" ? p.price.toLocaleString() : p.price}
          </span>
        </div>

        <div className="flex gap-1.5">
          <Link
            to={`/products/${p._id || p.id}`}
            className="flex-1 inline-flex items-center justify-center py-2 text-xs sm:text-sm border border-[#1a2c6b] text-[#1a2c6b] hover:bg-[#1a2c6b] hover:text-white transition-all rounded-xl font-medium shadow-xs"
          >
            التفاصيل
          </Link>
          <a
            href={waLink(`مرحباً، أريد طلب: ${p.name}`)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center w-9 sm:w-11 py-2 bg-[#f28c28] text-white hover:bg-[#f28c28]/90 transition-colors rounded-xl shadow-sm"
            aria-label="اطلب عبر واتساب"
          >
            <WhatsAppIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/products");
        const data = await res.json();
        if (res.ok && data.success) {
          setProducts(data.data || []);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const displayedProducts = products.slice(0, 4);

  return (
    <section id="products" className="py-16 lg:py-28 bg-white rtl text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-10">
          <span className="text-[#f28c28] text-xs tracking-[0.35em] uppercase font-mono font-medium">
            FEATURED
          </span>
          <h2 className="font-heading text-3xl lg:text-5xl font-bold text-[#1a2c6b] mt-3">
            منتجات مميزة
          </h2>
          <div className="w-16 h-0.5 bg-[#f28c28] mx-auto mt-4 rounded-full" />
        </Reveal>

        {loading ? (
          <div className="text-center py-12 text-[#1a2c6b]/60">جاري تحميل المنتجات...</div>
        ) : displayedProducts.length === 0 ? (
          <div className="text-center py-12 text-[#1a2c6b]/60">لا توجد منتجات مضافة حالياً.</div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {displayedProducts.map((p, i) => (
              <Reveal key={p._id || p.id} delay={i * 0.08}>
                <ProductCard p={p} />
              </Reveal>
            ))}
          </div>
        )}

        <Reveal className="text-center mt-10">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-[#1a2c6b] text-[#1a2c6b] hover:bg-[#1a2c6b] hover:text-white transition-all rounded-xl font-medium text-sm shadow-sm"
          >
            عرض كل المنتجات <ArrowLeft className="w-4 h-4 ml-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}