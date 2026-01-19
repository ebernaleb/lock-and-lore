import React from 'react';
import Image from 'next/image';
import { Room } from '@/lib/rooms';
import { Clock, Users, Gauge, Trophy, Sparkles } from 'lucide-react';

interface RoomDetailProps {
    room: Room;
}

export default function RoomDetail({ room }: RoomDetailProps) {
    const difficultyColors: Record<string, string> = {
        'Easy': 'bg-green-500/20 text-green-400 border-green-500/30',
        'Medium': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        'Hard': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        'Expert': 'bg-red-500/20 text-red-400 border-red-500/30',
    };

    return (
        <div className="space-y-6 sm:space-y-8">
            {/* Hero Image */}
            <div className="relative w-full aspect-[16/9] rounded-xl sm:rounded-2xl overflow-hidden border-2 sm:border-4 border-black">
                <Image
                    src={room.image}
                    alt={room.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 60vw"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* New Badge */}
                {room.isNew && (
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                        <span className="px-2.5 py-1 sm:px-3 sm:py-1 bg-primary text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded-full">
                            New
                        </span>
                    </div>
                )}

                {/* Stats on Image - Mobile: Stack, Tablet+: Row */}
                <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <StatCard
                        icon={Gauge}
                        label="Difficulty"
                        value={room.difficulty}
                    />
                    <StatCard
                        icon={Clock}
                        label="Duration"
                        value={room.duration}
                    />
                    <StatCard
                        icon={Users}
                        label="Players"
                        value={room.players}
                    />
                </div>
            </div>

            {/* Title and Description */}
            <div>
                <h1
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-[0.9] mb-3 sm:mb-4"
                    style={{ fontFamily: 'var(--font-cinzel)' }}
                >
                    {room.name}
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed">
                    {room.description}
                </p>
            </div>
        </div>
    );
}

function StatCard({
    icon: Icon,
    label,
    value,
    className = '',
}: {
    icon: React.ElementType;
    label: string;
    value: string;
    className?: string;
}) {
    return (
        <div className={`flex items-center gap-2 sm:gap-3 px-3 py-1.5 sm:px-4 sm:py-2 bg-black rounded-lg border-2 sm:border-4 border-black ${className}`}>
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
            <div>
                <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-gray-300 font-bold">
                    {label}
                </p>
                <p className="text-white font-bold text-sm sm:text-base md:text-lg whitespace-nowrap">
                    {value}
                </p>
            </div>
        </div>
    );
}
