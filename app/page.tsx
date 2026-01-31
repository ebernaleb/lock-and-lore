import Navbar from '@/components/navbar';
import Hero from '@/components/hero';
import RoomCarousel from '@/components/room-carousel';
import Location from '@/components/location';
import Footer from '@/components/footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white" style={{ overflowX: 'clip' }}>
      <Navbar />

      <Hero />

      <RoomCarousel />

      {/* Spacer between sections */}
      <div className="h-24 sm:h-32 md:h-40 bg-black" />

      <Location />

      <Footer />
    </main>
  );
}
