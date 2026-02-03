"use client";

import { Users, Clock, Lock } from "lucide-react";
import Image from "next/image";

// Reusable Room Card
function RoomCard({ title, image, description, players }: { title: string, image: string, description: string, players: string }) {
    return (
        <div className="bg-white rounded-3xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 group border border-gray-100 shadow-sm hover:shadow-md flex flex-col h-full">
            <div className="relative h-64 overflow-hidden flex-shrink-0">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
                    style={{ backgroundImage: `url('${image}')` }}
                ></div>

            </div>
            <div className="p-6 text-center flex flex-col flex-grow">
                <h3 className="text-2xl font-bold font-heading text-gray-900 mb-4">{title}</h3>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">{description}</p>

                <div className="flex justify-center items-center gap-4 text-gray-500 text-xs py-2 border-t border-b border-gray-100 mb-4">
                    <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-secondary" />
                        <span>{players}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-secondary" />
                        <span>60 Mins</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Lock className="w-4 h-4 text-secondary" />
                        <span>Medium</span>
                    </div>
                </div>


                <div className="mt-auto">
                    <button className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 rounded-full text-sm transition-colors">
                        Learn More
                    </button>
                </div>
            </div>
        </div>
    );
}

export function RoomsSection() {
    const rooms = [
        {
            title: "Skybound Dynasty",
            image: "/images/floatingcity_room.png",
            description: "High above the world, a city floats amongst the clouds. Valkeria. A kingdom of marble towers and starlight. Seven constellations shine above it, steady and bright. A coronation approaches, and you have been invited to witness history. Will you protect what exists, or decide what comes next?",
            players: "2-10 Players"
        },
        {
            title: "Escape the Simulation",
            image: "/images/simulation_room.png",
            description: "You sit at your desk. Same chair. Same screen. Same office. Another typical Tuesday. Everything feels real, until it doesn't. This office isn't a workplace, it’s a simulation, and you’ve become self-aware. Will you break free, or change reality forever?",
            players: "2-6 Players"
        },
        {
            title: "Echo Chamber",
            image: "/images/art_room.png",
            description: "As you explore the studio Mara left behind, you uncover two versions of her story, and the truth hidden behind the illusions she created. Only by separating reality from the lies she told herself can you discover what really happened to this artist.",
            players: "2-8 Players"
        }
    ];

    return (
        <section className="py-24 bg-[#f9f9f9] relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                        Choose Your <span className="text-primary">Game</span>
                    </h2>
                    <p className="max-w-2xl mx-auto text-gray-600">
                        All games are private experiences. You will not be merged with other groups. Pick your theme and start the fun!
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {rooms.map((room, index) => (
                        <RoomCard key={index} {...room} />
                    ))}
                </div>


            </div>
        </section>
    );
}
