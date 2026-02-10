"use client";

import { Search, Users, MapPin, Trophy } from "lucide-react";

// ---------------------------------------------------------------------------
// Step Data
// ---------------------------------------------------------------------------

const steps = [
    {
        number: "01",
        icon: Search,
        title: "Pick Your Adventure",
        description:
            "Browse our escape rooms, choose a theme that excites your group, and find an available time slot that works for everyone.",
        iconBg: "bg-primary/15",
        hoverBorder: "hover:border-primary/20",
    },
    {
        number: "02",
        icon: Users,
        title: "Rally Your Crew",
        description:
            "Gather 2 to 10 friends, family members, or coworkers. Every booking is completely private -- just your team in the room.",
        iconBg: "bg-secondary/15",
        hoverBorder: "hover:border-secondary/20",
    },
    {
        number: "03",
        icon: MapPin,
        title: "Arrive & Get Briefed",
        description:
            "Check in 15 minutes early, meet your dedicated Game Master, and get immersed in the story before the clock starts.",
        iconBg: "bg-blue-500/15",
        hoverBorder: "hover:border-blue-500/20",
    },
    {
        number: "04",
        icon: Trophy,
        title: "Solve, Escape, Celebrate",
        description:
            "Work together through 60 minutes of puzzles and discovery. Win or lose, finish with a group photo and bragging rights.",
        iconBg: "bg-green-500/15",
        hoverBorder: "hover:border-green-500/20",
    },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function FeaturesSection() {
    return (
        <section className="py-24 sm:py-32 md:py-36 bg-black relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section header */}
                <div className="text-center mb-12 sm:mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                        How It <span className="text-primary">Works</span>
                    </h2>
                    <p className="max-w-2xl mx-auto text-gray-400">
                        From booking to bragging rights in four simple steps. No experience
                        needed -- just bring your curiosity and your crew.
                    </p>
                </div>

                {/* Steps grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
                    {steps.map((step, i) => (
                        <div
                            key={i}
                            className={`
                                relative bg-neutral-900 rounded-3xl p-6 sm:p-7
                                flex flex-col items-start text-left
                                transition-all duration-300
                                hover:bg-neutral-800
                                border border-transparent ${step.hoverBorder}
                                group
                            `}
                        >
                            {/* Step number watermark */}
                            <span
                                className="absolute top-4 right-5 text-[4rem] sm:text-[4.5rem] font-heading font-extrabold leading-none text-white/[0.03] select-none pointer-events-none"
                                aria-hidden="true"
                            >
                                {step.number}
                            </span>

                            {/* Icon */}
                            <div
                                className={`${step.iconBg} p-3 rounded-2xl mb-5 group-hover:scale-110 transition-transform duration-300`}
                            >
                                <step.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                            </div>

                            {/* Step label */}
                            <span className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-2">
                                Step {step.number}
                            </span>

                            {/* Title */}
                            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                                {step.title}
                            </h3>

                            {/* Description */}
                            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
