import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { Button } from './ui/button';

export default function Location() {
    return (
        <section id="location" className="pt-8 sm:pt-12 md:pt-16 pb-16 sm:pb-24 md:pb-32 bg-background relative overflow-hidden">
            <div className="container px-4 md:px-8 mx-auto">
                {/* Header */}
                <div className="mb-8 sm:mb-12 md:mb-16">
                    <h2
                        className="text-4xl sm:text-5xl md:text-[4rem] lg:text-[5.5rem] font-black text-white tracking-tight leading-[0.85] uppercase"
                        style={{ fontFamily: 'var(--font-cinzel)' }}
                    >
                        FIND US.
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8 sm:gap-12 lg:gap-16 items-center">
                    {/* Info Block */}
                    <div className="space-y-6 sm:space-y-8 lg:justify-self-start">
                        <div className="space-y-4 sm:space-y-6">
                            <div className="group">
                                <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" />
                                    <h4 className="text-sm sm:text-base md:text-lg font-bold text-white uppercase tracking-widest">Address</h4>
                                </div>
                                <p className="text-gray-400 text-xs sm:text-sm md:text-base leading-relaxed pl-6 sm:pl-8">
                                    138 S. Rosemont RD, STE #216<br />
                                    Virginia Beach, VA 23452
                                </p>
                            </div>

                            <div className="group">
                                <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" />
                                    <h4 className="text-sm sm:text-base md:text-lg font-bold text-white uppercase tracking-widest">Phone</h4>
                                </div>
                                <p className="text-gray-400 text-xs sm:text-sm md:text-base leading-relaxed pl-6 sm:pl-8">(757) 301-1862</p>
                            </div>

                            <div className="group">
                                <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" />
                                    <h4 className="text-sm sm:text-base md:text-lg font-bold text-white uppercase tracking-widest">Email</h4>
                                </div>
                                <p className="text-gray-400 text-xs sm:text-sm md:text-base leading-relaxed pl-6 sm:pl-8">lockandloreva@gmail.com</p>
                            </div>
                        </div>

                        <div className="pt-3 sm:pt-4">
                            <Button
                                size="lg"
                                href="https://www.google.com/maps/search/?api=1&query=138+S+Rosemont+RD+STE+216+Virginia+Beach+VA+23452"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white text-black hover:bg-white/90 rounded-full px-6 sm:px-8 h-10 sm:h-12 md:h-14 min-h-[44px] text-sm sm:text-base font-bold tracking-widest uppercase w-full md:w-auto transition-all duration-300"
                            >
                                Get Directions
                            </Button>
                        </div>
                    </div>

                    {/* Map Embed */}
                    <div className="h-[320px] sm:h-[400px] md:h-[480px] w-full rounded-xl sm:rounded-2xl border border-white/10 overflow-hidden lg:-mt-8">
                        <iframe
                            className="w-full h-full"
                            frameBorder="0"
                            scrolling="no"
                            src="https://maps.google.com/maps?width=600&height=400&hl=en&q=138%20S.%20Rosemont%20RD%2C%20STE%20%23216%20Virginia%20Beach%2C%20VA%2C%2023452&t=&z=15&ie=UTF8&iwloc=B&output=embed"
                            title="Lock & Lore Location"
                            allowFullScreen
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
