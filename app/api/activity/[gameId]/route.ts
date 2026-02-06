import { NextResponse } from 'next/server';
import { fetchGameActivity } from '@/lib/otc-api-client';
import type { ActivityResponse, OTCErrorResponse } from '@/types/otc-api';

/**
 * GET /api/activity/[gameId]
 *
 * Returns recent booking activity and simulated social proof data
 * for a specific game. Used to power "X people viewing this room"
 * and "Booked Y times recently" indicators.
 *
 * The viewer count is simulated based on real booking activity from
 * the OTC API. This is clearly marked via the `is_simulated` field
 * in the response so the frontend can handle it appropriately.
 *
 * Caching:
 *   2-minute server-side cache (via lib/cache.ts)
 *   60-second CDN cache with 2-minute stale-while-revalidate
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ gameId: string }> }
) {
  try {
    const { gameId: rawGameId } = await params;
    const gameId = parseInt(rawGameId, 10);

    if (isNaN(gameId) || gameId <= 0) {
      const body: OTCErrorResponse = {
        error: 'Invalid game ID',
        message: 'Game ID must be a positive integer.',
        status: 400,
      };
      return NextResponse.json(body, { status: 400 });
    }

    // Fetch activity data (uses cache internally)
    const activity = await fetchGameActivity(gameId);

    const response: ActivityResponse = {
      activity,
      fetched_at: new Date().toISOString(),
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error occurred';

    let status = 502;
    let clientError = 'Failed to fetch activity data';

    if (message.includes('not configured')) {
      status = 500;
      clientError = 'Server configuration error';
    } else if (message.includes('timed out')) {
      status = 504;
      clientError = 'Provider did not respond in time';
    }

    console.error(`[/api/activity] ${status} - ${message}`);

    const body: OTCErrorResponse = {
      error: clientError,
      status,
    };

    return NextResponse.json(body, { status });
  }
}
