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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-24 items-center">
                    {/* Info Block */}
                    <div className="space-y-8 sm:space-y-12 lg:pl-24">
                        <div className="space-y-6 sm:space-y-10">
                            <div className="group">
                                <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white flex-shrink-0" />
                                    <h4 className="text-base sm:text-lg md:text-xl font-bold text-white uppercase tracking-widest">Address</h4>
                                </div>
                                <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed pl-8 sm:pl-10">
                                    123 Mystery Avenue,<br />
                                    Virginia Beach, VA 23451
                                </p>
                            </div>

                            <div className="group">
                                <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white flex-shrink-0" />
                                    <h4 className="text-base sm:text-lg md:text-xl font-bold text-white uppercase tracking-widest">Phone</h4>
                                </div>
                                <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed pl-8 sm:pl-10">(757) 555-0123</p>
                            </div>

                            <div className="group">
                                <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white flex-shrink-0" />
                                    <h4 className="text-base sm:text-lg md:text-xl font-bold text-white uppercase tracking-widest">Email</h4>
                                </div>
                                <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed pl-8 sm:pl-10">bookings@escaperoomva.com</p>
                            </div>
                        </div>

                        <div className="pt-4 sm:pt-6">
                            <Button size="lg" className="bg-white text-black hover:bg-white/90 rounded-full px-8 sm:px-10 h-12 sm:h-14 md:h-16 min-h-[48px] text-base sm:text-lg font-bold tracking-widest uppercase w-full md:w-auto shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-300">
                                Get Directions
                            </Button>
                        </div>
                    </div>

                    {/* Map Placeholder */}
                    <div className="h-[340px] sm:h-[400px] md:h-[480px] w-full bg-zinc-900 rounded-2xl sm:rounded-[2rem] border border-white/10 relative overflow-hidden group lg:-mt-8">
                        {/* Real implementation would use Google Maps Embed API */}
                        <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-500">
                            <span className="text-white/20 font-black text-lg sm:text-xl md:text-2xl tracking-[0.2em] uppercase">[ MAP EMBED ]</span>
                        </div>
                        {/* Stylized Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    </div>
                </div>
            </div>
        </section>
    );
}
