import { LitElement, html } from 'lit';
import { styles } from './animation-explosion.styles.js';

/**
 * Particle class representing a single explosion particle
 */
class Particle {
  /**
   * @param {number} x - Initial X position
   * @param {number} y - Initial Y position
   * @param {string} color - Particle color
   * @param {number} spread - Spread angle in degrees
   * @param {number} gravity - Gravity force
   */
  constructor(x, y, color, spread, gravity) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.gravity = gravity;

    const angle = (Math.random() * spread - spread / 2) * (Math.PI / 180);
    const velocity = Math.random() * 8 + 4;

    this.vx = Math.cos(angle - Math.PI / 2) * velocity;
    this.vy = Math.sin(angle - Math.PI / 2) * velocity;
    this.alpha = 1;
    this.decay = Math.random() * 0.02 + 0.01;
    this.size = Math.random() * 4 + 2;
  }

  /**
   * Update particle position and properties
   * @returns {boolean} - Whether particle is still alive
   */
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.alpha -= this.decay;
    return this.alpha > 0;
  }

  /**
   * Draw particle on canvas
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

/**
 * AnimationExplosion - A Lit 3 web component for particle explosion effects
 *
 * @element animation-explosion
 * @slot - Default slot for content that triggers explosion on click
 *
 * @cssprop --explosion-width - Width of the component (default: 100%)
 * @cssprop --explosion-height - Height of the component (default: 100%)
 * @cssprop --explosion-duration - Duration override for reduced motion (default: 0.1s)
 *
 * @fires explosion-start - Fired when explosion animation starts
 * @fires explosion-end - Fired when explosion animation ends
 *
 * @example
 * <animation-explosion particleCount="50" colors='["#ff0000", "#00ff00", "#0000ff"]'>
 *   <button>Click me!</button>
 * </animation-explosion>
 */
export class AnimationExplosion extends LitElement {
  static styles = styles;

  static properties = {
    /**
     * Number of particles in the explosion
     * @type {number}
     */
    particleCount: { type: Number, attribute: 'particle-count' },

    /**
     * Array of colors for particles
     * @type {string[]}
     */
    colors: { type: Array },

    /**
     * Duration of the explosion animation in milliseconds
     * @type {number}
     */
    duration: { type: Number },

    /**
     * Gravity force applied to particles
     * @type {number}
     */
    gravity: { type: Number },

    /**
     * Spread angle in degrees
     * @type {number}
     */
    spread: { type: Number },

    /**
     * Whether to trigger explosion on click
     * @type {boolean}
     */
    triggerOnClick: { type: Boolean, attribute: 'trigger-on-click' },

    /**
     * Internal state: whether animation is running
     * @type {boolean}
     */
    _isAnimating: { state: true }
  };

  constructor() {
    super();
    /** @type {number} */
    this.particleCount = 30;
    /** @type {string[]} */
    this.colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'];
    /** @type {number} */
    this.duration = 1500;
    /** @type {number} */
    this.gravity = 0.1;
    /** @type {number} */
    this.spread = 360;
    /** @type {boolean} */
    this.triggerOnClick = true;
    /** @type {boolean} */
    this._isAnimating = false;
    /** @type {Particle[]} */
    this._particles = [];
    /** @type {HTMLCanvasElement|null} */
    this._canvas = null;
    /** @type {CanvasRenderingContext2D|null} */
    this._ctx = null;
    /** @type {number|null} */
    this._animationFrame = null;
    /** @type {boolean} */
    this._prefersReducedMotion = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this._checkReducedMotion();
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', this._checkReducedMotion.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._stopAnimation();
    window.matchMedia('(prefers-reduced-motion: reduce)').removeEventListener('change', this._checkReducedMotion.bind(this));
  }

  /**
   * Check if user prefers reduced motion
   * @private
   */
  _checkReducedMotion() {
    this._prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  firstUpdated() {
    this._canvas = this.shadowRoot.querySelector('canvas');
    this._ctx = this._canvas.getContext('2d');
    this._resizeCanvas();
    window.addEventListener('resize', this._resizeCanvas.bind(this));
  }

  /**
   * Resize canvas to match component size
   * @private
   */
  _resizeCanvas() {
    if (this._canvas) {
      const rect = this.getBoundingClientRect();
      this._canvas.width = rect.width;
      this._canvas.height = rect.height;
    }
  }

  /**
   * Handle click event
   * @param {MouseEvent} event
   * @private
   */
  _handleClick(event) {
    if (this.triggerOnClick) {
      const rect = this.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      this.explode(x, y);
    }
  }

  /**
   * Trigger explosion at specified coordinates
   * @param {number} [x] - X coordinate (default: center)
   * @param {number} [y] - Y coordinate (default: center)
   * @public
   */
  explode(x, y) {
    if (this._isAnimating) {
      this._stopAnimation();
    }

    const rect = this.getBoundingClientRect();
    const explosionX = x ?? rect.width / 2;
    const explosionY = y ?? rect.height / 2;

    this._resizeCanvas();
    this._createParticles(explosionX, explosionY);

    this.dispatchEvent(new CustomEvent('explosion-start', {
      bubbles: true,
      composed: true,
      detail: { x: explosionX, y: explosionY }
    }));

    if (this._prefersReducedMotion) {
      this._drawStaticExplosion(explosionX, explosionY);
    } else {
      this._startAnimation();
    }
  }

  /**
   * Create particles for explosion
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @private
   */
  _createParticles(x, y) {
    this._particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      const color = this.colors[Math.floor(Math.random() * this.colors.length)];
      this._particles.push(new Particle(x, y, color, this.spread, this.gravity));
    }
  }

  /**
   * Draw static explosion for reduced motion preference
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @private
   */
  _drawStaticExplosion(x, y) {
    if (!this._ctx) return;

    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

    // Draw a simple burst pattern
    const radius = 30;
    this.colors.forEach((color, i) => {
      const angle = (i / this.colors.length) * Math.PI * 2;
      this._ctx.beginPath();
      this._ctx.fillStyle = color;
      this._ctx.arc(
        x + Math.cos(angle) * radius,
        y + Math.sin(angle) * radius,
        8,
        0,
        Math.PI * 2
      );
      this._ctx.fill();
    });

    setTimeout(() => {
      this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
      this.dispatchEvent(new CustomEvent('explosion-end', {
        bubbles: true,
        composed: true
      }));
    }, 100);
  }

  /**
   * Start animation loop
   * @private
   */
  _startAnimation() {
    this._isAnimating = true;
    const startTime = performance.now();

    const animate = (currentTime) => {
      if (!this._isAnimating || !this._ctx) return;

      const elapsed = currentTime - startTime;

      this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

      this._particles = this._particles.filter(particle => {
        const alive = particle.update();
        if (alive) {
          particle.draw(this._ctx);
        }
        return alive;
      });

      if (this._particles.length > 0 && elapsed < this.duration) {
        this._animationFrame = requestAnimationFrame(animate);
      } else {
        this._stopAnimation();
        this.dispatchEvent(new CustomEvent('explosion-end', {
          bubbles: true,
          composed: true
        }));
      }
    };

    this._animationFrame = requestAnimationFrame(animate);
  }

  /**
   * Stop animation
   * @private
   */
  _stopAnimation() {
    this._isAnimating = false;
    if (this._animationFrame) {
      cancelAnimationFrame(this._animationFrame);
      this._animationFrame = null;
    }
    if (this._ctx) {
      this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }
    this._particles = [];
  }

  render() {
    return html`
      <canvas></canvas>
      <div class="content-slot" @click="${this._handleClick}">
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('animation-explosion', AnimationExplosion);
