import { css } from 'lit';

/**
 * Styles for the animation-shootingstar component
 * @type {import('lit').CSSResult}
 */
export const styles = css`
  :host {
    display: block;
    position: relative;
    width: var(--shootingstar-width, 100%);
    height: var(--shootingstar-height, 400px);
    background: var(--shootingstar-background, linear-gradient(to bottom, #0f0c29 0%, #302b63 50%, #24243e 100%));
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

  /* Static stars background layer */
  .stars-layer {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
      radial-gradient(1px 1px at 10% 20%, white, transparent),
      radial-gradient(1px 1px at 20% 50%, rgba(255,255,255,0.8), transparent),
      radial-gradient(1px 1px at 30% 30%, white, transparent),
      radial-gradient(1px 1px at 40% 70%, rgba(255,255,255,0.6), transparent),
      radial-gradient(1px 1px at 50% 10%, white, transparent),
      radial-gradient(1px 1px at 60% 80%, rgba(255,255,255,0.7), transparent),
      radial-gradient(1px 1px at 70% 40%, white, transparent),
      radial-gradient(1px 1px at 80% 60%, rgba(255,255,255,0.8), transparent),
      radial-gradient(1px 1px at 90% 25%, white, transparent),
      radial-gradient(1.5px 1.5px at 15% 85%, white, transparent),
      radial-gradient(1.5px 1.5px at 25% 15%, rgba(255,255,255,0.9), transparent),
      radial-gradient(1.5px 1.5px at 35% 65%, white, transparent),
      radial-gradient(1.5px 1.5px at 45% 35%, rgba(255,255,255,0.8), transparent),
      radial-gradient(1.5px 1.5px at 55% 95%, white, transparent),
      radial-gradient(1.5px 1.5px at 65% 5%, rgba(255,255,255,0.7), transparent),
      radial-gradient(1.5px 1.5px at 75% 75%, white, transparent),
      radial-gradient(1.5px 1.5px at 85% 45%, rgba(255,255,255,0.9), transparent),
      radial-gradient(1.5px 1.5px at 95% 55%, white, transparent),
      radial-gradient(2px 2px at 5% 95%, rgba(255,255,255,0.6), transparent),
      radial-gradient(2px 2px at 12% 42%, white, transparent);
    background-size: 100% 100%;
    opacity: 0.6;
  }

  /* Accessibility: Respect reduced motion preferences */
  @media (prefers-reduced-motion: reduce) {
    :host {
      --shootingstar-frequency: 0;
    }
  }
`;
