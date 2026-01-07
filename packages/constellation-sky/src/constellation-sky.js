import { LitElement, html } from 'lit';
import { styles } from './constellation-sky.styles.js';

/**
 * Star class representing a single star in the constellation
 */
class Star {
  /**
   * @param {number} canvasWidth - Canvas width
   * @param {number} canvasHeight - Canvas height
   * @param {number} speed - Movement speed
   */
  constructor(canvasWidth, canvasHeight, speed) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.vx = (Math.random() - 0.5) * speed;
    this.vy = (Math.random() - 0.5) * speed;
    this.radius = Math.random() * 2 + 1;
    this.opacity = Math.random() * 0.5 + 0.5;
    this.twinkleSpeed = Math.random() * 0.02 + 0.01;
    this.twinkleDirection = 1;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
  }

  /**
   * Update star position and opacity
   */
  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Wrap around edges
    if (this.x < 0) this.x = this.canvasWidth;
    if (this.x > this.canvasWidth) this.x = 0;
    if (this.y < 0) this.y = this.canvasHeight;
    if (this.y > this.canvasHeight) this.y = 0;

    // Twinkle effect
    this.opacity += this.twinkleSpeed * this.twinkleDirection;
    if (this.opacity >= 1) {
      this.opacity = 1;
      this.twinkleDirection = -1;
    } else if (this.opacity <= 0.3) {
      this.opacity = 0.3;
      this.twinkleDirection = 1;
    }
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

  /**
   * Draw star on canvas
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {string} color - Star color
   */
  draw(ctx, color) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

/**
 * ConstellationSky - A Lit 3 web component for animated star constellations
 *
 * @element constellation-sky
 * @slot - Default slot for overlay content
 *
 * @cssprop --constellation-width - Width of the component (default: 100%)
 * @cssprop --constellation-height - Height of the component (default: 400px)
 * @cssprop --constellation-background - Background gradient (default: dark purple gradient)
 *
 * @fires constellation-ready - Fired when the constellation is initialized
 *
 * @example
 * <constellation-sky starCount="100" lineDistance="150" speed="0.5">
 *   <h1>Welcome</h1>
 * </constellation-sky>
 */
export class ConstellationSky extends LitElement {
  static styles = styles;

  static properties = {
    /**
     * Number of stars in the sky
     * @type {number}
     */
    starCount: { type: Number, attribute: 'star-count' },

    /**
     * Maximum distance to draw connecting lines between stars
     * @type {number}
     */
    lineDistance: { type: Number, attribute: 'line-distance' },

    /**
     * Speed of star movement
     * @type {number}
     */
    speed: { type: Number },

    /**
     * Color of the stars
     * @type {string}
     */
    starColor: { type: String, attribute: 'star-color' },

    /**
     * Color of the connecting lines
     * @type {string}
     */
    lineColor: { type: String, attribute: 'line-color' },

    /**
     * Whether lines should be drawn
     * @type {boolean}
     */
    showLines: { type: Boolean, attribute: 'show-lines' },

    /**
     * Whether stars should twinkle
     * @type {boolean}
     */
    twinkle: { type: Boolean },

    /**
     * Whether animation is paused
     * @type {boolean}
     */
    paused: { type: Boolean, reflect: true },

    /**
     * Enable mouse interaction
     * @type {boolean}
     */
    interactive: { type: Boolean }
  };

  constructor() {
    super();
    /** @type {number} */
    this.starCount = 80;
    /** @type {number} */
    this.lineDistance = 120;
    /** @type {number} */
    this.speed = 0.3;
    /** @type {string} */
    this.starColor = '#ffffff';
    /** @type {string} */
    this.lineColor = '#ffffff';
    /** @type {boolean} */
    this.showLines = true;
    /** @type {boolean} */
    this.twinkle = true;
    /** @type {boolean} */
    this.paused = false;
    /** @type {boolean} */
    this.interactive = true;
    /** @type {Star[]} */
    this._stars = [];
    /** @type {HTMLCanvasElement|null} */
    this._canvas = null;
    /** @type {CanvasRenderingContext2D|null} */
    this._ctx = null;
    /** @type {number|null} */
    this._animationFrame = null;
    /** @type {boolean} */
    this._prefersReducedMotion = false;
    /** @type {{x: number, y: number}|null} */
    this._mouse = null;
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
      this._drawStaticFrame();
    } else if (this._canvas && !this.paused) {
      this._startAnimation();
    }
  }

  firstUpdated() {
    this._canvas = this.shadowRoot.querySelector('canvas');
    this._ctx = this._canvas.getContext('2d');

    this._resizeObserver = new ResizeObserver(() => this._handleResize());
    this._resizeObserver.observe(this);

    this._handleResize();
    this._initStars();

    if (this.interactive) {
      this._canvas.addEventListener('mousemove', this._handleMouseMove.bind(this));
      this._canvas.addEventListener('mouseleave', this._handleMouseLeave.bind(this));
    }

    this.dispatchEvent(new CustomEvent('constellation-ready', {
      bubbles: true,
      composed: true
    }));

    if (!this._prefersReducedMotion && !this.paused) {
      this._startAnimation();
    } else {
      this._drawStaticFrame();
    }
  }

  updated(changedProperties) {
    if (changedProperties.has('starCount')) {
      this._initStars();
    }
    if (changedProperties.has('paused')) {
      if (this.paused) {
        this._stopAnimation();
      } else if (!this._prefersReducedMotion) {
        this._startAnimation();
      }
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

    if (this._prefersReducedMotion || this.paused) {
      this._drawStaticFrame();
    }
  }

  /**
   * Handle mouse movement for interactive mode
   * @param {MouseEvent} event
   * @private
   */
  _handleMouseMove(event) {
    if (!this.interactive) return;
    const rect = this._canvas.getBoundingClientRect();
    this._mouse = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  /**
   * Handle mouse leaving the canvas
   * @private
   */
  _handleMouseLeave() {
    this._mouse = null;
  }

  /**
   * Initialize stars
   * @private
   */
  _initStars() {
    if (!this._canvas) return;

    const rect = this.getBoundingClientRect();
    this._stars = [];

    for (let i = 0; i < this.starCount; i++) {
      this._stars.push(new Star(rect.width, rect.height, this.speed));
    }
  }

  /**
   * Draw static frame for reduced motion
   * @private
   */
  _drawStaticFrame() {
    if (!this._ctx || !this._canvas) return;

    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

    // Draw stars
    this._stars.forEach(star => {
      star.draw(this._ctx, this.starColor);
    });

    // Draw lines
    if (this.showLines) {
      this._drawLines();
    }
  }

  /**
   * Draw connecting lines between nearby stars
   * @private
   */
  _drawLines() {
    for (let i = 0; i < this._stars.length; i++) {
      for (let j = i + 1; j < this._stars.length; j++) {
        const dx = this._stars[i].x - this._stars[j].x;
        const dy = this._stars[i].y - this._stars[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.lineDistance) {
          const opacity = 1 - (distance / this.lineDistance);
          this._ctx.save();
          this._ctx.globalAlpha = opacity * 0.3;
          this._ctx.strokeStyle = this.lineColor;
          this._ctx.lineWidth = 1;
          this._ctx.beginPath();
          this._ctx.moveTo(this._stars[i].x, this._stars[i].y);
          this._ctx.lineTo(this._stars[j].x, this._stars[j].y);
          this._ctx.stroke();
          this._ctx.restore();
        }
      }
    }

    // Draw lines to mouse if interactive
    if (this._mouse && this.interactive) {
      this._stars.forEach(star => {
        const dx = star.x - this._mouse.x;
        const dy = star.y - this._mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.lineDistance * 1.5) {
          const opacity = 1 - (distance / (this.lineDistance * 1.5));
          this._ctx.save();
          this._ctx.globalAlpha = opacity * 0.5;
          this._ctx.strokeStyle = this.lineColor;
          this._ctx.lineWidth = 1.5;
          this._ctx.beginPath();
          this._ctx.moveTo(star.x, star.y);
          this._ctx.lineTo(this._mouse.x, this._mouse.y);
          this._ctx.stroke();
          this._ctx.restore();
        }
      });
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
      this._stars.forEach(star => {
        if (!this._prefersReducedMotion) {
          star.update();
        }
        star.draw(this._ctx, this.starColor);
      });

      // Draw lines
      if (this.showLines) {
        this._drawLines();
      }

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
   * Reset stars to new random positions
   * @public
   */
  reset() {
    this._initStars();
    if (this._prefersReducedMotion || this.paused) {
      this._drawStaticFrame();
    }
  }

  render() {
    return html`
      <canvas></canvas>
      <div class="content-overlay">
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('constellation-sky', ConstellationSky);
