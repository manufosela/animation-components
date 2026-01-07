import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
    width: var(--solarsystem-width, 600px);
    height: var(--solarsystem-height, 600px);
    background: var(--solarsystem-background, radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a15 100%));
    border-radius: var(--solarsystem-border-radius, 8px);
    overflow: hidden;
    position: relative;
  }

  :host([hidden]) {
    display: none;
  }

  .solar-system-container {
    width: 100%;
    height: 100%;
    position: relative;
  }

  svg {
    width: 100%;
    height: 100%;
  }

  .sun {
    fill: var(--solarsystem-sun-color, #ffd700);
    filter: drop-shadow(0 0 20px var(--solarsystem-sun-glow, #ff8c00));
  }

  .orbit {
    fill: none;
    stroke: var(--solarsystem-orbit-color, rgba(255, 255, 255, 0.2));
    stroke-width: var(--solarsystem-orbit-width, 1);
    stroke-dasharray: var(--solarsystem-orbit-dash, 4 4);
  }

  .planet {
    transition: filter 0.3s ease;
  }

  .planet:hover {
    filter: brightness(1.3) drop-shadow(0 0 10px currentColor);
    cursor: pointer;
  }

  .planet-label {
    fill: var(--solarsystem-label-color, #ffffff);
    font-size: var(--solarsystem-label-size, 10px);
    font-family: var(--solarsystem-font-family, 'Arial', sans-serif);
    text-anchor: middle;
    pointer-events: none;
  }

  .stars {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .star {
    fill: var(--solarsystem-star-color, #ffffff);
    opacity: 0.8;
  }

  /* Accessibility: Respect reduced motion preference */
  @media (prefers-reduced-motion: reduce) {
    .planet,
    .orbit {
      animation: none !important;
      transition: none !important;
    }
  }
`;
