"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Phone, Mail, Clock, Send } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus("idle");

        // Simulate form submission
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Here you would typically send the data to your backend
        console.log("Form submitted:", formData);

        setIsSubmitting(false);
        setSubmitStatus("success");

        // Reset form after successful submission
        setFormData({
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: "",
        });

        // Reset success message after 5 seconds
        setTimeout(() => setSubmitStatus("idle"), 5000);
    };

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
                />
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-36 text-center">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading text-white mb-5 tracking-wide">
                        Get In <span className="text-primary">Touch</span>
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        Have questions about our escape rooms? Want to book a private event? We are here to help!
                    </p>
                </div>
            </div>

            {/* Contact Content */}
            <section className="py-20 md:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
                        {/* Contact Information Cards */}
                        <div className="lg:col-span-1 space-y-4">
                            {/* Phone Card */}
                            <div className="bg-neutral-900 rounded-2xl p-5 sm:p-6 hover:bg-neutral-800 transition-colors duration-300">
                                <div className="bg-primary/10 w-11 h-11 flex items-center justify-center rounded-xl mb-4">
                                    <Phone className="w-5 h-5 text-primary" />
                                </div>
                                <h3 className="text-lg font-bold font-heading text-white mb-2 tracking-wide">
                                    Call Us
                                </h3>
                                <a
                                    href="tel:+17573011862"
                                    className="inline-block text-lg font-bold text-primary hover:text-primary-dark transition-colors duration-200"
                                >
                                    (757) 301-1862
                                </a>
                            </div>

                            {/* Email Card */}
                            <div className="bg-neutral-900 rounded-2xl p-5 sm:p-6 hover:bg-neutral-800 transition-colors duration-300">
                                <div className="bg-primary/10 w-11 h-11 flex items-center justify-center rounded-xl mb-4">
                                    <Mail className="w-5 h-5 text-primary" />
                                </div>
                                <h3 className="text-lg font-bold font-heading text-white mb-2 tracking-wide">
                                    Email Us
                                </h3>
                                <a
                                    href="mailto:lockandloreva@gmail.com"
                                    className="inline-block text-primary hover:text-primary-dark font-bold text-sm transition-colors duration-200 break-all"
                                >
                                    lockandloreva@gmail.com
                                </a>
                            </div>

                            {/* Hours Card */}
                            <div className="bg-neutral-900 rounded-2xl p-5 sm:p-6 hover:bg-neutral-800 transition-colors duration-300">
                                <div className="bg-primary/10 w-11 h-11 flex items-center justify-center rounded-xl mb-4">
                                    <Clock className="w-5 h-5 text-primary" />
                                </div>
                                <h3 className="text-lg font-bold font-heading text-white mb-4 tracking-wide">
                                    Hours
                                </h3>
                                <div className="space-y-2.5">
                                    <div className="flex justify-between items-center border-b border-neutral-800 pb-2.5">
                                        <span className="text-gray-500 text-sm">Monday</span>
                                        <span className="text-white font-semibold text-sm">Closed</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-neutral-800 pb-2.5">
                                        <span className="text-gray-500 text-sm">Tuesday</span>
                                        <span className="text-white font-semibold text-sm">4:00 PM - 10:00 PM</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-neutral-800 pb-2.5">
                                        <span className="text-gray-500 text-sm">Wednesday</span>
                                        <span className="text-white font-semibold text-sm">Closed</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-neutral-800 pb-2.5">
                                        <span className="text-gray-500 text-sm">Thursday</span>
                                        <span className="text-white font-semibold text-sm">4:00 PM - 10:00 PM</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-neutral-800 pb-2.5">
                                        <span className="text-gray-500 text-sm">Friday</span>
                                        <span className="text-white font-semibold text-sm">4:00 PM - 11:00 PM</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-neutral-800 pb-2.5">
                                        <span className="text-gray-500 text-sm">Saturday</span>
                                        <span className="text-white font-semibold text-sm">11:00 AM - 11:00 PM</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500 text-sm">Sunday</span>
                                        <span className="text-white font-semibold text-sm">11:00 AM - 11:00 PM</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-neutral-900 rounded-2xl p-8 sm:p-10 md:p-12 pb-10">
                                <div className="mb-10">
                                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-white tracking-wide">
                                        Send Us a Message
                                    </h2>
                                    <p className="text-gray-400 mt-3 text-[15px] sm:text-base leading-relaxed max-w-lg">
                                        Fill out the form below and we will get back to you as soon as possible.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-7 pb-4">
                                    {/* Name and Email Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className="block text-xs font-semibold text-gray-300 mb-2.5 uppercase tracking-widest">
                                                Your Name <span className="text-primary">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3.5 bg-neutral-800 border border-neutral-700 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 outline-none text-white text-[15px] placeholder:text-gray-500"
                                                placeholder="John Doe"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-xs font-semibold text-gray-300 mb-2.5 uppercase tracking-widest">
                                                Email Address <span className="text-primary">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3.5 bg-neutral-800 border border-neutral-700 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 outline-none text-white text-[15px] placeholder:text-gray-500"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>

                                    {/* Phone and Subject Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="phone" className="block text-xs font-semibold text-gray-300 mb-2.5 uppercase tracking-widest">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3.5 bg-neutral-800 border border-neutral-700 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 outline-none text-white text-[15px] placeholder:text-gray-500"
                                                placeholder="(555) 123-4567"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="subject" className="block text-xs font-semibold text-gray-300 mb-2.5 uppercase tracking-widest">
                                                Subject <span className="text-primary">*</span>
                                            </label>
                                            <select
                                                id="subject"
                                                name="subject"
                                                required
                                                value={formData.subject}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3.5 bg-neutral-800 border border-neutral-700 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 outline-none text-white text-[15px] appearance-none"
                                                style={{
                                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                                                    backgroundRepeat: "no-repeat",
                                                    backgroundPosition: "right 16px center",
                                                }}
                                            >
                                                <option value="">Select a subject</option>
                                                <option value="booking">Booking Inquiry</option>
                                                <option value="group">Group / Private Events</option>
                                                <option value="gift">Gift Cards</option>
                                                <option value="general">General Question</option>
                                                <option value="feedback">Feedback</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label htmlFor="message" className="block text-xs font-semibold text-gray-300 mb-2.5 uppercase tracking-widest">
                                            Your Message <span className="text-primary">*</span>
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            required
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows={6}
                                            className="w-full px-4 py-3.5 bg-neutral-800 border border-neutral-700 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 outline-none resize-none text-white text-[15px] placeholder:text-gray-500 leading-relaxed"
                                            placeholder="Tell us about your inquiry..."
                                        />
                                    </div>

                                    {/* Success Message */}
                                    {submitStatus === "success" && (
                                        <div className="bg-green-950/40 rounded-xl px-5 py-4">
                                            <p className="text-green-300 font-semibold text-sm leading-snug">
                                                Thank you for your message! We will get back to you soon.
                                            </p>
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-primary hover:bg-primary-dark text-neutral-950 font-medium px-6 py-3 text-base rounded-full shadow-[0_4px_0_0_rgba(122,92,32,1)] hover:shadow-[0_2px_0_0_rgba(122,92,32,1)] active:shadow-[0_0px_0_0_rgba(122,92,32,1)] hover:translate-y-[2px] active:translate-y-[4px] transition-all duration-150 relative before:absolute before:inset-0 before:rounded-full before:shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.2)] before:pointer-events-none uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:active:translate-y-0"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white relative z-10" />
                                                    <span className="relative z-10">Sending...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4 relative z-10" />
                                                    <span className="relative z-10">Send Message</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
