'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface HeroOverlayProps {
    progress: number;
}

export default function HeroOverlay({ progress }: HeroOverlayProps) {
    // Fade out quickly as user scrolls: 0 -> 1 opacity, gone by progress 0.1
    // We want opacity to be 1 at 0, and 0 at 0.1
    const opacity = Math.max(0, 1 - progress * 15);
    const pointerEvents = opacity < 0.1 ? 'none' : 'auto';

    return (
        <motion.div
            className="absolute inset-0 z-30 pointer-events-none backdrop-blur-sm"
            style={{ opacity }}
        >
            <div
                className="absolute inset-0 flex flex-col items-center justify-center text-white pointer-events-auto mt-32"
                style={{ pointerEvents: pointerEvents as any }}
            >
                <h1
                    className="text-5xl sm:text-6xl md:text-8xl font-black uppercase tracking-widest leading-none drop-shadow-2xl text-center px-4"
                    style={{ fontFamily: 'var(--font-cinzel)' }}
                >
                    lock & lore
                </h1>
                <p className="text-xs sm:text-sm md:text-lg font-medium tracking-[0.2em] sm:tracking-[0.3em] uppercase opacity-80 mt-3 mb-8 text-center px-6">
                    Immersive Escape Rooms in Virginia Beach
                </p>
                <Button
                    variant="outline"
                    size="lg"
                    className="text-white border-white hover:bg-white hover:text-black uppercase tracking-widest bg-transparent/20 backdrop-blur-sm min-h-[48px] px-8"
                    onClick={() => {
                        const element = document.getElementById('rooms');
                        if (element) {
                            const offset = -150; // Negative offset to scroll further down
                            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                            const offsetPosition = elementPosition - offset;

                            window.scrollTo({
                                top: offsetPosition,
                                behavior: 'smooth'
                            });
                        }
                    }}
                >
                    View Our Rooms
                </Button>
            </div>
        </motion.div>
    );
}
