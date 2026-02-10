import { NextResponse } from 'next/server';
import {
  fetchAvailability,
  generateUrgencyMessage,
} from '@/lib/otc-api-client';
import type { AvailabilityResponse, OTCErrorResponse } from '@/types/otc-api';

/**
 * @deprecated This endpoint is superseded by the OTC iframe embed (OTCBookingEmbed.tsx).
 * The iframe fetches availability directly from OTC's hosted booking page.
 * This route is retained for reference but is no longer called by any frontend code.
 * Safe to remove once iframe integration is confirmed stable in production.
 *
 * GET /api/availability/[gameId]
 *
 * Returns real-time timeslot availability for a specific game on a given date.
 * Availability is derived by comparing generated timeslots against existing
 * bookings fetched from the OTC API.
 *
 * Query Parameters:
 *   date (required) - Date in YYYY-MM-DD format
 *
 * Response includes:
 *   - List of timeslots with availability status and pricing
 *   - Total and available slot counts
 *   - Urgency messaging for conversion optimization
 *
 * Caching:
 *   60-second server-side cache (via lib/cache.ts)
 *   30-second CDN cache with 60-second stale-while-revalidate
 */
export async function GET(
  request: Request,
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

    // Parse and validate the date parameter
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      const body: OTCErrorResponse = {
        error: 'Missing date parameter',
        message: 'A date query parameter in YYYY-MM-DD format is required.',
        status: 400,
      };
      return NextResponse.json(body, { status: 400 });
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      const body: OTCErrorResponse = {
        error: 'Invalid date format',
        message: 'Date must be in YYYY-MM-DD format.',
        status: 400,
      };
      return NextResponse.json(body, { status: 400 });
    }

    // Validate the date is not in the past
    const requestedDate = new Date(date + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (requestedDate < today) {
      const body: OTCErrorResponse = {
        error: 'Invalid date',
        message: 'Cannot check availability for past dates.',
        status: 400,
      };
      return NextResponse.json(body, { status: 400 });
    }

    // Validate the date is not too far in the future (90 days max)
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 90);
    if (requestedDate > maxDate) {
      const body: OTCErrorResponse = {
        error: 'Date too far in future',
        message: 'Availability is only available up to 90 days in advance.',
        status: 400,
      };
      return NextResponse.json(body, { status: 400 });
    }

    // Fetch availability (uses cache internally)
    const availability = await fetchAvailability(gameId, date);
    const urgencyMessage = generateUrgencyMessage(availability);

    const response: AvailabilityResponse = {
      availability,
      urgency_message: urgencyMessage ?? undefined,
      fetched_at: new Date().toISOString(),
    };

    return NextResponse.json(response, {
      headers: {
        // Short CDN cache since availability changes frequently
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error occurred';

    let status = 502;
    let clientError = 'Failed to fetch availability';

    if (message.includes('not configured')) {
      status = 500;
      clientError = 'Server configuration error';
    } else if (message.includes('404')) {
      status = 404;
      clientError = 'Game not found';
    } else if (message.includes('timed out')) {
      status = 504;
      clientError = 'Provider did not respond in time';
    }

    console.error(`[/api/availability] ${status} - ${message}`);

    const body: OTCErrorResponse = {
      error: clientError,
      status,
    };

    return NextResponse.json(body, { status });
  }
}
