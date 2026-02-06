"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        // Check initial scroll position (e.g. if user refreshes mid-page)
        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        // Navigate to homepage
        router.push("/");
        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <nav className={cn(
            "fixed top-0 w-full z-50 transition-all duration-300",
            scrolled ? "bg-black/95 backdrop-blur-md shadow-lg shadow-black/20" : "bg-transparent"
        )}>
            <div className="w-full px-4 sm:px-6 lg:px-12">
                <div className="flex items-center justify-between h-18">
                    {/* Logo Section - Left */}
                    <div className="flex-shrink-0 ml-8 lg:ml-16">
                        <Link
                            href="/"
                            onClick={handleLogoClick}
                            className="relative block"
                        >
                            <Image
                                src="/images/mainlogo.png"
                                alt="Lock & Lore"
                                width={320}
                                height={107}
                                className="h-20 w-auto"
                                priority
                            />
                        </Link>
                    </div>

                    {/* Navigation & CTA - Right */}
                    <div className="hidden md:flex items-center gap-10 mr-4 lg:mr-8">
                        <div className="flex items-center gap-8">
                            <Link href="/rooms" className="text-gray-200 hover:text-white transition-colors duration-200 text-[13px] font-semibold tracking-[0.12em] uppercase">Escape Rooms</Link>
                            <Link href="/faq" className="text-gray-200 hover:text-white transition-colors duration-200 text-[13px] font-semibold tracking-[0.12em] uppercase">FAQ</Link>
                            <Link href="/contact" className="text-gray-200 hover:text-white transition-colors duration-200 text-[13px] font-semibold tracking-[0.12em] uppercase">Contact</Link>
                        </div>

                        <Link
                            href="/rooms"
                            className="bg-primary hover:bg-primary-dark text-neutral-950 font-semibold py-1.5 px-4 text-sm rounded-full shadow-[0_4px_0_0_rgba(122,92,32,1)] hover:shadow-[0_2px_0_0_rgba(122,92,32,1)] active:shadow-[0_0px_0_0_rgba(122,92,32,1)] hover:translate-y-[2px] active:translate-y-[4px] transition-all duration-150 relative before:absolute before:inset-0 before:rounded-full before:shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.2)] before:pointer-events-none uppercase tracking-[0.1em]"
                        >
                            <span className="relative z-10">Book Now</span>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none transition-colors duration-200"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-white/5">
                    <div className="px-5 pt-4 pb-5 space-y-1">
                        <Link href="/" onClick={() => setIsOpen(false)} className="block text-gray-200 hover:text-white hover:bg-white/5 px-4 py-3 rounded-lg text-sm font-semibold tracking-[0.1em] uppercase transition-colors duration-200">Home</Link>
                        <Link href="/rooms" onClick={() => setIsOpen(false)} className="block text-gray-200 hover:text-white hover:bg-white/5 px-4 py-3 rounded-lg text-sm font-semibold tracking-[0.1em] uppercase transition-colors duration-200">Escape Rooms</Link>
                        <Link href="/faq" onClick={() => setIsOpen(false)} className="block text-gray-200 hover:text-white hover:bg-white/5 px-4 py-3 rounded-lg text-sm font-semibold tracking-[0.1em] uppercase transition-colors duration-200">FAQ</Link>
                        <Link href="/contact" onClick={() => setIsOpen(false)} className="block text-gray-200 hover:text-white hover:bg-white/5 px-4 py-3 rounded-lg text-sm font-semibold tracking-[0.1em] uppercase transition-colors duration-200">Contact</Link>
                        <div className="pt-3">
                            <Link
                                href="/rooms"
                                onClick={() => setIsOpen(false)}
                                className="block w-full text-center bg-primary hover:bg-primary-dark text-neutral-950 font-medium py-3 text-base rounded-full shadow-[0_4px_0_0_rgba(122,92,32,1)] hover:shadow-[0_2px_0_0_rgba(122,92,32,1)] active:shadow-[0_0px_0_0_rgba(122,92,32,1)] hover:translate-y-[2px] active:translate-y-[4px] transition-all duration-150 relative before:absolute before:inset-0 before:rounded-full before:shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.2)] before:pointer-events-none uppercase tracking-[0.1em]"
                            >
                                <span className="relative z-10">Book Now</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
