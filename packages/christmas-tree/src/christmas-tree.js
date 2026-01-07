import { LitElement, html, svg } from 'lit';
import { styles } from './christmas-tree.styles.js';

/**
 * Light class representing a single tree light
 */
class Light {
  /**
   * @param {number} x - X position (0-100)
   * @param {number} y - Y position (0-100)
   * @param {string} color - Light color
   * @param {number} delay - Animation delay in ms
   */
  constructor(x, y, color, delay) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.delay = delay;
    this.isOn = Math.random() > 0.5;
  }

  /**
   * Toggle the light state
   */
  toggle() {
    this.isOn = !this.isOn;
  }
}

/**
 * ChristmasTree - A Lit 3 web component for festive animated Christmas tree
 *
 * @element christmas-tree
 *
 * @cssprop --christmas-tree-height - Height of the tree (default: 300px)
 * @cssprop --christmas-tree-color - Color of the tree foliage (default: #0d5c0d)
 * @cssprop --christmas-trunk-color - Color of the trunk (default: #8b4513)
 * @cssprop --christmas-star-color - Color of the star (default: #ffd700)
 *
 * @fires tree-ready - Fired when the tree is fully rendered
 * @fires lights-toggle - Fired when lights change state
 *
 * @example
 * <christmas-tree height="400" showStar blinkSpeed="500">
 * </christmas-tree>
 */
export class ChristmasTree extends LitElement {
  static styles = styles;

  static properties = {
    /**
     * Height of the tree in pixels
     * @type {number}
     */
    height: { type: Number },

    /**
     * Array of colors for the lights
     * @type {string[]}
     */
    lightColors: { type: Array, attribute: 'light-colors' },

    /**
     * Speed of light blinking in milliseconds
     * @type {number}
     */
    blinkSpeed: { type: Number, attribute: 'blink-speed' },

    /**
     * Whether to show the star on top
     * @type {boolean}
     */
    showStar: { type: Boolean, attribute: 'show-star' },

    /**
     * Whether to show ornaments
     * @type {boolean}
     */
    showOrnaments: { type: Boolean, attribute: 'show-ornaments' },

    /**
     * Whether to show snow on branches
     * @type {boolean}
     */
    showSnow: { type: Boolean, attribute: 'show-snow' },

    /**
     * Number of lights on the tree
     * @type {number}
     */
    lightCount: { type: Number, attribute: 'light-count' },

    /**
     * Whether lights are currently blinking
     * @type {boolean}
     */
    lightsOn: { type: Boolean, attribute: 'lights-on' },

    /**
     * Internal state for lights
     * @type {Light[]}
     */
    _lights: { state: true }
  };

  constructor() {
    super();
    /** @type {number} */
    this.height = 300;
    /** @type {string[]} */
    this.lightColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    /** @type {number} */
    this.blinkSpeed = 800;
    /** @type {boolean} */
    this.showStar = true;
    /** @type {boolean} */
    this.showOrnaments = true;
    /** @type {boolean} */
    this.showSnow = false;
    /** @type {number} */
    this.lightCount = 20;
    /** @type {boolean} */
    this.lightsOn = true;
    /** @type {Light[]} */
    this._lights = [];
    /** @type {number|null} */
    this._blinkInterval = null;
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
    this._stopBlinking();
    window.matchMedia('(prefers-reduced-motion: reduce)').removeEventListener('change', this._checkReducedMotion.bind(this));
  }

  /**
   * Check if user prefers reduced motion
   * @private
   */
  _checkReducedMotion() {
    this._prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (this._prefersReducedMotion) {
      this._stopBlinking();
    } else if (this.lightsOn) {
      this._startBlinking();
    }
  }

  firstUpdated() {
    this._generateLights();
    if (this.lightsOn && !this._prefersReducedMotion) {
      this._startBlinking();
    }

    this.dispatchEvent(new CustomEvent('tree-ready', {
      bubbles: true,
      composed: true
    }));
  }

  updated(changedProperties) {
    if (changedProperties.has('lightCount') || changedProperties.has('lightColors')) {
      this._generateLights();
    }
    if (changedProperties.has('lightsOn')) {
      if (this.lightsOn && !this._prefersReducedMotion) {
        this._startBlinking();
      } else {
        this._stopBlinking();
      }
    }
    if (changedProperties.has('blinkSpeed') && this._blinkInterval) {
      this._stopBlinking();
      this._startBlinking();
    }
    if (changedProperties.has('height')) {
      this.style.setProperty('--christmas-tree-height', `${this.height}px`);
    }
  }

  /**
   * Generate random lights on the tree
   * @private
   */
  _generateLights() {
    this._lights = [];

    // Tree shape boundaries (approximate)
    const treeLayers = [
      { yMin: 15, yMax: 35, xMin: 35, xMax: 65 },
      { yMin: 30, yMax: 55, xMin: 25, xMax: 75 },
      { yMin: 50, yMax: 75, xMin: 15, xMax: 85 },
      { yMin: 70, yMax: 90, xMin: 10, xMax: 90 }
    ];

    for (let i = 0; i < this.lightCount; i++) {
      const layer = treeLayers[Math.floor(Math.random() * treeLayers.length)];
      const x = layer.xMin + Math.random() * (layer.xMax - layer.xMin);
      const y = layer.yMin + Math.random() * (layer.yMax - layer.yMin);
      const color = this.lightColors[Math.floor(Math.random() * this.lightColors.length)];
      const delay = Math.random() * 1000;

      this._lights.push(new Light(x, y, color, delay));
    }

    this.requestUpdate();
  }

  /**
   * Start the blinking animation
   * @private
   */
  _startBlinking() {
    if (this._blinkInterval) return;

    this._blinkInterval = setInterval(() => {
      this._lights.forEach(light => {
        if (Math.random() > 0.7) {
          light.toggle();
        }
      });
      this.requestUpdate();

      this.dispatchEvent(new CustomEvent('lights-toggle', {
        bubbles: true,
        composed: true
      }));
    }, this.blinkSpeed);
  }

  /**
   * Stop the blinking animation
   * @private
   */
  _stopBlinking() {
    if (this._blinkInterval) {
      clearInterval(this._blinkInterval);
      this._blinkInterval = null;
    }
  }

  /**
   * Toggle lights on/off
   * @public
   */
  toggleLights() {
    this.lightsOn = !this.lightsOn;
  }

  /**
   * Turn all lights on
   * @public
   */
  lightsAllOn() {
    this._lights.forEach(light => light.isOn = true);
    this.requestUpdate();
  }

  /**
   * Turn all lights off
   * @public
   */
  lightsAllOff() {
    this._lights.forEach(light => light.isOn = false);
    this.requestUpdate();
  }

  /**
   * Render the star SVG
   * @private
   */
  _renderStar() {
    if (!this.showStar) return null;

    return svg`
      <polygon
        class="star ${this._prefersReducedMotion ? '' : 'animated'}"
        points="50,2 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35"
        transform="translate(25, -5) scale(0.5)"
      />
    `;
  }

  /**
   * Render tree layers SVG
   * @private
   */
  _renderTreeLayers() {
    return svg`
      <!-- Top layer -->
      <polygon class="tree-layer" points="50,15 30,40 70,40" />

      <!-- Second layer -->
      <polygon class="tree-layer" points="50,30 20,60 80,60" />

      <!-- Third layer -->
      <polygon class="tree-layer" points="50,50 10,85 90,85" />

      <!-- Trunk -->
      <rect class="trunk" x="40" y="85" width="20" height="12" rx="2" />
    `;
  }

  /**
   * Render snow on branches
   * @private
   */
  _renderSnow() {
    if (!this.showSnow) return null;

    return svg`
      <ellipse class="snow" cx="40" cy="39" rx="8" ry="3" />
      <ellipse class="snow" cx="60" cy="39" rx="8" ry="3" />
      <ellipse class="snow" cx="30" cy="59" rx="10" ry="3" />
      <ellipse class="snow" cx="50" cy="58" rx="8" ry="3" />
      <ellipse class="snow" cx="70" cy="59" rx="10" ry="3" />
      <ellipse class="snow" cx="20" cy="84" rx="12" ry="4" />
      <ellipse class="snow" cx="50" cy="83" rx="10" ry="3" />
      <ellipse class="snow" cx="80" cy="84" rx="12" ry="4" />
    `;
  }

  /**
   * Render ornaments
   * @private
   */
  _renderOrnaments() {
    if (!this.showOrnaments) return null;

    const ornaments = [
      { cx: 45, cy: 35, r: 3, fill: '#ff0000' },
      { cx: 55, cy: 32, r: 2.5, fill: '#ffd700' },
      { cx: 35, cy: 52, r: 3.5, fill: '#0000ff' },
      { cx: 65, cy: 50, r: 3, fill: '#ff00ff' },
      { cx: 50, cy: 55, r: 2.5, fill: '#00ff00' },
      { cx: 25, cy: 72, r: 4, fill: '#ff6600' },
      { cx: 50, cy: 75, r: 3.5, fill: '#ff0000' },
      { cx: 75, cy: 70, r: 4, fill: '#ffd700' },
      { cx: 40, cy: 80, r: 3, fill: '#00ffff' },
      { cx: 60, cy: 78, r: 3.5, fill: '#ff00ff' }
    ];

    return svg`
      ${ornaments.map(o => svg`
        <circle class="ornament" cx="${o.cx}" cy="${o.cy}" r="${o.r}" fill="${o.fill}" />
      `)}
    `;
  }

  /**
   * Render lights
   * @private
   */
  _renderLights() {
    return svg`
      ${this._lights.map(light => svg`
        <circle
          class="light ${light.isOn ? 'on' : 'off'}"
          cx="${light.x}"
          cy="${light.y}"
          r="2"
          fill="${light.color}"
          style="color: ${light.color}"
        />
      `)}
    `;
  }

  render() {
    return html`
      <div class="tree-container">
        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          ${this._renderTreeLayers()}
          ${this._renderSnow()}
          ${this._renderOrnaments()}
          ${this._renderLights()}
          ${this._renderStar()}
        </svg>
      </div>
    `;
  }
}

customElements.define('christmas-tree', ChristmasTree);
