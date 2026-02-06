import { NextResponse } from 'next/server';
import {
  fetchGiftCards,
  createTransaction,
  fetchGamesCached,
} from '@/lib/otc-api-client';
import type { OTCErrorResponse } from '@/types/otc-api';

/**
 * GET /api/gift-cards
 *
 * Returns a list of gift cards. In a public-facing context, this endpoint
 * should be restricted or filtered to only show relevant data. Currently
 * it returns active gift cards for verification/balance check purposes.
 *
 * Query Parameters:
 *   status  (string, optional) - "active", "redeemed", "expired"
 *   limit   (number, optional) - Max results (1-100)
 *   offset  (number, optional) - Pagination offset
 *
 * Caching:
 *   1-minute CDN cache with 2-minute stale-while-revalidate
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const status = searchParams.get('status');
    const rawLimit = searchParams.get('limit');
    const rawOffset = searchParams.get('offset');

    const params: Record<string, unknown> = {};

    if (
      status &&
      (status === 'active' || status === 'redeemed' || status === 'expired')
    ) {
      params.status = status;
    }

    if (rawLimit !== null) {
      const parsed = parseInt(rawLimit, 10);
      if (!isNaN(parsed) && parsed >= 1) {
        params.limit = Math.min(100, parsed);
      }
    }

    if (rawOffset !== null) {
      const parsed = parseInt(rawOffset, 10);
      if (!isNaN(parsed) && parsed >= 0) {
        params.offset = parsed;
      }
    }

    const data = await fetchGiftCards(
      params as {
        status?: 'active' | 'redeemed' | 'expired';
        limit?: number;
        offset?: number;
      }
    );

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error occurred';

    let httpStatus = 502;
    let clientError = 'Failed to fetch gift cards';

    if (message.includes('not configured')) {
      httpStatus = 500;
      clientError = 'Server configuration error';
    } else if (message.includes('timed out')) {
      httpStatus = 504;
      clientError = 'Provider did not respond in time';
    }

    console.error(`[/api/gift-cards GET] ${httpStatus} - ${message}`);

    const body: OTCErrorResponse = {
      error: clientError,
      status: httpStatus,
    };

    return NextResponse.json(body, { status: httpStatus });
  }
}

/**
 * POST /api/gift-cards
 *
 * Purchases a new gift card by creating a transaction in the OTC system
 * with a gift card line item. The OTC API handles gift card code generation,
 * activation, and delivery.
 *
 * Request Body:
 *   amount           (number, required) - Gift card value in dollars (25-500)
 *   purchaser_email  (string, required) - Buyer's email
 *   purchaser_name   (string, required) - Buyer's name
 *   recipient_email  (string, optional) - Recipient's email (for e-delivery)
 *   recipient_name   (string, optional) - Recipient's name
 *   message          (string, optional) - Personal message (max 500 chars)
 *
 * Response:
 *   201 on success with transaction details
 *   400 for validation errors
 *   502 for upstream failures
 */
export async function POST(request: Request) {
  try {
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
    const amount = Number(body.amount);
    const purchaserEmail = body.purchaser_email
      ? String(body.purchaser_email).trim().toLowerCase()
      : '';
    const purchaserName = body.purchaser_name
      ? String(body.purchaser_name).trim()
      : '';

    if (!amount || isNaN(amount)) {
      const errorBody: OTCErrorResponse = {
        error: 'Invalid amount',
        message: 'amount is required and must be a number.',
        status: 400,
      };
      return NextResponse.json(errorBody, { status: 400 });
    }

    if (amount < 25 || amount > 500) {
      const errorBody: OTCErrorResponse = {
        error: 'Invalid amount',
        message: 'Gift card amount must be between $25 and $500.',
        status: 400,
      };
      return NextResponse.json(errorBody, { status: 400 });
    }

    if (!purchaserEmail) {
      const errorBody: OTCErrorResponse = {
        error: 'Missing purchaser email',
        message: 'purchaser_email is required.',
        status: 400,
      };
      return NextResponse.json(errorBody, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(purchaserEmail)) {
      const errorBody: OTCErrorResponse = {
        error: 'Invalid email',
        message: 'Please provide a valid email address.',
        status: 400,
      };
      return NextResponse.json(errorBody, { status: 400 });
    }

    if (!purchaserName) {
      const errorBody: OTCErrorResponse = {
        error: 'Missing purchaser name',
        message: 'purchaser_name is required.',
        status: 400,
      };
      return NextResponse.json(errorBody, { status: 400 });
    }

    // Optional fields
    const recipientEmail = body.recipient_email
      ? String(body.recipient_email).trim().toLowerCase()
      : undefined;
    const recipientName = body.recipient_name
      ? String(body.recipient_name).trim()
      : undefined;
    let message = body.message ? String(body.message).trim() : undefined;

    if (recipientEmail && !emailRegex.test(recipientEmail)) {
      const errorBody: OTCErrorResponse = {
        error: 'Invalid recipient email',
        message: 'Please provide a valid recipient email address.',
        status: 400,
      };
      return NextResponse.json(errorBody, { status: 400 });
    }

    // Truncate message to 500 characters
    if (message && message.length > 500) {
      message = message.slice(0, 500);
    }

    // We need a company_group_id for the transaction. Fetch games to get it.
    const gamesResponse = await fetchGamesCached({ limit: 1 });
    const companyGroupId = gamesResponse.games[0]?.company_group?.id;

    if (!companyGroupId) {
      const errorBody: OTCErrorResponse = {
        error: 'Configuration error',
        message: 'Unable to determine location for gift card purchase.',
        status: 500,
      };
      return NextResponse.json(errorBody, { status: 500 });
    }

    // Split purchaser name into first/last
    const nameParts = purchaserName.split(/\s+/);
    const firstName = nameParts[0] || purchaserName;
    const lastName = nameParts.slice(1).join(' ') || '';

    // Create transaction with gift card
    const transaction = await createTransaction({
      company_group_id: companyGroupId,
      customer: {
        email: purchaserEmail,
        first_name: firstName,
        last_name: lastName,
      },
      gift_cards: [
        {
          type: 'monetary',
          amount,
          recipient_email: recipientEmail,
          recipient_name: recipientName,
          message,
        },
      ],
    });

    return NextResponse.json(
      {
        transaction,
        message: 'Gift card purchased successfully.',
      },
      { status: 201 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error occurred';

    let httpStatus = 502;
    let clientError = 'Failed to purchase gift card';

    if (message.includes('not configured')) {
      httpStatus = 500;
      clientError = 'Server configuration error';
    } else if (message.includes('timed out')) {
      httpStatus = 504;
      clientError = 'Provider did not respond in time';
    } else if (message.includes('400')) {
      httpStatus = 400;
      clientError = 'Invalid gift card parameters';
    }

    console.error(`[/api/gift-cards POST] ${httpStatus} - ${message}`);

    const body: OTCErrorResponse = {
      error: clientError,
      status: httpStatus,
    };

    return NextResponse.json(body, { status: httpStatus });
  }
}
