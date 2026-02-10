# Section Title Design Guide

Complete reference for the Lock & Lore section title component system.

## Component Location

`components/ui/SectionTitle.tsx`

## Basic Usage

```tsx
import { SectionTitle } from "@/components/ui/SectionTitle";

<SectionTitle
  variant="default"
  title="Explore Our Escape Rooms"
  highlight="Rooms"
  subtitle="Step into immersive worlds and solve intricate puzzles."
/>
```

## Available Variants

### 1. Default (Enhanced Current)
**Best for:** Most sections, general use
**Visual:** Clean headline with accent color highlight

```tsx
<SectionTitle
  variant="default"
  title="Explore Our Escape Rooms"
  highlight="Rooms"
  subtitle="Optional subtitle text"
/>
```

**Pros:**
- Very readable and accessible
- Works everywhere (mobile to desktop)
- Fast to implement
- Professional and clean

**Cons:**
- Less dramatic/memorable
- Lower visual impact
- May feel generic

---

### 2. Cinematic Title Card
**Best for:** Hero sections, major reveals, room listings
**Visual:** Film-inspired with animated side bars and gradient text

```tsx
<SectionTitle
  variant="cinematic"
  title="What Adventurers Say"
  highlight="Say"
  subtitle="Real stories from real players"
/>
```

**Pros:**
- High visual impact
- Memorable and unique
- Smooth animations
- Perfect for hero/featured sections

**Cons:**
- May feel too dramatic for simple sections
- Longer load animation
- Takes more vertical space

---

### 3. Spotlight Effect
**Best for:** CTAs, gift cards, important announcements
**Visual:** Title with glowing radial backdrop

```tsx
<SectionTitle
  variant="spotlight"
  title="The Perfect Gift for Adventure Seekers"
  highlight="Gift"
  subtitle="Lock & Lore gift cards never expire"
/>
```

**Pros:**
- Strong focal point
- Premium aesthetic
- Great for CTAs and gift cards
- Subtle but impactful

**Cons:**
- Glow may not show on bright screens
- Can feel heavy if overused
- Less suitable for minimal designs

---

### 4. Underline Accent
**Best for:** Features, testimonials, FAQ sections
**Visual:** Clean title with animated gradient underline

```tsx
<SectionTitle
  variant="underline"
  title="How It Works"
  highlight="Works"
  subtitle="Four simple steps"
/>
```

**Pros:**
- Sophisticated and clean
- Subtle motion draws attention
- Works well for features/steps
- Easy to read

**Cons:**
- May be too subtle for hero sections
- Animation only plays once
- Underline can get lost on mobile

---

### 5. Outlined Text
**Best for:** Hero sections, room listings, bold statements
**Visual:** Dramatic outlined typography with solid-fill accent

```tsx
<SectionTitle
  variant="outlined"
  title="Pick Your Adventure"
  highlight="Adventure"
  subtitle="Three immersive worlds await"
/>
```

**Pros:**
- Very distinctive and bold
- Great for room listings/hero
- Modern aesthetic
- High contrast visibility

**Cons:**
- May be too aggressive for quiet sections
- Outline can look inconsistent on some devices
- Harder to read at smaller sizes

---

### 6. Badge Label
**Best for:** Team building, special sections, announcements
**Visual:** Title with small badge above (supports icons)

```tsx
import { Users } from "lucide-react";

<SectionTitle
  variant="badge"
  title="Your Team. Our Rooms."
  highlight="Rooms"
  subtitle="Perfect for corporate events"
  icon={Users}
/>
```

**Pros:**
- Adds context with badge label
- Icon support for visual interest
- Great for special sections
- Clear hierarchy

**Cons:**
- Takes extra vertical space
- Badge text needs to be relevant
- Can feel cluttered if overused

---

### 7. Minimal Premium
**Best for:** Reviews, FAQ, minimalist sections
**Visual:** Ultra-clean with strategic whitespace and accent line

```tsx
<SectionTitle
  variant="minimal"
  title="Frequently Asked Questions"
  highlight="Questions"
  subtitle="Everything you need to know"
/>
```

**Pros:**
- Very premium aesthetic
- Excellent readability
- Calm and sophisticated
- Perfect for reviews/FAQ

**Cons:**
- May lack visual impact
- Needs lots of whitespace
- Too quiet for hero sections

---

## Recommended Usage by Section

| Section | Best Variants |
|---------|--------------|
| **Hero / Rooms** | Cinematic, Outlined, Spotlight |
| **Features / How It Works** | Underline, Default, Minimal |
| **Reviews / Testimonials** | Minimal, Cinematic, Default |
| **Gift Cards / CTAs** | Spotlight, Badge, Cinematic |
| **Team Building** | Badge (with icon), Underline, Default |
| **FAQ / Footer** | Minimal, Default, Underline |
| **Location** | Default, Badge, Underline |

## Props API

```typescript
interface SectionTitleProps {
  variant?: "default" | "cinematic" | "spotlight" | "underline" | "outlined" | "badge" | "minimal";
  title: string;              // Main title text
  highlight?: string;         // Word(s) to highlight with accent color
  subtitle?: string;          // Optional subtitle/description
  icon?: LucideIcon;         // Optional icon (badge variant only)
  className?: string;         // Additional CSS classes
}
```

## Highlight Behavior

The `highlight` prop automatically finds and highlights the matching word(s) in the title:

```tsx
// This will make "Rooms" appear in golden accent color
<SectionTitle
  title="Explore Our Escape Rooms"
  highlight="Rooms"
/>
```

**Note:** The highlight uses simple string replacement. Make sure the highlight text exactly matches part of the title.

## Animation Details

All animations are CSS-based and respect `prefers-reduced-motion`:

- **Cinematic**: Side bars slide in (0.8s ease-out), title fades in (0.6s)
- **Underline**: Width expands from center (0.8s ease-out)
- **Spotlight**: Glow pulses subtly (always active)
- **All others**: Static (no animation)

Animations defined in `app/globals.css`:
- `@keyframes slideInLeft`
- `@keyframes slideInRight`
- `@keyframes expandWidth`

## Live Showcase

Visit `/section-titles-showcase` to see all variants side-by-side with pros/cons and recommendations.

```bash
npm run dev
# Navigate to: http://localhost:3000/section-titles-showcase
```

## Accessibility

All variants maintain:
- Semantic HTML (`<h2>` for titles)
- High contrast ratios (WCAG AA compliant)
- Keyboard navigation support
- Screen reader friendly markup
- No decorative elements marked as content

## Migration Guide

To replace existing section headers:

**Before:**
```tsx
<div className="text-center mb-12 sm:mb-16">
  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
    How It <span className="text-primary">Works</span>
  </h2>
  <p className="max-w-xl mx-auto text-gray-400 text-sm sm:text-base">
    Subtitle text here
  </p>
</div>
```

**After:**
```tsx
import { SectionTitle } from "@/components/ui/SectionTitle";

<SectionTitle
  variant="underline"
  title="How It Works"
  highlight="Works"
  subtitle="Subtitle text here"
/>
```

## Customization

Add custom classes via the `className` prop:

```tsx
<SectionTitle
  variant="default"
  title="Custom Styled Title"
  className="mb-24 lg:mb-32"
/>
```

## Design System Integration

All variants use:
- **Font:** Playfair Display (font-heading) for titles
- **Accent color:** `#FBBD08` (golden/amber)
- **Background:** Black (`#0a0a0a`)
- **Spacing:** Consistent with existing sections

---

**Created:** 2026-02-06
**Component:** `components/ui/SectionTitle.tsx`
**Showcase:** `/section-titles-showcase`
