import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import FloatingWhatsApp from "./FloatingWhatsApp";

export default function SiteLayout() {
  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#1A1A1B]">
      <Header />
      <main className="pt-20">
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}