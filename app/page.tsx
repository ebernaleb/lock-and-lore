import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { RoomsSection } from "@/components/RoomsSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { TeamBuildingSection } from "@/components/TeamBuildingSection";
import { LocationSection } from "@/components/LocationSection";
import { GiftCardsSection } from "@/components/GiftCardsSection";
import { Footer } from "@/components/footer";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";

export default function Home() {
  return (
    <main className="min-h-screen font-sans selection:bg-primary selection:text-neutral-950 bg-black">
      <Navbar />
      <Hero />

      {/* Primary conversion: Room selection */}
      <div id="rooms">
        <RoomsSection />
      </div>

      {/* How It Works - step-by-step booking journey */}
      <div id="how-it-works">
        <FeaturesSection />
      </div>

      {/* B2B / Group events - secondary conversion path */}
      <TeamBuildingSection />

      {/* Location - find us section */}
      <LocationSection />

      {/* Gift cards - tertiary conversion path */}
      <GiftCardsSection />

      <Footer />

      {/* Sticky mobile CTA - appears on scroll, hidden on desktop */}
      <StickyMobileCTA />
    </main>
  );
}
