import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { RoomsSection } from "@/components/RoomsSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen font-sans selection:bg-primary selection:text-white">
      <Navbar />
      <Hero />
      <div id="rooms"><RoomsSection /></div>
      <div className="py-12 bg-[#f9f9f9]"></div>
      <div id="features"><FeaturesSection /></div>
      <div className="py-12 bg-[#f9f9f9]"></div>
      <FAQSection />
      <div className="py-12 bg-[#f9f9f9]"></div>
      <Footer />
    </main>
  );
}
