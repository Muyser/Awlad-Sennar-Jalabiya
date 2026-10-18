import { useState, useEffect } from "react";
import { Image } from "@/components/ui/image";
import { ArrowLeft, ImageIcon } from "lucide-react";
import Reveal from "./Reveal";

const TEXT_CATS = ["لبسات أفريقية", "عمم", "طواقي", "أحذية", "عطور", "سديري", "سراويل"];
const DECOR_ICONS = ["◆", "✦", "❖", "✧", "◈", "◇", "◈"];

function ImageCard({ cat, index }) {
  const catImg = cat.image || cat.img;
  
  // أول 3 عناصر في الصف العلوي (تأخذ عموداً واحداً لكل منها)، والعنصرين الأخيرين في الصف السفلي (كل منهما يأخذ عمودين ليكونوا بطاقتين عريضتين)
  let spanClass = "md:col-span-1 md:row-span-1 min-h-[240px]";
  if (index >= 3) {
    spanClass = "md:col-span-1.5 md:row-span-1 min-h-[240px]"; // العنصرين الأخيرين عريضان في الأسفل
  }

  return (
    <a
      href={`#products?category=${encodeURIComponent(cat.name)}`}
      className={`group relative overflow-hidden ${index >= 3 ? "md:col-span-1.5" : "md:col-span-1"} min-h-[240px] rounded-lg bg-gray-50 border border-[#1a2c6b]/10`}
    >
      {catImg ? (
        <Image
          src={catImg}
          alt={cat.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
          fittingType="fill"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-[#1a2c6b]/30 gap-1 bg-white">
          <ImageIcon className="w-10 h-10" />
          <span className="text-xs font-medium">لا توجد صورة</span>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-[#1a2c6b]/95 via-[#1a2c6b]/30 to-transparent" />
      
      <div className="absolute inset-0 p-5 flex flex-col justify-end">
        <h3 className="font-heading text-xl md:text-2xl text-[#FFFFFF] font-bold mb-1">{cat.name}</h3>
        {cat.count !== undefined && (
          <span className="text-xs text-white/80 font-mono mb-1">
            {cat.count} منتج
          </span>
        )}
        <span className="flex items-center gap-1.5 text-xs text-[#f28c28] opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          اكتشف المجموعة <ArrowLeft className="w-3.5 h-3.5" />
        </span>
      </div>
    </a>
  );
}

function TextCard({ name, icon }) {
  return (
    <a
      href={`#products?category=${encodeURIComponent(name)}`}
      className="group relative flex flex-col items-center justify-center gap-3 p-6 bg-[#FFFFFF] border border-[#1a2c6b]/10 hover:border-[#f28c28] rounded-lg shadow-sm transition-colors min-h-[140px]"
    >
      <span className="text-[#f28c28] text-lg" aria-hidden="true">{icon}</span>
      <h3 className="font-heading text-xl text-[#1a2c6b] font-bold text-center">{name}</h3>
      <span className="text-xs text-[#1a2c6b]/60 group-hover:text-[#f28c28] transition-colors">
        عرض المنتجات
      </span>
    </a>
  );
}

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (res.ok && data.success) {
          const activeCategories = (data.data || []).filter(c => c.visible !== false);
          setCategories(activeCategories.slice(0, 5));
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section id="categories" className="py-20 lg:py-28 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <Reveal className="text-center mb-12">
          <span className="text-[#f28c28] text-xs tracking-[0.35em] uppercase font-mono">
            COLLECTIONS
          </span>
          <h2 className="font-heading text-4xl lg:text-5xl font-bold text-[#1a2c6b] mt-3">
            تسوق حسب القسم
          </h2>
          <div className="w-16 h-px bg-[#f28c28] mx-auto mt-6" />
        </Reveal>

        {loading ? (
          <div className="text-center py-12 text-[#1a2c6b]/60">جاري تحميل الأقسام...</div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 text-[#1a2c6b]/60">لا توجد أقسام مصورة مضافة حالياً.</div>
        ) : (
          <Reveal>
            {/* 3 في الأعلى وعنصرين عريضين في الأسفل */}
            <div className="flex flex-col gap-4">
              {/* الصف العلوي: 3 بطاقات */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {categories.slice(0, 3).map((cat, index) => (
                  <ImageCard key={cat._id || cat.name} cat={cat} index={index} />
                ))}
              </div>
              {/* الصف السفلي: بطاقتان عريضتان */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.slice(3, 5).map((cat, index) => (
                  <ImageCard key={cat._id || cat.name} cat={cat} index={index + 3} />
                ))}
              </div>
            </div>
          </Reveal>
        )}

        <Reveal delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4 mt-4">
            {TEXT_CATS.map((name, idx) => (
              <TextCard 
                key={name} 
                name={name} 
                icon={DECOR_ICONS[idx % DECOR_ICONS.length]} 
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}