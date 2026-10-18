import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";
import { ArrowLeft } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import Reveal from "@/components/site/Reveal";

const API_URL = import.meta.env.VITE_API_URL;

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/categories`);
        const data = await response.json();

        if (response.ok && data.success) {
          setCategories(data.data);
        } else {
          setError(data.message || "فشل في جلب الأقسام");
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("حدث خطأ أثناء الاتصال بالخادم");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <PageHero
        title="الأقسام"
        subtitle="تصفّح مجموعاتنا الكاملة من الجلاليب والملابس السودانية والخليجية والتشادية والإكسسوارات."
        crumb="الأقسام"
      />
      <section className="py-16 lg:py-24 bg-[#FFFFFF] rtl text-right">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          
          {/* حالة التحميل */}
          {loading && (
            <div className="py-20 text-center text-[#1a2c6b]/60 text-lg">
              جاري تحميل الأقسام...
            </div>
          )}

          {/* حالة الخطأ */}
          {error && (
            <div className="py-20 text-center text-red-600 text-lg">
              {error}
            </div>
          )}

          {/* في حال لم تتوفر أقسام */}
          {!loading && !error && categories.length === 0 && (
            <div className="py-20 text-center text-[#1a2c6b]/60 text-lg">
              لا توجد أقسام مضافة حالياً.
            </div>
          )}

          {/* عرض شبكة الأقسام القادمة من الـ Backend */}
          {!loading && !error && categories.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {categories.map((c, i) => {
                const catId = c._id || c.id;
                const catName = c.name || "قسم بدون اسم";
                const catImage = c.image || "/placeholder.jpg";
                const catCount = c.count !== undefined ? c.count : (c.productsCount || 0);

                return (
                  <Reveal key={catId} delay={(i % 4) * 0.06}>
                    <Link
                      to={`/products?category=${encodeURIComponent(catName)}`}
                      className="group relative block aspect-[4/5] overflow-hidden rounded-lg border border-[#1a2c6b]/10 shadow-sm"
                    >
                      <Image
                        src={catImage}
                        alt={catName}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                        fittingType="fill"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1a2c6b]/90 via-[#1a2c6b]/20 to-transparent" />
                      <div className="absolute inset-0 p-6 flex flex-col justify-end">
                        <span className="text-[#f28c28] text-xs font-mono mb-2 font-semibold">
                          {catCount} منتج
                        </span>
                        <h3 className="font-heading text-xl font-bold text-[#FFFFFF] mb-3">
                          {catName}
                        </h3>
                        <span className="flex items-center gap-1.5 text-sm text-[#FFFFFF]/90 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 font-medium">
                          عرض المنتجات <ArrowLeft className="w-4 h-4 text-[#f28c28]" />
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          )}

        </div>
      </section>
    </>
  );
}