import { css } from 'lit';

export const styles = css`
  :host {
    display: inline-block;
    width: var(--handclock-size, 200px);
    height: var(--handclock-size, 200px);
  }

  :host([hidden]) {
    display: none;
  }

  .clock-container {
    width: 100%;
    height: 100%;
    position: relative;
  }

  svg {
    width: 100%;
    height: 100%;
  }

  /* Light theme (default) */
  .clock-face {
    fill: var(--handclock-face-color, #ffffff);
    stroke: var(--handclock-border-color, #333333);
    stroke-width: var(--handclock-border-width, 4);
  }

  .clock-center {
    fill: var(--handclock-center-color, #333333);
  }

  .hour-hand {
    stroke: var(--handclock-hour-hand-color, #333333);
    stroke-width: var(--handclock-hour-hand-width, 6);
    stroke-linecap: round;
  }

  .minute-hand {
    stroke: var(--handclock-minute-hand-color, #333333);
    stroke-width: var(--handclock-minute-hand-width, 4);
    stroke-linecap: round;
  }

  .second-hand {
    stroke: var(--handclock-second-hand-color, #e74c3c);
    stroke-width: var(--handclock-second-hand-width, 2);
    stroke-linecap: round;
  }

  .hour-marker {
    stroke: var(--handclock-marker-color, #333333);
    stroke-width: var(--handclock-hour-marker-width, 3);
  }

  .minute-marker {
    stroke: var(--handclock-marker-color, #333333);
    stroke-width: var(--handclock-minute-marker-width, 1);
  }

  .hour-number {
    fill: var(--handclock-number-color, #333333);
    font-family: var(--handclock-font-family, 'Georgia', serif);
    font-size: var(--handclock-number-size, 16px);
    font-weight: var(--handclock-number-weight, normal);
    text-anchor: middle;
    dominant-baseline: central;
  }

  /* Dark theme */
  :host([theme='dark']) .clock-face {
    fill: var(--handclock-face-color, #1a1a2e);
    stroke: var(--handclock-border-color, #4a4a6a);
  }

  :host([theme='dark']) .clock-center {
    fill: var(--handclock-center-color, #e0e0e0);
  }

  :host([theme='dark']) .hour-hand,
  :host([theme='dark']) .minute-hand {
    stroke: var(--handclock-hour-hand-color, #e0e0e0);
  }

  :host([theme='dark']) .second-hand {
    stroke: var(--handclock-second-hand-color, #ff6b6b);
  }

  :host([theme='dark']) .hour-marker,
  :host([theme='dark']) .minute-marker {
    stroke: var(--handclock-marker-color, #e0e0e0);
  }

  :host([theme='dark']) .hour-number {
    fill: var(--handclock-number-color, #e0e0e0);
  }

  /* Accessibility: Respect reduced motion preference */
  @media (prefers-reduced-motion: reduce) {
    .second-hand,
    .minute-hand,
    .hour-hand {
      transition: none !important;
    }
  }
`;
