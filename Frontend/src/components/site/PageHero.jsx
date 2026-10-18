import { Link } from "react-router-dom";

export default function PageHero({ title, subtitle, crumb }) {
  return (
    <section className="bg-[#1a2c6b] text-[#FFFFFF] py-14 lg:py-20 shadow-md">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <nav className="text-xs text-[#FFFFFF]/70 mb-4 font-mono">
          <Link to="/" className="hover:text-[#f28c28] transition-colors">الرئيسية</Link>
          <span className="mx-1.5 text-[#f28c28]">/</span>
          <span className="text-[#FFFFFF]/90">{crumb || title}</span>
        </nav>
        <h1 className="font-heading text-4xl lg:text-5xl font-bold text-[#FFFFFF]">{title}</h1>
        <div className="w-16 h-px bg-[#f28c28] mt-5" />
        {subtitle && <p className="text-[#FFFFFF]/80 mt-5 max-w-xl leading-relaxed">{subtitle}</p>}
      </div>
    </section>
  );
}