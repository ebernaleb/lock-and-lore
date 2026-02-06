import { Metadata } from 'next';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { RoomsListingContent } from '@/components/RoomsListingContent';
import type { RoomCardData } from '@/components/RoomsListingContent';
import { fetchGamesCached } from '@/lib/otc-api-client';
import {
  generateSlug,
  getDifficultyLabel,
  getDifficultyColor,
  getGameImage,
  formatPlayerCount,
  stripHtml,
} from '@/lib/game-utils';
import type { OTCGame } from '@/types/otc-api';

export const metadata: Metadata = {
  title: 'Our Escape Rooms | Lock & Lore',
  description:
    'Browse all escape rooms at Lock & Lore. Private experiences for families, friends, and teams. Find your next adventure.',
};

/**
 * Map an OTCGame into the card props shape used by RoomsListingContent.
 * Centralizes all formatting logic so the component stays presentational.
 */
function mapGameToCard(game: OTCGame) {
  return {
    id: game.id,
    slug: generateSlug(game.name),
    title: game.name,
    image: getGameImage(game),
    description: stripHtml(game.description) || 'An exciting escape room experience awaits.',
    players: formatPlayerCount(game),
    duration: game.duration ?? 60,
    difficulty: getDifficultyLabel(game.difficulty),
    difficultyColor: getDifficultyColor(game.difficulty),
    depositRequired: game.deposit_required === 1,
    depositAmount: game.deposit_amount,
  };
}

/** Static fallback rooms shown when the OTC API is unreachable. */
const FALLBACK_ROOMS = [
  {
    id: -1,
    slug: 'skybound-dynasty',
    title: 'Skybound Dynasty',
    image: '/images/floatingcity_room.png',
    description:
      'High above the world, a city floats amongst the clouds. Valkeria. A kingdom of marble towers and starlight. Seven constellations shine above it, steady and bright. A coronation approaches, and you have been invited to witness history.',
    players: '2-10 Players',
    duration: 60,
    difficulty: 'Moderate',
    difficultyColor: 'text-amber-600 bg-amber-50 border-amber-200',
    depositRequired: false,
    depositAmount: undefined,
  },
  {
    id: -2,
    slug: 'escape-the-simulation',
    title: 'Escape the Simulation',
    image: '/images/simulation_room.png',
    description:
      'You sit at your desk. Same chair. Same screen. Same office. Another typical Tuesday. Everything feels real, until it doesn\'t. This office isn\'t a workplace, it\'s a simulation, and you\'ve become self-aware.',
    players: '2-6 Players',
    duration: 60,
    difficulty: 'Moderate',
    difficultyColor: 'text-amber-600 bg-amber-50 border-amber-200',
    depositRequired: false,
    depositAmount: undefined,
  },
  {
    id: -3,
    slug: 'echo-chamber',
    title: 'Echo Chamber',
    image: '/images/art_room.png',
    description:
      'As you explore the studio Mara left behind, you uncover two versions of her story, and the truth hidden behind the illusions she created. Only by separating reality from the lies she told herself can you discover what really happened.',
    players: '2-8 Players',
    duration: 60,
    difficulty: 'Moderate',
    difficultyColor: 'text-amber-600 bg-amber-50 border-amber-200',
    depositRequired: false,
    depositAmount: undefined,
  },
];

export default async function RoomsPage() {
  let rooms: RoomCardData[] = FALLBACK_ROOMS;
  let fetchError: string | null = null;

  try {
    const data = await fetchGamesCached({ limit: 100 });

    // Filter to only public games
    const publicGames = data.games.filter((game) => game.is_public === 1);

    if (publicGames.length > 0) {
      rooms = publicGames.map(mapGameToCard);
    }
  } catch (error) {
    console.error('[RoomsPage] Failed to fetch games:', error);
    fetchError =
      error instanceof Error
        ? error.message
        : 'Unable to load live game data. Showing default rooms.';
  }

  return (
    <main className="min-h-screen font-sans selection:bg-primary selection:text-neutral-950 bg-black">
      <Navbar />

      {/* Page Header */}
      <section className="pt-28 pb-16 bg-black relative overflow-hidden">
        {/* Subtle background texture */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(197,151,62,0.08)_0%,_transparent_70%)]" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-white mb-5">
            Our Escape <span className="text-primary">Rooms</span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-400 text-lg leading-relaxed">
            All games are private experiences. You will not be merged with other groups.
            Pick your theme and start the fun.
          </p>
        </div>
      </section>

      <RoomsListingContent rooms={rooms} error={fetchError} />

      <Footer />
    </main>
  );
}
