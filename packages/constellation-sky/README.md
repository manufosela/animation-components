# @manufosela/constellation-sky

A Lit 3 web component that creates animated star constellations with connecting lines using Canvas API. Perfect for creating immersive hero sections, backgrounds, or decorative elements.

## Installation

```bash
npm install @manufosela/constellation-sky
```

## Usage

### Basic Usage

```html
<script type="module">
  import '@manufosela/constellation-sky';
</script>

<constellation-sky></constellation-sky>
```

### With Overlay Content

```html
<constellation-sky star-count="100" interactive>
  <h1>Welcome to the Stars</h1>
  <p>Move your mouse to interact</p>
</constellation-sky>
```

### Custom Colors

```html
<constellation-sky
  star-count="80"
  star-color="#87ceeb"
  line-color="#4da6ff"
  line-distance="100"
></constellation-sky>
```

### Without Lines

```html
<constellation-sky
  star-count="200"
  show-lines="false"
  speed="0.1"
></constellation-sky>
```

## Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `starCount` | `star-count` | `number` | `80` | Number of stars in the sky |
| `lineDistance` | `line-distance` | `number` | `120` | Maximum distance to draw connecting lines |
| `speed` | `speed` | `number` | `0.3` | Speed of star movement |
| `starColor` | `star-color` | `string` | `#ffffff` | Color of the stars |
| `lineColor` | `line-color` | `string` | `#ffffff` | Color of connecting lines |
| `showLines` | `show-lines` | `boolean` | `true` | Whether to draw connecting lines |
| `twinkle` | `twinkle` | `boolean` | `true` | Whether stars should twinkle |
| `paused` | `paused` | `boolean` | `false` | Whether animation is paused |
| `interactive` | `interactive` | `boolean` | `true` | Enable mouse interaction |

## Events

| Event | Description |
|-------|-------------|
| `constellation-ready` | Fired when the constellation is initialized |

## CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--constellation-width` | `100%` | Width of the component |
| `--constellation-height` | `400px` | Height of the component |
| `--constellation-background` | `linear-gradient(...)` | Background gradient |

### Theme Examples

```css
/* Ocean Theme */
constellation-sky.ocean {
  --constellation-background: linear-gradient(to bottom, #000428 0%, #004e92 100%);
}

/* Warm Theme */
constellation-sky.warm {
  --constellation-background: linear-gradient(to bottom, #1a0a00 0%, #3d1a00 50%, #2d1000 100%);
}

/* Forest Theme */
constellation-sky.forest {
  --constellation-background: linear-gradient(to bottom, #0a1a0a 0%, #1a3a1a 50%, #0d2d0d 100%);
}
```

## Methods

### `pause()`

Pause the animation.

```javascript
const sky = document.querySelector('constellation-sky');
sky.pause();
```

### `resume()`

Resume the animation.

```javascript
sky.resume();
```

### `reset()`

Reset all stars to new random positions.

```javascript
sky.reset();
```

## Accessibility

This component respects the `prefers-reduced-motion` media query. When reduced motion is preferred:
- Star movement is disabled
- A static constellation is displayed
- Lines are still drawn between nearby stars

## Browser Support

- Chrome/Edge (Chromium) 88+
- Firefox 78+
- Safari 14+

## Examples

### Full-Screen Hero Background

```html
<style>
  .hero {
    position: relative;
    height: 100vh;
  }

  .hero constellation-sky {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .hero-content {
    position: relative;
    z-index: 1;
  }
</style>

<section class="hero">
  <constellation-sky
    star-count="120"
    line-distance="150"
    speed="0.2"
    interactive
  ></constellation-sky>
  <div class="hero-content">
    <h1>Your Content Here</h1>
  </div>
</section>
```

### Card Background

```html
<style>
  .card {
    border-radius: 16px;
    overflow: hidden;
  }

  .card constellation-sky {
    height: 200px;
  }
</style>

<div class="card">
  <constellation-sky
    star-count="40"
    line-distance="80"
    speed="0.1"
  ></constellation-sky>
</div>
```

## License

MIT
