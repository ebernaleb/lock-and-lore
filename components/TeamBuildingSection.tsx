"use client";

import Link from "next/link";
import {
  Briefcase,
  PartyPopper,
  Target,
  Building2,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const useCases = [
  {
    icon: Briefcase,
    title: "Corporate Team Building",
    description:
      "Strengthen communication, collaboration, and leadership skills in an engaging, memorable setting.",
  },
  {
    icon: PartyPopper,
    title: "Celebrations & Parties",
    description:
      "Birthday parties, bachelor/bachelorette events, and milestone celebrations your group will never forget.",
  },
  {
    icon: Target,
    title: "Corporate Retreats",
    description:
      "Break the ice and energize your team with an experience that gets everyone working together.",
  },
  {
    icon: Building2,
    title: "School & Youth Groups",
    description:
      "Educational problem-solving experiences that teach teamwork, critical thinking, and communication.",
  },
];

const benefits = [
  "Multiple rooms running simultaneously",
  "Custom packages & catering options",
  "Dedicated event coordinator",
  "Private booking guaranteed",
  "Flexible scheduling",
  "Professional game masters",
  "All experience levels welcome",
  "Convenient location & free parking",
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TeamBuildingSection() {
  return (
    <section className="py-20 sm:py-24 bg-black relative overflow-hidden" id="team-building">
      {/* Decorative background */}
      <div
        className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Perfect for <span className="text-primary">Team Building</span> &
            Events
          </h2>
          <p className="max-w-2xl mx-auto text-gray-400">
            From small teams to large corporate groups, we create unforgettable
            experiences that bring people together with custom packages tailored
            to your group.
          </p>
        </div>

        {/* Two column layout: use cases + benefits */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12 sm:mb-16">
          {/* Use cases grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className="bg-neutral-900 p-5 sm:p-6 rounded-2xl hover:bg-neutral-800 transition-colors duration-300 group"
              >
                <div className="bg-primary/10 p-2.5 rounded-xl w-fit mb-3 group-hover:scale-110 transition-transform duration-300">
                  <useCase.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-white mb-1.5 text-base">
                  {useCase.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {useCase.description}
                </p>
              </div>
            ))}
          </div>

          {/* Benefits side panel */}
          <div className="bg-neutral-900 rounded-3xl p-7 sm:p-8 flex flex-col justify-center">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">
              Why Groups Choose Lock & Lore
            </h3>
            <ul className="space-y-3.5 mb-8">
              {benefits.map((benefit, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-gray-300"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base">{benefit}</span>
                </li>
              ))}
            </ul>

            {/* Group CTA */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-neutral-950 font-medium px-6 py-3 text-base rounded-full shadow-[0_4px_0_0_rgba(122,92,32,1)] hover:shadow-[0_2px_0_0_rgba(122,92,32,1)] active:shadow-[0_0px_0_0_rgba(122,92,32,1)] hover:translate-y-[2px] active:translate-y-[4px] transition-all duration-150 relative before:absolute before:inset-0 before:rounded-full before:shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.2)] before:pointer-events-none uppercase tracking-wide"
              >
                <span className="relative z-10">Plan Your Event</span>
                <ArrowRight className="w-4 h-4 relative z-10" />
              </Link>
              <Link
                href="tel:+17573011862"
                className="inline-flex items-center justify-center gap-2 bg-zinc-700 hover:bg-zinc-600 text-white font-medium px-6 py-3 text-base rounded-full shadow-[0_4px_0_0_rgba(39,39,42,1)] hover:shadow-[0_2px_0_0_rgba(39,39,42,1)] active:shadow-[0_0px_0_0_rgba(39,39,42,1)] hover:translate-y-[2px] active:translate-y-[4px] transition-all duration-150 relative before:absolute before:inset-0 before:rounded-full before:shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.15)] before:pointer-events-none uppercase tracking-wide"
              >
                <span className="relative z-10">Call Us</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
