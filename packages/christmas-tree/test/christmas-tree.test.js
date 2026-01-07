import { html, fixture, expect, oneEvent } from '@open-wc/testing';
import '../src/christmas-tree.js';

describe('ChristmasTree', () => {
  describe('Initialization', () => {
    it('should render with default properties', async () => {
      const el = await fixture(html`<christmas-tree></christmas-tree>`);

      expect(el.height).to.equal(300);
      expect(el.blinkSpeed).to.equal(800);
      expect(el.showStar).to.equal(true);
      expect(el.showOrnaments).to.equal(true);
      expect(el.showSnow).to.equal(false);
      expect(el.lightCount).to.equal(20);
      expect(el.lightsOn).to.equal(true);
      expect(el.lightColors).to.deep.equal(['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']);
    });

    it('should render SVG element', async () => {
      const el = await fixture(html`<christmas-tree></christmas-tree>`);
      const svg = el.shadowRoot.querySelector('svg');

      expect(svg).to.exist;
    });

    it('should render tree layers', async () => {
      const el = await fixture(html`<christmas-tree></christmas-tree>`);
      const treeLayers = el.shadowRoot.querySelectorAll('.tree-layer');

      expect(treeLayers.length).to.equal(3);
    });

    it('should render trunk', async () => {
      const el = await fixture(html`<christmas-tree></christmas-tree>`);
      const trunk = el.shadowRoot.querySelector('.trunk');

      expect(trunk).to.exist;
    });

    it('should fire tree-ready event', async () => {
      setTimeout(() => fixture(html`<christmas-tree></christmas-tree>`));
      const event = await oneEvent(document, 'tree-ready');

      expect(event).to.exist;
    });
  });

  describe('Properties', () => {
    it('should accept custom height', async () => {
      const el = await fixture(html`
        <christmas-tree height="500"></christmas-tree>
      `);

      expect(el.height).to.equal(500);
    });

    it('should accept custom blinkSpeed', async () => {
      const el = await fixture(html`
        <christmas-tree blink-speed="500"></christmas-tree>
      `);

      expect(el.blinkSpeed).to.equal(500);
    });

    it('should accept custom lightCount', async () => {
      const el = await fixture(html`
        <christmas-tree light-count="30"></christmas-tree>
      `);

      expect(el.lightCount).to.equal(30);
      expect(el._lights.length).to.equal(30);
    });

    it('should hide star when showStar is false', async () => {
      const el = await fixture(html`
        <christmas-tree show-star="false"></christmas-tree>
      `);

      const star = el.shadowRoot.querySelector('.star');
      expect(star).to.be.null;
    });

    it('should hide ornaments when showOrnaments is false', async () => {
      const el = await fixture(html`
        <christmas-tree show-ornaments="false"></christmas-tree>
      `);

      const ornaments = el.shadowRoot.querySelectorAll('.ornament');
      expect(ornaments.length).to.equal(0);
    });

    it('should show snow when showSnow is true', async () => {
      const el = await fixture(html`
        <christmas-tree show-snow></christmas-tree>
      `);

      const snow = el.shadowRoot.querySelectorAll('.snow');
      expect(snow.length).to.be.greaterThan(0);
    });
  });

  describe('Star', () => {
    it('should render star by default', async () => {
      const el = await fixture(html`<christmas-tree></christmas-tree>`);
      const star = el.shadowRoot.querySelector('.star');

      expect(star).to.exist;
    });

    it('should have animated class when reduced motion is not preferred', async () => {
      const el = await fixture(html`<christmas-tree></christmas-tree>`);

      // If reduced motion is not preferred, star should have animated class
      if (!el._prefersReducedMotion) {
        const star = el.shadowRoot.querySelector('.star');
        expect(star.classList.contains('animated')).to.be.true;
      }
    });
  });

  describe('Lights', () => {
    it('should generate correct number of lights', async () => {
      const el = await fixture(html`
        <christmas-tree light-count="25"></christmas-tree>
      `);

      expect(el._lights.length).to.equal(25);
    });

    it('should render lights in SVG', async () => {
      const el = await fixture(html`
        <christmas-tree light-count="15"></christmas-tree>
      `);

      const lights = el.shadowRoot.querySelectorAll('.light');
      expect(lights.length).to.equal(15);
    });

    it('should use custom light colors', async () => {
      const colors = ['#ffffff', '#000000'];
      const el = await fixture(html`
        <christmas-tree .lightColors="${colors}" light-count="10"></christmas-tree>
      `);

      const lightColors = el._lights.map(l => l.color);
      lightColors.forEach(color => {
        expect(colors).to.include(color);
      });
    });
  });

  describe('Public Methods', () => {
    it('should have toggleLights method', async () => {
      const el = await fixture(html`<christmas-tree></christmas-tree>`);

      expect(el.toggleLights).to.be.a('function');

      const initialState = el.lightsOn;
      el.toggleLights();
      expect(el.lightsOn).to.equal(!initialState);
    });

    it('should have lightsAllOn method', async () => {
      const el = await fixture(html`<christmas-tree></christmas-tree>`);

      el.lightsAllOn();
      el._lights.forEach(light => {
        expect(light.isOn).to.be.true;
      });
    });

    it('should have lightsAllOff method', async () => {
      const el = await fixture(html`<christmas-tree></christmas-tree>`);

      el.lightsAllOff();
      el._lights.forEach(light => {
        expect(light.isOn).to.be.false;
      });
    });
  });

  describe('Accessibility', () => {
    it('should respect prefers-reduced-motion', async () => {
      const el = await fixture(html`<christmas-tree></christmas-tree>`);

      expect(el._prefersReducedMotion).to.be.a('boolean');
    });

    it('should be accessible', async () => {
      const el = await fixture(html`<christmas-tree></christmas-tree>`);

      await expect(el).to.be.accessible();
    });
  });

  describe('Cleanup', () => {
    it('should stop blinking on disconnect', async () => {
      const el = await fixture(html`<christmas-tree></christmas-tree>`);

      el.remove();

      expect(el._blinkInterval).to.be.null;
    });
  });

  describe('CSS Custom Properties', () => {
    it('should apply custom tree height via property', async () => {
      const el = await fixture(html`
        <christmas-tree height="400"></christmas-tree>
      `);

      await el.updateComplete;

      const computedStyle = getComputedStyle(el);
      expect(computedStyle.getPropertyValue('--christmas-tree-height')).to.equal('400px');
    });
  });
});
