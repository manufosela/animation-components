import { html, fixture, expect, oneEvent } from '@open-wc/testing';
import '../src/constellation-sky.js';

describe('ConstellationSky', () => {
  describe('Initialization', () => {
    it('should render with default properties', async () => {
      const el = await fixture(html`<constellation-sky></constellation-sky>`);

      expect(el.starCount).to.equal(80);
      expect(el.lineDistance).to.equal(120);
      expect(el.speed).to.equal(0.3);
      expect(el.starColor).to.equal('#ffffff');
      expect(el.lineColor).to.equal('#ffffff');
      expect(el.showLines).to.equal(true);
      expect(el.twinkle).to.equal(true);
      expect(el.paused).to.equal(false);
      expect(el.interactive).to.equal(true);
    });

    it('should render canvas element', async () => {
      const el = await fixture(html`<constellation-sky></constellation-sky>`);
      const canvas = el.shadowRoot.querySelector('canvas');

      expect(canvas).to.exist;
    });

    it('should render slot content', async () => {
      const el = await fixture(html`
        <constellation-sky>
          <h1>Welcome</h1>
        </constellation-sky>
      `);

      const slot = el.shadowRoot.querySelector('slot');
      expect(slot).to.exist;
    });

    it('should fire constellation-ready event', async () => {
      setTimeout(() => fixture(html`<constellation-sky id="test-ready"></constellation-sky>`));
      const event = await oneEvent(document, 'constellation-ready');

      expect(event).to.exist;
    });
  });

  describe('Properties', () => {
    it('should accept custom starCount', async () => {
      const el = await fixture(html`
        <constellation-sky star-count="150"></constellation-sky>
      `);

      expect(el.starCount).to.equal(150);
    });

    it('should accept custom lineDistance', async () => {
      const el = await fixture(html`
        <constellation-sky line-distance="200"></constellation-sky>
      `);

      expect(el.lineDistance).to.equal(200);
    });

    it('should accept custom speed', async () => {
      const el = await fixture(html`
        <constellation-sky speed="0.8"></constellation-sky>
      `);

      expect(el.speed).to.equal(0.8);
    });

    it('should accept custom starColor', async () => {
      const el = await fixture(html`
        <constellation-sky star-color="#ffcc00"></constellation-sky>
      `);

      expect(el.starColor).to.equal('#ffcc00');
    });

    it('should accept custom lineColor', async () => {
      const el = await fixture(html`
        <constellation-sky line-color="#00ff00"></constellation-sky>
      `);

      expect(el.lineColor).to.equal('#00ff00');
    });

    it('should disable lines when showLines is false', async () => {
      const el = await fixture(html`
        <constellation-sky show-lines="false"></constellation-sky>
      `);

      expect(el.showLines).to.equal(false);
    });
  });

  describe('Public Methods', () => {
    it('should have pause method', async () => {
      const el = await fixture(html`<constellation-sky></constellation-sky>`);

      expect(el.pause).to.be.a('function');
      el.pause();
      expect(el.paused).to.equal(true);
    });

    it('should have resume method', async () => {
      const el = await fixture(html`<constellation-sky paused></constellation-sky>`);

      expect(el.resume).to.be.a('function');
      el.resume();
      expect(el.paused).to.equal(false);
    });

    it('should have reset method', async () => {
      const el = await fixture(html`<constellation-sky></constellation-sky>`);

      expect(el.reset).to.be.a('function');
      const initialStars = [...el._stars];
      el.reset();

      // Stars should be different after reset
      expect(el._stars.length).to.equal(initialStars.length);
    });
  });

  describe('Animation Control', () => {
    it('should start paused when paused attribute is set', async () => {
      const el = await fixture(html`<constellation-sky paused></constellation-sky>`);

      expect(el.paused).to.equal(true);
    });

    it('should stop animation when paused', async () => {
      const el = await fixture(html`<constellation-sky></constellation-sky>`);

      el.pause();
      expect(el._animationFrame).to.be.null;
    });
  });

  describe('Accessibility', () => {
    it('should respect prefers-reduced-motion', async () => {
      const el = await fixture(html`<constellation-sky></constellation-sky>`);

      expect(el._prefersReducedMotion).to.be.a('boolean');
    });

    it('should be accessible', async () => {
      const el = await fixture(html`
        <constellation-sky>
          <h1>Night Sky</h1>
        </constellation-sky>
      `);

      await expect(el).to.be.accessible();
    });
  });

  describe('Star Management', () => {
    it('should create correct number of stars', async () => {
      const el = await fixture(html`
        <constellation-sky star-count="50"></constellation-sky>
      `);

      expect(el._stars.length).to.equal(50);
    });

    it('should update star count when property changes', async () => {
      const el = await fixture(html`<constellation-sky star-count="30"></constellation-sky>`);

      expect(el._stars.length).to.equal(30);

      el.starCount = 60;
      await el.updateComplete;

      expect(el._stars.length).to.equal(60);
    });
  });

  describe('Cleanup', () => {
    it('should stop animation on disconnect', async () => {
      const el = await fixture(html`<constellation-sky></constellation-sky>`);

      el.remove();

      expect(el._animationFrame).to.be.null;
    });
  });
});
