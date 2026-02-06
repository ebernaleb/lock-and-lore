import { NextResponse } from 'next/server';
import { fetchGiftCards } from '@/lib/otc-api-client';
import { cache, giftCardCacheKey, CACHE_TTL } from '@/lib/cache';
import type {
  GiftCardBalanceResponse,
  OTCErrorResponse,
  OTCGiftCard,
} from '@/types/otc-api';

/**
 * GET /api/gift-cards/balance
 *
 * Check the balance and status of a gift card by its code.
 *
 * Query Parameters:
 *   code (string, required) - Gift card code (e.g., "GC-ABC123")
 *
 * Response:
 *   200 with balance info if the card exists
 *   400 for missing/invalid code
 *   404 if the card is not found
 *
 * Note: The OTC API does not have a dedicated "lookup by code" endpoint.
 * This implementation fetches gift cards and filters by code. If the OTC
 * API adds a code-based lookup later, this should be updated to use it
 * for better performance.
 *
 * Caching:
 *   30-second server-side cache per gift card code
 *   No CDN caching (balance data should be fresh)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code || code.trim().length === 0) {
      const body: OTCErrorResponse = {
        error: 'Missing gift card code',
        message: 'A code query parameter is required.',
        status: 400,
      };
      return NextResponse.json(body, { status: 400 });
    }

    const normalizedCode = code.trim().toUpperCase();

    // Check cache first
    const cacheKey = giftCardCacheKey(normalizedCode);
    const cachedBalance = cache.get<GiftCardBalanceResponse>(cacheKey);
    if (cachedBalance) {
      return NextResponse.json(cachedBalance, {
        headers: {
          'Cache-Control': 'private, no-store',
        },
      });
    }

    // The OTC API does not have a direct lookup-by-code endpoint.
    // We fetch active gift cards and search for a match. This is a
    // known limitation -- if the business has many gift cards, we may
    // need pagination. For now, we fetch 100 and search.
    //
    // Possible improvement: Cache a code-to-id mapping and use
    // fetchGiftCardById once the ID is known.
    let matchingCard: OTCGiftCard | undefined;

    // Try active cards first (most likely status for a balance check)
    for (const status of ['active', 'redeemed', 'expired'] as const) {
      try {
        const response = await fetchGiftCards({
          status,
          limit: 100,
        });

        matchingCard = response.gift_cards.find(
          (gc) => gc.code.toUpperCase() === normalizedCode
        );

        if (matchingCard) break;
      } catch (error) {
        // If one status query fails, continue with the next
        console.warn(
          `[/api/gift-cards/balance] Failed to search ${status} gift cards:`,
          error
        );
      }
    }

    if (!matchingCard) {
      const body: OTCErrorResponse = {
        error: 'Gift card not found',
        message:
          'No gift card was found with that code. Please check the code and try again.',
        status: 404,
      };
      return NextResponse.json(body, { status: 404 });
    }

    const balanceResponse: GiftCardBalanceResponse = {
      code: matchingCard.code,
      balance: matchingCard.balance,
      status: matchingCard.status,
      expiration_date: matchingCard.expiration_date,
    };

    // Cache for a short period
    cache.set(cacheKey, balanceResponse, CACHE_TTL.GIFT_CARD);

    return NextResponse.json(balanceResponse, {
      headers: {
        // No CDN caching for balance data -- must be fresh
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error occurred';

    let status = 502;
    let clientError = 'Failed to check gift card balance';

    if (message.includes('not configured')) {
      status = 500;
      clientError = 'Server configuration error';
    } else if (message.includes('timed out')) {
      status = 504;
      clientError = 'Provider did not respond in time';
    }

    console.error(`[/api/gift-cards/balance] ${status} - ${message}`);

    const body: OTCErrorResponse = {
      error: clientError,
      status,
    };

    return NextResponse.json(body, { status });
  }
}
