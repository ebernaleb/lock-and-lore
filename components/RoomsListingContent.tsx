import Link from "next/link";
import { Users, Clock, Lock, AlertCircle, ArrowRight } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RoomCardData {
  id: number;
  slug: string;
  title: string;
  image: string;
  description: string;
  players: string;
  duration: number;
  difficulty: string;
  difficultyColor: string;
  depositRequired?: boolean;
  depositAmount?: number;
}

interface RoomsListingContentProps {
  /** Pre-fetched room data from the server */
  rooms: RoomCardData[];
  /** Error message from server-side fetch (null if successful) */
  error?: string | null;
}

// ---------------------------------------------------------------------------
// Room Card
// ---------------------------------------------------------------------------

function RoomCard({ room }: { room: RoomCardData }) {
  return (
    <Link
      href={`/rooms/${room.slug}`}
      scroll={true}
      className="group bg-neutral-900 rounded-3xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:bg-neutral-800 flex flex-col h-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black"
      aria-label={`View details for ${room.title}`}
    >
      {/* Game image */}
      <div className="relative h-64 sm:h-72 overflow-hidden flex-shrink-0">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url('${room.image}')` }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

        {/* Difficulty badge */}
        <div className="absolute top-4 right-4">
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold shadow-md border ${room.difficultyColor}`}
          >
            <Lock className="w-3 h-3" />
            {room.difficulty}
          </span>
        </div>

        {/* Hover CTA overlay */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <span className="inline-flex items-center gap-1.5 bg-white text-gray-900 font-bold text-sm py-2 px-4 rounded-full shadow-lg">
            View Details
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="p-6 text-center flex flex-col flex-grow">
        <h3 className="text-2xl font-bold font-heading text-white mb-3 group-hover:text-primary transition-colors duration-200">
          {room.title}
        </h3>

        <p className="text-gray-400 text-sm line-clamp-3 mb-5 leading-relaxed">
          {room.description}
        </p>

        {/* Game metadata strip */}
        <div className="flex justify-center items-center gap-5 text-gray-400 text-xs py-3 border-t border-b border-neutral-800 mb-5">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-secondary" />
            <span>{room.players}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-secondary" />
            <span>{room.duration} Mins</span>
          </div>
        </div>

        {/* Deposit notice */}
        {room.depositRequired && (
          <p className="text-xs text-gray-500 mb-3">
            {room.depositAmount && room.depositAmount > 0
              ? `$${room.depositAmount.toFixed(0)} deposit required`
              : "Deposit required to book"}
          </p>
        )}

        {/* CTA button */}
        <div className="mt-auto">
          <span className="inline-flex items-center justify-center gap-2 w-full bg-primary group-hover:bg-primary-dark text-neutral-950 font-medium py-3 text-base rounded-full shadow-[0_4px_0_0_rgba(122,92,32,1)] group-hover:shadow-[0_2px_0_0_rgba(122,92,32,1)] group-hover:translate-y-[2px] transition-all duration-150 relative before:absolute before:inset-0 before:rounded-full before:shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.2)] before:pointer-events-none">
            <span className="relative z-10">Check Availability</span>
            <ArrowRight className="w-4 h-4 relative z-10" />
          </span>
        </div>
      </div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function RoomsListingContent({ rooms, error }: RoomsListingContentProps) {
  return (
    <section className="py-16 md:py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Error Banner */}
        {error && (
          <div className="max-w-2xl mx-auto bg-orange-950/50 rounded-xl p-6 mb-10">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-orange-300 font-semibold mb-1">
                  Unable to load live game data
                </p>
                <p className="text-orange-400 text-sm">{error}</p>
                <p className="text-orange-400/80 text-sm mt-2">
                  Showing default rooms below. Please try again later.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Room Cards Grid */}
        {rooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <Lock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-heading font-bold text-white mb-2">
                No Rooms Available
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                We are currently updating our rooms. Please check back soon for
                new adventures.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
