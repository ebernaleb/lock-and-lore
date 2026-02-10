# Section Title Migration Examples

Step-by-step examples showing how to replace existing section headers with the new `SectionTitle` component.

## Example 1: RoomsSection (Current Implementation)

### Before (Current Code)

```tsx
// components/RoomsSection.tsx (lines 510-524)
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <div className="text-center mb-10 sm:mb-14 md:mb-16">
    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 sm:mb-5 font-heading leading-[1.1] tracking-tight">
      Pick Your{" "}
      <span className="text-primary">Game</span>
    </h2>
    <p className="max-w-xl mx-auto text-gray-400 text-sm sm:text-base leading-relaxed">
      Step into immersive worlds, solve intricate puzzles, and race the clock.
      Every room is a private experience for your group.
    </p>
  </div>
</div>
```

### After (With SectionTitle)

**Option A: Cinematic (Dramatic Hero Feel)**
```tsx
import { SectionTitle } from "@/components/ui/SectionTitle";

<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <SectionTitle
    variant="cinematic"
    title="Pick Your Game"
    highlight="Game"
    subtitle="Step into immersive worlds, solve intricate puzzles, and race the clock. Every room is a private experience for your group."
  />
</div>
```

**Option B: Outlined (Bold & Modern)**
```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <SectionTitle
    variant="outlined"
    title="Pick Your Game"
    highlight="Game"
    subtitle="Step into immersive worlds, solve intricate puzzles, and race the clock. Every room is a private experience for your group."
  />
</div>
```

**Option C: Default (Keep Current Style)**
```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <SectionTitle
    variant="default"
    title="Pick Your Game"
    highlight="Game"
    subtitle="Step into immersive worlds, solve intricate puzzles, and race the clock. Every room is a private experience for your group."
  />
</div>
```

---

## Example 2: FeaturesSection

### Before (Current Code)

```tsx
// components/FeaturesSection.tsx (lines 57-65)
<div className="text-center mb-12 sm:mb-16">
  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
    How It <span className="text-primary">Works</span>
  </h2>
  <p className="max-w-2xl mx-auto text-gray-400">
    From booking to bragging rights in four simple steps. No experience
    needed -- just bring your curiosity and your crew.
  </p>
</div>
```

### After (With SectionTitle)

**Recommended: Underline (Clean & Professional)**
```tsx
import { SectionTitle } from "@/components/ui/SectionTitle";

<SectionTitle
  variant="underline"
  title="How It Works"
  highlight="Works"
  subtitle="From booking to bragging rights in four simple steps. No experience needed -- just bring your curiosity and your crew."
/>
```

---

## Example 3: ReviewsSection (Hypothetical)

### Before (Typical Pattern)

```tsx
<div className="text-center mb-12 sm:mb-16">
  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
    What Adventurers <span className="text-primary">Say</span>
  </h2>
  <p className="max-w-2xl mx-auto text-gray-400">
    Real stories from real players who've escaped (or tried to).
  </p>
</div>
```

### After (With SectionTitle)

**Recommended: Minimal (Let Reviews Shine)**
```tsx
<SectionTitle
  variant="minimal"
  title="What Adventurers Say"
  highlight="Say"
  subtitle="Real stories from real players who've escaped (or tried to)."
/>
```

**Alternative: Cinematic (Social Proof Emphasis)**
```tsx
<SectionTitle
  variant="cinematic"
  title="What Adventurers Say"
  highlight="Say"
  subtitle="Real stories from real players who've escaped (or tried to)."
/>
```

---

## Example 4: GiftCardsSection

### Before (Hypothetical)

```tsx
<div className="text-center mb-12 sm:mb-16">
  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
    The Perfect <span className="text-primary">Gift</span> for Adventure Seekers
  </h2>
  <p className="max-w-2xl mx-auto text-gray-400">
    Lock & Lore gift cards never expire and work for any room, any time.
  </p>
</div>
```

### After (With SectionTitle)

**Recommended: Spotlight (Attention-Grabbing CTA)**
```tsx
<SectionTitle
  variant="spotlight"
  title="The Perfect Gift for Adventure Seekers"
  highlight="Gift"
  subtitle="Lock & Lore gift cards never expire and work for any room, any time."
/>
```

**Alternative: Badge (Special Offering)**
```tsx
import { Gift } from "lucide-react";

<SectionTitle
  variant="badge"
  title="The Perfect Gift for Adventure Seekers"
  highlight="Gift"
  subtitle="Lock & Lore gift cards never expire and work for any room, any time."
  icon={Gift}
/>
```

---

## Example 5: TeamBuildingSection

### Before (Current Code)

```tsx
// Hypothetical current pattern
<div className="text-center mb-12 sm:mb-16">
  <div className="mb-4">
    <span className="text-sm uppercase tracking-wider text-primary">Groups & Events</span>
  </div>
  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
    Your Team. Our <span className="text-primary">Rooms</span>.
  </h2>
  <p className="max-w-2xl mx-auto text-gray-400">
    Perfect for corporate events, birthday parties, and team building.
  </p>
</div>
```

### After (With SectionTitle)

**Recommended: Badge (Corporate-Friendly with Icon)**
```tsx
import { Users } from "lucide-react";

<SectionTitle
  variant="badge"
  title="Your Team. Our Rooms."
  highlight="Rooms"
  subtitle="Perfect for corporate events, birthday parties, and team building. Book a private experience for groups of 10-50 people."
  icon={Users}
/>
```

**Alternative: Underline (Professional)**
```tsx
<SectionTitle
  variant="underline"
  title="Your Team. Our Rooms."
  highlight="Rooms"
  subtitle="Perfect for corporate events, birthday parties, and team building."
/>
```

---

## Example 6: FAQSection

### Before (Typical Pattern)

```tsx
<div className="text-center mb-12 sm:mb-16">
  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
    Frequently Asked <span className="text-primary">Questions</span>
  </h2>
  <p className="max-w-2xl mx-auto text-gray-400">
    Everything you need to know before your adventure.
  </p>
</div>
```

### After (With SectionTitle)

**Recommended: Minimal (Clean & Calm)**
```tsx
<SectionTitle
  variant="minimal"
  title="Frequently Asked Questions"
  highlight="Questions"
  subtitle="Everything you need to know before your adventure. Still have questions? Contact us directly."
/>
```

**Alternative: Default (Straightforward)**
```tsx
<SectionTitle
  variant="default"
  title="Frequently Asked Questions"
  highlight="Questions"
  subtitle="Everything you need to know before your adventure."
/>
```

---

## Example 7: LocationSection

### Before (Typical Pattern)

```tsx
<div className="text-center mb-12 sm:mb-16">
  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
    Find <span className="text-primary">Us</span>
  </h2>
  <p className="max-w-2xl mx-auto text-gray-400">
    Located in the heart of downtown, just minutes from major attractions.
  </p>
</div>
```

### After (With SectionTitle)

**Recommended: Badge (with MapPin Icon)**
```tsx
import { MapPin } from "lucide-react";

<SectionTitle
  variant="badge"
  title="Find Us"
  highlight="Us"
  subtitle="Located in the heart of downtown, just minutes from major attractions."
  icon={MapPin}
/>
```

**Alternative: Default (Simple & Clear)**
```tsx
<SectionTitle
  variant="default"
  title="Find Us"
  highlight="Us"
  subtitle="Located in the heart of downtown, just minutes from major attractions."
/>
```

---

## Migration Checklist

When replacing section headers:

- [ ] Import `SectionTitle` component
- [ ] Choose appropriate variant based on section purpose
- [ ] Extract title text (remove JSX `<span>` for highlight)
- [ ] Pass highlight word(s) as separate prop
- [ ] Extract subtitle/description text
- [ ] Add icon if using badge variant
- [ ] Remove old header markup
- [ ] Test responsive behavior (mobile to desktop)
- [ ] Verify accessibility (keyboard nav, screen readers)

## Variant Selection Quick Guide

| Section Type | Primary Choice | Alternative |
|-------------|---------------|-------------|
| Hero/Main CTA | Cinematic, Outlined | Spotlight |
| Features/Steps | Underline | Default |
| Social Proof | Minimal, Cinematic | Default |
| Gift Cards/CTAs | Spotlight, Badge | Cinematic |
| Team Building | Badge (icon) | Underline |
| FAQ/Info | Minimal | Default |
| Location/Contact | Badge (icon) | Default |

## Testing the New Titles

After migration:

1. **Visual check:** Compare with original design
2. **Responsive test:** Verify mobile, tablet, desktop layouts
3. **Animation test:** Ensure animations play smoothly
4. **Accessibility test:** Tab through with keyboard
5. **Screen reader test:** Verify semantic structure
6. **Performance:** Check for layout shifts or jank

## Rollback Plan

If you need to revert:

1. Keep backup of original component files
2. Remove `SectionTitle` import
3. Restore original `<div>` + `<h2>` + `<p>` markup
4. Commit as separate change for easy revert

---

**Last Updated:** 2026-02-06
**Related:** `docs/section-title-design-guide.md`
