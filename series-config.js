/**
 * series-config.js
 * ─────────────────────────────────────────────────────────
 * THIS IS THE ONLY FILE YOU EDIT TO ADD A NEW SERIES.
 *
 * To add a new series:
 *   1. Copy one of the objects below
 *   2. Paste it at the bottom of the SERIES_CONFIG array
 *   3. Fill in the fields
 *   4. Save & deploy — everything updates automatically:
 *      ✓ Admin dropdown gets the new series
 *      ✓ Series page gets a new card
 *      ✓ Reader page recognises the new series label
 *
 * FIELDS:
 *   id          → short unique key, no spaces (e.g. 'apad', 'wisdom', 'letters31')
 *   title       → full display name
 *   shortTitle  → short label used in tags and pills
 *   tagline     → one bold line shown on the series card
 *   description → longer paragraph shown under the tagline
 *   color       → hex color for the tag and accent
 *   month       → when it runs each year (display only)
 *   editions    → array of edition objects (add a new one each year)
 *
 * EDITION FIELDS:
 *   num     → edition number (1, 2, 3…)
 *   label   → display label e.g. 'Edition 3'
 *   period  → when it ran e.g. 'May 2026'
 *   status  → 'live' | 'coming' | 'complete'
 */

const SERIES_CONFIG = [

  {
    id: 'apad',
    title: 'A Proverb A Day',
    shortTitle: 'APAD',
    tagline: 'One chapter of Proverbs. Thirty-one days. Straight from the source.',
    description: 'Every success principle you\'ve ever read in a business book came from somewhere. This series goes straight to the source — one chapter of Proverbs a day, and what it actually means for your life right now.',
    color: '#C9A227',
    month: 'May · October',
    editions: [
      { num: 3, label: 'Edition 3', period: 'May 2026', status: 'live' },
      { num: 2, label: 'Edition 2', period: 'October 2025', status: 'complete' },
      { num: 1, label: 'Edition 1', period: 'May 2025', status: 'complete' },
    ],
  },

  {
    id: 'wisdom',
    title: '31 Days of Empowered Wisdom',
    shortTitle: 'Empowered Wisdom',
    tagline: 'Thirty-one days of bite-sized journal entries on clarity, growth, and the lessons in between.',
    description: 'Notes from my journals — real lessons from real wrestling. Thirty-one days, one entry at a time, on what it means to grow, lead, and live with intention.',
    color: '#7A5C2E',
    month: 'July',
    editions: [
      { num: 2, label: 'Edition 2', period: 'July 2026', status: 'coming' },
      { num: 1, label: 'Edition 1', period: 'July 2025', status: 'complete' },
    ],
  },

  // ── ADD A NEW SERIES BELOW THIS LINE ──────────────────
  // {
  //   id:          'your-series-id',
  //   title:       'Your Full Series Title',
  //   shortTitle:  'Short Tag',
  //   tagline:     'One punchy line about the series.',
  //   description: 'A longer paragraph explaining what the series is about.',
  //   color:       '#4A7C59',
  //   month:       'October',
  //   editions: [
  //     { num: 1, label: 'Edition 1', period: 'October 2026', status: 'coming' },
  //   ],
  // },

];