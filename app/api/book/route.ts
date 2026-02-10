import { NextResponse } from 'next/server';
import {
  createBooking,
  createTransaction,
  updateBooking,
  fetchGameWithPricingCached,
} from '@/lib/otc-api-client';
import { cache, availabilityCacheKey } from '@/lib/cache';
import type { OTCErrorResponse } from '@/types/otc-api';

/**
 * @deprecated This endpoint is superseded by the OTC iframe embed (OTCBookingEmbed.tsx).
 * The iframe at https://offthecouch.io/book/lockandlore handles the entire booking flow
 * including availability selection, customer details, payment, and confirmation.
 * This route is retained for reference but is no longer called by any frontend code.
 * Safe to remove once iframe integration is confirmed stable in production.
 *
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
 *     Creates a transaction linking the schedule-generated booking slot to the
 *     customer. This is the documented customer-facing flow. When it works, OTC
 *     automatically updates the slot status, links customer data, and creates
 *     financial records.
 *
 *     ROOT CAUSE OF 500 (diagnosed 2026-02-07):
 *       POST /transactions crashes because NO pricing categories are configured
 *       in the OTC Console for any game. The same bug causes
 *       GET /games/{id}?include_pricing=true to return "Database error occurred".
 *       FIX: Configure pricing categories in OTC Console (Games > Settings > Pricing).
 *       Once pricing categories exist, POST /transactions should work and this
 *       fallback to Strategy B will no longer be needed.
 *
 *   Strategy B -- POST /bookings (new slot with slot_text) (fallback):
 *     When POST /transactions returns 500 (due to missing pricing categories
 *     in OTC Console), we fall back to creating a NEW booking entry via POST /bookings.
 *
 *     WHY create a new booking instead of PUT to the schedule slot:
 *       - PUT /bookings does NOT accept "status" (silently ignored)
 *       - PUT /bookings does NOT accept "description" (silently ignored)
 *       - PUT /bookings does NOT accept customer fields (silently ignored)
 *       - The schedule slot stays status="available" no matter what we PUT
 *       - POST /bookings creates a slot with status="1" (active/booked)
 *       - The OTC Console shows status="1" bookings differently from "available"
 *
 *     The new booking is created at the SAME time as the schedule slot. The
 *     availability logic detects the duplicate and marks the time as booked.
 *     Customer info is embedded in the booking's `slot_text` field so staff
 *     can see who booked directly in the OTC Console.
 *
 *     NOTE: OTC uses `slot_text` (NOT `description`) for booking display text.
 *     The `description` field documented in the API docs is silently ignored
 *     on both POST and PUT (confirmed via testing 2026-02-06).
 *
 *     WAIVER NOTE: We intentionally do NOT call POST /waivers here. The
 *     POST /waivers endpoint creates a COMPLETED/SIGNED waiver record, which
 *     makes OTC Console show "Waiver signed" even though the customer never
 *     actually signed anything. Any "Waiver signed" entries visible in the
 *     OTC Console are from earlier testing and should be deleted manually.
 *     Waivers should be handled through OTC's built-in waiver email
 *     automation (triggered when POST /transactions works) or managed
 *     manually by staff through the OTC Console.
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
 *   booking_slot_id     (number, optional) - Existing OTC schedule slot ID
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
    // 3. Build customer data (shared by all strategies)
    // -----------------------------------------------------------------------
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
    let slotId: number;

    // -----------------------------------------------------------------------
    // 4. Strategy A: POST /transactions (preferred, OTC-canonical)
    //
    //    Uses the schedule-generated booking slot ID. When this works, OTC
    //    automatically links customer data, changes the slot status, and
    //    creates financial records.
    // -----------------------------------------------------------------------
    if (bookingSlotId) {
      slotId = bookingSlotId;
      console.log(
        `[/api/book] Using schedule slot #${slotId} for game ${gameId} on ${bookingDate}`
      );

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
      }
    } else {
      slotId = 0; // Will be set by Strategy B
      console.log(
        `[/api/book] No booking_slot_id provided, skipping Strategy A.`
      );
    }

    // -----------------------------------------------------------------------
    // 5. Strategy B: POST /bookings (new slot with slot_text) (fallback)
    //
    //    When POST /transactions fails (known OTC 500 bug) or no slot ID is
    //    available, create a BRAND NEW booking entry via POST /bookings.
    //
    //    KEY INSIGHT: POST /bookings creates a slot with status="1" (active),
    //    while schedule-generated slots have status="available". The OTC Console
    //    displays status="1" bookings as occupied/booked entries, not as open
    //    slots. This is the critical difference from the old approach of using
    //    PUT to modify the schedule slot (which could never change the status).
    //
    //    Customer info is embedded in the booking `slot_text` field so
    //    staff can identify who booked when viewing it in the OTC Console.
    //    NOTE: OTC uses `slot_text` (NOT `description`) for this purpose.
    //    The `description` field is silently ignored on POST/PUT.
    //
    //    WAIVER: We do NOT call POST /waivers here. That endpoint creates a
    //    COMPLETED waiver record (as if the customer already signed), which
    //    causes OTC Console to show "Waiver signed" prematurely. Waivers
    //    should be sent to the customer via OTC's automated email system
    //    (which triggers when POST /transactions works) or managed manually
    //    by staff through the OTC Console's waiver-send feature.
    // -----------------------------------------------------------------------
    if (!transaction) {
      usedFallback = true;
      console.log(
        `[/api/book] Falling back to Strategy B (POST /bookings with slot_text)...`
      );

      try {
        // Build slot_text that embeds customer contact info so staff
        // can see who booked directly in the OTC Console schedule view.
        //
        // IMPORTANT: The OTC API uses `slot_text` for booking display text,
        // NOT `description`. The `description` field is silently ignored on
        // POST /bookings (confirmed via testing 2026-02-06).
        //
        // Format: "Name | email | phone | group_size players"
        const slotTextParts = [
          `${customerFirstName} ${customerLastName}`,
          customerEmail,
        ];
        if (customerPhone) {
          slotTextParts.push(customerPhone);
        }
        slotTextParts.push(`${groupSize} players`);
        const slotText = slotTextParts.join(' | ');

        // Build the exact payload for logging transparency
        const bookingPayload = {
          game_id: gameId,
          company_group_id: companyGroupId,
          booking_date: bookingDate,
          start_time: normalizeTime(startTime),
          end_time: normalizeTime(endTime),
          group_size: groupSize,
          slot_text: slotText,
        };

        // Create a NEW booking entry at the same time slot.
        // POST /bookings returns status="1" (active) -- unlike schedule slots
        // which have status="available". This makes the booking appear as
        // occupied in the OTC Console schedule view.
        console.log(
          `[/api/book] Strategy B: POST /bookings payload:`,
          JSON.stringify(bookingPayload)
        );

        const newBooking = await createBooking(bookingPayload);

        slotId = newBooking.id;

        console.log(
          `[/api/book] POST /bookings response:`,
          JSON.stringify({
            id: newBooking.id,
            status: newBooking.status,
            group_size: newBooking.group_size,
            slot_text: newBooking.slot_text,
            game_id: newBooking.game_id,
            booking_date: newBooking.booking_date,
            start_time: newBooking.start_time,
            end_time: newBooking.end_time,
            customer_id: newBooking.customer_id,
            transaction_id: newBooking.transaction_id,
          })
        );

        // VERIFICATION: If slot_text was not stored by POST /bookings,
        // retry via PUT /bookings to ensure customer info is visible
        // in the OTC Console. This guards against OTC API inconsistencies.
        if (!newBooking.slot_text && slotText) {
          console.warn(
            `[/api/book] WARNING: POST /bookings did NOT store slot_text. ` +
              `Retrying via PUT /bookings/${slotId}...`
          );
          try {
            const updated = await updateBooking(slotId, {
              slot_text: slotText,
            });
            console.log(
              `[/api/book] PUT /bookings/${slotId} result: ` +
                `slot_text="${updated.slot_text ?? '(still empty)'}"`
            );
          } catch (putError) {
            // Non-fatal: the booking was created, just without display text
            console.warn(
              `[/api/book] PUT /bookings/${slotId} failed (non-fatal):`,
              putError instanceof Error ? putError.message : putError
            );
          }
        }

        // NOTE: We intentionally do NOT create a waiver here.
        //
        // POST /waivers creates a COMPLETED waiver record, which makes
        // OTC Console show "Waiver signed, no booking" -- even though the
        // customer never actually signed a waiver. This is misleading and
        // prevents the proper waiver flow where:
        //   1. Customer receives automated waiver email after booking
        //   2. Customer clicks link and signs waiver digitally
        //   3. Only THEN does the waiver show as "signed" in OTC Console
        //
        // The customer's contact info is instead embedded in the booking's
        // `slot_text` field, which is visible in the OTC Console schedule.
        //
        // When POST /transactions is fixed on OTC's end, Strategy A will
        // handle the full flow including automated waiver emails.
      } catch (fallbackError) {
        const fallbackMessage =
          fallbackError instanceof Error
            ? fallbackError.message
            : 'Unknown fallback error';
        console.error(
          `[/api/book] Strategy B failed: ${fallbackMessage}`
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
    // 6. Invalidate availability cache
    // -----------------------------------------------------------------------
    cache.invalidate(availabilityCacheKey(gameId, bookingDate));

    // -----------------------------------------------------------------------
    // 7. Build and return response
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
      ...(usedFallback && {
        note: 'Booking confirmed via direct slot reservation. Payment will be collected at arrival.',
      }),
    };

    console.log(
      `[/api/book] SUCCESS - confirmation: ${confirmationNumber}, ` +
        `slot: #${slotId}, strategy: ${usedFallback ? 'B (POST new booking with slot_text)' : 'A (transaction)'}`
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
