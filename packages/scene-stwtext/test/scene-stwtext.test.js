import { html, fixture, expect, oneEvent } from '@open-wc/testing';
import '../src/scene-stwtext.js';

describe('SceneStwtext', () => {
  describe('Initialization', () => {
    it('should render with default properties', async () => {
      const el = await fixture(html`<scene-stwtext></scene-stwtext>`);

      expect(el.speed).to.equal(60);
      expect(el.perspective).to.equal(400);
      expect(el.fadeDistance).to.equal(30);
      expect(el.introDuration).to.equal(4);
      expect(el.logoDuration).to.equal(6);
      expect(el.showStars).to.equal(true);
      expect(el.showControls).to.equal(true);
      expect(el.paused).to.equal(false);
      expect(el.autoplay).to.equal(true);
    });

    it('should render perspective container', async () => {
      const el = await fixture(html`<scene-stwtext></scene-stwtext>`);
      const perspectiveContainer = el.shadowRoot.querySelector('.perspective-container');

      expect(perspectiveContainer).to.exist;
    });

    it('should render crawl text container', async () => {
      const el = await fixture(html`<scene-stwtext></scene-stwtext>`);
      const crawlText = el.shadowRoot.querySelector('.crawl-text');

      expect(crawlText).to.exist;
    });

    it('should render stars background by default', async () => {
      const el = await fixture(html`<scene-stwtext></scene-stwtext>`);
      const stars = el.shadowRoot.querySelector('.stars');

      expect(stars).to.exist;
    });
  });

  describe('Properties', () => {
    it('should accept custom speed', async () => {
      const el = await fixture(html`
        <scene-stwtext speed="80"></scene-stwtext>
      `);

      expect(el.speed).to.equal(80);
    });

    it('should accept custom perspective', async () => {
      const el = await fixture(html`
        <scene-stwtext perspective="600"></scene-stwtext>
      `);

      expect(el.perspective).to.equal(600);
    });

    it('should accept custom fadeDistance', async () => {
      const el = await fixture(html`
        <scene-stwtext fade-distance="40"></scene-stwtext>
      `);

      expect(el.fadeDistance).to.equal(40);
    });

    it('should accept intro text', async () => {
      const el = await fixture(html`
        <scene-stwtext intro-text="A long time ago..."></scene-stwtext>
      `);

      expect(el.introText).to.equal('A long time ago...');
      const intro = el.shadowRoot.querySelector('.intro');
      expect(intro).to.exist;
    });

    it('should accept logo src', async () => {
      const el = await fixture(html`
        <scene-stwtext logo-src="logo.png"></scene-stwtext>
      `);

      expect(el.logoSrc).to.equal('logo.png');
      const logo = el.shadowRoot.querySelector('.logo-container img');
      expect(logo).to.exist;
      expect(logo.src).to.include('logo.png');
    });

    it('should hide stars when showStars is false', async () => {
      const el = await fixture(html`
        <scene-stwtext show-stars="false"></scene-stwtext>
      `);

      const stars = el.shadowRoot.querySelector('.stars');
      expect(stars).to.be.null;
    });

    it('should hide controls when showControls is false', async () => {
      const el = await fixture(html`
        <scene-stwtext show-controls="false"></scene-stwtext>
      `);

      const controls = el.shadowRoot.querySelector('.controls');
      expect(controls).to.be.null;
    });
  });

  describe('Text Content', () => {
    it('should render text from property', async () => {
      const el = await fixture(html`
        <scene-stwtext text="Hello World"></scene-stwtext>
      `);

      const crawlText = el.shadowRoot.querySelector('.crawl-text');
      expect(crawlText.textContent).to.include('Hello World');
    });

    it('should render text from slot', async () => {
      const el = await fixture(html`
        <scene-stwtext>
          <p>Episode IV content</p>
        </scene-stwtext>
      `);

      const slot = el.shadowRoot.querySelector('slot:not([name])');
      expect(slot).to.exist;
    });

    it('should render headings from text with # prefix', async () => {
      const el = await fixture(html`
        <scene-stwtext text="# Episode IV

This is a paragraph."></scene-stwtext>
      `);

      const heading = el.shadowRoot.querySelector('.crawl-text h1');
      expect(heading).to.exist;
      expect(heading.textContent).to.equal('Episode IV');
    });
  });

  describe('Public Methods', () => {
    it('should have pause method', async () => {
      const el = await fixture(html`<scene-stwtext></scene-stwtext>`);

      expect(el.pause).to.be.a('function');
      el.pause();
      expect(el.paused).to.equal(true);
    });

    it('should have resume method', async () => {
      const el = await fixture(html`<scene-stwtext paused></scene-stwtext>`);

      expect(el.resume).to.be.a('function');
      el.resume();
      expect(el.paused).to.equal(false);
    });

    it('should have togglePause method', async () => {
      const el = await fixture(html`<scene-stwtext></scene-stwtext>`);

      expect(el.togglePause).to.be.a('function');

      el.togglePause();
      expect(el.paused).to.equal(true);

      el.togglePause();
      expect(el.paused).to.equal(false);
    });

    it('should have restart method', async () => {
      const el = await fixture(html`<scene-stwtext></scene-stwtext>`);

      expect(el.restart).to.be.a('function');
      el.pause();
      el.restart();
      expect(el.paused).to.equal(false);
    });
  });

  describe('Events', () => {
    it('should fire animation-pause when paused', async () => {
      const el = await fixture(html`<scene-stwtext></scene-stwtext>`);

      setTimeout(() => el.pause());
      const event = await oneEvent(el, 'animation-pause');

      expect(event).to.exist;
    });

    it('should fire animation-resume when resumed', async () => {
      const el = await fixture(html`<scene-stwtext paused></scene-stwtext>`);

      setTimeout(() => el.resume());
      const event = await oneEvent(el, 'animation-resume');

      expect(event).to.exist;
    });
  });

  describe('CSS Custom Properties', () => {
    it('should update perspective CSS variable', async () => {
      const el = await fixture(html`
        <scene-stwtext perspective="600"></scene-stwtext>
      `);

      const style = el.style.getPropertyValue('--stwtext-perspective');
      expect(style).to.equal('600px');
    });

    it('should update fade-distance CSS variable', async () => {
      const el = await fixture(html`
        <scene-stwtext fade-distance="50"></scene-stwtext>
      `);

      const style = el.style.getPropertyValue('--stwtext-fade-distance');
      expect(style).to.equal('50%');
    });

    it('should update animation state based on paused', async () => {
      const el = await fixture(html`<scene-stwtext></scene-stwtext>`);

      el.pause();
      await el.updateComplete;

      const style = el.style.getPropertyValue('--animation-state');
      expect(style).to.equal('paused');
    });
  });

  describe('Controls', () => {
    it('should render pause/resume button', async () => {
      const el = await fixture(html`<scene-stwtext show-controls></scene-stwtext>`);

      const buttons = el.shadowRoot.querySelectorAll('.controls button');
      expect(buttons.length).to.equal(2);
    });

    it('should toggle pause when button clicked', async () => {
      const el = await fixture(html`<scene-stwtext show-controls></scene-stwtext>`);

      const pauseBtn = el.shadowRoot.querySelector('.controls button');
      pauseBtn.click();
      await el.updateComplete;

      expect(el.paused).to.equal(true);
    });
  });

  describe('Accessibility', () => {
    it('should respect prefers-reduced-motion', async () => {
      const el = await fixture(html`<scene-stwtext></scene-stwtext>`);

      expect(el._prefersReducedMotion).to.be.a('boolean');
    });

    it('should be accessible', async () => {
      const el = await fixture(html`
        <scene-stwtext intro-text="A long time ago...">
          <h1>Episode IV</h1>
          <p>It is a period of civil war.</p>
        </scene-stwtext>
      `);

      await expect(el).to.be.accessible();
    });
  });

  describe('Slots', () => {
    it('should render intro slot content', async () => {
      const el = await fixture(html`
        <scene-stwtext>
          <span slot="intro">Custom intro text</span>
        </scene-stwtext>
      `);

      const introSlot = el.shadowRoot.querySelector('slot[name="intro"]');
      expect(introSlot).to.exist;
    });

    it('should render logo slot content', async () => {
      const el = await fixture(html`
        <scene-stwtext>
          <img slot="logo" src="logo.png" alt="Logo">
        </scene-stwtext>
      `);

      const logoSlot = el.shadowRoot.querySelector('slot[name="logo"]');
      expect(logoSlot).to.exist;
    });
  });
});
