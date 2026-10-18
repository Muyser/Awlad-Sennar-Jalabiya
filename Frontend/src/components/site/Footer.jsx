import { Facebook, Instagram, MapPin, Phone } from "lucide-react";
import {
  ADDRESS,
  CATEGORIES,
  NAV_LINKS,
  PHONE_DISPLAY,
  PHONE_TEL,
  waLink,
  WHATSAPP_DISPLAY,
} from "./constants";
import { Logo, WhatsAppIcon } from "./Icons";


const TikTokIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.144-4.253V9.552a6.34 6.34 0 0 0-5.41 5.92c-.005 3.513 2.844 6.365 6.357 6.37 3.518.005 6.372-2.84 6.377-6.358V8.928a8.17 8.17 0 0 0 4.742 1.514v-3.47a4.764 4.764 0 0 1-2.79-1.286z"/>
  </svg>
);

const SOCIAL = [
  { icon: Facebook, href: "https://www.facebook.com/profile.php?id=61592452641841", label: "فيسبوك" },
  { icon: Instagram, href: "https://www.instagram.com/invites/contact/?utm_content=dwuta7f&stkn=1p9l98iz3mixl", label: "إنستغرام" }, 
  { icon: TikTokIcon, href: "https://www.tiktok.com/@awlad.sennar.jalabya?_r=1&_t=ZS-9AKMkCAWvMy", label: "تيك توك" },
  { icon: WhatsAppIcon, href: waLink(), label: "واتساب" },
];
export default function Footer() {
  return (
    <footer className="bg-[#1a2c6b] text-[#FFFFFF] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#FFFFFF]/10">
          <div>
            <Logo onLight={false} />
            <p className="text-sm text-[#FFFFFF]/70 leading-relaxed mt-5 max-w-xs">
              متجر متخصص في الجلاليب والملابس السودانية الأصيلة، نقدم التراث بأسلوب
              حديث وفاخر.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 border border-[#FFFFFF]/20 rounded-sm flex items-center justify-center text-[#FFFFFF]/80 hover:border-[#f28c28] hover:text-[#f28c28] hover:bg-[#2a3fae]/20 transition-colors"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading text-lg font-bold mb-5 text-[#f28c28]">روابط الموقع</h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm text-[#FFFFFF]/75 hover:text-[#FFFFFF] transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-lg font-bold mb-5 text-[#f28c28]">الأقسام</h4>
            <ul className="space-y-3">
              {CATEGORIES.slice(0, 8).map((c) => (
                <li key={c}>
                  <a
                    href="#categories"
                    className="text-sm text-[#FFFFFF]/75 hover:text-[#FFFFFF] transition-colors"
                  >
                    {c}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-lg font-bold mb-5 text-[#f28c28]">تواصل معنا</h4>
            <ul className="space-y-4 text-sm text-[#FFFFFF]/75">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#f28c28] mt-0.5 shrink-0" />
                <span>{ADDRESS}</span>
              </li>
              <li>
                <a href={`tel:${PHONE_TEL}`} className="flex items-center gap-3 hover:text-[#FFFFFF] transition-colors">
                  <Phone className="w-4 h-4 text-[#f28c28] shrink-0" />
                  <span className="font-mono" dir="ltr">{PHONE_DISPLAY}</span>
                </a>
              </li>
              <li>
                <a href={waLink()} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-[#FFFFFF] transition-colors">
                  <WhatsAppIcon className="w-4 h-4 text-[#f28c28] shrink-0" />
                  <span className="font-mono" dir="ltr">{WHATSAPP_DISPLAY}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FFFFFF]/50">
          <p>© {new Date().getFullYear()} أولاد سنار جلابية. جميع الحقوق محفوظة.</p>
          <p className="text-center">
            طُور بواسطة <span className="text-[#f28c28] font-medium"> Muyser (ميسر)</span>
          </p>
          <p className="font-mono tracking-wide">SENNAR · KIGALI</p>
        </div>
      </div>
    </footer>
  );
}