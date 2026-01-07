import { css } from 'lit';

/**
 * Styles for the christmas-tree component
 * @type {import('lit').CSSResult}
 */
export const styles = css`
  :host {
    display: inline-block;
    --tree-height: var(--christmas-tree-height, 300px);
    --tree-color: var(--christmas-tree-color, #0d5c0d);
    --trunk-color: var(--christmas-trunk-color, #8b4513);
    --star-color: var(--christmas-star-color, #ffd700);
  }

  :host([hidden]) {
    display: none;
  }

  .tree-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: var(--tree-height);
    aspect-ratio: 0.7;
  }

  svg {
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  .tree-layer {
    fill: var(--tree-color);
    filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.3));
  }

  .trunk {
    fill: var(--trunk-color);
  }

  .star {
    fill: var(--star-color);
    filter: drop-shadow(0 0 10px var(--star-color));
  }

  .star.animated {
    animation: star-pulse 2s ease-in-out infinite;
  }

  .light {
    filter: drop-shadow(0 0 6px currentColor);
    transition: opacity 0.3s ease;
  }

  .light.on {
    opacity: 1;
  }

  .light.off {
    opacity: 0.3;
  }

  .ornament {
    filter: drop-shadow(1px 2px 3px rgba(0, 0, 0, 0.3));
  }

  .snow {
    fill: white;
    opacity: 0.9;
  }

  @keyframes star-pulse {
    0%, 100% {
      transform: scale(1);
      filter: drop-shadow(0 0 10px var(--star-color));
    }
    50% {
      transform: scale(1.1);
      filter: drop-shadow(0 0 20px var(--star-color));
    }
  }

  /* Accessibility: Respect reduced motion preferences */
  @media (prefers-reduced-motion: reduce) {
    .star.animated {
      animation: none;
    }

    .light {
      transition: none;
    }
  }
`;
