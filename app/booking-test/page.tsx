import { Metadata } from 'next';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { fetchBookings } from '@/lib/otc-api-client';
import type { OTCBooking } from '@/types/otc-api';
import BookingTestClient from '@/components/BookingTestClient';

export const metadata: Metadata = {
  title: 'Booking Test | Lock & Lore (Internal)',
  description: 'Internal testing page for verifying OTC booking data.',
  robots: 'noindex, nofollow',
};

// Disable caching on this page -- always fetch fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

async function fetchAllBookings() {
  const now = new Date();
  const pastDate = new Date(now);
  pastDate.setDate(pastDate.getDate() - 180);
  const futureDate = new Date(now);
  futureDate.setDate(futureDate.getDate() + 180);

  const formatDate = (d: Date): string => d.toISOString().split('T')[0];

  // Paginate through all results
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

  // Filter to real bookings
  const realBookings = allBookings.filter(isRealBooking);

  // Sort by date descending, then by start_time descending
  realBookings.sort((a, b) => {
    const dateCompare = b.booking_date.localeCompare(a.booking_date);
    if (dateCompare !== 0) return dateCompare;
    return b.start_time.localeCompare(a.start_time);
  });

  return {
    bookings: realBookings,
    total_fetched: allBookings.length,
    total_real: realBookings.length,
    fetched_at: new Date().toISOString(),
    date_range: {
      start: formatDate(pastDate),
      end: formatDate(futureDate),
    },
  };
}

export default async function BookingTestPage() {
  let initialData = null;
  let initialError: string | null = null;

  try {
    initialData = await fetchAllBookings();
  } catch (error) {
    console.error('[BookingTestPage] Failed to fetch bookings:', error);
    initialError = error instanceof Error ? error.message : 'Failed to fetch bookings from OTC API.';
  }

  return (
    <main className="min-h-screen font-sans selection:bg-primary selection:text-neutral-950 bg-black">
      <Navbar />

      {/* Page Header */}
      <section className="pt-28 pb-10 bg-black relative overflow-hidden">
        {/* Subtle background texture */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(197,151,62,0.08)_0%,_transparent_70%)]" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              Internal Testing
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-white mb-4">
            Booking <span className="text-primary">Verification</span>
          </h1>
          <p className="max-w-2xl text-neutral-400 text-base leading-relaxed">
            Live view of all real customer bookings from the OTC API. Schedule-generated empty
            slots are filtered out. Use this page to verify that the booking flow is creating
            successful entries in the OTC console.
          </p>
        </div>
      </section>

      <BookingTestClient initialData={initialData} initialError={initialError} />

      <Footer />
    </main>
  );
}
