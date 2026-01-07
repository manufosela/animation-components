import { LitElement, html } from 'lit';
import { styles } from './scene-stwtext.styles.js';

/**
 * SceneStwtext - A Lit 3 web component for Star Wars style text crawl
 *
 * @element scene-stwtext
 * @slot - Default slot for crawl text content
 * @slot intro - Slot for intro text (e.g., "A long time ago...")
 * @slot logo - Slot for logo image
 *
 * @cssprop --stwtext-width - Width of the component (default: 100%)
 * @cssprop --stwtext-height - Height of the component (default: 100vh)
 * @cssprop --stwtext-background - Background color (default: #000)
 * @cssprop --stwtext-text-color - Color of crawl text (default: #ffd700)
 * @cssprop --stwtext-font-size - Font size of crawl text (default: 2rem)
 * @cssprop --stwtext-font-family - Font family (default: Franklin Gothic Medium)
 * @cssprop --stwtext-perspective - 3D perspective (default: 400px)
 * @cssprop --stwtext-rotation - X-axis rotation (default: 25deg)
 * @cssprop --stwtext-fade-distance - Top fade gradient height (default: 30%)
 * @cssprop --stwtext-intro-color - Intro text color (default: #4ee)
 * @cssprop --stwtext-intro-size - Intro text size (default: 2rem)
 * @cssprop --stwtext-text-width - Width of text container (default: 80%)
 *
 * @fires crawl-start - Fired when the crawl animation starts
 * @fires crawl-end - Fired when the crawl animation ends
 * @fires animation-pause - Fired when animation is paused
 * @fires animation-resume - Fired when animation is resumed
 *
 * @example
 * <scene-stwtext speed="80" perspective="500">
 *   <span slot="intro">A long time ago in a galaxy far, far away....</span>
 *   <h1>EPISODE IV</h1>
 *   <p>It is a period of civil war...</p>
 * </scene-stwtext>
 */
export class SceneStwtext extends LitElement {
  static styles = styles;

  static properties = {
    /**
     * Text content for the crawl (alternative to slot)
     * @type {string}
     */
    text: { type: String },

    /**
     * Duration of the crawl animation in seconds
     * @type {number}
     */
    speed: { type: Number },

    /**
     * Perspective value for 3D effect in pixels
     * @type {number}
     */
    perspective: { type: Number },

    /**
     * Fade distance from top as percentage
     * @type {number}
     */
    fadeDistance: { type: Number, attribute: 'fade-distance' },

    /**
     * Intro text (e.g., "A long time ago...")
     * @type {string}
     */
    introText: { type: String, attribute: 'intro-text' },

    /**
     * Duration of intro animation in seconds
     * @type {number}
     */
    introDuration: { type: Number, attribute: 'intro-duration' },

    /**
     * Duration of logo animation in seconds
     * @type {number}
     */
    logoDuration: { type: Number, attribute: 'logo-duration' },

    /**
     * URL for logo image
     * @type {string}
     */
    logoSrc: { type: String, attribute: 'logo-src' },

    /**
     * Whether to show stars background
     * @type {boolean}
     */
    showStars: { type: Boolean, attribute: 'show-stars' },

    /**
     * Whether to show playback controls
     * @type {boolean}
     */
    showControls: { type: Boolean, attribute: 'show-controls' },

    /**
     * Whether animation is currently paused
     * @type {boolean}
     */
    paused: { type: Boolean, reflect: true },

    /**
     * Auto-start animation
     * @type {boolean}
     */
    autoplay: { type: Boolean },

    /**
     * Internal state: whether animation has started
     * @type {boolean}
     */
    _animationStarted: { state: true }
  };

  constructor() {
    super();
    /** @type {string} */
    this.text = '';
    /** @type {number} */
    this.speed = 60;
    /** @type {number} */
    this.perspective = 400;
    /** @type {number} */
    this.fadeDistance = 30;
    /** @type {string} */
    this.introText = '';
    /** @type {number} */
    this.introDuration = 4;
    /** @type {number} */
    this.logoDuration = 6;
    /** @type {string} */
    this.logoSrc = '';
    /** @type {boolean} */
    this.showStars = true;
    /** @type {boolean} */
    this.showControls = true;
    /** @type {boolean} */
    this.paused = false;
    /** @type {boolean} */
    this.autoplay = true;
    /** @type {boolean} */
    this._animationStarted = false;
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
    this._updateCSSVariables();

    if (this.autoplay && !this._prefersReducedMotion) {
      this._setupAnimationEvents();
    }
  }

  updated(changedProperties) {
    if (changedProperties.has('speed') ||
        changedProperties.has('perspective') ||
        changedProperties.has('fadeDistance') ||
        changedProperties.has('introDuration') ||
        changedProperties.has('logoDuration')) {
      this._updateCSSVariables();
    }

    if (changedProperties.has('paused')) {
      this.style.setProperty('--animation-state', this.paused ? 'paused' : 'running');
    }
  }

  /**
   * Update CSS custom properties based on component properties
   * @private
   */
  _updateCSSVariables() {
    const introDelay = 0;
    const logoDelay = this.introDuration;
    const crawlDelay = this.introDuration + this.logoDuration;

    this.style.setProperty('--stwtext-perspective', `${this.perspective}px`);
    this.style.setProperty('--stwtext-fade-distance', `${this.fadeDistance}%`);
    this.style.setProperty('--crawl-duration', `${this.speed}s`);
    this.style.setProperty('--intro-duration', `${this.introDuration}s`);
    this.style.setProperty('--logo-duration', `${this.logoDuration}s`);
    this.style.setProperty('--intro-delay', `${introDelay}s`);
    this.style.setProperty('--logo-delay', `${logoDelay}s`);
    this.style.setProperty('--crawl-delay', `${crawlDelay}s`);
  }

  /**
   * Setup animation event listeners
   * @private
   */
  _setupAnimationEvents() {
    const crawlText = this.shadowRoot.querySelector('.crawl-text');
    if (crawlText) {
      crawlText.addEventListener('animationstart', () => {
        this._animationStarted = true;
        this.dispatchEvent(new CustomEvent('crawl-start', {
          bubbles: true,
          composed: true
        }));
      });

      crawlText.addEventListener('animationend', () => {
        this.dispatchEvent(new CustomEvent('crawl-end', {
          bubbles: true,
          composed: true
        }));
      });
    }
  }

  /**
   * Pause the animation
   * @public
   */
  pause() {
    this.paused = true;
    this.dispatchEvent(new CustomEvent('animation-pause', {
      bubbles: true,
      composed: true
    }));
  }

  /**
   * Resume the animation
   * @public
   */
  resume() {
    this.paused = false;
    this.dispatchEvent(new CustomEvent('animation-resume', {
      bubbles: true,
      composed: true
    }));
  }

  /**
   * Toggle pause/resume
   * @public
   */
  togglePause() {
    if (this.paused) {
      this.resume();
    } else {
      this.pause();
    }
  }

  /**
   * Restart the animation from the beginning
   * @public
   */
  restart() {
    // Remove and re-add elements to restart animations
    this.paused = false;
    this._animationStarted = false;

    const crawlText = this.shadowRoot.querySelector('.crawl-text');
    const intro = this.shadowRoot.querySelector('.intro');
    const logo = this.shadowRoot.querySelector('.logo-container');

    [crawlText, intro, logo].forEach(el => {
      if (el) {
        el.style.animation = 'none';
        el.offsetHeight; // Trigger reflow
        el.style.animation = null;
      }
    });

    this._setupAnimationEvents();
  }

  /**
   * Render intro text
   * @private
   */
  _renderIntro() {
    if (!this.introText && !this.querySelector('[slot="intro"]')) return null;

    return html`
      <div class="intro">
        ${this.introText ? html`<span>${this.introText}</span>` : html`<slot name="intro"></slot>`}
      </div>
    `;
  }

  /**
   * Render logo
   * @private
   */
  _renderLogo() {
    if (!this.logoSrc && !this.querySelector('[slot="logo"]')) return null;

    return html`
      <div class="logo-container">
        ${this.logoSrc
          ? html`<img src="${this.logoSrc}" alt="Logo">`
          : html`<slot name="logo"></slot>`}
      </div>
    `;
  }

  /**
   * Render controls
   * @private
   */
  _renderControls() {
    if (!this.showControls) return null;

    return html`
      <div class="controls">
        <button @click="${this.togglePause}">
          ${this.paused ? 'Resume' : 'Pause'}
        </button>
        <button @click="${this.restart}">Restart</button>
      </div>
    `;
  }

  /**
   * Render text content
   * @private
   */
  _renderTextContent() {
    if (this.text) {
      // Parse text with basic formatting
      const paragraphs = this.text.split('\n\n').map(p => p.trim()).filter(p => p);

      return paragraphs.map(p => {
        // Check if it's a heading (starts with #)
        if (p.startsWith('# ')) {
          return html`<h1>${p.substring(2)}</h1>`;
        }
        return html`<p>${p}</p>`;
      });
    }

    return html`<slot></slot>`;
  }

  render() {
    return html`
      ${this.showStars ? html`<div class="stars"></div>` : null}

      ${this._renderIntro()}
      ${this._renderLogo()}

      <div class="perspective-container">
        <div class="crawl-container">
          <div class="crawl-text">
            ${this._renderTextContent()}
          </div>
        </div>
      </div>

      <div class="fade-overlay"></div>

      ${this._renderControls()}
    `;
  }
}

customElements.define('scene-stwtext', SceneStwtext);
