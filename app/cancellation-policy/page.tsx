import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
    title: "Cancellation & Refund Policy | Lock & Lore Escape Rooms",
    description:
        "Cancellation and refund policy for Lock & Lore Escape Rooms in Virginia Beach, VA. Learn about our cancellation timeframes, refund tiers, rescheduling options, and no-show policy.",
};

/* ────────────────────────────────────────────────────────────────────────────
   Cancellation & refund policy content for Lock & Lore Escape Rooms.
   Based on industry-standard practices from established escape room businesses,
   balancing business protection with customer fairness.
   ──────────────────────────────────────────────────────────────────────────── */

const sections = [
    {
        id: "overview",
        title: "1. Overview",
        content: [
            "At Lock & Lore Escape Rooms, we understand that plans can change. This Cancellation & Refund Policy outlines what to expect if you need to cancel, reschedule, or modify your booking. We have designed this policy to be fair to our guests while protecting our ability to offer a premium experience for everyone.",
            "Because our escape rooms operate on a fixed schedule with limited time slots, last-minute cancellations prevent other guests from booking those spots. The timeframes and terms below reflect this reality and are consistent with industry-standard practices across the escape room industry.",
            "This policy applies to all bookings made through our website (lockandlore.com) via the Off The Couch booking platform, as well as bookings made by phone or email.",
        ],
    },
    {
        id: "cancellation-timeframes",
        title: "2. Cancellation Timeframes & Refund Tiers",
        content: [
            "Our refund policy is based on how far in advance you notify us of your cancellation. All timeframes are measured from your scheduled game start time.",
            "48 hours or more before your game: You are eligible for a full refund to your original payment method, minus a 5% processing fee to cover transaction costs. Alternatively, you may receive a full credit toward a future booking with no processing fee deducted.",
            "Between 24 and 48 hours before your game: You are eligible for a 50% refund to your original payment method, or a full credit toward a future booking. Credits must be used within 90 days of the original booking date.",
            "Less than 24 hours before your game: No refund will be issued. However, we may offer a partial credit toward a future booking at our discretion on a case-by-case basis. Please contact us to discuss your situation.",
            "All refunds are processed to the original payment method and typically appear on your statement within 5 to 10 business days, depending on your financial institution.",
        ],
    },
    {
        id: "how-to-cancel",
        title: "3. How to Cancel",
        content: [
            "To cancel your booking, you may contact us through any of the following methods:",
            "Email: Send your cancellation request to lockandloreva@gmail.com. Please include your booking confirmation number, the name on the reservation, and your preferred resolution (refund or credit). We respond to all email requests within 24 hours during business days.",
            "Phone: Call us at (757) 301-1862 during our business hours. If you reach our voicemail, leave a message with your name, confirmation number, and a callback number. Please note that voicemail messages are timestamped and will be used to determine your cancellation window.",
            "Cancellations are considered effective at the time we receive your request (email timestamp or call/voicemail time), not at the time we respond or process the request. We recommend emailing for cancellations as it provides a clear written record with a timestamp.",
        ],
    },
    {
        id: "rescheduling",
        title: "4. Rescheduling Policy",
        content: [
            "We encourage rescheduling over cancellation whenever possible. Rescheduling allows you to keep your reservation value and simply move it to a date and time that works better for you.",
            "Free rescheduling: You may reschedule your booking free of charge if you notify us at least 24 hours before your originally scheduled game time. Rescheduled bookings are subject to availability.",
            "Late rescheduling: Rescheduling requests made less than 24 hours before your scheduled game time may incur a $10 rescheduling fee, subject to availability. Same-day rescheduling to a later time slot is permitted if availability allows, but the fee still applies.",
            "Each booking may be rescheduled a maximum of two times. After two reschedules, the standard cancellation and refund policy applies to any further changes. Rescheduled bookings must be used within 90 days of the original booking date.",
            "To reschedule, contact us by email at lockandloreva@gmail.com or by phone at (757) 301-1862 with your confirmation number and your preferred new date and time.",
        ],
    },
    {
        id: "no-show",
        title: "5. No-Show Policy",
        content: [
            "A no-show occurs when you fail to arrive for your scheduled game without notifying us in advance. No-shows are not eligible for any refund or credit.",
            "Guests are required to arrive at least 15 minutes before their scheduled game time for check-in, personal item storage, and the pre-game briefing. If you arrive more than 15 minutes after your scheduled start time without prior communication, your reservation may be treated as a no-show and forfeited without refund, as late starts impact all subsequent bookings for the day.",
            "If you are running late, please call us at (757) 301-1862 as soon as possible. We will do our best to accommodate you, but we cannot guarantee entry or a full-length game experience if your arrival significantly delays the schedule. Late arrivals within 15 minutes of the scheduled start time will result in a shortened game experience equal to the remaining time in your slot.",
        ],
    },
    {
        id: "group-bookings",
        title: "6. Group Bookings & Private Events",
        content: [
            "Group bookings (defined as reservations involving two or more rooms booked simultaneously, or parties of 10 or more guests) and private events are subject to extended cancellation timeframes due to the larger operational commitment they require.",
            "72 hours or more before the event: Full refund minus a 5% processing fee, or full credit toward a future group booking.",
            "Between 48 and 72 hours before the event: 50% refund, or full credit toward a future booking to be used within 90 days.",
            "Less than 48 hours before the event: No refund. Credit toward a future booking may be offered at our discretion.",
            "For corporate team-building events and private parties, a separate booking agreement may be provided at the time of reservation with specific cancellation terms. In such cases, the terms in that agreement supersede this general policy.",
            "Reducing your group size after booking: If some members of your group cannot attend, refunds for individual participants are generally not available once the booking is confirmed. However, you are welcome to bring substitute participants at no additional charge. If your group size decreases significantly (by 50% or more), please contact us to discuss options.",
        ],
    },
    {
        id: "gift-cards",
        title: "7. Gift Cards & Prepaid Bookings",
        content: [
            "Gift cards purchased from Lock & Lore are non-refundable and non-transferable for cash value. Gift cards do not expire unless otherwise required by Virginia state law.",
            "Bookings made using a gift card: If you cancel a booking that was paid for with a gift card, the refund will be issued as a credit back to the original gift card or as a new gift card code -- not as a cash refund. The same cancellation timeframes and tiers described in Section 2 apply.",
            "Promotional codes and discounted bookings: Bookings made with a promotional code or at a discounted rate are eligible for refund only up to the amount actually paid. The promotional value or discount cannot be refunded or converted to credit.",
        ],
    },
    {
        id: "special-circumstances",
        title: "8. Special Circumstances",
        content: [
            "We recognize that extraordinary situations arise that are beyond your control. In the following cases, we will work with you to find a fair resolution regardless of the standard cancellation timeframes:",
            "Severe weather: If a severe weather event (hurricane, blizzard, ice storm, or similar) makes travel to our facility unsafe, as determined by a local government advisory or state of emergency declaration, we will offer a full credit or free reschedule for affected bookings. If Lock & Lore closes due to weather, all bookings during the closure period will receive a full refund or credit at the guest's choice.",
            "Medical emergencies: If you or an immediate family member experiences a medical emergency that prevents you from attending, please contact us as soon as possible. We will work with you to reschedule at no charge or provide a credit. We may request reasonable documentation (such as a doctor's note) for emergencies claimed within the no-refund window.",
            "Facility issues: If Lock & Lore is unable to provide your booked experience due to equipment failure, staffing issues, or any other operational reason, you will receive a full refund or a complimentary rebooking at your convenience.",
            "Pandemic or public health orders: In the event of government-mandated closures or capacity restrictions that affect your booking, we will offer a full refund or credit for all impacted reservations.",
        ],
    },
    {
        id: "lock-and-lore-cancellations",
        title: "9. Cancellations by Lock & Lore",
        content: [
            "In rare cases, Lock & Lore may need to cancel a booking due to unforeseen circumstances such as facility maintenance, staffing shortages, or safety concerns. If we cancel your booking, you will receive a full refund with no processing fees deducted, or a complimentary rebooking to an alternative date of your choice.",
            "We will notify you of any cancellation as soon as possible via the email address and phone number provided in your booking. We will always make every reasonable effort to offer alternative times before cancelling outright.",
        ],
    },
    {
        id: "disputes",
        title: "10. Disputes & Chargebacks",
        content: [
            "If you believe a refund has been processed incorrectly or you have not received a refund you are entitled to, please contact us at lockandloreva@gmail.com before initiating a chargeback with your bank or credit card company. We are committed to resolving disputes promptly and fairly.",
            "Initiating a chargeback without first contacting us may delay the resolution and could result in additional fees from your payment provider. We maintain detailed records of all cancellation requests, communications, and refund transactions.",
        ],
    },
    {
        id: "changes",
        title: "11. Changes to This Policy",
        content: [
            'We may update this Cancellation & Refund Policy from time to time to reflect changes in our operations or legal requirements. Changes will be posted on this page with an updated "Last Updated" date. The policy in effect at the time of your booking applies to that booking.',
            "We encourage you to review this policy before each booking to stay informed of any updates.",
        ],
    },
    {
        id: "contact",
        title: "12. Contact Information",
        content: [
            "If you have any questions about this policy or need to request a cancellation, reschedule, or refund, please contact us:",
            "Lock & Lore Escape Rooms\n138 S. Rosemont RD, STE #216\nVirginia Beach, VA 23452\nEmail: lockandloreva@gmail.com\nPhone: (757) 301-1862",
            "Our team is available during business hours (see our website for current hours of operation) and will respond to all inquiries within one business day.",
        ],
    },
];

export default function CancellationPolicyPage() {
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
                        Cancellation &{" "}
                        <span className="text-primary">Refund Policy</span>
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        We want your experience to be stress-free from start to
                        finish. Here is everything you need to know about
                        cancellations, refunds, and rescheduling.
                    </p>
                    <p className="text-sm text-gray-500 mt-4">
                        Last Updated: February 10, 2026
                    </p>
                </div>
            </div>

            {/* Policy Content */}
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

                    {/* At a Glance Summary Card */}
                    <div className="bg-neutral-900 rounded-2xl p-6 sm:p-8 mb-12 border border-neutral-800">
                        <h2 className="text-lg font-bold font-heading text-white mb-3 tracking-wide">
                            Policy at a Glance
                        </h2>
                        <ul className="space-y-3">
                            {[
                                "Cancel 48+ hours before your game for a full refund (minus 5% processing fee) or full credit.",
                                "Cancel 24-48 hours before for a 50% refund or full credit toward a future booking.",
                                "Cancellations under 24 hours and no-shows are not eligible for refunds.",
                                "Free rescheduling is available with at least 24 hours notice.",
                                "Group bookings and private events require 72 hours notice for a full refund.",
                                "We make exceptions for severe weather, medical emergencies, and facility issues.",
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

                    {/* Refund Tiers Visual Summary */}
                    <div className="bg-neutral-900 rounded-2xl p-6 sm:p-8 mb-12 border border-neutral-800">
                        <h2 className="text-lg font-bold font-heading text-white mb-5 tracking-wide">
                            Refund Schedule
                        </h2>
                        <div className="space-y-4">
                            {[
                                {
                                    timeframe: "48+ hours before",
                                    refund: "Full refund",
                                    detail: "minus 5% processing fee, or full credit",
                                    color: "bg-green-500/20 text-green-400 border-green-500/30",
                                },
                                {
                                    timeframe: "24 - 48 hours before",
                                    refund: "50% refund",
                                    detail: "or full credit toward future booking",
                                    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
                                },
                                {
                                    timeframe: "Under 24 hours",
                                    refund: "No refund",
                                    detail: "partial credit may be offered case-by-case",
                                    color: "bg-red-500/20 text-red-400 border-red-500/30",
                                },
                                {
                                    timeframe: "No-show",
                                    refund: "No refund",
                                    detail: "no credit available",
                                    color: "bg-red-500/20 text-red-400 border-red-500/30",
                                },
                            ].map((tier, idx) => (
                                <div
                                    key={idx}
                                    className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-4 rounded-xl border ${tier.color}`}
                                >
                                    <span className="font-medium text-sm sm:text-base sm:w-48 flex-shrink-0">
                                        {tier.timeframe}
                                    </span>
                                    <span className="text-white font-bold text-sm sm:text-base sm:w-32 flex-shrink-0">
                                        {tier.refund}
                                    </span>
                                    <span className="text-gray-400 text-sm">
                                        {tier.detail}
                                    </span>
                                </div>
                            ))}
                        </div>
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
                            Need to Cancel or Reschedule?
                        </h3>
                        <p className="text-gray-400 text-[15px] sm:text-base leading-relaxed max-w-lg mx-auto mb-8">
                            Reach out to us and we will help you find the best
                            solution. We are here to make things easy.
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
