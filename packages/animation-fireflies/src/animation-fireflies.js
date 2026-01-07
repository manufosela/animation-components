import { LitElement, html } from 'lit';
import { styles } from './animation-fireflies.styles.js';

/**
 * @typedef {Object} Firefly
 * @property {number} x - X position
 * @property {number} y - Y position
 * @property {number} vx - X velocity
 * @property {number} vy - Y velocity
 * @property {number} size - Base size
 * @property {number} glowSize - Glow radius
 * @property {string} color - Firefly color
 * @property {number} phase - Animation phase offset
 * @property {number} pulseSpeed - Pulse animation speed
 * @property {number} brightness - Current brightness (0-1)
 * @property {number} targetBrightness - Target brightness for interpolation
 * @property {number} wanderAngle - Current wander direction
 */

/**
 * AnimationFireflies - Floating firefly particles animation web component
 *
 * @element animation-fireflies
 * @fires firefly-click - Fired when a firefly is clicked, detail contains firefly data
 * @fires animation-start - Fired when animation starts
 * @fires animation-stop - Fired when animation stops
 *
 * @slot - Default slot for overlay content
 *
 * @cssprop --fireflies-width - Component width (default: 100%)
 * @cssprop --fireflies-height - Component height (default: 400px)
 * @cssprop --fireflies-background - Background gradient/color
 */
export class AnimationFireflies extends LitElement {
  static styles = styles;

  static properties = {
    count: { type: Number },
    glowSize: { type: Number, attribute: 'glow-size' },
    speed: { type: Number },
    colors: { type: Array },
    minSize: { type: Number, attribute: 'min-size' },
    maxSize: { type: Number, attribute: 'max-size' },
    blinkSpeed: { type: Number, attribute: 'blink-speed' },
    interactive: { type: Boolean },
    mouseAttraction: { type: Number, attribute: 'mouse-attraction' },
    paused: { type: Boolean, reflect: true },
  };

  constructor() {
    super();
    this.count = 50;
    this.glowSize = 20;
    this.speed = 1;
    this.colors = ['#ffff00', '#ffee00', '#ffdd00', '#ffe066', '#fff59d'];
    this.minSize = 2;
    this.maxSize = 5;
    this.blinkSpeed = 1;
    this.interactive = false;
    this.mouseAttraction = 0.5;
    this.paused = false;

    /** @type {Firefly[]} */
    this._fireflies = [];
    this._canvas = null;
    this._ctx = null;
    this._animationFrame = null;
    this._lastTime = 0;
    this._prefersReducedMotion = false;
    this._resizeObserver = null;
    this._mouseX = -1000;
    this._mouseY = -1000;
  }

  connectedCallback() {
    super.connectedCallback();
    this._checkReducedMotion();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._stopAnimation();
    this._removeResizeObserver();
    this._removeMouseListener();
  }

  firstUpdated() {
    this._canvas = this.shadowRoot.querySelector('canvas');
    this._ctx = this._canvas.getContext('2d');
    this._setupResizeObserver();
    this._initCanvas();
    this._initFireflies();

    if (this.interactive) {
      this._setupMouseListener();
    }

    this._startAnimation();
  }

  updated(changedProperties) {
    if (changedProperties.has('paused')) {
      if (this.paused) {
        this._stopAnimation();
      } else {
        this._startAnimation();
      }
    }

    if (changedProperties.has('count')) {
      this._initFireflies();
    }

    if (changedProperties.has('interactive')) {
      if (this.interactive) {
        this._setupMouseListener();
      } else {
        this._removeMouseListener();
      }
    }
  }

  _checkReducedMotion() {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this._prefersReducedMotion = mediaQuery.matches;
    mediaQuery.addEventListener('change', (e) => {
      this._prefersReducedMotion = e.matches;
      if (this._prefersReducedMotion) {
        this._stopAnimation();
        this._drawStaticFrame();
      } else if (!this.paused) {
        this._startAnimation();
      }
    });
  }

  _setupResizeObserver() {
    this._resizeObserver = new ResizeObserver(() => {
      this._initCanvas();
    });
    this._resizeObserver.observe(this);
  }

  _removeResizeObserver() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
  }

  _setupMouseListener() {
    this._mouseMoveHandler = (e) => {
      const rect = this._canvas.getBoundingClientRect();
      this._mouseX = e.clientX - rect.left;
      this._mouseY = e.clientY - rect.top;
    };

    this._mouseLeaveHandler = () => {
      this._mouseX = -1000;
      this._mouseY = -1000;
    };

    this._clickHandler = (e) => {
      const rect = this._canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Find clicked firefly
      const clickedFirefly = this._fireflies.find((ff) => {
        const dx = ff.x - clickX;
        const dy = ff.y - clickY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < ff.glowSize;
      });

      if (clickedFirefly) {
        this.dispatchEvent(
          new CustomEvent('firefly-click', {
            detail: { firefly: clickedFirefly },
            bubbles: true,
            composed: true,
          })
        );
      }
    };

    this._canvas.addEventListener('mousemove', this._mouseMoveHandler);
    this._canvas.addEventListener('mouseleave', this._mouseLeaveHandler);
    this._canvas.addEventListener('click', this._clickHandler);
  }

  _removeMouseListener() {
    if (this._canvas) {
      this._canvas.removeEventListener('mousemove', this._mouseMoveHandler);
      this._canvas.removeEventListener('mouseleave', this._mouseLeaveHandler);
      this._canvas.removeEventListener('click', this._clickHandler);
    }
  }

  _initCanvas() {
    if (!this._canvas) return;

    const rect = this.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    this._canvas.width = rect.width * dpr;
    this._canvas.height = rect.height * dpr;

    this._ctx.scale(dpr, dpr);
  }

  _initFireflies() {
    if (!this._canvas) return;

    const rect = this.getBoundingClientRect();
    this._fireflies = [];

    for (let i = 0; i < this.count; i++) {
      this._fireflies.push(this._createFirefly(rect));
    }
  }

  _createFirefly(rect) {
    const size = this.minSize + Math.random() * (this.maxSize - this.minSize);

    return {
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      vx: (Math.random() - 0.5) * 2 * this.speed,
      vy: (Math.random() - 0.5) * 2 * this.speed,
      size,
      glowSize: this.glowSize * (size / this.maxSize),
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
      phase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.5 + Math.random() * 1.5,
      brightness: Math.random(),
      targetBrightness: Math.random(),
      wanderAngle: Math.random() * Math.PI * 2,
    };
  }

  _startAnimation() {
    if (this._animationFrame || this._prefersReducedMotion) return;

    this.dispatchEvent(
      new CustomEvent('animation-start', {
        bubbles: true,
        composed: true,
      })
    );

    this._lastTime = performance.now();
    this._animate();
  }

  _stopAnimation() {
    if (this._animationFrame) {
      cancelAnimationFrame(this._animationFrame);
      this._animationFrame = null;

      this.dispatchEvent(
        new CustomEvent('animation-stop', {
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  _animate() {
    if (this.paused || this._prefersReducedMotion) return;

    const currentTime = performance.now();
    const deltaTime = (currentTime - this._lastTime) / 1000;
    this._lastTime = currentTime;

    this._update(deltaTime, currentTime);
    this._draw(currentTime);

    this._animationFrame = requestAnimationFrame(() => this._animate());
  }

  _update(deltaTime, currentTime) {
    const rect = this.getBoundingClientRect();

    this._fireflies.forEach((ff) => {
      // Update wander angle slowly
      ff.wanderAngle += (Math.random() - 0.5) * 0.5 * deltaTime;

      // Apply wander force
      const wanderForce = 0.1 * this.speed;
      ff.vx += Math.cos(ff.wanderAngle) * wanderForce * deltaTime;
      ff.vy += Math.sin(ff.wanderAngle) * wanderForce * deltaTime;

      // Apply mouse attraction/repulsion if interactive
      if (this.interactive && this._mouseX >= 0) {
        const dx = this._mouseX - ff.x;
        const dy = this._mouseY - ff.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150 && distance > 0) {
          const force = (this.mouseAttraction * 50) / distance;
          ff.vx += (dx / distance) * force * deltaTime;
          ff.vy += (dy / distance) * force * deltaTime;
        }
      }

      // Apply drag
      const drag = 0.98;
      ff.vx *= drag;
      ff.vy *= drag;

      // Limit velocity
      const maxSpeed = 50 * this.speed;
      const speed = Math.sqrt(ff.vx * ff.vx + ff.vy * ff.vy);
      if (speed > maxSpeed) {
        ff.vx = (ff.vx / speed) * maxSpeed;
        ff.vy = (ff.vy / speed) * maxSpeed;
      }

      // Update position
      ff.x += ff.vx * deltaTime * 60;
      ff.y += ff.vy * deltaTime * 60;

      // Wrap around edges with soft boundaries
      const margin = ff.glowSize;
      if (ff.x < -margin) ff.x = rect.width + margin;
      if (ff.x > rect.width + margin) ff.x = -margin;
      if (ff.y < -margin) ff.y = rect.height + margin;
      if (ff.y > rect.height + margin) ff.y = -margin;

      // Update brightness with smooth pulsing
      ff.phase += deltaTime * ff.pulseSpeed * this.blinkSpeed;

      // Random brightness changes
      if (Math.random() < 0.01) {
        ff.targetBrightness = 0.3 + Math.random() * 0.7;
      }

      // Interpolate to target brightness
      ff.brightness += (ff.targetBrightness - ff.brightness) * deltaTime * 2;

      // Apply sine wave modulation
      const pulseModulation = 0.3 + 0.7 * ((Math.sin(ff.phase) + 1) / 2);
      ff.currentBrightness = ff.brightness * pulseModulation;
    });
  }

  _draw(currentTime) {
    if (!this._ctx) return;

    const rect = this.getBoundingClientRect();

    // Clear canvas with transparent
    this._ctx.clearRect(0, 0, rect.width, rect.height);

    // Draw fireflies
    this._fireflies.forEach((ff) => {
      this._drawFirefly(ff);
    });
  }

  _drawFirefly(ff) {
    const brightness = ff.currentBrightness || ff.brightness;

    // Draw outer glow
    const gradient = this._ctx.createRadialGradient(
      ff.x,
      ff.y,
      0,
      ff.x,
      ff.y,
      ff.glowSize * brightness
    );

    const colorRgb = this._hexToRgb(ff.color);
    gradient.addColorStop(0, `rgba(${colorRgb.r}, ${colorRgb.g}, ${colorRgb.b}, ${brightness})`);
    gradient.addColorStop(0.3, `rgba(${colorRgb.r}, ${colorRgb.g}, ${colorRgb.b}, ${brightness * 0.5})`);
    gradient.addColorStop(1, `rgba(${colorRgb.r}, ${colorRgb.g}, ${colorRgb.b}, 0)`);

    this._ctx.fillStyle = gradient;
    this._ctx.beginPath();
    this._ctx.arc(ff.x, ff.y, ff.glowSize * brightness, 0, Math.PI * 2);
    this._ctx.fill();

    // Draw core
    this._ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
    this._ctx.beginPath();
    this._ctx.arc(ff.x, ff.y, ff.size * brightness, 0, Math.PI * 2);
    this._ctx.fill();
  }

  _hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 255, g: 255, b: 0 };
  }

  _drawStaticFrame() {
    if (!this._ctx) return;

    const rect = this.getBoundingClientRect();
    this._ctx.clearRect(0, 0, rect.width, rect.height);

    // Draw fireflies at reduced brightness
    this._fireflies.forEach((ff) => {
      ff.currentBrightness = 0.5;
      this._drawFirefly(ff);
    });
  }

  render() {
    return html`
      <div class="fireflies-container" role="img" aria-label="Floating fireflies animation">
        <canvas></canvas>
        <div class="content-overlay">
          <slot></slot>
        </div>
      </div>
    `;
  }

  /**
   * Pause the animation
   */
  pause() {
    this.paused = true;
  }

  /**
   * Resume the animation
   */
  resume() {
    this.paused = false;
  }

  /**
   * Toggle pause state
   */
  toggle() {
    this.paused = !this.paused;
  }

  /**
   * Reset and reinitialize fireflies
   */
  reset() {
    this._stopAnimation();
    this._initFireflies();
    if (!this.paused && !this._prefersReducedMotion) {
      this._startAnimation();
    }
  }

  /**
   * Add fireflies dynamically
   * @param {number} amount - Number of fireflies to add
   */
  addFireflies(amount) {
    const rect = this.getBoundingClientRect();
    for (let i = 0; i < amount; i++) {
      this._fireflies.push(this._createFirefly(rect));
    }
    this.count = this._fireflies.length;
  }

  /**
   * Remove fireflies
   * @param {number} amount - Number of fireflies to remove
   */
  removeFireflies(amount) {
    const toRemove = Math.min(amount, this._fireflies.length);
    this._fireflies.splice(0, toRemove);
    this.count = this._fireflies.length;
  }

  /**
   * Set custom color palette
   * @param {string[]} newColors - Array of hex color strings
   */
  setColors(newColors) {
    this.colors = newColors;
    this._fireflies.forEach((ff) => {
      ff.color = this.colors[Math.floor(Math.random() * this.colors.length)];
    });
  }

  /**
   * Get current firefly count
   * @returns {number}
   */
  getFireflyCount() {
    return this._fireflies.length;
  }
}

customElements.define('animation-fireflies', AnimationFireflies);
