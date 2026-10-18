import { Image } from "@/components/ui/image";
import { Ruler, Scissors, Sparkles, ArrowLeft } from "lucide-react";
import { waLink } from "./constants";
import Reveal from "./Reveal";

const ATELIER = "https://media.base44.com/images/public/6ab3b054e0f96bb8e1958622/c40295b2f_generated_f964d638.jpg";

const STEPS = [
  { icon: Ruler, label: "اختر المقاسات" },
  { icon: Sparkles, label: "حدد القماش واللون" },
  { icon: Scissors, label: "نخيط بإتقان" },
];

export default function TailoringSection() {
  return (
    <section id="tailoring" className="bg-[#1a2c6b] text-[#FFFFFF] py-20 lg:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <Reveal>
          <div className="relative">
            <div className="aspect-[4/3] overflow-hidden rounded-lg shadow-xl">
              <Image
                src={ATELIER}
                alt="مشغل تفصيل الجلابية"
                className="w-full h-full object-cover"
                fittingType="fill"
              />
            </div>
            <div className="absolute -bottom-5 -right-5 lg:-right-8 bg-[#f28c28] text-[#FFFFFF] px-6 py-4 rounded-lg shadow-lg">
              <span className="font-mono text-3xl font-semibold">100%</span>
              <p className="text-xs mt-1">تفصيل حسب الطلب</p>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <span className="text-[#f28c28] text-xs tracking-[0.35em] uppercase font-mono">
              THE ATELIER
            </span>
            <h2 className="font-heading text-4xl lg:text-5xl font-bold mt-3 mb-6">
              صمّم جلابيتك بطريقتك
            </h2>
            <div className="w-16 h-px bg-[#f28c28] mb-6" />
            <p className="text-[#FFFFFF]/80 leading-relaxed mb-8 max-w-lg">
              اختر نوع الجلابية والقماش واللون وأرسل مقاساتك وملاحظاتك، وسنتابع معك طلب
              التفصيل خطوة بخطوة حتى تحصل على قطعة تناسبك تماماً.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              {STEPS.map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <span className="w-10 h-10 border border-[#f28c28]/40 bg-[#2a3fae]/30 rounded-lg flex items-center justify-center text-[#f28c28]">
                    <s.icon className="w-5 h-5" />
                  </span>
                  <span className="text-sm text-[#FFFFFF]/90">{s.label}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <a
              href={waLink("مرحباً، أريد طلب تفصيل جلابية خاصة")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#f28c28] text-[#FFFFFF] hover:bg-[#2a3fae] transition-colors rounded-sm font-medium shadow-sm"
            >
              اطلب التفصيل <ArrowLeft className="w-4 h-4" />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}