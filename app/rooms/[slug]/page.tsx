import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchGames, fetchGameById } from '@/lib/otc-api-client';
import {
  generateSlug,
  findGameBySlug,
  getGameImage,
} from '@/lib/game-utils';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { RoomDetailContent } from '@/components/RoomDetailContent';
import type { OTCGame } from '@/types/otc-api';

interface RoomPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Resolve the slug to a full game object.
 *
 * 1. Fetch all games from the OTC API.
 * 2. Find the game matching the slug.
 * 3. Fetch the detailed game info (with pricing) by ID.
 */
async function getGameBySlug(slug: string): Promise<OTCGame | null> {
  try {
    console.log('[getGameBySlug] Looking for slug:', slug);
    const { games } = await fetchGames({ limit: 100 });
    console.log('[getGameBySlug] Fetched games count:', games.length);
    console.log('[getGameBySlug] Available game names:', games.map(g => ({ name: g.name, slug: generateSlug(g.name), public: g.is_public })));

    const match = findGameBySlug(games, slug);
    console.log('[getGameBySlug] Match found:', match ? match.name : 'NONE');

    if (!match) return null;

    // Fetch detailed info with pricing
    try {
      const detailed = await fetchGameById(match.id, true);
      return detailed;
    } catch {
      // If detail fetch fails, return the list-level data
      return match;
    }
  } catch (error) {
    console.error('Error resolving game by slug:', error);
    return null;
  }
}

/**
 * Generate static params for all known games so pages can be statically generated.
 */
export async function generateStaticParams() {
  try {
    const { games } = await fetchGames({ limit: 100 });
    return games
      .filter(g => g.is_public === 1)
      .map(game => ({
        slug: generateSlug(game.name),
      }));
  } catch {
    return [];
  }
}

/**
 * Generate dynamic metadata for SEO.
 */
export async function generateMetadata({ params }: RoomPageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGameBySlug(slug);

  if (!game) {
    return {
      title: 'Room Not Found | Lock & Lore',
      description: 'The escape room you are looking for could not be found.',
    };
  }

  const description = game.description
    ? game.description.substring(0, 160)
    : `Experience ${game.name} at Lock & Lore Escape Rooms.`;

  return {
    title: `${game.name} | Lock & Lore Escape Rooms`,
    description,
    openGraph: {
      title: `${game.name} | Lock & Lore Escape Rooms`,
      description,
      images: game.image_url ? [{ url: game.image_url }] : undefined,
    },
  };
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { slug } = await params;
  const game = await getGameBySlug(slug);

  if (!game) {
    notFound();
  }

  const imageUrl = getGameImage(game);

  return (
    <main className="min-h-screen font-sans selection:bg-primary selection:text-neutral-950 bg-black">
      <Navbar />
      <RoomDetailContent game={game} imageUrl={imageUrl} />
      <Footer />
    </main>
  );
}
