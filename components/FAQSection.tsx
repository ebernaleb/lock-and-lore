"use client";

import { useState } from "react";
import { Plus, Minus, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
    {
        question: "Are the escape rooms scary?",
        answer: "No! None of our escape rooms are scary or horror-themed. We focus on adventure, story, and puzzles. Our experiences are designed to be fun and immersive for everyone!"
    },
    {
        question: "What happens if we get stuck on a puzzle?",
        answer: "Don't worry! You'll have a dedicated Game Master monitoring your progress. You can ask for hints whenever you need them to keep the fun moving forward."
    },
    {
        question: "Is it suitable for children?",
        answer: "We welcome players of all ages! However, we recommend our rooms for ages 10 and up due to the complexity of some puzzles. Children under 16 must be accompanied by an adult."
    },
    {
        question: "Can I book a private room?",
        answer: "Yes! All our bookings are private. You will never be paired with strangers. It will be just you and your team solving the mystery."
    },
    {
        question: "How early should we arrive?",
        answer: "Please arrive 15 minutes before your scheduled game time. This allows enough time for checking in, using the restroom, and receiving your pre-game briefing."
    },
    {
        question: "Can I reschedule or cancel my booking?",
        answer: "You can reschedule your game up to 24 hours in advance free of charge. Cancellations made 48 hours in advance are eligible for a full refund. Please contact us directly for assistance."
    },
    {
        question: "Can we add more players to our reservation?",
        answer: "Absolutely! As long as you don't exceed the maximum capacity for the room, you can add extra players upon arrival. They can simply pay at the door."
    },
    {
        question: "Do you host birthday parties or corporate events?",
        answer: "Yes! We specialize in private events, team building, and birthday parties. We have party packages available. Contact us to coordinate large groups or special requests."
    },
    {
        question: "Are cell phones allowed in the room?",
        answer: "We ask that you do not use cell phones, photos, or video recording inside the rooms to keep the secrets safe for future players. Lockers are provided for your personal belongings."
    },
    {
        question: "Is there parking available?",
        answer: "Yes, we have plenty of free parking available directly in front of our building. You won't have to worry about finding a spot!"
    }
];

export function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-24 bg-black" id="faq">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Frequently Asked <span className="text-primary">Questions</span>
                    </h2>
                    <p className="max-w-xl mx-auto text-gray-400">
                        Everything you need to know before your adventure begins.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-neutral-900 rounded-2xl overflow-hidden transition-all duration-300 hover:bg-neutral-800"
                        >
                            <button
                                onClick={() => toggleAccordion(index)}
                                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                            >
                                <span className="font-bold text-lg text-white">{faq.question}</span>
                                <div className={cn(
                                    "p-2 rounded-full transition-colors duration-200",
                                    openIndex === index ? "bg-primary/10 text-primary" : "bg-neutral-800 text-gray-400"
                                )}>
                                    {openIndex === index ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                </div>
                            </button>
                            <div
                                className={cn(
                                    "overflow-hidden transition-all duration-300 ease-in-out",
                                    openIndex === index ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                                )}
                            >
                                <div className="p-6 pt-0 text-gray-400 leading-relaxed border-t border-neutral-800">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
