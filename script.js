const CK_FORM_ID = '9309551';
const CK_API_KEY = 'f2U68EiotKULkh4VwNBmkQ';

const LETTERS_ENDPOINT = '/api/get-letters';

const SUCCESS_MSG = `
  Check your email + SPAM folder in the next 2 minutes for your
  confirmation email because sometimes things get a little <em>"spammy!"</em>
`;

/* ─────────────────────────────────────────────────────────── */
/*  Subscribe Handler                                          */
/* ─────────────────────────────────────────────────────────── */
async function handleSubscribe(emailId, messageId, formWrapId) {
  const emailInput = document.getElementById(emailId);
  const messageEl = document.getElementById(messageId);
  const formWrap = document.getElementById(formWrapId);

  if (!emailInput || !messageEl) return;

  const email = emailInput.value.trim();
  if (!email || !email.includes('@')) {
    showMessage(messageEl, 'error', 'Please enter a valid email address.');
    return;
  }

  const btn = emailInput.closest('[class*="form"]')?.querySelector('button')
    || formWrap?.querySelector('button');
  if (btn) { btn.disabled = true; btn.textContent = 'Subscribing…'; }

  try {
    const res = await fetch(
      `https://api.convertkit.com/v3/forms/${CK_FORM_ID}/subscribe`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: CK_API_KEY, email }),
      }
    );
    const data = await res.json();

    if (res.ok && data.subscription) {
      const formEl = formWrap?.querySelector('.subscribe-block__form')
        || formWrap?.querySelector('.subscribe-block');
      if (formEl) formEl.style.display = 'none';
      showMessage(messageEl, 'success', SUCCESS_MSG);
    } else {
      showMessage(messageEl, 'error', data.message || 'Something went wrong. Try again.');
      if (btn) { btn.disabled = false; btn.textContent = 'Subscribe'; }
    }
  } catch (err) {
    showMessage(messageEl, 'error', 'Network error. Please try again.');
    if (btn) { btn.disabled = false; btn.textContent = 'Subscribe'; }
  }
}

function showMessage(el, type, html) {
  el.className = `subscribe-message ${type}`;
  el.innerHTML = html;
  el.style.display = 'block';
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ─────────────────────────────────────────────────────────── */
/*  Letters + Category Filter                                  */
/*  LOCAL_LETTERS removed — always fetches live from CK API   */
/* ─────────────────────────────────────────────────────────── */
let ALL_LETTERS = [];
let activeCategory = 'All';

function loadLetters() {
  const skeleton = document.getElementById('letters-skeleton');
  const list = document.getElementById('letters-list');
  const errorEl = document.getElementById('letters-error');

  if (!list) return;

  // Always fetch live from the API — no LOCAL_LETTERS fallback
  fetchFromConvertKit(skeleton, list, errorEl);
}

async function fetchFromConvertKit(skeleton, list, errorEl) {
  try {
    const res = await fetch(LETTERS_ENDPOINT);
    const data = await res.json();

    if (!res.ok || !data.broadcasts) throw new Error('No broadcasts returned');

    ALL_LETTERS = data.broadcasts.map(b => ({
      id: b.id,
      title: b.subject || 'Untitled Letter',
      date: formatDate(b.published_at || b.created_at),
      excerpt: stripHtml(b.description || b.content || '').slice(0, 200),
      readTime: estimateReadTime(b.content || ''),
      tag: 'Letter', // ConvertKit doesn't return tags on broadcast list; default to "Letter"
    }));

    if (skeleton) skeleton.style.display = 'none';
    list.style.display = 'flex';

    buildCategoryFilters();
    renderFiltered();

  } catch (err) {
    console.error('Failed to load letters:', err);
    if (skeleton) skeleton.style.display = 'none';
    if (errorEl) errorEl.style.display = 'block';
  }
}

/* ── Category filters ─────────────────────────────────────── */
function buildCategoryFilters() {
  const container = document.getElementById('category-filters');
  if (!container) return;

  const tags = ['All', ...new Set(ALL_LETTERS.map(l => l.tag).filter(Boolean))];

  container.innerHTML = tags.map(tag => `
    <button
      class="${tag === activeCategory ? 'active' : ''}"
      onclick="setCategory('${tag}')"
    >${tag}</button>
  `).join('');
}

function setCategory(tag) {
  activeCategory = tag;
  buildCategoryFilters();
  renderFiltered();
}

function renderFiltered() {
  const list = document.getElementById('letters-list');
  if (!list) return;

  const filtered = activeCategory === 'All'
    ? ALL_LETTERS
    : ALL_LETTERS.filter(l => l.tag === activeCategory);

  if (filtered.length === 0) {
    list.innerHTML = `<p style="color:var(--ink-soft);font-size:0.9rem;">No letters in this category yet.</p>`;
    return;
  }

  list.innerHTML = filtered.map(renderCKCard).join('');
}

/* ── Card renderer ────────────────────────────────────────── */
function renderCKCard(letter) {
  // Link points to letter.html?id=<broadcast_id>
  const url = `letter.html?id=${letter.id}`;
  return `
    <article class="letter-card">
      <div class="letter-card__meta">
        <span class="letter-card__tag">${escapeHtml(letter.tag || 'Letter')}</span>
        <span class="letter-card__date">${escapeHtml(letter.date)}</span>
        ${letter.readTime ? `<span class="letter-card__read-time">${escapeHtml(letter.readTime)} read</span>` : ''}
      </div>
      <h2 class="letter-card__title">${escapeHtml(letter.title)}</h2>
      ${letter.excerpt ? `<p class="letter-card__excerpt">${escapeHtml(letter.excerpt)}</p>` : ''}
      <a class="letter-card__link" href="${url}">Read letter →</a>
    </article>
  `;
}

/* ─── Utility helpers ──────────────────────────────────────── */
function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
}

function stripHtml(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function estimateReadTime(content) {
  const words = stripHtml(content).split(/\s+/).filter(Boolean).length;
  if (!words) return '';
  return Math.max(1, Math.round(words / 200)) + ' min';
}

/* ─── Init ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  loadLetters();
  document.querySelectorAll('input[type="email"]').forEach(input => {
    input.addEventListener('keydown', e => {
      if (e.key !== 'Enter') return;
      input.closest('[class*="form"]')?.querySelector('button')?.click();
    });
  });
});