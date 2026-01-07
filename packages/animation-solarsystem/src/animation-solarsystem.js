import { LitElement, html, svg } from 'lit';
import { styles } from './animation-solarsystem.styles.js';

/**
 * @typedef {Object} Planet
 * @property {string} name - Planet name
 * @property {number} orbitRadius - Orbit radius in pixels
 * @property {number} size - Planet size in pixels
 * @property {string} color - Planet fill color
 * @property {number} orbitDuration - Orbit duration in seconds
 * @property {number} [startAngle] - Starting angle in radians
 */

/**
 * AnimationSolarsystem - SVG animated solar system web component
 *
 * @element animation-solarsystem
 * @fires planet-click - Fired when a planet is clicked, detail contains planet data
 *
 * @cssprop --solarsystem-width - Component width (default: 600px)
 * @cssprop --solarsystem-height - Component height (default: 600px)
 * @cssprop --solarsystem-background - Background gradient
 * @cssprop --solarsystem-sun-color - Sun fill color (default: #ffd700)
 * @cssprop --solarsystem-sun-glow - Sun glow color (default: #ff8c00)
 * @cssprop --solarsystem-orbit-color - Orbit stroke color
 * @cssprop --solarsystem-label-color - Planet label color
 * @cssprop --solarsystem-star-color - Background star color
 */
export class AnimationSolarsystem extends LitElement {
  static styles = styles;

  static properties = {
    showLabels: { type: Boolean, attribute: 'show-labels' },
    speed: { type: Number },
    scale: { type: Number },
    showOrbits: { type: Boolean, attribute: 'show-orbits' },
    paused: { type: Boolean },
    _planets: { type: Array, state: true },
    _animationFrame: { type: Number, state: true },
    _currentTime: { type: Number, state: true },
  };

  constructor() {
    super();
    this.showLabels = true;
    this.speed = 1;
    this.scale = 1;
    this.showOrbits = true;
    this.paused = false;
    this._currentTime = 0;
    this._animationFrame = null;
    this._prefersReducedMotion = false;

    /** @type {Planet[]} */
    this._planets = [
      { name: 'Mercury', orbitRadius: 50, size: 6, color: '#b5b5b5', orbitDuration: 4, startAngle: 0 },
      { name: 'Venus', orbitRadius: 75, size: 10, color: '#e6c87a', orbitDuration: 7, startAngle: 1.2 },
      { name: 'Earth', orbitRadius: 105, size: 11, color: '#6b93d6', orbitDuration: 10, startAngle: 2.5 },
      { name: 'Mars', orbitRadius: 135, size: 8, color: '#c1440e', orbitDuration: 15, startAngle: 0.8 },
      { name: 'Jupiter', orbitRadius: 175, size: 22, color: '#d8ca9d', orbitDuration: 25, startAngle: 3.1 },
      { name: 'Saturn', orbitRadius: 215, size: 18, color: '#f4d59e', orbitDuration: 35, startAngle: 4.2 },
      { name: 'Uranus', orbitRadius: 250, size: 14, color: '#d1e7e7', orbitDuration: 50, startAngle: 5.5 },
      { name: 'Neptune', orbitRadius: 280, size: 13, color: '#5b5ddf', orbitDuration: 70, startAngle: 1.8 },
    ];

    this._stars = this._generateStars(100);
    this._lastTimestamp = 0;
  }

  connectedCallback() {
    super.connectedCallback();
    this._checkReducedMotion();
    this._startAnimation();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._stopAnimation();
  }

  _checkReducedMotion() {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this._prefersReducedMotion = mediaQuery.matches;
    mediaQuery.addEventListener('change', (e) => {
      this._prefersReducedMotion = e.matches;
      if (this._prefersReducedMotion) {
        this._stopAnimation();
      } else {
        this._startAnimation();
      }
    });
  }

  _startAnimation() {
    if (this._prefersReducedMotion || this.paused) return;

    const animate = (timestamp) => {
      if (!this._lastTimestamp) this._lastTimestamp = timestamp;
      const delta = (timestamp - this._lastTimestamp) / 1000;
      this._lastTimestamp = timestamp;

      this._currentTime += delta * this.speed;
      this.requestUpdate();

      this._animationFrame = requestAnimationFrame(animate);
    };

    this._animationFrame = requestAnimationFrame(animate);
  }

  _stopAnimation() {
    if (this._animationFrame) {
      cancelAnimationFrame(this._animationFrame);
      this._animationFrame = null;
    }
  }

  _generateStars(count) {
    const stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.3,
      });
    }
    return stars;
  }

  _calculatePlanetPosition(planet) {
    const angle = planet.startAngle + (this._currentTime * (2 * Math.PI)) / planet.orbitDuration;
    const scaledRadius = planet.orbitRadius * this.scale;
    return {
      x: Math.cos(angle) * scaledRadius,
      y: Math.sin(angle) * scaledRadius,
    };
  }

  _handlePlanetClick(planet) {
    this.dispatchEvent(
      new CustomEvent('planet-click', {
        detail: { planet },
        bubbles: true,
        composed: true,
      })
    );
  }

  _renderStars() {
    return svg`
      <g class="stars-group">
        ${this._stars.map(
          (star) => svg`
            <circle
              class="star"
              cx="${star.x}%"
              cy="${star.y}%"
              r="${star.size}"
              opacity="${star.opacity}"
            />
          `
        )}
      </g>
    `;
  }

  _renderSun() {
    const sunSize = 30 * this.scale;
    return svg`
      <circle
        class="sun"
        cx="50%"
        cy="50%"
        r="${sunSize}"
      />
    `;
  }

  _renderOrbits() {
    if (!this.showOrbits) return null;

    return svg`
      <g class="orbits-group">
        ${this._planets.map(
          (planet) => svg`
            <circle
              class="orbit"
              cx="50%"
              cy="50%"
              r="${planet.orbitRadius * this.scale}"
            />
          `
        )}
      </g>
    `;
  }

  _renderPlanets() {
    return svg`
      <g class="planets-group">
        ${this._planets.map((planet) => {
          const pos = this._calculatePlanetPosition(planet);
          const scaledSize = planet.size * this.scale;

          return svg`
            <g
              class="planet-group"
              transform="translate(${pos.x}, ${pos.y})"
              @click=${() => this._handlePlanetClick(planet)}
            >
              <circle
                class="planet"
                cx="50%"
                cy="50%"
                r="${scaledSize}"
                fill="${planet.color}"
                style="color: ${planet.color}"
              />
              ${this.showLabels
                ? svg`
                    <text
                      class="planet-label"
                      x="50%"
                      y="50%"
                      dy="${scaledSize + 12}"
                    >
                      ${planet.name}
                    </text>
                  `
                : null}
            </g>
          `;
        })}
      </g>
    `;
  }

  render() {
    return html`
      <div class="solar-system-container">
        <svg viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet">
          <defs>
            <radialGradient id="sun-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#ffff00" />
              <stop offset="50%" stop-color="#ffd700" />
              <stop offset="100%" stop-color="#ff8c00" />
            </radialGradient>
          </defs>

          ${this._renderStars()}
          ${this._renderOrbits()}

          <g transform="translate(300, 300)">
            <circle class="sun" cx="0" cy="0" r="${30 * this.scale}" fill="url(#sun-gradient)" />
            ${this._planets.map((planet) => {
              const pos = this._calculatePlanetPosition(planet);
              const scaledSize = planet.size * this.scale;

              return svg`
                <g
                  class="planet-group"
                  @click=${() => this._handlePlanetClick(planet)}
                  style="cursor: pointer"
                >
                  <circle
                    class="planet"
                    cx="${pos.x}"
                    cy="${pos.y}"
                    r="${scaledSize}"
                    fill="${planet.color}"
                  />
                  ${this.showLabels
                    ? svg`
                        <text
                          class="planet-label"
                          x="${pos.x}"
                          y="${pos.y + scaledSize + 12}"
                        >
                          ${planet.name}
                        </text>
                      `
                    : null}
                </g>
              `;
            })}
          </g>
        </svg>
      </div>
    `;
  }

  /**
   * Pause the animation
   */
  pause() {
    this.paused = true;
    this._stopAnimation();
  }

  /**
   * Resume the animation
   */
  resume() {
    this.paused = false;
    this._lastTimestamp = 0;
    this._startAnimation();
  }

  /**
   * Toggle pause state
   */
  toggle() {
    if (this.paused) {
      this.resume();
    } else {
      this.pause();
    }
  }

  /**
   * Reset animation to initial state
   */
  reset() {
    this._currentTime = 0;
    this._lastTimestamp = 0;
    this.requestUpdate();
  }
}

customElements.define('animation-solarsystem', AnimationSolarsystem);
