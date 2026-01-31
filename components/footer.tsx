import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-black relative overflow-hidden border-t border-white/10">

            <div className="container px-4 md:px-8 mx-auto py-16 md:py-20">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">

                    {/* Brand Section */}
                    <div className="md:col-span-4 text-center md:text-left">
                        <Link
                            href="/"
                            className="text-2xl sm:text-3xl font-bold tracking-[0.2em] text-white uppercase inline-block mb-4"
                            style={{ fontFamily: 'var(--font-cinzel)' }}
                        >
                            LOCK & LORE
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-xs mx-auto md:mx-0">
                            Immersive escape room experiences in Virginia Beach. Solve puzzles, uncover mysteries, and escape before time runs out.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div className="md:col-span-2 md:col-start-6 text-center md:text-left">
                        <h3 className="text-gray-300 text-sm font-semibold tracking-[0.2em] uppercase mb-6">Navigate</h3>
                        <nav className="flex flex-col gap-3">
                            <FooterLink href="/">Home</FooterLink>
                            <FooterLink href="#rooms">Our Rooms</FooterLink>
                            <FooterLink href="/waiver">Waiver</FooterLink>
                            <FooterLink href="/contact">Contact</FooterLink>
                        </nav>
                    </div>

                    {/* Information */}
                    <div className="md:col-span-2 text-center md:text-left">
                        <h3 className="text-gray-300 text-sm font-semibold tracking-[0.2em] uppercase mb-6">Info</h3>
                        <nav className="flex flex-col gap-3">
                            <FooterLink href="#faq">FAQ</FooterLink>
                            <FooterLink href="#location">Location</FooterLink>
                            <FooterLink href="#">Gift Cards</FooterLink>
                            <FooterLink href="#">Group Events</FooterLink>
                        </nav>
                    </div>

                    {/* Contact Info */}
                    <div className="md:col-span-3 text-center md:text-right">
                        <h3 className="text-gray-300 text-sm font-semibold tracking-[0.2em] uppercase mb-6">Get in Touch</h3>
                        <div className="flex flex-col gap-4 items-center md:items-end">
                            <a
                                href="https://www.google.com/maps/search/?api=1&query=138+S+Rosemont+RD+STE+216+Virginia+Beach+VA+23452"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-300"
                            >
                                <span className="text-sm">138 S. Rosemont RD, STE #216, Virginia Beach, VA 23452</span>
                                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-gray-500 group-hover:bg-white/5 transition-all duration-300">
                                    <MapPin className="w-3.5 h-3.5" />
                                </div>
                            </a>
                            <a
                                href="tel:+17573011862"
                                className="group flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-300"
                            >
                                <span className="text-sm">(757) 301-1862</span>
                                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-gray-500 group-hover:bg-white/5 transition-all duration-300">
                                    <Phone className="w-3.5 h-3.5" />
                                </div>
                            </a>
                            <a
                                href="mailto:lockandloreva@gmail.com"
                                className="group flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-300"
                            >
                                <span className="text-sm">lockandloreva@gmail.com</span>
                                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-gray-500 group-hover:bg-white/5 transition-all duration-300">
                                    <Mail className="w-3.5 h-3.5" />
                                </div>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 pt-8 border-t border-white/5">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-gray-600 tracking-wider">
                            &copy; {currentYear} Lock & Lore Escape Rooms. All Rights Reserved.
                        </p>
                        <div className="flex items-center gap-6">
                            <FooterLink href="#" small>Privacy Policy</FooterLink>
                            <span className="text-gray-700">|</span>
                            <FooterLink href="#" small>Terms of Service</FooterLink>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterLink({ href, children, small = false }: { href: string, children: React.ReactNode, small?: boolean }) {
    return (
        <Link
            href={href}
            className={`text-gray-400 hover:text-white transition-colors duration-300 ${small ? 'text-xs' : 'text-sm'}`}
        >
            {children}
        </Link>
    )
}
