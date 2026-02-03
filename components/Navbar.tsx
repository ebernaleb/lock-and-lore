"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown, ShoppingBag } from "lucide-react";
// import { Button } from "@/components/ui/button"; 
// Removed unused import.
import { cn } from "@/lib/utils";
import { CartDrawer } from "./CartDrawer";

// I'll create a simple reusable Button component inline or in a separate file if needed. For now I'll use standard HTML button with classes.

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    return (
        <nav className="fixed top-0 w-full z-50 bg-white border-b border-gray-200 shadow-sm">
            <div className="w-full px-4 sm:px-6 lg:px-12">
                <div className="flex items-center justify-between h-16">
                    {/* Logo Section - Left */}
                    <div className="flex-shrink-0 ml-8 lg:ml-16">
                        <Link href="/" className="text-2xl font-heading font-bold text-primary tracking-wider uppercase drop-shadow-sm">
                            Lock & Lore
                        </Link>
                    </div>

                    {/* Navigation & CTA - Right */}
                    <div className="hidden md:flex items-center space-x-8 mr-4 lg:mr-8">
                        <div className="flex items-baseline space-x-8">
                            <Link href="/#rooms" className="text-gray-900 hover:text-primary transition-colors px-3 py-1 rounded-md text-sm font-bold tracking-wide">ESCAPE ROOMS</Link>
                            <Link href="/contact" className="text-gray-900 hover:text-primary transition-colors px-3 py-1 rounded-md text-sm font-bold tracking-wide">CONTACT</Link>
                        </div>

                        {/* Cart Button */}
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="p-2 text-gray-900 hover:text-primary transition-colors relative group"
                            aria-label="Open cart"
                        >
                            <ShoppingBag className="w-6 h-6" />
                            <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">1</span>
                        </button>

                        <button className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-full transition-all uppercase tracking-wide text-sm">
                            Book Now
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="-mr-2 flex md:hidden">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="p-2 text-gray-900 hover:text-primary transition-colors relative"
                            >
                                <ShoppingBag className="w-6 h-6" />
                                <span className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">1</span>
                            </button>
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-primary hover:bg-gray-100 focus:outline-none"
                            >
                                <span className="sr-only">Open main menu</span>
                                {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-b border-gray-200">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link href="/" className="block text-gray-900 hover:text-primary px-3 py-2 rounded-md text-base font-medium">HOME</Link>
                        <Link href="#" className="block text-gray-900 hover:text-primary px-3 py-2 rounded-md text-base font-medium">ESCAPE ROOMS</Link>
                        <Link href="#" className="block text-gray-900 hover:text-primary px-3 py-2 rounded-md text-base font-medium">CONTACT US</Link>
                        <button className="w-full mt-4 bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-full transition-all uppercase tracking-wide">
                            Book Now
                        </button>
                    </div>
                </div>
            )}

            {/* Cart Drawer */}
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </nav>
    );
}
