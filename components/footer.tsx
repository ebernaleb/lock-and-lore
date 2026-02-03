"use client";

import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function GiftCardSection() {
    return (
        <section className="py-20 bg-background relative overflow-hidden">

            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2669&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>

            <div className="max-w-5xl mx-auto px-4 relative z-10 bg-white rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center gap-8 md:gap-12">
                <div className="flex-1 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold font-heading text-primary-dark uppercase">Gift Cards</h2>
                    <p className="text-gray-600">
                        Give the gift of adventure! Perfect for birthdays, holidays, or just because.
                        Available in any amount.
                    </p>
                    <button className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-full transition-all uppercase tracking-wide mt-4">
                        Buy Now
                    </button>
                </div>
                <div className="flex-1 w-full relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                    {/* Gift Card Visual - simple CSS design */}
                    <div className="absolute inset-0 bg-black text-white flex flex-col items-center justify-center border-4 border-[#FFD700] p-6 bg-gradient-to-br from-gray-900 to-black">
                        <span className="text-3xl font-heading text-primary font-bold">Lock & Lore</span>
                        <span className="text-xl tracking-widest uppercase mt-2">Gift Card</span>
                        <div className="absolute bottom-6 right-6 text-2xl font-bold text-[#FFD700]">$50</div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export function Footer() {
    return (
        <footer className="bg-[#f9f9f9] py-16 relative">
            <div className="w-full px-4 sm:px-6 lg:px-8">
                {/* Main Footer Container with Light Red Background */}
                <div className="bg-red-100 rounded-[2rem] p-12 md:p-16 shadow-sm">




                    {/* Footer Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div className="space-y-4">
                            <Link href="/" className="text-2xl font-heading font-bold text-primary tracking-wider uppercase inline-block mb-2">
                                Lock & Lore
                            </Link>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Premier immersive escape room experiences. Great for families, friends, and team building.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-lg font-bold mb-4 uppercase tracking-wider text-gray-900">Quick Links</h4>
                            <ul className="space-y-2 text-gray-600 text-sm">
                                <li><Link href="/" className="hover:text-primary transition-colors">Our Rooms</Link></li>
                                <li><Link href="/" className="hover:text-primary transition-colors">Book Now</Link></li>
                                <li><Link href="/" className="hover:text-primary transition-colors">Gift Cards</Link></li>
                                <li><Link href="/" className="hover:text-primary transition-colors">FAQ</Link></li>
                                <li><Link href="/" className="hover:text-primary transition-colors">Contact Us</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-lg font-bold mb-4 uppercase tracking-wider text-gray-900">Contact Us</h4>
                            <ul className="space-y-4 text-gray-600 text-sm">
                                <li className="flex gap-3">
                                    <MapPin className="w-5 h-5 text-primary shrink-0" />
                                    <span>123 Adventure Way, <br />Mystery City, MC 12345</span>
                                </li>
                                <li className="flex gap-3">
                                    <Phone className="w-5 h-5 text-primary shrink-0" />
                                    <span>(555) 123-4567</span>
                                </li>
                                <li className="flex gap-3">
                                    <Mail className="w-5 h-5 text-primary shrink-0" />
                                    <span>hello@lockandlore.com</span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-lg font-bold mb-4 uppercase tracking-wider text-gray-900">Hours of Operation</h4>
                            <ul className="space-y-2 text-gray-600 text-sm">
                                <li className="flex justify-between border-b border-gray-200 pb-1"><span>Mon-Thu:</span> <span>10:00 AM - 10:00 PM</span></li>
                                <li className="flex justify-between border-b border-gray-200 pb-1"><span>Fri-Sat:</span> <span>10:00 AM - 11:30 PM</span></li>
                                <li className="flex justify-between border-b border-gray-200 pb-1"><span>Sun:</span> <span>10:00 AM - 9:00 PM</span></li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar - Inside the main container */}
                    <div className="pt-8 border-t border-gray-200 text-gray-500 text-xs flex flex-col md:flex-row justify-between items-center gap-4">
                        <span>&copy; {new Date().getFullYear()} Lock & Lore Escape Rooms. All rights reserved.</span>
                        <div className="flex gap-4">
                            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
                            <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}


