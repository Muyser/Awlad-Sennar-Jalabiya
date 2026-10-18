import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Package, FolderTree, ShoppingCart, ClipboardList,
  Scissors, Users, Boxes, Receipt, Percent, Store, Settings,
  User, Search, Bell, Menu, X, Wallet,
} from "lucide-react";
import { Logo } from "@/components/site/Icons";

const NAV = [
  { group: "الرئيسية", items: [{ to: "/admin", label: "لوحة التحكم", icon: LayoutDashboard, end: true }] },
  { group: "العمليات", items: [
    { to: "/admin/pos", label: "نقطة البيع", icon: ShoppingCart },
    { to: "/admin/orders", label: "الطلبات", icon: ClipboardList },
    { to: "/admin/tailoring", label: "التفصيل", icon: Scissors },
  ]},
  { group: "الكتالوج", items: [
    { to: "/admin/products", label: "المنتجات", icon: Package },
    { to: "/admin/categories", label: "الأقسام", icon: FolderTree },
    { to: "/admin/inventory", label: "المخزون", icon: Boxes },
    { to: "/admin/offers", label: "العروض", icon: Percent },
  ]},
  { group: "الإدارة", items: [
    { to: "/admin/customers", label: "العملاء", icon: Users },
    { to: "/admin/expenses", label: "المصروفات", icon: Receipt },
    // { to: "/admin/branches", label: "الفروع", icon: Store },
    { to: "/admin/staff", label: "الإيداع", icon: Wallet },
  ]},
  { group: "النظام", items: [
    { to: "/admin/settings", label: "الإعدادات", icon: Settings },
    { to: "/admin/profile", label: "الملف الشخصي", icon: User },
  ]},
];

function NavLink({ item, onNavigate }) {
  const { pathname } = useLocation();
  const active = item.end ? pathname === item.to : pathname.startsWith(item.to);
  return (
    <Link
      to={item.to}
      onClick={onNavigate}
      className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
        active
          ? "bg-[#1a2c6b] text-white font-medium"
          : "text-[#1a2c6b]/70 hover:bg-[#1a2c6b]/5 hover:text-[#1a2c6b]"
      }`}
    >
      <item.icon className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
      {item.label}
    </Link>
  );
}

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const current = NAV.flatMap((g) => g.items).find((i) =>
    i.end ? pathname === i.to : pathname.startsWith(i.to)
  );

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#1a2c6b]">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-64 bg-white border-l border-[#1a2c6b]/10 z-50 flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-5 border-b border-[#1a2c6b]/10 flex items-center justify-between">
          <Link to="/admin"><Logo /></Link>
          <button className="lg:hidden text-[#1a2c6b]/70 hover:text-[#1a2c6b]" onClick={() => setOpen(false)} aria-label="إغلاق">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-5">
          {NAV.map((g) => (
            <div key={g.group}>
              <p className="px-3 text-[11px] font-bold tracking-wide text-[#1a2c6b]/40 mb-1.5">{g.group}</p>
              <div className="space-y-1">
                {g.items.map((it) => (
                  <NavLink key={it.to} item={it} onNavigate={() => setOpen(false)} />
                ))}
              </div>
            </div>
          ))}
        </nav>
        <div className="p-3 border-t border-[#1a2c6b]/10">
          <Link to="/" className="flex items-center gap-2 px-3 py-2 text-xs text-[#1a2c6b]/60 hover:text-[#f28c28] transition-colors">
            ← العودة للموقع
          </Link>
        </div>
      </aside>

      {open && <div className="fixed inset-0 bg-[#1a2c6b]/40 z-40 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="lg:mr-64">
        <header className="sticky top-0 z-30 bg-[#F9F7F2]/90 backdrop-blur-md border-b border-[#1a2c6b]/10">
          <div className="flex items-center justify-between px-5 lg:px-8 py-3.5">
            <div className="flex items-center gap-3">
              <button className="lg:hidden p-1.5 text-[#1a2c6b]" onClick={() => setOpen(true)} aria-label="القائمة">
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="font-heading text-lg font-bold text-[#1a2c6b]">{current?.label || "لوحة التحكم"}</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-white border border-[#1a2c6b]/15 px-3 py-1.5 w-56 focus-within:border-[#2a3fae]">
                <Search className="w-4 h-4 text-[#1a2c6b]/40" />
                <input placeholder="بحث..." className="bg-transparent text-sm text-[#1a2c6b] focus:outline-none w-full" />
              </div>
              <button className="relative p-2 text-[#1a2c6b]/70 hover:text-[#f28c28] transition-colors" aria-label="الإشعارات">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full bg-[#f28c28]" />
              </button>
              <Link to="/admin/profile" className="flex items-center gap-2">
                <span className="w-9 h-9 rounded-full bg-[#1a2c6b] text-[#f28c28] flex items-center justify-center text-sm font-bold shadow-sm">أ</span>
                <span className="hidden sm:block text-sm font-medium text-[#1a2c6b]">أولاد سنار</span>
              </Link>
            </div>
          </div>
        </header>
        <main className="p-5 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}