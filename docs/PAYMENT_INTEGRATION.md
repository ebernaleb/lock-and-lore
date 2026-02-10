# OTC Payment Integration - Deep Dive Analysis

**Date:** 2026-02-05
**Status:** Research complete, implementation recommendations ready

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [How OTC Handles Payments (API Analysis)](#how-otc-handles-payments)
3. [The Complete Booking + Payment Flow](#the-complete-booking--payment-flow)
4. [Three Integration Options](#three-integration-options)
5. [Recommended Approach](#recommended-approach)
6. [Implementation Plan](#implementation-plan)
7. [Code Changes Required](#code-changes-required)
8. [Open Questions for OTC Support](#open-questions-for-otc-support)

---

## Executive Summary

After deep analysis of the OTC API documentation, **OTC does NOT process credit card payments directly through its API**. The OTC API is a **record-keeping system** for payments, not a payment processor. Here is what the API actually does:

- `POST /transactions` -- Creates a transaction record with a `total`, `due`, and `paid` amount. The `due` field will be non-zero until payment is recorded.
- `POST /payments` -- Records that a payment was made. Requires `transaction_id`, `type` (credit_card/gift_card/cash), and `amount`. For credit cards, you provide `gateway_transaction_id` (the ID from Stripe/Square/etc).
- OTC tracks card details (last four, expiry, cardholder name) but **does not process the card** -- you must use an external gateway (Stripe, Square, etc.) and then report the result to OTC.

**Key Evidence:**
- `POST /payments` accepts `gateway_transaction_id` -- this is the reference ID from your external payment processor
- Payment `status` is 1 (success) or 0 (failed) -- you set this based on what your gateway reports
- There is no mention of payment tokens, client secrets, hosted checkout pages, or redirect URLs in the API
- The `url_hash` returned by `POST /transactions` likely links to OTC's internal transaction view, not a checkout page

**Bottom Line:** You need to integrate a payment gateway (Stripe recommended) alongside OTC. OTC handles the booking/scheduling; Stripe handles the money.

---

## How OTC Handles Payments

### The OTC Data Model

```
Customer
    |
    v
Transaction (order_number, total, tax, fee, due, paid)
    |
    +---> Booking(s)     [time slots linked to this transaction]
    +---> Gift Card(s)   [gift cards purchased in this transaction]
    +---> Item(s)        [products/add-ons]
    +---> Payment(s)     [payment records -- one or more per transaction]
```

### Transaction Lifecycle

1. **Transaction Created** (`POST /transactions`)
   - `total` = calculated from bookings + gift cards + items + tax + fees
   - `paid` = 0 (nothing paid yet)
   - `due` = total (full amount outstanding)
   - `status` = "pending" or similar

2. **Payment Recorded** (`POST /payments`)
   - Links to the transaction via `transaction_id`
   - `type` = "credit_card" | "gift_card" | "cash"
   - `amount` = how much was paid
   - `gateway_transaction_id` = Stripe charge ID (e.g., "ch_abc123xyz")
   - After payment, OTC updates the transaction: `paid` increases, `due` decreases

3. **Transaction Complete**
   - When `due` = 0, the transaction is fully paid
   - Booking status changes from pending to confirmed

### What POST /payments Does NOT Do

- Does NOT charge a credit card
- Does NOT create a Stripe PaymentIntent
- Does NOT redirect to a checkout page
- Does NOT validate card numbers
- It is purely a **payment ledger entry**

---

## The Complete Booking + Payment Flow

### Current Flow (BROKEN -- no payment)

```
1. User selects time slot     -> GET /api/availability/[gameId]
2. User enters details        -> Client-side form
3. User clicks "Confirm"      -> POST /api/book
   a. Creates/uses booking slot
   b. Creates transaction (POST /transactions)
   c. Returns order_number     <- Transaction has due > 0, not paid!
4. Shows "Booking Confirmed!" <- BUT NO PAYMENT WAS COLLECTED
```

### Correct Flow (WITH payment)

```
1. User selects time slot     -> GET /api/availability/[gameId]
2. User enters details        -> Client-side form
3. User clicks "Proceed to Payment"
   a. POST /api/book/initiate  -> Creates transaction, returns total + transaction_id
   b. Show payment form (Stripe Elements or Stripe Checkout)
4. User enters card details
   a. Stripe processes payment -> Returns charge/PaymentIntent ID
   b. POST /api/book/complete  -> Records payment in OTC (POST /payments)
   c. Returns confirmed booking
5. Shows "Booking Confirmed!" <- Payment collected, booking confirmed
```

---

## Three Integration Options

### Option A: Stripe Checkout (Hosted Page) -- RECOMMENDED

**How it works:** After creating the OTC transaction, redirect the user to Stripe's hosted checkout page. After payment, Stripe redirects back to your site with a success/cancel status.

**Pros:**
- Stripe handles ALL payment UI (card form, validation, 3D Secure, Apple Pay, Google Pay)
- PCI compliant out of the box (card details never touch your server)
- Mobile-optimized checkout
- Supports 40+ payment methods globally
- Minimal frontend code

**Cons:**
- User leaves your site briefly (Stripe's hosted page)
- Less control over checkout UI styling

**Flow:**
```
Your Site                    Stripe                      OTC API
--------                    ------                      -------
1. POST /api/book/initiate
   -> POST /transactions    ----------------------------------------> Creates transaction
   -> Create Stripe Checkout Session (with OTC transaction_id in metadata)
   <- Return Stripe checkout URL

2. Redirect to Stripe Checkout ---->  User enters card
                                      Payment processed
                              <----  Redirect to success_url

3. GET /api/book/complete?session_id=xxx
   -> Verify Stripe session
   -> POST /payments         ----------------------------------------> Records payment
   <- Return confirmation
```

### Option B: Stripe Elements (Embedded Card Form)

**How it works:** Embed Stripe's card input components directly in your booking modal. You create a PaymentIntent server-side, the user enters card details in-page, and Stripe confirms the payment.

**Pros:**
- Card form stays on your site (no redirect)
- Full control over UI/UX
- Still PCI compliant (Stripe Elements handles sensitive data)

**Cons:**
- More frontend code to write
- Must handle 3D Secure authentication flow
- Must handle payment failures in-page
- Need to manage PaymentIntent lifecycle

**Flow:**
```
Your Site                    Stripe                      OTC API
--------                    ------                      -------
1. POST /api/book/initiate
   -> POST /transactions    ----------------------------------------> Creates transaction
   -> Create Stripe PaymentIntent (amount from OTC transaction total)
   <- Return client_secret + transaction_id

2. User enters card in Stripe Elements
   -> stripe.confirmPayment(client_secret)
   -> Stripe processes payment
   <- Payment confirmed

3. POST /api/book/complete
   -> Verify PaymentIntent
   -> POST /payments         ----------------------------------------> Records payment
   <- Return confirmation
```

### Option C: Deposit-Only Flow (No External Gateway)

**How it works:** If the business only requires a deposit (not full payment) and handles remaining payment in-person, you could use OTC's deposit system and skip the payment gateway entirely. Record the deposit as a "cash" or manual payment.

**Pros:**
- Simplest to implement
- No Stripe account needed
- Works with OTC's existing deposit_amount system

**Cons:**
- No actual payment collected online
- Customer could no-show with no financial consequence
- Not suitable if full prepayment is required
- Business loses revenue from abandoned bookings

**NOTE:** This is essentially what the current code does (minus recording the payment). It may be acceptable as an interim solution if the business currently handles payments at the door.

---

## Recommended Approach

### Stripe Checkout (Option A) -- Best for This Project

**Why:**

1. **Fastest to implement** -- Stripe handles the entire payment UI. You only need:
   - Server: Create a Checkout Session (~20 lines)
   - Client: Redirect to Stripe URL (~5 lines)
   - Server: Verify and record payment on callback (~30 lines)

2. **Most secure** -- Card data never touches your server. Full PCI DSS compliance with zero effort.

3. **Best conversion** -- Stripe Checkout is optimized for mobile, supports Apple Pay / Google Pay / Link, and handles 3D Secure automatically.

4. **Handles edge cases** -- Payment failures, expired sessions, duplicate payments, and refunds are all handled by Stripe's infrastructure.

5. **OTC compatibility** -- After Stripe processes payment, you record it in OTC via `POST /payments` with the Stripe charge ID as `gateway_transaction_id`.

### Cost

- Stripe charges 2.9% + $0.30 per transaction (standard US rate)
- No monthly fees
- For a $200 booking: Stripe fee = $6.10

---

## Implementation Plan

### Phase 1: Stripe Checkout Integration (Estimated: 4-6 hours)

#### Step 1: Stripe Setup
- Create Stripe account (or connect existing one)
- Get API keys (publishable key + secret key)
- Add to `.env.local`:
  ```
  STRIPE_SECRET_KEY=sk_test_...
  STRIPE_PUBLISHABLE_KEY=pk_test_...
  STRIPE_WEBHOOK_SECRET=whsec_...
  ```

#### Step 2: Install Stripe SDK
```bash
npm install stripe @stripe/stripe-js
```

#### Step 3: Split `/api/book` into Two Endpoints

**`POST /api/book/initiate`** -- Creates OTC transaction + Stripe Checkout Session
- Validates booking data (same as current)
- Creates OTC transaction via `POST /transactions`
- Creates Stripe Checkout Session with:
  - `line_items` based on OTC transaction total
  - `success_url` pointing to `/booking/success?session_id={CHECKOUT_SESSION_ID}`
  - `cancel_url` pointing back to booking page
  - `metadata` containing OTC transaction_id, booking slot ID
- Returns Stripe checkout URL to client

**`GET /api/book/complete`** -- Verifies payment + records in OTC
- Retrieves Stripe Checkout Session by session_id
- Verifies payment_status === "paid"
- Extracts payment details (amount, card info)
- Creates OTC payment record via `POST /payments`:
  ```json
  {
    "transaction_id": <from metadata>,
    "type": "credit_card",
    "amount": <from Stripe>,
    "gateway_transaction_id": <Stripe payment_intent ID>,
    "cardholder_first_name": <from Stripe>,
    "cardholder_last_name": <from Stripe>,
    "card_type": <from Stripe>,
    "card_last_four": <from Stripe>,
    "card_expiry": <from Stripe>,
    "status": 1
  }
  ```
- Returns booking confirmation

**`POST /api/webhooks/stripe`** -- Handles Stripe webhooks (backup)
- Listens for `checkout.session.completed` event
- Ensures payment is recorded even if user closes browser before redirect
- Idempotent: checks if payment already recorded

#### Step 4: Update Client Flow
- BookingConfirmation "Confirm Booking" button calls `/api/book/initiate`
- On success, redirect to Stripe checkout URL
- After payment, Stripe redirects to success page
- Success page calls `/api/book/complete` to finalize

#### Step 5: Create Success/Cancel Pages
- `/booking/success` -- Shows confirmation after successful payment
- `/booking/cancel` -- Shows message if payment was cancelled

### Phase 2: OTC Payment Recording

Add `createPayment()` function to `lib/otc-api-client.ts`:

```typescript
export interface OTCCreatePaymentParams {
  transaction_id: number;
  type: 'credit_card' | 'gift_card' | 'cash';
  amount: number;
  cardholder_first_name?: string;
  cardholder_last_name?: string;
  card_type?: string;       // "Visa", "Mastercard", "Amex"
  card_funding?: string;    // "credit" or "debit"
  card_last_four?: string;
  card_expiry?: string;     // "YYYY-MM-DD"
  gateway_transaction_id?: string; // Stripe charge/payment_intent ID
  status?: number;          // 1 = success, 0 = failed
  failed_message?: string;
}

export async function createPayment(
  params: OTCCreatePaymentParams
): Promise<OTCPayment> {
  return otcFetch<OTCPayment>('/payments', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
```

### Phase 3: Webhook Hardening

- Add Stripe webhook endpoint for reliability
- Handle `checkout.session.completed`, `checkout.session.expired`
- Ensure idempotent payment recording (don't double-record)
- Add `payment.intent.payment_failed` handling

---

## Code Changes Required

### New Files to Create

1. **`lib/stripe.ts`** -- Stripe server-side client initialization
2. **`app/api/book/initiate/route.ts`** -- Creates transaction + Stripe session
3. **`app/api/book/complete/route.ts`** -- Verifies payment + records in OTC
4. **`app/api/webhooks/stripe/route.ts`** -- Stripe webhook handler
5. **`app/booking/success/page.tsx`** -- Post-payment success page
6. **`app/booking/cancel/page.tsx`** -- Payment cancelled page

### Files to Modify

1. **`lib/otc-api-client.ts`** -- Add `createPayment()` function
2. **`types/otc-api.ts`** -- Add `OTCPayment`, `OTCCreatePaymentParams` types
3. **`components/BookingConfirmation.tsx`** -- Change "Confirm" to redirect to Stripe
4. **`lib/booking-api.ts`** -- Add `initiateBooking()` client function
5. **`app/api/book/route.ts`** -- Deprecate in favor of initiate/complete split

### Environment Variables to Add

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## Open Questions for OTC Support

These questions should be sent to OTC support (nick@offthecouch.io) to confirm our understanding:

1. **Payment recording:** When we create a payment via `POST /payments` with `gateway_transaction_id` from Stripe, does OTC automatically update the transaction's `paid` and `due` fields? Or do we need to call `PUT /transactions/{id}` separately?

2. **Transaction status:** After payment is recorded, does the transaction status automatically change to "completed"? Or do we need to update it manually?

3. **Booking status:** When a transaction is fully paid, does the linked booking's status automatically change from "pending"/"available" to "confirmed"?

4. **url_hash:** The `POST /transactions` response includes a `url_hash`. What is this used for? Is it a link to a hosted checkout/confirmation page on OTC's side?

5. **Deposit vs full payment:** If `custom_deposit_enabled` is set on the transaction, does OTC expect only the deposit amount to be paid, or the full total? How does partial payment work?

6. **Stripe Connect:** Does OTC have any built-in Stripe Connect integration, or is the API purely a ledger for recording payments made through external gateways?

7. **Pricing categories:** Our `include_pricing=true` on `GET /games/{id}` returns a 500 error. Is this a known issue, and is pricing configuration required before payments can work properly?

---

## Interim Solution (Before Stripe Integration)

If you need bookings to work immediately without payment:

1. The current booking flow (fixed in this session) creates an OTC transaction with `due > 0`
2. The business can collect payment at the door
3. Staff can manually record the payment in the OTC Console
4. The "Confirm Booking" button should be relabeled to "Reserve Booking" to set expectations
5. Add a notice: "A deposit/payment will be collected at arrival" or similar

This matches how many escape rooms operate -- online reservation, pay at the venue.
