'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { BOOKING_URL, cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const isHomePage = pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const vh = window.innerHeight;

            // Hero section scroll logic
            // Hero is 350vh tall total, so scrollable distance is ~250vh
            // Text fades out early (around 0.1 progress)
            const heroScrollDistance = vh * 2.5;
            const hideThreshold = heroScrollDistance * 0.1; // When text disappears
            const showThreshold = heroScrollDistance; // When hero ends

            // Navbar background logic
            setIsScrolled(scrollY > 20);

            // Navbar visibility logic
            // Hide if we are past the text fade but still in the hero scroll sequence
            if (scrollY > hideThreshold && scrollY < showThreshold) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
        };

        window.addEventListener('scroll', handleScroll);
        // Trigger once on mount
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Rooms', href: '#rooms' },
        { name: 'Waiver', href: '/waiver' },
        { name: 'Location', href: '#location' },
        { name: 'Contact', href: '/contact' },
    ];

    return (
        <>
            <nav
                className={cn(
                    'fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b border-white/0',
                    isScrolled ? 'bg-black/80 backdrop-blur-md border-white/5 py-4' : 'bg-transparent py-6',
                    !isVisible && !isMobileMenuOpen && '-translate-y-full'
                )}
            >
                <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="text-2xl font-bold tracking-[0.2em] text-white uppercase relative"
                        style={{ fontFamily: 'var(--font-cinzel)' }}
                    >
                        LOCK & LORE
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => {
                            // Special handling for Rooms link
                            if (link.name === 'Rooms') {
                                return (
                                    <button
                                        key={link.name}
                                        onClick={() => {
                                            if (!isHomePage) {
                                                router.push('/#rooms');
                                                return;
                                            }
                                            const element = document.getElementById('rooms');
                                            if (element) {
                                                const offset = -150;
                                                const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                                                const offsetPosition = elementPosition - offset;

                                                window.scrollTo({
                                                    top: offsetPosition,
                                                    behavior: 'smooth'
                                                });
                                            }
                                        }}
                                        className="text-sm font-extrabold text-white border-2 border-white rounded-full px-4 py-1.5 transition-all duration-300 tracking-widest uppercase hover:bg-white hover:text-black"
                                    >
                                        {link.name}
                                    </button>
                                );
                            }

                            // Special handling for Home link - scroll to top or navigate home
                            if (link.name === 'Home') {
                                return (
                                    <button
                                        key={link.name}
                                        onClick={() => {
                                            if (!isHomePage) {
                                                router.push('/');
                                                return;
                                            }
                                            window.scrollTo({
                                                top: 0,
                                                behavior: 'smooth'
                                            });
                                        }}
                                        className="text-sm font-extrabold text-white border-2 border-white rounded-full px-4 py-1.5 transition-all duration-300 tracking-widest uppercase hover:bg-white hover:text-black"
                                    >
                                        {link.name}
                                    </button>
                                );
                            }

                            // Special handling for Location link - scroll to location section
                            if (link.name === 'Location') {
                                return (
                                    <button
                                        key={link.name}
                                        onClick={() => {
                                            if (!isHomePage) {
                                                router.push('/#location');
                                                return;
                                            }
                                            const element = document.getElementById('location');
                                            if (element) {
                                                const offset = 25;
                                                const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                                                const offsetPosition = elementPosition - offset;

                                                window.scrollTo({
                                                    top: offsetPosition,
                                                    behavior: 'smooth'
                                                });
                                            }
                                        }}
                                        className="text-sm font-extrabold text-white border-2 border-white rounded-full px-4 py-1.5 transition-all duration-300 tracking-widest uppercase hover:bg-white hover:text-black"
                                    >
                                        {link.name}
                                    </button>
                                );
                            }

                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-sm font-extrabold text-white border-2 border-white rounded-full px-4 py-1.5 transition-all duration-300 tracking-widest uppercase hover:bg-white hover:text-black flex items-center"
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Mobile Toggle - Improved touch target */}
                    <button
                        className="md:hidden text-white z-[80] p-3 -mr-3 min-w-[44px] min-h-[44px] flex items-center justify-center"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Backdrop - Outside nav to avoid transform issues */}
            <div
                className={cn(
                    'fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden z-[60]',
                    isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                )}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Menu Sidebar - Outside nav to avoid transform issues */}
            <div
                className={cn(
                    'fixed top-0 right-0 bottom-0 w-[80%] bg-black flex flex-col items-center justify-center gap-6 transition-transform duration-300 ease-in-out md:hidden z-[70]',
                    isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                )}
            >
                {navLinks.map((link) => {
                    // Special handling for Rooms link in mobile menu
                    if (link.name === 'Rooms') {
                        return (
                            <button
                                key={link.name}
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    if (!isHomePage) {
                                        router.push('/#rooms');
                                        return;
                                    }
                                    setTimeout(() => {
                                        const element = document.getElementById('rooms');
                                        if (element) {
                                            const offset = -150;
                                            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                                            const offsetPosition = elementPosition - offset;
                                            window.scrollTo({
                                                top: offsetPosition,
                                                behavior: 'smooth'
                                            });
                                        }
                                    }, 100);
                                }}
                                className="text-2xl font-light text-white tracking-widest uppercase min-h-[44px] px-4"
                            >
                                {link.name}
                            </button>
                        );
                    }

                    // Special handling for Home link
                    if (link.name === 'Home') {
                        return (
                            <button
                                key={link.name}
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    if (!isHomePage) {
                                        router.push('/');
                                        return;
                                    }
                                    setTimeout(() => {
                                        window.scrollTo({
                                            top: 0,
                                            behavior: 'smooth'
                                        });
                                    }, 100);
                                }}
                                className="text-2xl font-light text-white tracking-widest uppercase min-h-[44px] px-4"
                            >
                                {link.name}
                            </button>
                        );
                    }

                    // Special handling for Location link
                    if (link.name === 'Location') {
                        return (
                            <button
                                key={link.name}
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    if (!isHomePage) {
                                        router.push('/#location');
                                        return;
                                    }
                                    setTimeout(() => {
                                        const element = document.getElementById('location');
                                        if (element) {
                                            const offset = 0;
                                            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                                            const offsetPosition = elementPosition - offset;
                                            window.scrollTo({
                                                top: offsetPosition,
                                                behavior: 'smooth'
                                            });
                                        }
                                    }, 100);
                                }}
                                className="text-2xl font-light text-white tracking-widest uppercase min-h-[44px] px-4"
                            >
                                {link.name}
                            </button>
                        );
                    }

                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-2xl font-light text-white tracking-widest uppercase min-h-[44px] flex items-center px-4"
                        >
                            {link.name}
                        </Link>
                    );
                })}
            </div>
        </>
    );
}
