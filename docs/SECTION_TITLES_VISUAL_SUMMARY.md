# Section Title Variants - Visual Summary

Quick reference showing all 7 design approaches at a glance.

---

## 1. DEFAULT (Enhanced Current)

**Visual:** Clean, bold headline with accent highlight
**Mood:** Professional, versatile, readable

```
         Pick Your GAME
    Step into immersive worlds
```

**When to use:** Anywhere you need clarity over drama
**Best for:** Features, general sections, contact, default choice

---

## 2. CINEMATIC

**Visual:** Film-inspired with animated side bars and gradient text
**Mood:** Dramatic, premium, memorable

```
    ———  What Adventurers SAY  ———
         (animated entrance)
      Real stories from players
```

**When to use:** Hero sections, major reveals, testimonial headers
**Best for:** Making a strong first impression

---

## 3. SPOTLIGHT

**Visual:** Title with glowing radial backdrop
**Mood:** Attention-grabbing, premium, focused

```
        * GLOW EFFECT *
    The Perfect GIFT for Seekers
     Lock & Lore gift cards...
```

**When to use:** CTAs, gift cards, announcements you need people to see
**Best for:** Conversion-focused sections

---

## 4. UNDERLINE

**Visual:** Clean title with animated gradient underline
**Mood:** Elegant, sophisticated, subtle

```
       How It WORKS
       ═══════════
    Four simple steps...
```

**When to use:** Features lists, step-by-step sections, how-it-works
**Best for:** Professional, instructional content

---

## 5. OUTLINED

**Visual:** Dramatic outlined typography (hollow letters)
**Mood:** Bold, modern, eye-catching

```
    ░█▀█░█▀▀░█░█░▀█▀░█░█░█▀▄░█▀▀
    Pick Your ADVENTURE
    (Outlined text effect)
```

**When to use:** Bold statements, room listings, hero sections
**Best for:** Maximum visual impact

---

## 6. BADGE

**Visual:** Title with small label badge above (+ icon support)
**Mood:** Contextual, hierarchical, special

```
       [👥 Featured Section]
      Your Team. Our ROOMS.
    Perfect for corporate events
```

**When to use:** Special sections, team building, announcements
**Best for:** Adding context with icons and labels

---

## 7. MINIMAL

**Visual:** Ultra-clean with accent line and whitespace
**Mood:** Premium, calm, sophisticated

```
          ─────

    Frequently Asked QUESTIONS

    Everything you need to know
```

**When to use:** Reviews, FAQ, quiet sections that need breathing room
**Best for:** Letting content speak for itself

---

## Quick Comparison Table

| Variant | Drama | Readability | Animation | Space Used | Best For |
|---------|-------|-------------|-----------|------------|----------|
| Default | ★★☆☆☆ | ★★★★★ | None | Low | General use |
| Cinematic | ★★★★★ | ★★★★☆ | High | Medium | Hero sections |
| Spotlight | ★★★★☆ | ★★★★☆ | Subtle | Medium | CTAs |
| Underline | ★★★☆☆ | ★★★★★ | Subtle | Low | Features |
| Outlined | ★★★★★ | ★★★☆☆ | None | Low | Bold statements |
| Badge | ★★★☆☆ | ★★★★☆ | None | High | Special sections |
| Minimal | ★☆☆☆☆ | ★★★★★ | None | High | Reviews/FAQ |

---

## Color Coding Legend

**Gold accent (#FBBD08)** = Always used for "highlight" prop word
**White text** = Main title text
**Gray text** = Subtitle/description text
**Animations** = CSS-based, no JavaScript

---

## Mobile Behavior

All variants are **fully responsive** with appropriate font size scaling:
- `text-3xl` → `text-4xl` → `text-5xl` → `text-6xl` progression
- Centered text on all screen sizes
- Animations scale smoothly
- Touch-friendly spacing

---

## Accessibility Notes

✅ All variants use semantic `<h2>` tags
✅ WCAG AA contrast ratios maintained
✅ Keyboard navigable (no interactive elements in titles)
✅ Screen reader friendly
⚠️ Animations should respect `prefers-reduced-motion` (to implement)

---

## Implementation Speed

**Fastest:** Default, Minimal (2 min each)
**Fast:** Underline, Badge (3-4 min each)
**Medium:** Spotlight, Outlined (5-6 min each)
**Slower:** Cinematic (6-8 min with animation tuning)

---

## Performance Impact

**None measurable** - All variants are pure CSS with minimal DOM.
Animations use `transform` and `opacity` (GPU-accelerated).

---

## Design Philosophy

**Variety with consistency** - Each section can have its own personality while maintaining:
- Same font family (Playfair Display)
- Same color system (Gold on Black)
- Same spacing rhythm
- Same responsive behavior

**Not all sections should match** - Use drama where it serves conversion, calm where content needs focus.

---

## Next Steps

1. **Browse showcase:** Visit `/section-titles-showcase` to see all variants live
2. **Read guide:** Check `docs/section-title-design-guide.md` for complete API
3. **See examples:** Review `docs/section-title-migration-example.md` for code samples
4. **Pick variants:** Choose which variant fits each section
5. **Implement:** Import `SectionTitle` and replace existing headers
6. **Test:** Verify mobile, desktop, accessibility

---

**Last Updated:** 2026-02-06
**Component:** `components/ui/SectionTitle.tsx`
