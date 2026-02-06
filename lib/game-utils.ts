import type { OTCGame, OTCDifficultyObject } from '@/types/otc-api';

/**
 * Generate a URL-safe slug from a game name.
 * e.g. "The Heist" -> "the-heist"
 *      "Escape the Simulation" -> "escape-the-simulation"
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Find a game in a list by matching its slug.
 */
export function findGameBySlug(games: OTCGame[], slug: string): OTCGame | undefined {
  return games.find(game => generateSlug(game.name) === slug);
}

/**
 * Get a human-readable difficulty label from the API difficulty value.
 * Handles both numeric and object formats.
 */
export function getDifficultyLabel(difficulty: number | OTCDifficultyObject | undefined): string {
  if (difficulty === undefined || difficulty === null) return 'Moderate';

  if (typeof difficulty === 'object' && difficulty !== null) {
    return difficulty.name || getDifficultyLabel(difficulty.level);
  }

  if (difficulty <= 1) return 'Beginner';
  if (difficulty <= 2) return 'Easy';
  if (difficulty <= 3) return 'Moderate';
  if (difficulty <= 4) return 'Challenging';
  return 'Expert';
}

/**
 * Get a numeric difficulty level (1-5) from the API difficulty value.
 */
export function getDifficultyLevel(difficulty: number | OTCDifficultyObject | undefined): number {
  if (difficulty === undefined || difficulty === null) return 3;

  if (typeof difficulty === 'object' && difficulty !== null) {
    return difficulty.level;
  }

  return difficulty;
}

/**
 * Get a CSS color class for difficulty level.
 */
export function getDifficultyColor(difficulty: number | OTCDifficultyObject | undefined): string {
  const level = getDifficultyLevel(difficulty);
  if (level <= 1) return 'text-green-600 bg-green-50 border-green-200';
  if (level <= 2) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  if (level <= 3) return 'text-amber-600 bg-amber-50 border-amber-200';
  if (level <= 4) return 'text-orange-600 bg-orange-50 border-orange-200';
  return 'text-red-600 bg-red-50 border-red-200';
}

/**
 * Image mapping for known games (fallback when no image_url from API).
 */
const IMAGE_MAP: Record<string, string> = {
  'skybound-dynasty': '/images/floatingcity_room.png',
  'escape-the-simulation': '/images/simulation_room.png',
  'echo-chamber': '/images/art_room.png',
};

/**
 * Get a game image URL. Uses the API image_url if available,
 * falls back to known image mapping, then to a default.
 */
export function getGameImage(game: OTCGame): string {
  if (game.image_url) return game.image_url;

  const slug = generateSlug(game.name);
  return IMAGE_MAP[slug] || '/images/hero_img.png';
}

/**
 * Format player count range string.
 */
export function formatPlayerCount(game: OTCGame): string {
  // Handle both field name variations from OTC API
  const min = game.min_players ?? game.min_players_count ?? 2;
  const max = game.max_players ?? game.max_players_count ?? 10;
  if (min === max) return `${min} Players`;
  return `${min}-${max} Players`;
}

/**
 * Format duration string.
 */
export function formatDuration(minutes: number | undefined): string {
  if (!minutes) return '60 minutes';
  if (minutes < 60) return `${minutes} minutes`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (remaining === 0) return hours === 1 ? '1 hour' : `${hours} hours`;
  return `${hours}h ${remaining}m`;
}

/**
 * Get price display string from a game.
 * Returns a range if pricing categories exist, otherwise deposit or base price.
 */
export function getGamePriceDisplay(game: OTCGame): string | null {
  if (game.pricing_categories && game.pricing_categories.length > 0) {
    const prices = game.pricing_categories.map(c => c.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    if (min === max) return `$${min.toFixed(0)}`;
    return `$${min.toFixed(0)} - $${max.toFixed(0)}`;
  }

  if (game.deposit_amount && game.deposit_amount > 0) {
    return `From $${game.deposit_amount.toFixed(0)}`;
  }

  return null;
}

/**
 * Get pricing type label.
 */
export function getPricingTypeLabel(type: string | undefined): string {
  switch (type) {
    case 'per_person': return 'per person';
    case 'flat_rate': return 'flat rate';
    case 'tiered': return 'tiered pricing';
    default: return '';
  }
}

/**
 * Strip HTML tags from text and decode HTML entities.
 * Useful for cleaning up API descriptions that contain HTML.
 */
export function stripHtml(html: string | null | undefined): string {
  if (!html) return '';

  // Remove HTML tags
  let text = html.replace(/<[^>]*>/g, '');

  // Decode common HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");

  // Clean up excessive whitespace
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}
