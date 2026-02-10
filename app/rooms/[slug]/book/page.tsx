import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchGames, fetchGameById } from '@/lib/otc-api-client';
import { findGameBySlug } from '@/lib/game-utils';
import BookingLayout from '@/components/booking/BookingLayout';
import OTCBookingEmbed from '@/components/booking/OTCBookingEmbed';
import type { OTCGame } from '@/types/otc-api';

interface BookPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Resolve the slug to a full game object with pricing data.
 */
async function getGameBySlug(slug: string): Promise<OTCGame | null> {
  try {
    const { games } = await fetchGames({ limit: 100 });
    const match = findGameBySlug(games, slug);

    if (!match) return null;

    // Fetch detailed info with pricing
    try {
      return await fetchGameById(match.id, true);
    } catch {
      return match;
    }
  } catch (error) {
    console.error('Error resolving game by slug:', error);
    return null;
  }
}

/**
 * SEO metadata -- noindex for booking pages since they are transactional.
 */
export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGameBySlug(slug);

  if (!game) {
    return {
      title: 'Room Not Found | Lock & Lore',
    };
  }

  return {
    title: `Book ${game.name} | Lock & Lore Escape Rooms`,
    description: `Book your escape room adventure at Lock & Lore. Reserve ${game.name} now.`,
    robots: { index: false, follow: false },
  };
}

export default async function BookPage({ params }: BookPageProps) {
  const { slug } = await params;
  const game = await getGameBySlug(slug);

  if (!game) {
    notFound();
  }

  return (
    <BookingLayout>
      <div className="w-full">
        {/* OTC Booking iframe */}
        <OTCBookingEmbed />
      </div>
    </BookingLayout>
  );
}
