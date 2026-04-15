
const CK_FORM_ID  = '9309551';        // e.g. '7654321'
const CK_API_KEY  = 'f2U68EiotKULkh4VwNBmkQ'; // e.g. 'abc123xyz'


const LETTERS_ENDPOINT = '/api/get-letters';


const SUCCESS_MSG = `
  Check your email + SPAM folder in the next 2 minutes for your
  confirmation email because sometimes things get a little <em>"spammy!"</em>
`;

/* ─────────────────────────────────────────────────────────── */
/*  Subscribe Handler                                          */
/* ─────────────────────────────────────────────────────────── */
async function handleSubscribe(emailId, messageId, formWrapId) {
  const emailInput  = document.getElementById(emailId);
  const messageEl   = document.getElementById(messageId);
  const formWrap    = document.getElementById(formWrapId);

  if (!emailInput || !messageEl) return;

  const email = emailInput.value.trim();

  // Basic validation
  if (!email || !email.includes('@')) {
    showMessage(messageEl, 'error', 'Please enter a valid email address.');
    return;
  }

  // Disable input + button during request
  const btn = emailInput.closest('[class*="form"]')?.querySelector('button')
           || formWrap?.querySelector('button');
  if (btn) { btn.disabled = true; btn.textContent = 'Subscribing…'; }

  try {
    const res = await fetch('/api/subscribe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email }),
});

    const data = await res.json();

    if (res.ok && data.subscription) {
      // Hide the form, show success
      const formEl = formWrap?.querySelector('.subscribe-block__form')
                  || formWrap?.querySelector('.subscribe-block');
      if (formEl) formEl.style.display = 'none';

      showMessage(messageEl, 'success', SUCCESS_MSG);
    } else {
      const errMsg = data.message || 'Something went wrong. Try again.';
      showMessage(messageEl, 'error', errMsg);
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
/*  Fetch & Render Recent Letters                              */
/* ─────────────────────────────────────────────────────────── */
async function loadLetters() {
  const skeleton  = document.getElementById('letters-skeleton');
  const list      = document.getElementById('letters-list');
  const errorEl   = document.getElementById('letters-error');

  if (!list) return; // Not on the letters page

  try {
    const res  = await fetch(LETTERS_ENDPOINT);
    const data = await res.json();

    if (!res.ok || !data.broadcasts || data.broadcasts.length === 0) {
      throw new Error('No letters found');
    }

    // Hide skeleton, show list
    if (skeleton) skeleton.style.display = 'none';
    list.style.display = 'flex';

    list.innerHTML = data.broadcasts
      .slice(0, 6) // show latest 6
      .map(renderLetterCard)
      .join('');

  } catch (err) {
    if (skeleton) skeleton.style.display = 'none';
    if (errorEl)  errorEl.style.display  = 'block';
  }
}

function renderLetterCard(broadcast) {
  const date     = formatDate(broadcast.created_at || broadcast.published_at);
  const title    = broadcast.subject || 'Untitled Letter';
  const excerpt  = stripHtml(broadcast.description || broadcast.content || '').slice(0, 200);
  const url      = broadcast.public_url || '#';
  const readTime = estimateReadTime(broadcast.content || '');

  return `
    <article class="letter-card">
      <div class="letter-card__meta">
        <span class="letter-card__tag">Letter</span>
        <span class="letter-card__date">${date}</span>
        ${readTime ? `<span class="letter-card__read-time">${readTime} read</span>` : ''}
      </div>
      <h2 class="letter-card__title">${escapeHtml(title)}</h2>
      ${excerpt ? `<p class="letter-card__excerpt">${escapeHtml(excerpt)}</p>` : ''}
      <a
        class="letter-card__link"
        href="${url}"
        target="_blank"
        rel="noopener noreferrer"
      >
        Read letter →
      </a>
    </article>
  `;
}

/* ─── Utility helpers ──────────────────────────────────────── */
function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function stripHtml(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function estimateReadTime(content) {
  const words = stripHtml(content).split(/\s+/).filter(Boolean).length;
  if (!words) return '';
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min`;
}

/* ─── Init ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  loadLetters();

  // Allow pressing Enter in email fields
  document.querySelectorAll('input[type="email"]').forEach(input => {
    input.addEventListener('keydown', e => {
      if (e.key !== 'Enter') return;
      const btn = input.closest('[class*="form"]')?.querySelector('button');
      if (btn) btn.click();
    });
  });
});
