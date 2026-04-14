/**
 * N-PHANTOM COATING — script.js
 * Core interactivity: navigation, scroll animations, smooth scrolling
 * ES6+ with no external runtime dependencies
 */

'use strict';

/* ── Utility Helpers ─────────────────────────────────────────── */

/**
 * Query a single element; throws if selector is invalid.
 * @param {string} selector
 * @param {ParentNode} [root=document]
 * @returns {Element|null}
 */
const $ = (selector, root = document) => root.querySelector(selector);

/**
 * Query all matching elements.
 * @param {string} selector
 * @param {ParentNode} [root=document]
 * @returns {Element[]}
 */
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

/**
 * Throttle a callback to at most once per `wait` milliseconds.
 * @param {Function} fn
 * @param {number} wait
 * @returns {Function}
 */
function throttle(fn, wait) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn(...args);
    }
  };
}

/* ── Mobile Navigation ───────────────────────────────────────── */

function initMobileNav() {
  const toggle   = $('.nav-toggle');
  const navLinks = $('.nav-links');
  if (!toggle || !navLinks) return;

  /** Open / close the mobile menu */
  function setOpen(open) {
    navLinks.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));

    // Animate hamburger → X
    const spans = $$('span', toggle);
    if (open) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  }

  toggle.addEventListener('click', () => setOpen(!navLinks.classList.contains('open')));

  // Close on outside click
  document.addEventListener('click', e => {
    if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
      setOpen(false);
    }
  });

  // Close after a link click
  $$('a', navLinks).forEach(a => a.addEventListener('click', () => setOpen(false)));
}

/* ── Sticky Navbar Shadow ────────────────────────────────────── */

function initNavbarScroll() {
  const navbar = $('.navbar');
  if (!navbar) return;

  const onScroll = throttle(() => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, 60);

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ── Smooth Scroll for Anchor Links ─────────────────────────── */

function initSmoothScroll() {
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ── Scroll-reveal Animations ────────────────────────────────── */

function initScrollReveal() {
  const elements = $$('.animate-on-scroll');
  if (!elements.length) return;

  // Assign stagger delay based on siblings
  elements.forEach(el => {
    const siblings = $$('.animate-on-scroll', el.parentElement);
    const idx = siblings.indexOf(el);
    el.style.transitionDelay = `${idx * 80}ms`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // fire once
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ── Active Nav Link Highlighting on Scroll ──────────────────── */

function initActiveNavHighlight() {
  const sections = $$('section[id]');
  const navLinks = $$('.nav-links a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const onScroll = throttle(() => {
    const scrollY = window.scrollY + window.innerHeight / 3;

    let current = '';
    sections.forEach(sec => {
      if (sec.offsetTop <= scrollY) current = sec.id;
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }, 80);

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // initial call
}

/* ── Counter Animation for Stats ────────────────────────────── */

/**
 * Animate a number from 0 to its target value.
 * @param {HTMLElement} el  Element containing the target text
 * @param {number} duration Animation duration in ms
 */
function animateCounter(el, duration = 2000) {
  const text = el.textContent.trim();
  // Extract numeric part, prefix/suffix preserved
  const match = text.match(/^([^0-9\-]*)([0-9.]+)([^0-9]*)$/);
  if (!match) return;

  const prefix = match[1];
  const target = parseFloat(match[2]);
  const suffix = match[3];
  const decimals = (match[2].includes('.')) ? match[2].split('.')[1].length : 0;
  const start    = performance.now();

  function step(now) {
    const elapsed  = Math.min(now - start, duration);
    const progress = elapsed / duration;
    // Ease-out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = (target * eased).toFixed(decimals);
    el.textContent = `${prefix}${current}${suffix}`;
    if (elapsed < duration) requestAnimationFrame(step);
  }

  el.textContent = `${prefix}0${suffix}`;
  requestAnimationFrame(step);
}

function initCounters() {
  const counters = $$('.spec-number, .kpi-value');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ── Hero Parallax ───────────────────────────────────────────── */

function initParallax() {
  const orbs = $$('.glow-orb');
  if (!orbs.length) return;

  const onScroll = throttle(() => {
    const y = window.scrollY;
    orbs.forEach((orb, i) => {
      const speed = i % 2 === 0 ? 0.15 : -0.1;
      orb.style.transform = `translateY(${y * speed}px)`;
    });
  }, 16);

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ── Accordion ───────────────────────────────────────────────── */

function initAccordion() {
  $$('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      const isOpen = item.classList.contains('open');

      // Close all siblings
      $$('.accordion-item', item.closest('.accordion')).forEach(i => {
        i.classList.remove('open');
        i.querySelector('.accordion-trigger')?.setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ── Tabs ────────────────────────────────────────────────────── */

function initTabs() {
  $$('.tabs').forEach(tabContainer => {
    const buttons = $$('.tab-btn', tabContainer);
    const panels  = $$('.tab-panel', tabContainer);

    buttons.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        if (panels[i]) panels[i].classList.add('active');
      });
    });

    // Activate first tab on init
    if (buttons[0]) buttons[0].click();
  });
}

/* ── Toast Notifications ─────────────────────────────────────── */

let toastContainer = null;

/**
 * Show a toast notification.
 * @param {string} message
 * @param {'success'|'error'|'info'} [type='info']
 * @param {number} [duration=4000]  Auto-dismiss delay in ms (0 = no auto-dismiss)
 */
function showToast(message, type = 'info', duration = 4000) {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || icons.info}</span>
                     <span>${message}</span>`;

  toastContainer.appendChild(toast);

  if (duration > 0) {
    setTimeout(() => {
      toast.classList.add('removing');
      toast.addEventListener('animationend', () => toast.remove(), { once: true });
    }, duration);
  }
}

// Expose globally for use in other scripts
window.showToast = showToast;

/* ── Modal ───────────────────────────────────────────────────── */

function initModals() {
  // Open triggers: <button data-modal-open="modal-id">
  $$('[data-modal-open]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.modalOpen;
      const overlay = $(`#${id}`);
      if (overlay) openModal(overlay);
    });
  });

  // Close button & backdrop click
  $$('.modal-overlay').forEach(overlay => {
    const closeBtn = $('.modal-close', overlay);
    if (closeBtn) closeBtn.addEventListener('click', () => closeModal(overlay));

    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal(overlay);
    });
  });

  // Keyboard: Escape to close
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const active = $('.modal-overlay.active');
      if (active) closeModal(active);
    }
  });
}

function openModal(overlay) {
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(overlay) {
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

window.openModal  = openModal;
window.closeModal = closeModal;

/* ── Progress Bars ───────────────────────────────────────────── */

function initProgressBars() {
  const fills = $$('.progress-bar-fill[data-value]');
  if (!fills.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const val = parseFloat(entry.target.dataset.value);
        entry.target.style.width = `${Math.min(Math.max(val, 0), 100)}%`;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(el => observer.observe(el));
}

/* ── Copy to Clipboard ───────────────────────────────────────── */

function initCopyButtons() {
  $$('[data-copy]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
        showToast('Copied to clipboard!', 'success');
      } catch {
        showToast('Copy failed – please copy manually.', 'error');
      }
    });
  });
}

/* ── Bootstrap ───────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initNavbarScroll();
  initSmoothScroll();
  initScrollReveal();
  initActiveNavHighlight();
  initCounters();
  initParallax();
  initAccordion();
  initTabs();
  initModals();
  initProgressBars();
  initCopyButtons();
});
