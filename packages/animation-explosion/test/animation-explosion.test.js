import { html, fixture, expect, oneEvent } from '@open-wc/testing';
import '../src/animation-explosion.js';

describe('AnimationExplosion', () => {
  describe('Initialization', () => {
    it('should render with default properties', async () => {
      const el = await fixture(html`<animation-explosion></animation-explosion>`);

      expect(el.particleCount).to.equal(30);
      expect(el.duration).to.equal(1500);
      expect(el.gravity).to.equal(0.1);
      expect(el.spread).to.equal(360);
      expect(el.triggerOnClick).to.equal(true);
      expect(el.colors).to.deep.equal(['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7']);
    });

    it('should render canvas element', async () => {
      const el = await fixture(html`<animation-explosion></animation-explosion>`);
      const canvas = el.shadowRoot.querySelector('canvas');

      expect(canvas).to.exist;
    });

    it('should render slot content', async () => {
      const el = await fixture(html`
        <animation-explosion>
          <button>Click me</button>
        </animation-explosion>
      `);

      const slot = el.shadowRoot.querySelector('slot');
      expect(slot).to.exist;
    });
  });

  describe('Properties', () => {
    it('should accept custom particleCount', async () => {
      const el = await fixture(html`
        <animation-explosion particle-count="50"></animation-explosion>
      `);

      expect(el.particleCount).to.equal(50);
    });

    it('should accept custom colors array', async () => {
      const colors = ['#ff0000', '#00ff00', '#0000ff'];
      const el = await fixture(html`
        <animation-explosion .colors="${colors}"></animation-explosion>
      `);

      expect(el.colors).to.deep.equal(colors);
    });

    it('should accept custom duration', async () => {
      const el = await fixture(html`
        <animation-explosion duration="2000"></animation-explosion>
      `);

      expect(el.duration).to.equal(2000);
    });

    it('should accept custom gravity', async () => {
      const el = await fixture(html`
        <animation-explosion gravity="0.5"></animation-explosion>
      `);

      expect(el.gravity).to.equal(0.5);
    });

    it('should accept custom spread', async () => {
      const el = await fixture(html`
        <animation-explosion spread="180"></animation-explosion>
      `);

      expect(el.spread).to.equal(180);
    });

    it('should disable click trigger when triggerOnClick is false', async () => {
      const el = await fixture(html`
        <animation-explosion trigger-on-click="false"></animation-explosion>
      `);

      expect(el.triggerOnClick).to.equal(false);
    });
  });

  describe('Events', () => {
    it('should fire explosion-start event when explode is called', async () => {
      const el = await fixture(html`<animation-explosion></animation-explosion>`);

      setTimeout(() => el.explode(50, 50));
      const event = await oneEvent(el, 'explosion-start');

      expect(event).to.exist;
      expect(event.detail.x).to.equal(50);
      expect(event.detail.y).to.equal(50);
    });

    it('should fire explosion-end event when animation completes', async () => {
      const el = await fixture(html`
        <animation-explosion duration="100"></animation-explosion>
      `);

      setTimeout(() => el.explode(50, 50));

      const startEvent = await oneEvent(el, 'explosion-start');
      expect(startEvent).to.exist;

      const endEvent = await oneEvent(el, 'explosion-end');
      expect(endEvent).to.exist;
    });
  });

  describe('Public Methods', () => {
    it('should have explode method', async () => {
      const el = await fixture(html`<animation-explosion></animation-explosion>`);

      expect(el.explode).to.be.a('function');
    });

    it('should explode at center when no coordinates provided', async () => {
      const el = await fixture(html`<animation-explosion></animation-explosion>`);

      setTimeout(() => el.explode());
      const event = await oneEvent(el, 'explosion-start');

      expect(event.detail.x).to.be.a('number');
      expect(event.detail.y).to.be.a('number');
    });
  });

  describe('Accessibility', () => {
    it('should respect prefers-reduced-motion', async () => {
      const el = await fixture(html`<animation-explosion></animation-explosion>`);

      // The component should have the _prefersReducedMotion property
      expect(el._prefersReducedMotion).to.be.a('boolean');
    });

    it('should be accessible', async () => {
      const el = await fixture(html`
        <animation-explosion>
          <button>Trigger Explosion</button>
        </animation-explosion>
      `);

      await expect(el).to.be.accessible();
    });
  });

  describe('Cleanup', () => {
    it('should stop animation on disconnect', async () => {
      const el = await fixture(html`<animation-explosion></animation-explosion>`);

      el.explode(50, 50);
      el.remove();

      expect(el._isAnimating).to.equal(false);
    });
  });
});
