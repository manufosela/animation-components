import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
    width: var(--paralax-width, 100%);
    height: var(--paralax-height, 100vh);
    overflow: hidden;
    position: relative;
  }

  :host([hidden]) {
    display: none;
  }

  .paralax-container {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
  }

  .paralax-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    will-change: transform;
    transition: transform var(--paralax-transition-duration, 0.1s) var(--paralax-transition-easing, ease-out);
  }

  .paralax-layer img {
    width: 100%;
    height: 100%;
    object-fit: var(--paralax-object-fit, cover);
    object-position: var(--paralax-object-position, center);
  }

  .paralax-layer.background {
    z-index: var(--paralax-background-z, 1);
  }

  .paralax-layer.midground {
    z-index: var(--paralax-midground-z, 2);
  }

  .paralax-layer.foreground {
    z-index: var(--paralax-foreground-z, 3);
  }

  .paralax-content {
    position: relative;
    z-index: var(--paralax-content-z, 10);
    pointer-events: auto;
  }

  ::slotted(*) {
    position: relative;
    z-index: var(--paralax-slot-z, 10);
  }

  /* Accessibility: Respect reduced motion preference */
  @media (prefers-reduced-motion: reduce) {
    .paralax-layer {
      transform: none !important;
      transition: none !important;
    }
  }
`;
