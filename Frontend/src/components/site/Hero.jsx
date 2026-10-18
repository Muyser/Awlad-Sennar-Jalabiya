import { ArrowLeft } from "lucide-react";
import { Image } from "@/components/ui/image";
import { waLink } from "./constants";
import { WhatsAppIcon } from "./Icons";
import Reveal from "./Reveal";

const HERO_IMG = "https://th.bing.com/th/id/R.7325bb87de11419adf686d4569d16a54?rik=ZBc4oqS3c3R%2bLA&riu=http%3a%2f%2fjallabiya.com%2fcdn%2fshop%2fcollections%2frn-image_picker_lib_temp_680bdade-8f82-4341-b274-e7abac5bf137.jpg%3fv%3d1746934271&ehk=1wAeC3%2fN4X%2fOEG7QgyZKH5ykAKYn%2fJomri8xjgh5wAc%3d&risl=&pid=ImgRaw&r=0";

export default function Hero() {
  return (
    <section id="home" className="relative min-h-[100svh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={HERO_IMG}
          alt="رجل يرتدي جلابية سودانية أنيقة"
          className="w-full h-full object-cover"
          fittingType="fill"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-[#1a2c6b]/85 via-[#1a2c6b]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a2c6b]/50 via-transparent to-[#1a2c6b]/20" />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 lg:px-8 w-full pt-28 pb-20">
        <div className="max-w-2xl">
          <Reveal>
            <span className="inline-block text-[#f28c28] text-xs tracking-[0.35em] uppercase font-mono mb-6 bg-[#1a2c6b]/60 px-3 py-1 rounded">
              أولاد سنار · جلابية
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold text-[#FFFFFF] leading-[1.15] mb-6">
              أناقة سودانية...
              <br />
              بهوية أصيلة
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-lg text-[#FFFFFF]/90 leading-relaxed mb-10 max-w-xl">
              اكتشف تشكيلتنا من الجلاليب والملابس السودانية والخليجية والتشادية، واختر ما
              تناسبك أو اطلب تصميمك الخاص.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#products"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#FFFFFF] text-[#1a2c6b] font-medium hover:bg-[#f28c28] hover:text-[#FFFFFF] transition-colors shadow-lg"
              >
                تصفح المنتجات
                <ArrowLeft className="w-4 h-4" />
              </a>
              <a
                href={waLink("مرحباً، أريد الاستفسار عن الجلاليب المتوفرة")}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-[#f28c28] text-[#FFFFFF] bg-[#2a3fae]/40 hover:bg-[#f28c28] hover:text-[#FFFFFF] transition-colors backdrop-blur-sm"
              >
                <WhatsAppIcon className="w-5 h-5" />
                اطلب عبر واتساب
              </a>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#FFFFFF]/60 text-[10px] tracking-[0.4em] font-mono">
        SCROLL
      </div>
    </section>
  );
}