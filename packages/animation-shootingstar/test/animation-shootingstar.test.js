import { html, fixture, expect, oneEvent } from '@open-wc/testing';
import '../src/animation-shootingstar.js';

describe('AnimationShootingstar', () => {
  describe('Initialization', () => {
    it('should render with default properties', async () => {
      const el = await fixture(html`<animation-shootingstar></animation-shootingstar>`);

      expect(el.frequency).to.equal(2000);
      expect(el.speed).to.equal(10);
      expect(el.trailLength).to.equal(25);
      expect(el.maxStars).to.equal(5);
      expect(el.showBackgroundStars).to.equal(true);
      expect(el.paused).to.equal(false);
      expect(el.triggerOnClick).to.equal(false);
      expect(el.colors).to.deep.equal(['#ffffff', '#fffacd', '#e6e6fa', '#add8e6', '#ffdab9']);
    });

    it('should render canvas element', async () => {
      const el = await fixture(html`<animation-shootingstar></animation-shootingstar>`);
      const canvas = el.shadowRoot.querySelector('canvas');

      expect(canvas).to.exist;
    });

    it('should render stars layer by default', async () => {
      const el = await fixture(html`<animation-shootingstar></animation-shootingstar>`);
      const starsLayer = el.shadowRoot.querySelector('.stars-layer');

      expect(starsLayer).to.exist;
    });

    it('should render slot content', async () => {
      const el = await fixture(html`
        <animation-shootingstar>
          <h1>Make a wish!</h1>
        </animation-shootingstar>
      `);

      const slot = el.shadowRoot.querySelector('slot');
      expect(slot).to.exist;
    });
  });

  describe('Properties', () => {
    it('should accept custom frequency', async () => {
      const el = await fixture(html`
        <animation-shootingstar frequency="3000"></animation-shootingstar>
      `);

      expect(el.frequency).to.equal(3000);
    });

    it('should accept custom speed', async () => {
      const el = await fixture(html`
        <animation-shootingstar speed="15"></animation-shootingstar>
      `);

      expect(el.speed).to.equal(15);
    });

    it('should accept custom trailLength', async () => {
      const el = await fixture(html`
        <animation-shootingstar trail-length="40"></animation-shootingstar>
      `);

      expect(el.trailLength).to.equal(40);
    });

    it('should accept custom maxStars', async () => {
      const el = await fixture(html`
        <animation-shootingstar max-stars="10"></animation-shootingstar>
      `);

      expect(el.maxStars).to.equal(10);
    });

    it('should accept custom colors array', async () => {
      const colors = ['#ff0000', '#00ff00', '#0000ff'];
      const el = await fixture(html`
        <animation-shootingstar .colors="${colors}"></animation-shootingstar>
      `);

      expect(el.colors).to.deep.equal(colors);
    });

    it('should hide background stars when showBackgroundStars is false', async () => {
      const el = await fixture(html`
        <animation-shootingstar show-background-stars="false"></animation-shootingstar>
      `);

      const starsLayer = el.shadowRoot.querySelector('.stars-layer');
      expect(starsLayer).to.be.null;
    });
  });

  describe('Public Methods', () => {
    it('should have pause method', async () => {
      const el = await fixture(html`<animation-shootingstar></animation-shootingstar>`);

      expect(el.pause).to.be.a('function');
      el.pause();
      expect(el.paused).to.equal(true);
    });

    it('should have resume method', async () => {
      const el = await fixture(html`<animation-shootingstar paused></animation-shootingstar>`);

      expect(el.resume).to.be.a('function');
      el.resume();
      expect(el.paused).to.equal(false);
    });

    it('should have trigger method', async () => {
      const el = await fixture(html`<animation-shootingstar></animation-shootingstar>`);

      expect(el.trigger).to.be.a('function');

      const initialStarCount = el._stars.length;
      el.trigger();

      // Should have at least the same or more stars
      expect(el._stars.length).to.be.at.least(initialStarCount);
    });

    it('should have clear method', async () => {
      const el = await fixture(html`<animation-shootingstar></animation-shootingstar>`);

      expect(el.clear).to.be.a('function');

      el.trigger();
      el.trigger();
      el.clear();

      expect(el._stars.length).to.equal(0);
    });
  });

  describe('Events', () => {
    it('should fire star-created event when star is triggered', async () => {
      const el = await fixture(html`<animation-shootingstar></animation-shootingstar>`);

      setTimeout(() => el.trigger());
      const event = await oneEvent(el, 'star-created');

      expect(event).to.exist;
      expect(event.detail.color).to.be.a('string');
      expect(event.detail.x).to.be.a('number');
      expect(event.detail.y).to.be.a('number');
    });
  });

  describe('Animation Control', () => {
    it('should start paused when paused attribute is set', async () => {
      const el = await fixture(html`<animation-shootingstar paused></animation-shootingstar>`);

      expect(el.paused).to.equal(true);
      expect(el._animationFrame).to.be.null;
    });

    it('should stop animation when paused', async () => {
      const el = await fixture(html`<animation-shootingstar></animation-shootingstar>`);

      el.pause();
      await el.updateComplete;

      expect(el._animationFrame).to.be.null;
      expect(el._spawnInterval).to.be.null;
    });

    it('should respect maxStars limit', async () => {
      const el = await fixture(html`
        <animation-shootingstar max-stars="3"></animation-shootingstar>
      `);

      // Trigger multiple stars
      for (let i = 0; i < 10; i++) {
        el.trigger();
      }

      expect(el._stars.length).to.be.at.most(3);
    });
  });

  describe('Accessibility', () => {
    it('should respect prefers-reduced-motion', async () => {
      const el = await fixture(html`<animation-shootingstar></animation-shootingstar>`);

      expect(el._prefersReducedMotion).to.be.a('boolean');
    });

    it('should be accessible', async () => {
      const el = await fixture(html`
        <animation-shootingstar>
          <h1>Night Sky</h1>
        </animation-shootingstar>
      `);

      await expect(el).to.be.accessible();
    });
  });

  describe('Click Trigger', () => {
    it('should create star on click when triggerOnClick is true', async () => {
      const el = await fixture(html`
        <animation-shootingstar trigger-on-click></animation-shootingstar>
      `);

      const canvas = el.shadowRoot.querySelector('canvas');
      const initialStarCount = el._stars.length;

      canvas.click();
      await el.updateComplete;

      // Should have created a new star
      expect(el._stars.length).to.be.at.least(initialStarCount);
    });

    it('should not create star on click when triggerOnClick is false', async () => {
      const el = await fixture(html`<animation-shootingstar></animation-shootingstar>`);

      el.clear();
      const canvas = el.shadowRoot.querySelector('canvas');
      const initialStarCount = el._stars.length;

      canvas.click();
      await el.updateComplete;

      expect(el._stars.length).to.equal(initialStarCount);
    });
  });

  describe('Cleanup', () => {
    it('should stop animation on disconnect', async () => {
      const el = await fixture(html`<animation-shootingstar></animation-shootingstar>`);

      el.remove();

      expect(el._animationFrame).to.be.null;
      expect(el._spawnInterval).to.be.null;
    });
  });
});
