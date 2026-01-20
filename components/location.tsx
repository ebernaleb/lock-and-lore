import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { Button } from './ui/button';

export default function Location() {
    return (
        <section id="location" className="pt-8 sm:pt-12 md:pt-16 pb-16 sm:pb-24 md:pb-32 bg-background relative overflow-hidden">
            <div className="container px-4 md:px-8 mx-auto">
                {/* Header */}
                <div className="mb-8 sm:mb-12 md:mb-16 text-center sm:text-right">
                    <h2
                        className="text-4xl sm:text-5xl md:text-[4rem] lg:text-[5.5rem] font-black text-white tracking-tight leading-[0.85] uppercase"
                        style={{ fontFamily: 'var(--font-cinzel)' }}
                    >
                        FIND US.
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8 sm:gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
                    {/* Info Block */}
                    <div className="space-y-6 sm:space-y-8 lg:pl-12">
                        <div className="space-y-4 sm:space-y-6">
                            <div className="group">
                                <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" />
                                    <h4 className="text-sm sm:text-base md:text-lg font-bold text-white uppercase tracking-widest">Address</h4>
                                </div>
                                <p className="text-gray-400 text-xs sm:text-sm md:text-base leading-relaxed pl-6 sm:pl-8">
                                    123 Mystery Avenue,<br />
                                    Virginia Beach, VA 23451
                                </p>
                            </div>

                            <div className="group">
                                <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" />
                                    <h4 className="text-sm sm:text-base md:text-lg font-bold text-white uppercase tracking-widest">Phone</h4>
                                </div>
                                <p className="text-gray-400 text-xs sm:text-sm md:text-base leading-relaxed pl-6 sm:pl-8">(757) 555-0123</p>
                            </div>

                            <div className="group">
                                <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" />
                                    <h4 className="text-sm sm:text-base md:text-lg font-bold text-white uppercase tracking-widest">Email</h4>
                                </div>
                                <p className="text-gray-400 text-xs sm:text-sm md:text-base leading-relaxed pl-6 sm:pl-8">bookings@escaperoomva.com</p>
                            </div>
                        </div>

                        <div className="pt-3 sm:pt-4">
                            <Button size="lg" className="bg-white text-black hover:bg-white/90 rounded-full px-6 sm:px-8 h-10 sm:h-12 md:h-14 min-h-[44px] text-sm sm:text-base font-bold tracking-widest uppercase w-full md:w-auto transition-all duration-300">
                                Get Directions
                            </Button>
                        </div>
                    </div>

                    {/* Map Placeholder */}
                    <div className="h-[320px] sm:h-[400px] md:h-[480px] w-full bg-zinc-900 rounded-xl sm:rounded-2xl border border-white/10 relative overflow-hidden group lg:-mt-8">
                        {/* Real implementation would use Google Maps Embed API */}
                        <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-500">
                            <span className="text-white/20 font-black text-base sm:text-lg md:text-xl tracking-[0.2em] uppercase">[ MAP EMBED ]</span>
                        </div>
                        {/* Stylized Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    </div>
                </div>
            </div>
        </section>
    );
}
