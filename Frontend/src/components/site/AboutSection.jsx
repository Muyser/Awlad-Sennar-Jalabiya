import { Image } from "@/components/ui/image";
import { ArrowLeft } from "lucide-react";
import Reveal from "./Reveal";

const ABOUT_IMG = "https://media.base44.com/images/public/6ab3b054e0f96bb8e1958622/1b42bc1e9_generated_043f0a72.jpg";

const STATS = [
  { value: "+15", label: "سنة خبرة" },
  { value: "+200", label: "تصميم متنوع" },
  { value: "+5K", label: "عميل سعيد" },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-20 lg:py-28 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <Reveal>
          <div className="aspect-[4/3] overflow-hidden rounded-lg shadow-xl">
            <Image
              src={ABOUT_IMG}
              alt="أقمشة ومنتجات أولاد سنار"
              className="w-full h-full object-cover"
              fittingType="fill"
            />
          </div>
        </Reveal>

        <div>
          <Reveal>
            <span className="text-[#f28c28] text-xs tracking-[0.35em] uppercase font-mono">
              OUR STORY
            </span>
            <h2 className="font-heading text-4xl lg:text-5xl font-bold text-[#1a2c6b] mt-3 mb-6">
              أولاد سنار جلابية
            </h2>
            <div className="w-16 h-px bg-[#f28c28] mb-6" />
            <p className="text-[#1a2c6b]/80 leading-relaxed mb-8 max-w-lg">
              متجر متخصص في الملابس والجلاليب ذات الطابع السوداني الأصيل، نقدم التراث
              بأسلوب حديث واحترافي — قطع مختارة بعناية تجمع بين الأصالة والأناقة
              المعاصرة.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid grid-cols-3 gap-4 mb-10 border-y border-[#1a2c6b]/10 py-6">
              {STATS.map((s) => (
                <div key={s.label}>
                  <span className="font-mono text-3xl font-semibold text-[#1a2c6b]">
                    {s.value}
                  </span>
                  <p className="text-sm text-[#1a2c6b]/60 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <a
              href="#about"
              className="inline-flex items-center gap-2 px-8 py-3.5 border border-[#1a2c6b] text-[#1a2c6b] hover:bg-[#1a2c6b] hover:text-[#FFFFFF] transition-colors rounded-sm font-medium shadow-sm"
            >
              اعرف المزيد <ArrowLeft className="w-4 h-4" />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}