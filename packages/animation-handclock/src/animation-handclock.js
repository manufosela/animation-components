import { LitElement, html, svg } from 'lit';
import { styles } from './animation-handclock.styles.js';

/**
 * AnimationHandclock - SVG analog clock web component with animated hands
 *
 * @element animation-handclock
 * @fires time-change - Fired every second with current time details
 *
 * @cssprop --handclock-size - Clock size (default: 200px)
 * @cssprop --handclock-face-color - Clock face background color
 * @cssprop --handclock-border-color - Clock border color
 * @cssprop --handclock-border-width - Clock border width
 * @cssprop --handclock-hour-hand-color - Hour hand color
 * @cssprop --handclock-minute-hand-color - Minute hand color
 * @cssprop --handclock-second-hand-color - Second hand color
 * @cssprop --handclock-marker-color - Hour/minute marker color
 * @cssprop --handclock-number-color - Hour number color
 * @cssprop --handclock-center-color - Center dot color
 */
export class AnimationHandclock extends LitElement {
  static styles = styles;

  static properties = {
    size: { type: Number },
    showSeconds: { type: Boolean, attribute: 'show-seconds' },
    showNumbers: { type: Boolean, attribute: 'show-numbers' },
    showMinuteMarkers: { type: Boolean, attribute: 'show-minute-markers' },
    theme: { type: String, reflect: true },
    timezone: { type: String },
    _hours: { type: Number, state: true },
    _minutes: { type: Number, state: true },
    _seconds: { type: Number, state: true },
  };

  constructor() {
    super();
    this.size = 200;
    this.showSeconds = true;
    this.showNumbers = true;
    this.showMinuteMarkers = true;
    this.theme = 'light';
    this.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this._hours = 0;
    this._minutes = 0;
    this._seconds = 0;
    this._intervalId = null;
    this._prefersReducedMotion = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this._checkReducedMotion();
    this._updateTime();
    this._startClock();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._stopClock();
  }

  _checkReducedMotion() {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this._prefersReducedMotion = mediaQuery.matches;
    mediaQuery.addEventListener('change', (e) => {
      this._prefersReducedMotion = e.matches;
    });
  }

  _startClock() {
    this._intervalId = setInterval(() => {
      this._updateTime();
    }, 1000);
  }

  _stopClock() {
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
  }

  _updateTime() {
    const now = new Date();

    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: this.timezone,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
      });

      const parts = formatter.formatToParts(now);
      this._hours = parseInt(parts.find((p) => p.type === 'hour')?.value || '0', 10);
      this._minutes = parseInt(parts.find((p) => p.type === 'minute')?.value || '0', 10);
      this._seconds = parseInt(parts.find((p) => p.type === 'second')?.value || '0', 10);
    } catch {
      // Fallback to local time if timezone is invalid
      this._hours = now.getHours();
      this._minutes = now.getMinutes();
      this._seconds = now.getSeconds();
    }

    this.dispatchEvent(
      new CustomEvent('time-change', {
        detail: {
          hours: this._hours,
          minutes: this._minutes,
          seconds: this._seconds,
          timezone: this.timezone,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Calculate rotation angle for hour hand
   * @returns {number} Rotation angle in degrees
   */
  _getHourAngle() {
    // Each hour = 30 degrees, plus contribution from minutes
    return (this._hours % 12) * 30 + this._minutes * 0.5;
  }

  /**
   * Calculate rotation angle for minute hand
   * @returns {number} Rotation angle in degrees
   */
  _getMinuteAngle() {
    // Each minute = 6 degrees, plus contribution from seconds
    return this._minutes * 6 + this._seconds * 0.1;
  }

  /**
   * Calculate rotation angle for second hand
   * @returns {number} Rotation angle in degrees
   */
  _getSecondAngle() {
    // Each second = 6 degrees
    return this._seconds * 6;
  }

  _renderClockFace() {
    return svg`
      <circle
        class="clock-face"
        cx="100"
        cy="100"
        r="95"
      />
    `;
  }

  _renderHourMarkers() {
    const markers = [];
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30 * Math.PI) / 180;
      const x1 = 100 + 80 * Math.sin(angle);
      const y1 = 100 - 80 * Math.cos(angle);
      const x2 = 100 + 90 * Math.sin(angle);
      const y2 = 100 - 90 * Math.cos(angle);

      markers.push(svg`
        <line
          class="hour-marker"
          x1="${x1}"
          y1="${y1}"
          x2="${x2}"
          y2="${y2}"
        />
      `);
    }
    return markers;
  }

  _renderMinuteMarkers() {
    if (!this.showMinuteMarkers) return null;

    const markers = [];
    for (let i = 0; i < 60; i++) {
      // Skip positions where hour markers are
      if (i % 5 === 0) continue;

      const angle = (i * 6 * Math.PI) / 180;
      const x1 = 100 + 85 * Math.sin(angle);
      const y1 = 100 - 85 * Math.cos(angle);
      const x2 = 100 + 90 * Math.sin(angle);
      const y2 = 100 - 90 * Math.cos(angle);

      markers.push(svg`
        <line
          class="minute-marker"
          x1="${x1}"
          y1="${y1}"
          x2="${x2}"
          y2="${y2}"
        />
      `);
    }
    return markers;
  }

  _renderNumbers() {
    if (!this.showNumbers) return null;

    const numbers = [];
    for (let i = 1; i <= 12; i++) {
      const angle = ((i * 30 - 90) * Math.PI) / 180;
      const x = 100 + 68 * Math.cos(angle);
      const y = 100 + 68 * Math.sin(angle);

      numbers.push(svg`
        <text
          class="hour-number"
          x="${x}"
          y="${y}"
        >
          ${i}
        </text>
      `);
    }
    return numbers;
  }

  _renderHourHand() {
    const angle = this._getHourAngle();
    return svg`
      <line
        class="hour-hand"
        x1="100"
        y1="100"
        x2="100"
        y2="50"
        transform="rotate(${angle}, 100, 100)"
      />
    `;
  }

  _renderMinuteHand() {
    const angle = this._getMinuteAngle();
    return svg`
      <line
        class="minute-hand"
        x1="100"
        y1="100"
        x2="100"
        y2="30"
        transform="rotate(${angle}, 100, 100)"
      />
    `;
  }

  _renderSecondHand() {
    if (!this.showSeconds) return null;

    const angle = this._getSecondAngle();
    return svg`
      <g transform="rotate(${angle}, 100, 100)">
        <line
          class="second-hand"
          x1="100"
          y1="110"
          x2="100"
          y2="25"
        />
      </g>
    `;
  }

  _renderCenterDot() {
    return svg`
      <circle
        class="clock-center"
        cx="100"
        cy="100"
        r="5"
      />
    `;
  }

  render() {
    return html`
      <div class="clock-container" role="img" aria-label="Analog clock showing ${this._formatTimeForAria()}">
        <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">
          ${this._renderClockFace()}
          ${this._renderHourMarkers()}
          ${this._renderMinuteMarkers()}
          ${this._renderNumbers()}
          ${this._renderHourHand()}
          ${this._renderMinuteHand()}
          ${this._renderSecondHand()}
          ${this._renderCenterDot()}
        </svg>
      </div>
    `;
  }

  _formatTimeForAria() {
    const hours = this._hours % 12 || 12;
    const minutes = this._minutes.toString().padStart(2, '0');
    const seconds = this._seconds.toString().padStart(2, '0');
    const period = this._hours >= 12 ? 'PM' : 'AM';
    return `${hours}:${minutes}:${seconds} ${period}`;
  }

  /**
   * Set a specific time manually
   * @param {number} hours - Hours (0-23)
   * @param {number} minutes - Minutes (0-59)
   * @param {number} seconds - Seconds (0-59)
   */
  setTime(hours, minutes, seconds = 0) {
    this._stopClock();
    this._hours = hours % 24;
    this._minutes = minutes % 60;
    this._seconds = seconds % 60;
    this.requestUpdate();
  }

  /**
   * Resume automatic time updates
   */
  resumeAutoTime() {
    this._updateTime();
    this._startClock();
  }

  /**
   * Get current displayed time
   * @returns {{ hours: number, minutes: number, seconds: number }}
   */
  getTime() {
    return {
      hours: this._hours,
      minutes: this._minutes,
      seconds: this._seconds,
    };
  }
}

customElements.define('animation-handclock', AnimationHandclock);
