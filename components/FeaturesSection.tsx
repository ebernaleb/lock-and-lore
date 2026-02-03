"use client";

import { Heart, Users, ShieldCheck, Zap, Smile, Puzzle } from "lucide-react";

const features = [
    { icon: Heart, title: "Family Friendly", desc: "Themes appropriate for all ages. No scary stuff!" },
    { icon: Users, title: "Perfect for Groups", desc: "Great for team building, parties, and friends." },
    { icon: ShieldCheck, title: "Safe And Comfortable", desc: "Private rooms, clean environments." },
    { icon: Zap, title: "8 Unique Themes", desc: "Immersive storylines and detailed sets." },
    { icon: Smile, title: "Unlimited Hints", desc: "We want you to have fun, not get stuck!" },
    { icon: Puzzle, title: "High-Tech Puzzles", desc: "Magical locks and sensors, not just padlocks." },
];

export function FeaturesSection() {
    return (
        <section className="py-24 bg-[#f9f9f9] relative overflow-hidden">
            {/* Decorative background elements if needed */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-50 via-white to-white opacity-50 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Adventure Awaits – <span className="text-primary">Fun for All Ages!</span>
                    </h2>
                    <p className="max-w-2xl mx-auto text-gray-600">
                        Why choose us? We prioritize fun, immersion, and making sure everyone has a blast.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((f, i) => (
                        <div key={i} className="bg-white border border-gray-100 p-8 rounded-3xl transition-all hover:shadow-md flex flex-col items-start text-left group shadow-sm">
                            <div className="bg-accent/20 p-3 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                <f.icon className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{f.title}</h3>
                            <p className="text-gray-500">{f.desc}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-16 text-center">
                    <button className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg hover:shadow-xl uppercase tracking-wide">
                        Book Your Adventure
                    </button>
                </div>
            </div>
        </section>
    );
}
