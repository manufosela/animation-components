import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
    width: var(--matrix-width, 100%);
    height: var(--matrix-height, 400px);
    background: var(--matrix-background, #000000);
    overflow: hidden;
    position: relative;
  }

  :host([hidden]) {
    display: none;
  }

  .matrix-container {
    width: 100%;
    height: 100%;
    position: relative;
  }

  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }

  /* Accessibility: Respect reduced motion preference */
  @media (prefers-reduced-motion: reduce) {
    :host {
      --matrix-speed: 0;
    }
  }
`;
