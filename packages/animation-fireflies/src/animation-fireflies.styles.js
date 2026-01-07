import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
    width: var(--fireflies-width, 100%);
    height: var(--fireflies-height, 400px);
    background: var(--fireflies-background, linear-gradient(180deg, #0a1628 0%, #1a2a4a 50%, #0d1f3c 100%));
    overflow: hidden;
    position: relative;
  }

  :host([hidden]) {
    display: none;
  }

  .fireflies-container {
    width: 100%;
    height: 100%;
    position: relative;
  }

  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }

  /* Slot for overlay content */
  .content-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 10;
  }

  ::slotted(*) {
    pointer-events: auto;
  }

  /* Accessibility: Respect reduced motion preference */
  @media (prefers-reduced-motion: reduce) {
    :host {
      --fireflies-speed: 0;
    }
  }
`;
