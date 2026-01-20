'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { rooms } from '@/lib/rooms';
import { Button } from './ui/button';
import { BOOKING_URL } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Clock, Users, Gauge } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RoomCarousel() {
    const headerRef = useRef<HTMLHeadingElement>(null);
    const [paddingLeft, setPaddingLeft] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [cardWidth, setCardWidth] = useState(0);
    const [gap, setGap] = useState(64);
    const [isMobile, setIsMobile] = useState(false);

    const updateLayout = () => {
        const mobile = window.innerWidth < 640;
        const isTablet = window.innerWidth >= 640 && window.innerWidth < 768;
        setIsMobile(mobile);

        if (headerRef.current && !mobile) {
            const rect = headerRef.current.getBoundingClientRect();
            setPaddingLeft(rect.left);
        } else {
            setPaddingLeft(40); // Center card with 40px on each side
        }

        if (mobile) {
            setCardWidth(window.innerWidth - 40);
            setGap(24);
        } else if (isTablet) {
            setCardWidth(380);
            setGap(32);
        } else {
            setCardWidth(window.innerWidth * 0.60);
            setGap(64);
        }
    };

    useEffect(() => {
        updateLayout();
        window.addEventListener('resize', updateLayout);
        // Initial delay to ensure layout
        setTimeout(updateLayout, 100);
        return () => window.removeEventListener('resize', updateLayout);
    }, []);

    // Bounds check
    const maxIndex = rooms.length - 1;
    const canScrollLeft = currentIndex > 0;
    const canScrollRight = currentIndex < maxIndex;

    const navigate = (direction: 'left' | 'right') => {
        if (direction === 'left' && canScrollLeft) {
            setCurrentIndex(prev => prev - 1);
        } else if (direction === 'right' && canScrollRight) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    return (
        <section id="rooms" className="pt-24 sm:pt-32 md:pt-40 lg:pt-64 pb-40 sm:pb-24 md:pb-32 bg-background relative overflow-hidden">
            <div className="relative">
                {/* Header */}
                <div className="container px-4 md:px-8 mx-auto mb-8 sm:mb-12 md:mb-16 flex items-end justify-between">
                    <h2
                        ref={headerRef}
                        className="text-4xl sm:text-5xl md:text-[4rem] lg:text-[5.5rem] font-black text-white tracking-tight leading-[0.85] uppercase"
                        style={{ fontFamily: 'var(--font-cinzel)' }}
                    >
                        OUR
                        <br />
                        ROOMS.
                    </h2>

                    {/* Arrow Navigation */}
                    <div className="flex gap-2 sm:gap-3 md:gap-4 pb-2">
                        <button
                            onClick={() => navigate('left')}
                            className={`w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-white text-black flex items-center justify-center transition-all duration-300 hover:bg-white/90 hover:scale-110 min-w-[44px] min-h-[44px] ${canScrollLeft
                                ? 'opacity-100 cursor-pointer'
                                : 'opacity-0 pointer-events-none'
                                }`}
                            aria-label="Scroll left"
                        >
                            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
                        </button>
                        <button
                            onClick={() => navigate('right')}
                            className={`w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-white text-black flex items-center justify-center transition-all duration-300 hover:bg-white/90 hover:scale-110 min-w-[44px] min-h-[44px] ${canScrollRight
                                ? 'opacity-100 cursor-pointer'
                                : 'opacity-0 pointer-events-none'
                                }`}
                            aria-label="Scroll right"
                        >
                            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
                        </button>
                    </div>
                </div>

                {/* Carousel Track */}
                <div
                    className="overflow-visible touch-pan-y"
                    style={{
                        paddingLeft: `${paddingLeft}px`,
                    }}
                >
                    <motion.div
                        className="flex gap-6 sm:gap-8 md:gap-16"
                        animate={{
                            x: -(currentIndex * (cardWidth + gap))
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 150,
                            damping: 25,
                            mass: 1
                        }}
                        drag="x"
                        dragConstraints={{ left: -(rooms.length - 1) * (cardWidth + gap), right: 0 }}
                        dragElastic={0.1}
                        onDragEnd={(e, { offset, velocity }) => {
                            const swipe = offset.x;
                            const swipeThreshold = cardWidth / 3;

                            if (swipe < -swipeThreshold && canScrollRight) {
                                setCurrentIndex(prev => prev + 1);
                            } else if (swipe > swipeThreshold && canScrollLeft) {
                                setCurrentIndex(prev => prev - 1);
                            }
                        }}
                    >
                        {rooms.map((room) => (
                            <Link
                                key={room.id}
                                href={`/rooms/${room.id}`}
                                className="group relative w-[calc(100vw-40px)] sm:w-[380px] md:w-[60vw] h-[450px] sm:h-[420px] md:h-[440px] lg:h-[480px] flex-shrink-0 rounded-2xl bg-zinc-900 overflow-hidden border-4 border-black cursor-pointer block"
                                style={{ width: cardWidth }}
                            >
                                {/* Background Image & Overlay */}
                                <div className="absolute inset-0 z-0">
                                    <Image
                                        src={room.image}
                                        alt={room.name}
                                        fill
                                        className="object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:blur-sm"
                                        sizes="(max-width: 768px) 300px, 60vw"
                                        draggable="false"
                                    />
                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/70 transition-colors duration-500" />
                                </div>

                                {/* New Badge */}
                                {room.isNew && (
                                    <div className="absolute top-6 right-6 z-20 bg-primary text-black text-xs font-black px-3 py-1 uppercase tracking-widest shadow-lg">
                                        New
                                    </div>
                                )}

                                {/* Default State: Just Title */}
                                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center transition-all duration-500 md:group-hover:opacity-0 md:group-hover:translate-y-[-20px]">
                                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-wider drop-shadow-lg text-center px-4">
                                        {room.name}
                                    </h3>
                                </div>

                                {/* Hover State: Full Details - Desktop only hover, always visible on mobile */}
                                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-5 sm:p-6 md:p-8 text-center opacity-0 md:opacity-0 transition-all duration-500 md:group-hover:opacity-100 pointer-events-none md:pointer-events-auto">
                                    <div className="translate-y-8 transition-transform duration-500 md:group-hover:translate-y-0 space-y-2 sm:space-y-3 md:space-y-4 w-full max-w-md">
                                        {/* Removed category/theme badge */}

                                        <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase leading-[0.9] tracking-wide">
                                            {room.name}
                                        </h3>

                                        <p className="text-gray-200 text-xs sm:text-sm leading-relaxed line-clamp-3 md:line-clamp-none max-w-sm mx-auto px-2">
                                            {room.description}
                                        </p>

                                        <div className="flex justify-center items-center gap-3 sm:gap-4 py-2 sm:py-3 border-t border-white/20 border-b w-full mx-auto">
                                            <div className="flex flex-col items-center gap-1">
                                                <Gauge className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                                                <span className="text-[8px] sm:text-[9px] uppercase font-bold tracking-wider">{room.difficulty}</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-1">
                                                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                                                <span className="text-[8px] sm:text-[9px] uppercase font-bold tracking-wider">{room.duration}</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-1">
                                                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                                                <span className="text-[8px] sm:text-[9px] uppercase font-bold tracking-wider">{room.players}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
