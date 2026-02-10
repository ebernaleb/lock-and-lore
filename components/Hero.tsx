import Link from "next/link";

export function Hero() {
    return (
        <section
            className="relative h-screen min-h-[600px] flex flex-col overflow-hidden bg-black"
            style={{ minHeight: "100svh" }}
        >
            {/* Background Video - covers full viewport, 115% zoom, favoring left bottom */}
            <video
                className="absolute inset-0 z-0 w-full h-full object-cover will-change-transform"
                style={{
                    transform: "scale(1.15)",
                    transformOrigin: "left bottom",
                    filter: "blur(2px) brightness(0.7)",
                }}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                aria-hidden="true"
            >
                <source src="/videos/a3fc94bc-65a9-41a2-a806-3afcac802015.mp4" type="video/mp4" />
            </video>

            {/* Top gradient overlay - darkness at top */}
            <div
                className="absolute inset-x-0 top-0 h-48 z-[1] pointer-events-none"
                style={{
                    background: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)"
                }}
                aria-hidden="true"
            />

            {/* Bottom gradient overlay - darkness fades down for seamless transition */}
            <div
                className="absolute inset-x-0 bottom-0 h-96 z-[1] pointer-events-none"
                style={{
                    background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.3) 70%, transparent 100%)"
                }}
                aria-hidden="true"
            />

            {/* --- PREVIOUS IMAGE BACKGROUND (commented out for easy rollback) ---
            <div
                className="absolute inset-0 z-0 will-change-transform"
                style={{
                    backgroundImage: "url('/images/hero_img.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "25% 45%",
                    backgroundRepeat: "no-repeat",
                }}
                aria-hidden="true"
            />
            --- END PREVIOUS IMAGE BACKGROUND --- */}

            {/* Main content area - vertically centered, accounting for navbar (h-16 = 64px) */}
            <div className="relative z-10 flex-1 flex items-center w-full pt-32">
                <div className="w-full px-5 sm:px-8 md:px-12 lg:px-20">
                    <div className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl">
                        {/* Text Content - left aligned */}
                        <div className="flex flex-col items-start space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8">
                            <h1
                                className="-ml-1 text-white drop-shadow-xl [text-shadow:0_4px_16px_rgba(0,0,0,0.4),0_8px_32px_rgba(0,0,0,0.2)]"
                                style={{
                                    fontFamily: 'var(--font-playfair)',
                                    fontWeight: 700,
                                    letterSpacing: '-0.02em',
                                    lineHeight: 1.05,
                                    fontSize: 'clamp(40px, 5vw, 56px)'
                                }}
                            >
                                Think Beyond Locks.
                                <br />
                                <span
                                    className="whitespace-nowrap"
                                    style={{
                                        fontWeight: 600,
                                        background: 'linear-gradient(180deg, #FFED4E 0%, #D4952A 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text'
                                    }}
                                >
                                    Escape Awaits You.
                                </span>
                            </h1>

                            <p
                                className="text-sm sm:text-base md:text-lg text-gray-200 max-w-md [text-shadow:0_2px_8px_rgba(0,0,0,0.5)]"
                                style={{
                                    fontFamily: 'var(--font-inter)',
                                    fontWeight: 400,
                                    lineHeight: 1.6
                                }}
                            >
                                Immersive, private escape rooms in Virginia Beach,
                                Virginia. Work together, solve puzzles, and have the
                                adventure of a lifetime!
                            </p>

                            {/* CTA button */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-1 w-full sm:w-auto">
                                <Link
                                    href="/rooms"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base rounded-full uppercase tracking-wide transition-all duration-300 relative overflow-hidden group"
                                    style={{
                                        fontFamily: 'var(--font-inter)',
                                        fontWeight: 600,
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        backdropFilter: 'blur(10px)',
                                        WebkitBackdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                                        color: 'white'
                                    }}
                                >
                                    <span className="relative z-10">View Rooms</span>
                                    <div
                                        className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        style={{ backdropFilter: 'blur(10px)' }}
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    );
}
