import React from 'react';
import Image from 'next/image';
import { rooms } from '@/lib/rooms';
import { Button } from './ui/button';
import { BOOKING_URL } from '@/lib/utils';
import { Clock, Users, Gauge } from 'lucide-react';

export default function RoomsGrid() {
    return (
        <section id="rooms" className="py-24 md:py-32 bg-background relative">
            <div className="container px-4 md:px-8 mx-auto">
                <div className="mb-16 md:mb-24 flex flex-col md:flex-row items-end justify-between gap-6 border-b border-white/5 pb-8">
                    <div>
                        <span className="text-secondary text-sm font-bold tracking-[0.2em] uppercase mb-2 block">Our Experiences</span>
                        <h2
                            className="text-4xl md:text-5xl font-bold text-white tracking-widest uppercase"
                            style={{ fontFamily: 'var(--font-cinzel)' }}
                        >
                            Choose Your Room
                        </h2>
                    </div>
                    <p className="text-gray-400 max-w-sm text-sm leading-relaxed text-right md:text-left">
                        Each room is a unique world. No two puzzles are the same. Choose your difficulty and theme wisely.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                    {rooms.map((room) => (
                        <div
                            key={room.id}
                            className="group relative h-[560px] w-full overflow-hidden rounded-md border-4 border-black bg-zinc-900"
                        >
                            {/* Background Image & Overlay */}
                            <div className="absolute inset-0 z-0">
                                <Image
                                    src={room.image}
                                    alt={room.name}
                                    fill
                                    className="object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:blur-sm"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/70 transition-colors duration-500" />
                            </div>

                            {/* New Badge */}
                            {room.isNew && (
                                <div className="absolute top-4 right-4 z-20 bg-primary text-black text-xs font-black px-3 py-1 uppercase tracking-widest shadow-lg">
                                    New
                                </div>
                            )}

                            {/* Default State: Just Title */}
                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center transition-all duration-500 group-hover:opacity-0 group-hover:translate-y-[-20px]">
                                <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-wider drop-shadow-lg">
                                    {room.name}
                                </h3>
                            </div>

                            {/* Hover State: Full Details */}
                            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-center opacity-0 transition-all duration-500 group-hover:opacity-100">
                                <div className="translate-y-8 transition-transform duration-500 group-hover:translate-y-0 space-y-4">
                                    {/* Removed category/theme badge */}

                                    <h3 className="text-3xl font-black text-white uppercase leading-none tracking-wide">
                                        {room.name}
                                    </h3>

                                    <p className="text-gray-200 text-sm md:text-base leading-relaxed line-clamp-3 max-w-sm mx-auto">
                                        {room.description}
                                    </p>

                                    <div className="flex justify-center items-center gap-6 py-4 border-t border-white/20 border-b w-full max-w-xs mx-auto">
                                        <div className="flex flex-col items-center gap-1">
                                            <Gauge className="w-5 h-5 text-primary" />
                                            <span className="text-[10px] uppercase font-bold tracking-wider">{room.difficulty}</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <Clock className="w-5 h-5 text-primary" />
                                            <span className="text-[10px] uppercase font-bold tracking-wider">{room.duration}</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <Users className="w-5 h-5 text-primary" />
                                            <span className="text-[10px] uppercase font-bold tracking-wider">{room.players}</span>
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <Button href={`${BOOKING_URL}?room=${room.id}`} className="bg-white text-black hover:bg-primary hover:text-white font-bold tracking-widest uppercase px-8 rounded-full transition-all duration-300">
                                            Book Now
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function RoomStat({ icon: Icon, label }: { icon: any, label: string }) {
    return (
        <div className="flex flex-col items-center justify-center text-center gap-1">
            <Icon className="w-4 h-4 text-gray-500 mb-1" />
            <span className="text-xs text-gray-300 font-medium uppercase tracking-wider">{label}</span>
        </div>
    )
}
