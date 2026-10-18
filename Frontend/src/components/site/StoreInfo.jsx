import { MapPin, Phone, Clock, Store } from "lucide-react";
import {
  ADDRESS,
  PHONE_DISPLAY,
  PHONE_TEL,
  WHATSAPP_DISPLAY,
  waLink,
} from "./constants";
import { WhatsAppIcon } from "./Icons";
import Reveal from "./Reveal";

const INFO = [
  {
    icon: MapPin,
    title: "الموقع",
    lines: [ADDRESS],
  },
  {
    icon: Phone,
    title: "الهاتف",
    lines: [PHONE_DISPLAY],
    href: `tel:${PHONE_TEL}`,
  },
  {
    icon: WhatsAppIcon,
    title: "واتساب",
    lines: [WHATSAPP_DISPLAY],
    href: waLink(),
  },
  {
    icon: Clock,
    title: "ساعات العمل",
    lines: ["متاحون طوال أيام الأسبوع", "خدمة العملاء في خدمتكم دائماً"],
  },
];

export default function StoreInfo() {
  return (
    <section id="contact" className="py-20 lg:py-28 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <Reveal className="text-center mb-12">
          <span className="text-[#f28c28] text-xs tracking-[0.35em] uppercase font-mono">
            VISIT US
          </span>
          <h2 className="font-heading text-4xl lg:text-5xl font-bold text-[#1a2c6b] mt-3">
            معلومات المتجر
          </h2>
          <div className="w-16 h-px bg-[#f28c28] mx-auto mt-6" />
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {INFO.map((item, i) => {
            const Wrapper = item.href ? "a" : "div";
            return (
              <Reveal key={item.title} delay={i * 0.06}>
                <Wrapper
                  {...(item.href
                    ? { href: item.href, target: item.href.startsWith("http") ? "_blank" : undefined, rel: "noreferrer" }
                    : {})}
                  className="flex flex-col items-center text-center gap-3 p-7 bg-[#FFFFFF] border border-[#1a2c6b]/10 hover:border-[#f28c28] transition-colors h-full rounded-lg shadow-sm"
                >
                  <span className="w-12 h-12 rounded-full bg-[#1a2c6b] text-[#f28c28] flex items-center justify-center">
                    <item.icon className="w-5 h-5" />
                  </span>
                  <h3 className="font-heading text-lg font-bold text-[#1a2c6b]">{item.title}</h3>
                  {item.lines.map((l) => (
                    <p 
                      key={l} 
                      className="text-sm text-[#1a2c6b]/70 leading-relaxed"
                    >
                      {item.href ? (
                        <span dir="ltr" className="inline-block font-mono">
                          {l}
                        </span>
                      ) : (
                        l
                      )}
                    </p>
                  ))}
                </Wrapper>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}