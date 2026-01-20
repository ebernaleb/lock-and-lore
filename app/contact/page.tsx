'use client';

import React, { useState } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    roomPreference: '',
    guests: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        roomPreference: '',
        guests: '',
        message: '',
      });
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 sm:pt-40 md:pt-48 pb-16 sm:pb-20 md:pb-24 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-black to-black" />

        <div className="container px-4 md:px-8 mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 sm:mb-6 tracking-tight leading-[0.9] uppercase"
              style={{ fontFamily: 'var(--font-cinzel)' }}
            >
              GET IN TOUCH
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
              Ready to embark on your escape room adventure? Book your experience or reach out with any questions. We&apos;re here to help make your visit unforgettable.
            </p>
          </div>
        </div>

        {/* Decorative line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </section>

      {/* Main Content */}
      <section className="py-12 sm:py-16 md:py-20 bg-black relative">
        <div className="container px-4 md:px-8 mx-auto">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 max-w-7xl mx-auto">

            {/* Contact Information - Left Side */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2
                  className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-6 tracking-tight leading-tight uppercase"
                  style={{ fontFamily: 'var(--font-cinzel)' }}
                >
                  VISIT US
                </h2>

                <div className="space-y-6">
                  {/* Address */}
                  <div className="flex items-start gap-4 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-1">Location</h3>
                      <p className="text-white/60 text-sm leading-relaxed">
                        123 Escape Lane<br />
                        Virginia Beach, VA 23451
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-1">Phone</h3>
                      <a href="tel:+17575550123" className="text-white/60 hover:text-white text-sm transition-colors duration-300">
                        (757) 555-0123
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-1">Email</h3>
                      <a href="mailto:bookings@lockandlore.com" className="text-white/60 hover:text-white text-sm transition-colors duration-300 break-all">
                        bookings@lockandlore.com
                      </a>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-4 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-1">Hours</h3>
                      <div className="text-white/60 text-sm space-y-1">
                        <p>Mon - Thu: 3:00 PM - 10:00 PM</p>
                        <p>Fri - Sat: 12:00 PM - 11:00 PM</p>
                        <p>Sunday: 12:00 PM - 8:00 PM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info Box */}
              <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-3">Before You Visit</h3>
                <ul className="space-y-2 text-white/60 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Arrive 15 minutes early for check-in</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>All participants must sign a waiver</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Minimum 2 players, maximum 8 players</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Sessions last approximately 60 minutes</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Form - Right Side */}
            <div className="lg:col-span-3">
              <div className="bg-zinc-900/30 border border-white/10 rounded-2xl p-6 sm:p-8 md:p-10 backdrop-blur-sm relative overflow-hidden">
                {/* Decorative gradient */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10">
                  <h2
                    className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2 tracking-tight leading-tight uppercase"
                    style={{ fontFamily: 'var(--font-cinzel)' }}
                  >
                    BOOK YOUR ESCAPE
                  </h2>
                  <p className="text-white/60 text-sm mb-8">
                    Fill out the form below and we&apos;ll get back to you within 24 hours.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name & Email Row */}
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-white text-xs font-bold uppercase tracking-wider mb-2">
                          Full Name <span className="text-primary">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-zinc-900 border-2 border-white/20 rounded-xl text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                          placeholder="John Doe"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-white text-xs font-bold uppercase tracking-wider mb-2">
                          Email <span className="text-primary">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-zinc-900 border-2 border-white/20 rounded-xl text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    {/* Phone & Date Row */}
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phone" className="block text-white text-xs font-bold uppercase tracking-wider mb-2">
                          Phone <span className="text-primary">*</span>
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-zinc-900 border-2 border-white/20 rounded-xl text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                          placeholder="(757) 555-0123"
                        />
                      </div>

                      <div>
                        <label htmlFor="date" className="block text-white text-xs font-bold uppercase tracking-wider mb-2">
                          Preferred Date
                        </label>
                        <input
                          type="date"
                          id="date"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                          className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-zinc-900 border-2 border-white/20 rounded-xl text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Room Preference & Number of Guests Row */}
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="roomPreference" className="block text-white text-xs font-bold uppercase tracking-wider mb-2">
                          Room Preference
                        </label>
                        <select
                          id="roomPreference"
                          name="roomPreference"
                          value={formData.roomPreference}
                          onChange={handleChange}
                          className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-zinc-900 border-2 border-white/20 rounded-xl text-white text-sm focus:outline-none focus:border-primary/50 transition-colors appearance-none cursor-pointer"
                        >
                          <option value="">Select a room</option>
                          <option value="the-crypt">The Crypt</option>
                          <option value="the-asylum">The Asylum</option>
                          <option value="the-laboratory">The Laboratory</option>
                          <option value="no-preference">No Preference</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="guests" className="block text-white text-xs font-bold uppercase tracking-wider mb-2">
                          Number of Guests
                        </label>
                        <input
                          type="number"
                          id="guests"
                          name="guests"
                          value={formData.guests}
                          onChange={handleChange}
                          min="2"
                          max="8"
                          className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-zinc-900 border-2 border-white/20 rounded-xl text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                          placeholder="2-8"
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-white text-xs font-bold uppercase tracking-wider mb-2">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-zinc-900 border-2 border-white/20 rounded-xl text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                        placeholder="Tell us about your group, special occasions, or any questions you have..."
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting || isSubmitted}
                        className={cn(
                          "w-full sm:w-auto min-w-[200px] font-bold tracking-widest uppercase px-8 py-4 rounded-full transition-all duration-300 text-sm flex items-center justify-center gap-2 group",
                          isSubmitted
                            ? "bg-green-600 text-white cursor-default"
                            : "bg-white text-black hover:bg-primary hover:text-white"
                        )}
                      >
                        {isSubmitted ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            SENT!
                          </>
                        ) : isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            SENDING...
                          </>
                        ) : (
                          <>
                            SEND MESSAGE
                            <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-black border-t border-white/10">
        <div className="container px-4 md:px-8 mx-auto">
          <div className="max-w-7xl mx-auto">
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-6 sm:mb-8 tracking-tight leading-tight uppercase text-center"
              style={{ fontFamily: 'var(--font-cinzel)' }}
            >
              FIND US
            </h2>

            {/* Map Placeholder */}
            <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-2xl overflow-hidden border border-white/10 bg-zinc-900">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
                  <p className="text-white/60 text-sm">Map integration coming soon</p>
                  <p className="text-white/40 text-xs mt-2">123 Escape Lane, Virginia Beach, VA 23451</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
