import { LitElement, html } from 'lit';
import { styles } from './animation-matrix.styles.js';

/**
 * @typedef {Object} Column
 * @property {number} x - X position
 * @property {number} y - Current Y position
 * @property {number} speed - Fall speed
 * @property {string[]} chars - Characters in this column
 */

/**
 * AnimationMatrix - Matrix digital rain effect web component using Canvas API
 *
 * @element animation-matrix
 * @fires animation-start - Fired when animation starts
 * @fires animation-stop - Fired when animation stops
 *
 * @cssprop --matrix-width - Component width (default: 100%)
 * @cssprop --matrix-height - Component height (default: 400px)
 * @cssprop --matrix-background - Background color (default: #000000)
 */
export class AnimationMatrix extends LitElement {
  static styles = styles;

  static properties = {
    fontSize: { type: Number, attribute: 'font-size' },
    speed: { type: Number },
    color: { type: String },
    highlightColor: { type: String, attribute: 'highlight-color' },
    characters: { type: String },
    density: { type: Number },
    fadeOpacity: { type: Number, attribute: 'fade-opacity' },
    trailLength: { type: Number, attribute: 'trail-length' },
    paused: { type: Boolean, reflect: true },
  };

  constructor() {
    super();
    this.fontSize = 14;
    this.speed = 1;
    this.color = '#00ff00';
    this.highlightColor = '#ffffff';
    this.characters = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    this.density = 1;
    this.fadeOpacity = 0.05;
    this.trailLength = 20;
    this.paused = false;

    this._canvas = null;
    this._ctx = null;
    this._columns = [];
    this._animationFrame = null;
    this._lastTime = 0;
    this._prefersReducedMotion = false;
    this._resizeObserver = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this._checkReducedMotion();
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
    this._initCanvas();
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

    if (changedProperties.has('fontSize') || changedProperties.has('density')) {
      this._initColumns();
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

  _initCanvas() {
    if (!this._canvas) return;

    const rect = this.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    this._canvas.width = rect.width * dpr;
    this._canvas.height = rect.height * dpr;

    this._ctx.scale(dpr, dpr);
    this._ctx.font = `${this.fontSize}px monospace`;

    this._initColumns();
  }

  _initColumns() {
    if (!this._canvas) return;

    const rect = this.getBoundingClientRect();
    const columnCount = Math.floor(rect.width / this.fontSize) * this.density;

    this._columns = [];

    for (let i = 0; i < columnCount; i++) {
      this._columns.push(this._createColumn(i, rect));
    }
  }

  _createColumn(index, rect) {
    const x = (index / this.density) * this.fontSize;
    const chars = [];
    const charCount = Math.ceil(rect.height / this.fontSize) + this.trailLength;

    for (let j = 0; j < charCount; j++) {
      chars.push(this._getRandomChar());
    }

    return {
      x,
      y: Math.random() * -rect.height,
      speed: (0.5 + Math.random() * 0.5) * this.speed,
      chars,
      charIndex: 0,
    };
  }

  _getRandomChar() {
    return this.characters[Math.floor(Math.random() * this.characters.length)];
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
    const deltaTime = (currentTime - this._lastTime) / 16.67; // Normalize to 60fps
    this._lastTime = currentTime;

    this._update(deltaTime);
    this._draw();

    this._animationFrame = requestAnimationFrame(() => this._animate());
  }

  _update(deltaTime) {
    const rect = this.getBoundingClientRect();

    this._columns.forEach((column) => {
      column.y += column.speed * this.fontSize * deltaTime * 0.5;

      // Randomly change characters
      if (Math.random() < 0.02) {
        const randomIndex = Math.floor(Math.random() * column.chars.length);
        column.chars[randomIndex] = this._getRandomChar();
      }

      // Reset column when it goes off screen
      if (column.y > rect.height + this.trailLength * this.fontSize) {
        column.y = Math.random() * -this.trailLength * this.fontSize;
        column.speed = (0.5 + Math.random() * 0.5) * this.speed;
      }
    });
  }

  _draw() {
    if (!this._ctx) return;

    const rect = this.getBoundingClientRect();

    // Apply fade effect
    this._ctx.fillStyle = `rgba(0, 0, 0, ${this.fadeOpacity})`;
    this._ctx.fillRect(0, 0, rect.width, rect.height);

    this._ctx.font = `${this.fontSize}px monospace`;

    this._columns.forEach((column) => {
      this._drawColumn(column, rect);
    });
  }

  _drawColumn(column, rect) {
    const startY = Math.floor(column.y / this.fontSize);

    for (let i = 0; i < this.trailLength; i++) {
      const charY = (startY - i) * this.fontSize;

      if (charY < -this.fontSize || charY > rect.height + this.fontSize) continue;

      const charIndex = (startY - i + column.chars.length * 100) % column.chars.length;
      const char = column.chars[Math.abs(charIndex)];

      // Calculate opacity based on position in trail
      const opacity = 1 - i / this.trailLength;

      if (i === 0) {
        // Leading character (brightest)
        this._ctx.fillStyle = this.highlightColor;
        this._ctx.shadowColor = this.highlightColor;
        this._ctx.shadowBlur = 10;
      } else {
        // Trail characters
        this._ctx.fillStyle = this._hexToRgba(this.color, opacity);
        this._ctx.shadowBlur = 0;
      }

      this._ctx.fillText(char, column.x, charY);
    }

    // Reset shadow
    this._ctx.shadowBlur = 0;
  }

  _hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  _drawStaticFrame() {
    if (!this._ctx) return;

    const rect = this.getBoundingClientRect();

    // Clear canvas
    this._ctx.fillStyle = '#000000';
    this._ctx.fillRect(0, 0, rect.width, rect.height);

    // Draw static characters
    this._ctx.font = `${this.fontSize}px monospace`;
    this._ctx.fillStyle = this._hexToRgba(this.color, 0.3);

    this._columns.forEach((column) => {
      for (let i = 0; i < Math.ceil(rect.height / this.fontSize); i++) {
        const char = column.chars[i % column.chars.length];
        this._ctx.fillText(char, column.x, i * this.fontSize);
      }
    });
  }

  render() {
    return html`
      <div class="matrix-container" role="img" aria-label="Matrix digital rain animation">
        <canvas></canvas>
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
   * Reset and reinitialize the animation
   */
  reset() {
    this._stopAnimation();
    this._initCanvas();
    if (!this.paused && !this._prefersReducedMotion) {
      this._startAnimation();
    }
  }

  /**
   * Set custom character set
   * @param {string} chars - String of characters to use
   */
  setCharacters(chars) {
    this.characters = chars;
    this._initColumns();
  }

  /**
   * Get canvas as data URL
   * @returns {string} Data URL of current canvas state
   */
  toDataURL() {
    return this._canvas?.toDataURL() || '';
  }
}

customElements.define('animation-matrix', AnimationMatrix);
