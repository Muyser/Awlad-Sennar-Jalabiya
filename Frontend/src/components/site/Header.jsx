import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Menu, X, Lock } from "lucide-react";
import { NAV_LINKS, waLink } from "./constants";
import { Logo, WhatsAppIcon } from "./Icons";

export default function Header({ overlay = false }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const headerClass = overlay
    ? scrolled
      ? "bg-[#1a2c6b] border-b border-white/10 py-3 text-white shadow-lg"
      : "bg-transparent py-5 text-white"
    : "bg-[#1a2c6b] border-b border-white/10 py-3 text-white shadow-md";

  return (
    <header className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${headerClass}`}>
      <div className="max-w-7xl mx-auto px-5 lg:px-8 flex items-center justify-between">
        <Link to="/" aria-label="أولاد سنار جلابية">
          <Logo onLight={false} />
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className="relative text-sm font-medium text-white/90 hover:text-[#f28c28] transition-colors group"
            >
              {l.label}
              <span className="absolute -bottom-1.5 right-0 w-0 group-hover:w-full h-0.5 bg-[#f28c28] transition-all duration-300" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 lg:gap-3">
          <button className="p-2 text-white hover:text-[#f28c28] transition-colors" aria-label="بحث">
            <Search className="w-5 h-5" />
          </button>
          <a
            href={waLink("مرحباً، أريد الاستفسار عن منتجاتكم")}
            target="_blank"
            rel="noreferrer"
            className="p-2 text-white hover:text-[#f28c28] transition-colors hidden sm:block"
            aria-label="واتساب"
          >
            <WhatsAppIcon className="w-5 h-5" />
          </a>
          <Link
            to="/products"
            className="hidden lg:inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-xl border border-white/30 text-white hover:bg-[#f28c28] hover:border-[#f28c28] transition-all duration-300 shadow-sm"
          >
            اطلب الآن
          </Link>
          <Link
            to="/admin/login"
            className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-xl bg-white/10 text-white hover:bg-[#f28c28] transition-all duration-300 shadow-sm"
          >
            <Lock className="w-4 h-4 text-[#f28c28]" /> دخول الإدارة
          </Link>
          <button
            className="lg:hidden p-2 text-white"
            onClick={() => setOpen(true)}
            aria-label="القائمة"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden rtl text-right">
          {/* خلفية داكنة معتمة تماماً لحجب محتوى الصفحة المنسدل تحت القائمة */}
          <div className="absolute inset-0 bg-[#1a2c6b] opacity-95" onClick={() => setOpen(false)} />
          
          {/* محتوى القائمة الجانبية */}
          <div className="absolute top-0 right-0 h-full w-[85%] max-w-sm bg-[#1a2c6b] text-white shadow-2xl p-6 flex flex-col border-l border-white/15 z-50 overflow-y-auto">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
              <Logo onLight={false} />
              <button 
                onClick={() => setOpen(false)} 
                aria-label="إغلاق"
                className="p-2 rounded-lg bg-white/10 text-white hover:text-[#f28c28] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <nav className="flex flex-col space-y-2">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  to={l.href}
                  onClick={() => setOpen(false)}
                  className="py-3 px-3 rounded-xl text-base font-medium text-white hover:bg-white/10 hover:text-[#f28c28] transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-3 pt-6 border-t border-white/10">
              <Link
                to="/admin/login"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-2 py-3.5 rounded-xl border border-white/20 text-white hover:bg-white/10 font-medium transition-colors"
              >
                <Lock className="w-4 h-4 text-[#f28c28]" /> دخول الإدارة
              </Link>
              <a
                href={waLink()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#f28c28] text-white font-medium hover:bg-[#f28c28]/90 transition-colors shadow-md"
              >
                <WhatsAppIcon className="w-5 h-5" /> تواصل عبر واتساب
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}