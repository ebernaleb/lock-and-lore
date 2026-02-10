/**
 * Off The Couch Console API Client
 *
 * Server-side utility for authenticated communication with the OTC Console API.
 * Base URL: https://connect.offthecouch.io
 * Auth: X-API-Key header
 *
 * SECURITY: This module reads process.env.OTC_KEY and must ONLY be imported in
 * server-side code (API routes, Server Components). Never import this file in
 * any file that includes "use client".
 */

import type {
  OTCGamesResponse,
  OTCGame,
  OTCGameDetailResponse,
  OTCBooking,
  OTCBookingsResponse,
  OTCFetchBookingsParams,
  OTCCreateBookingParams,
  OTCUpdateBookingParams,
  OTCGiftCard,
  OTCGiftCardsResponse,
  OTCFetchGiftCardsParams,
  OTCTransaction,
  OTCCreateTransactionParams,
  OTCWaiver,
  OTCCreateWaiverParams,
  GameAvailability,
  Timeslot,
  GameActivity,
} from '@/types/otc-api';

import {
  cache,
  CACHE_TTL,
  availabilityCacheKey,
  activityCacheKey,
  pricingCacheKey,
  gamesCacheKey,
} from './cache';

const OTC_API_BASE_URL = 'https://connect.offthecouch.io';

/** Default request timeout in milliseconds (10 seconds) */
const REQUEST_TIMEOUT_MS = 10_000;

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Resolve the API key at call-time (not module-load time) so that
 * environment variable injection in serverless environments is reliable.
 */
function getApiKey(): string {
  const key = process.env.OTC_KEY;
  if (!key) {
    throw new Error(
      'OTC_KEY environment variable is not configured. ' +
        'Add it to .env.local for local development.'
    );
  }
  return key;
}

/**
 * Base fetch wrapper for all OTC API calls.
 *
 * - Injects authentication and content-type headers
 * - Enforces a request timeout via AbortController
 * - Parses JSON responses and surfaces actionable error messages
 */
async function otcFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const apiKey = getApiKey();
  const url = `${OTC_API_BASE_URL}${endpoint}`;

  // Enforce a timeout so a hung upstream never blocks our API route forever
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'X-API-Key': apiKey,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      // Attempt to extract a meaningful message from the error body
      let detail = '';
      try {
        const body = await response.text();
        detail = body.length > 0 ? `: ${body.slice(0, 500)}` : '';
      } catch {
        // If we cannot read the body, proceed without detail
      }
      throw new Error(
        `OTC API ${response.status} ${response.statusText} [${endpoint}]${detail}`
      );
    }

    return (await response.json()) as T;
  } catch (err: unknown) {
    // Convert AbortError into a friendlier timeout message
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error(
        `OTC API request timed out after ${REQUEST_TIMEOUT_MS}ms [${endpoint}]`
      );
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

// ---------------------------------------------------------------------------
// Public API functions
// ---------------------------------------------------------------------------

/** Parameters accepted by the GET /games endpoint */
export interface FetchGamesParams {
  /** Max results to return (1-100). API default: 50 */
  limit?: number;
  /** Pagination offset */
  offset?: number;
  /** Filter by company group / location */
  company_group_id?: number;
  /** Include archived games (default: false) */
  archived?: boolean;
  /** Sort field */
  sort_by?: 'name' | 'position' | 'id';
  /** Sort direction */
  sort_order?: 'asc' | 'desc';
}

/**
 * Fetch games from the OTC API.
 *
 * Defaults to non-archived games sorted by console position (ascending) so
 * that the landing page respects the ordering configured by the business.
 */
export async function fetchGames(
  params?: FetchGamesParams
): Promise<OTCGamesResponse> {
  const searchParams = new URLSearchParams();

  // Numeric params: use !== undefined so that 0 is still sent when explicit
  if (params?.limit !== undefined) {
    searchParams.set('limit', String(params.limit));
  }
  if (params?.offset !== undefined) {
    searchParams.set('offset', String(params.offset));
  }
  if (params?.company_group_id !== undefined) {
    searchParams.set('company_group_id', String(params.company_group_id));
  }

  // Boolean param
  if (params?.archived !== undefined) {
    searchParams.set('archived', String(params.archived));
  }

  // Sort params -- default to position ascending for landing page display
  searchParams.set('sort_by', params?.sort_by ?? 'position');
  searchParams.set('sort_order', params?.sort_order ?? 'asc');

  const query = searchParams.toString();
  const endpoint = `/games${query ? `?${query}` : ''}`;

  return otcFetch<OTCGamesResponse>(endpoint);
}

/**
 * Fetch a single game by its ID.
 *
 * The API may wrap the game in `{ game: {...} }` or return the object
 * directly. This function normalizes both shapes to a plain OTCGame.
 */
export async function fetchGameById(
  id: number,
  includePricing = false
): Promise<OTCGame> {
  const params = new URLSearchParams();
  if (includePricing) {
    // OTC uses integer booleans: 1 = true, 0 = false
    params.set('include_pricing', '1');
  }
  const query = params.toString();
  const endpoint = `/games/${id}${query ? `?${query}` : ''}`;

  const data = await otcFetch<OTCGame | OTCGameDetailResponse>(endpoint);

  // Normalize: unwrap if the API returned a wrapper object
  if (data && typeof data === 'object' && 'game' in data) {
    return (data as OTCGameDetailResponse).game;
  }
  return data as OTCGame;
}

/**
 * Lightweight health check -- verifies the API key is valid by requesting
 * a single game from the API.
 */
export async function verifyApiKey(): Promise<boolean> {
  try {
    await fetchGames({ limit: 1 });
    return true;
  } catch (error) {
    console.error('[OTC] API key verification failed:', error);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Bookings
// ---------------------------------------------------------------------------

/**
 * Fetch bookings from the OTC API with optional filters.
 *
 * Used to derive availability (occupied timeslots) for a given game and date.
 */
export async function fetchBookings(
  params?: OTCFetchBookingsParams
): Promise<OTCBookingsResponse> {
  const searchParams = new URLSearchParams();

  if (params?.limit !== undefined) {
    searchParams.set('limit', String(Math.min(100, Math.max(1, params.limit))));
  }
  if (params?.offset !== undefined) {
    searchParams.set('offset', String(params.offset));
  }
  if (params?.company_group_id !== undefined) {
    searchParams.set('company_group_id', String(params.company_group_id));
  }
  if (params?.game_id !== undefined) {
    searchParams.set('game_id', String(params.game_id));
  }
  if (params?.status) {
    searchParams.set('status', params.status);
  }
  if (params?.start_date) {
    searchParams.set('start_date', params.start_date);
  }
  if (params?.end_date) {
    searchParams.set('end_date', params.end_date);
  }
  if (params?.sort_by) {
    searchParams.set('sort_by', params.sort_by);
  }
  if (params?.sort_order) {
    searchParams.set('sort_order', params.sort_order);
  }

  const query = searchParams.toString();
  return otcFetch<OTCBookingsResponse>(`/bookings${query ? `?${query}` : ''}`);
}

/**
 * Create a new booking slot in the OTC system.
 *
 * Note: Per OTC docs, POST /bookings creates calendar booking slots
 * (staff-facing). Customer-facing bookings typically go through
 * POST /transactions with booking slot IDs.
 */
export async function createBooking(
  params: OTCCreateBookingParams
): Promise<OTCBooking> {
  const data = await otcFetch<OTCBooking | { booking: OTCBooking }>(
    '/bookings',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }
  );

  // Normalize: unwrap if the API returned a wrapper object
  if (data && typeof data === 'object' && 'booking' in data) {
    return (data as { booking: OTCBooking }).booking;
  }
  return data as OTCBooking;
}

/**
 * Update an existing booking slot via PUT /bookings/{id}.
 *
 * IMPORTANT: PUT /bookings has LIMITED writable fields. The following fields
 * are SILENTLY IGNORED by the OTC API (confirmed via testing 2026-02-06):
 *   - status (cannot change "available" to "confirmed")
 *   - description (silently ignored -- use `slot_text` instead)
 *   - customer_email, customer_first_name, etc. (customer fields)
 *
 * Known writable fields (per OTC API docs + testing):
 *   - booking_date, start_time, end_time
 *   - group_size
 *   - slot_text (booking display text -- confirmed writable via PUT 2026-02-06)
 *   - price, tax, fee, discount, recalculate_pricing
 *   - tickets_to_add, ticket_ids_to_remove
 *
 * NOTE: This function is kept for utility purposes but is NOT used in the
 * booking strategy. Strategy B uses POST /bookings (which creates a new entry
 * with status="1") instead of PUT (which cannot change status from "available").
 */
export async function updateBooking(
  bookingId: number,
  params: OTCUpdateBookingParams
): Promise<OTCBooking> {
  const data = await otcFetch<OTCBooking | { booking: OTCBooking }>(
    `/bookings/${bookingId}`,
    {
      method: 'PUT',
      body: JSON.stringify(params),
    }
  );

  // Normalize: unwrap if the API returned a wrapper object
  if (data && typeof data === 'object' && 'booking' in data) {
    return (data as { booking: OTCBooking }).booking;
  }
  return data as OTCBooking;
}

// ---------------------------------------------------------------------------
// Waivers (used to register customers in the OTC system)
// ---------------------------------------------------------------------------

/**
 * Create a waiver in the OTC system.
 *
 * WARNING: POST /waivers creates a COMPLETED/SIGNED waiver record.
 * The very act of calling this endpoint marks the waiver as signed in
 * the OTC Console, even if no `signature` (base64) is provided.
 * There is no API parameter to create an "unsigned" or "pending" waiver,
 * nor to trigger an automated waiver email to the customer.
 *
 * DO NOT call this during the booking flow. It causes:
 *   - OTC Console to show "Waiver signed, no booking"
 *   - Customer never actually signed anything
 *   - Misleading records in the waiver management system
 *
 * Waiver emails to customers are handled by OTC's internal automation
 * when bookings are created through POST /transactions (Strategy A).
 * For Strategy B (direct POST /bookings), waivers should be managed
 * manually by staff through the OTC Console.
 *
 * This function is kept for cases where a signed waiver record truly
 * needs to be created programmatically (e.g., kiosk mode, in-person
 * waiver signing with digital signature capture).
 */
export async function createWaiver(
  params: OTCCreateWaiverParams
): Promise<OTCWaiver> {
  const data = await otcFetch<OTCWaiver | { waiver: OTCWaiver }>(
    '/waivers',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }
  );

  // Normalize wrapper
  if (data && typeof data === 'object' && 'waiver' in data) {
    return (data as { waiver: OTCWaiver }).waiver;
  }
  return data as OTCWaiver;
}

// ---------------------------------------------------------------------------
// Availability (from OTC schedule-generated booking slots)
// ---------------------------------------------------------------------------

/**
 * HOW OTC AVAILABILITY WORKS (discovered 2026-02-05):
 *
 * The OTC console's "Schedules" feature automatically generates booking slot
 * entries in the bookings table. When a business creates a "Booking Schedule"
 * (e.g., "Hours of Operation" with start times, days, and assigned games),
 * OTC's schedule engine pre-populates GET /bookings with entries that have:
 *
 *   - status: "available"  -- open slot, no customer assigned
 *   - status: "expired"    -- past slot whose time has passed
 *   - group_size: 0, customer fields: null, transaction_id: null
 *
 * When a customer books a slot, OTC updates that booking entry to a customer-
 * facing status (confirmed, pending, etc.) and populates customer/transaction
 * fields.
 *
 * THEREFORE: We do NOT need to generate timeslots locally. We fetch the real
 * schedule-generated slots directly from GET /bookings and categorize them by
 * status. This respects the actual operating hours, day-of-week variations,
 * holiday closures, and buffer times configured in the OTC console.
 *
 * Schedule differences observed:
 *   - Weekdays: 5 slots (16:00, 17:30, 19:00, 20:30, 22:00)
 *   - Weekends: 8 slots (11:00, 12:30, 14:00, 15:30, 17:00, 18:30, 20:00, 21:30)
 *   - All slots are 90-min intervals (60min game + 30min buffer)
 */

/**
 * Normalize a time string from OTC (HH:MM:SS) to display format (HH:MM).
 */
function normalizeTime(time: string): string {
  // OTC returns "HH:MM:SS" -- strip seconds for display
  const parts = time.split(':');
  return `${parts[0]}:${parts[1]}`;
}

/**
 * Fetch availability for a game on a specific date.
 *
 * This fetches ALL booking entries from the OTC API for the given game+date.
 * The OTC schedule engine pre-generates these entries with status "available"
 * for open slots. We separate them into available vs. booked timeslots.
 *
 * This approach uses REAL schedule data from OTC -- no hardcoded hours,
 * no local timeslot generation. The schedule configured in the OTC console
 * ("Hours of Operation") is the single source of truth.
 *
 * Results are cached for CACHE_TTL.AVAILABILITY seconds.
 */
export async function fetchAvailability(
  gameId: number,
  date: string
): Promise<GameAvailability> {
  // Check cache first
  const cacheKey = availabilityCacheKey(gameId, date);
  const cached = cache.get<GameAvailability>(cacheKey);
  if (cached) {
    console.log(
      `[OTC Availability] Cache HIT for game ${gameId} on ${date}. ` +
        `${cached.available_slots}/${cached.total_slots} slots available.`
    );
    return cached;
  }

  console.log(
    `[OTC Availability] Cache MISS for game ${gameId} on ${date}. Fetching from OTC API...`
  );

  // Fetch game details with pricing for enriching slot data
  const priceCacheKey = pricingCacheKey(gameId);
  let game = cache.get<OTCGame>(priceCacheKey);
  if (!game) {
    try {
      game = await fetchGameById(gameId, true);
      cache.set(priceCacheKey, game, CACHE_TTL.PRICING);
    } catch {
      // OTC API may have database errors when fetching pricing
      // Fall back to basic game data (will use deposit_amount for price)
      console.warn(
        `[OTC Availability] Pricing unavailable for game ${gameId} - using deposit as fallback.`
      );
      game = await fetchGameById(gameId, false);
      cache.set(priceCacheKey, game, CACHE_TTL.PRICING);
    }
  }

  // Fetch ALL booking entries for this game+date from OTC.
  // This includes both schedule-generated "available" slots AND booked slots.
  let allBookings: OTCBooking[] = [];
  try {
    const bookingsResponse = await fetchBookings({
      game_id: gameId,
      start_date: date,
      end_date: date,
      limit: 100, // Max per request; should cover all daily slots
      sort_by: 'start_time' as any,
      sort_order: 'asc',
    });
    allBookings = bookingsResponse.bookings;

    console.log(
      `[OTC Availability] OTC API returned ${allBookings.length} booking entries ` +
        `for game ${gameId} on ${date}.`
    );

    if (allBookings.length > 0) {
      console.log(
        `[OTC Availability] Booking entries from OTC:`,
        JSON.stringify(
          allBookings.map((b) => ({
            id: b.id,
            status: b.status ?? '(no status)',
            start_time: b.start_time,
            end_time: b.end_time,
            group_size: b.group_size,
            customer_id: b.customer_id ?? null,
          })),
          null,
          2
        )
      );
    }
  } catch (error) {
    // If the fetch fails, return empty availability with a warning.
    // We cannot fall back to local generation since we do not know
    // the real schedule hours.
    console.error(
      `[OTC Availability] Failed to fetch booking entries for game ${gameId} on ${date}:`,
      error
    );

    const emptyAvailability: GameAvailability = {
      game_id: gameId,
      game_name: game.name,
      date,
      timeslots: [],
      total_slots: 0,
      available_slots: 0,
    };
    // Cache the empty result for a shorter period so we retry sooner
    cache.set(cacheKey, emptyAvailability, 15);
    return emptyAvailability;
  }

  // De-duplicate slots by start_time. OTC may return multiple booking entries
  // for the same timeslot (e.g., an "available" slot and its duplicate).
  // We group by start_time and pick the most relevant entry per slot.
  const slotsByTime = new Map<string, OTCBooking[]>();
  for (const booking of allBookings) {
    const key = normalizeTime(booking.start_time);
    const existing = slotsByTime.get(key) || [];
    existing.push(booking);
    slotsByTime.set(key, existing);
  }

  // Resolve pricing data to enrich each timeslot
  let slotPrice: number | undefined;
  let slotPricingType: string | undefined;

  if (game.pricing_categories && game.pricing_categories.length > 0) {
    const prices = game.pricing_categories.map((c) => c.price);
    slotPrice = Math.min(...prices);
    slotPricingType = game.pricing_type;
  } else if (game.deposit_amount && game.deposit_amount > 0) {
    slotPrice = game.deposit_amount;
    slotPricingType = 'deposit';
  }

  // Build timeslot list from the OTC booking entries.
  // For each unique start_time, determine if the slot is available or booked.
  const timeslots: Timeslot[] = [];

  // Sort by start time for consistent ordering
  const sortedTimes = Array.from(slotsByTime.keys()).sort();

  for (const startTime of sortedTimes) {
    const bookingsForSlot = slotsByTime.get(startTime)!;

    // Check if any booking for this time is a schedule-generated "available" slot.
    // These have: status="available", group_size=0, created_at=null, customer=null
    const availableBooking = bookingsForSlot.find(
      (b) => b.status?.toLowerCase().trim() === 'available'
    );

    // Check if any booking for this time is a real customer reservation.
    //
    // A slot is considered "booked" if ANY of these conditions are true:
    //
    //   1. Has a transaction_id linked (booked via POST /transactions -- Strategy A)
    //   2. Has a customer_id linked (transaction created a customer record)
    //   3. Status is a customer-facing status like "confirmed", "pending",
    //      "checked_in", "in_progress", "completed", "cancelled", etc.
    //   4. Status is "1" -- POST /bookings creates entries with status="1"
    //      (active/booked). This is how Strategy B works: it creates a NEW
    //      booking entry at the same time, which gets status="1" and the
    //      specified group_size. The OTC Console shows these as occupied slots.
    //   5. Has group_size > 0 on an "available" slot -- legacy Strategy B
    //      detection (PUT /bookings could set group_size but not status).
    //      Schedule-generated "available" slots always have group_size=0.
    const bookedEntry = bookingsForSlot.find((b) => {
      const status = b.status?.toLowerCase().trim();
      const hasTransaction = b.transaction_id !== null && b.transaction_id !== undefined;
      const hasCustomer = b.customer_id !== null && b.customer_id !== undefined;

      // Strategy A: linked to transaction or customer
      if (hasTransaction || hasCustomer) {
        return true;
      }

      // Strategy B (new approach): POST /bookings creates status="1"
      // This is NOT a schedule-generated slot -- it is an API-created booking
      if (status === '1') {
        return true;
      }

      // Standard OTC statuses that indicate a confirmed/active booking
      if (status !== 'available' && status !== 'expired') {
        return true;
      }

      // Legacy detection: "available" slot with group_size > 0
      // (from old Strategy B that used PUT /bookings to set group_size)
      if (status === 'available' && b.group_size > 0) {
        return true;
      }

      return false;
    });

    // The slot is available only if there is a schedule-generated "available"
    // entry and no active customer booking for the same time
    const isAvailable = !!availableBooking && !bookedEntry;

    // Use the available booking's ID if present (needed for transaction creation)
    const representativeBooking = availableBooking || bookingsForSlot[0];

    timeslots.push({
      booking_slot_id: isAvailable ? representativeBooking.id : undefined,
      start_time: normalizeTime(representativeBooking.start_time),
      end_time: normalizeTime(representativeBooking.end_time),
      available: isAvailable,
      price: slotPrice,
      pricing_type: slotPricingType,
    });

    if (!isAvailable && bookedEntry) {
      // Determine how the booking was detected for debug logging
      const detectionMethod =
        bookedEntry.transaction_id ? 'transaction (Strategy A)' :
        bookedEntry.customer_id ? 'customer (Strategy A)' :
        bookedEntry.status === '1' ? 'status=1 (Strategy B: POST /bookings)' :
        (bookedEntry.status?.toLowerCase().trim() !== 'available' && bookedEntry.status?.toLowerCase().trim() !== 'expired') ? `status="${bookedEntry.status}"` :
        bookedEntry.group_size > 0 ? 'group_size>0 (legacy Strategy B)' : 'unknown';

      console.log(
        `[OTC Availability] Slot ${startTime} BOOKED -- ` +
          `booking #${bookedEntry.id} (status: "${bookedEntry.status}", ` +
          `group_size: ${bookedEntry.group_size}, ` +
          `transaction: ${bookedEntry.transaction_id ?? 'none'}, ` +
          `customer: ${bookedEntry.customer_email ?? bookedEntry.customer_id ?? 'none'}, ` +
          `detected via: ${detectionMethod})`
      );
    }
  }

  const availability: GameAvailability = {
    game_id: gameId,
    game_name: game.name,
    date,
    timeslots,
    total_slots: timeslots.length,
    available_slots: timeslots.filter((s) => s.available).length,
  };

  console.log(
    `[OTC Availability] Final result for game ${gameId} on ${date}: ` +
      `${availability.available_slots}/${availability.total_slots} slots available ` +
      `(real OTC schedule data).`
  );

  // Cache the result
  cache.set(cacheKey, availability, CACHE_TTL.AVAILABILITY);

  return availability;
}

/**
 * Generate an urgency message based on availability data.
 *
 * Returns null if there is no urgency (plenty of slots available).
 */
export function generateUrgencyMessage(
  availability: GameAvailability
): string | null {
  const { available_slots, total_slots } = availability;

  if (available_slots === 0) {
    return 'Sold out for today! Check another date.';
  }

  // Calculate the availability ratio
  const ratio = available_slots / total_slots;

  if (available_slots === 1) {
    return 'Only 1 slot left today -- book now!';
  }

  if (available_slots <= 2) {
    return `Only ${available_slots} slots left today!`;
  }

  if (ratio <= 0.25) {
    return `Almost sold out -- only ${available_slots} slots remaining!`;
  }

  if (ratio <= 0.5) {
    return `Filling up fast -- ${available_slots} slots left today.`;
  }

  // No urgency message for well-stocked days
  return null;
}

// ---------------------------------------------------------------------------
// Activity / Social Proof
// ---------------------------------------------------------------------------

/**
 * Fetch recent booking activity for a game to generate social proof.
 *
 * This counts bookings from the past 24 hours and generates a simulated
 * "viewers count" for the social proof display. The viewer count is
 * simulated because the OTC API does not track real-time page views.
 *
 * Results are cached for CACHE_TTL.ACTIVITY seconds.
 */
export async function fetchGameActivity(
  gameId: number
): Promise<GameActivity> {
  // Check cache first
  const cacheKey = activityCacheKey(gameId);
  const cached = cache.get<GameActivity>(cacheKey);
  if (cached) {
    return cached;
  }

  // Determine the 24-hour window for "recent" bookings
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const formatDate = (d: Date): string => d.toISOString().split('T')[0];

  let recentBookings = 0;

  try {
    const bookingsResponse = await fetchBookings({
      game_id: gameId,
      start_date: formatDate(yesterday),
      end_date: formatDate(now),
      limit: 100,
    });
    recentBookings = bookingsResponse.pagination.total_count;
  } catch (error) {
    console.warn(
      `[OTC] Failed to fetch recent bookings for game ${gameId}:`,
      error
    );
  }

  // Generate a plausible "viewers" count based on booking activity.
  // This is simulated social proof -- clearly marked as such in the type.
  // The formula: base of 2-5, plus 1-3 per recent booking, with randomness.
  const baseViewers = Math.floor(Math.random() * 4) + 2; // 2-5
  const bookingBoost = recentBookings * (Math.floor(Math.random() * 3) + 1);
  const viewersCount = Math.min(baseViewers + bookingBoost, 25); // Cap at 25

  // Generate a human-readable activity message
  let activityMessage: string;
  if (recentBookings >= 5) {
    activityMessage = 'Very popular! Booked multiple times today.';
  } else if (recentBookings >= 2) {
    activityMessage = `Booked ${recentBookings} times recently.`;
  } else if (recentBookings === 1) {
    activityMessage = 'Booked once recently.';
  } else {
    activityMessage = 'Be the first to book today!';
  }

  const activity: GameActivity = {
    game_id: gameId,
    recent_bookings: recentBookings,
    viewers_count: viewersCount,
    activity_message: activityMessage,
    is_simulated: true,
  };

  cache.set(cacheKey, activity, CACHE_TTL.ACTIVITY);

  return activity;
}

// ---------------------------------------------------------------------------
// Gift Cards
// ---------------------------------------------------------------------------

/**
 * Fetch gift cards from the OTC API.
 */
export async function fetchGiftCards(
  params?: OTCFetchGiftCardsParams
): Promise<OTCGiftCardsResponse> {
  const searchParams = new URLSearchParams();

  if (params?.limit !== undefined) {
    searchParams.set('limit', String(Math.min(100, Math.max(1, params.limit))));
  }
  if (params?.offset !== undefined) {
    searchParams.set('offset', String(params.offset));
  }
  if (params?.company_group_id !== undefined) {
    searchParams.set('company_group_id', String(params.company_group_id));
  }
  if (params?.status) {
    searchParams.set('status', params.status);
  }
  if (params?.start_date) {
    searchParams.set('start_date', params.start_date);
  }
  if (params?.end_date) {
    searchParams.set('end_date', params.end_date);
  }
  if (params?.sort_by) {
    searchParams.set('sort_by', params.sort_by);
  }
  if (params?.sort_order) {
    searchParams.set('sort_order', params.sort_order);
  }

  const query = searchParams.toString();
  return otcFetch<OTCGiftCardsResponse>(
    `/gift-cards${query ? `?${query}` : ''}`
  );
}

/**
 * Fetch a single gift card by ID, including its balance and status.
 */
export async function fetchGiftCardById(
  id: number,
  includeTransactions = false
): Promise<OTCGiftCard> {
  const params = new URLSearchParams();
  if (includeTransactions) {
    params.set('include_transactions', 'true');
  }
  const query = params.toString();

  const data = await otcFetch<OTCGiftCard | { gift_card: OTCGiftCard }>(
    `/gift-cards/${id}${query ? `?${query}` : ''}`
  );

  // Normalize wrapper
  if (data && typeof data === 'object' && 'gift_card' in data) {
    return (data as { gift_card: OTCGiftCard }).gift_card;
  }
  return data as OTCGiftCard;
}

// ---------------------------------------------------------------------------
// Transactions
// ---------------------------------------------------------------------------

/**
 * Create a transaction in the OTC system.
 *
 * This is the primary way to complete a customer booking or gift card
 * purchase through the API. The transaction ties together bookings,
 * gift cards, customer data, and payment.
 *
 * KNOWN ISSUE (diagnosed 2026-02-07): Returns 500 "Internal server error"
 * because no pricing categories are configured in OTC Console. The same
 * root cause makes GET /games/{id}?include_pricing=true return 500
 * "Database error occurred". POST /transactions internally performs a
 * pricing calculation that crashes when pricing_categories is empty.
 *
 * FIX: Configure pricing categories in OTC Console (Games > Settings > Pricing).
 * Until that's done, the booking flow uses Strategy B (POST /bookings) as fallback.
 */
export async function createTransaction(
  params: OTCCreateTransactionParams
): Promise<OTCTransaction> {
  const data = await otcFetch<
    OTCTransaction | { transaction: OTCTransaction }
  >('/transactions', {
    method: 'POST',
    body: JSON.stringify(params),
  });

  // Normalize wrapper
  if (data && typeof data === 'object' && 'transaction' in data) {
    return (data as { transaction: OTCTransaction }).transaction;
  }
  return data as OTCTransaction;
}

// ---------------------------------------------------------------------------
// Cached Game Fetching (with pricing)
// ---------------------------------------------------------------------------

/**
 * Fetch a game by ID with pricing data, using the cache layer.
 *
 * This is useful for API routes that need pricing info repeatedly
 * (e.g., availability endpoint enriching slots with prices).
 */
export async function fetchGameWithPricingCached(
  gameId: number
): Promise<OTCGame> {
  const cacheKey = pricingCacheKey(gameId);
  const cached = cache.get<OTCGame>(cacheKey);
  if (cached) {
    return cached;
  }

  const game = await fetchGameById(gameId, true);
  cache.set(cacheKey, game, CACHE_TTL.PRICING);
  return game;
}

/**
 * Fetch all games with caching.
 */
export async function fetchGamesCached(
  params?: FetchGamesParams
): Promise<OTCGamesResponse> {
  const paramKey = params ? JSON.stringify(params) : 'default';
  const cacheKey = gamesCacheKey(paramKey);
  const cached = cache.get<OTCGamesResponse>(cacheKey);
  if (cached) {
    return cached;
  }

  const response = await fetchGames(params);
  cache.set(cacheKey, response, CACHE_TTL.GAMES);
  return response;
}

// Re-export for advanced / custom endpoint usage (e.g., bookings, waivers)
export { otcFetch };
