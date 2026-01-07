import { html, fixture, expect, oneEvent, aTimeout } from '@open-wc/testing';
import '../src/animation-matrix.js';

describe('AnimationMatrix', () => {
  it('renders with default properties', async () => {
    const el = await fixture(html`<animation-matrix></animation-matrix>`);

    expect(el).to.exist;
    expect(el.fontSize).to.equal(14);
    expect(el.speed).to.equal(1);
    expect(el.color).to.equal('#00ff00');
    expect(el.highlightColor).to.equal('#ffffff');
    expect(el.density).to.equal(1);
    expect(el.fadeOpacity).to.equal(0.05);
    expect(el.trailLength).to.equal(20);
    expect(el.paused).to.be.false;
  });

  it('renders canvas element', async () => {
    const el = await fixture(html`<animation-matrix></animation-matrix>`);

    const canvas = el.shadowRoot.querySelector('canvas');
    expect(canvas).to.exist;
  });

  it('renders container element', async () => {
    const el = await fixture(html`<animation-matrix></animation-matrix>`);

    const container = el.shadowRoot.querySelector('.matrix-container');
    expect(container).to.exist;
  });

  it('accepts fontSize property', async () => {
    const el = await fixture(html`<animation-matrix font-size="20"></animation-matrix>`);

    expect(el.fontSize).to.equal(20);
  });

  it('accepts speed property', async () => {
    const el = await fixture(html`<animation-matrix .speed=${2}></animation-matrix>`);

    expect(el.speed).to.equal(2);
  });

  it('accepts color property', async () => {
    const el = await fixture(html`<animation-matrix color="#ff0000"></animation-matrix>`);

    expect(el.color).to.equal('#ff0000');
  });

  it('accepts highlightColor property', async () => {
    const el = await fixture(html`<animation-matrix highlight-color="#ffff00"></animation-matrix>`);

    expect(el.highlightColor).to.equal('#ffff00');
  });

  it('accepts characters property', async () => {
    const customChars = 'ABCD1234';
    const el = await fixture(html`<animation-matrix .characters=${customChars}></animation-matrix>`);

    expect(el.characters).to.equal(customChars);
  });

  it('accepts density property', async () => {
    const el = await fixture(html`<animation-matrix .density=${0.5}></animation-matrix>`);

    expect(el.density).to.equal(0.5);
  });

  it('accepts fadeOpacity property', async () => {
    const el = await fixture(html`<animation-matrix fade-opacity="0.1"></animation-matrix>`);

    expect(el.fadeOpacity).to.equal(0.1);
  });

  it('accepts trailLength property', async () => {
    const el = await fixture(html`<animation-matrix trail-length="30"></animation-matrix>`);

    expect(el.trailLength).to.equal(30);
  });

  it('can be paused', async () => {
    const el = await fixture(html`<animation-matrix></animation-matrix>`);

    el.pause();
    expect(el.paused).to.be.true;
  });

  it('can be resumed', async () => {
    const el = await fixture(html`<animation-matrix paused></animation-matrix>`);

    el.resume();
    expect(el.paused).to.be.false;
  });

  it('can toggle pause state', async () => {
    const el = await fixture(html`<animation-matrix></animation-matrix>`);

    expect(el.paused).to.be.false;
    el.toggle();
    expect(el.paused).to.be.true;
    el.toggle();
    expect(el.paused).to.be.false;
  });

  it('reflects paused attribute', async () => {
    const el = await fixture(html`<animation-matrix></animation-matrix>`);

    el.pause();
    await el.updateComplete;
    expect(el.hasAttribute('paused')).to.be.true;
  });

  it('fires animation-start event', async () => {
    const el = await fixture(html`<animation-matrix paused></animation-matrix>`);

    setTimeout(() => el.resume());
    const event = await oneEvent(el, 'animation-start');
    expect(event).to.exist;
  });

  it('fires animation-stop event', async () => {
    const el = await fixture(html`<animation-matrix></animation-matrix>`);

    await aTimeout(50); // Wait for animation to start
    setTimeout(() => el.pause());
    const event = await oneEvent(el, 'animation-stop');
    expect(event).to.exist;
  });

  it('setCharacters() updates characters', async () => {
    const el = await fixture(html`<animation-matrix></animation-matrix>`);

    const newChars = 'XYZ123';
    el.setCharacters(newChars);
    expect(el.characters).to.equal(newChars);
  });

  it('reset() reinitializes animation', async () => {
    const el = await fixture(html`<animation-matrix></animation-matrix>`);

    // Should not throw
    el.reset();
    expect(el).to.exist;
  });

  it('toDataURL() returns data URL string', async () => {
    const el = await fixture(html`<animation-matrix></animation-matrix>`);

    await aTimeout(100); // Wait for canvas to render
    const dataUrl = el.toDataURL();
    expect(dataUrl).to.be.a('string');
    expect(dataUrl).to.include('data:image/png');
  });

  it('initializes columns based on container width', async () => {
    const el = await fixture(html`
      <animation-matrix style="width: 200px; height: 200px;"></animation-matrix>
    `);

    await aTimeout(50);
    expect(el._columns.length).to.be.greaterThan(0);
  });

  it('has accessible role and aria-label', async () => {
    const el = await fixture(html`<animation-matrix></animation-matrix>`);

    const container = el.shadowRoot.querySelector('.matrix-container');
    expect(container.getAttribute('role')).to.equal('img');
    expect(container.getAttribute('aria-label')).to.include('Matrix');
  });

  it('handles random character generation', async () => {
    const el = await fixture(html`<animation-matrix></animation-matrix>`);

    const char1 = el._getRandomChar();
    expect(el.characters).to.include(char1);
  });

  it('converts hex to rgba correctly', async () => {
    const el = await fixture(html`<animation-matrix></animation-matrix>`);

    const rgba = el._hexToRgba('#00ff00', 0.5);
    expect(rgba).to.equal('rgba(0, 255, 0, 0.5)');
  });

  it('is accessible', async () => {
    const el = await fixture(html`<animation-matrix></animation-matrix>`);

    await expect(el).to.be.accessible();
  });
});
