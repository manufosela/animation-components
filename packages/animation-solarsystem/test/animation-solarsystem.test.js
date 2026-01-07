import { html, fixture, expect, oneEvent, aTimeout } from '@open-wc/testing';
import '../src/animation-solarsystem.js';

describe('AnimationSolarsystem', () => {
  it('renders with default properties', async () => {
    const el = await fixture(html`<animation-solarsystem></animation-solarsystem>`);

    expect(el).to.exist;
    expect(el.showLabels).to.be.true;
    expect(el.speed).to.equal(1);
    expect(el.scale).to.equal(1);
    expect(el.showOrbits).to.be.true;
    expect(el.paused).to.be.false;
  });

  it('renders SVG container', async () => {
    const el = await fixture(html`<animation-solarsystem></animation-solarsystem>`);

    const svg = el.shadowRoot.querySelector('svg');
    expect(svg).to.exist;
  });

  it('renders the sun', async () => {
    const el = await fixture(html`<animation-solarsystem></animation-solarsystem>`);

    const sun = el.shadowRoot.querySelector('.sun');
    expect(sun).to.exist;
  });

  it('renders all 8 planets', async () => {
    const el = await fixture(html`<animation-solarsystem></animation-solarsystem>`);

    const planets = el.shadowRoot.querySelectorAll('.planet');
    expect(planets.length).to.equal(8);
  });

  it('hides labels when showLabels is false', async () => {
    const el = await fixture(html`<animation-solarsystem .showLabels=${false}></animation-solarsystem>`);

    const labels = el.shadowRoot.querySelectorAll('.planet-label');
    expect(labels.length).to.equal(0);
  });

  it('shows labels when showLabels is true', async () => {
    const el = await fixture(html`<animation-solarsystem .showLabels=${true}></animation-solarsystem>`);

    const labels = el.shadowRoot.querySelectorAll('.planet-label');
    expect(labels.length).to.equal(8);
  });

  it('renders orbits when showOrbits is true', async () => {
    const el = await fixture(html`<animation-solarsystem .showOrbits=${true}></animation-solarsystem>`);

    const orbits = el.shadowRoot.querySelectorAll('.orbit');
    expect(orbits.length).to.equal(8);
  });

  it('hides orbits when showOrbits is false', async () => {
    const el = await fixture(html`<animation-solarsystem .showOrbits=${false}></animation-solarsystem>`);

    const orbits = el.shadowRoot.querySelectorAll('.orbit');
    expect(orbits.length).to.equal(0);
  });

  it('fires planet-click event when planet is clicked', async () => {
    const el = await fixture(html`<animation-solarsystem></animation-solarsystem>`);

    const planet = el.shadowRoot.querySelector('.planet');
    setTimeout(() => planet.parentElement.click());

    const { detail } = await oneEvent(el, 'planet-click');
    expect(detail.planet).to.exist;
    expect(detail.planet.name).to.exist;
  });

  it('pauses animation when pause() is called', async () => {
    const el = await fixture(html`<animation-solarsystem></animation-solarsystem>`);

    el.pause();
    expect(el.paused).to.be.true;
  });

  it('resumes animation when resume() is called', async () => {
    const el = await fixture(html`<animation-solarsystem></animation-solarsystem>`);

    el.pause();
    el.resume();
    expect(el.paused).to.be.false;
  });

  it('toggles pause state when toggle() is called', async () => {
    const el = await fixture(html`<animation-solarsystem></animation-solarsystem>`);

    expect(el.paused).to.be.false;
    el.toggle();
    expect(el.paused).to.be.true;
    el.toggle();
    expect(el.paused).to.be.false;
  });

  it('resets animation when reset() is called', async () => {
    const el = await fixture(html`<animation-solarsystem></animation-solarsystem>`);

    // Wait a bit for animation to progress
    await aTimeout(100);
    el.reset();
    expect(el._currentTime).to.equal(0);
  });

  it('applies scale property correctly', async () => {
    const el = await fixture(html`<animation-solarsystem .scale=${0.5}></animation-solarsystem>`);

    expect(el.scale).to.equal(0.5);
  });

  it('applies speed property correctly', async () => {
    const el = await fixture(html`<animation-solarsystem .speed=${2}></animation-solarsystem>`);

    expect(el.speed).to.equal(2);
  });

  it('renders stars', async () => {
    const el = await fixture(html`<animation-solarsystem></animation-solarsystem>`);

    const stars = el.shadowRoot.querySelectorAll('.star');
    expect(stars.length).to.be.greaterThan(0);
  });

  it('is accessible', async () => {
    const el = await fixture(html`<animation-solarsystem></animation-solarsystem>`);

    await expect(el).to.be.accessible();
  });
});
