import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";
import { Search, SlidersHorizontal } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import { money } from "@/lib/mockData";
import { CATEGORIES } from "@/components/site/constants";

const API_URL = import.meta.env.VITE_API_URL;

const SIZES = ["50", "52", "54", "56", "58", "M", "L", "XL"];
const COLORS = [
  { name: "أبيض", hex: "#FFFFFF" },
  { name: "أسود", hex: "#1A1A1B" },
  { name: "كحلي", hex: "#1a2c6b" },
  { name: "بُنّي", hex: "#6B2B2B" },
  { name: "برتقالي", hex: "#f28c28" },
  { name: "أخضر", hex: "#1F3D2B" },
];

function ProductCard({ p }) {
  // دعم توافقية خصائص الـ Backend (_id أو id) والـ images (أول صورة أو image)
  const productId = p._id || p.id;
  const productImage = p.images && p.images.length > 0 ? p.images[0] : p.image;

  return (
    <Link to={`/products/${productId}`} className="group flex flex-col bg-[#FFFFFF] border border-[#1a2c6b]/10 hover:border-[#f28c28] transition-colors rounded-lg overflow-hidden shadow-sm">
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image src={productImage} alt={p.name} className="w-full h-full object-cover transition-transform duration-[1.1s] group-hover:scale-105" fittingType="fill" />
        {p.oldPrice && (
          <span className="absolute top-3 right-3 bg-[#f28c28] text-[#FFFFFF] px-3 py-1 text-[11px] font-mono rounded-sm font-semibold">عرض</span>
        )}
        <span className={`absolute top-3 left-3 px-2.5 py-1 text-[11px] rounded-sm font-medium ${p.available ? "bg-[#FFFFFF]/95 text-[#1F3D2B]" : "bg-[#1a2c6b]/80 text-[#FFFFFF]"}`}>
          {p.available ? "متوفر" : "غير متوفر"}
        </span>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs text-[#1a2c6b]/60 mb-1">{p.category}</span>
        <h3 className="font-heading text-base font-bold text-[#1a2c6b] mb-2">{p.name}</h3>
        <div className="flex items-baseline gap-1.5 mt-auto mb-3 dir-ltr justify-end">
          <span className="text-xs text-[#1a2c6b]/60">RWF</span>
          <span className="font-mono text-lg font-semibold text-[#1a2c6b]">{typeof p.price === "number" ? p.price.toLocaleString() : p.price}</span>
        </div>
        <span className="text-sm text-[#2a3fae] group-hover:text-[#f28c28] transition-colors font-medium">عرض التفاصيل ←</span>
      </div>
    </Link>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("الكل");
  const [size, setSize] = useState("الكل");
  const [color, setColor] = useState("الكل");
  const [type, setType] = useState("الكل");
  const [avail, setAvail] = useState("الكل");
  const [sort, setSort] = useState("الأحدث");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/products`);
        const data = await res.json();
        if (res.ok && data.success) {
          setProducts(data.data);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  let list = products.filter(
    (p) =>
      (!q || p.name.toLowerCase().includes(q.toLowerCase())) &&
      (cat === "الكل" || p.category === cat) &&
      (size === "الكل" || (p.sizes && p.sizes.includes(size))) &&
      (color === "الكل" || (p.colors && p.colors.includes(color))) &&
      (type === "الكل" || p.type === type) &&
      (avail === "الكل" || (avail === "متوفر" ? p.available : !p.available))
  );

  // تطبيق الترتيب
  if (sort === "الأحدث") {
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sort === "السعر: الأقل") {
    list.sort((a, b) => a.price - b.price);
  } else if (sort === "السعر: الأعلى") {
    list.sort((a, b) => b.price - a.price);
  } else if (sort === "الأكثر مبيعاً") {
    list.sort((a, b) => (b.sold || 0) - (a.sold || 0));
  }

  const FilterSelect = ({ label, value, set, options }) => (
    <div>
      <span className="block text-xs text-[#1a2c6b]/70 mb-1.5 font-medium">{label}</span>
      <select value={value} onChange={(e) => set(e.target.value)} className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#1a2c6b]/15 text-sm text-[#1a2c6b] focus:border-[#f28c28] focus:outline-none rounded-sm shadow-sm">
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );

  return (
    <>
      <PageHero title="المنتجات" subtitle="ابحث وصفّي من بين تشكيلتنا الكاملة من الجلاليب والملابس السودانية." crumb="المنتجات" />
      <section className="py-12 lg:py-16 bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Filters */}
          <aside className={`${showFilters ? "block" : "hidden"} lg:block`}>
            <div className="bg-[#FFFFFF] border border-[#1a2c6b]/10 p-5 space-y-5 sticky top-24 rounded-lg shadow-sm">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a2c6b]/50" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث عن منتج..." className="w-full pr-9 pl-3 py-2.5 bg-[#FFFFFF] border border-[#1a2c6b]/15 text-sm text-[#1a2c6b] focus:border-[#f28c28] focus:outline-none rounded-sm shadow-sm" />
              </div>
              <FilterSelect label="القسم" value={cat} set={setCat} options={["الكل", ...CATEGORIES]} />
              <FilterSelect label="نوع المنتج" value={type} set={setType} options={["الكل", "جاهز", "تفصيل"]} />
              <div>
                <span className="block text-xs text-[#1a2c6b]/70 mb-1.5 font-medium">المقاس</span>
                <div className="flex flex-wrap gap-1.5">
                  {["الكل", ...SIZES].map((s) => (
                    <button key={s} onClick={() => setSize(s)} className={`px-2.5 py-1 text-xs border rounded-sm transition-colors ${size === s ? "bg-[#1a2c6b] text-[#FFFFFF] border-[#1a2c6b]" : "border-[#1a2c6b]/15 text-[#1a2c6b]/75 hover:border-[#f28c28]"}`}>{s}</button>
                  ))}
                </div>
              </div>
              <div>
                <span className="block text-xs text-[#1a2c6b]/70 mb-1.5 font-medium">اللون</span>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setColor("الكل")} className={`px-2.5 py-1 text-xs border rounded-sm transition-colors ${color === "الكل" ? "bg-[#1a2c6b] text-[#FFFFFF] border-[#1a2c6b]" : "border-[#1a2c6b]/15 text-[#1a2c6b]/75 hover:border-[#f28c28]"}`}>الكل</button>
                  {COLORS.map((c) => (
                    <button key={c.name} onClick={() => setColor(c.name)} title={c.name} className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${color === c.name ? "border-[#f28c28] ring-2 ring-[#f28c28]/30" : "border-[#1a2c6b]/20"}`} style={{ backgroundColor: c.hex }} />
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <button onClick={() => setShowFilters((v) => !v)} className="lg:hidden inline-flex items-center gap-2 text-sm border border-[#1a2c6b]/20 px-3.5 py-2 rounded-sm text-[#1a2c6b] bg-[#FFFFFF]">
                <SlidersHorizontal className="w-4 h-4 text-[#f28c28]" /> تصفية
              </button>
              <p className="text-sm text-[#1a2c6b]/70 font-medium">{list.length} منتج</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#1a2c6b]/60">ترتيب</span>
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-3 py-2 bg-[#FFFFFF] border border-[#1a2c6b]/15 text-sm text-[#1a2c6b] focus:outline-none focus:border-[#f28c28] rounded-sm shadow-sm">
                  {["الأحدث", "السعر: الأقل", "السعر: الأعلى", "الأكثر مبيعاً"].map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
            {loading ? (
              <div className="py-20 text-center text-[#1a2c6b]/60">جاري تحميل المنتجات...</div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                  {list.map((p) => <ProductCard key={p._id || p.id} p={p} />)}
                </div>
                {list.length === 0 && <div className="py-20 text-center text-[#1a2c6b]/50">لا توجد منتجات مطابقة لبحثك</div>}
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}