import { NextResponse } from 'next/server';
import {
  createBooking,
  createTransaction,
  updateBooking,
  createWaiver,
  fetchGameWithPricingCached,
} from '@/lib/otc-api-client';
import { cache, availabilityCacheKey } from '@/lib/cache';
import type { OTCErrorResponse } from '@/types/otc-api';

/**
 * POST /api/book
 *
 * Booking endpoint that confirms a customer reservation in the OTC system.
 * Supports the 3-step booking flow:
 *   1. Select time (handled client-side with /api/availability)
 *   2. Enter details (captured in request body)
 *   3. Confirm (this endpoint)
 *
 * BOOKING STRATEGY (with fallback chain):
 *
 *   Strategy A -- POST /transactions (preferred, OTC-canonical):
 *     Creates a transaction linking the booking slot to the customer.
 *     This is the documented customer-facing flow.
 *
 *   Strategy B -- PUT /bookings + POST /waivers (fallback):
 *     When POST /transactions returns 500 (known OTC server-side issue as of
 *     2026-02-06), we fall back to:
 *       1. PUT /bookings/{id} to set group_size + status="confirmed"
 *       2. POST /waivers to register the customer in OTC
 *     This ensures the booking is visible in the OTC console as confirmed
 *     and the customer record exists in the system.
 *
 *   Strategy C -- POST /bookings + POST /waivers (last resort):
 *     When no booking_slot_id is provided, we create a new booking slot
 *     and then register the customer via waiver.
 *
 * Request Body:
 *   game_id             (number, required) - Game to book
 *   booking_date        (string, required) - Date in YYYY-MM-DD format
 *   start_time          (string, required) - Start time in HH:MM format
 *   end_time            (string, required) - End time in HH:MM format
 *   group_size          (number, required) - Number of players
 *   customer_email      (string, required) - Customer email
 *   customer_first_name (string, required) - Customer first name
 *   customer_last_name  (string, required) - Customer last name
 *   customer_phone      (string, optional) - Customer phone number
 *   booking_slot_id     (number, optional) - Existing OTC booking slot ID
 *
 * Response:
 *   201 on success with booking details and confirmation number
 *   400 for validation errors
 *   502 for upstream failures
 */
export async function POST(request: Request) {
  try {
    // -----------------------------------------------------------------------
    // 1. Parse and validate request body
    // -----------------------------------------------------------------------
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      const errorBody: OTCErrorResponse = {
        error: 'Invalid request body',
        message: 'Request body must be valid JSON.',
        status: 400,
      };
      return NextResponse.json(errorBody, { status: 400 });
    }

    // Validate required fields
    const requiredFields = [
      'game_id',
      'booking_date',
      'start_time',
      'end_time',
      'group_size',
      'customer_email',
      'customer_first_name',
      'customer_last_name',
    ] as const;

    const missing = requiredFields.filter((f) => !body[f]);
    if (missing.length > 0) {
      const errorBody: OTCErrorResponse = {
        error: 'Missing required fields',
        message: `The following fields are required: ${missing.join(', ')}`,
        status: 400,
      };
      return NextResponse.json(errorBody, { status: 400 });
    }

    const gameId = Number(body.game_id);
    const bookingDate = String(body.booking_date);
    const startTime = String(body.start_time);
    const endTime = String(body.end_time);
    const groupSize = Number(body.group_size);
    const customerEmail = String(body.customer_email).trim().toLowerCase();
    const customerFirstName = String(body.customer_first_name).trim();
    const customerLastName = String(body.customer_last_name).trim();
    const customerPhone = body.customer_phone
      ? String(body.customer_phone).trim()
      : undefined;
    const bookingSlotId = body.booking_slot_id
      ? Number(body.booking_slot_id)
      : undefined;

    // Validate game_id
    if (isNaN(gameId) || gameId <= 0) {
      return NextResponse.json(
        { error: 'Invalid game ID', message: 'game_id must be a positive integer.', status: 400 } as OTCErrorResponse,
        { status: 400 }
      );
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(bookingDate)) {
      return NextResponse.json(
        { error: 'Invalid date format', message: 'booking_date must be in YYYY-MM-DD format.', status: 400 } as OTCErrorResponse,
        { status: 400 }
      );
    }

    // Validate date is not in the past
    const requestedDate = new Date(bookingDate + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (requestedDate < today) {
      return NextResponse.json(
        { error: 'Invalid date', message: 'Cannot book for past dates.', status: 400 } as OTCErrorResponse,
        { status: 400 }
      );
    }

    // Validate time format (HH:MM or HH:MM:SS)
    const timeRegex = /^\d{2}:\d{2}(:\d{2})?$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return NextResponse.json(
        { error: 'Invalid time format', message: 'start_time and end_time must be in HH:MM or HH:MM:SS format.', status: 400 } as OTCErrorResponse,
        { status: 400 }
      );
    }

    // Validate group_size
    if (isNaN(groupSize) || groupSize < 1 || groupSize > 50) {
      return NextResponse.json(
        { error: 'Invalid group size', message: 'group_size must be between 1 and 50.', status: 400 } as OTCErrorResponse,
        { status: 400 }
      );
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      return NextResponse.json(
        { error: 'Invalid email', message: 'Please provide a valid email address.', status: 400 } as OTCErrorResponse,
        { status: 400 }
      );
    }

    // Validate booking_slot_id if provided
    if (bookingSlotId !== undefined && (isNaN(bookingSlotId) || bookingSlotId <= 0)) {
      return NextResponse.json(
        { error: 'Invalid booking slot ID', message: 'booking_slot_id must be a positive integer.', status: 400 } as OTCErrorResponse,
        { status: 400 }
      );
    }

    // -----------------------------------------------------------------------
    // 2. Fetch game data and validate constraints
    // -----------------------------------------------------------------------
    const game = await fetchGameWithPricingCached(gameId);

    const minPlayers = game.min_players ?? game.min_players_count ?? 1;
    const maxPlayers = game.max_players ?? game.max_players_count ?? 50;

    if (groupSize < minPlayers) {
      return NextResponse.json(
        { error: 'Group too small', message: `This room requires at least ${minPlayers} players.`, status: 400 } as OTCErrorResponse,
        { status: 400 }
      );
    }

    if (groupSize > maxPlayers) {
      return NextResponse.json(
        { error: 'Group too large', message: `This room allows a maximum of ${maxPlayers} players.`, status: 400 } as OTCErrorResponse,
        { status: 400 }
      );
    }

    const companyGroupId = game.company_group?.id;
    if (!companyGroupId) {
      return NextResponse.json(
        { error: 'Configuration error', message: 'Game does not have an associated location.', status: 500 } as OTCErrorResponse,
        { status: 500 }
      );
    }

    // Normalize time to HH:MM:SS for OTC API
    const normalizeTime = (t: string): string =>
      t.length === 5 ? `${t}:00` : t;

    // -----------------------------------------------------------------------
    // 3. Determine/create booking slot
    // -----------------------------------------------------------------------
    let slotId: number;

    if (bookingSlotId) {
      slotId = bookingSlotId;
      console.log(
        `[/api/book] Using existing OTC booking slot #${slotId} for game ${gameId} on ${bookingDate}`
      );
    } else {
      // No slot ID provided -- create a new booking slot
      console.warn(
        `[/api/book] No booking_slot_id -- creating new slot via POST /bookings`
      );
      const newBooking = await createBooking({
        game_id: gameId,
        company_group_id: companyGroupId,
        booking_date: bookingDate,
        start_time: normalizeTime(startTime),
        end_time: normalizeTime(endTime),
        group_size: groupSize,
      });
      slotId = newBooking.id;
      console.log(`[/api/book] Created new booking slot #${slotId}`);
    }

    // -----------------------------------------------------------------------
    // 4. Attempt booking via transaction (Strategy A)
    //    If it fails, fall back to PUT /bookings + POST /waivers (Strategy B)
    // -----------------------------------------------------------------------

    // Build customer data for both strategies
    const customerData: {
      email: string;
      first_name: string;
      last_name: string;
      phone?: string;
    } = {
      email: customerEmail,
      first_name: customerFirstName,
      last_name: customerLastName,
    };
    if (customerPhone) {
      customerData.phone = customerPhone;
    }

    let transaction = null;
    let transactionError: string | null = null;
    let usedFallback = false;

    // --- Strategy A: POST /transactions ---
    try {
      const transactionParams = {
        company_group_id: companyGroupId,
        customer: customerData,
        bookings: [slotId],
      };

      console.log(
        `[/api/book] Strategy A: Creating transaction for slot #${slotId}...`
      );

      transaction = await createTransaction(transactionParams);

      console.log(
        `[/api/book] Transaction created successfully: ` +
          `id=${transaction.id}, order_number=${transaction.order_number}`
      );
    } catch (txError) {
      transactionError =
        txError instanceof Error ? txError.message : 'Unknown transaction error';
      console.warn(
        `[/api/book] Strategy A failed (POST /transactions): ${transactionError}`
      );
      console.log(
        `[/api/book] Falling back to Strategy B (PUT /bookings + POST /waivers)...`
      );
    }

    // --- Strategy B: PUT /bookings + POST /waivers ---
    if (!transaction) {
      usedFallback = true;

      try {
        // Step B1: Update the booking slot to "confirmed" with group size
        console.log(
          `[/api/book] Strategy B Step 1: Confirming booking slot #${slotId}...`
        );
        const updatedBooking = await updateBooking(slotId, {
          group_size: groupSize,
          status: 'confirmed',
        });
        console.log(
          `[/api/book] Booking slot #${slotId} updated: status=${updatedBooking.status}, group_size=${updatedBooking.group_size}`
        );

        // Step B2: Create a waiver to register the customer in OTC
        console.log(
          `[/api/book] Strategy B Step 2: Creating waiver for customer ${customerEmail}...`
        );
        const waiver = await createWaiver({
          game_id: gameId,
          booking_slot_id: slotId,
          customer: {
            email: customerEmail,
            first_name: customerFirstName,
            last_name: customerLastName,
            phone: customerPhone,
          },
        });
        console.log(
          `[/api/book] Waiver created: id=${waiver.id}, user_id=${waiver.user_id}, ` +
            `customer_email=${waiver.customer_email}`
        );
      } catch (fallbackError) {
        // If even the fallback fails, that is a real error
        const fallbackMessage =
          fallbackError instanceof Error
            ? fallbackError.message
            : 'Unknown fallback error';
        console.error(
          `[/api/book] Strategy B also failed: ${fallbackMessage}`
        );
        return NextResponse.json(
          {
            error: 'Failed to create booking',
            message:
              'We were unable to confirm your booking. Please try again or contact us directly.',
            status: 502,
          } as OTCErrorResponse,
          { status: 502 }
        );
      }
    }

    // -----------------------------------------------------------------------
    // 5. Invalidate availability cache
    // -----------------------------------------------------------------------
    cache.invalidate(availabilityCacheKey(gameId, bookingDate));

    // -----------------------------------------------------------------------
    // 6. Build and return response
    // -----------------------------------------------------------------------

    // Generate a confirmation number:
    //   - From transaction order_number if available (Strategy A)
    //   - From booking slot ID formatted as a reference (Strategy B)
    const confirmationNumber = transaction?.order_number
      ?? `LL-${slotId}`;

    const responseBody = {
      booking: {
        id: slotId,
        booking_date: bookingDate,
        start_time: startTime,
        end_time: endTime,
        group_size: groupSize,
        status: 'confirmed',
        game_id: gameId,
        game_name: game.name,
      },
      transaction: transaction
        ? {
            id: transaction.id,
            order_number: transaction.order_number,
            total: transaction.total,
            due: transaction.due,
            status: transaction.status,
          }
        : null,
      confirmation_number: confirmationNumber,
      message: 'Booking confirmed successfully!',
      // Include note about fallback for transparency/debugging
      ...(usedFallback && {
        note: 'Booking confirmed via direct slot reservation. Payment will be collected at arrival.',
      }),
    };

    console.log(
      `[/api/book] SUCCESS - confirmation: ${confirmationNumber}, ` +
        `slot: #${slotId}, strategy: ${usedFallback ? 'B (fallback)' : 'A (transaction)'}`
    );

    return NextResponse.json(responseBody, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error occurred';

    let status = 502;
    let clientError = 'Failed to create booking';

    if (message.includes('not configured')) {
      status = 500;
      clientError = 'Server configuration error';
    } else if (message.includes('404')) {
      status = 404;
      clientError = 'Game not found';
    } else if (message.includes('timed out')) {
      status = 504;
      clientError = 'Provider did not respond in time';
    } else if (message.includes('400')) {
      status = 400;
      clientError = 'Invalid booking parameters';
    }

    console.error(`[/api/book] ${status} - ${message}`);

    const responseBody: OTCErrorResponse = {
      error: clientError,
      message,
      status,
    };

    return NextResponse.json(responseBody, { status });
  }
}
