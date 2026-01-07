import { LitElement, html } from 'lit';
import { styles } from './animation-shootingstar.styles.js';

/**
 * ShootingStar class representing a single shooting star
 */
class ShootingStar {
  /**
   * @param {number} canvasWidth - Canvas width
   * @param {number} canvasHeight - Canvas height
   * @param {number} speed - Movement speed
   * @param {number} trailLength - Length of the trail
   * @param {string} color - Star color
   */
  constructor(canvasWidth, canvasHeight, speed, trailLength, color) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.speed = speed;
    this.trailLength = trailLength;
    this.color = color;

    this.reset();
  }

  /**
   * Reset star to new starting position
   */
  reset() {
    // Start from random position along top or left edge
    const startFromTop = Math.random() > 0.5;

    if (startFromTop) {
      this.x = Math.random() * this.canvasWidth;
      this.y = -20;
    } else {
      this.x = this.canvasWidth + 20;
      this.y = Math.random() * (this.canvasHeight * 0.5);
    }

    // Random angle between 200 and 250 degrees (moving down-left)
    const angle = (200 + Math.random() * 50) * (Math.PI / 180);
    this.vx = Math.cos(angle) * this.speed;
    this.vy = -Math.sin(angle) * this.speed;

    this.alpha = 1;
    this.size = Math.random() * 2 + 1;
    this.trail = [];
    this.active = true;
  }

  /**
   * Update star position
   * @returns {boolean} - Whether star is still visible
   */
  update() {
    // Store trail positions
    this.trail.unshift({ x: this.x, y: this.y, alpha: this.alpha });

    // Limit trail length
    if (this.trail.length > this.trailLength) {
      this.trail.pop();
    }

    // Update position
    this.x += this.vx;
    this.y += this.vy;

    // Fade out as it moves
    this.alpha -= 0.008;

    // Check if still visible
    if (this.x < -50 || this.y > this.canvasHeight + 50 || this.alpha <= 0) {
      this.active = false;
      return false;
    }

    return true;
  }

  /**
   * Draw star and trail on canvas
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  draw(ctx) {
    // Draw trail
    this.trail.forEach((point, index) => {
      const trailAlpha = point.alpha * (1 - index / this.trailLength) * 0.6;
      const trailSize = this.size * (1 - index / this.trailLength);

      ctx.save();
      ctx.globalAlpha = trailAlpha;

      // Create gradient for trail segment
      const gradient = ctx.createRadialGradient(
        point.x, point.y, 0,
        point.x, point.y, trailSize * 3
      );
      gradient.addColorStop(0, this.color);
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(point.x, point.y, trailSize * 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Draw main star head
    ctx.save();
    ctx.globalAlpha = this.alpha;

    // Glowing head
    const headGradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.size * 4
    );
    headGradient.addColorStop(0, '#ffffff');
    headGradient.addColorStop(0.2, this.color);
    headGradient.addColorStop(1, 'transparent');

    ctx.fillStyle = headGradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2);
    ctx.fill();

    // Bright core
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * Update canvas dimensions
   * @param {number} width - New width
   * @param {number} height - New height
   */
  updateDimensions(width, height) {
    this.canvasWidth = width;
    this.canvasHeight = height;
  }
}

/**
 * AnimationShootingstar - A Lit 3 web component for shooting star animations
 *
 * @element animation-shootingstar
 * @slot - Default slot for overlay content
 *
 * @cssprop --shootingstar-width - Width of the component (default: 100%)
 * @cssprop --shootingstar-height - Height of the component (default: 400px)
 * @cssprop --shootingstar-background - Background gradient
 *
 * @fires star-created - Fired when a new shooting star is created
 * @fires star-faded - Fired when a shooting star fades out
 *
 * @example
 * <animation-shootingstar frequency="3000" speed="8" trailLength="30">
 *   <h1>Make a wish!</h1>
 * </animation-shootingstar>
 */
export class AnimationShootingstar extends LitElement {
  static styles = styles;

  static properties = {
    /**
     * Frequency of new shooting stars in milliseconds
     * @type {number}
     */
    frequency: { type: Number },

    /**
     * Speed of shooting stars
     * @type {number}
     */
    speed: { type: Number },

    /**
     * Length of the star trail
     * @type {number}
     */
    trailLength: { type: Number, attribute: 'trail-length' },

    /**
     * Array of colors for shooting stars
     * @type {string[]}
     */
    colors: { type: Array },

    /**
     * Maximum number of simultaneous shooting stars
     * @type {number}
     */
    maxStars: { type: Number, attribute: 'max-stars' },

    /**
     * Whether to show static background stars
     * @type {boolean}
     */
    showBackgroundStars: { type: Boolean, attribute: 'show-background-stars' },

    /**
     * Whether animation is paused
     * @type {boolean}
     */
    paused: { type: Boolean, reflect: true },

    /**
     * Trigger a shooting star on click
     * @type {boolean}
     */
    triggerOnClick: { type: Boolean, attribute: 'trigger-on-click' }
  };

  constructor() {
    super();
    /** @type {number} */
    this.frequency = 2000;
    /** @type {number} */
    this.speed = 10;
    /** @type {number} */
    this.trailLength = 25;
    /** @type {string[]} */
    this.colors = ['#ffffff', '#fffacd', '#e6e6fa', '#add8e6', '#ffdab9'];
    /** @type {number} */
    this.maxStars = 5;
    /** @type {boolean} */
    this.showBackgroundStars = true;
    /** @type {boolean} */
    this.paused = false;
    /** @type {boolean} */
    this.triggerOnClick = false;
    /** @type {ShootingStar[]} */
    this._stars = [];
    /** @type {HTMLCanvasElement|null} */
    this._canvas = null;
    /** @type {CanvasRenderingContext2D|null} */
    this._ctx = null;
    /** @type {number|null} */
    this._animationFrame = null;
    /** @type {number|null} */
    this._spawnInterval = null;
    /** @type {boolean} */
    this._prefersReducedMotion = false;
    /** @type {ResizeObserver|null} */
    this._resizeObserver = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this._checkReducedMotion();
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', this._checkReducedMotion.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._stopAnimation();
    this._stopSpawning();
    window.matchMedia('(prefers-reduced-motion: reduce)').removeEventListener('change', this._checkReducedMotion.bind(this));
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }
  }

  /**
   * Check if user prefers reduced motion
   * @private
   */
  _checkReducedMotion() {
    this._prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (this._prefersReducedMotion) {
      this._stopAnimation();
      this._stopSpawning();
    } else if (!this.paused) {
      this._startAnimation();
      this._startSpawning();
    }
  }

  firstUpdated() {
    this._canvas = this.shadowRoot.querySelector('canvas');
    this._ctx = this._canvas.getContext('2d');

    this._resizeObserver = new ResizeObserver(() => this._handleResize());
    this._resizeObserver.observe(this);

    this._handleResize();

    if (!this._prefersReducedMotion && !this.paused) {
      this._startAnimation();
      this._startSpawning();
    }
  }

  updated(changedProperties) {
    if (changedProperties.has('paused')) {
      if (this.paused) {
        this._stopAnimation();
        this._stopSpawning();
      } else if (!this._prefersReducedMotion) {
        this._startAnimation();
        this._startSpawning();
      }
    }

    if (changedProperties.has('frequency') && this._spawnInterval) {
      this._stopSpawning();
      this._startSpawning();
    }
  }

  /**
   * Handle resize
   * @private
   */
  _handleResize() {
    if (!this._canvas) return;

    const rect = this.getBoundingClientRect();
    this._canvas.width = rect.width;
    this._canvas.height = rect.height;

    this._stars.forEach(star => {
      star.updateDimensions(rect.width, rect.height);
    });
  }

  /**
   * Handle click to trigger star
   * @param {MouseEvent} event
   * @private
   */
  _handleClick(event) {
    if (this.triggerOnClick && !this._prefersReducedMotion) {
      this._createStar();
    }
  }

  /**
   * Create a new shooting star
   * @private
   */
  _createStar() {
    if (this._stars.length >= this.maxStars) {
      // Remove oldest inactive star
      const inactiveIndex = this._stars.findIndex(s => !s.active);
      if (inactiveIndex !== -1) {
        this._stars.splice(inactiveIndex, 1);
      } else {
        return; // Max stars reached
      }
    }

    const color = this.colors[Math.floor(Math.random() * this.colors.length)];
    const rect = this.getBoundingClientRect();
    const star = new ShootingStar(
      rect.width,
      rect.height,
      this.speed + (Math.random() - 0.5) * 4,
      this.trailLength,
      color
    );

    this._stars.push(star);

    this.dispatchEvent(new CustomEvent('star-created', {
      bubbles: true,
      composed: true,
      detail: { color, x: star.x, y: star.y }
    }));
  }

  /**
   * Start spawning shooting stars
   * @private
   */
  _startSpawning() {
    if (this._spawnInterval) return;

    // Create initial star
    this._createStar();

    this._spawnInterval = setInterval(() => {
      if (!this.paused && Math.random() > 0.3) {
        this._createStar();
      }
    }, this.frequency);
  }

  /**
   * Stop spawning shooting stars
   * @private
   */
  _stopSpawning() {
    if (this._spawnInterval) {
      clearInterval(this._spawnInterval);
      this._spawnInterval = null;
    }
  }

  /**
   * Start animation loop
   * @private
   */
  _startAnimation() {
    if (this._animationFrame) return;

    const animate = () => {
      if (!this._ctx || this.paused) return;

      this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

      // Update and draw stars
      this._stars = this._stars.filter(star => {
        const alive = star.update();
        if (alive) {
          star.draw(this._ctx);
        } else {
          this.dispatchEvent(new CustomEvent('star-faded', {
            bubbles: true,
            composed: true
          }));
        }
        return alive || star.trail.length > 0;
      });

      this._animationFrame = requestAnimationFrame(animate);
    };

    this._animationFrame = requestAnimationFrame(animate);
  }

  /**
   * Stop animation
   * @private
   */
  _stopAnimation() {
    if (this._animationFrame) {
      cancelAnimationFrame(this._animationFrame);
      this._animationFrame = null;
    }
  }

  /**
   * Pause the animation
   * @public
   */
  pause() {
    this.paused = true;
  }

  /**
   * Resume the animation
   * @public
   */
  resume() {
    this.paused = false;
  }

  /**
   * Trigger a shooting star manually
   * @public
   */
  trigger() {
    if (!this._prefersReducedMotion) {
      this._createStar();
    }
  }

  /**
   * Clear all current shooting stars
   * @public
   */
  clear() {
    this._stars = [];
    if (this._ctx) {
      this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }
  }

  render() {
    return html`
      ${this.showBackgroundStars ? html`<div class="stars-layer"></div>` : null}
      <canvas @click="${this._handleClick}"></canvas>
      <div class="content-overlay">
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('animation-shootingstar', AnimationShootingstar);
