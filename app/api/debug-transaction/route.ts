/**
 * @deprecated Debug endpoint. Must be removed before production deployment.
 * Was used during development of the custom booking flow which has been replaced
 * by the OTC iframe embed (OTCBookingEmbed.tsx).
 *
 * DEBUG ENDPOINT - Systematic POST /transactions investigation
 *
 * ROOT CAUSE (diagnosed 2026-02-07):
 *   POST /transactions returns 500 because NO pricing categories are
 *   configured in OTC Console. GET /games/{id}?include_pricing=true
 *   returns the same 500 with "Database error occurred". The transaction
 *   endpoint internally performs a pricing calculation that crashes
 *   when pricing_categories is empty.
 *
 *   FIX: Configure pricing categories in OTC Console (Games > Settings > Pricing).
 *   After fixing, rerun this endpoint to verify POST /transactions works.
 *
 * This endpoint tests POST /transactions with various payloads and captures
 * the FULL error response body (bypassing the otcFetch wrapper).
 *
 * GET  /api/debug-transaction               - Run all test cases
 * GET  /api/debug-transaction?test=N         - Run a specific test case (1-based)
 * GET  /api/debug-transaction?custom=BASE64  - Run with a custom payload (base64-encoded JSON)
 *
 * THIS ENDPOINT IS FOR DEBUGGING ONLY. Remove before production deployment.
 */

import { NextResponse } from 'next/server';

const OTC_API_BASE_URL = 'https://connect.offthecouch.io';

function getApiKey(): string {
  const key = process.env.OTC_KEY;
  if (!key) throw new Error('OTC_KEY not configured');
  return key;
}

/**
 * Raw OTC API call that returns the full response details
 * including status, headers, and body -- even on errors.
 */
async function rawOtcCall(
  method: string,
  endpoint: string,
  body?: unknown
): Promise<{
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: unknown;
  rawBody: string;
}> {
  const apiKey = getApiKey();
  const url = `${OTC_API_BASE_URL}${endpoint}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const fetchOptions: RequestInit = {
      method,
      signal: controller.signal,
      headers: {
        'X-API-Key': apiKey,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    };

    if (body !== undefined) {
      fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(url, fetchOptions);

    // Capture ALL response headers
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    // Read raw body text
    const rawBody = await response.text();

    // Try to parse as JSON
    let parsedBody: unknown;
    try {
      parsedBody = JSON.parse(rawBody);
    } catch {
      parsedBody = rawBody;
    }

    return {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      body: parsedBody,
      rawBody,
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

interface TestCase {
  name: string;
  description: string;
  payload: unknown;
}

/**
 * Build an array of test cases to try different payload shapes.
 * The test cases are ordered from simplest to most complex.
 */
async function buildTestCases(): Promise<TestCase[]> {
  // First, get a real available booking slot to use in tests
  let availableSlotId: number | null = null;
  let availableSlotGameId: number | null = null;

  try {
    // Fetch bookings for tomorrow to find a schedule-generated "available" slot
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const bookingsResult = await rawOtcCall(
      'GET',
      `/bookings?start_date=${tomorrowStr}&end_date=${tomorrowStr}&limit=20&sort_by=start_time&sort_order=asc`
    );

    if (bookingsResult.status === 200) {
      const data = bookingsResult.body as any;
      const bookings = data?.bookings || [];
      const available = bookings.find(
        (b: any) => b.status === 'available' && (!b.customer_id || b.customer_id === null)
      );
      if (available) {
        availableSlotId = available.id;
        availableSlotGameId = available.game_id;
      }
    }
  } catch {
    // Non-fatal
  }

  const cases: TestCase[] = [];

  // Test 1: Absolute minimum -- just required fields, no bookings
  cases.push({
    name: 'Minimum required fields only',
    description: 'company_group_id + customer.email -- no bookings, no extras',
    payload: {
      company_group_id: 649,
      customer: {
        email: 'test-transaction@lockandlore.com',
      },
    },
  });

  // Test 2: Required fields + customer name
  cases.push({
    name: 'Required + customer name',
    description: 'Add first_name and last_name to customer',
    payload: {
      company_group_id: 649,
      customer: {
        email: 'test-transaction@lockandlore.com',
        first_name: 'Test',
        last_name: 'Customer',
      },
    },
  });

  // Test 3: Required fields + empty bookings array
  cases.push({
    name: 'Required + empty bookings array',
    description: 'Explicitly pass bookings: []',
    payload: {
      company_group_id: 649,
      customer: {
        email: 'test-transaction@lockandlore.com',
        first_name: 'Test',
        last_name: 'Customer',
      },
      bookings: [],
    },
  });

  // Test 4: With a real available booking slot ID
  if (availableSlotId) {
    cases.push({
      name: 'With real available booking slot',
      description: `Using schedule-generated slot #${availableSlotId} (game ${availableSlotGameId})`,
      payload: {
        company_group_id: 649,
        customer: {
          email: 'test-transaction@lockandlore.com',
          first_name: 'Test',
          last_name: 'Customer',
        },
        bookings: [availableSlotId],
      },
    });
  }

  // Test 5: With custom_deposit_enabled = false
  cases.push({
    name: 'With custom_deposit_enabled=false',
    description: 'Explicitly disable custom deposit',
    payload: {
      company_group_id: 649,
      customer: {
        email: 'test-transaction@lockandlore.com',
        first_name: 'Test',
        last_name: 'Customer',
      },
      custom_deposit_enabled: false,
    },
  });

  // Test 6: With custom_deposit_enabled = true + amount
  cases.push({
    name: 'With custom deposit enabled + amount',
    description: 'custom_deposit_enabled=true, custom_deposit_amount=17.00',
    payload: {
      company_group_id: 649,
      customer: {
        email: 'test-transaction@lockandlore.com',
        first_name: 'Test',
        last_name: 'Customer',
      },
      custom_deposit_enabled: true,
      custom_deposit_amount: 17.0,
    },
  });

  // Test 7: With full customer object including address
  cases.push({
    name: 'Full customer object with address',
    description: 'Include phone, address, city, state, zip, country',
    payload: {
      company_group_id: 649,
      customer: {
        email: 'test-transaction@lockandlore.com',
        first_name: 'Test',
        last_name: 'Customer',
        phone: '555-123-4567',
        address: '123 Test St',
        city: 'Testville',
        state: 'CA',
        zip: '90210',
        country: 'US',
      },
    },
  });

  // Test 8: With booking slot + deposit
  if (availableSlotId) {
    cases.push({
      name: 'Booking slot + custom deposit',
      description: `Slot #${availableSlotId} + custom_deposit_enabled=true + amount`,
      payload: {
        company_group_id: 649,
        customer: {
          email: 'test-transaction@lockandlore.com',
          first_name: 'Test',
          last_name: 'Customer',
          phone: '555-123-4567',
        },
        bookings: [availableSlotId],
        custom_deposit_enabled: true,
        custom_deposit_amount: 17.0,
      },
    });
  }

  // Test 9: With gift_cards (empty array)
  cases.push({
    name: 'With empty gift_cards array',
    description: 'Explicitly pass gift_cards: []',
    payload: {
      company_group_id: 649,
      customer: {
        email: 'test-transaction@lockandlore.com',
        first_name: 'Test',
        last_name: 'Customer',
      },
      gift_cards: [],
    },
  });

  // Test 10: With a gift card purchase (no booking)
  cases.push({
    name: 'Gift card purchase only',
    description: 'Transaction with only a gift card, no bookings',
    payload: {
      company_group_id: 649,
      customer: {
        email: 'test-transaction@lockandlore.com',
        first_name: 'Test',
        last_name: 'Customer',
      },
      gift_cards: [
        {
          type: 'monetary',
          amount: 25.0,
          recipient_email: 'recipient@test.com',
          recipient_name: 'Gift Recipient',
        },
      ],
    },
  });

  // Test 11: With items array (empty)
  cases.push({
    name: 'With empty items array',
    description: 'Explicitly pass items: []',
    payload: {
      company_group_id: 649,
      customer: {
        email: 'test-transaction@lockandlore.com',
        first_name: 'Test',
        last_name: 'Customer',
      },
      items: [],
    },
  });

  // Test 12: With custom_fields array (empty)
  cases.push({
    name: 'With empty custom_fields array',
    description: 'Explicitly pass custom_fields: []',
    payload: {
      company_group_id: 649,
      customer: {
        email: 'test-transaction@lockandlore.com',
        first_name: 'Test',
        last_name: 'Customer',
      },
      custom_fields: [],
    },
  });

  // Test 13: All optional arrays empty
  cases.push({
    name: 'All optional arrays empty',
    description: 'bookings: [], gift_cards: [], items: [], custom_fields: []',
    payload: {
      company_group_id: 649,
      customer: {
        email: 'test-transaction@lockandlore.com',
        first_name: 'Test',
        last_name: 'Customer',
      },
      bookings: [],
      gift_cards: [],
      items: [],
      custom_fields: [],
    },
  });

  // Test 14: Integer booleans instead of true/false
  cases.push({
    name: 'Integer booleans (1/0)',
    description: 'Use 1 instead of true, 0 instead of false',
    payload: {
      company_group_id: 649,
      customer: {
        email: 'test-transaction@lockandlore.com',
        first_name: 'Test',
        last_name: 'Customer',
      },
      custom_deposit_enabled: 1,
      custom_deposit_amount: 17.0,
    },
  });

  // Test 15: String amounts instead of numbers
  cases.push({
    name: 'String amount for deposit',
    description: 'custom_deposit_amount as string "17.00"',
    payload: {
      company_group_id: 649,
      customer: {
        email: 'test-transaction@lockandlore.com',
        first_name: 'Test',
        last_name: 'Customer',
      },
      custom_deposit_enabled: true,
      custom_deposit_amount: '17.00',
    },
  });

  // Test 16: Different gift card type values
  cases.push({
    name: 'Gift card with type "gift_card"',
    description: 'Try type: "gift_card" instead of "monetary"',
    payload: {
      company_group_id: 649,
      customer: {
        email: 'test-transaction@lockandlore.com',
        first_name: 'Test',
        last_name: 'Customer',
      },
      gift_cards: [
        {
          type: 'gift_card',
          amount: 25.0,
        },
      ],
    },
  });

  // Test 17: Booking slot in a different format -- as objects instead of IDs
  if (availableSlotId) {
    cases.push({
      name: 'Booking as object instead of ID',
      description: 'bookings: [{id: slotId}] instead of bookings: [slotId]',
      payload: {
        company_group_id: 649,
        customer: {
          email: 'test-transaction@lockandlore.com',
          first_name: 'Test',
          last_name: 'Customer',
        },
        bookings: [{ id: availableSlotId }],
      },
    });

    // Test 18: Bookings as "booking_ids" parameter name
    cases.push({
      name: 'Parameter name "booking_ids" instead of "bookings"',
      description: 'Try booking_ids: [slotId]',
      payload: {
        company_group_id: 649,
        customer: {
          email: 'test-transaction@lockandlore.com',
          first_name: 'Test',
          last_name: 'Customer',
        },
        booking_ids: [availableSlotId],
      },
    });

    // Test 19: Parameter name "booking_slot_ids"
    cases.push({
      name: 'Parameter name "booking_slot_ids"',
      description: 'Try booking_slot_ids: [slotId]',
      payload: {
        company_group_id: 649,
        customer: {
          email: 'test-transaction@lockandlore.com',
          first_name: 'Test',
          last_name: 'Customer',
        },
        booking_slot_ids: [availableSlotId],
      },
    });
  }

  // Test 20: Customer with existing ID (from waiver-created customer)
  cases.push({
    name: 'Customer with explicit ID',
    description: 'Include customer.id in the payload',
    payload: {
      company_group_id: 649,
      customer: {
        id: 821,
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
      },
    },
  });

  // Test 21: With "source" field (some APIs require this)
  cases.push({
    name: 'With source field',
    description: 'Add source: "api" or "website"',
    payload: {
      company_group_id: 649,
      customer: {
        email: 'test-transaction@lockandlore.com',
        first_name: 'Test',
        last_name: 'Customer',
      },
      source: 'api',
    },
  });

  // Test 22: With "source": "website"
  cases.push({
    name: 'With source: website',
    description: 'Add source: "website"',
    payload: {
      company_group_id: 649,
      customer: {
        email: 'test-transaction@lockandlore.com',
        first_name: 'Test',
        last_name: 'Customer',
      },
      source: 'website',
    },
  });

  // Test 23: With "type" field
  cases.push({
    name: 'With type: "booking"',
    description: 'Add type: "booking"',
    payload: {
      company_group_id: 649,
      customer: {
        email: 'test-transaction@lockandlore.com',
        first_name: 'Test',
        last_name: 'Customer',
      },
      type: 'booking',
    },
  });

  // Test 24: With "status" field
  cases.push({
    name: 'With status: "pending"',
    description: 'Add status: "pending"',
    payload: {
      company_group_id: 649,
      customer: {
        email: 'test-transaction@lockandlore.com',
        first_name: 'Test',
        last_name: 'Customer',
      },
      status: 'pending',
    },
  });

  return cases;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const testNum = url.searchParams.get('test');
  const customPayload = url.searchParams.get('custom');

  try {
    const results: Record<string, unknown> = {
      timestamp: new Date().toISOString(),
      investigation: 'POST /transactions 500 error forensic analysis',
    };

    // Step 0: Verify API connectivity first
    const healthCheck = await rawOtcCall('GET', '/games?limit=1');
    results.api_health = {
      status: healthCheck.status,
      ok: healthCheck.status === 200,
    };

    if (healthCheck.status !== 200) {
      results.error = 'API key or connectivity issue -- cannot proceed';
      return NextResponse.json(results, { status: 502 });
    }

    // Step 1: Check GET /transactions to understand existing data
    const existingTx = await rawOtcCall('GET', '/transactions?limit=5&sort_order=desc');
    results.existing_transactions = {
      status: existingTx.status,
      body: existingTx.body,
    };

    // Step 2: Check what validation errors look like
    const validation1 = await rawOtcCall('POST', '/transactions', {});
    results.validation_empty = {
      description: 'POST /transactions with empty body {}',
      status: validation1.status,
      body: validation1.body,
    };

    const validation2 = await rawOtcCall('POST', '/transactions', {
      company_group_id: 649,
    });
    results.validation_no_customer = {
      description: 'POST /transactions with company_group_id only',
      status: validation2.status,
      body: validation2.body,
    };

    // If custom payload provided, test just that
    if (customPayload) {
      try {
        const decoded = Buffer.from(customPayload, 'base64').toString('utf-8');
        const payload = JSON.parse(decoded);
        const customResult = await rawOtcCall('POST', '/transactions', payload);
        results.custom_test = {
          payload,
          status: customResult.status,
          statusText: customResult.statusText,
          headers: customResult.headers,
          body: customResult.body,
          rawBody: customResult.rawBody,
        };
      } catch (e) {
        results.custom_test_error = `Failed to parse custom payload: ${e}`;
      }
      return NextResponse.json(results, { status: 200 });
    }

    // Build and run test cases
    const testCases = await buildTestCases();
    results.total_test_cases = testCases.length;

    // If a specific test number is requested, run only that one
    if (testNum) {
      const idx = parseInt(testNum, 10) - 1;
      if (idx < 0 || idx >= testCases.length) {
        results.error = `Test number must be between 1 and ${testCases.length}`;
        return NextResponse.json(results, { status: 400 });
      }

      const tc = testCases[idx];
      console.log(`[DEBUG-TX] Running test #${testNum}: ${tc.name}`);
      const result = await rawOtcCall('POST', '/transactions', tc.payload);
      results.test_result = {
        test_number: idx + 1,
        name: tc.name,
        description: tc.description,
        payload: tc.payload,
        response: {
          status: result.status,
          statusText: result.statusText,
          headers: result.headers,
          body: result.body,
          rawBody: result.rawBody,
        },
      };

      return NextResponse.json(results, { status: 200 });
    }

    // Run ALL test cases
    const testResults: Array<{
      test_number: number;
      name: string;
      description: string;
      payload: unknown;
      response_status: number;
      response_body: unknown;
      success: boolean;
    }> = [];

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      console.log(
        `[DEBUG-TX] Test ${i + 1}/${testCases.length}: ${tc.name}...`
      );

      const result = await rawOtcCall('POST', '/transactions', tc.payload);

      testResults.push({
        test_number: i + 1,
        name: tc.name,
        description: tc.description,
        payload: tc.payload,
        response_status: result.status,
        response_body: result.body,
        success: result.status >= 200 && result.status < 300,
      });

      // Log immediately for server-side visibility
      console.log(
        `[DEBUG-TX] Test ${i + 1} result: HTTP ${result.status} -- ${
          result.status < 300 ? 'SUCCESS!' : 'FAILED'
        }`
      );
      if (result.status >= 300) {
        console.log(
          `[DEBUG-TX] Error body: ${result.rawBody.substring(0, 500)}`
        );
      }

      // Small delay between requests to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    results.test_results = testResults;

    // Summary
    const successes = testResults.filter((t) => t.success);
    const failures = testResults.filter((t) => !t.success);
    results.summary = {
      total: testResults.length,
      successes: successes.length,
      failures: failures.length,
      successful_tests: successes.map((t) => `#${t.test_number}: ${t.name}`),
      status_distribution: testResults.reduce(
        (acc, t) => {
          const key = `HTTP_${t.response_status}`;
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      ),
    };

    // Look for patterns in error responses
    const errorBodies = new Set(
      failures.map((t) => JSON.stringify(t.response_body))
    );
    results.unique_error_responses = Array.from(errorBodies).map((b) =>
      JSON.parse(b)
    );

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Debug transaction endpoint failed',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
