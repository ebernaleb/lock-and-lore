'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FallingPattern } from '@/components/ui/falling-pattern';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
      {/* Animated Falling Pattern Background */}
      <div className="absolute inset-0 opacity-40">
        <FallingPattern
          color="#7f1d1d"
          backgroundColor="#000000"
          duration={150}
        />
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-black z-10 pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 container px-4 md:px-8 mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Company Name */}
          <h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-wider leading-none mb-4 text-white"
            style={{
              fontFamily: 'var(--font-cinzel)',
              textShadow: `
                0 4px 8px rgba(0, 0, 0, 0.8),
                0 8px 16px rgba(0, 0, 0, 0.6)
              `
            }}
          >
            Lock & Lore
          </h1>

          {/* Tagline */}
          <p className="text-gray-400 text-lg md:text-xl tracking-[0.3em] uppercase mb-12">
            Immersive Escape Rooms
          </p>

          {/* View Our Rooms Button */}
          <button
            onClick={() => {
              const element = document.getElementById('rooms');
              if (element) {
                const offset = -100;
                const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition + offset;
                window.scrollTo({
                  top: offsetPosition,
                  behavior: 'smooth'
                });
              }
            }}
            className="px-8 py-3 bg-primary text-white font-semibold tracking-wide uppercase rounded-md transition-all duration-150 hover:translate-y-[2px] hover:shadow-none active:translate-y-[3px]"
            style={{
              boxShadow: `
                0 4px 0 0 #4a0f0f,
                0 6px 8px rgba(0, 0, 0, 0.4)
              `,
              borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            View Our Rooms
          </button>
        </motion.div>
      </div>
    </section>
  );
}
