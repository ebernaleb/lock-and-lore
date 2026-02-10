/**
 * @deprecated Debug/test endpoint. Should be removed before production deployment.
 * Was used during development of the custom booking flow which has been replaced
 * by the OTC iframe embed (OTCBookingEmbed.tsx).
 *
 * API route for the booking test page.
 *
 * Fetches ALL bookings from the OTC API (no caching) and returns
 * only real bookings (not schedule-generated empty slots).
 *
 * This endpoint exists so the client-side refresh button can fetch
 * fresh data without a full page reload.
 */

import { NextResponse } from 'next/server';
import { fetchBookings } from '@/lib/otc-api-client';
import type { OTCBooking } from '@/types/otc-api';

/**
 * Determines if a booking is a "real" completed booking (not a schedule-generated empty slot).
 *
 * A booking is only considered real if ALL of these criteria are met:
 * 1. Has actual customer data (customer name, email, or phone)
 * 2. Has either a transaction_id or customer_id
 * 3. Status is NOT an empty-slot status ("available", "expired", "call_to_book")
 * 4. group_size > 0
 */
function isRealBooking(booking: OTCBooking): boolean {
  const status = booking.status?.toLowerCase().trim();

  // --- Criterion 3: Reject empty-slot statuses outright ---
  const emptySlotStatuses = ['available', 'expired', 'call_to_book'];
  if (status && emptySlotStatuses.includes(status)) {
    return false;
  }

  // --- Criterion 4: Must have at least 1 person in the group ---
  if (!booking.group_size || booking.group_size <= 0) {
    return false;
  }

  // --- Criterion 2: Must have a transaction_id or customer_id ---
  if (!booking.transaction_id && !booking.customer_id) {
    return false;
  }

  // --- Criterion 1: Must have actual customer contact info ---
  const hasCustomerName = !!(
    (booking.customer_first_name && booking.customer_first_name.trim()) ||
    (booking.customer_last_name && booking.customer_last_name.trim())
  );
  const hasCustomerEmail = !!(booking.customer_email && booking.customer_email.trim());
  const hasCustomerPhone = !!(booking.customer_phone && booking.customer_phone.trim());

  if (!hasCustomerName && !hasCustomerEmail && !hasCustomerPhone) {
    return false;
  }

  return true;
}

export async function GET() {
  try {
    // Fetch a wide date range to capture all bookings.
    // Use a 365-day window (max allowed by OTC API) centered around today.
    const now = new Date();
    const pastDate = new Date(now);
    pastDate.setDate(pastDate.getDate() - 180);
    const futureDate = new Date(now);
    futureDate.setDate(futureDate.getDate() + 180);

    const formatDate = (d: Date): string => d.toISOString().split('T')[0];

    // Paginate through all results. OTC API max is 100 per request.
    let allBookings: OTCBooking[] = [];
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const response = await fetchBookings({
        start_date: formatDate(pastDate),
        end_date: formatDate(futureDate),
        limit: 100,
        offset,
        sort_by: 'booking_date',
        sort_order: 'desc',
      });

      allBookings = allBookings.concat(response.bookings);
      hasMore = response.pagination.has_more;
      offset += response.bookings.length;

      // Safety: prevent infinite loops
      if (offset > 10000) break;
    }

    // Filter to real bookings only
    const realBookings = allBookings.filter(isRealBooking);

    // Sort by date descending, then by start_time descending
    realBookings.sort((a, b) => {
      const dateCompare = b.booking_date.localeCompare(a.booking_date);
      if (dateCompare !== 0) return dateCompare;
      return b.start_time.localeCompare(a.start_time);
    });

    return NextResponse.json({
      bookings: realBookings,
      total_fetched: allBookings.length,
      total_real: realBookings.length,
      fetched_at: new Date().toISOString(),
      date_range: {
        start: formatDate(pastDate),
        end: formatDate(futureDate),
      },
    });
  } catch (error) {
    console.error('[booking-test API] Failed to fetch bookings:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch bookings from OTC API',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
