import { html, fixture, expect, oneEvent, aTimeout } from '@open-wc/testing';
import '../src/animation-handclock.js';

describe('AnimationHandclock', () => {
  it('renders with default properties', async () => {
    const el = await fixture(html`<animation-handclock></animation-handclock>`);

    expect(el).to.exist;
    expect(el.size).to.equal(200);
    expect(el.showSeconds).to.be.true;
    expect(el.showNumbers).to.be.true;
    expect(el.showMinuteMarkers).to.be.true;
    expect(el.theme).to.equal('light');
  });

  it('renders SVG container', async () => {
    const el = await fixture(html`<animation-handclock></animation-handclock>`);

    const svg = el.shadowRoot.querySelector('svg');
    expect(svg).to.exist;
  });

  it('renders clock face', async () => {
    const el = await fixture(html`<animation-handclock></animation-handclock>`);

    const face = el.shadowRoot.querySelector('.clock-face');
    expect(face).to.exist;
  });

  it('renders hour hand', async () => {
    const el = await fixture(html`<animation-handclock></animation-handclock>`);

    const hourHand = el.shadowRoot.querySelector('.hour-hand');
    expect(hourHand).to.exist;
  });

  it('renders minute hand', async () => {
    const el = await fixture(html`<animation-handclock></animation-handclock>`);

    const minuteHand = el.shadowRoot.querySelector('.minute-hand');
    expect(minuteHand).to.exist;
  });

  it('renders second hand when showSeconds is true', async () => {
    const el = await fixture(html`<animation-handclock show-seconds></animation-handclock>`);

    const secondHand = el.shadowRoot.querySelector('.second-hand');
    expect(secondHand).to.exist;
  });

  it('hides second hand when showSeconds is false', async () => {
    const el = await fixture(html`<animation-handclock .showSeconds=${false}></animation-handclock>`);

    const secondHand = el.shadowRoot.querySelector('.second-hand');
    expect(secondHand).to.be.null;
  });

  it('renders hour numbers when showNumbers is true', async () => {
    const el = await fixture(html`<animation-handclock show-numbers></animation-handclock>`);

    const numbers = el.shadowRoot.querySelectorAll('.hour-number');
    expect(numbers.length).to.equal(12);
  });

  it('hides hour numbers when showNumbers is false', async () => {
    const el = await fixture(html`<animation-handclock .showNumbers=${false}></animation-handclock>`);

    const numbers = el.shadowRoot.querySelectorAll('.hour-number');
    expect(numbers.length).to.equal(0);
  });

  it('renders 12 hour markers', async () => {
    const el = await fixture(html`<animation-handclock></animation-handclock>`);

    const hourMarkers = el.shadowRoot.querySelectorAll('.hour-marker');
    expect(hourMarkers.length).to.equal(12);
  });

  it('renders minute markers when showMinuteMarkers is true', async () => {
    const el = await fixture(html`<animation-handclock show-minute-markers></animation-handclock>`);

    const minuteMarkers = el.shadowRoot.querySelectorAll('.minute-marker');
    // 60 total - 12 hour positions = 48 minute markers
    expect(minuteMarkers.length).to.equal(48);
  });

  it('hides minute markers when showMinuteMarkers is false', async () => {
    const el = await fixture(html`<animation-handclock .showMinuteMarkers=${false}></animation-handclock>`);

    const minuteMarkers = el.shadowRoot.querySelectorAll('.minute-marker');
    expect(minuteMarkers.length).to.equal(0);
  });

  it('applies dark theme', async () => {
    const el = await fixture(html`<animation-handclock theme="dark"></animation-handclock>`);

    expect(el.theme).to.equal('dark');
    expect(el.getAttribute('theme')).to.equal('dark');
  });

  it('renders center dot', async () => {
    const el = await fixture(html`<animation-handclock></animation-handclock>`);

    const centerDot = el.shadowRoot.querySelector('.clock-center');
    expect(centerDot).to.exist;
  });

  it('fires time-change event', async () => {
    const el = await fixture(html`<animation-handclock></animation-handclock>`);

    // Wait for next time change
    const { detail } = await oneEvent(el, 'time-change');
    expect(detail).to.have.property('hours');
    expect(detail).to.have.property('minutes');
    expect(detail).to.have.property('seconds');
    expect(detail).to.have.property('timezone');
  });

  it('allows manual time setting via setTime()', async () => {
    const el = await fixture(html`<animation-handclock></animation-handclock>`);

    el.setTime(10, 30, 45);
    await el.updateComplete;

    const time = el.getTime();
    expect(time.hours).to.equal(10);
    expect(time.minutes).to.equal(30);
    expect(time.seconds).to.equal(45);
  });

  it('handles timezone property', async () => {
    const el = await fixture(html`<animation-handclock timezone="America/New_York"></animation-handclock>`);

    expect(el.timezone).to.equal('America/New_York');
  });

  it('falls back gracefully for invalid timezone', async () => {
    const el = await fixture(html`<animation-handclock timezone="Invalid/Timezone"></animation-handclock>`);

    // Should not throw and should have valid time values
    await aTimeout(100);
    const time = el.getTime();
    expect(time.hours).to.be.a('number');
    expect(time.minutes).to.be.a('number');
    expect(time.seconds).to.be.a('number');
  });

  it('calculates correct hour angle', async () => {
    const el = await fixture(html`<animation-handclock></animation-handclock>`);

    el.setTime(3, 0, 0);
    await el.updateComplete;

    // 3 o'clock = 90 degrees
    expect(el._getHourAngle()).to.equal(90);
  });

  it('calculates correct minute angle', async () => {
    const el = await fixture(html`<animation-handclock></animation-handclock>`);

    el.setTime(0, 15, 0);
    await el.updateComplete;

    // 15 minutes = 90 degrees
    expect(el._getMinuteAngle()).to.equal(90);
  });

  it('calculates correct second angle', async () => {
    const el = await fixture(html`<animation-handclock></animation-handclock>`);

    el.setTime(0, 0, 30);
    await el.updateComplete;

    // 30 seconds = 180 degrees
    expect(el._getSecondAngle()).to.equal(180);
  });

  it('has accessible role and aria-label', async () => {
    const el = await fixture(html`<animation-handclock></animation-handclock>`);

    const container = el.shadowRoot.querySelector('.clock-container');
    expect(container.getAttribute('role')).to.equal('img');
    expect(container.getAttribute('aria-label')).to.include('Analog clock');
  });

  it('is accessible', async () => {
    const el = await fixture(html`<animation-handclock></animation-handclock>`);

    await expect(el).to.be.accessible();
  });
});
