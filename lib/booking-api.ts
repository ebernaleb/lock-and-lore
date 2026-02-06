export interface TimeSlot {
  /** OTC booking slot ID -- needed to create transactions against this slot */
  booking_slot_id?: number;
  start_time: string;
  end_time: string;
  available: boolean;
  price?: number;
}

export interface AvailabilityResponse {
  date: string;
  timeslots: TimeSlot[];
}

/**
 * Raw response shape from our /api/availability/[gameId] endpoint.
 * Timeslots are nested inside the `availability` object.
 */
interface ApiAvailabilityResponse {
  availability: {
    game_id: number;
    game_name: string;
    date: string;
    timeslots: TimeSlot[];
    total_slots: number;
    available_slots: number;
  };
  urgency_message?: string;
  fetched_at: string;
}

export interface BookingRequest {
  game_id: number;
  booking_date: string;
  start_time: string;
  end_time: string;
  group_size: number;
  customer_email: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_phone?: string;
  /** OTC booking slot ID -- when provided, the existing schedule-generated slot
   *  is used instead of creating a new one via POST /bookings */
  booking_slot_id?: number;
}

export interface BookingResponse {
  booking: {
    id: number;
    booking_date?: string;
    start_time?: string;
    end_time?: string;
    group_size?: number;
    status?: string;
    game_id?: number;
    game_name?: string;
    order_number?: string;
    [key: string]: unknown;
  } | null;
  transaction: {
    id: number;
    order_number: string;
    total: number;
    due: number;
    status: string;
    url_hash?: string;
    [key: string]: unknown;
  } | null;
  /** Primary confirmation number (from transaction order_number or LL-{slotId}) */
  confirmation_number?: string;
  message?: string;
  /** Present when booking was confirmed via fallback strategy */
  note?: string;
  /** Present when booking succeeded but transaction creation failed (legacy) */
  warning?: string;
}

export async function fetchAvailability(
  gameId: number,
  date: string
): Promise<AvailabilityResponse> {
  const response = await fetch(`/api/availability/${gameId}?date=${date}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to fetch availability' }));
    throw new Error(error.error || 'Failed to fetch availability');
  }

  const data: ApiAvailabilityResponse = await response.json();

  // The API nests timeslots inside availability -- flatten for the component
  return {
    date: data.availability.date,
    timeslots: data.availability.timeslots,
  };
}

export async function createBooking(
  bookingData: BookingRequest
): Promise<BookingResponse> {
  const response = await fetch('/api/book', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookingData),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to create booking' }));
    throw new Error(error.error || 'Failed to create booking');
  }

  return response.json();
}
