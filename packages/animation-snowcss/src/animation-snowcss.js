import { LitElement, html, css } from 'lit';

/**
 * AnimationSnowcss - CSS-based snow effect web component
 *
 * @element animation-snowcss
 * @fires animation-start - Fired when animation starts
 * @fires animation-stop - Fired when animation stops
 *
 * @cssprop --snow-z-index - Z-index of the snow layer (default: 9999)
 */
export class AnimationSnowcss extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .snow-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      pointer-events: none;
      z-index: var(--snow-z-index, 9999);
      overflow: hidden;
      opacity: 1;
      transition: opacity 0.8s ease;
    }

    .snow-container.hidden {
      opacity: 0;
    }

    .flake {
      position: absolute;
      top: -10px;
      border-radius: 50%;
      animation: snow linear infinite, drift ease-in-out infinite alternate;
    }

    @keyframes snow {
      0% {
        transform: translateY(-10px);
        opacity: 0;
      }
      5% {
        opacity: 1;
      }
      95% {
        opacity: 0.7;
      }
      100% {
        transform: translateY(105vh);
        opacity: 0;
      }
    }

    @keyframes drift {
      0% {
        margin-left: 0;
      }
      100% {
        margin-left: 20px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .snow-container {
        transition: none;
      }
      .flake {
        animation: none;
        display: none;
      }
    }
  `;

  static properties = {
    numSnowflakes: { type: Number, attribute: 'num-snowflakes' },
    speed: { type: Number },
    color: { type: String },
    active: { type: Boolean, reflect: true },
  };

  constructor() {
    super();
    this.numSnowflakes = 200;
    this.speed = 2;
    this.color = 'white';
    this.active = true;
    this._flakes = [];
  }

  _generateFlakes() {
    this._flakes = Array.from({ length: this.numSnowflakes }, (_, i) => {
      const left = Math.random() * 100;
      const size = 3 + Math.random() * 5;
      const fallDuration = (2 + Math.random() * 3) / this.speed;
      const driftDuration = 1.5 + Math.random() * 2;
      const delay = -(Math.random() * fallDuration);
      const driftDelay = -(Math.random() * driftDuration);
      const opacity = 0.5 + Math.random() * 0.5;
      const driftOffset = 5 + Math.random() * 15;

      return { id: i, left, size, fallDuration, driftDuration, delay, driftDelay, opacity, driftOffset };
    });
  }

  willUpdate(changedProperties) {
    if (
      changedProperties.has('numSnowflakes') ||
      changedProperties.has('speed') ||
      changedProperties.has('color')
    ) {
      this._generateFlakes();
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this._generateFlakes();
  }

  /**
   * Start the snow animation
   */
  start() {
    this.active = true;
    this.dispatchEvent(new CustomEvent('animation-start', { bubbles: true, composed: true }));
  }

  /**
   * Stop the snow animation
   */
  stop() {
    this.active = false;
    this.dispatchEvent(new CustomEvent('animation-stop', { bubbles: true, composed: true }));
  }

  render() {
    return html`
      <div class="snow-container ${this.active ? '' : 'hidden'}">
        ${this._flakes.map(
          (flake) => html`
            <span
              class="flake"
              style="
                left: ${flake.left}%;
                width: ${flake.size}px;
                height: ${flake.size}px;
                background: ${this.color};
                animation-duration: ${flake.fallDuration}s, ${flake.driftDuration}s;
                animation-delay: ${flake.delay}s, ${flake.driftDelay}s;
                opacity: ${flake.opacity};
                --drift-offset: ${flake.driftOffset}px;
              "
            ></span>
          `
        )}
      </div>
    `;
  }
}

customElements.define('animation-snowcss', AnimationSnowcss);
