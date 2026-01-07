import { css } from 'lit';

/**
 * Styles for the animation-explosion component
 * @type {import('lit').CSSResult}
 */
export const styles = css`
  :host {
    display: block;
    position: relative;
    width: var(--explosion-width, 100%);
    height: var(--explosion-height, 100%);
    min-width: 100px;
    min-height: 100px;
    overflow: hidden;
    cursor: pointer;
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
    pointer-events: none;
  }

  .content-slot {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Accessibility: Respect reduced motion preferences */
  @media (prefers-reduced-motion: reduce) {
    :host {
      --explosion-duration: 0.1s;
    }
  }
`;
