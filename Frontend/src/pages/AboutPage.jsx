import { Image } from "@/components/ui/image";
import PageHero from "@/components/site/PageHero";
import { IMG } from "@/components/site/constants";
import Reveal from "@/components/site/Reveal";

const VALUES = [
  { title: "أصالة", text: "نحافظ على الطابع السوداني الأصيل في كل قطعة، من الجلابية التقليدية إلى الإكسسوارات." },
  { title: "أناقة", text: "نقدم التراث بأسلوب عصري وحديث يناسب الذوق المعاصر دون فقدان الهوية." },
  { title: "جودة", text: "نختار الأقمشة بعناية ونخيط بإتقان ليدوم المنتج ويرضي عميلنا." },
];

const STATS = [
  { value: "+15", label: "سنة خبرة" },
  { value: "+200", label: "تصميم متنوع" },
  { value: "+5K", label: "عميل سعيد" },
  { value: "+30", label: "نوع قماش فاخر" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero title="من نحن" subtitle="أولاد سنار جلابية — حيث يلتقي التراث السوداني بالأناقة العصرية." crumb="من نحن" />

      <section className="py-16 lg:py-24 bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <Reveal>
            <div className="aspect-[4/3] overflow-hidden rounded-lg shadow-sm border border-[#1a2c6b]/10">
              <Image src={IMG.about} alt="أقمشة أولاد سنار" className="w-full h-full object-cover" fittingType="fill" />
            </div>
          </Reveal>
          <div>
            <Reveal>
              <span className="text-[#f28c28] text-xs tracking-[0.35em] uppercase font-mono font-semibold">OUR STORY</span>
              <h2 className="font-heading text-3xl lg:text-4xl font-bold text-[#1a2c6b] mt-3 mb-5">قصة المتجر</h2>
              <div className="w-16 h-px bg-[#f28c28] mb-6" />
              <p className="text-[#1a2c6b]/80 leading-relaxed mb-4">
                بدأت رحلة "أولاد سنار جلابية" من شغف عائلي عميق بالزي السوداني الأصيل، حيث
                آمنا أن الجلابية ليست مجرد لباس، بل هوية وذاكرة تُتناقل بين الأجيال.
              </p>
              <p className="text-[#1a2c6b]/80 leading-relaxed">
                اليوم نقدّم تشكيلة واسعة من الجلاليب السودانية والخليجية والتشادية
                والإكسسوارات، بأسلوب يجمع بين عراقة القطن السوداني وحدّة التصميم العصري.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-[#1a2c6b] text-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <Reveal className="text-center mb-12">
            <h2 className="font-heading text-3xl lg:text-4xl font-bold mb-4 text-[#FFFFFF]">رؤيتنا</h2>
            <div className="w-16 h-px bg-[#f28c28] mx-auto mb-6" />
            <p className="text-[#FFFFFF]/80 max-w-2xl mx-auto leading-relaxed">
              أن نكون الوجهة الأولى للأناقة السودانية في الداخل والخارج، ونحوّل الجلابية
              من زي تقليدي إلى قطعة فنية عالمية تحمل هويتنا بفخر.
            </p>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-6">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08}>
                <div className="border border-[#FFFFFF]/15 bg-[#2a3fae]/20 p-6 h-full rounded-lg">
                  <span className="text-[#f28c28] text-xl">◆</span>
                  <h3 className="font-heading text-xl font-bold mt-3 mb-2 text-[#FFFFFF]">{v.title}</h3>
                  <p className="text-sm text-[#FFFFFF]/75 leading-relaxed">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06}>
              <div className="text-center border-y border-[#1a2c6b]/15 py-8 bg-[#1a2c6b]/5 rounded-lg">
                <span className="font-mono text-4xl font-semibold text-[#1a2c6b]">{s.value}</span>
                <p className="text-sm text-[#1a2c6b]/70 mt-2 font-medium">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}