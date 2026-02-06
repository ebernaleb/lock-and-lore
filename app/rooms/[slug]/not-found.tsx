import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Search, ArrowLeft } from 'lucide-react';

export default function RoomNotFound() {
  return (
    <main className="min-h-screen font-sans selection:bg-primary selection:text-neutral-950">
      <Navbar />

      <section className="pt-32 pb-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-50 mb-8">
            <Search className="w-10 h-10 text-primary" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold font-heading text-gray-900 mb-4">
            Room Not Found
          </h1>

          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            Sorry, we could not find the escape room you are looking for.
            It may have been removed or the URL might be incorrect.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/rooms"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-neutral-950 font-medium px-6 py-3 text-base rounded-full shadow-[0_4px_0_0_rgba(122,92,32,1)] hover:shadow-[0_2px_0_0_rgba(122,92,32,1)] active:shadow-[0_0px_0_0_rgba(122,92,32,1)] hover:translate-y-[2px] active:translate-y-[4px] transition-all duration-150 relative before:absolute before:inset-0 before:rounded-full before:shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.2)] before:pointer-events-none uppercase tracking-wide"
            >
              <span className="relative z-10">View All Rooms</span>
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-zinc-700 hover:bg-zinc-600 text-white font-medium px-6 py-3 text-base rounded-full shadow-[0_4px_0_0_rgba(39,39,42,1)] hover:shadow-[0_2px_0_0_rgba(39,39,42,1)] active:shadow-[0_0px_0_0_rgba(39,39,42,1)] hover:translate-y-[2px] active:translate-y-[4px] transition-all duration-150 relative before:absolute before:inset-0 before:rounded-full before:shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.15)] before:pointer-events-none"
            >
              <ArrowLeft className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Back to Home</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
