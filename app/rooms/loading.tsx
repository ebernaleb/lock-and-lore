import { Navbar } from '@/components/navbar';

export default function RoomsLoading() {
  return (
    <main className="min-h-screen font-sans bg-black">
      <Navbar />

      {/* Header skeleton -- matches the page header structure */}
      <section className="pt-28 pb-16 bg-black relative overflow-hidden">
        {/* Subtle radial glow matching the actual page */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(197,151,62,0.08)_0%,_transparent_70%)]" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="h-12 md:h-14 w-96 max-w-full bg-neutral-800 rounded-lg animate-pulse mx-auto mb-5" />
          <div className="h-6 w-[28rem] max-w-full bg-neutral-800/60 rounded animate-pulse mx-auto" />
        </div>
      </section>

      {/* Cards skeleton */}
      <section className="py-16 md:py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-neutral-900 rounded-3xl overflow-hidden flex flex-col h-full animate-pulse"
              >
                <div className="h-64 sm:h-72 bg-neutral-800" />
                <div className="p-6 text-center flex flex-col flex-grow">
                  <div className="h-7 w-48 bg-neutral-800 rounded mx-auto mb-3" />
                  <div className="space-y-2 mb-5">
                    <div className="h-4 w-full bg-neutral-800/70 rounded" />
                    <div className="h-4 w-5/6 bg-neutral-800/70 rounded mx-auto" />
                    <div className="h-4 w-4/6 bg-neutral-800/70 rounded mx-auto" />
                  </div>
                  <div className="flex justify-center gap-5 py-3 border-t border-b border-neutral-800 mb-5">
                    <div className="h-4 w-20 bg-neutral-800/70 rounded" />
                    <div className="h-4 w-16 bg-neutral-800/70 rounded" />
                  </div>
                  <div className="mt-auto">
                    <div className="h-12 w-full bg-neutral-800 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
