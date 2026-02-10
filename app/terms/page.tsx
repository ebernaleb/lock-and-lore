import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
    title: "Terms of Service | Lock & Lore Escape Rooms",
    description:
        "Terms of Service for Lock & Lore Escape Rooms in Virginia Beach, VA. Review our booking policies, cancellation terms, liability waivers, and rules of conduct.",
};

/* ────────────────────────────────────────────────────────────────────────────
   Structured legal content tailored for Lock & Lore Escape Room business.
   Each section is a heading + paragraph(s) array for clean rendering.
   ──────────────────────────────────────────────────────────────────────────── */

const sections = [
    {
        id: "acceptance",
        title: "1. Acceptance of Terms",
        content: [
            "By accessing or using the Lock & Lore Escape Rooms website (lockandlore.com), making a reservation, or participating in any of our escape room experiences, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website or services.",
            'These terms constitute a legally binding agreement between you ("Guest," "you," or "your") and Lock & Lore Escape Rooms ("Lock & Lore," "we," "us," or "our"), located at 138 S. Rosemont RD, STE #216, Virginia Beach, VA 23452.',
        ],
    },
    {
        id: "bookings",
        title: "2. Bookings & Reservations",
        content: [
            "All escape room bookings are made through our website via the Off The Couch booking platform. By completing a reservation, you agree to the following:",
            "A deposit or full payment is required at the time of booking to secure your reservation. The amount varies by room and group size and will be clearly displayed before you confirm your booking. All bookings are private -- you will never be paired with strangers. The person making the reservation is responsible for ensuring all members of their group comply with these terms.",
            "Reservations are subject to availability. We reserve the right to limit the number of bookings per time slot and to adjust our schedule, room offerings, or pricing at any time without prior notice.",
        ],
    },
    {
        id: "cancellations",
        title: "3. Cancellations, Rescheduling & Refunds",
        content: [
            "We understand plans change. Our cancellation and rescheduling policy is as follows:",
            "Rescheduling: You may reschedule your booking free of charge up to 24 hours before your scheduled game time. Rescheduling requests made less than 24 hours in advance are subject to availability and may incur a rescheduling fee.",
            "Cancellations: Cancellations made at least 48 hours before the scheduled game time are eligible for a full refund. Cancellations made between 24 and 48 hours in advance are eligible for a 50% refund or full credit toward a future booking. Cancellations made less than 24 hours in advance, or no-shows, are not eligible for a refund.",
            "To request a cancellation or rescheduling, please contact us at lockandloreva@gmail.com or call (757) 301-1862. Refunds are processed to the original payment method within 5-10 business days.",
        ],
    },
    {
        id: "arrival",
        title: "4. Arrival & Check-In",
        content: [
            "Guests are required to arrive at least 15 minutes before their scheduled game time. This allows time for check-in, restroom use, personal item storage, and your pre-game briefing from your Game Master.",
            "Late arrivals may result in a shortened game experience. If you arrive more than 15 minutes past your scheduled start time, your reservation may be forfeited without a refund, as delays impact subsequent bookings.",
        ],
    },
    {
        id: "age-requirements",
        title: "5. Age Requirements & Supervision",
        content: [
            "Our escape rooms are designed for a wide range of ages, but we recommend our experiences for guests aged 10 and older due to puzzle complexity. The following policies apply:",
            "Guests under the age of 16 must be accompanied by a participating adult (18 years or older) at all times during the experience. Guests under the age of 18 must have a parent or legal guardian sign the liability waiver on their behalf prior to participation. We reserve the right to deny entry to unaccompanied minors.",
        ],
    },
    {
        id: "waivers",
        title: "6. Liability Waivers",
        content: [
            "All participants are required to sign a liability waiver before entering an escape room. Waivers are sent electronically to the email address provided during booking and must be completed before your game begins. For guests under 18, a parent or legal guardian must sign the waiver.",
            "The waiver acknowledges the inherent risks of physical activity in an enclosed environment, including but not limited to: tripping, bumping into objects, eye strain in low-light conditions, and the potential for stress or claustrophobic feelings. By signing the waiver, you release Lock & Lore Escape Rooms, its owners, employees, and agents from liability for any injury, loss, or damage that may occur during your visit, except in cases of gross negligence.",
        ],
    },
    {
        id: "conduct",
        title: "7. Rules of Conduct",
        content: [
            "To ensure a safe and enjoyable experience for all guests, the following rules must be observed at all times:",
            "Do not use excessive force on any props, locks, furniture, or room elements. Puzzles are designed to be solved with thought, not brute strength. Do not climb on furniture, walls, shelving, or any elevated surfaces. Do not remove or disassemble ceiling tiles, electrical fixtures, outlet covers, or any structural elements of the room.",
            "Cell phones, cameras, and recording devices are not permitted inside the escape rooms. This protects the integrity of our puzzles for future guests. Lockers are provided free of charge for personal belongings.",
            "Guests must not be under the influence of alcohol or drugs during their experience. Lock & Lore reserves the right to refuse entry or remove any guest who appears intoxicated or whose behavior poses a safety risk to themselves or others.",
            "Any guest who intentionally damages property will be held financially responsible for the cost of repair or replacement.",
        ],
    },
    {
        id: "health-safety",
        title: "8. Health & Safety",
        content: [
            "Our escape rooms involve enclosed spaces, low lighting, and physical elements such as bending, reaching, and moving around a room. Guests with medical conditions that may be affected by these conditions (including but not limited to epilepsy, heart conditions, claustrophobia, or mobility impairments) should consult with a physician before booking.",
            "Lock & Lore is committed to maintaining a clean and safe environment. Our rooms are cleaned and sanitized between each session. If you are feeling unwell on the day of your booking, we encourage you to reschedule. Please contact us and we will work with you to find an alternative date.",
            "In the event of an emergency, all rooms have clearly marked emergency exits and are monitored by staff at all times via closed-circuit cameras. Your Game Master can open the room immediately if needed.",
        ],
    },
    {
        id: "intellectual-property",
        title: "9. Intellectual Property",
        content: [
            "All content on the Lock & Lore website -- including text, graphics, logos, images, room designs, puzzle concepts, and storylines -- is the property of Lock & Lore Escape Rooms and is protected by applicable intellectual property laws.",
            "Guests may not photograph, video record, or otherwise reproduce or share details of room designs, puzzles, solutions, or storylines without our prior written consent. Sharing spoilers publicly (including on social media or review platforms) is strongly discouraged and may result in being barred from future bookings.",
        ],
    },
    {
        id: "gift-cards",
        title: "10. Gift Cards",
        content: [
            "Lock & Lore gift cards are available for purchase on our website. Gift cards are non-refundable and have no expiration date unless otherwise required by Virginia state law. Gift cards may be applied toward any escape room booking or in-store purchase. Lost or stolen gift cards cannot be replaced.",
        ],
    },
    {
        id: "group-events",
        title: "11. Group Events & Private Bookings",
        content: [
            "Lock & Lore offers private events including corporate team building, birthday parties, and special occasions. Group event bookings may be subject to additional terms, minimum headcounts, and separate pricing agreements. A non-refundable deposit is required to reserve a private event date.",
            "For group events, the organizing party is responsible for communicating these Terms of Service to all attendees and ensuring that all participants have signed the required liability waivers prior to the event.",
        ],
    },
    {
        id: "third-party",
        title: "12. Third-Party Services",
        content: [
            "Our booking and payment processing is facilitated through Off The Couch (OTC), a third-party platform. When you make a booking, you may also be subject to OTC's terms of service and privacy policy. Lock & Lore is not responsible for the practices or policies of third-party service providers.",
            "Our website may contain links to third-party websites or services. We do not endorse or assume responsibility for the content, privacy policies, or practices of any third-party sites.",
        ],
    },
    {
        id: "limitation",
        title: "13. Limitation of Liability",
        content: [
            'Lock & Lore Escape Rooms, its owners, operators, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of our services, website, or facilities. Our total liability for any claim shall not exceed the amount you paid for your booking.',
            "This limitation applies to the fullest extent permitted by the laws of the Commonwealth of Virginia.",
        ],
    },
    {
        id: "governing-law",
        title: "14. Governing Law & Disputes",
        content: [
            "These Terms of Service are governed by and construed in accordance with the laws of the Commonwealth of Virginia, without regard to its conflict of law provisions. Any disputes arising from these terms or your use of our services shall be resolved in the courts of Virginia Beach, Virginia.",
        ],
    },
    {
        id: "changes",
        title: "15. Changes to These Terms",
        content: [
            'We reserve the right to update or modify these Terms of Service at any time. Changes will be posted on this page with an updated "Last Updated" date. Your continued use of our website or services after changes are posted constitutes your acceptance of the revised terms.',
            "We encourage you to review these terms periodically to stay informed of any updates.",
        ],
    },
    {
        id: "contact",
        title: "16. Contact Information",
        content: [
            "If you have any questions, concerns, or requests regarding these Terms of Service, please contact us:",
            "Lock & Lore Escape Rooms\n138 S. Rosemont RD, STE #216\nVirginia Beach, VA 23452\nEmail: lockandloreva@gmail.com\nPhone: (757) 301-1862",
        ],
    },
];

export default function TermsPage() {
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
                        Terms of <span className="text-primary">Service</span>
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        Please review our terms carefully before booking your escape room
                        experience.
                    </p>
                    <p className="text-sm text-gray-500 mt-4">
                        Last Updated: February 10, 2026
                    </p>
                </div>
            </div>

            {/* Terms Content */}
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
                            Questions About Our Policies?
                        </h3>
                        <p className="text-gray-400 text-[15px] sm:text-base leading-relaxed max-w-lg mx-auto mb-8">
                            If anything is unclear, our team is happy to walk you through
                            our policies before you book.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-neutral-950 font-medium px-6 py-3 text-base rounded-full shadow-[0_4px_0_0_rgba(122,92,32,1)] hover:shadow-[0_2px_0_0_rgba(122,92,32,1)] active:shadow-[0_0px_0_0_rgba(122,92,32,1)] hover:translate-y-[2px] active:translate-y-[4px] transition-all duration-150 relative before:absolute before:inset-0 before:rounded-full before:shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.2)] before:pointer-events-none uppercase tracking-widest"
                            >
                                <span className="relative z-10">Contact Us</span>
                            </Link>
                            <Link
                                href="/privacy"
                                className="inline-flex items-center justify-center gap-2 bg-zinc-700 hover:bg-zinc-600 text-white font-medium px-6 py-3 text-base rounded-full shadow-[0_4px_0_0_rgba(39,39,42,1)] hover:shadow-[0_2px_0_0_rgba(39,39,42,1)] active:shadow-[0_0px_0_0_rgba(39,39,42,1)] hover:translate-y-[2px] active:translate-y-[4px] transition-all duration-150 relative before:absolute before:inset-0 before:rounded-full before:shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.15)] before:pointer-events-none uppercase tracking-widest"
                            >
                                <span className="relative z-10">Privacy Policy</span>
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
