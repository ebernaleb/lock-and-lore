/**
 * @deprecated Debug endpoint. Must be removed before production deployment.
 * Was used during development of the custom booking flow which has been replaced
 * by the OTC iframe embed (OTCBookingEmbed.tsx).
 *
 * DEBUG ENDPOINT - Diagnose booking visibility in OTC Console
 *
 * This endpoint performs a comprehensive diagnostic by:
 * 1. Fetching ALL bookings for today to see what OTC returns
 * 2. Fetching ALL waivers to check for unexpected waiver creation
 * 3. Optionally creating a test booking and fetching it back
 *
 * GET  /api/debug-booking              - Show today's bookings + recent waivers
 * GET  /api/debug-booking?id=29384907  - Fetch a specific booking by ID
 * POST /api/debug-booking              - Create a test booking and fetch it back
 *
 * THIS ENDPOINT IS FOR DEBUGGING ONLY. Remove before production deployment.
 */

import { NextResponse } from 'next/server';
import { otcFetch } from '@/lib/otc-api-client';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const bookingId = url.searchParams.get('id');
  const date = url.searchParams.get('date') || new Date().toISOString().split('T')[0];

  try {
    const results: Record<string, unknown> = {
      timestamp: new Date().toISOString(),
      query: { bookingId, date },
    };

    // If a specific booking ID is provided, fetch it directly
    if (bookingId) {
      console.log(`[DEBUG] Fetching booking #${bookingId}...`);
      try {
        const booking = await otcFetch<unknown>(
          `/bookings/${bookingId}?include_notes=true&include_tickets=true`
        );
        results.specific_booking = booking;
        console.log(`[DEBUG] Booking #${bookingId} response:`, JSON.stringify(booking, null, 2));
      } catch (err) {
        results.specific_booking_error = err instanceof Error ? err.message : String(err);
      }
    }

    // Fetch ALL bookings for the date (no filtering by game)
    console.log(`[DEBUG] Fetching ALL bookings for ${date}...`);
    const allBookings = await otcFetch<unknown>(
      `/bookings?start_date=${date}&end_date=${date}&limit=100&sort_by=start_time&sort_order=asc`
    );
    results.all_bookings_for_date = allBookings;

    // Fetch recent waivers (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];
    console.log(`[DEBUG] Fetching waivers from ${weekAgoStr} to ${date}...`);
    try {
      const waivers = await otcFetch<unknown>(
        `/waivers?start_date=${weekAgoStr}&end_date=${date}&limit=50&sort_by=id&sort_order=desc`
      );
      results.recent_waivers = waivers;
    } catch (err) {
      results.waivers_error = err instanceof Error ? err.message : String(err);
    }

    // Fetch recent transactions
    console.log(`[DEBUG] Fetching transactions from ${weekAgoStr} to ${date}...`);
    try {
      const transactions = await otcFetch<unknown>(
        `/transactions?start_date=${weekAgoStr}&end_date=${date}&limit=50&sort_by=id&sort_order=desc`
      );
      results.recent_transactions = transactions;
    } catch (err) {
      results.transactions_error = err instanceof Error ? err.message : String(err);
    }

    return NextResponse.json(results, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Debug endpoint failed',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Create a booking via POST /bookings with FULL logging
    const bookingPayload = {
      game_id: body.game_id || 2893,
      company_group_id: body.company_group_id || 649,
      booking_date: body.booking_date || new Date().toISOString().split('T')[0],
      start_time: body.start_time || '22:00:00',
      end_time: body.end_time || '23:30:00',
      group_size: body.group_size || 2,
      slot_text: body.slot_text || 'DEBUG TEST | debug@test.com | 2 players',
    };

    console.log(`[DEBUG] Creating booking with payload:`, JSON.stringify(bookingPayload, null, 2));

    // Make the raw POST request and capture EVERYTHING
    const createResponse = await otcFetch<unknown>('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingPayload),
    });

    console.log(`[DEBUG] POST /bookings FULL response:`, JSON.stringify(createResponse, null, 2));

    // Now fetch that booking back to see how OTC stored it
    const bookingData = createResponse as Record<string, unknown>;
    const createdId = (bookingData as any)?.id || (bookingData as any)?.booking?.id;

    let fetchedBack = null;
    if (createdId) {
      console.log(`[DEBUG] Fetching back booking #${createdId}...`);
      try {
        fetchedBack = await otcFetch<unknown>(
          `/bookings/${createdId}?include_notes=true&include_tickets=true`
        );
        console.log(`[DEBUG] GET /bookings/${createdId} FULL response:`, JSON.stringify(fetchedBack, null, 2));
      } catch (err) {
        fetchedBack = { error: err instanceof Error ? err.message : String(err) };
      }
    }

    // Check if any waivers were auto-created
    console.log(`[DEBUG] Checking for auto-created waivers...`);
    const today = new Date().toISOString().split('T')[0];
    let waiverCheck = null;
    try {
      waiverCheck = await otcFetch<unknown>(
        `/waivers?start_date=${today}&end_date=${today}&limit=50&sort_by=id&sort_order=desc`
      );
    } catch (err) {
      waiverCheck = { error: err instanceof Error ? err.message : String(err) };
    }

    return NextResponse.json({
      action: 'create_and_verify',
      request_payload: bookingPayload,
      create_response: createResponse,
      created_booking_id: createdId,
      fetched_back: fetchedBack,
      waivers_after_creation: waiverCheck,
      timestamp: new Date().toISOString(),
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Debug create failed',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
