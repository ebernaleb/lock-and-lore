import { Metadata } from 'next';
import BookingLayout from '@/components/booking/BookingLayout';
import OTCBookingEmbed from '@/components/booking/OTCBookingEmbed';

export const metadata: Metadata = {
  title: 'Book Your Escape | Lock & Lore Escape Rooms',
  description:
    'Reserve your escape room adventure at Lock & Lore. Choose your room, select a time, and book online.',
  robots: { index: true, follow: true },
};

/**
 * /book -- General booking page.
 *
 * Embeds the OTC hosted booking flow which handles room selection,
 * date/time picking, customer details, and payment.
 */
export default function BookPage() {
  return (
    <BookingLayout>
      <div className="w-full">
        {/* OTC Booking iframe */}
        <OTCBookingEmbed />
      </div>
    </BookingLayout>
  );
}
