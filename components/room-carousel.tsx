'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { rooms } from '@/lib/rooms';
import { motion } from 'framer-motion';

export default function RoomCarousel() {
    return (
        <section id="rooms" className="pt-24 sm:pt-32 md:pt-40 lg:pt-48 pb-24 sm:pb-32 md:pb-40 bg-background relative overflow-hidden">
            <div className="container px-4 md:px-8 mx-auto">
                {/* Header */}
                <div className="mb-12 sm:mb-16 md:mb-20">
                    <h2
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[0.85] uppercase"
                        style={{ fontFamily: 'var(--font-cinzel)' }}
                    >
                        OUR
                        <br />
                        ROOMS.
                    </h2>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-8 max-w-[1400px] mx-auto">
                    {rooms.map((room, index) => (
                        <motion.div
                            key={room.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{
                                duration: 0.6,
                                delay: index * 0.15,
                                ease: [0.22, 1, 0.36, 1]
                            }}
                        >
                            <Link
                                href={`/rooms/${room.id}`}
                                className="group relative block h-[480px] sm:h-[520px] lg:h-[560px] rounded-[2rem] bg-zinc-900 overflow-hidden transition-all duration-500"
                            >
                                {/* Background Image & Overlay */}
                                <div className="absolute inset-0 z-0">
                                    <Image
                                        src={room.image}
                                        alt={room.name}
                                        fill
                                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        priority={index === 0}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent group-hover:from-black/90 transition-all duration-500" />
                                </div>

                                {/* Title - Bottom Left */}
                                <div className="absolute bottom-0 left-0 z-10 p-6 sm:p-7 lg:p-8">
                                    <h3
                                        className="text-2xl sm:text-3xl lg:text-4xl font-black text-white uppercase leading-[0.9] tracking-wide"
                                        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8), 0 4px 12px rgba(0,0,0,0.6), 0 8px 24px rgba(0,0,0,0.4)' }}
                                    >
                                        {room.name}
                                    </h3>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
