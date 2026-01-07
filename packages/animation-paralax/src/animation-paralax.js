import { LitElement, html, css } from 'lit';
import { styles } from './animation-paralax.styles.js';

/**
 * @typedef {Object} ParalaxLayer
 * @property {string} src - Image source URL
 * @property {number} speed - Movement speed multiplier (0-1, where 0 is fixed, 1 is same as scroll)
 * @property {string} [position] - CSS position value (default: 'center')
 * @property {string} [size] - CSS background-size value (default: 'cover')
 * @property {string} [type] - Layer type: 'background', 'midground', 'foreground'
 */

/**
 * AnimationParalax - Parallax scrolling effects web component
 *
 * @element animation-paralax
 * @fires layer-loaded - Fired when all layer images are loaded
 * @fires scroll-update - Fired on scroll with current offset values
 *
 * @slot - Default slot for content overlay
 *
 * @cssprop --paralax-width - Component width (default: 100%)
 * @cssprop --paralax-height - Component height (default: 100vh)
 * @cssprop --paralax-transition-duration - Smooth transition duration (default: 0.1s)
 * @cssprop --paralax-transition-easing - Transition easing function (default: ease-out)
 * @cssprop --paralax-object-fit - Image object-fit (default: cover)
 * @cssprop --paralax-object-position - Image object-position (default: center)
 */
export class AnimationParalax extends LitElement {
  static styles = styles;

  static properties = {
    layers: { type: Array },
    sensitivity: { type: Number },
    direction: { type: String },
    scrollTarget: { type: String, attribute: 'scroll-target' },
    mouseEnabled: { type: Boolean, attribute: 'mouse-enabled' },
    disabled: { type: Boolean, reflect: true },
    _offsets: { type: Array, state: true },
    _isVisible: { type: Boolean, state: true },
  };

  constructor() {
    super();
    /** @type {ParalaxLayer[]} */
    this.layers = [];
    this.sensitivity = 1;
    this.direction = 'vertical'; // 'vertical', 'horizontal', 'both'
    this.scrollTarget = 'window';
    this.mouseEnabled = false;
    this.disabled = false;
    this._offsets = [];
    this._isVisible = true;
    this._scrollHandler = null;
    this._mouseHandler = null;
    this._resizeHandler = null;
    this._intersectionObserver = null;
    this._prefersReducedMotion = false;
    this._rafId = null;
    this._lastScrollY = 0;
    this._lastScrollX = 0;
    this._lastMouseX = 0;
    this._lastMouseY = 0;
  }

  connectedCallback() {
    super.connectedCallback();
    this._checkReducedMotion();
    this._setupScrollListener();
    this._setupIntersectionObserver();

    if (this.mouseEnabled) {
      this._setupMouseListener();
    }

    this._setupResizeListener();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._removeScrollListener();
    this._removeMouseListener();
    this._removeResizeListener();
    this._removeIntersectionObserver();

    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
    }
  }

  updated(changedProperties) {
    if (changedProperties.has('mouseEnabled')) {
      if (this.mouseEnabled) {
        this._setupMouseListener();
      } else {
        this._removeMouseListener();
      }
    }

    if (changedProperties.has('layers')) {
      this._initializeOffsets();
    }
  }

  _checkReducedMotion() {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this._prefersReducedMotion = mediaQuery.matches;
    mediaQuery.addEventListener('change', (e) => {
      this._prefersReducedMotion = e.matches;
    });
  }

  _initializeOffsets() {
    this._offsets = this.layers.map(() => ({ x: 0, y: 0 }));
  }

  _getScrollTarget() {
    if (this.scrollTarget === 'window') {
      return window;
    }
    return document.querySelector(this.scrollTarget);
  }

  _setupScrollListener() {
    const target = this._getScrollTarget();
    if (!target) return;

    this._scrollHandler = () => {
      if (this._prefersReducedMotion || this.disabled || !this._isVisible) return;

      if (this._rafId) {
        cancelAnimationFrame(this._rafId);
      }

      this._rafId = requestAnimationFrame(() => {
        this._updateParalaxOnScroll();
      });
    };

    target.addEventListener('scroll', this._scrollHandler, { passive: true });
  }

  _removeScrollListener() {
    const target = this._getScrollTarget();
    if (target && this._scrollHandler) {
      target.removeEventListener('scroll', this._scrollHandler);
    }
  }

  _setupMouseListener() {
    this._mouseHandler = (e) => {
      if (this._prefersReducedMotion || this.disabled || !this._isVisible) return;

      if (this._rafId) {
        cancelAnimationFrame(this._rafId);
      }

      this._rafId = requestAnimationFrame(() => {
        this._updateParalaxOnMouse(e);
      });
    };

    this.addEventListener('mousemove', this._mouseHandler, { passive: true });
  }

  _removeMouseListener() {
    if (this._mouseHandler) {
      this.removeEventListener('mousemove', this._mouseHandler);
    }
  }

  _setupResizeListener() {
    this._resizeHandler = () => {
      this._updateParalaxOnScroll();
    };

    window.addEventListener('resize', this._resizeHandler, { passive: true });
  }

  _removeResizeListener() {
    if (this._resizeHandler) {
      window.removeEventListener('resize', this._resizeHandler);
    }
  }

  _setupIntersectionObserver() {
    this._intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          this._isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0 }
    );

    this._intersectionObserver.observe(this);
  }

  _removeIntersectionObserver() {
    if (this._intersectionObserver) {
      this._intersectionObserver.disconnect();
    }
  }

  _updateParalaxOnScroll() {
    const target = this._getScrollTarget();
    if (!target) return;

    const scrollY = target === window ? window.scrollY : target.scrollTop;
    const scrollX = target === window ? window.scrollX : target.scrollLeft;

    const rect = this.getBoundingClientRect();
    const centerY = rect.top + rect.height / 2;
    const centerX = rect.left + rect.width / 2;
    const windowCenterY = window.innerHeight / 2;
    const windowCenterX = window.innerWidth / 2;

    const deltaY = (centerY - windowCenterY) * this.sensitivity;
    const deltaX = (centerX - windowCenterX) * this.sensitivity;

    this._offsets = this.layers.map((layer) => {
      const speed = layer.speed || 0.5;
      let x = 0;
      let y = 0;

      if (this.direction === 'vertical' || this.direction === 'both') {
        y = deltaY * speed * -1;
      }

      if (this.direction === 'horizontal' || this.direction === 'both') {
        x = deltaX * speed * -1;
      }

      return { x, y };
    });

    this.dispatchEvent(
      new CustomEvent('scroll-update', {
        detail: { scrollX, scrollY, offsets: this._offsets },
        bubbles: true,
        composed: true,
      })
    );

    this._lastScrollY = scrollY;
    this._lastScrollX = scrollX;
  }

  _updateParalaxOnMouse(e) {
    const rect = this.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const deltaX = (mouseX - centerX) * this.sensitivity * 0.1;
    const deltaY = (mouseY - centerY) * this.sensitivity * 0.1;

    this._offsets = this.layers.map((layer) => {
      const speed = layer.speed || 0.5;
      let x = 0;
      let y = 0;

      if (this.direction === 'horizontal' || this.direction === 'both') {
        x = deltaX * speed * -1;
      }

      if (this.direction === 'vertical' || this.direction === 'both') {
        y = deltaY * speed * -1;
      }

      return { x, y };
    });

    this._lastMouseX = mouseX;
    this._lastMouseY = mouseY;
  }

  _getLayerStyle(index) {
    const offset = this._offsets[index] || { x: 0, y: 0 };
    return `transform: translate3d(${offset.x}px, ${offset.y}px, 0);`;
  }

  _getLayerClass(layer) {
    const classes = ['paralax-layer'];
    if (layer.type) {
      classes.push(layer.type);
    }
    return classes.join(' ');
  }

  _handleImageLoad() {
    const allLoaded = this.shadowRoot.querySelectorAll('img');
    const loaded = Array.from(allLoaded).filter((img) => img.complete);

    if (loaded.length === allLoaded.length) {
      this.dispatchEvent(
        new CustomEvent('layer-loaded', {
          detail: { layerCount: this.layers.length },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  render() {
    return html`
      <div class="paralax-container">
        ${this.layers.map(
          (layer, index) => html`
            <div
              class="${this._getLayerClass(layer)}"
              style="${this._getLayerStyle(index)}"
            >
              <img
                src="${layer.src}"
                alt="${layer.alt || `Parallax layer ${index + 1}`}"
                loading="lazy"
                @load="${this._handleImageLoad}"
              />
            </div>
          `
        )}
        <div class="paralax-content">
          <slot></slot>
        </div>
      </div>
    `;
  }

  /**
   * Manually trigger a parallax update
   */
  refresh() {
    this._updateParalaxOnScroll();
  }

  /**
   * Reset all layer offsets to zero
   */
  reset() {
    this._offsets = this.layers.map(() => ({ x: 0, y: 0 }));
    this.requestUpdate();
  }

  /**
   * Add a new layer dynamically
   * @param {ParalaxLayer} layer - Layer configuration
   */
  addLayer(layer) {
    this.layers = [...this.layers, layer];
    this._offsets = [...this._offsets, { x: 0, y: 0 }];
  }

  /**
   * Remove a layer by index
   * @param {number} index - Layer index to remove
   */
  removeLayer(index) {
    if (index >= 0 && index < this.layers.length) {
      this.layers = this.layers.filter((_, i) => i !== index);
      this._offsets = this._offsets.filter((_, i) => i !== index);
    }
  }
}

customElements.define('animation-paralax', AnimationParalax);
