import { LitElement, html, css } from 'lit';

/**
 * @typedef {Object} Snowflake
 * @property {number} x - X position in pixels
 * @property {number} y - Y position in pixels
 * @property {number} radius - Flake radius in pixels
 * @property {number} speed - Fall speed in px/frame
 * @property {number} drift - Horizontal drift amplitude
 * @property {number} driftOffset - Phase offset for drift oscillation
 * @property {number} opacity - Opacity (0–1)
 */

/**
 * AnimationSnow - Canvas-based snow effect web component
 *
 * @element animation-snow
 * @fires animation-start - Fired when animation starts
 * @fires animation-stop - Fired when animation stops
 *
 * @cssprop --snow-z-index - Z-index of the canvas layer (default: 9999)
 */
export class AnimationSnow extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: var(--snow-z-index, 9999);
      opacity: 1;
      transition: opacity 0.8s ease;
    }

    canvas.hidden {
      opacity: 0;
    }
  `;

  static properties = {
    numSnowflakes: { type: Number, attribute: 'num-snowflakes' },
    speed: { type: Number },
    active: { type: Boolean, reflect: true },
  };

  constructor() {
    super();
    this.numSnowflakes = 200;
    this.speed = 2;
    this.active = true;

    /** @type {Snowflake[]} */
    this._flakes = [];
    this._canvas = null;
    this._ctx = null;
    this._animationFrame = null;
    this._lastTime = 0;
    this._tick = 0;
    this._resizeObserver = null;
    this._prefersReducedMotion = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this._prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._stopAnimation();
    this._removeResizeObserver();
  }

  firstUpdated() {
    this._canvas = this.shadowRoot.querySelector('canvas');
    this._ctx = this._canvas.getContext('2d');
    this._setupResizeObserver();
    this._resizeCanvas();
    this._initFlakes();
    if (!this._prefersReducedMotion) {
      this._startAnimation();
    }
  }

  updated(changedProperties) {
    if (changedProperties.has('numSnowflakes')) {
      this._initFlakes();
    }
  }

  // ── Canvas helpers ──────────────────────────────────────────────────────────

  _resizeCanvas() {
    if (!this._canvas) return;
    this._canvas.width = window.innerWidth;
    this._canvas.height = window.innerHeight;
  }

  _setupResizeObserver() {
    this._resizeObserver = new ResizeObserver(() => {
      this._resizeCanvas();
    });
    this._resizeObserver.observe(document.documentElement);
  }

  _removeResizeObserver() {
    this._resizeObserver?.disconnect();
    this._resizeObserver = null;
  }

  // ── Flake management ────────────────────────────────────────────────────────

  /** @returns {Snowflake} */
  _createFlake(atTop = false) {
    const w = this._canvas?.width ?? window.innerWidth;
    const h = this._canvas?.height ?? window.innerHeight;
    return {
      x: Math.random() * w,
      y: atTop ? -Math.random() * h * 0.1 : Math.random() * h,
      radius: 1.5 + Math.random() * 3,
      speed: (0.5 + Math.random() * 1.5) * this.speed,
      drift: 0.3 + Math.random() * 0.7,
      driftOffset: Math.random() * Math.PI * 2,
      opacity: 0.5 + Math.random() * 0.5,
    };
  }

  _initFlakes() {
    if (!this._canvas) return;
    this._flakes = Array.from({ length: this.numSnowflakes }, () => this._createFlake(false));
  }

  // ── Animation loop ──────────────────────────────────────────────────────────

  _startAnimation() {
    if (this._animationFrame) return;
    const loop = (timestamp) => {
      const dt = Math.min((timestamp - this._lastTime) / 16.67, 3);
      this._lastTime = timestamp;
      this._tick += 0.02;
      this._draw(dt);
      this._animationFrame = requestAnimationFrame(loop);
    };
    this._animationFrame = requestAnimationFrame(loop);
    this.dispatchEvent(new CustomEvent('animation-start', { bubbles: true, composed: true }));
  }

  _stopAnimation() {
    if (this._animationFrame) {
      cancelAnimationFrame(this._animationFrame);
      this._animationFrame = null;
    }
    this.dispatchEvent(new CustomEvent('animation-stop', { bubbles: true, composed: true }));
  }

  _draw(dt) {
    if (!this._ctx || !this._canvas) return;
    const { width, height } = this._canvas;

    this._ctx.clearRect(0, 0, width, height);

    for (const flake of this._flakes) {
      // Update position
      flake.y += flake.speed * dt;
      flake.x += Math.sin(this._tick + flake.driftOffset) * flake.drift * dt;

      // Wrap horizontally
      if (flake.x < -flake.radius) flake.x = width + flake.radius;
      if (flake.x > width + flake.radius) flake.x = -flake.radius;

      // Recycle when off-screen below
      if (flake.y > height + flake.radius) {
        Object.assign(flake, this._createFlake(true));
      }

      // Draw
      this._ctx.beginPath();
      this._ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
      this._ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
      this._ctx.fill();
    }
  }

  // ── Public API ───────────────────────────────────────────────────────────────

  /**
   * Start the snow animation
   */
  start() {
    this.active = true;
    if (!this._animationFrame && !this._prefersReducedMotion) {
      this._startAnimation();
    }
  }

  /**
   * Stop the snow animation
   */
  stop() {
    this.active = false;
    this._stopAnimation();
  }

  render() {
    return html`
      <canvas class="${this.active ? '' : 'hidden'}"></canvas>
    `;
  }
}

customElements.define('animation-snow', AnimationSnow);
