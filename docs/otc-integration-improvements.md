# OTC API Integration Improvements - Room Cards Configuration

## Summary

Refactored the RoomsSection component to properly display all available information from the Off The Couch (OTC) API and eliminated code duplication by using centralized utility functions.

## Changes Made

### 1. Eliminated Code Duplication

**Before:** RoomsSection had its own helper functions that duplicated logic in `lib/game-utils.ts`

**After:** Now imports and uses centralized utilities:
- `getDifficultyLabel()` - Consistent difficulty mapping (Beginner/Easy/Moderate/Challenging/Expert)
- `getDifficultyColor()` - Consistent color classes with background and border
- `getGameImage()` - Centralized image resolution with fallbacks
- `formatPlayerCount()` - Proper player range formatting
- `getGamePriceDisplay()` - Price display logic for pricing categories
- `getPricingTypeLabel()` - Human-readable pricing type labels

### 2. Enhanced Room Card Display

**New Information Displayed:**

1. **Price Display** - Shows actual pricing when available:
   - Price range from pricing_categories (e.g., "$30 - $50")
   - Single price if all categories match
   - Deposit amount as fallback (e.g., "From $25")

2. **Detailed Deposit Information** - Instead of generic "Deposit required to book":
   - Shows actual amount: "$25 deposit required"
   - Falls back to generic message if amount not configured

3. **Improved Difficulty Badge** - Now uses consistent styling:
   - Text color + background color + border for better visual hierarchy
   - Matches styling across all components (RoomDetailContent, RoomsListingContent)

4. **Better Pricing Type Labels** - Cleaner display:
   - "per person" instead of "per_person"
   - "flat rate" instead of "flat_rate"
   - "tiered pricing" instead of "tiered"

### 3. Updated RoomCardProps Interface

```typescript
interface RoomCardProps {
  id: number;
  slug: string;
  title: string;
  image: string;
  description: string;
  players: string;
  duration: number;
  difficulty: string;
  difficultyColor: string;
  pricingType?: string;
  pricingTypeLabel?: string;        // NEW
  depositRequired?: boolean;
  depositAmount?: number;            // NEW
  priceDisplay?: string | null;     // NEW
}
```

### 4. Consistent Difficulty Mapping

**Updated mapping (now consistent across all components):**
- Level 1: Beginner (green)
- Level 2: Easy (emerald)
- Level 3: Moderate (amber) - default
- Level 4: Challenging (orange)
- Level 5: Expert (red)

**Previous inconsistent mapping in RoomsSection:**
- ≤2: Beginner
- ≤3: Intermediate
- ≤4: Advanced
- 5: Expert

### 5. Updated Fallback Rooms

Updated static fallback data to match new interface and use consistent difficulty labels and colors.

## OTC Console Configuration

To ensure room cards display complete information, configure the following in your OTC Console:

### Required Fields (Always Present)
- ✅ Game name
- ✅ Description
- ✅ Min/max players
- ✅ Duration
- ✅ Difficulty (1-5)
- ✅ is_public flag

### Optional But Recommended
- 📸 **image_url** - Room images (fallback to local images if not set)
- 💰 **pricing_categories** - Price ranges for different group sizes
- 💵 **deposit_amount** - Specific deposit amount for booking
- 💳 **deposit_required** - Whether deposit is needed (0/1)
- 🏷️ **pricing_type** - "per_person", "flat_rate", or "tiered"

### How Fields Are Displayed

| OTC Field | Display Location | Example |
|-----------|-----------------|---------|
| `name` | Card title | "Skybound Dynasty" |
| `description` | Card body text | "High above the world..." |
| `min_players`, `max_players` | Metadata strip | "2-10 Players" |
| `duration` | Metadata strip | "60 Mins" |
| `difficulty` | Badge overlay + metadata | "Moderate" (amber badge) |
| `pricing_type` | Metadata strip | "per person" |
| `pricing_categories` | Price section | "$30 - $50" |
| `deposit_amount` | Deposit notice | "$25 deposit required" |
| `image_url` | Hero image | Background image |

## Data Flow

```
OTC Console
    ↓
OTC API (connect.offthecouch.io/games)
    ↓
Next.js API Route (/api/games)
    ↓
RoomsSection Component (client-side)
    ↓
mapGameToCardProps() + game-utils functions
    ↓
RoomCard Component
```

## Caching Strategy

- **CDN Cache:** 5 minutes
- **Stale-While-Revalidate:** 10 minutes
- Changes in OTC Console appear within 5-15 minutes on the live site

## Testing Checklist

- [ ] All games from OTC API display correctly
- [ ] Pricing information shows when configured
- [ ] Deposit amounts display when set
- [ ] Images from OTC Console (image_url) take priority over local fallbacks
- [ ] Difficulty badges use consistent colors
- [ ] Player counts format correctly (single number or range)
- [ ] Fallback rooms show when API is unavailable
- [ ] Error states display user-friendly messages
- [ ] Links to `/rooms/[slug]` work correctly

## Related Files

- `/components/RoomsSection.tsx` - Main component (refactored)
- `/lib/game-utils.ts` - Centralized utility functions
- `/lib/otc-api-client.ts` - Server-side API client
- `/app/api/games/route.ts` - API proxy route
- `/types/otc-api.ts` - TypeScript type definitions

## Future Enhancements

Consider adding these fields if needed:
- `company_group.name` - Display location if multiple locations exist
- `total_bookings` - Social proof ("100+ bookings")
- `archived` - Filter logic (already implemented)
- `position` - Custom ordering (already used for sorting)
