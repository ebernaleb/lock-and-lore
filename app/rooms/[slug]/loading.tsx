import { Navbar } from '@/components/navbar';

export default function RoomLoading() {
  return (
    <main className="min-h-screen font-sans bg-black">
      <Navbar />

      {/* Hero skeleton -- matches the dark gradient hero in RoomDetailContent */}
      <section className="relative">
        <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          {/* Dark gradient background simulating the blurred hero image */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-neutral-900 to-neutral-800 animate-pulse" />

          {/* Hero content skeleton -- breadcrumb, title, badges */}
          <div className="absolute bottom-0 left-0 right-0 pb-24 md:pb-28">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Breadcrumb skeleton */}
              <div className="flex items-center gap-2 mb-4">
                <div className="h-4 w-12 bg-white/10 rounded animate-pulse" />
                <div className="h-3 w-3 bg-white/10 rounded animate-pulse" />
                <div className="h-4 w-14 bg-white/10 rounded animate-pulse" />
                <div className="h-3 w-3 bg-white/10 rounded animate-pulse" />
                <div className="h-4 w-28 bg-white/10 rounded animate-pulse" />
              </div>

              {/* Title skeleton */}
              <div className="h-12 md:h-14 w-80 max-w-full bg-white/10 rounded-lg animate-pulse mb-4" />

              {/* Badge pills skeleton */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="h-8 w-28 bg-white/10 rounded-full animate-pulse" />
                <div className="h-8 w-24 bg-white/10 rounded-full animate-pulse" />
                <div className="h-8 w-28 bg-white/10 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content skeleton -- matches the -mt-16 overlap layout */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description Card skeleton */}
            <div className="bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 rounded-2xl p-8 md:p-10 border border-neutral-800/80 shadow-2xl shadow-black/40">
              {/* Section heading with icon */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-neutral-800 animate-pulse" />
                <div className="h-7 w-44 bg-neutral-800 rounded animate-pulse" />
              </div>
              {/* Description lines */}
              <div className="space-y-3">
                <div className="h-4 w-full bg-neutral-800/70 rounded animate-pulse" />
                <div className="h-4 w-full bg-neutral-800/70 rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-neutral-800/70 rounded animate-pulse" />
                <div className="h-4 w-4/6 bg-neutral-800/70 rounded animate-pulse" />
              </div>
            </div>

            {/* Details Grid skeleton -- 2x2 stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                'border-blue-500/0',
                'border-emerald-500/0',
                'border-amber-500/0',
                'border-purple-500/0',
              ].map((_, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-br from-neutral-900 to-neutral-900/80 rounded-2xl p-6 border border-neutral-800/60 shadow-xl shadow-black/30"
                >
                  <div className="flex items-start gap-4">
                    {/* Icon placeholder */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-neutral-800/80 animate-pulse" />
                    <div className="flex-1">
                      {/* Label */}
                      <div className="h-3 w-16 bg-neutral-800/70 rounded animate-pulse mb-3" />
                      {/* Value */}
                      <div className="h-6 w-24 bg-neutral-800 rounded animate-pulse mb-2" />
                      {/* Sub-text */}
                      <div className="h-3.5 w-28 bg-neutral-800/50 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Booking Card skeleton */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="relative bg-gradient-to-b from-neutral-900 to-neutral-950 rounded-2xl overflow-hidden border border-neutral-800/60 shadow-2xl shadow-black/50">
                {/* Subtle top highlight line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-600/50 to-transparent" />

                {/* Booking Card Header skeleton -- matches the primary gradient header */}
                <div className="bg-gradient-to-br from-primary/80 via-primary/70 to-primary-dark/60 p-7 animate-pulse">
                  <div className="h-6 w-40 bg-white/20 rounded animate-pulse mb-3" />
                  <div className="h-10 w-28 bg-white/20 rounded animate-pulse" />
                </div>

                {/* Booking Card Body skeleton */}
                <div className="p-7 space-y-6">
                  {/* Quick info items */}
                  <div className="space-y-0">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3.5 py-3 border-b border-neutral-800/60 last:border-b-0"
                      >
                        <div className="w-8 h-8 rounded-lg bg-neutral-800/60 animate-pulse" />
                        <div className="h-4 w-32 bg-neutral-800/70 rounded animate-pulse" />
                      </div>
                    ))}
                  </div>

                  {/* CTA button skeleton */}
                  <div className="h-13 w-full bg-neutral-800 rounded-full animate-pulse" />

                  {/* Cancellation text */}
                  <div className="h-3 w-56 bg-neutral-800/40 rounded animate-pulse mx-auto" />
                </div>
              </div>

              {/* Back link skeleton */}
              <div className="mt-6 flex justify-center">
                <div className="h-4 w-28 bg-neutral-800/50 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
