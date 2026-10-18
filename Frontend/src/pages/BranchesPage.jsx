import { MapPin, Phone, Clock, Navigation } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import { BRANCHES } from "@/lib/mockData";
import { Badge } from "@/components/admin/ui";
import Reveal from "@/components/site/Reveal";

export default function BranchesPage() {
  return (
    <>
      <PageHero title="الفروع" subtitle="تفضّل بزيارة أحد فروعنا — ونحن قابلون لإضافة فروع جديدة مستقبلاً." crumb="الفروع" />
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 grid lg:grid-cols-2 gap-6">
          {BRANCHES.map((b, i) => (
            <Reveal key={b.id} delay={(i % 2) * 0.06}>
              <div className="bg-white border border-[#1A1A1B]/8 p-6 h-full flex flex-col">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h3 className="font-heading text-xl font-bold text-[#1A1A1B]">{b.name}</h3>
                    <span className="text-sm text-[#1A1A1B]/55">{b.area}</span>
                  </div>
                  <Badge variant={b.status === "مفتوح" ? "green" : "red"}>{b.status}</Badge>
                </div>

                <div className="aspect-[16/9] bg-[#1A1A1B] mb-5 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-[#C5A059]">
                    <Navigation className="w-10 h-10" />
                  </div>
                  <div className="absolute bottom-2 right-3 text-[#F9F7F2]/40 text-xs font-mono">MAP · {b.area}</div>
                </div>

                <ul className="space-y-3 text-sm text-[#1A1A1B]/70 flex-1">
                  <li className="flex items-start gap-3"><MapPin className="w-4 h-4 text-[#C5A059] mt-0.5 shrink-0" />{b.address}</li>
                  <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-[#C5A059] shrink-0" /><span className="font-mono" dir="ltr">{b.phone}</span></li>
                  <li className="flex items-center gap-3"><Clock className="w-4 h-4 text-[#C5A059] shrink-0" />{b.hours}</li>
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}