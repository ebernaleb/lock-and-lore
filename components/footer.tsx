import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-black py-12 sm:py-16 md:py-20 border-t border-white/10">
            <div className="container px-4 md:px-8 mx-auto">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 md:gap-16 mb-8 sm:mb-12">

                    {/* Brand Section */}
                    <div className="text-center md:text-left">
                        <Link
                            href="/"
                            className="text-2xl sm:text-3xl font-bold tracking-[0.2em] text-white uppercase inline-block mb-3 sm:mb-4 min-h-[44px] flex items-center justify-center md:justify-start"
                            style={{ fontFamily: 'var(--font-cinzel)' }}
                        >
                            LOCK & LORE
                        </Link>
                        <p className="text-xs sm:text-sm text-gray-500 tracking-wider uppercase">
                            Immersive Escape Rooms
                            <br />
                            Virginia Beach, VA
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="text-center">
                        <h3 className="text-white font-bold tracking-widest uppercase text-xs sm:text-sm mb-3 sm:mb-4">Quick Links</h3>
                        <div className="flex flex-col gap-2 sm:gap-3">
                            <FooterLink href="/">Home</FooterLink>
                            <FooterLink href="#rooms">Our Rooms</FooterLink>
                            <FooterLink href="/waiver">Waiver</FooterLink>
                            <FooterLink href="/contact">Contact</FooterLink>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="text-center md:text-right">
                        <h3 className="text-white font-bold tracking-widest uppercase text-xs sm:text-sm mb-3 sm:mb-4">Contact</h3>
                        <div className="flex flex-col gap-2 sm:gap-3 items-center md:items-end">
                            <div className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm">
                                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                                <span>Virginia Beach, VA</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm">
                                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                                <span>(757) 555-0123</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm">
                                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                                <span className="break-all">bookings@lockandlore.com</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-6 sm:pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
                    <p className="text-[10px] sm:text-xs text-gray-600 tracking-widest uppercase text-center md:text-left">
                        &copy; {currentYear} Lock & Lore. All Rights Reserved.
                    </p>
                    <div className="flex gap-4 sm:gap-6">
                        <FooterLink href="#">Privacy Policy</FooterLink>
                        <FooterLink href="#">Terms of Service</FooterLink>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="text-gray-500 hover:text-white text-[10px] sm:text-xs uppercase tracking-widest transition-colors duration-300 min-h-[44px] flex items-center justify-center md:justify-start"
        >
            {children}
        </Link>
    )
}
