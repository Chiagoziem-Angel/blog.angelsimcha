
const CK_FORM_ID = '9309551';        // e.g. '7654321'
const CK_API_KEY = 'f2U68EiotKULkh4VwNBmkQ'; // e.g. 'abc123xyz'


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
/* ─────────────────────────────────────────────────────────── */
let ALL_LETTERS = [];          // holds full LOCAL_LETTERS array
let activeCategory = 'All';   // currently selected filter

function loadLetters() {
  const skeleton = document.getElementById('letters-skeleton');
  const list = document.getElementById('letters-list');
  const errorEl = document.getElementById('letters-error');

  if (!list) return;

  if (typeof LOCAL_LETTERS !== 'undefined' && LOCAL_LETTERS.length > 0) {
    ALL_LETTERS = LOCAL_LETTERS;
    if (skeleton) skeleton.style.display = 'none';
    list.style.display = 'flex';
    buildCategoryFilters();
    renderFiltered();
  } else {
    // Fallback: ConvertKit API (no category filters in this path)
    fetchFromConvertKit(skeleton, list, errorEl);
  }
}

/* Build "All · Faith · Building · …" filter buttons */
function buildCategoryFilters() {
  const container = document.getElementById('category-filters');
  if (!container) return;

  // Collect unique tags
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
  buildCategoryFilters();   // re-render buttons (updates active class)
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

  list.innerHTML = filtered.map(renderLocalLetterCard).join('');
}

/* ── Render helpers ───────────────────────────────────────── */
function renderLocalLetterCard(letter) {
  return `
    <article class="letter-card">
      <div class="letter-card__meta">
        <span class="letter-card__tag">${escapeHtml(letter.tag || 'Letter')}</span>
        <span class="letter-card__date">${escapeHtml(letter.date)}</span>
        ${letter.readTime ? `<span class="letter-card__read-time">${escapeHtml(letter.readTime)} read</span>` : ''}
      </div>
      <h2 class="letter-card__title">${escapeHtml(letter.title)}</h2>
      ${letter.excerpt ? `<p class="letter-card__excerpt">${escapeHtml(letter.excerpt)}</p>` : ''}
      <a class="letter-card__link" href="letters/${letter.slug}.html">Read letter →</a>
    </article>
  `;
}

async function fetchFromConvertKit(skeleton, list, errorEl) {
  try {
    const res = await fetch(LETTERS_ENDPOINT);
    const data = await res.json();
    if (!res.ok || !data.broadcasts) throw new Error();
    if (skeleton) skeleton.style.display = 'none';
    list.style.display = 'flex';
    list.innerHTML = data.broadcasts.slice(0, 6).map(renderCKCard).join('');
  } catch {
    if (skeleton) skeleton.style.display = 'none';
    if (errorEl) errorEl.style.display = 'block';
  }
}

function renderCKCard(broadcast) {
  const date = formatDate(broadcast.created_at || broadcast.published_at);
  const title = broadcast.subject || 'Untitled Letter';
  const excerpt = stripHtml(broadcast.description || broadcast.content || '').slice(0, 200);
  const rt = estimateReadTime(broadcast.content || '');
  const url = `letter.html?id=${broadcast.id}`;
  return `
    <article class="letter-card">
      <div class="letter-card__meta">
        <span class="letter-card__tag">Letter</span>
        <span class="letter-card__date">${date}</span>
        ${rt ? `<span class="letter-card__read-time">${rt} read</span>` : ''}
      </div>
      <h2 class="letter-card__title">${escapeHtml(title)}</h2>
      ${excerpt ? `<p class="letter-card__excerpt">${escapeHtml(excerpt)}</p>` : ''}
      <a class="letter-card__link" href="${url}">Read letter →</a>
    </article>
  `;
}

/* ─── Utility helpers ──────────────────────────────────────── */
function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function stripHtml(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
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