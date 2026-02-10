/**
 * Off The Couch Console API - TypeScript Type Definitions
 *
 * Based on official API documentation at https://docs.offthecouch.io/api-docs
 * Base URL: https://connect.offthecouch.io
 *
 * NOTE: The OTC API represents boolean values as integers (1 = true, 0 = false)
 * in responses, per the documented "Boolean Values" convention.
 */

// ---------------------------------------------------------------------------
// Shared / Nested Types
// ---------------------------------------------------------------------------

/** Company group (location) as returned in nested game responses */
export interface OTCCompanyGroup {
  id: number;
  name: string;
  code: string;
}

/**
 * Difficulty representation.
 *
 * The documented /games list endpoint returns difficulty as a plain integer
 * (e.g. 3). However, the /games/{id} detail endpoint MAY return a richer
 * object. We keep the object shape as a defensive type so consumers can
 * handle both forms gracefully.
 */
export interface OTCDifficultyObject {
  level: number;
  name?: string;
}

/** Pricing category returned when include_pricing=true on /games/{id} */
export interface OTCPricingCategory {
  id: number;
  name: string;
  price: number;
  min_players?: number;
  max_players?: number;
  description?: string;
}

// ---------------------------------------------------------------------------
// Game Types
// ---------------------------------------------------------------------------

/**
 * A single game (escape room) as returned by the OTC API.
 *
 * Fields marked optional may not be present in every response depending on
 * the endpoint and query parameters used.
 */
export interface OTCGame {
  id: number;
  name: string;
  description: string;

  /** Minimum players for this game. Documented in /games response. */
  min_players?: number;
  /** Minimum players count (alternative field name from API). */
  min_players_count?: number;
  /** Maximum players for this game. Documented in /games response. */
  max_players?: number;
  /** Maximum players count (alternative field name from API). */
  max_players_count?: number;
  /** Duration in minutes. Documented in /games response. */
  duration?: number;
  /** Duration in minutes (alternative field name from API). */
  duration_minutes?: number;

  /**
   * Difficulty level. The /games list endpoint returns an integer (e.g. 3).
   * The detail endpoint may return a richer object.
   */
  difficulty: number | OTCDifficultyObject;

  /**
   * Whether the game is publicly visible. OTC uses integer booleans:
   * 1 = public, 0 = private. Typed broadly to handle edge cases.
   */
  is_public: number;

  /** Whether a deposit is required (1 = yes, 0 = no) */
  deposit_required?: number;
  /** Deposit amount in dollars */
  deposit_amount?: number;
  /** Pricing model: "per_person", "flat_rate", etc. */
  pricing_type?: string;

  /** Image URL for the game. Available on detail endpoint, may be on list. */
  image_url?: string;

  /** The location/company group this game belongs to */
  company_group?: OTCCompanyGroup;

  /** Pricing breakdown, only when include_pricing=true on detail endpoint */
  pricing_categories?: OTCPricingCategory[];

  /** Total number of bookings for this game */
  total_bookings?: number;

  /** Whether the game is archived (1 = archived, 0 = active) */
  archived?: number;

  /** Display order position configured in the OTC console */
  position?: number;
}

// ---------------------------------------------------------------------------
// Response Wrappers
// ---------------------------------------------------------------------------

/** Response shape for GET /games/{id} */
export interface OTCGameDetailResponse {
  game: OTCGame;
}

/**
 * Pagination metadata returned by all OTC list endpoints.
 * Documented fields: total_count, has_more, next_offset.
 */
export interface OTCPagination {
  total_count: number;
  has_more: boolean;
  next_offset?: number;
}

/** Response shape for GET /games */
export interface OTCGamesResponse {
  games: OTCGame[];
  pagination: OTCPagination;
}

// ---------------------------------------------------------------------------
// Booking Types
// ---------------------------------------------------------------------------

/** Customer as nested in booking responses */
export interface OTCBookingCustomer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

/** Game reference as nested in booking responses */
export interface OTCBookingGame {
  id: number;
  name: string;
}

/**
 * A single booking as returned by the OTC API.
 *
 * IMPORTANT: The OTC API returns bookings with flat fields (not nested objects).
 * The schedule engine pre-populates booking entries with status "available" for
 * open timeslots. These have group_size=0, customer fields null, transaction_id null.
 *
 * Known booking statuses from OTC:
 *   - "available" -- schedule-generated open slot (no customer)
 *   - "expired"   -- schedule-generated slot whose time has passed
 *   - "confirmed" -- customer-booked slot
 *   - "pending"   -- awaiting confirmation
 *   - "checked_in" / "in_progress" / "completed" -- active session statuses
 *   - "cancelled" / "canceled" / "no_show" / "refunded" -- inactive
 */
export interface OTCBooking {
  id: number;
  booking_date: string;
  /** End date (usually same as booking_date for single-day bookings) */
  end_date?: string;
  start_time: string;
  end_time: string;
  status?: string;
  group_size: number;
  price: number;
  tax?: number;
  fee?: number;
  discount?: number;
  total?: number;
  created_at?: string | null;
  is_public_booking?: number;
  /** @deprecated OTC ignores this field on POST/PUT. Use `slot_text` instead. */
  description?: string;
  /**
   * Text displayed on the booking slot in OTC Console schedule view.
   * This is the ACTUAL writable text field (not `description`).
   * Writable via both POST and PUT /bookings.
   */
  slot_text?: string;

  // Flat game fields (actual OTC API shape)
  game_id?: number;
  game_name?: string;

  // Flat company group fields
  company_group_id?: number;
  company_group_name?: string;
  company_group_code?: string;

  // Flat customer fields (null for "available" schedule slots)
  customer_id?: number | null;
  customer_first_name?: string | null;
  customer_last_name?: string | null;
  customer_email?: string | null;
  customer_phone?: string | null;

  // Transaction reference (null for "available" schedule slots)
  transaction_id?: number | null;
  order_number?: string | null;

  // Legacy nested shapes -- some OTC API responses may still use these
  game?: OTCBookingGame;
  customer?: OTCBookingCustomer;
}

/** Response shape for GET /bookings */
export interface OTCBookingsResponse {
  bookings: OTCBooking[];
  pagination: OTCPagination;
}

/** Parameters for creating a booking via POST /bookings */
export interface OTCCreateBookingParams {
  game_id: number;
  company_group_id: number;
  booking_date: string;
  start_time: string;
  end_time: string;
  group_size?: number;
  custom_price?: number;
  /**
   * Text displayed on the booking slot in OTC Console schedule view.
   *
   * IMPORTANT: The OTC API uses `slot_text` (NOT `description`) for this field.
   * The `description` field documented in the API docs is silently ignored on
   * both POST and PUT. This was confirmed via testing on 2026-02-06.
   *
   * We use this to embed customer contact info so staff can see who booked
   * directly in the OTC Console.
   */
  slot_text?: string;
}

/**
 * Parameters for updating a booking via PUT /bookings/{id}.
 *
 * IMPORTANT: Only these fields are accepted. The following are SILENTLY IGNORED:
 *   - status (cannot be changed via PUT)
 *   - description (silently ignored -- use `slot_text` instead)
 *   - customer fields (customer_email, customer_first_name, etc.)
 *
 * To create a "booked" slot, use POST /bookings (returns status="1") instead.
 */
export interface OTCUpdateBookingParams {
  booking_date?: string;
  start_time?: string;
  end_time?: string;
  group_size?: number;
  /** Text displayed on the booking slot in OTC Console. Writable via PUT (confirmed 2026-02-06). */
  slot_text?: string;
  price?: number;
  tax?: number;
  fee?: number;
  discount?: number;
  recalculate_pricing?: boolean;
  tickets_to_add?: Array<{ pricing_category_id: number; quantity: number }>;
  ticket_ids_to_remove?: number[];
}

/** Parameters for querying bookings via GET /bookings */
export interface OTCFetchBookingsParams {
  limit?: number;
  offset?: number;
  company_group_id?: number;
  game_id?: number;
  status?: string;
  start_date?: string;
  end_date?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// ---------------------------------------------------------------------------
// Gift Card Types
// ---------------------------------------------------------------------------

/** A gift card as returned by the OTC API */
export interface OTCGiftCard {
  id: number;
  code: string;
  amount: number;
  balance: number;
  status: 'active' | 'redeemed' | 'expired';
  purchased_date: string;
  activation_date?: string;
  expiration_date?: string;
  game?: OTCBookingGame;
  company_group?: OTCCompanyGroup;
  purchaser_email?: string;
  transaction_id?: number;
  order_number?: string;
}

/** Response shape for GET /gift-cards */
export interface OTCGiftCardsResponse {
  gift_cards: OTCGiftCard[];
  pagination: OTCPagination;
}

/** Parameters for querying gift cards via GET /gift-cards */
export interface OTCFetchGiftCardsParams {
  limit?: number;
  offset?: number;
  company_group_id?: number;
  status?: 'active' | 'redeemed' | 'expired';
  start_date?: string;
  end_date?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// ---------------------------------------------------------------------------
// Transaction Types
// ---------------------------------------------------------------------------

/** Customer reference as nested in transaction responses */
export interface OTCTransactionCustomer {
  id: number;
  name: string;
  email: string;
}

/** A transaction as returned by the OTC API */
export interface OTCTransaction {
  id: number;
  order_number: string;
  status: string;
  price: number;
  tax: number;
  fee: number;
  total: number;
  paid: number;
  refunded: number;
  due: number;
  customer?: OTCTransactionCustomer;
  company_group?: OTCCompanyGroup;
}

/** Response shape for GET /transactions */
export interface OTCTransactionsResponse {
  transactions: OTCTransaction[];
  pagination: OTCPagination;
}

/** Gift card entry for transaction creation */
export interface OTCNewGiftCard {
  type: string;
  amount: number;
  recipient_email?: string;
  recipient_name?: string;
  message?: string;
}

/** Parameters for creating a transaction via POST /transactions */
export interface OTCCreateTransactionParams {
  company_group_id: number;
  customer: {
    email: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
  };
  bookings?: number[];
  gift_cards?: OTCNewGiftCard[];
  custom_deposit_enabled?: boolean;
  custom_deposit_amount?: number;
}

// ---------------------------------------------------------------------------
// Waiver Types
// ---------------------------------------------------------------------------

/** A waiver as returned by the OTC API */
export interface OTCWaiver {
  id: number;
  user_id: number;
  game_id: number;
  game_name: string;
  company_group_id: number;
  company_group_name: string;
  date: string;
  created_time: string;
  first_name: string;
  last_name: string;
  birthday?: string | null;
  phone?: string;
  picture_optout: number;
  email_optout: number;
  created_internally: number;
  not_participating: number;
  booking_slot_id?: number | null;
  booking_date?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  experience?: string;
  source?: string;
  customer_email: string;
}

/** Parameters for creating a waiver via POST /waivers */
export interface OTCCreateWaiverParams {
  game_id: number;
  /** Either user_id OR customer object with email is required */
  user_id?: number;
  customer?: {
    email: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    birthday?: string;
  };
  booking_slot_id?: number;
  signature?: string;
  picture_optout?: boolean;
  email_optout?: boolean;
  experience?: string;
  source?: string;
}

// ---------------------------------------------------------------------------
// Availability Types (Derived / Application-Level)
// ---------------------------------------------------------------------------

/**
 * A single timeslot with availability status.
 *
 * These now come directly from OTC's schedule-generated booking slots
 * (GET /bookings with the target date). The OTC schedule engine creates
 * entries with status "available" for open slots and various other statuses
 * for booked/expired slots.
 */
export interface Timeslot {
  /** OTC booking slot ID -- needed to create transactions against this slot */
  booking_slot_id?: number;
  /** Start time in HH:MM format */
  start_time: string;
  /** End time in HH:MM format */
  end_time: string;
  /** Whether this slot is available for booking */
  available: boolean;
  /** Price for this slot (if pricing data available) */
  price?: number;
  /** Pricing type label */
  pricing_type?: string;
}

/** Availability data for a specific game on a specific date */
export interface GameAvailability {
  game_id: number;
  game_name: string;
  date: string;
  timeslots: Timeslot[];
  /** Total slots for the day */
  total_slots: number;
  /** Number of available slots */
  available_slots: number;
}

/** Response shape for our availability API endpoint */
export interface AvailabilityResponse {
  availability: GameAvailability;
  /** Urgency message (e.g., "Only 2 slots left today!") */
  urgency_message?: string;
  /** ISO timestamp of when this data was fetched */
  fetched_at: string;
}

// ---------------------------------------------------------------------------
// Activity / Social Proof Types (Application-Level)
// ---------------------------------------------------------------------------

/**
 * Social proof data for a game, used for conversion optimization.
 * Some of this is derived from real booking data, some is simulated
 * when the OTC API does not provide real-time viewer counts.
 */
export interface GameActivity {
  game_id: number;
  /** Recent booking count (last 24h or configurable window) */
  recent_bookings: number;
  /** Simulated "people viewing" count for social proof */
  viewers_count: number;
  /** Human-readable activity message */
  activity_message: string;
  /** Whether the data is real or simulated */
  is_simulated: boolean;
}

/** Response shape for our activity API endpoint */
export interface ActivityResponse {
  activity: GameActivity;
  fetched_at: string;
}

// ---------------------------------------------------------------------------
// Booking Flow Types (Application-Level)
// ---------------------------------------------------------------------------

/** Step in the streamlined 3-step booking flow */
export type BookingStep = 'select-time' | 'details' | 'confirm';

/** Client-side booking state for the streamlined flow */
export interface BookingFlowState {
  step: BookingStep;
  game_id: number;
  game_name: string;
  /** Selected date in YYYY-MM-DD */
  selected_date?: string;
  /** Selected timeslot */
  selected_timeslot?: Timeslot;
  /** Group size */
  group_size?: number;
  /** Customer details */
  customer?: {
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
  };
  /** Calculated price */
  total_price?: number;
}

// ---------------------------------------------------------------------------
// Gift Card Purchase Types (Application-Level)
// ---------------------------------------------------------------------------

/** Client-side gift card purchase request */
export interface GiftCardPurchaseRequest {
  amount: number;
  recipient_email: string;
  recipient_name: string;
  sender_name: string;
  message?: string;
  purchaser_email: string;
}

/** Gift card balance check response */
export interface GiftCardBalanceResponse {
  code: string;
  balance: number;
  status: 'active' | 'redeemed' | 'expired';
  expiration_date?: string;
}

// ---------------------------------------------------------------------------
// Error Response
// ---------------------------------------------------------------------------

/** Standard error shape returned by our Next.js API routes */
export interface OTCErrorResponse {
  error: string;
  message?: string;
  status?: number;
}
