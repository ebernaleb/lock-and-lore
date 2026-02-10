"use client";

import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function GiftCardSection() {
    return (
        <section className="py-20 bg-background relative overflow-hidden">

            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2669&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>

            <div className="max-w-5xl mx-auto px-4 relative z-10 bg-neutral-900 rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center gap-8 md:gap-12">
                <div className="flex-1 space-y-4">
                    <Image
                        src="/images/mainlogo.png"
                        alt="Lock & Lore"
                        width={240}
                        height={80}
                        className="h-20 w-auto mb-4"
                    />
                    <h2 className="text-3xl md:text-5xl font-bold font-heading text-primary-dark uppercase">Gift Cards</h2>
                    <p className="text-gray-300">
                        Give the gift of adventure! Perfect for birthdays, holidays, or just because.
                        Available in any amount.
                    </p>
                    <Button size="lg" className="rounded-full uppercase tracking-wide mt-4">
                        Buy Now
                    </Button>
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
        <footer className="bg-black pt-12 pb-8 mt-20 sm:mt-24 relative">
            <div className="w-full px-4 sm:px-6 lg:px-8">
                {/* Main Footer Container */}
                <div className="bg-neutral-900 rounded-[2rem] px-12 md:px-16 pt-4 md:pt-6 pb-12 md:pb-16">




                    {/* Footer Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 md:items-center">
                        <div className="space-y-4 md:ml-12">
                            <Link href="/" className="inline-block mb-2">
                                <Image
                                    src="/images/fancy_logo.png"
                                    alt="Lock & Lore"
                                    width={864}
                                    height={288}
                                    className="h-72 w-auto"
                                />
                            </Link>
                        </div>

                        <div className="md:ml-16 md:self-center">
                            <h4 className="text-lg font-bold mb-4 uppercase tracking-wider text-white">Quick Links</h4>
                            <ul className="space-y-2 text-gray-400 text-sm">
                                <li><Link href="/rooms" className="hover:text-primary transition-colors">Our Rooms</Link></li>
                                <li><Link href="/rooms" className="hover:text-primary transition-colors">Book Now</Link></li>
                                <li><Link href="/" className="hover:text-primary transition-colors">Gift Cards</Link></li>
                                <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
                                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                            </ul>
                        </div>

                        <div className="md:self-center">
                            <h4 className="text-lg font-bold mb-4 uppercase tracking-wider text-white">Contact Us</h4>
                            <ul className="space-y-4 text-gray-400 text-sm">
                                <li className="flex gap-3">
                                    <MapPin className="w-5 h-5 text-primary shrink-0" />
                                    <span>138 S. Rosemont RD, STE #216, <br />Virginia Beach, VA 23452</span>
                                </li>
                                <li className="flex gap-3">
                                    <Phone className="w-5 h-5 text-primary shrink-0" />
                                    <span>(757) 301-1862</span>
                                </li>
                                <li className="flex gap-3">
                                    <Mail className="w-5 h-5 text-primary shrink-0" />
                                    <span>lockandloreva@gmail.com</span>
                                </li>
                            </ul>
                        </div>

                        <div className="md:self-center">
                            <h4 className="text-lg font-bold mb-4 uppercase tracking-wider text-white">Hours of Operation</h4>
                            <ul className="space-y-2 text-gray-400 text-sm">
                                <li className="flex justify-between border-b border-neutral-800 pb-1"><span>Monday:</span> <span>Closed</span></li>
                                <li className="flex justify-between border-b border-neutral-800 pb-1"><span>Tuesday:</span> <span>4:00 PM - 10:00 PM</span></li>
                                <li className="flex justify-between border-b border-neutral-800 pb-1"><span>Wednesday:</span> <span>Closed</span></li>
                                <li className="flex justify-between border-b border-neutral-800 pb-1"><span>Thursday:</span> <span>4:00 PM - 10:00 PM</span></li>
                                <li className="flex justify-between border-b border-neutral-800 pb-1"><span>Friday:</span> <span>4:00 PM - 11:00 PM</span></li>
                                <li className="flex justify-between border-b border-neutral-800 pb-1"><span>Saturday:</span> <span>11:00 AM - 11:00 PM</span></li>
                                <li className="flex justify-between border-b border-neutral-800 pb-1"><span>Sunday:</span> <span>11:00 AM - 11:00 PM</span></li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar - Inside the main container */}
                    <div className="pt-8 border-t border-neutral-800 text-gray-500 text-xs flex flex-col md:flex-row justify-between items-center gap-4">
                        <span>&copy; {new Date().getFullYear()} Lock & Lore Escape Rooms. All rights reserved.</span>
                        <div className="flex gap-4">
                            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
                            <Link href="/cancellation-policy" className="hover:text-primary transition-colors">Cancellation Policy</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}


