import { useState, useEffect } from "react";
import { waLink } from "./constants";
import { WhatsAppIcon } from "./Icons";

export default function FloatingWhatsApp() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={waLink("مرحباً، تحدث مع خياطك الخاص في أولاد سنار جلابية")}
      target="_blank"
      rel="noreferrer"
      aria-label="تحدث مع خياطك الخاص"
      className={`fixed bottom-6 left-6 z-40 flex items-center gap-3 bg-[#1a2c6b] text-[#FFFFFF] pl-5 pr-3 py-3 shadow-2xl border border-[#f28c28]/40 transition-all duration-500 hover:bg-[#2a3fae] rounded-full ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <span className="w-9 h-9 rounded-full bg-[#f28c28] text-[#FFFFFF] flex items-center justify-center shadow-sm">
        <WhatsAppIcon className="w-5 h-5" />
      </span>
      <span className="text-sm font-medium hidden sm:block">تحدث مع خياطك الخاص</span>
    </a>
  );
}