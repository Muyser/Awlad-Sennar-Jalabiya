import { useState } from "react";
import { MapPin, Phone, Clock, Mail, Send } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import { inputClass, Field } from "@/components/admin/ui";
import {
  ADDRESS, PHONE_DISPLAY, PHONE_TEL, WHATSAPP_DISPLAY, waLink,
} from "@/components/site/constants";
import { WhatsAppIcon } from "@/components/site/Icons";


export default function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const [sent, setSent] = useState(false);

  return (
    <>
      <PageHero title="تواصل معنا" subtitle="نسعد بخدمتك — تواصل معنا عبر أي وسيلة أو أرسل رسالتك مباشرة." crumb="تواصل معنا" />
      <section className="py-12 lg:py-16 bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 grid lg:grid-cols-2 gap-10">
          {/* Info */}
          <div className="space-y-4">
            {[
              { icon: MapPin, title: "العنوان", lines: [ADDRESS] },
              { icon: Phone, title: "الهاتف", lines: [PHONE_DISPLAY], ltr: true, href: `tel:${PHONE_TEL}` },
              { icon: WhatsAppIcon, title: "واتساب", lines: [WHATSAPP_DISPLAY], ltr: true, href: waLink() },
              { icon: Clock, title: "ساعات العمل", lines: ["متاحون طوال أيام الأسبوع", "خدمة العملاء في خدمتكم دائماً"] },
              { icon: Mail, title: "البريد الإلكتروني", lines: ["info@sennar.sd"], ltr: true },
            ].map((it) => {
              const Wrapper = it.href ? "a" : "div";
              return (
                <Wrapper key={it.title} {...(it.href ? { href: it.href, target: it.href.startsWith("http") ? "_blank" : undefined, rel: "noreferrer" } : {})} className="flex items-start gap-4 bg-[#FFFFFF] border border-[#1a2c6b]/10 p-5 hover:border-[#f28c28]/60 transition-colors rounded-lg shadow-sm">
                  <span className="w-11 h-11 bg-[#1a2c6b] text-[#f28c28] flex items-center justify-center shrink-0 rounded-sm"><it.icon className="w-5 h-5" /></span>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-[#1a2c6b]">{it.title}</h3>
                    {it.lines.map((l) => <p key={l} className="text-sm text-[#1a2c6b]/75 mt-0.5" dir={it.ltr ? "ltr" : undefined} style={it.ltr ? { textAlign: "right" } : undefined}>{l}</p>)}
                  </div>
                </Wrapper>
              );
            })}
          </div>

          {/* Form */}
          <div className="bg-[#FFFFFF] border border-[#1a2c6b]/10 p-6 lg:p-8 rounded-lg shadow-sm">
            {sent ? (
              <div className="text-center py-10">
                <span className="text-[#f28c28] text-4xl">◆</span>
                <h3 className="font-heading text-2xl font-bold text-[#1a2c6b] mt-4 mb-2">تم استلام رسالتك</h3>
                <p className="text-[#1a2c6b]/70">سنتواصل معك في أقرب وقت ممكن.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-5">
                <h3 className="font-heading text-xl font-bold text-[#1a2c6b] mb-2">أرسل رسالة</h3>
                <Field label="الاسم"><input required value={form.name} onChange={set("name")} className={`${inputClass} border-[#1a2c6b]/15 text-[#1a2c6b] focus:border-[#f28c28] rounded-sm`} placeholder="اسمك الكريم" /></Field>
                <Field label="رقم الهاتف"><input required value={form.phone} onChange={set("phone")} className={`${inputClass} border-[#1a2c6b]/15 text-[#1a2c6b] focus:border-[#f28c28] rounded-sm`} placeholder="09xxxxxxxx" /></Field>
                <Field label="الرسالة"><textarea required value={form.message} onChange={set("message")} rows={5} className={`${inputClass} border-[#1a2c6b]/15 text-[#1a2c6b] focus:border-[#f28c28] rounded-sm`} placeholder="كيف يمكننا مساعدتك؟" /></Field>
                <button type="submit" className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-[#1a2c6b] text-[#FFFFFF] hover:bg-[#2a3fae] transition-colors rounded-sm font-medium shadow-sm">
                  <Send className="w-4 h-4 text-[#f28c28]" /> إرسال الرسالة
                </button>
                <a href={waLink()} target="_blank" rel="noreferrer" className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-[#f28c28] text-[#FFFFFF] hover:bg-[#e07b1e] transition-colors rounded-sm font-medium shadow-sm">
                  <WhatsAppIcon className="w-5 h-5 text-[#FFFFFF]" /> تواصل عبر واتساب
                </a>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}