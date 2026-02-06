import Link from "next/link";
import { Ticket } from "lucide-react";

export function Hero() {
    return (
        <section
            className="relative h-screen min-h-[600px] flex flex-col overflow-hidden bg-black"
            style={{ minHeight: "100svh" }}
        >
            {/* Background Image - covers full viewport */}
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

            {/* Multi-layer overlay for depth and readability */}
            {/* Base dark overlay across entire image */}
            <div
                className="absolute inset-0 z-[1] bg-black/30"
                aria-hidden="true"
            />
            {/* Left-side gradient for text readability */}
            <div
                className="absolute inset-0 z-[2]"
                style={{
                    background: "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 20%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.5) 50%, transparent 70%)",
                }}
                aria-hidden="true"
            />
            {/* Bottom gradient for scroll indicator area and visual grounding */}
            <div
                className="absolute inset-x-0 bottom-0 h-48 z-[2] bg-gradient-to-t from-black/70 via-black/20 to-transparent"
                aria-hidden="true"
            />

            {/* Main content area - vertically centered, accounting for navbar (h-16 = 64px) */}
            <div className="relative z-10 flex-1 flex items-center w-full pt-16">
                <div className="w-full px-5 sm:px-8 md:px-12 lg:px-20">
                    <div className="w-full max-w-2xl ml-auto mr-auto lg:ml-[5%] lg:mr-auto">
                        {/* Text Content */}
                        <div className="flex flex-col items-start space-y-5 sm:space-y-6">
                            <h1 className="text-[2.5rem] sm:text-[3rem] md:text-[4rem] lg:text-[4.5rem] font-black leading-[1.05] text-white drop-shadow-xl font-heading tracking-normal [text-shadow:0_4px_16px_rgba(0,0,0,0.4),0_8px_32px_rgba(0,0,0,0.2)]">
                                The Door Is Locked.
                                <br />
                                <span className="text-primary whitespace-nowrap">
                                    Your Mind Is the Key.
                                </span>
                            </h1>

                            <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-lg leading-relaxed [text-shadow:0_2px_8px_rgba(0,0,0,0.5)]">
                                Immersive, private escape rooms in Virginia Beach,
                                Virginia. Work together, solve puzzles, and have the
                                adventure of a lifetime!
                            </p>

                            {/* CTA button */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full sm:w-auto">
                                <Link
                                    href="/rooms"
                                    className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-neutral-950 font-medium px-6 py-3 text-base rounded-full shadow-[0_4px_0_0_rgba(122,92,32,1)] hover:shadow-[0_2px_0_0_rgba(122,92,32,1)] active:shadow-[0_0px_0_0_rgba(122,92,32,1)] hover:translate-y-[2px] active:translate-y-[4px] transition-all duration-150 relative before:absolute before:inset-0 before:rounded-full before:shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.2)] before:pointer-events-none uppercase tracking-wide"
                                >
                                    <Ticket className="w-5 h-5 relative z-10" />
                                    <span className="relative z-10">Check Availability</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    );
}
