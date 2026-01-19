import Navbar from '@/components/navbar';
import Hero from '@/components/hero';
import RoomCarousel from '@/components/room-carousel';
import Location from '@/components/location';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { BOOKING_URL } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white" style={{ overflowX: 'clip' }}>
      <Navbar />

      <Hero />

      <RoomCarousel />

      <Location />

      {/* Newsletter Subscribe Section */}
      <section className="py-16 sm:py-24 md:py-32 bg-black relative overflow-hidden border-t border-white/10">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-black to-black" />

        <div className="container px-4 md:px-8 mx-auto text-center relative z-10">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 sm:mb-4 tracking-tight leading-[0.9] uppercase"
            style={{ fontFamily: 'var(--font-cinzel)' }}
          >
            STAY IN THE LOOP
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-white/60 mb-8 sm:mb-10 max-w-xl mx-auto px-4">
            Subscribe for exclusive coupons and updates on new games!
          </p>

          <form className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full sm:flex-1 px-5 sm:px-6 py-3.5 sm:py-4 min-h-[48px] bg-zinc-900 border-2 border-white/20 rounded-full text-white text-sm sm:text-base placeholder:text-gray-500 focus:outline-none focus:border-white/50 transition-colors"
              required
            />
            <button
              type="submit"
              className="w-full sm:w-auto bg-white text-black hover:bg-primary hover:text-white font-bold tracking-widest uppercase px-8 sm:px-10 py-3.5 sm:py-4 min-h-[48px] rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] text-sm sm:text-base"
            >
              Subscribe
            </button>
          </form>

          <p className="text-[10px] sm:text-xs text-gray-600 mt-4 sm:mt-6 tracking-wider">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
