'use client';

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FAQItem {
    question: string;
    answer: string;
}

const faqs: FAQItem[] = [
    {
        question: 'How early should we arrive?',
        answer: 'Please arrive 15 minutes before your scheduled booking time for briefing and waivers. Late arrivals will cut into your game time.',
    },
    {
        question: 'Are the rooms actually locked?',
        answer: 'For safety reasons, the entry door is never actually locked. You can leave at any time in an emergency, though the timer will continue running.',
    },
    {
        question: 'Is it scary?',
        answer: 'Our "Cabin 404" and "Mystery Manor" rooms have horror elements and jump scares. "Heist" and "Temple" are thrillers not designed to scare. Check the room details for specifics.',
    },
    {
        question: 'What is the age limit?',
        answer: 'We recommend ages 12+. Players under 16 must be accompanied by an adult. Waivers are required for all participants.',
    },
    {
        question: 'Can we cancel or reschedule?',
        answer: 'Reschedules are free up to 24 hours in advance. Cancellations within 24 hours are non-refundable.',
    },
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section id="faq" className="py-24 bg-background">
            <div className="container px-4 mx-auto max-w-3xl">
                <h2 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-widest mb-12 text-center">
                    Frequently Asked
                </h2>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div
                            key={idx}
                            className="border border-white/5 bg-card/50 overflow-hidden transition-all duration-300 hover:border-white/10"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                            >
                                <span className="text-lg font-medium text-white tracking-wide">{faq.question}</span>
                                {openIndex === idx ? (
                                    <Minus className="w-5 h-5 text-primary shrink-0" />
                                ) : (
                                    <Plus className="w-5 h-5 text-gray-500 shrink-0" />
                                )}
                            </button>
                            <div
                                className={cn(
                                    "overflow-hidden transition-all duration-300 ease-in-out",
                                    openIndex === idx ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                                )}
                            >
                                <p className="p-6 pt-0 text-gray-400 leading-relaxed border-t border-white/5">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
