import { html, fixture, expect, oneEvent, aTimeout } from '@open-wc/testing';
import '../src/animation-fireflies.js';

describe('AnimationFireflies', () => {
  it('renders with default properties', async () => {
    const el = await fixture(html`<animation-fireflies></animation-fireflies>`);

    expect(el).to.exist;
    expect(el.count).to.equal(50);
    expect(el.glowSize).to.equal(20);
    expect(el.speed).to.equal(1);
    expect(el.minSize).to.equal(2);
    expect(el.maxSize).to.equal(5);
    expect(el.blinkSpeed).to.equal(1);
    expect(el.interactive).to.be.false;
    expect(el.paused).to.be.false;
  });

  it('renders canvas element', async () => {
    const el = await fixture(html`<animation-fireflies></animation-fireflies>`);

    const canvas = el.shadowRoot.querySelector('canvas');
    expect(canvas).to.exist;
  });

  it('renders container element', async () => {
    const el = await fixture(html`<animation-fireflies></animation-fireflies>`);

    const container = el.shadowRoot.querySelector('.fireflies-container');
    expect(container).to.exist;
  });

  it('renders slot for overlay content', async () => {
    const el = await fixture(html`
      <animation-fireflies>
        <div class="test-content">Content</div>
      </animation-fireflies>
    `);

    const slot = el.shadowRoot.querySelector('slot');
    expect(slot).to.exist;
  });

  it('accepts count property', async () => {
    const el = await fixture(html`<animation-fireflies .count=${100}></animation-fireflies>`);

    expect(el.count).to.equal(100);
  });

  it('accepts glowSize property', async () => {
    const el = await fixture(html`<animation-fireflies glow-size="30"></animation-fireflies>`);

    expect(el.glowSize).to.equal(30);
  });

  it('accepts speed property', async () => {
    const el = await fixture(html`<animation-fireflies .speed=${2}></animation-fireflies>`);

    expect(el.speed).to.equal(2);
  });

  it('accepts colors property', async () => {
    const customColors = ['#ff0000', '#00ff00', '#0000ff'];
    const el = await fixture(html`<animation-fireflies .colors=${customColors}></animation-fireflies>`);

    expect(el.colors).to.deep.equal(customColors);
  });

  it('accepts minSize property', async () => {
    const el = await fixture(html`<animation-fireflies min-size="3"></animation-fireflies>`);

    expect(el.minSize).to.equal(3);
  });

  it('accepts maxSize property', async () => {
    const el = await fixture(html`<animation-fireflies max-size="8"></animation-fireflies>`);

    expect(el.maxSize).to.equal(8);
  });

  it('accepts blinkSpeed property', async () => {
    const el = await fixture(html`<animation-fireflies blink-speed="2"></animation-fireflies>`);

    expect(el.blinkSpeed).to.equal(2);
  });

  it('accepts interactive property', async () => {
    const el = await fixture(html`<animation-fireflies interactive></animation-fireflies>`);

    expect(el.interactive).to.be.true;
  });

  it('accepts mouseAttraction property', async () => {
    const el = await fixture(html`<animation-fireflies mouse-attraction="0.8"></animation-fireflies>`);

    expect(el.mouseAttraction).to.equal(0.8);
  });

  it('can be paused', async () => {
    const el = await fixture(html`<animation-fireflies></animation-fireflies>`);

    el.pause();
    expect(el.paused).to.be.true;
  });

  it('can be resumed', async () => {
    const el = await fixture(html`<animation-fireflies paused></animation-fireflies>`);

    el.resume();
    expect(el.paused).to.be.false;
  });

  it('can toggle pause state', async () => {
    const el = await fixture(html`<animation-fireflies></animation-fireflies>`);

    expect(el.paused).to.be.false;
    el.toggle();
    expect(el.paused).to.be.true;
    el.toggle();
    expect(el.paused).to.be.false;
  });

  it('reflects paused attribute', async () => {
    const el = await fixture(html`<animation-fireflies></animation-fireflies>`);

    el.pause();
    await el.updateComplete;
    expect(el.hasAttribute('paused')).to.be.true;
  });

  it('fires animation-start event', async () => {
    const el = await fixture(html`<animation-fireflies paused></animation-fireflies>`);

    setTimeout(() => el.resume());
    const event = await oneEvent(el, 'animation-start');
    expect(event).to.exist;
  });

  it('fires animation-stop event', async () => {
    const el = await fixture(html`<animation-fireflies></animation-fireflies>`);

    await aTimeout(50);
    setTimeout(() => el.pause());
    const event = await oneEvent(el, 'animation-stop');
    expect(event).to.exist;
  });

  it('initializes fireflies array', async () => {
    const el = await fixture(html`<animation-fireflies .count=${30}></animation-fireflies>`);

    await aTimeout(50);
    expect(el._fireflies.length).to.equal(30);
  });

  it('addFireflies() adds more fireflies', async () => {
    const el = await fixture(html`<animation-fireflies .count=${10}></animation-fireflies>`);

    await aTimeout(50);
    el.addFireflies(5);
    expect(el._fireflies.length).to.equal(15);
    expect(el.count).to.equal(15);
  });

  it('removeFireflies() removes fireflies', async () => {
    const el = await fixture(html`<animation-fireflies .count=${10}></animation-fireflies>`);

    await aTimeout(50);
    el.removeFireflies(3);
    expect(el._fireflies.length).to.equal(7);
    expect(el.count).to.equal(7);
  });

  it('setColors() updates firefly colors', async () => {
    const el = await fixture(html`<animation-fireflies></animation-fireflies>`);

    const newColors = ['#ff0000', '#00ff00'];
    el.setColors(newColors);
    expect(el.colors).to.deep.equal(newColors);
  });

  it('getFireflyCount() returns correct count', async () => {
    const el = await fixture(html`<animation-fireflies .count=${25}></animation-fireflies>`);

    await aTimeout(50);
    expect(el.getFireflyCount()).to.equal(25);
  });

  it('reset() reinitializes fireflies', async () => {
    const el = await fixture(html`<animation-fireflies .count=${10}></animation-fireflies>`);

    await aTimeout(50);
    el.addFireflies(5);
    expect(el._fireflies.length).to.equal(15);

    el.count = 10;
    el.reset();
    await aTimeout(50);
    expect(el._fireflies.length).to.equal(10);
  });

  it('each firefly has required properties', async () => {
    const el = await fixture(html`<animation-fireflies .count=${5}></animation-fireflies>`);

    await aTimeout(50);
    el._fireflies.forEach(ff => {
      expect(ff).to.have.property('x');
      expect(ff).to.have.property('y');
      expect(ff).to.have.property('vx');
      expect(ff).to.have.property('vy');
      expect(ff).to.have.property('size');
      expect(ff).to.have.property('glowSize');
      expect(ff).to.have.property('color');
      expect(ff).to.have.property('brightness');
    });
  });

  it('converts hex to rgb correctly', async () => {
    const el = await fixture(html`<animation-fireflies></animation-fireflies>`);

    const rgb = el._hexToRgb('#ff8800');
    expect(rgb.r).to.equal(255);
    expect(rgb.g).to.equal(136);
    expect(rgb.b).to.equal(0);
  });

  it('has accessible role and aria-label', async () => {
    const el = await fixture(html`<animation-fireflies></animation-fireflies>`);

    const container = el.shadowRoot.querySelector('.fireflies-container');
    expect(container.getAttribute('role')).to.equal('img');
    expect(container.getAttribute('aria-label')).to.include('fireflies');
  });

  it('is accessible', async () => {
    const el = await fixture(html`<animation-fireflies></animation-fireflies>`);

    await expect(el).to.be.accessible();
  });
});
