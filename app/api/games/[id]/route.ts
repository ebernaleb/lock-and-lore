import { NextResponse } from 'next/server';
import { fetchGameById } from '@/lib/otc-api-client';
import type { OTCErrorResponse } from '@/types/otc-api';

/**
 * GET /api/games/[id]
 * Fetches a single game by ID from the Off The Couch API.
 *
 * Query Parameters:
 * - include_pricing: boolean (default true)
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const gameId = parseInt(id, 10);

    if (isNaN(gameId) || gameId <= 0) {
      return NextResponse.json(
        { error: 'Invalid game ID', message: 'Game ID must be a positive integer' } as OTCErrorResponse,
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const includePricing = searchParams.get('include_pricing') !== 'false';

    const game = await fetchGameById(gameId, includePricing);

    return NextResponse.json({ game }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error fetching game:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isNotFound = errorMessage.includes('404');
    const isConfigError = errorMessage.includes('not configured');

    return NextResponse.json(
      {
        error: isNotFound ? 'Game not found' : isConfigError ? 'Configuration error' : 'Failed to fetch game',
        message: errorMessage,
      } as OTCErrorResponse,
      { status: isNotFound ? 404 : isConfigError ? 500 : 502 }
    );
  }
}
