import { css } from 'lit';

/**
 * Styles for the constellation-sky component
 * @type {import('lit').CSSResult}
 */
export const styles = css`
  :host {
    display: block;
    position: relative;
    width: var(--constellation-width, 100%);
    height: var(--constellation-height, 400px);
    background: var(--constellation-background, linear-gradient(to bottom, #0f0c29 0%, #302b63 50%, #24243e 100%));
    overflow: hidden;
  }

  :host([hidden]) {
    display: none;
  }

  canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .content-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
    pointer-events: none;
  }

  .content-overlay ::slotted(*) {
    pointer-events: auto;
  }

  /* Accessibility: Respect reduced motion preferences */
  @media (prefers-reduced-motion: reduce) {
    :host {
      --constellation-speed: 0;
    }
  }
`;
