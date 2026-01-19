import React from 'react';
import { Target, Calendar, Unlock } from 'lucide-react';

export default function HowItWorks() {
    const steps = [
        {
            icon: Target,
            title: 'Choose Your Mission',
            description: 'Select a theme that fits your team’s vibe. Horror, mystery, or heist?',
        },
        {
            icon: Calendar,
            title: 'Book Your Slot',
            description: 'Reserve your 60-minute private experience online instantly.',
        },
        {
            icon: Unlock,
            title: 'Escape or Fade',
            description: 'Find clues, solve puzzles, and break out before time runs out.',
        },
    ];

    return (
        <section id="how-it-works" className="py-24 bg-card border-y border-white/5 relative overflow-hidden">
            {/* Background flourish */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="container px-4 mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-widest mb-4">
                        How It Works
                    </h2>
                    <div className="w-24 h-1 bg-primary mx-auto" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center text-white">
                    {steps.map((step, idx) => (
                        <div key={idx} className="flex flex-col items-center group">
                            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 group-hover:border-primary/50 transition-all duration-300">
                                <step.icon className="w-8 h-8 text-gray-300 group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold uppercase tracking-wide mb-3">{step.title}</h3>
                            <p className="text-gray-400 leading-relaxed max-w-xs mx-auto text-sm">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
