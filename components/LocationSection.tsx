import Link from "next/link";
import {
  Phone,
  Mail,
  Navigation,
  ArrowRight,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const contactDetails = [
  {
    icon: Navigation,
    label: "Address",
    value: "138 S. Rosemont RD, STE #216, Virginia Beach, VA 23452",
    href: "https://www.google.com/maps/search/?api=1&query=138+S+Rosemont+Rd+STE+216+Virginia+Beach+VA+23452",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "(757) 301-1862",
    href: "tel:+17573011862",
  },
  {
    icon: Mail,
    label: "Email",
    value: "lockandloreva@gmail.com",
    href: "mailto:lockandloreva@gmail.com",
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function LocationSection() {
  return (
    <section
      className="py-20 sm:py-24 bg-black relative overflow-hidden"
      id="location"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left: Content */}
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Find <span className="text-primary">Us</span>
            </h2>
            <p className="text-gray-400 mb-8 max-w-lg leading-relaxed">
              Conveniently located in Virginia Beach with free parking. Walk-ins
              welcome, but reservations are recommended.
            </p>

            {/* Contact Details */}
            <div className="space-y-4 mb-8">
              {contactDetails.map((detail, index) => (
                <Link
                  key={index}
                  href={detail.href}
                  target={detail.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    detail.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="flex items-start gap-3 group"
                >
                  <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
                    <detail.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">
                      {detail.label}
                    </h3>
                    <p className="text-gray-400 text-sm group-hover:text-primary transition-colors duration-200">
                      {detail.value}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* CTA */}
            <Link
              href="https://www.google.com/maps/search/?api=1&query=138+S+Rosemont+Rd+STE+216+Virginia+Beach+VA+23452"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-neutral-950 font-medium px-6 py-3 text-base rounded-full shadow-[0_4px_0_0_rgba(122,92,32,1)] hover:shadow-[0_2px_0_0_rgba(122,92,32,1)] active:shadow-[0_0px_0_0_rgba(122,92,32,1)] hover:translate-y-[2px] active:translate-y-[4px] transition-all duration-150 relative before:absolute before:inset-0 before:rounded-full before:shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.2)] before:pointer-events-none uppercase tracking-wide"
            >
              <span className="relative z-10">Get Directions</span>
              <ArrowRight className="w-4 h-4 relative z-10" />
            </Link>
          </div>

          {/* Right: Map Visual */}
          <div className="order-1 lg:order-2 lg:mt-16">
            <div className="relative w-full">
              {/* Decorative glow behind the map */}
              <div
                className="absolute inset-0 bg-primary/5 rounded-3xl blur-2xl scale-105 pointer-events-none"
                aria-hidden="true"
              />

              {/* Map embed */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-neutral-800/50 aspect-[4/3]">
                <iframe
                  title="Lock and Lore Location"
                  src="https://maps.google.com/maps?q=138+S+Rosemont+Rd+STE+216+Virginia+Beach+VA+23452&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full absolute inset-0"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
