/**
 * series-data.js
 * ─────────────────────────────────────────────────────────
 * Every time you publish a new day in a series, add it here.
 * Newest entries at the TOP of each edition's days array.
 *
 * status: 'live' | 'coming'
 *   live   → has a real page, shows as a clickable link
 *   coming → placeholder, shows as greyed out "Coming soon"
 */

const SERIES_DATA = [

  /* ═══════════════════════════════════════════════════════
     SERIES 1 — A Proverb A Day (APAD)
     Runs: May & October each year
     One chapter of Proverbs per day, 31 days
  ═══════════════════════════════════════════════════════ */
  {
    id: 'apad',
    title: 'A Proverb A Day',
    shortTitle: 'APAD',
    tagline: 'One chapter of Proverbs. Thirty-one days. Straight from the source.',
    description: 'Every success principle you\'ve ever read in a business book came from somewhere. This series goes straight to the source — one chapter of Proverbs a day, and what it actually means for your life right now.',
    color: '#C9A227',
    editions: [
      {
        id: 'apad-e3',
        label: 'Edition 3',
        period: 'May 2026',
        status: 'live',
        days: [
          {
            day: 0,
            title: 'Welcome to APAD Edition 3',
            date: 'May 1, 2026',
            slug: 'series/apad/edition-3/day-00.html',
            status: 'live',
          },
          // ── Add new days below as you publish them ──────
          // {
          //   day:    1,
          //   title:  'Proverbs 1 — The Beginning of Wisdom',
          //   date:   'May 2, 2026',
          //   slug:   'series/apad/edition-3/day-01.html',
          //   status: 'live',
          // },
        ],
      },
      {
        id: 'apad-e2',
        label: 'Edition 2',
        period: 'October 2025',
        status: 'complete',
        days: [
          // Add your October 2025 entries here if you have them
        ],
      },
      {
        id: 'apad-e1',
        label: 'Edition 1',
        period: 'May 2025',
        status: 'complete',
        days: [
          // Add your May 2025 entries here if you have them
        ],
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════
     SERIES 2 — 31 Days of Empowered Wisdom
     Runs: July each year
     Bite-sized journal entries on clarity, growth, lessons
  ═══════════════════════════════════════════════════════ */
  {
    id: 'wisdom',
    title: '31 Days of Empowered Wisdom',
    shortTitle: 'Empowered Wisdom',
    tagline: 'Thirty-one days of bite-sized journal entries on clarity, growth, and the lessons in between.',
    description: 'Notes from my journals. Not polished theories — real lessons from real wrestling. Thirty-one days, one entry at a time, on what it means to grow, lead, and live with intention.',
    color: '#7A5C2E',
    editions: [
      {
        id: 'wisdom-e2',
        label: 'Edition 2',
        period: 'July 2026',
        status: 'coming',
        days: [
          {
            day: 0,
            title: 'Edition 2 is Coming — July 2026',
            date: 'July 1, 2026',
            slug: 'series/wisdom/edition-2/day-00.html',
            status: 'coming',
          },
        ],
      },
      {
        id: 'wisdom-e1',
        label: 'Edition 1',
        period: 'July 2025',
        status: 'complete',
        days: [
          // Add your July 2025 entries here if you have them
        ],
      },
    ],
  },

];