import { ArrowLeft } from "lucide-react";
import { waLink } from "./constants";
import { WhatsAppIcon } from "./Icons";
import Reveal from "./Reveal";

export default function CTA() {
  return (
    <section className="py-24 lg:py-36 bg-[#FFFFFF]">
      <div className="max-w-4xl mx-auto px-5 lg:px-8 text-center">
        <Reveal>
          <span className="text-[#f28c28] text-xs tracking-[0.35em] uppercase font-mono">
            READY?
          </span>
          <h2 className="font-heading text-5xl lg:text-7xl font-bold text-[#1a2c6b] mt-4 mb-6 leading-tight">
            جاهز تختار جلابيتك؟
          </h2>
          <div className="w-16 h-px bg-[#f28c28] mx-auto mb-8" />
          <p className="text-lg text-[#1a2c6b]/70 mb-12 max-w-xl mx-auto">
            تصفح منتجاتنا أو تواصل معنا مباشرة عبر واتساب.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="#products"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#1a2c6b] text-[#FFFFFF] hover:bg-[#2a3fae] transition-colors rounded-sm font-medium shadow-sm"
            >
              تصفح المنتجات <ArrowLeft className="w-4 h-4" />
            </a>
            <a
              href={waLink("مرحباً، أريد التواصل معكم")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-[#f28c28] text-[#f28c28] hover:bg-[#f28c28] hover:text-[#FFFFFF] transition-colors rounded-sm font-medium shadow-sm"
            >
              <WhatsAppIcon className="w-5 h-5" /> تواصل عبر واتساب
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}