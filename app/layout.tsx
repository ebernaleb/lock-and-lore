import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const dosis = localFont({
  src: "./fonts/dosis-extrabold.ttf",
  variable: "--font-dosis",
  weight: "800",
});

export const metadata: Metadata = {
  title: "Lock & Lore Escape Rooms",
  description: "Book your next adventure!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          inter.variable,
          dosis.variable,
          "antialiased text-foreground font-sans"
        )}
      >
        {children}
      </body>
    </html>
  );
}
