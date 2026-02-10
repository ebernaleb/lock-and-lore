# Off The Couch API Integration

This document explains how the Off The Couch Console API is integrated into the escape room booking site.

## Architecture Overview

The integration follows Next.js best practices with a secure server-side architecture:

```
┌─────────────────┐
│  Client Browser │
└────────┬────────┘
         │ fetch('/api/games')
         ▼
┌─────────────────┐
│  RoomsSection   │ (Client Component)
│   Component     │ - Fetches games from our API
└────────┬────────┘ - Handles loading/error states
         │         - Maps OTC data to UI format
         ▼
┌─────────────────┐
│  /api/games     │ (Next.js API Route)
│   Route         │ - Server-side endpoint
└────────┬────────┘ - Keeps API key secure
         │         - Implements caching
         ▼
┌─────────────────┐
│  otc-api-client │ (Library)
│   Library       │ - Reusable API functions
└────────┬────────┘ - Type-safe requests
         │         - Error handling
         ▼
┌─────────────────┐
│  Off The Couch  │
│   Console API   │ https://connect.offthecouch.io
└─────────────────┘
```

## Security

✅ **API Key Protection**: The `OTC_KEY` is stored in `.env.local` and only accessed server-side

✅ **No Client Exposure**: Client components never see the API key

✅ **Environment Variable**: Uses `process.env.OTC_KEY` (server-side only)

⚠️ **Important**: Never import `lib/otc-api-client.ts` in client components!

## Files Created

### 1. Type Definitions
**File**: `types/otc-api.ts`
- TypeScript interfaces for OTC API responses
- Ensures type safety across the application
- Documents the API structure

### 2. API Client Library
**File**: `lib/otc-api-client.ts`
- Server-side only utility functions
- Reusable functions: `fetchGames()`, `fetchGameById()`, `verifyApiKey()`
- Centralized error handling
- Easy to extend for more endpoints (bookings, customers, etc.)

### 3. API Route
**File**: `app/api/games/route.ts`
- Next.js API route handler
- Exposes `/api/games` endpoint to client
- Implements HTTP caching (5 min cache)
- Uses the API client library

### 4. Updated Component
**File**: `components/RoomsSection.tsx`
- Fetches games from `/api/games` on mount
- Loading spinner during fetch
- Error message with fallback to default games
- Maps OTC game data to UI format
- Dynamic difficulty labels
- Image mapping for known games

## Data Flow

1. **Component Mount**: `RoomsSection` component loads
2. **API Call**: Client fetches from `/api/games`
3. **Server Processing**: API route uses `fetchGames()` from client library
4. **OTC Request**: Library makes authenticated request to OTC API
5. **Response**: OTC returns games list
6. **Caching**: Response cached for 5 minutes (reduces API calls)
7. **Filtering**: Only public games (`is_public === 1`) are shown
8. **Mapping**: OTC data mapped to UI format with images
9. **Render**: Games displayed in grid layout

## Game Name Mapping

The integration maps OTC game names to local images:

| OTC Game Name | Slug | Image |
|---------------|------|-------|
| Skybound Dynasty | `skybound_dynasty` | `/images/floatingcity_room.png` |
| Escape the Simulation | `escape_the_simulation` | `/images/simulation_room.png` |
| Echo Chamber | `echo_chamber` | `/images/art_room.png` |

**Adding new games**: Update the `imageMap` in `RoomsSection.tsx` line ~28

## Caching Strategy

- **Server-side**: 5-minute cache with stale-while-revalidate
- **Reduces API calls**: Minimizes requests to OTC API
- **Better performance**: Faster page loads for users
- **Cache headers**: `Cache-Control: public, s-maxage=300, stale-while-revalidate=600`

## Error Handling

### Graceful Degradation
If the OTC API fails:
1. Error message displayed to user
2. Fallback to hardcoded games (original 3 games)
3. Site remains functional

### Error Types Handled
- API key not configured
- Network errors
- API timeout
- Invalid responses
- Rate limiting (future consideration)

## Testing

### Test API Connection
```bash
# Start dev server
npm run dev

# Visit http://localhost:3000
# Check browser console for any errors
# Verify games load from OTC API
```

### Verify API Key
Create a test route (temporary):
```typescript
// app/api/test-otc/route.ts
import { verifyApiKey } from '@/lib/otc-api-client';
import { NextResponse } from 'next/server';

export async function GET() {
  const isValid = await verifyApiKey();
  return NextResponse.json({ valid: isValid });
}
```

Visit `/api/test-otc` to check if API key works.

## Future Enhancements

### Booking Integration
When ready to add booking functionality:
1. Create `/api/bookings` route
2. Add booking functions to `otc-api-client.ts`
3. Update UI components to handle booking flow

### Customer Management
```typescript
// In otc-api-client.ts
export async function createCustomer(data: CustomerData) {
  return otcFetch('/customers', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
```

### Transactions
```typescript
export async function createTransaction(data: TransactionData) {
  return otcFetch('/transactions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
```

## Troubleshooting

### Games not loading
1. Check `.env.local` has `OTC_KEY` set
2. Verify API key is valid in OTC console
3. Check browser console for errors
4. Check server logs: `npm run dev`

### Wrong games showing
1. Verify game names in OTC console
2. Check `is_public` flag is set to 1
3. Update image mapping if needed

### API key exposure warning
If you see warnings about API key exposure:
- Ensure `otc-api-client.ts` is only imported in:
  - API routes (`app/api/**/route.ts`)
  - Server components (components with no `"use client"`)
- Never import in client components

## Configuration

### Environment Variables
```bash
# .env.local
OTC_KEY=your_api_key_here
```

### OTC Console Settings
Ensure your games in the OTC console have:
- ✅ `is_public` set to 1 (public)
- ✅ Descriptions filled in
- ✅ Player counts configured
- ✅ Duration set correctly
- ✅ Difficulty level assigned

## API Documentation

Full API documentation available in:
- `OFF_THE_COUCH_API_COMPLETE_DOCS.md`
- https://docs.offthecouch.io/api-docs

## Support

For OTC API issues:
- Contact Off The Couch support
- Check API status page (if available)
- Review API documentation

For integration issues:
- Check server logs
- Review browser console
- Verify environment variables
- Test API route directly: `/api/games`
