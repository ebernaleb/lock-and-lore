import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
    title: "Privacy Policy | Lock & Lore Escape Rooms",
    description:
        "Privacy Policy for Lock & Lore Escape Rooms. Learn how we collect, use, and protect your personal information when you book and visit our escape rooms in Virginia Beach, VA.",
};

/* ────────────────────────────────────────────────────────────────────────────
   Structured privacy policy content tailored for Lock & Lore's data
   practices, including OTC integration, booking data, and marketing.
   ──────────────────────────────────────────────────────────────────────────── */

const sections = [
    {
        id: "introduction",
        title: "1. Introduction",
        content: [
            'Lock & Lore Escape Rooms ("Lock & Lore," "we," "us," or "our") respects your privacy and is committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website (lockandlore.com), make a booking, participate in our escape room experiences, or interact with us in any other way.',
            "By using our website or services, you consent to the practices described in this Privacy Policy. If you do not agree with the terms outlined here, please do not use our website or provide us with your personal information.",
        ],
    },
    {
        id: "information-collected",
        title: "2. Information We Collect",
        content: [
            "We collect information in several ways depending on how you interact with us.",
            "Information You Provide Directly: When you make a booking, contact us, or sign up for communications, we may collect your full name, email address, phone number, and payment information (processed securely by our third-party payment provider). When you sign a liability waiver, we collect your name, date of birth, emergency contact information, and electronic signature. If you purchase a gift card, we collect the recipient's name and email address in addition to your own.",
            "Information Collected Automatically: When you visit our website, we automatically collect certain technical information including your IP address, browser type and version, operating system, referring URL, pages visited and time spent on each page, device type (desktop, mobile, tablet), and approximate geographic location (city/region level, derived from IP address).",
            "Information From Third Parties: Our booking system is powered by Off The Couch (OTC), a third-party platform. When you complete a booking through OTC, they share your reservation details with us including your name, contact information, booking date and time, group size, and payment confirmation. We do not receive or store your full credit card number, CVV, or banking details.",
        ],
    },
    {
        id: "how-we-use",
        title: "3. How We Use Your Information",
        content: [
            "We use the information we collect for the following purposes:",
            "Booking & Service Delivery: To process and confirm your reservations, send booking confirmations and reminders, manage check-in and waiver completion, communicate schedule changes or important updates about your visit, and provide customer support related to your booking.",
            "Safety & Operations: To administer liability waivers as required for participation, contact you or your emergency contact in case of an incident, maintain security through our closed-circuit monitoring system (footage is retained for 30 days and used solely for safety purposes), and comply with local health and safety regulations.",
            "Communications & Marketing: To send you post-visit follow-up emails (such as review requests or thank-you messages), notify you of promotions, new room launches, or special events (only if you have opted in), and respond to your inquiries submitted through our contact form or email. You may opt out of marketing communications at any time by clicking the unsubscribe link in any email or by contacting us directly.",
            "Website Improvement: To analyze website traffic and usage patterns, improve our website design and user experience, identify and fix technical issues, and understand which rooms and experiences are most popular.",
        ],
    },
    {
        id: "cookies",
        title: "4. Cookies & Tracking Technologies",
        content: [
            "Our website uses cookies and similar tracking technologies to enhance your browsing experience and gather analytics data.",
            "Essential Cookies: These are necessary for the website to function properly. They enable core features such as page navigation, session management, and access to secure areas of the site. These cookies do not collect personal information and cannot be disabled without impairing site functionality.",
            "Analytics Cookies: We use analytics services (including Google Analytics) to understand how visitors interact with our website. These cookies collect anonymized data about page views, session duration, traffic sources, and user flow through the site. This data helps us improve our website and marketing efforts.",
            "Third-Party Cookies: Our embedded booking system (powered by Off The Couch) may set its own cookies to manage the booking session, retain form data, and process payments. These cookies are governed by OTC's privacy policy. We may also use social media plugins or embedded content that set cookies from their respective platforms.",
            "Managing Cookies: Most web browsers allow you to control cookies through their settings. You can typically choose to block all cookies, accept all cookies, or be notified when a cookie is set. Please note that disabling certain cookies may limit your ability to use some features of our website, including the booking system.",
        ],
    },
    {
        id: "data-sharing",
        title: "5. How We Share Your Information",
        content: [
            "We do not sell your personal information to third parties. We may share your information in the following limited circumstances:",
            "Service Providers: We share booking and contact information with Off The Couch (OTC) to process reservations and payments. We may share your email address with our email marketing platform to send communications you have opted into. We use web hosting and analytics providers who may process technical data on our behalf.",
            "Legal Requirements: We may disclose your information if required to do so by law, court order, or governmental regulation, or if we believe in good faith that disclosure is necessary to protect our rights, your safety, or the safety of others.",
            "Business Transfers: In the event of a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction. We will notify you of any such change via email or a prominent notice on our website.",
        ],
    },
    {
        id: "data-security",
        title: "6. Data Security",
        content: [
            "We implement reasonable administrative, technical, and physical safeguards to protect your personal information from unauthorized access, alteration, disclosure, or destruction. These measures include:",
            "All data transmitted through our website is encrypted using SSL/TLS (HTTPS). Payment processing is handled entirely by PCI-DSS compliant third-party processors; we never store credit card numbers on our servers. Access to customer data is restricted to authorized personnel who require it for their job responsibilities. Our website and systems are regularly updated to address security vulnerabilities.",
            "While we strive to protect your information, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security, but we are committed to taking every reasonable precaution.",
        ],
    },
    {
        id: "data-retention",
        title: "7. Data Retention",
        content: [
            "We retain your personal information only for as long as necessary to fulfill the purposes described in this policy, unless a longer retention period is required by law.",
            "Booking records (name, contact information, booking details) are retained for up to 3 years for customer service and business record-keeping purposes. Liability waivers are retained for 7 years in accordance with Virginia's statute of limitations for personal injury claims. Marketing contact lists are maintained until you unsubscribe or request deletion. Website analytics data is retained in anonymized form and is not linked to individual identities. Security camera footage is retained for 30 days and then automatically overwritten.",
        ],
    },
    {
        id: "your-rights",
        title: "8. Your Rights & Choices",
        content: [
            "Depending on your location, you may have certain rights regarding your personal information:",
            "Access: You may request a copy of the personal information we hold about you. Correction: You may request that we correct inaccurate or incomplete information. Deletion: You may request that we delete your personal information, subject to legal retention requirements. Opt-Out: You may opt out of marketing emails at any time using the unsubscribe link or by contacting us. You may also opt out of analytics tracking by using browser-level privacy controls or a tool like the Google Analytics Opt-Out Browser Add-on.",
            "To exercise any of these rights, please contact us at lockandloreva@gmail.com. We will respond to your request within 30 days.",
        ],
    },
    {
        id: "virginia-privacy",
        title: "9. Virginia Consumer Data Protection Act (VCDPA)",
        content: [
            "If you are a Virginia resident, you may have additional rights under the Virginia Consumer Data Protection Act (VCDPA), including the right to confirm whether we are processing your personal data, access your data, correct inaccuracies, delete your data, and obtain a portable copy of your data.",
            "You also have the right to opt out of the processing of your personal data for purposes of targeted advertising, the sale of personal data, or profiling in furtherance of decisions that produce legal or similarly significant effects. Lock & Lore does not sell personal data or use it for profiling.",
            "To submit a VCDPA request, please email lockandloreva@gmail.com with the subject line \"VCDPA Request.\" We may ask you to verify your identity before processing your request. If we deny your request, you have the right to appeal by contacting us within 30 days of receiving our response.",
        ],
    },
    {
        id: "children",
        title: "10. Children's Privacy",
        content: [
            "Our website is not directed at children under the age of 13, and we do not knowingly collect personal information from children under 13. If a child under 13 participates in an escape room experience, a parent or legal guardian must make the booking and sign the liability waiver on their behalf.",
            "If you believe we have inadvertently collected information from a child under 13, please contact us immediately at lockandloreva@gmail.com and we will promptly delete the information.",
        ],
    },
    {
        id: "third-party-links",
        title: "11. Third-Party Links & Services",
        content: [
            "Our website may contain links to third-party websites, including social media platforms, review sites, and the Off The Couch booking platform. This Privacy Policy applies only to Lock & Lore's website and services. We are not responsible for the privacy practices of third-party sites.",
            "We encourage you to review the privacy policies of any third-party site you visit through links on our website, particularly the Off The Couch privacy policy when making bookings.",
        ],
    },
    {
        id: "changes",
        title: "12. Changes to This Privacy Policy",
        content: [
            'We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or legal requirements. When we make changes, we will update the "Last Updated" date at the top of this page. For material changes, we may also notify you via email or a prominent notice on our website.',
            "We encourage you to review this Privacy Policy periodically. Your continued use of our website or services after any changes constitutes your acceptance of the updated policy.",
        ],
    },
    {
        id: "contact",
        title: "13. Contact Us",
        content: [
            "If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:",
            "Lock & Lore Escape Rooms\n138 S. Rosemont RD, STE #216\nVirginia Beach, VA 23452\nEmail: lockandloreva@gmail.com\nPhone: (757) 301-1862",
            "For privacy-specific inquiries, you may also email us directly with the subject line \"Privacy Inquiry\" for expedited handling.",
        ],
    },
];

export default function PrivacyPage() {
    return (
        <main className="min-h-screen font-sans selection:bg-primary selection:text-neutral-950 bg-black">
            <Navbar />

            {/* Hero Section */}
            <div className="relative bg-black pt-16">
                {/* Background image with overlay */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-30"
                    style={{ backgroundImage: "url('/images/hero_img.png')" }}
                    aria-hidden="true"
                />
                {/* Gradient fade at bottom for seamless transition */}
                <div
                    className="absolute inset-x-0 bottom-0 h-32 z-[1] pointer-events-none"
                    style={{
                        background:
                            "linear-gradient(to top, rgba(0,0,0,1) 0%, transparent 100%)",
                    }}
                    aria-hidden="true"
                />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-36 text-center">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading text-white mb-5 tracking-wide">
                        Privacy <span className="text-primary">Policy</span>
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        Your privacy matters to us. Learn how we collect, use, and protect
                        your personal information.
                    </p>
                    <p className="text-sm text-gray-500 mt-4">
                        Last Updated: February 10, 2026
                    </p>
                </div>
            </div>

            {/* Privacy Content */}
            <section className="py-20 md:py-28">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Quick Navigation */}
                    <nav
                        className="bg-neutral-900 rounded-2xl p-6 sm:p-8 mb-12"
                        aria-label="Table of contents"
                    >
                        <h2 className="text-lg font-bold font-heading text-white mb-4 tracking-wide">
                            Table of Contents
                        </h2>
                        <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                            {sections.map((section) => (
                                <li key={section.id}>
                                    <a
                                        href={`#${section.id}`}
                                        className="text-sm text-gray-400 hover:text-primary transition-colors duration-200 leading-relaxed"
                                    >
                                        {section.title}
                                    </a>
                                </li>
                            ))}
                        </ol>
                    </nav>

                    {/* Summary Card */}
                    <div className="bg-neutral-900 rounded-2xl p-6 sm:p-8 mb-12 border border-neutral-800">
                        <h2 className="text-lg font-bold font-heading text-white mb-3 tracking-wide">
                            Privacy at a Glance
                        </h2>
                        <ul className="space-y-3">
                            {[
                                "We collect only the information necessary to process your booking and ensure your safety.",
                                "We never sell your personal data to third parties.",
                                "Payment processing is handled by PCI-DSS compliant providers -- we never store your credit card details.",
                                "You can opt out of marketing emails at any time.",
                                "You have the right to access, correct, or delete your personal information.",
                            ].map((item, idx) => (
                                <li
                                    key={idx}
                                    className="flex items-start gap-3 text-gray-400 text-[15px] sm:text-base leading-relaxed"
                                >
                                    <span
                                        className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"
                                        aria-hidden="true"
                                    />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Sections */}
                    <div className="space-y-12">
                        {sections.map((section) => (
                            <article
                                key={section.id}
                                id={section.id}
                                className="scroll-mt-28"
                            >
                                <h2 className="text-xl sm:text-2xl font-bold font-heading text-white mb-4 tracking-wide">
                                    {section.title}
                                </h2>
                                <div className="space-y-4">
                                    {section.content.map((paragraph, idx) => (
                                        <p
                                            key={idx}
                                            className="text-gray-400 text-[15px] sm:text-base leading-relaxed whitespace-pre-line"
                                        >
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* Separator */}
                    <div className="my-16 border-t border-neutral-800" />

                    {/* Related Links CTA */}
                    <div className="bg-neutral-900 rounded-2xl p-8 sm:p-12 text-center">
                        <h3 className="text-2xl sm:text-3xl font-bold font-heading text-white mb-3 tracking-wide">
                            Have Privacy Concerns?
                        </h3>
                        <p className="text-gray-400 text-[15px] sm:text-base leading-relaxed max-w-lg mx-auto mb-8">
                            We take your privacy seriously. If you have questions or want
                            to exercise your rights, reach out to us.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-neutral-950 font-medium px-6 py-3 text-base rounded-full shadow-[0_4px_0_0_rgba(122,92,32,1)] hover:shadow-[0_2px_0_0_rgba(122,92,32,1)] active:shadow-[0_0px_0_0_rgba(122,92,32,1)] hover:translate-y-[2px] active:translate-y-[4px] transition-all duration-150 relative before:absolute before:inset-0 before:rounded-full before:shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.2)] before:pointer-events-none uppercase tracking-widest"
                            >
                                <span className="relative z-10">Contact Us</span>
                            </Link>
                            <Link
                                href="/terms"
                                className="inline-flex items-center justify-center gap-2 bg-zinc-700 hover:bg-zinc-600 text-white font-medium px-6 py-3 text-base rounded-full shadow-[0_4px_0_0_rgba(39,39,42,1)] hover:shadow-[0_2px_0_0_rgba(39,39,42,1)] active:shadow-[0_0px_0_0_rgba(39,39,42,1)] hover:translate-y-[2px] active:translate-y-[4px] transition-all duration-150 relative before:absolute before:inset-0 before:rounded-full before:shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.15)] before:pointer-events-none uppercase tracking-widest"
                            >
                                <span className="relative z-10">Terms of Service</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <div className="py-14 bg-black" />
            <Footer />
        </main>
    );
}
