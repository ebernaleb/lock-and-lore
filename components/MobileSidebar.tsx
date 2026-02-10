"use client";

import { useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, ArrowRight, MapPin, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Navigation Links Configuration
// ---------------------------------------------------------------------------

interface NavLink {
  label: string;
  href: string;
  description?: string;
}

const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/", description: "Back to the beginning" },
  { label: "Escape Rooms", href: "/rooms", description: "Explore our experiences" },
  { label: "FAQ", href: "/faq", description: "Common questions" },
  { label: "Contact", href: "/contact", description: "Get in touch" },
];

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// ---------------------------------------------------------------------------
// MobileSidebar Component
// ---------------------------------------------------------------------------

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // ---- Lock body scroll when sidebar is open ----
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Focus the close button for accessibility
      setTimeout(() => closeButtonRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // ---- Close on Escape key ----
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  // ---- Trap focus within sidebar ----
  useEffect(() => {
    if (!isOpen || !sidebarRef.current) return;

    const sidebar = sidebarRef.current;
    const focusableSelector =
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const handleTabTrap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const focusableElements = sidebar.querySelectorAll(focusableSelector);
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleTabTrap);
    return () => document.removeEventListener("keydown", handleTabTrap);
  }, [isOpen]);

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Backdrop Overlay                                                    */}
      {/* ------------------------------------------------------------------ */}
      <div
        className={cn(
          "fixed inset-0 z-[60] transition-all duration-500",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      >
        {/* Dark scrim */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Sidebar Panel                                                       */}
      {/* ------------------------------------------------------------------ */}
      <div
        ref={sidebarRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        className={cn(
          "fixed top-0 right-0 z-[70] h-full w-[85vw] max-w-[380px]",
          "flex flex-col",
          "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Sidebar background with glassmorphism */}
        <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" />

        {/* Gold accent line on left edge */}
        <div
          className={cn(
            "absolute left-0 top-0 w-[2px] h-full",
            "transition-all duration-700 delay-200",
            isOpen ? "opacity-100" : "opacity-0"
          )}
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, #FBBD08 20%, #D4952A 50%, #FBBD08 80%, transparent 100%)",
          }}
          aria-hidden="true"
        />

        {/* Inner content - scrollable area */}
        <div className="relative z-10 flex flex-col h-full overflow-y-auto overscroll-contain">
          {/* ---- Header: Logo + Close Button ---- */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <Link href="/" onClick={onClose} className="block">
              <Image
                src="/images/mainlogo.png"
                alt="Lock & Lore"
                width={160}
                height={53}
                className="h-10 w-auto"
              />
            </Link>

            <button
              ref={closeButtonRef}
              onClick={onClose}
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full",
                "bg-white/5 border border-white/10",
                "text-gray-400 hover:text-white hover:bg-white/10",
                "transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
              )}
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Subtle separator */}
          <div className="mx-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* ---- Navigation Links ---- */}
          <nav className="flex-1 px-6 pt-8 pb-6" aria-label="Mobile navigation">
            <ul className="space-y-1">
              {NAV_LINKS.map((link, index) => (
                <li
                  key={link.href}
                  className={cn(
                    "sidebar-nav-item",
                    isOpen ? "sidebar-nav-item-enter" : "sidebar-nav-item-exit"
                  )}
                  style={{
                    animationDelay: isOpen ? `${150 + index * 80}ms` : "0ms",
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className={cn(
                      "group flex items-center gap-4 py-4 px-4 -mx-1 rounded-xl",
                      "transition-all duration-200",
                      "hover:bg-white/[0.04]",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:rounded-xl"
                    )}
                  >
                    {/* Gold accent bar on hover */}
                    <span
                      className={cn(
                        "w-[3px] h-8 rounded-full",
                        "bg-primary/0 group-hover:bg-primary",
                        "transition-all duration-300",
                        "group-hover:shadow-[0_0_8px_rgba(251,189,8,0.4)]"
                      )}
                    />

                    <div className="flex-1">
                      <span
                        className={cn(
                          "block text-[22px] font-bold text-white/90 tracking-tight",
                          "group-hover:text-white",
                          "transition-colors duration-200"
                        )}
                        style={{ fontFamily: "var(--font-playfair)" }}
                      >
                        {link.label}
                      </span>
                      {link.description && (
                        <span
                          className={cn(
                            "block text-xs text-white/30 mt-0.5 tracking-wide",
                            "group-hover:text-white/50",
                            "transition-colors duration-200"
                          )}
                        >
                          {link.description}
                        </span>
                      )}
                    </div>

                    {/* Arrow indicator */}
                    <ArrowRight
                      className={cn(
                        "w-4 h-4 text-white/0 group-hover:text-primary",
                        "transform translate-x-[-4px] group-hover:translate-x-0",
                        "transition-all duration-300"
                      )}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ---- Book Now CTA ---- */}
          <div
            className={cn(
              "px-6 pb-6",
              "sidebar-nav-item",
              isOpen ? "sidebar-nav-item-enter" : "sidebar-nav-item-exit"
            )}
            style={{
              animationDelay: isOpen
                ? `${150 + NAV_LINKS.length * 80 + 60}ms`
                : "0ms",
            }}
          >
            <Link
              href="/book"
              onClick={onClose}
              className={cn(
                "group relative flex items-center justify-center gap-3",
                "w-full py-4 rounded-2xl",
                "text-base font-semibold uppercase tracking-[0.15em]",
                "text-black",
                "transition-all duration-300",
                "overflow-hidden",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              )}
              style={{
                background:
                  "linear-gradient(135deg, #FBBD08 0%, #D4952A 50%, #FBBD08 100%)",
                backgroundSize: "200% 200%",
                fontFamily: "var(--font-inter)",
              }}
            >
              {/* Shimmer sweep overlay */}
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)",
                  backgroundSize: "200% 100%",
                  animation: "sidebar-cta-shimmer 1.5s ease-in-out infinite",
                }}
                aria-hidden="true"
              />
              <span className="relative z-10">Book Now</span>
              <ArrowRight className="relative z-10 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>

          {/* ---- Footer Info ---- */}
          <div
            className={cn(
              "px-6 pb-8 pt-2",
              "sidebar-nav-item",
              isOpen ? "sidebar-nav-item-enter" : "sidebar-nav-item-exit"
            )}
            style={{
              animationDelay: isOpen
                ? `${150 + NAV_LINKS.length * 80 + 140}ms`
                : "0ms",
            }}
          >
            {/* Separator */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

            <div className="space-y-3">
              <a
                href="tel:+17573011862"
                className="flex items-center gap-3 text-white/40 hover:text-primary transition-colors duration-200 text-sm"
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>(757) 301-1862</span>
              </a>
              <div className="flex items-start gap-3 text-white/40 text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>
                  138 S. Rosemont RD, STE #216,
                  <br />
                  Virginia Beach, VA 23452
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
