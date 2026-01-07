# @manufosela/animation-paralax

A parallax scrolling effects web component built with Lit 3. Create immersive multi-layer parallax experiences with configurable scroll speeds and optional mouse tracking.

## Installation

```bash
npm install @manufosela/animation-paralax
```

## Usage

### Basic Usage

```html
<script type="module">
  import '@manufosela/animation-paralax';
</script>

<animation-paralax id="paralax">
  <div class="content">
    <h1>Your Content Here</h1>
  </div>
</animation-paralax>

<script>
  document.getElementById('paralax').layers = [
    { src: '/images/background.jpg', speed: 0.2, type: 'background' },
    { src: '/images/midground.png', speed: 0.5, type: 'midground' },
    { src: '/images/foreground.png', speed: 0.8, type: 'foreground' },
  ];
</script>
```

### With Mouse Tracking

```html
<animation-paralax
  mouse-enabled
  direction="both"
  sensitivity="1.5"
></animation-paralax>
```

### JavaScript API

```javascript
const paralax = document.querySelector('animation-paralax');

// Add a layer dynamically
paralax.addLayer({
  src: '/images/new-layer.png',
  speed: 0.4,
  type: 'midground',
  alt: 'New decorative layer'
});

// Remove a layer by index
paralax.removeLayer(1);

// Reset all offsets
paralax.reset();

// Manually trigger update
paralax.refresh();
```

## Properties

| Property        | Type      | Default      | Description                                  |
| --------------- | --------- | ------------ | -------------------------------------------- |
| `layers`        | `Array`   | `[]`         | Array of layer configurations                |
| `sensitivity`   | `Number`  | `1`          | Movement sensitivity multiplier              |
| `direction`     | `String`  | `'vertical'` | Direction: 'vertical', 'horizontal', 'both'  |
| `scrollTarget`  | `String`  | `'window'`   | CSS selector for scroll container            |
| `mouseEnabled`  | `Boolean` | `false`      | Enable mouse movement tracking               |
| `disabled`      | `Boolean` | `false`      | Disable parallax effect                      |

### Layer Configuration

```typescript
interface ParalaxLayer {
  src: string;      // Image URL
  speed: number;    // Movement speed (0-1, where 0 is fixed, 1 is same as scroll)
  type?: string;    // 'background', 'midground', 'foreground' (for z-index)
  alt?: string;     // Alt text for accessibility
  position?: string; // CSS object-position (default: 'center')
  size?: string;    // CSS object-fit (default: 'cover')
}
```

## Events

| Event           | Detail                                           | Description                           |
| --------------- | ------------------------------------------------ | ------------------------------------- |
| `layer-loaded`  | `{ layerCount: number }`                         | Fired when all layer images are loaded |
| `scroll-update` | `{ scrollX, scrollY, offsets: Array }`           | Fired on scroll with current values    |

## Methods

| Method          | Parameters        | Description                    |
| --------------- | ----------------- | ------------------------------ |
| `addLayer()`    | `layer: Object`   | Add a new layer dynamically    |
| `removeLayer()` | `index: number`   | Remove layer by index          |
| `reset()`       | -                 | Reset all layer offsets        |
| `refresh()`     | -                 | Manually trigger update        |

## CSS Custom Properties

| Property                          | Default      | Description                     |
| --------------------------------- | ------------ | ------------------------------- |
| `--paralax-width`                 | `100%`       | Component width                 |
| `--paralax-height`                | `100vh`      | Component height                |
| `--paralax-transition-duration`   | `0.1s`       | Smooth transition duration      |
| `--paralax-transition-easing`     | `ease-out`   | Transition easing function      |
| `--paralax-object-fit`            | `cover`      | Image object-fit                |
| `--paralax-object-position`       | `center`     | Image object-position           |
| `--paralax-background-z`          | `1`          | Background layer z-index        |
| `--paralax-midground-z`           | `2`          | Midground layer z-index         |
| `--paralax-foreground-z`          | `3`          | Foreground layer z-index        |
| `--paralax-content-z`             | `10`         | Content slot z-index            |

## Examples

### Full-page Hero with Parallax

```html
<style>
  .hero-paralax {
    --paralax-height: 100vh;
  }

  .hero-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    text-align: center;
    color: white;
  }
</style>

<animation-paralax class="hero-paralax" id="hero">
  <div class="hero-content">
    <h1>Welcome</h1>
    <p>Scroll to explore</p>
  </div>
</animation-paralax>

<script>
  document.getElementById('hero').layers = [
    { src: '/sky.jpg', speed: 0.1 },
    { src: '/mountains.png', speed: 0.3 },
    { src: '/trees.png', speed: 0.6 },
  ];
</script>
```

### Mouse-tracking Card Effect

```html
<style>
  .card-paralax {
    --paralax-height: 400px;
    --paralax-width: 600px;
    border-radius: 16px;
    overflow: hidden;
  }
</style>

<animation-paralax
  class="card-paralax"
  mouse-enabled
  direction="both"
  sensitivity="0.5"
></animation-paralax>
```

### Custom Scroll Container

```html
<div id="scroll-container" style="height: 500px; overflow-y: scroll;">
  <animation-paralax scroll-target="#scroll-container">
    <!-- content -->
  </animation-paralax>
</div>
```

## Performance

- Uses `requestAnimationFrame` for smooth animations
- Implements `IntersectionObserver` to pause updates when not visible
- Uses CSS `transform: translate3d()` for GPU acceleration
- Supports `will-change` for optimized rendering
- Images use `loading="lazy"` for deferred loading

## Accessibility

- Respects `prefers-reduced-motion` media query
- All images require alt text (defaults provided if not specified)
- Content remains accessible via slot

## Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+

## License

MIT
