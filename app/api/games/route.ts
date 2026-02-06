import { NextResponse } from 'next/server';
import { fetchGames } from '@/lib/otc-api-client';
import type { FetchGamesParams } from '@/lib/otc-api-client';
import type { OTCErrorResponse } from '@/types/otc-api';

/**
 * GET /api/games
 *
 * Public-facing proxy that fetches games from the Off The Couch API while
 * keeping the OTC_KEY server-side. Supports query parameters that are
 * forwarded to the upstream OTC /games endpoint.
 *
 * Query Parameters (all optional):
 *   limit           - integer, 1-100, default 100 (fetch all games)
 *   offset          - integer, pagination offset
 *   company_group_id - integer, filter by location
 *   archived        - "true" or "false", default "false"
 *   sort_by         - "name" | "position" | "id", default "position"
 *   sort_order      - "asc" | "desc", default "asc"
 *
 * Caching:
 *   5-minute CDN cache with 10-minute stale-while-revalidate window.
 *   This prevents excessive calls to the OTC API while keeping data fresh
 *   enough that console changes appear within minutes.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // ---- Parse and validate query parameters ----

    const params: FetchGamesParams = {};

    // limit: clamp to 1-100 range, default 100 to fetch all games
    const rawLimit = searchParams.get('limit');
    if (rawLimit !== null) {
      const parsed = parseInt(rawLimit, 10);
      if (!Number.isNaN(parsed)) {
        params.limit = Math.max(1, Math.min(100, parsed));
      }
    } else {
      params.limit = 100;
    }

    // offset: must be non-negative integer
    const rawOffset = searchParams.get('offset');
    if (rawOffset !== null) {
      const parsed = parseInt(rawOffset, 10);
      if (!Number.isNaN(parsed) && parsed >= 0) {
        params.offset = parsed;
      }
    }

    // company_group_id: must be positive integer
    const rawGroupId = searchParams.get('company_group_id');
    if (rawGroupId !== null) {
      const parsed = parseInt(rawGroupId, 10);
      if (!Number.isNaN(parsed) && parsed > 0) {
        params.company_group_id = parsed;
      }
    }

    // archived: default to false so only active games are shown
    const rawArchived = searchParams.get('archived');
    params.archived = rawArchived === 'true';

    // sort_by: only allow documented values
    const rawSortBy = searchParams.get('sort_by');
    if (rawSortBy === 'name' || rawSortBy === 'position' || rawSortBy === 'id') {
      params.sort_by = rawSortBy;
    }

    // sort_order: only allow documented values
    const rawSortOrder = searchParams.get('sort_order');
    if (rawSortOrder === 'asc' || rawSortOrder === 'desc') {
      params.sort_order = rawSortOrder;
    }

    // ---- Fetch from OTC API ----

    const data = await fetchGames(params);

    return NextResponse.json(data, {
      headers: {
        // 5-minute CDN cache, serve stale for up to 10 minutes while revalidating
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error occurred';

    // Classify the error for an appropriate HTTP status code
    let status = 502; // default: upstream failure
    let clientError = 'Failed to fetch games from provider';

    if (message.includes('not configured')) {
      status = 500;
      clientError = 'Server configuration error';
    } else if (message.includes('401')) {
      status = 502;
      clientError = 'Authentication with game provider failed';
    } else if (message.includes('timed out')) {
      status = 504;
      clientError = 'Game provider did not respond in time';
    }

    // Log the full error server-side for debugging; never leak it to client
    console.error(`[/api/games] ${status} - ${message}`);

    const body: OTCErrorResponse = {
      error: clientError,
      status,
    };

    return NextResponse.json(body, { status });
  }
}
