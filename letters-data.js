/**
 * letters-data.js
 * ─────────────────────────────────────────────────────────
 * Every time you publish a new letter, add an entry to the
 * TOP of this array (newest first).
 *
 * Fields:
 *   slug     → filename in /letters/ folder (no .html)
 *   title    → shown on homepage and Read Next
 *   date     → display date string
 *   tag      → category label (e.g. "Faith", "Building", "Letter")
 *   excerpt  → 1–2 sentence preview shown on homepage
 *   readTime → e.g. "2 min"
 */
const LOCAL_LETTERS = [

  //{
  // slug: 'april-25-2026',
  // title: 'On Giving Up',
  // date: 'April 25, 2026',
  // tag: 'Faith',
  // excerpt: 'God didn\'t bring you this far just to leave you. On why you can\'t give up now.',
  //readTime: '4 min',
  //},

  //{
  // slug: 'april-16-2026',
  // title: 'I Choose Your Way',
  // date: 'April 16, 2026',
  //tag: 'Faith',
  // excerpt: 'A letter to the Holy Ghost. I choose your way — even when it\'s not easy, even when the flesh resists.',
  // readTime: '2 min',
  //},

  // ── TEMPLATE: copy this block for each new letter ──────
  // {
  //   slug:     'your-letter-slug',        // matches /letters/your-letter-slug.html
  //   title:    'Your Letter Title',
  //   date:     'April 23, 2026',
  //   tag:      'Building',
  //   excerpt:  'One or two sentences that make someone want to read it.',
  //   readTime: '3 min',
  // },
];