import Header from "@/components/site/Header";
import Hero from "@/components/site/Hero";
import Categories from "@/components/site/Categories";
import FeaturedProducts from "@/components/site/FeaturedProducts";
import TailoringSection from "@/components/site/TailoringSection";
import AboutSection from "@/components/site/AboutSection";
import Offers from "@/components/site/Offers";
import StoreInfo from "@/components/site/StoreInfo";
import CTA from "@/components/site/CTA";
import Footer from "@/components/site/Footer";
import FloatingWhatsApp from "@/components/site/FloatingWhatsApp";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#1A1A1B]">
      <Header overlay />
      <main>
        <Hero />
        <Categories />
        <FeaturedProducts />
        <TailoringSection />
        <AboutSection />
        <Offers />
        <StoreInfo />
        <CTA />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}