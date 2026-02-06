export default function BookingLoading() {
  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col">
      <main className="w-full py-4 md:py-8 flex-1">
        {/* Top bar skeleton */}
        <div className="max-w-7xl mx-auto px-4 mb-6 md:mb-8">
          <div className="relative flex items-center justify-center">
            <div className="absolute left-0 h-4 w-24 bg-neutral-800 rounded animate-pulse" />
            <div className="h-7 w-40 bg-neutral-800 rounded animate-pulse" />
          </div>
        </div>

        {/* Stepper skeleton */}
        <div className="max-w-4xl mx-auto mb-8 md:mb-10 px-4">
          <div className="flex items-center justify-center gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-neutral-800 animate-pulse" />
                <div className="hidden sm:block h-4 w-20 bg-neutral-800 rounded animate-pulse" />
                {i < 3 && <div className="w-8 h-px bg-neutral-800 mx-2" />}
              </div>
            ))}
          </div>
        </div>

        {/* Two-column layout skeleton */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 max-w-7xl mx-auto px-4">
          {/* Left column */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Date card skeleton */}
            <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-lg bg-neutral-800 animate-pulse" />
                <div className="h-5 w-28 bg-neutral-800 rounded animate-pulse" />
              </div>
              <div className="h-12 bg-neutral-800 rounded-lg animate-pulse" />
              <div className="h-3 w-48 bg-neutral-800/70 rounded animate-pulse mt-3" />
            </div>

            {/* Time slots card skeleton */}
            <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-lg bg-neutral-800 animate-pulse" />
                <div className="h-5 w-36 bg-neutral-800 rounded animate-pulse" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-24 bg-neutral-800/50 rounded-xl animate-pulse" />
                ))}
              </div>
            </div>

            {/* Continue button skeleton */}
            <div className="hidden lg:block h-14 bg-neutral-800 rounded-xl animate-pulse" />
          </div>

          {/* Right column */}
          <div className="hidden lg:block w-[380px] xl:w-[420px] flex-shrink-0 space-y-4">
            {/* Room info skeleton */}
            <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden">
              <div className="aspect-video bg-neutral-800 animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-5 w-48 bg-neutral-800 rounded animate-pulse" />
                <div className="flex gap-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-7 w-20 bg-neutral-800 rounded-full animate-pulse" />
                  ))}
                </div>
              </div>
            </div>

            {/* Pricing skeleton */}
            <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-5 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-neutral-800 rounded animate-pulse" />
                <div className="h-5 w-36 bg-neutral-800 rounded animate-pulse" />
              </div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 w-16 bg-neutral-800/70 rounded animate-pulse" />
                  <div className="h-4 w-24 bg-neutral-800/70 rounded animate-pulse" />
                </div>
              ))}
              <div className="border-t border-neutral-800 pt-3 flex justify-between">
                <div className="h-5 w-12 bg-neutral-800 rounded animate-pulse" />
                <div className="h-6 w-16 bg-neutral-800 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
