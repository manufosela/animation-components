import { html, fixture, expect } from '@open-wc/testing';
import '../src/scene-protonimg.js';

describe('SceneProtonimg', () => {
  it('renders with default values', async () => {
    const el = await fixture(html`<scene-protonimg></scene-protonimg>`);
    expect(el).to.exist;
    expect(el.time).to.equal(2);
    expect(el.width).to.equal(800);
    expect(el.height).to.equal(400);
    expect(el.background).to.equal('#000');
    expect(el.imagen1).to.equal('');
    expect(el.imagen2).to.equal('');
  });

  it('accepts custom attributes', async () => {
    const el = await fixture(html`
      <scene-protonimg
        time="10"
        width="500"
        height="250"
        background="#111"
      ></scene-protonimg>
    `);
    expect(el.time).to.equal(10);
    expect(el.width).to.equal(500);
    expect(el.height).to.equal(250);
    expect(el.background).to.equal('#111');
  });

  it('renders a canvas in shadow DOM', async () => {
    const el = await fixture(html`<scene-protonimg></scene-protonimg>`);
    await el.updateComplete;
    const canvas = el.shadowRoot.querySelector('#protonCanvas');
    expect(canvas).to.exist;
  });
});
