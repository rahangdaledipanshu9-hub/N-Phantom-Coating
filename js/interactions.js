/**
 * N-PHANTOM COATING — interactions.js
 * Supplementary UX: form validation, mobile menu, contact form, search,
 * image lazy-loading, typewriter effect, and API-integration patterns.
 */

'use strict';

/* ── Typewriter Effect ───────────────────────────────────────── */

/**
 * Cycle through strings with a typewriter animation.
 * @param {string}   targetId   ID of element to write into
 * @param {string[]} strings    Array of strings to cycle through
 * @param {object}   [opts]
 * @param {number}   [opts.typeSpeed=80]    ms per character
 * @param {number}   [opts.eraseSpeed=40]   ms per character
 * @param {number}   [opts.pause=2000]      ms to pause after full string
 */
function typewriter(targetId, strings, opts = {}) {
  const el = document.getElementById(targetId);
  if (!el || !strings.length) return;

  const { typeSpeed = 80, eraseSpeed = 40, pause = 2000 } = opts;
  let strIdx  = 0;
  let charIdx = 0;
  let erasing = false;

  function tick() {
    const current = strings[strIdx];

    if (!erasing) {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        erasing = true;
        setTimeout(tick, pause);
        return;
      }
      setTimeout(tick, typeSpeed);
    } else {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        erasing  = false;
        strIdx   = (strIdx + 1) % strings.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, eraseSpeed);
    }
  }

  tick();
}

/* ── Contact / Enquiry Form Validation ───────────────────────── */

class ContactForm {
  /**
   * @param {string} formId
   */
  constructor(formId) {
    this.form = document.getElementById(formId);
    if (!this.form) return;
    this._bindEvents();
  }

  _bindEvents() {
    this.form.addEventListener('submit', e => {
      e.preventDefault();
      if (this._validate()) this._submit();
    });

    // Real-time inline validation
    this.form.querySelectorAll('input, textarea, select').forEach(field => {
      field.addEventListener('blur', () => this._validateField(field));
      field.addEventListener('input', () => this._clearError(field));
    });
  }

  _validate() {
    let valid = true;
    this.form.querySelectorAll('[required]').forEach(field => {
      if (!this._validateField(field)) valid = false;
    });
    return valid;
  }

  _validateField(field) {
    const value = field.value.trim();
    let error   = null;

    if (field.required && !value) {
      error = 'This field is required.';
    } else if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      error = 'Please enter a valid email address.';
    } else if (field.minLength > 0 && value.length < field.minLength) {
      error = `Minimum ${field.minLength} characters required.`;
    }

    if (error) {
      this._showError(field, error);
      return false;
    }
    this._clearError(field);
    return true;
  }

  _showError(field, message) {
    this._clearError(field);
    field.classList.add('error');
    const msg = document.createElement('span');
    msg.className   = 'field-error';
    msg.textContent = message;
    msg.style.cssText = 'display:block;color:#f87171;font-size:12px;margin-top:4px;font-family:var(--font-mono)';
    field.parentNode.appendChild(msg);
  }

  _clearError(field) {
    field.classList.remove('error');
    const err = field.parentNode.querySelector('.field-error');
    if (err) err.remove();
  }

  /**
   * Simulate form submission (replace with real fetch/POST in production).
   */
  async _submit() {
    const btn  = this.form.querySelector('[type="submit"]');
    const data = Object.fromEntries(new FormData(this.form));

    if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

    try {
      // ── API Integration Pattern ──────────────────────────────
      // Replace the simulated delay with a real API call, e.g.:
      //
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      // if (!response.ok) throw new Error(response.statusText);
      // const result = await response.json();

      await new Promise(r => setTimeout(r, 1200)); // simulated latency
      console.info('[ContactForm] Submission data:', data); // dev log

      this.form.reset();
      if (window.showToast) window.showToast('Enquiry sent successfully! We\'ll be in touch.', 'success');
    } catch (err) {
      if (window.showToast) window.showToast('Submission failed — please try again.', 'error');
      console.error('[ContactForm] Error:', err);
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = 'Send Enquiry'; }
    }
  }
}

/* ── Keyboard-Accessible Dropdown Menus ─────────────────────── */

function initDropdowns() {
  document.querySelectorAll('.dropdown').forEach(dropdown => {
    const trigger = dropdown.querySelector('.dropdown-trigger');
    const menu    = dropdown.querySelector('.dropdown-menu');
    if (!trigger || !menu) return;

    function toggle(open) {
      menu.hidden = !open;
      trigger.setAttribute('aria-expanded', String(open));
    }

    trigger.addEventListener('click', e => {
      e.stopPropagation();
      toggle(menu.hidden);
    });

    // Keyboard navigation within the menu
    menu.addEventListener('keydown', e => {
      const items = [...menu.querySelectorAll('[role="menuitem"]')];
      const idx   = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); items[Math.min(idx + 1, items.length - 1)]?.focus(); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); items[Math.max(idx - 1, 0)]?.focus(); }
      if (e.key === 'Escape')    { toggle(false); trigger.focus(); }
    });

    document.addEventListener('click', () => toggle(false));
  });
}

/* ── Search / Filter ─────────────────────────────────────────── */

/**
 * Live filter for a list of cards/items.
 * @param {string} inputId     ID of search <input>
 * @param {string} listSelector  CSS selector for filterable items
 * @param {string} [textSelector=''] Sub-selector for text content (or '' for full item)
 */
function initSearch(inputId, listSelector, textSelector = '') {
  const input = document.getElementById(inputId);
  const items = [...document.querySelectorAll(listSelector)];
  if (!input || !items.length) return;

  input.addEventListener('input', () => {
    const query = input.value.toLowerCase().trim();
    let visible = 0;
    items.forEach(item => {
      const text = textSelector
        ? item.querySelector(textSelector)?.textContent.toLowerCase() || ''
        : item.textContent.toLowerCase();
      const match = !query || text.includes(query);
      item.hidden = !match;
      if (match) visible++;
    });

    // Update empty-state message if present
    const empty = document.getElementById(`${inputId}-empty`);
    if (empty) empty.hidden = visible > 0;
  });
}

/* ── Lazy Loading Images ─────────────────────────────────────── */

function initLazyImages() {
  if (!('IntersectionObserver' in window)) {
    // Fallback: load all images immediately
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });

  document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
}

/* ── Back-to-Top Button ──────────────────────────────────────── */

function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Theme Toggle (light/dark) ───────────────────────────────── */

function initThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  const stored = localStorage.getItem('nphantom-theme');
  if (stored === 'light') document.documentElement.classList.add('light');

  btn.addEventListener('click', () => {
    const isLight = document.documentElement.classList.toggle('light');
    localStorage.setItem('nphantom-theme', isLight ? 'light' : 'dark');
    btn.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
  });
}

/* ── Print-ready spec sheet ──────────────────────────────────── */

function initPrintButton() {
  const btn = document.getElementById('print-spec');
  if (!btn) return;
  btn.addEventListener('click', () => window.print());
}

/* ── Notification permission (for future push notifications) ── */

async function requestNotificationPermission() {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'default') {
    await Notification.requestPermission();
  }
}

/* ── API Integration Helpers ─────────────────────────────────── */

/**
 * Generic fetch wrapper with timeout, retry, and error handling.
 * @param {string} url
 * @param {RequestInit} [options]
 * @param {object}  [cfg]
 * @param {number}  [cfg.timeout=8000]  Timeout in ms
 * @param {number}  [cfg.retries=2]
 * @returns {Promise<any>} Parsed JSON
 */
async function apiFetch(url, options = {}, { timeout = 8000, retries = 2 } = {}) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer      = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timer);
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      return await response.json();
    } catch (err) {
      clearTimeout(timer);
      lastError = err;
      if (err.name === 'AbortError') throw new Error('Request timed out.');
      if (attempt < retries) await new Promise(r => setTimeout(r, 500 * (attempt + 1)));
    }
  }
  throw lastError;
}

window.apiFetch = apiFetch;

/* ── Cookie Consent Banner ───────────────────────────────────── */

function initCookieBanner() {
  if (localStorage.getItem('cookies-accepted')) return;

  const banner = document.createElement('div');
  banner.id    = 'cookie-banner';
  banner.style.cssText = [
    'position:fixed', 'bottom:0', 'left:0', 'right:0',
    'background:rgba(10,14,39,0.97)', 'border-top:1px solid rgba(100,180,255,0.2)',
    'padding:16px 32px', 'display:flex', 'align-items:center', 'justify-content:space-between',
    'gap:16px', 'z-index:3000', 'font-size:14px', 'flex-wrap:wrap',
  ].join(';');

  banner.innerHTML = `
    <span style="color:#b0b0d0">
      We use cookies to improve your experience. 
      <a href="#" style="color:#64b4ff">Learn more</a>
    </span>
    <button id="cookie-accept" style="
      padding:8px 24px; background:linear-gradient(135deg,#64b4ff,#ff6b9d);
      border:none; border-radius:50px; color:#0a0e27; font-weight:700;
      cursor:pointer; font-size:13px; white-space:nowrap
    ">Accept</button>`;

  document.body.appendChild(banner);

  document.getElementById('cookie-accept').addEventListener('click', () => {
    localStorage.setItem('cookies-accepted', '1');
    banner.remove();
  });
}

/* ── Bootstrap ───────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  // Typewriter for hero heading (if element exists)
  typewriter('typewriter-target', [
    'Redefining Stealth.',
    'Indigenous Defence.',
    'Cost-Efficient Coating.',
    'N-Phantom Technology.',
  ]);

  new ContactForm('contact-form');
  initDropdowns();
  initSearch('product-search', '.product-card', 'h3');
  initLazyImages();
  initBackToTop();
  initThemeToggle();
  initPrintButton();
  initCookieBanner();
});
