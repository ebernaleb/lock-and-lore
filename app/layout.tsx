import type { Metadata } from 'next';
import { Inter, Cinzel } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel' });

export const metadata: Metadata = {
  title: 'Lock and Lore | Immersive Private Escape Rooms in Virginia Beach',
  description: 'Book your private escape room adventure in Virginia Beach. 60 minutes. Multiple ominous themes. Dates, friends, and corporate team building.',
  keywords: ['escape room', 'virginia beach', 'scary escape room', 'team building', 'puzzle room', 'lock and lore'],
  openGraph: {
    title: 'Lock and Lore | Can You Escape?',
    description: 'Immersive private escape rooms in Virginia Beach. Choose your theme and book now.',
    url: 'https://lockandlore.com', // Placeholder
    siteName: 'Lock and Lore',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#0a0a0a',
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${cinzel.variable} font-sans bg-[rgb(var(--background))] text-[rgb(var(--foreground))] min-h-screen selection:bg-[rgb(var(--primary))] selection:text-white`}>

        {children}
      </body>
    </html>
  );
}
