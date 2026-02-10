'use client';

import { useState, useCallback } from 'react';
import type { OTCBooking } from '@/types/otc-api';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface BookingTestData {
  bookings: OTCBooking[];
  total_fetched: number;
  total_real: number;
  fetched_at: string;
  date_range: {
    start: string;
    end: string;
  };
}

interface BookingTestClientProps {
  initialData: BookingTestData | null;
  initialError: string | null;
}

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

function formatDateTime(date: string, time: string): string {
  // Format date as "Mon, Feb 6, 2026"
  try {
    const d = new Date(date + 'T00:00:00');
    const formatted = d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    // Normalize time: strip seconds if present
    const timeParts = time.split(':');
    const displayTime = `${timeParts[0]}:${timeParts[1]}`;
    return `${formatted} at ${displayTime}`;
  } catch {
    return `${date} at ${time}`;
  }
}

function normalizeTime(time: string): string {
  const parts = time.split(':');
  return `${parts[0]}:${parts[1]}`;
}

function getStatusBadgeClasses(status: string | undefined): string {
  const s = status?.toLowerCase().trim();
  switch (s) {
    case 'confirmed':
      return 'bg-green-500/20 text-green-400 border border-green-500/30';
    case 'pending':
      return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
    case 'checked_in':
    case 'in_progress':
      return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    case 'completed':
      return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    case 'cancelled':
    case 'canceled':
    case 'no_show':
    case 'refunded':
      return 'bg-red-500/20 text-red-400 border border-red-500/30';
    case '1':
      return 'bg-primary/20 text-primary border border-primary/30';
    default:
      return 'bg-neutral-700/50 text-neutral-300 border border-neutral-600/50';
  }
}

function getStatusLabel(status: string | undefined): string {
  const s = status?.toLowerCase().trim();
  switch (s) {
    case '1':
      return 'Active (status=1)';
    case 'confirmed':
      return 'Confirmed';
    case 'pending':
      return 'Pending';
    case 'checked_in':
      return 'Checked In';
    case 'in_progress':
      return 'In Progress';
    case 'completed':
      return 'Completed';
    case 'cancelled':
    case 'canceled':
      return 'Cancelled';
    case 'no_show':
      return 'No Show';
    case 'refunded':
      return 'Refunded';
    case 'available':
      return 'Available (modified)';
    default:
      return status || 'Unknown';
  }
}

// ---------------------------------------------------------------------------
// BookingCard Component
// ---------------------------------------------------------------------------

function BookingCard({ booking, index }: { booking: OTCBooking; index: number }) {
  const [expanded, setExpanded] = useState(false);

  const customerName = [booking.customer_first_name, booking.customer_last_name]
    .filter(Boolean)
    .join(' ') || null;

  const gameName = booking.game_name || booking.game?.name || `Game #${booking.game_id}`;

  return (
    <div
      className="bg-neutral-900 border border-neutral-700 rounded-lg overflow-hidden animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Card Header */}
      <div className="px-5 py-4 border-b border-neutral-800">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-white font-semibold text-lg truncate">
                {gameName}
              </h3>
              <span className={`text-xs px-2.5 py-0.5 rounded-full whitespace-nowrap font-medium ${getStatusBadgeClasses(booking.status)}`}>
                {getStatusLabel(booking.status)}
              </span>
            </div>
            <p className="text-neutral-400 text-sm">
              {formatDateTime(booking.booking_date, booking.start_time)}
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-neutral-500 text-xs font-mono">
              ID: {booking.id}
            </span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="px-5 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
          {/* Customer Info */}
          <div>
            <dt className="text-neutral-500 text-xs uppercase tracking-wider mb-1">Customer</dt>
            <dd className="text-white text-sm">
              {customerName || <span className="text-neutral-600 italic">No customer data</span>}
            </dd>
          </div>

          <div>
            <dt className="text-neutral-500 text-xs uppercase tracking-wider mb-1">Email</dt>
            <dd className="text-white text-sm break-all">
              {booking.customer_email || <span className="text-neutral-600 italic">N/A</span>}
            </dd>
          </div>

          <div>
            <dt className="text-neutral-500 text-xs uppercase tracking-wider mb-1">Phone</dt>
            <dd className="text-white text-sm">
              {booking.customer_phone || <span className="text-neutral-600 italic">N/A</span>}
            </dd>
          </div>

          {/* Booking Details */}
          <div>
            <dt className="text-neutral-500 text-xs uppercase tracking-wider mb-1">Time Slot</dt>
            <dd className="text-white text-sm font-mono">
              {normalizeTime(booking.start_time)} - {normalizeTime(booking.end_time)}
            </dd>
          </div>

          <div>
            <dt className="text-neutral-500 text-xs uppercase tracking-wider mb-1">Group Size</dt>
            <dd className="text-white text-sm">
              {booking.group_size > 0 ? (
                <span>{booking.group_size} {booking.group_size === 1 ? 'player' : 'players'}</span>
              ) : (
                <span className="text-neutral-600 italic">Not specified</span>
              )}
            </dd>
          </div>

          <div>
            <dt className="text-neutral-500 text-xs uppercase tracking-wider mb-1">Price</dt>
            <dd className="text-white text-sm">
              {booking.price > 0 ? (
                <span>${booking.price.toFixed(2)}</span>
              ) : (
                <span className="text-neutral-600 italic">$0.00</span>
              )}
              {booking.total !== undefined && booking.total > 0 && booking.total !== booking.price && (
                <span className="text-neutral-500 ml-1">(total: ${booking.total.toFixed(2)})</span>
              )}
            </dd>
          </div>

          {/* IDs */}
          <div>
            <dt className="text-neutral-500 text-xs uppercase tracking-wider mb-1">Transaction ID</dt>
            <dd className="text-sm font-mono">
              {booking.transaction_id ? (
                <span className="text-primary">{booking.transaction_id}</span>
              ) : (
                <span className="text-neutral-600 italic">None</span>
              )}
            </dd>
          </div>

          <div>
            <dt className="text-neutral-500 text-xs uppercase tracking-wider mb-1">Order Number</dt>
            <dd className="text-sm font-mono">
              {booking.order_number ? (
                <span className="text-primary">{booking.order_number}</span>
              ) : (
                <span className="text-neutral-600 italic">None</span>
              )}
            </dd>
          </div>

          <div>
            <dt className="text-neutral-500 text-xs uppercase tracking-wider mb-1">Customer ID</dt>
            <dd className="text-sm font-mono">
              {booking.customer_id ? (
                <span className="text-white">{booking.customer_id}</span>
              ) : (
                <span className="text-neutral-600 italic">None</span>
              )}
            </dd>
          </div>

          {/* Additional Info */}
          <div>
            <dt className="text-neutral-500 text-xs uppercase tracking-wider mb-1">Game ID</dt>
            <dd className="text-white text-sm font-mono">{booking.game_id || 'N/A'}</dd>
          </div>

          <div>
            <dt className="text-neutral-500 text-xs uppercase tracking-wider mb-1">Created At</dt>
            <dd className="text-white text-sm">
              {booking.created_at ? (
                new Date(booking.created_at).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              ) : (
                <span className="text-neutral-600 italic">N/A</span>
              )}
            </dd>
          </div>

          {booking.description && (
            <div>
              <dt className="text-neutral-500 text-xs uppercase tracking-wider mb-1">Description</dt>
              <dd className="text-white text-sm">{booking.description}</dd>
            </div>
          )}
        </div>
      </div>

      {/* Raw JSON Toggle */}
      <div className="border-t border-neutral-800">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full px-5 py-3 text-left text-sm text-neutral-400 hover:text-white hover:bg-neutral-800/50 transition-colors flex items-center gap-2"
        >
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          {expanded ? 'Hide' : 'Show'} Raw JSON
        </button>
        {expanded && (
          <div className="px-5 pb-4">
            <pre className="bg-black border border-neutral-800 rounded-md p-4 text-xs text-neutral-300 overflow-x-auto max-h-96 font-mono leading-relaxed">
              {JSON.stringify(booking, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Client Component
// ---------------------------------------------------------------------------

export default function BookingTestClient({ initialData, initialError }: BookingTestClientProps) {
  const [data, setData] = useState<BookingTestData | null>(initialData);
  const [error, setError] = useState<string | null>(initialError);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/booking-test', { cache: 'no-store' });
      if (!response.ok) {
        const errBody = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errBody.message || errBody.error || `HTTP ${response.status}`);
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter bookings by status
  const filteredBookings = data?.bookings.filter((b) => {
    if (filter === 'all') return true;
    const status = b.status?.toLowerCase().trim();
    if (filter === 'active') return status === '1' || status === 'confirmed' || status === 'pending';
    if (filter === 'completed') return status === 'completed';
    if (filter === 'cancelled') return status === 'cancelled' || status === 'canceled' || status === 'no_show' || status === 'refunded';
    if (filter === 'with-customer') return !!b.customer_id || !!b.customer_email;
    if (filter === 'with-transaction') return !!b.transaction_id;
    return true;
  }) || [];

  // Count bookings by status for the filter pills
  const statusCounts = {
    all: data?.bookings.length || 0,
    active: data?.bookings.filter((b) => {
      const s = b.status?.toLowerCase().trim();
      return s === '1' || s === 'confirmed' || s === 'pending';
    }).length || 0,
    completed: data?.bookings.filter((b) => b.status?.toLowerCase().trim() === 'completed').length || 0,
    cancelled: data?.bookings.filter((b) => {
      const s = b.status?.toLowerCase().trim();
      return s === 'cancelled' || s === 'canceled' || s === 'no_show' || s === 'refunded';
    }).length || 0,
    'with-customer': data?.bookings.filter((b) => !!b.customer_id || !!b.customer_email).length || 0,
    'with-transaction': data?.bookings.filter((b) => !!b.transaction_id).length || 0,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      {/* Stats Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          {data && (
            <>
              <div className="bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2">
                <span className="text-neutral-400">Real Bookings: </span>
                <span className="text-white font-semibold">{data.total_real}</span>
              </div>
              <div className="bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2">
                <span className="text-neutral-400">Total Fetched: </span>
                <span className="text-white font-semibold">{data.total_fetched}</span>
              </div>
              <div className="bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2">
                <span className="text-neutral-400">Date Range: </span>
                <span className="text-white font-mono text-xs">{data.date_range.start} to {data.date_range.end}</span>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {data && (
            <span className="text-neutral-500 text-xs">
              Last fetched: {new Date(data.fetched_at).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </span>
          )}
          <button
            onClick={refresh}
            disabled={loading}
            className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
              transition-colors duration-200
              ${loading
                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                : 'bg-primary text-black hover:bg-primary-dark'
              }
            `}
          >
            <svg
              className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Filter Pills */}
      {data && data.bookings.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {([
            ['all', 'All'],
            ['active', 'Active / Confirmed'],
            ['completed', 'Completed'],
            ['cancelled', 'Cancelled'],
            ['with-customer', 'Has Customer'],
            ['with-transaction', 'Has Transaction'],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`
                px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-200
                ${filter === key
                  ? 'bg-primary text-black'
                  : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
                }
              `}
            >
              {label} ({statusCounts[key]})
            </button>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-red-400 font-semibold mb-1">Failed to load bookings</h3>
              <p className="text-red-300/80 text-sm">{error}</p>
              <button
                onClick={refresh}
                className="mt-3 text-sm text-red-400 hover:text-red-300 underline underline-offset-2"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && !data && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-2 border-neutral-700 border-t-primary rounded-full animate-spin mb-4" />
          <p className="text-neutral-400 text-sm">Loading bookings from OTC API...</p>
        </div>
      )}

      {/* Empty State */}
      {data && filteredBookings.length === 0 && (
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-12 text-center">
          <svg className="w-12 h-12 text-neutral-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-white font-semibold text-lg mb-2">
            {filter === 'all' ? 'No bookings found' : 'No bookings match this filter'}
          </h3>
          <p className="text-neutral-400 text-sm max-w-md mx-auto">
            {filter === 'all'
              ? 'There are no real customer bookings in the OTC system for the queried date range. Schedule-generated empty slots have been filtered out.'
              : 'Try selecting a different filter to see other bookings.'
            }
          </p>
        </div>
      )}

      {/* Booking Cards */}
      {filteredBookings.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-neutral-400 text-sm">
              Showing {filteredBookings.length} of {data?.total_real} booking{(data?.total_real || 0) !== 1 ? 's' : ''}
            </p>
          </div>
          {filteredBookings.map((booking, index) => (
            <BookingCard key={booking.id} booking={booking} index={index} />
          ))}
        </div>
      )}

      {/* Loading overlay when refreshing with existing data */}
      {loading && data && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-8 flex flex-col items-center gap-4 shadow-2xl">
            <div className="w-10 h-10 border-2 border-neutral-700 border-t-primary rounded-full animate-spin" />
            <p className="text-white font-medium">Refreshing bookings...</p>
            <p className="text-neutral-400 text-sm">Fetching latest data from OTC API</p>
          </div>
        </div>
      )}
    </div>
  );
}
