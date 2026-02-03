"use client";

import { Star, ChevronLeft, ChevronRight } from "lucide-react";
// import Image from "next/image";

const reviews = [
    {
        name: "Sarah Jenkins",
        date: "2 days ago",
        rating: 5,
        text: "Absolutely amazing experience! The 'Escape From Oz' room was so detailed and fun. Our game master was fantastic!",
        avatar: "S"
    },
    {
        name: "Mike T.",
        date: "1 week ago",
        rating: 5,
        text: "We did the Mad Hatter room for my daughter's birthday. Best party ever. The puzzles were challenging but fair.",
        avatar: "M"
    },
    {
        name: "The Travelers",
        date: "3 weeks ago",
        rating: 5,
        text: "We've done escape rooms all over the country, and this ranks in the top 5! High production value.",
        avatar: "T"
    }
];

export function ReviewsSection() {
    return (
        <section className="py-24 bg-[#f9f9f9] relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Happy Adventurers – <span className="text-primary">Everywhere!</span>
                    </h2>
                    <p className="max-w-xl mx-auto text-gray-600">
                        Join thousands of happy escapers. See what they have to say!
                    </p>
                </div>

                <div className="relative">
                    {/* Navigation buttons (visual only for carbon copy static view, carousel logic usually needed) */}
                    <div className="absolute top-1/2 -left-4 md:-left-12 transform -translate-y-1/2 z-10">
                        <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"><ChevronLeft className="w-6 h-6 text-gray-600" /></button>
                    </div>
                    <div className="absolute top-1/2 -right-4 md:-right-12 transform -translate-y-1/2 z-10">
                        <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"><ChevronRight className="w-6 h-6 text-gray-600" /></button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {reviews.map((r, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl">
                                        {r.avatar}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{r.name}</h4>
                                        <span className="text-xs text-gray-500">{r.date}</span>
                                    </div>
                                    <div className="ml-auto flex items-center gap-1 opacity-50">
                                        <span className="font-bold text-xs text-gray-500">Google</span>
                                    </div>
                                </div>
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, starsIndex) => (
                                        <Star key={starsIndex} className="w-4 h-4 fill-current" />
                                    ))}
                                </div>
                                <p className="text-gray-600 text-sm italic">"{r.text}"</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <button className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg hover:shadow-xl uppercase tracking-wide">
                        Book Your Escape
                    </button>
                </div>
            </div>
        </section>
    );
}
