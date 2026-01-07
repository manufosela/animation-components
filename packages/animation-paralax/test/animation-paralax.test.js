import { html, fixture, expect, oneEvent } from '@open-wc/testing';
import '../src/animation-paralax.js';

describe('AnimationParalax', () => {
  const testLayers = [
    { src: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', speed: 0.2, type: 'background' },
    { src: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', speed: 0.5, type: 'midground' },
    { src: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', speed: 0.8, type: 'foreground' },
  ];

  it('renders with default properties', async () => {
    const el = await fixture(html`<animation-paralax></animation-paralax>`);

    expect(el).to.exist;
    expect(el.sensitivity).to.equal(1);
    expect(el.direction).to.equal('vertical');
    expect(el.scrollTarget).to.equal('window');
    expect(el.mouseEnabled).to.be.false;
    expect(el.disabled).to.be.false;
  });

  it('renders container element', async () => {
    const el = await fixture(html`<animation-paralax></animation-paralax>`);

    const container = el.shadowRoot.querySelector('.paralax-container');
    expect(container).to.exist;
  });

  it('renders layers when provided', async () => {
    const el = await fixture(html`<animation-paralax .layers=${testLayers}></animation-paralax>`);

    const layers = el.shadowRoot.querySelectorAll('.paralax-layer');
    expect(layers.length).to.equal(3);
  });

  it('renders images for each layer', async () => {
    const el = await fixture(html`<animation-paralax .layers=${testLayers}></animation-paralax>`);

    const images = el.shadowRoot.querySelectorAll('.paralax-layer img');
    expect(images.length).to.equal(3);
  });

  it('applies layer type classes', async () => {
    const el = await fixture(html`<animation-paralax .layers=${testLayers}></animation-paralax>`);

    const background = el.shadowRoot.querySelector('.paralax-layer.background');
    const midground = el.shadowRoot.querySelector('.paralax-layer.midground');
    const foreground = el.shadowRoot.querySelector('.paralax-layer.foreground');

    expect(background).to.exist;
    expect(midground).to.exist;
    expect(foreground).to.exist;
  });

  it('renders slot for content', async () => {
    const el = await fixture(html`
      <animation-paralax .layers=${testLayers}>
        <div class="test-content">Content</div>
      </animation-paralax>
    `);

    const slot = el.shadowRoot.querySelector('slot');
    expect(slot).to.exist;
  });

  it('accepts sensitivity property', async () => {
    const el = await fixture(html`<animation-paralax .sensitivity=${2}></animation-paralax>`);

    expect(el.sensitivity).to.equal(2);
  });

  it('accepts direction property', async () => {
    const el = await fixture(html`<animation-paralax direction="horizontal"></animation-paralax>`);

    expect(el.direction).to.equal('horizontal');
  });

  it('accepts both direction', async () => {
    const el = await fixture(html`<animation-paralax direction="both"></animation-paralax>`);

    expect(el.direction).to.equal('both');
  });

  it('can be disabled', async () => {
    const el = await fixture(html`<animation-paralax disabled></animation-paralax>`);

    expect(el.disabled).to.be.true;
  });

  it('reflects disabled attribute', async () => {
    const el = await fixture(html`<animation-paralax disabled></animation-paralax>`);

    expect(el.hasAttribute('disabled')).to.be.true;
  });

  it('enables mouse tracking when mouseEnabled is true', async () => {
    const el = await fixture(html`<animation-paralax mouse-enabled></animation-paralax>`);

    expect(el.mouseEnabled).to.be.true;
  });

  it('initializes offsets array based on layers', async () => {
    const el = await fixture(html`<animation-paralax .layers=${testLayers}></animation-paralax>`);

    expect(el._offsets.length).to.equal(testLayers.length);
  });

  it('reset() sets all offsets to zero', async () => {
    const el = await fixture(html`<animation-paralax .layers=${testLayers}></animation-paralax>`);

    // Simulate some offset changes
    el._offsets = [{ x: 10, y: 20 }, { x: 30, y: 40 }, { x: 50, y: 60 }];
    await el.updateComplete;

    el.reset();
    await el.updateComplete;

    el._offsets.forEach(offset => {
      expect(offset.x).to.equal(0);
      expect(offset.y).to.equal(0);
    });
  });

  it('addLayer() adds a new layer', async () => {
    const el = await fixture(html`<animation-paralax .layers=${testLayers}></animation-paralax>`);

    const newLayer = { src: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', speed: 0.3 };
    el.addLayer(newLayer);
    await el.updateComplete;

    expect(el.layers.length).to.equal(4);
    expect(el._offsets.length).to.equal(4);
  });

  it('removeLayer() removes a layer by index', async () => {
    const el = await fixture(html`<animation-paralax .layers=${testLayers}></animation-paralax>`);

    el.removeLayer(1);
    await el.updateComplete;

    expect(el.layers.length).to.equal(2);
    expect(el._offsets.length).to.equal(2);
  });

  it('removeLayer() does nothing for invalid index', async () => {
    const el = await fixture(html`<animation-paralax .layers=${testLayers}></animation-paralax>`);

    el.removeLayer(-1);
    el.removeLayer(100);
    await el.updateComplete;

    expect(el.layers.length).to.equal(3);
  });

  it('applies transform style to layers', async () => {
    const el = await fixture(html`<animation-paralax .layers=${testLayers}></animation-paralax>`);

    const layers = el.shadowRoot.querySelectorAll('.paralax-layer');
    layers.forEach(layer => {
      expect(layer.style.transform).to.include('translate3d');
    });
  });

  it('sets lazy loading on images', async () => {
    const el = await fixture(html`<animation-paralax .layers=${testLayers}></animation-paralax>`);

    const images = el.shadowRoot.querySelectorAll('img');
    images.forEach(img => {
      expect(img.getAttribute('loading')).to.equal('lazy');
    });
  });

  it('provides alt text for images', async () => {
    const layersWithAlt = [
      { src: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', speed: 0.2, alt: 'Background layer' },
    ];
    const el = await fixture(html`<animation-paralax .layers=${layersWithAlt}></animation-paralax>`);

    const img = el.shadowRoot.querySelector('img');
    expect(img.getAttribute('alt')).to.equal('Background layer');
  });

  it('provides default alt text when not specified', async () => {
    const el = await fixture(html`<animation-paralax .layers=${testLayers}></animation-paralax>`);

    const img = el.shadowRoot.querySelector('img');
    expect(img.getAttribute('alt')).to.include('Parallax layer');
  });

  it('fires layer-loaded event when images load', async () => {
    const el = await fixture(html`<animation-paralax .layers=${testLayers}></animation-paralax>`);

    // Trigger load event on all images
    const images = el.shadowRoot.querySelectorAll('img');
    setTimeout(() => {
      images.forEach(img => img.dispatchEvent(new Event('load')));
    });

    const { detail } = await oneEvent(el, 'layer-loaded');
    expect(detail.layerCount).to.equal(3);
  });

  it('is accessible', async () => {
    const el = await fixture(html`<animation-paralax .layers=${testLayers}></animation-paralax>`);

    await expect(el).to.be.accessible();
  });
});
