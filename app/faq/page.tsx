"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Plus, Minus, Search, HelpCircle, Users, Calendar, MapPin, Gift } from "lucide-react";
import { cn } from "@/lib/utils";

const faqCategories = [
    {
        id: "general",
        label: "General",
        icon: HelpCircle,
        questions: [
            {
                question: "Are the escape rooms scary?",
                answer: "No! None of our escape rooms are scary or horror-themed. We focus on adventure, story, and puzzles. Our experiences are designed to be fun and immersive for everyone!",
            },
            {
                question: "What happens if we get stuck on a puzzle?",
                answer: "Don't worry! You'll have a dedicated Game Master monitoring your progress. You can ask for hints whenever you need them to keep the fun moving forward.",
            },
            {
                question: "Are cell phones allowed in the room?",
                answer: "We ask that you do not use cell phones, photos, or video recording inside the rooms to keep the secrets safe for future players. Lockers are provided for your personal belongings.",
            },
        ],
    },
    {
        id: "groups",
        label: "Groups & Ages",
        icon: Users,
        questions: [
            {
                question: "Is it suitable for children?",
                answer: "We welcome players of all ages! However, we recommend our rooms for ages 10 and up due to the complexity of some puzzles. Children under 16 must be accompanied by an adult.",
            },
            {
                question: "Can I book a private room?",
                answer: "Yes! All our bookings are private. You will never be paired with strangers. It will be just you and your team solving the mystery.",
            },
            {
                question: "Can we add more players to our reservation?",
                answer: "Absolutely! As long as you don't exceed the maximum capacity for the room, you can add extra players upon arrival. They can simply pay at the door.",
            },
        ],
    },
    {
        id: "booking",
        label: "Booking & Policies",
        icon: Calendar,
        questions: [
            {
                question: "How early should we arrive?",
                answer: "Please arrive 15 minutes before your scheduled game time. This allows enough time for checking in, using the restroom, and receiving your pre-game briefing.",
            },
            {
                question: "Can I reschedule or cancel my booking?",
                answer: "You can reschedule your game up to 24 hours in advance free of charge. Cancellations made 48 hours in advance are eligible for a full refund. Please contact us directly for assistance.",
            },
        ],
    },
    {
        id: "events",
        label: "Events & Parties",
        icon: Gift,
        questions: [
            {
                question: "Do you host birthday parties or corporate events?",
                answer: "Yes! We specialize in private events, team building, and birthday parties. We have party packages available. Contact us to coordinate large groups or special requests.",
            },
        ],
    },
    {
        id: "location",
        label: "Location & Parking",
        icon: MapPin,
        questions: [
            {
                question: "Is there parking available?",
                answer: "Yes, we have plenty of free parking available directly in front of our building. You won't have to worry about finding a spot!",
            },
        ],
    },
];

export default function FAQPage() {
    const [openItems, setOpenItems] = useState<Set<string>>(new Set(["general-0"]));
    const [activeCategory, setActiveCategory] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");

    const toggleItem = (key: string) => {
        setOpenItems((prev) => {
            const next = new Set(prev);
            if (next.has(key)) {
                next.delete(key);
            } else {
                next.add(key);
            }
            return next;
        });
    };

    // Filter FAQs based on search and category
    const filteredCategories = faqCategories
        .filter((cat) => activeCategory === "all" || cat.id === activeCategory)
        .map((cat) => ({
            ...cat,
            questions: cat.questions.filter((q) => {
                if (!searchQuery.trim()) return true;
                const query = searchQuery.toLowerCase();
                return (
                    q.question.toLowerCase().includes(query) ||
                    q.answer.toLowerCase().includes(query)
                );
            }),
        }))
        .filter((cat) => cat.questions.length > 0);

    const totalResults = filteredCategories.reduce((sum, cat) => sum + cat.questions.length, 0);

    return (
        <main className="min-h-screen font-sans selection:bg-primary selection:text-neutral-950 bg-black">
            <Navbar />

            {/* Hero Section */}
            <div className="relative bg-black pt-16">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-30"
                    style={{
                        backgroundImage: "url('/images/hero_img.png')",
                    }}
                    aria-hidden="true"
                />
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-36 text-center">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading text-white mb-5 tracking-wide">
                        Frequently Asked <span className="text-primary">Questions</span>
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        Everything you need to know before your adventure begins. Can't find your answer? Feel free to reach out.
                    </p>
                </div>
            </div>

            {/* FAQ Content */}
            <section className="py-20 md:py-28">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Search Bar */}
                    <div className="mb-10">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search questions..."
                                className="w-full pl-12 pr-4 py-4 bg-neutral-900 border border-neutral-700 rounded-2xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 outline-none text-white text-[15px] placeholder:text-gray-500"
                                aria-label="Search frequently asked questions"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors text-sm font-medium"
                                    aria-label="Clear search"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                        {searchQuery && (
                            <p className="mt-3 text-sm text-gray-500 pl-1">
                                {totalResults} {totalResults === 1 ? "result" : "results"} found
                            </p>
                        )}
                    </div>

                    {/* Category Filters */}
                    <div className="mb-10 flex flex-wrap gap-2">
                        <button
                            onClick={() => setActiveCategory("all")}
                            className={cn(
                                "px-4 py-2 rounded-full text-sm font-semibold tracking-wide transition-all duration-200",
                                activeCategory === "all"
                                    ? "bg-primary text-neutral-950 shadow-md shadow-primary/20"
                                    : "bg-neutral-900 text-gray-400 hover:text-white hover:bg-neutral-800"
                            )}
                        >
                            All Questions
                        </button>
                        {faqCategories.map((cat) => {
                            const Icon = cat.icon;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={cn(
                                        "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold tracking-wide transition-all duration-200",
                                        activeCategory === cat.id
                                            ? "bg-primary text-neutral-950 shadow-md shadow-primary/20"
                                            : "bg-neutral-900 text-gray-400 hover:text-white hover:bg-neutral-800"
                                    )}
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                    {cat.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* FAQ Accordion Sections */}
                    {filteredCategories.length > 0 ? (
                        <div className="space-y-10">
                            {filteredCategories.map((category) => {
                                const Icon = category.icon;
                                return (
                                    <div key={category.id}>
                                        {/* Category Header */}
                                        <div className="flex items-center gap-3 mb-5">
                                            <div className="bg-primary/10 w-10 h-10 flex items-center justify-center rounded-xl">
                                                <Icon className="w-5 h-5 text-primary" />
                                            </div>
                                            <h2 className="text-xl sm:text-2xl font-bold font-heading text-white tracking-wide">
                                                {category.label}
                                            </h2>
                                        </div>

                                        {/* Questions */}
                                        <div className="space-y-3">
                                            {category.questions.map((faq, index) => {
                                                const itemKey = `${category.id}-${index}`;
                                                const isOpen = openItems.has(itemKey);
                                                return (
                                                    <div
                                                        key={itemKey}
                                                        className={cn(
                                                            "bg-neutral-900 rounded-2xl overflow-hidden transition-all duration-300",
                                                            isOpen
                                                                ? "ring-1 ring-primary/20"
                                                                : "hover:bg-neutral-800"
                                                        )}
                                                    >
                                                        <button
                                                            onClick={() => toggleItem(itemKey)}
                                                            className="w-full flex items-center justify-between p-5 sm:p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 rounded-2xl"
                                                            aria-expanded={isOpen}
                                                        >
                                                            <span className="font-bold text-base sm:text-lg text-white pr-4 leading-snug">
                                                                {faq.question}
                                                            </span>
                                                            <div
                                                                className={cn(
                                                                    "flex-shrink-0 p-2 rounded-full transition-colors duration-200",
                                                                    isOpen
                                                                        ? "bg-primary/10 text-primary"
                                                                        : "bg-neutral-800 text-gray-400"
                                                                )}
                                                            >
                                                                {isOpen ? (
                                                                    <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                                                                ) : (
                                                                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                                                                )}
                                                            </div>
                                                        </button>
                                                        <div
                                                            className={cn(
                                                                "overflow-hidden transition-all duration-300 ease-in-out",
                                                                isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
                                                            )}
                                                        >
                                                            <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0 text-gray-400 text-[15px] leading-relaxed border-t border-neutral-800">
                                                                <p className="pt-4">{faq.answer}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        /* Empty State */
                        <div className="text-center py-20">
                            <div className="bg-neutral-900 w-16 h-16 flex items-center justify-center rounded-2xl mx-auto mb-5">
                                <Search className="w-7 h-7 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">No results found</h3>
                            <p className="text-gray-400 text-[15px] max-w-md mx-auto mb-6">
                                We couldn't find any questions matching "{searchQuery}". Try a different search term or browse all categories.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery("");
                                    setActiveCategory("all");
                                }}
                                className="text-primary hover:text-primary-dark font-bold text-sm uppercase tracking-widest transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}

                    {/* Still Have Questions CTA */}
                    <div className="mt-20 bg-neutral-900 rounded-2xl p-8 sm:p-12 text-center">
                        <div className="bg-primary/10 w-14 h-14 flex items-center justify-center rounded-2xl mx-auto mb-6">
                            <HelpCircle className="w-7 h-7 text-primary" />
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-bold font-heading text-white mb-3 tracking-wide">
                            Still Have Questions?
                        </h3>
                        <p className="text-gray-400 text-[15px] sm:text-base leading-relaxed max-w-lg mx-auto mb-8">
                            Our team is happy to help with anything not covered here. Reach out and we will get back to you as soon as possible.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-neutral-950 font-medium px-6 py-3 text-base rounded-full shadow-[0_4px_0_0_rgba(122,92,32,1)] hover:shadow-[0_2px_0_0_rgba(122,92,32,1)] active:shadow-[0_0px_0_0_rgba(122,92,32,1)] hover:translate-y-[2px] active:translate-y-[4px] transition-all duration-150 relative before:absolute before:inset-0 before:rounded-full before:shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.2)] before:pointer-events-none uppercase tracking-widest"
                            >
                                <span className="relative z-10">Contact Us</span>
                            </Link>
                            <a
                                href="tel:+17573011862"
                                className="inline-flex items-center justify-center gap-2 bg-zinc-700 hover:bg-zinc-600 text-white font-medium px-6 py-3 text-base rounded-full shadow-[0_4px_0_0_rgba(39,39,42,1)] hover:shadow-[0_2px_0_0_rgba(39,39,42,1)] active:shadow-[0_0px_0_0_rgba(39,39,42,1)] hover:translate-y-[2px] active:translate-y-[4px] transition-all duration-150 relative before:absolute before:inset-0 before:rounded-full before:shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.15)] before:pointer-events-none uppercase tracking-widest"
                            >
                                <span className="relative z-10">(757) 301-1862</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <div className="py-14 bg-black" />
            <Footer />
        </main>
    );
}
