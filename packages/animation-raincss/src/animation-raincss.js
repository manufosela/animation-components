import { LitElement, html, css } from 'lit';

/**
 * AnimationRaincss - CSS-based rain effect web component
 *
 * @element animation-raincss
 * @fires animation-start - Fired when animation starts
 * @fires animation-stop - Fired when animation stops
 *
 * @cssprop --rain-z-index - Z-index of the rain layer (default: 9999)
 */
export class AnimationRaincss extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .rain-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      pointer-events: none;
      z-index: var(--rain-z-index, 9999);
      overflow: hidden;
      opacity: 1;
      transition: opacity 0.8s ease;
    }

    .rain-container.hidden {
      opacity: 0;
    }

    .drop {
      position: absolute;
      top: -25px;
      border-radius: 0 0 2px 2px;
      transform: rotate(10deg);
      animation: rain linear infinite;
    }

    @keyframes rain {
      0% {
        transform: translateY(-20px) rotate(10deg);
        opacity: 0;
      }
      5% {
        opacity: 1;
      }
      95% {
        opacity: 0.6;
      }
      100% {
        transform: translateY(105vh) rotate(10deg);
        opacity: 0;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .rain-container {
        transition: none;
      }
      .drop {
        animation: none;
        display: none;
      }
    }
  `;

  static properties = {
    numDrops: { type: Number, attribute: 'num-drops' },
    speed: { type: Number },
    color: { type: String },
    active: { type: Boolean, reflect: true },
  };

  constructor() {
    super();
    this.numDrops = 100;
    this.speed = 1;
    this.color = '#7fc8f8';
    this.active = true;
    this._drops = [];
  }

  _generateDrops() {
    this._drops = Array.from({ length: this.numDrops }, (_, i) => {
      const left = Math.random() * 100;
      const width = 1.5 + Math.random() * 1;
      const height = 15 + Math.random() * 10;
      const duration = (0.6 + Math.random() * 0.8) / this.speed;
      const delay = -(Math.random() * 2);
      const opacity = 0.4 + Math.random() * 0.6;

      return { id: i, left, width, height, duration, delay, opacity };
    });
  }

  willUpdate(changedProperties) {
    if (
      changedProperties.has('numDrops') ||
      changedProperties.has('speed') ||
      changedProperties.has('color')
    ) {
      this._generateDrops();
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this._generateDrops();
  }

  /**
   * Start the rain animation
   */
  start() {
    this.active = true;
    this.dispatchEvent(new CustomEvent('animation-start', { bubbles: true, composed: true }));
  }

  /**
   * Stop the rain animation
   */
  stop() {
    this.active = false;
    this.dispatchEvent(new CustomEvent('animation-stop', { bubbles: true, composed: true }));
  }

  render() {
    return html`
      <div class="rain-container ${this.active ? '' : 'hidden'}">
        ${this._drops.map(
          (drop) => html`
            <span
              class="drop"
              style="
                left: ${drop.left}%;
                width: ${drop.width}px;
                height: ${drop.height}px;
                background: ${this.color};
                animation-duration: ${drop.duration}s;
                animation-delay: ${drop.delay}s;
                opacity: ${drop.opacity};
              "
            ></span>
          `
        )}
      </div>
    `;
  }
}

customElements.define('animation-raincss', AnimationRaincss);
