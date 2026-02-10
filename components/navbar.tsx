"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MobileSidebar } from "@/components/MobileSidebar";

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
        <>
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

                        {/* Navigation & CTA - Right (Desktop) */}
                        <div className="hidden md:flex items-center gap-10 mr-4 lg:mr-8">
                            <div className="flex items-center gap-8">
                                <Link href="/rooms" className="text-gray-200 hover:text-white transition-colors duration-200 text-[13px] font-semibold tracking-[0.12em] uppercase">Escape Rooms</Link>
                                <Link href="/faq" className="text-gray-200 hover:text-white transition-colors duration-200 text-[13px] font-semibold tracking-[0.12em] uppercase">FAQ</Link>
                                <Link href="/contact" className="text-gray-200 hover:text-white transition-colors duration-200 text-[13px] font-semibold tracking-[0.12em] uppercase">Contact</Link>
                            </div>

                            <Button asChild size="sm" className="rounded-full uppercase tracking-[0.1em] font-semibold">
                                <Link href="/book">
                                    Book Now
                                </Link>
                            </Button>
                        </div>

                        {/* Mobile Menu Button - Hamburger */}
                        <div className="flex md:hidden mr-2">
                            <button
                                onClick={() => setIsOpen(true)}
                                className={cn(
                                    "inline-flex items-center justify-center p-2.5 rounded-full",
                                    "text-gray-300 hover:text-white",
                                    "bg-white/0 hover:bg-white/10",
                                    "border border-white/0 hover:border-white/10",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                                    "transition-all duration-200"
                                )}
                                aria-label="Open navigation menu"
                                aria-expanded={isOpen}
                                aria-controls="mobile-sidebar"
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Sidebar Drawer */}
            <MobileSidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
}
