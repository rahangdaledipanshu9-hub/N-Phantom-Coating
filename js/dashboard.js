/**
 * N-PHANTOM COATING — dashboard.js
 * Coating specification calculator, layer visualizer, and chart rendering
 * Pure vanilla JS (ES6+), no external chart libraries required.
 */

'use strict';

/* ── Coating Material Database ───────────────────────────────── */

/** Default performance targets */
const PERFORMANCE_TARGETS = {
  rcsReduction:   15,   // dB
  thermalEmiss:    0.3,
  adhesionMPa:     5,
  saltSprayHrs:  500,
};

/**
 * Simplified physics-based estimation model.
 * In production this would call a backend API.
 */
const CoatingModel = {
  /**
   * Estimate RCS reduction given composition ratios (total should ≈ 100).
   * @param {{resin: number, oxide: number, ferrite: number, dispersant: number}} comp
   * @returns {number} Estimated dB reduction
   */
  calcRCS(comp) {
    const ferriteFactor  = comp.ferrite  * 0.42;
    const oxideFactor    = comp.oxide    * 0.18;
    const resinPenalty   = Math.max(0, comp.resin - 40) * 0.15;
    return Math.min(ferriteFactor + oxideFactor - resinPenalty, 30);
  },

  /**
   * Estimate thermal emissivity.
   * @param {{resin: number, oxide: number, ferrite: number}} comp
   * @returns {number} Dimensionless (0–1)
   */
  calcThermalEmissivity(comp) {
    const base  = 0.85 - (comp.oxide * 0.008) - (comp.ferrite * 0.006);
    return Math.max(0.05, Math.min(base, 0.95));
  },

  /**
   * Estimate adhesion strength (MPa).
   * @param {{resin: number, dispersant: number}} comp
   * @param {string} primerType
   * @returns {number}
   */
  calcAdhesion(comp, primerType) {
    const primerBonus = { epoxy: 2.5, polyurethane: 1.8, acrylic: 1.2 };
    const bonus = primerBonus[primerType] || 1.0;
    return Math.min((comp.resin * 0.12 + comp.dispersant * 0.25) + bonus, 20);
  },

  /**
   * Rough salt-spray estimate (hours).
   * @param {{resin: number}} comp
   * @returns {number}
   */
  calcSaltSpray(comp) {
    return Math.round(comp.resin * 14 + 50);
  },
};

/* ── Specification Calculator ────────────────────────────────── */

class SpecCalculator {
  constructor() {
    this.form    = document.getElementById('spec-form');
    this.results = document.getElementById('spec-results');
    if (!this.form) return;

    this._bindEvents();
    this._calculate(); // initial render
  }

  _bindEvents() {
    // Re-calculate on any input change (debounced)
    this.form.addEventListener('input', this._debounce(() => this._calculate(), 250));
    this.form.addEventListener('change', () => this._calculate());

    const exportBtn = document.getElementById('export-spec');
    if (exportBtn) exportBtn.addEventListener('click', () => this._exportSpec());
  }

  _getValue(id) {
    const el = document.getElementById(id);
    return el ? (el.type === 'range' ? parseFloat(el.value) : el.value) : null;
  }

  /** Read form state and run calculations */
  _calculate() {
    const comp = {
      resin:      this._getValue('resin-pct')      || 40,
      oxide:      this._getValue('oxide-pct')      || 35,
      ferrite:    this._getValue('ferrite-pct')    || 20,
      dispersant: this._getValue('dispersant-pct') || 5,
    };

    const primerType     = this._getValue('primer-type')    || 'epoxy';
    const layerThickness = this._getValue('layer-thickness') || 200;

    // Run models
    const rcs         = CoatingModel.calcRCS(comp).toFixed(1);
    const emissivity  = CoatingModel.calcThermalEmissivity(comp).toFixed(3);
    const adhesion    = CoatingModel.calcAdhesion(comp, primerType).toFixed(1);
    const saltSpray   = CoatingModel.calcSaltSpray(comp);
    const totalWeight = (((comp.resin + comp.oxide + comp.ferrite + comp.dispersant) * layerThickness) / 10000).toFixed(2);

    this._updateResultsPanel({ rcs, emissivity, adhesion, saltSpray, totalWeight });
    this._updateKPIs({ rcs, emissivity, adhesion, saltSpray });
    this._updateBars(comp);
    this._updateLayerViz(comp, layerThickness, primerType);
    this._updateSliderLabels();
  }

  _updateResultsPanel(metrics) {
    if (!this.results) return;

    const rows = [
      ['RCS Reduction',     `${metrics.rcs} dB`,        metrics.rcs >= PERFORMANCE_TARGETS.rcsReduction],
      ['Thermal Emissivity', metrics.emissivity,          parseFloat(metrics.emissivity) <= PERFORMANCE_TARGETS.thermalEmiss],
      ['Adhesion Strength', `${metrics.adhesion} MPa`,   metrics.adhesion >= PERFORMANCE_TARGETS.adhesionMPa],
      ['Salt Spray Est.',   `${metrics.saltSpray} hrs`,  metrics.saltSpray >= PERFORMANCE_TARGETS.saltSprayHrs],
      ['Coating Weight',    `${metrics.totalWeight} g/m²`, true],
    ];

    this.results.innerHTML = `
      <h4>Calculated Properties</h4>
      ${rows.map(([key, val, pass]) => `
        <div class="result-row">
          <span class="result-key">${key}</span>
          <span class="result-value">
            <span class="badge ${pass ? 'badge-success' : 'badge-warning'}">${val}</span>
          </span>
        </div>`).join('')}`;
  }

  _updateKPIs(metrics) {
    const map = {
      'kpi-rcs':       `${metrics.rcs} dB`,
      'kpi-emiss':     metrics.emissivity,
      'kpi-adhesion':  `${metrics.adhesion} MPa`,
      'kpi-salt':      `${metrics.saltSpray} h`,
    };
    Object.entries(map).forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    });
  }

  _updateBars(comp) {
    const fields = ['resin', 'oxide', 'ferrite', 'dispersant'];
    fields.forEach(name => {
      const fill = document.getElementById(`bar-${name}`);
      if (fill) fill.style.width = `${comp[name]}%`;
      const label = document.getElementById(`bar-val-${name}`);
      if (label) label.textContent = `${comp[name]}%`;
    });
  }

  _updateLayerViz(comp, thickness, primerType) {
    const viz = document.getElementById('layer-viz');
    if (!viz) return;
    const ferritePct = comp.ferrite;
    const oxidePct   = comp.oxide;
    const topHeight  = Math.max(30, Math.round(thickness * 0.6));
    const baseHeight = Math.max(20, Math.round(thickness * 0.4));

    // Whitelist-sanitise primerType to prevent XSS via DOM injection
    const ALLOWED_PRIMERS = new Set(['epoxy', 'polyurethane', 'acrylic']);
    const safePrimer = ALLOWED_PRIMERS.has(primerType) ? primerType : 'epoxy';
    const primerLabel = safePrimer.charAt(0).toUpperCase() + safePrimer.slice(1);

    // Build DOM nodes directly to avoid innerHTML with interpolated data
    viz.textContent = ''; // clear safely

    const makeStrip = (classes, minHeight, dotColor, tooltip, labelText) => {
      const strip = document.createElement('div');
      strip.className = classes;
      strip.style.minHeight = `${minHeight}px`;
      strip.setAttribute('data-tooltip', tooltip); // tooltip is plain text, no HTML
      const dot = document.createElement('span');
      dot.className = 'layer-dot';
      dot.style.background = dotColor;
      strip.appendChild(dot);
      strip.appendChild(document.createTextNode(' ' + labelText));
      return strip;
    };

    viz.appendChild(makeStrip(
      'layer-strip layer-functional',
      topHeight,
      'var(--color-secondary)',
      `Functional Layer — ${ferritePct}% ferrite, ${oxidePct}% oxide`,
      `Functional Layer · ${topHeight} µm`,
    ));
    viz.appendChild(makeStrip(
      'layer-strip layer-primer',
      baseHeight,
      'var(--color-primary)',
      `${primerLabel} primer`,
      `${primerLabel} Primer · ${baseHeight} µm`,
    ));
    viz.appendChild(makeStrip(
      'layer-strip layer-substrate',
      0,
      'var(--color-dim)',
      'Metal/composite substrate',
      'Substrate',
    ));
  }

  _updateSliderLabels() {
    document.querySelectorAll('[data-slider-label]').forEach(label => {
      const id = label.dataset.sliderLabel;
      const input = document.getElementById(id);
      if (input) label.textContent = input.value;
    });
  }

  /** Export specification as JSON download */
  _exportSpec() {
    const comp = {
      resin:      this._getValue('resin-pct'),
      oxide:      this._getValue('oxide-pct'),
      ferrite:    this._getValue('ferrite-pct'),
      dispersant: this._getValue('dispersant-pct'),
    };
    const spec = {
      timestamp:       new Date().toISOString(),
      primerType:      this._getValue('primer-type'),
      layerThickness:  this._getValue('layer-thickness'),
      composition:     comp,
      estimatedRCS:    CoatingModel.calcRCS(comp).toFixed(1) + ' dB',
      thermalEmiss:    CoatingModel.calcThermalEmissivity(comp).toFixed(3),
      adhesion:        CoatingModel.calcAdhesion(comp, this._getValue('primer-type') || 'epoxy').toFixed(1) + ' MPa',
    };

    const blob = new Blob([JSON.stringify(spec, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `nphantom-spec-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    if (window.showToast) window.showToast('Specification exported!', 'success');
  }

  /** Simple debounce */
  _debounce(fn, ms) {
    let timer;
    return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); };
  }
}

/* ── Frequency vs. Performance Chart (canvas) ───────────────── */

class FrequencyChart {
  /**
   * @param {string} canvasId  ID of <canvas> element
   */
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx    = this.canvas.getContext('2d');
    this._resizeObserver();
    this._draw();
  }

  _resizeObserver() {
    if (typeof ResizeObserver === 'undefined') return;
    new ResizeObserver(() => this._draw()).observe(this.canvas.parentElement);
  }

  /** Generate fake but plausible S11 data (dB) for 2–18 GHz */
  _generateData() {
    const freqs = [];
    const values = [];
    for (let f = 2; f <= 18; f += 0.5) {
      freqs.push(f);
      // Simulated absorption curve
      const val = -5 - 12 * Math.exp(-Math.pow((f - 10) / 3, 2))
                     - 6  * Math.exp(-Math.pow((f -  5) / 2, 2));
      values.push(val);
    }
    return { freqs, values };
  }

  _draw() {
    const canvas = this.canvas;
    const parent = canvas.parentElement;
    canvas.width  = parent.clientWidth || 400;
    canvas.height = 220;

    const ctx    = this.ctx;
    const { freqs, values } = this._generateData();
    const W = canvas.width;
    const H = canvas.height;
    const PAD = { top: 20, right: 20, bottom: 36, left: 50 };

    const minV = -25, maxV = 0;
    const scaleX = (f) => PAD.left + ((f - freqs[0]) / (freqs[freqs.length - 1] - freqs[0])) * (W - PAD.left - PAD.right);
    const scaleY = (v) => PAD.top  + ((maxV - v) / (maxV - minV)) * (H - PAD.top - PAD.bottom);

    ctx.clearRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = 'rgba(100,180,255,0.08)';
    ctx.lineWidth   = 1;
    for (let v = minV; v <= maxV; v += 5) {
      ctx.beginPath();
      ctx.moveTo(PAD.left, scaleY(v));
      ctx.lineTo(W - PAD.right, scaleY(v));
      ctx.stroke();
    }

    // Axis labels (Y)
    ctx.fillStyle  = 'rgba(176,176,208,0.7)';
    ctx.font       = '10px Space Mono, monospace';
    ctx.textAlign  = 'right';
    for (let v = minV; v <= maxV; v += 5) {
      ctx.fillText(`${v}`, PAD.left - 6, scaleY(v) + 3);
    }

    // Axis labels (X)
    ctx.textAlign = 'center';
    for (let f = 2; f <= 18; f += 4) {
      ctx.fillText(`${f}`, scaleX(f), H - PAD.bottom + 16);
    }
    ctx.fillText('Frequency (GHz)', W / 2, H - 2);

    // Y axis label
    ctx.save();
    ctx.translate(12, H / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText('S11 (dB)', 0, 0);
    ctx.restore();

    // Fill under curve
    const gradient = ctx.createLinearGradient(0, PAD.top, 0, H - PAD.bottom);
    gradient.addColorStop(0,   'rgba(100,180,255,0.25)');
    gradient.addColorStop(1,   'rgba(255,107,157,0.05)');
    ctx.beginPath();
    ctx.moveTo(scaleX(freqs[0]), H - PAD.bottom);
    freqs.forEach((f, i) => ctx.lineTo(scaleX(f), scaleY(values[i])));
    ctx.lineTo(scaleX(freqs[freqs.length - 1]), H - PAD.bottom);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.lineWidth   = 2.5;
    ctx.strokeStyle = '#64b4ff';
    ctx.lineJoin    = 'round';
    freqs.forEach((f, i) => {
      i === 0 ? ctx.moveTo(scaleX(f), scaleY(values[i]))
              : ctx.lineTo(scaleX(f), scaleY(values[i]));
    });
    ctx.stroke();

    // Target line at -15 dB
    ctx.setLineDash([6, 4]);
    ctx.strokeStyle = 'rgba(255,107,157,0.6)';
    ctx.lineWidth   = 1.5;
    ctx.beginPath();
    ctx.moveTo(PAD.left, scaleY(-15));
    ctx.lineTo(W - PAD.right, scaleY(-15));
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = 'rgba(255,107,157,0.8)';
    ctx.font      = '10px Space Mono, monospace';
    ctx.textAlign = 'left';
    ctx.fillText('Target: −15 dB', PAD.left + 4, scaleY(-15) - 5);
  }
}

/* ── Radar Chart ─────────────────────────────────────────────── */

class RadarChart {
  /**
   * @param {string} canvasId
   * @param {Array<{label: string, value: number, max: number}>} axes
   */
  constructor(canvasId, axes) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx  = this.canvas.getContext('2d');
    this.axes = axes;
    this._draw();
  }

  _draw() {
    const canvas = this.canvas;
    const SIZE   = Math.min(canvas.parentElement.clientWidth, 280);
    canvas.width  = SIZE;
    canvas.height = SIZE;

    const ctx    = this.ctx;
    const cx     = SIZE / 2;
    const cy     = SIZE / 2;
    const radius = SIZE * 0.36;
    const n      = this.axes.length;

    ctx.clearRect(0, 0, SIZE, SIZE);

    // Grid rings
    for (let r = 1; r <= 5; r++) {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(100,180,255,0.12)';
      ctx.lineWidth   = 1;
      for (let i = 0; i < n; i++) {
        const angle = (2 * Math.PI * i / n) - Math.PI / 2;
        const px    = cx + (radius * r / 5) * Math.cos(angle);
        const py    = cy + (radius * r / 5) * Math.sin(angle);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    }

    // Spokes
    for (let i = 0; i < n; i++) {
      const angle = (2 * Math.PI * i / n) - Math.PI / 2;
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(100,180,255,0.15)';
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
      ctx.stroke();
    }

    // Data polygon
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    gradient.addColorStop(0,   'rgba(100,180,255,0.3)');
    gradient.addColorStop(1,   'rgba(255,107,157,0.2)');

    ctx.beginPath();
    this.axes.forEach(({ value, max }, i) => {
      const angle = (2 * Math.PI * i / n) - Math.PI / 2;
      const r     = radius * (value / max);
      const px    = cx + r * Math.cos(angle);
      const py    = cy + r * Math.sin(angle);
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    });
    ctx.closePath();
    ctx.fillStyle   = gradient;
    ctx.fill();
    ctx.strokeStyle = '#64b4ff';
    ctx.lineWidth   = 2;
    ctx.stroke();

    // Labels
    ctx.fillStyle = 'rgba(232,232,232,0.9)';
    ctx.font      = '11px Space Mono, monospace';
    ctx.textAlign = 'center';
    this.axes.forEach(({ label }, i) => {
      const angle  = (2 * Math.PI * i / n) - Math.PI / 2;
      const offset = radius + 22;
      ctx.fillText(label, cx + offset * Math.cos(angle), cy + offset * Math.sin(angle) + 4);
    });
  }
}

/* ── Sidebar Navigation ──────────────────────────────────────── */

function initDashboardNav() {
  const links    = document.querySelectorAll('.sidebar-nav-item a[data-section]');
  const sections = document.querySelectorAll('.dash-section');

  function activate(sectionId) {
    sections.forEach(s => s.classList.toggle('hidden', s.id !== sectionId));
    links.forEach(l => l.closest('.sidebar-nav-item').classList.toggle(
      'active', l.dataset.section === sectionId
    ));
  }

  links.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const id = link.dataset.section;
      activate(id);
      history.replaceState(null, '', `#${id}`);
    });
  });

  // Activate from URL hash or default
  const hash    = location.hash.replace('#', '');
  const initial = [...sections].find(s => s.id === hash) ? hash
                : (sections[0] ? sections[0].id : null);
  if (initial) activate(initial);
}

/* ── Bootstrap ───────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  new SpecCalculator();
  new FrequencyChart('freq-chart');
  new RadarChart('radar-chart', [
    { label: 'RCS',       value: 80, max: 100 },
    { label: 'Thermal',   value: 72, max: 100 },
    { label: 'Adhesion',  value: 85, max: 100 },
    { label: 'Durability',value: 78, max: 100 },
    { label: 'Weight',    value: 65, max: 100 },
    { label: 'Cost',      value: 90, max: 100 },
  ]);
  initDashboardNav();
});

// Local helper ($$  is also defined in script.js — use querySelectorAll directly if needed)
function dashboardQSA(sel, root = document) { return [...root.querySelectorAll(sel)]; }
