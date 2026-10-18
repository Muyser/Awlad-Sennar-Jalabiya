import { Link } from "react-router-dom";

export const inputClass =
  "w-full px-3.5 py-2.5 bg-white border border-[#1A1A1B]/15 text-sm text-[#1A1A1B] focus:border-[#C5A059] focus:outline-none transition-colors";

export function Card({ children, className = "" }) {
  return <div className={`bg-white border border-[#1A1A1B]/8 ${className}`}>{children}</div>;
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-[#1A1A1B]">{title}</h1>
        {subtitle && <p className="text-sm text-[#1A1A1B]/55 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
    </div>
  );
}

export function StatCard({ icon: Icon, label, value, sub, trend }) {
  return (
    <div className="bg-white border border-[#1A1A1B]/8 p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="w-10 h-10 bg-[#1A1A1B] text-[#C5A059] flex items-center justify-center">
          <Icon className="w-5 h-5" />
        </span>
        {trend && (
          <span className={`text-xs font-mono ${trend.up ? "text-[#1F3D2B]" : "text-[#9b3a3a]"}`}>
            {trend.text}
          </span>
        )}
      </div>
      <p className="text-sm text-[#1A1A1B]/55">{label}</p>
      <p className="font-mono text-2xl font-semibold text-[#1A1A1B] mt-1">{value}</p>
      {sub && <p className="text-xs text-[#1A1A1B]/45 mt-1">{sub}</p>}
    </div>
  );
}

const VARIANTS = {
  gold: "bg-[#C5A059]/15 text-[#8a6d2f] border-[#C5A059]/30",
  dark: "bg-[#1A1A1B] text-[#F9F7F2]",
  green: "bg-[#1F3D2B]/12 text-[#1F3D2B]",
  amber: "bg-[#b8860b]/15 text-[#8a5a0b]",
  blue: "bg-[#1A1A1B]/12 text-[#1A1A1B]",
  red: "bg-[#9b3a3a]/12 text-[#9b3a3a]",
  gray: "bg-[#1A1A1B]/8 text-[#1A1A1B]/60",
};

export function Badge({ children, variant = "gray", className = "" }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-xs border ${VARIANTS[variant]} ${className}`}>
      {children}
    </span>
  );
}

export const ORDER_STATUS = {
  جديد: "gold",
  "تم التأكيد": "blue",
  "قيد التجهيز": "amber",
  جاهز: "green",
  "تم التسليم": "gray",
  ملغي: "red",
};

export const TAILOR_STATUS = {
  جديد: "gold",
  "أخذ المقاسات": "blue",
  "قيد التفصيل": "amber",
  جاهز: "green",
  "تم التسليم": "gray",
};

export function StatusBadge({ status, map = ORDER_STATUS }) {
  return <Badge variant={map[status] || "gray"}>{status}</Badge>;
}

export function Table({ columns, rows, empty }) {
  return (
    <div className="overflow-x-auto bg-white border border-[#1A1A1B]/8">
      <table className="w-full text-sm whitespace-nowrap">
        <thead>
          <tr className="border-b border-[#1A1A1B]/10 bg-[#F9F7F2]/60">
            {columns.map((c) => (
              <th key={c.key} className="text-right font-medium text-[#1A1A1B]/60 px-4 py-3">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id || i} className="border-b border-[#1A1A1B]/6 hover:bg-[#F9F7F2]/40 transition-colors">
              {columns.map((c) => (
                <td key={c.key} className="px-4 py-3 text-[#1A1A1B]/80">
                  {c.render ? c.render(r) : r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <div className="py-14 text-center text-[#1A1A1B]/40 text-sm">{empty || "لا توجد بيانات"}</div>
      )}
    </div>
  );
}

export function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-[#1A1A1B]/70 mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-xs text-[#1A1A1B]/45 mt-1">{hint}</span>}
    </label>
  );
}

export function PrimaryButton({ children, as = "button", to, className = "", ...props }) {
  const cls = `inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1A1A1B] text-[#F9F7F2] hover:bg-[#2A2A2B] transition-colors text-sm disabled:opacity-50 ${className}`;
  if (as === "link") return <Link to={to} className={cls} {...props}>{children}</Link>;
  return <button className={cls} {...props}>{children}</button>;
}

export function GhostButton({ children, as = "button", to, className = "", ...props }) {
  const cls = `inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-[#1A1A1B]/20 text-[#1A1A1B] hover:border-[#C5A059] hover:text-[#C5A059] transition-colors text-sm ${className}`;
  if (as === "link") return <Link to={to} className={cls} {...props}>{children}</Link>;
  return <button className={cls} {...props}>{children}</button>;
}

export function GoldButton({ children, as = "button", to, className = "", ...props }) {
  const cls = `inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#C5A059] text-[#1A1A1B] hover:bg-[#d4af68] transition-colors text-sm ${className}`;
  if (as === "link") return <Link to={to} className={cls} {...props}>{children}</Link>;
  return <button className={cls} {...props}>{children}</button>;
}

export function SectionTitle({ children, action }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="font-heading text-lg font-bold text-[#1A1A1B]">{children}</h2>
      {action}
    </div>
  );
}