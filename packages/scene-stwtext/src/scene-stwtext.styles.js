import { css } from 'lit';

/**
 * Styles for the scene-stwtext component
 * @type {import('lit').CSSResult}
 */
export const styles = css`
  :host {
    display: block;
    position: relative;
    width: var(--stwtext-width, 100%);
    height: var(--stwtext-height, 100vh);
    background: var(--stwtext-background, #000);
    overflow: hidden;
    font-family: var(--stwtext-font-family, 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif);
  }

  :host([hidden]) {
    display: none;
  }

  .stars {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
      radial-gradient(2px 2px at 20px 30px, white, transparent),
      radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
      radial-gradient(1px 1px at 90px 40px, white, transparent),
      radial-gradient(2px 2px at 160px 120px, rgba(255,255,255,0.9), transparent),
      radial-gradient(1px 1px at 230px 80px, white, transparent),
      radial-gradient(2px 2px at 300px 150px, rgba(255,255,255,0.7), transparent),
      radial-gradient(1px 1px at 370px 60px, white, transparent),
      radial-gradient(2px 2px at 440px 200px, rgba(255,255,255,0.8), transparent),
      radial-gradient(1px 1px at 510px 100px, white, transparent),
      radial-gradient(2px 2px at 580px 180px, rgba(255,255,255,0.9), transparent);
    background-size: 600px 300px;
    animation: twinkle 8s ease-in-out infinite alternate;
    opacity: 0.7;
  }

  @keyframes twinkle {
    0%, 100% {
      opacity: 0.5;
    }
    50% {
      opacity: 0.8;
    }
  }

  .intro {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: var(--stwtext-intro-color, #4ee);
    font-size: var(--stwtext-intro-size, 2rem);
    text-align: center;
    opacity: 0;
    animation: intro-fade var(--intro-duration, 4s) ease-in-out forwards;
    animation-delay: var(--intro-delay, 0s);
    letter-spacing: 0.1em;
  }

  @keyframes intro-fade {
    0% {
      opacity: 1;
    }
    80% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  .logo-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    animation: logo-zoom var(--logo-duration, 6s) ease-out forwards;
    animation-delay: var(--logo-delay, 4s);
  }

  @keyframes logo-zoom {
    0% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
    80% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.1);
    }
  }

  .logo-container img,
  .logo-container ::slotted(img),
  .logo-container ::slotted(svg) {
    max-width: 80vw;
    max-height: 40vh;
  }

  .perspective-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    perspective: var(--stwtext-perspective, 400px);
    perspective-origin: 50% 100%;
    overflow: hidden;
  }

  .crawl-container {
    position: absolute;
    top: 100%;
    left: 50%;
    width: var(--stwtext-text-width, 80%);
    max-width: 800px;
    transform-origin: 50% 100%;
    transform: translateX(-50%) rotateX(var(--stwtext-rotation, 25deg));
  }

  .crawl-text {
    color: var(--stwtext-text-color, #ffd700);
    font-size: var(--stwtext-font-size, 2rem);
    line-height: 1.6;
    text-align: justify;
    animation: crawl var(--crawl-duration, 60s) linear forwards;
    animation-delay: var(--crawl-delay, 10s);
    animation-play-state: var(--animation-state, running);
  }

  @keyframes crawl {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(calc(-100% - var(--stwtext-height, 100vh) - 200px));
    }
  }

  .crawl-text h1,
  .crawl-text ::slotted(h1) {
    font-size: 2.5em;
    text-align: center;
    margin-bottom: 1em;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .crawl-text p,
  .crawl-text ::slotted(p) {
    margin-bottom: 1.5em;
  }

  .fade-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: var(--stwtext-fade-distance, 30%);
    background: linear-gradient(
      to bottom,
      var(--stwtext-background, #000) 0%,
      transparent 100%
    );
    pointer-events: none;
    z-index: 10;
  }

  .controls {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 20;
    display: flex;
    gap: 10px;
    opacity: 0;
    transition: opacity 0.3s;
  }

  :host(:hover) .controls {
    opacity: 1;
  }

  .controls button {
    padding: 10px 20px;
    background: rgba(255, 215, 0, 0.2);
    border: 1px solid #ffd700;
    color: #ffd700;
    cursor: pointer;
    font-size: 0.9rem;
    border-radius: 4px;
    transition: background 0.2s;
  }

  .controls button:hover {
    background: rgba(255, 215, 0, 0.4);
  }

  /* Accessibility: Respect reduced motion preferences */
  @media (prefers-reduced-motion: reduce) {
    .crawl-text {
      animation: none;
      transform: translateY(-50%);
    }

    .intro,
    .logo-container {
      animation: none;
      opacity: 0;
    }

    .stars {
      animation: none;
    }
  }
`;
