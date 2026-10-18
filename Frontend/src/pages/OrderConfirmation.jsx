import { useLocation, Link } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";
import { waLink } from "@/components/site/constants";
import { WhatsAppIcon } from "@/components/site/Icons";

export default function OrderConfirmation() {
  const { state } = useLocation();
  const orderNo = state?.order || "ORD-" + Math.floor(1000 + Math.random() * 9000);
  const type = state?.type || "طلب";

  return (
    <section className="min-h-[70vh] flex items-center py-16 rtl text-right">
      <div className="max-w-xl mx-auto px-5 lg:px-8 text-center">
        <div className="w-20 h-20 rounded-2xl bg-[#1a2c6b] text-white flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[#1a2c6b]/20">
          <Check className="w-10 h-10 text-[#f28c28]" />
        </div>
        <span className="text-[#f28c28] text-xs tracking-[0.35em] uppercase font-mono font-bold">SUCCESS</span>
        <h1 className="text-3xl font-bold text-[#1a2c6b] mt-3 mb-3">تم استلاستلام {type}ك بنجاح</h1>
        <p className="text-[#1a2c6b]/70 mb-8 text-sm">سنتواصل معك قريباً لتأكيد التفاصيل ومتابعة الطلب.</p>

        <div className="bg-white border border-[#1a2c6b]/10 rounded-2xl p-6 text-right mb-8 shadow-xl shadow-[#1a2c6b]/5">
          <div className="flex justify-between py-3 border-b border-[#1a2c6b]/10">
            <span className="text-[#1a2c6b]/60 text-sm">رقم الطلب</span>
            <span className="font-mono font-bold text-[#1a2c6b]">{orderNo}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-[#1a2c6b]/10">
            <span className="text-[#1a2c6b]/60 text-sm">النوع</span>
            <span className="text-[#1a2c6b] font-medium">{type}</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-[#1a2c6b]/60 text-sm">الحالة</span>
            <span className="inline-flex items-center gap-1.5 text-[#1a2c6b] font-medium">
              <span className="w-2 h-2 rounded-full bg-[#f28c28]" /> جديد
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a 
            href={waLink(`مرحباً، أريد متابعة طلبي رقم ${orderNo}`)} 
            target="_blank" 
            rel="noreferrer" 
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#f28c28] text-white hover:bg-[#f28c28]/90 transition-colors font-medium shadow-md"
          >
            <WhatsAppIcon className="w-5 h-5 text-white" /> تواصل عبر واتساب
          </a>
          <Link 
            to="/products" 
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-[#1a2c6b]/20 text-[#1a2c6b] hover:bg-[#1a2c6b] hover:text-white transition-colors font-medium shadow-sm"
          >
            العودة للمنتجات <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}