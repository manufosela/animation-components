# @manufosela/animation-shootingstar

A Lit 3 web component that creates shooting star animations using Canvas API. Perfect for night sky backgrounds, wish-making interactions, or adding a touch of magic to any website.

## Installation

```bash
npm install @manufosela/animation-shootingstar
```

## Usage

### Basic Usage

```html
<script type="module">
  import '@manufosela/animation-shootingstar';
</script>

<animation-shootingstar></animation-shootingstar>
```

### With Custom Properties

```html
<animation-shootingstar
  frequency="1500"
  speed="12"
  trail-length="30"
  max-stars="8"
  trigger-on-click
></animation-shootingstar>
```

### With Overlay Content

```html
<animation-shootingstar frequency="2000">
  <h1 style="color: white;">Make a Wish!</h1>
</animation-shootingstar>
```

### With Custom Colors

```javascript
const stars = document.querySelector('animation-shootingstar');
stars.colors = ['#ffd700', '#ff8c00', '#ff4500', '#ffb347'];
```

## Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `frequency` | `frequency` | `number` | `2000` | Frequency of new stars (ms) |
| `speed` | `speed` | `number` | `10` | Speed of shooting stars |
| `trailLength` | `trail-length` | `number` | `25` | Length of the star trail |
| `colors` | - | `string[]` | `['#ffffff', ...]` | Array of star colors |
| `maxStars` | `max-stars` | `number` | `5` | Max simultaneous stars |
| `showBackgroundStars` | `show-background-stars` | `boolean` | `true` | Show static star background |
| `paused` | `paused` | `boolean` | `false` | Whether animation is paused |
| `triggerOnClick` | `trigger-on-click` | `boolean` | `false` | Create star on click |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `star-created` | `{ color, x, y }` | Fired when a new star is created |
| `star-faded` | - | Fired when a star fades out |

## CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--shootingstar-width` | `100%` | Component width |
| `--shootingstar-height` | `400px` | Component height |
| `--shootingstar-background` | `linear-gradient(...)` | Background gradient |

### Theme Examples

```css
/* Warm Desert Night */
animation-shootingstar.warm {
  --shootingstar-background: linear-gradient(to bottom, #1a0a00 0%, #3d1a00 50%, #2d1000 100%);
}

/* Ocean Night */
animation-shootingstar.ocean {
  --shootingstar-background: linear-gradient(to bottom, #000428 0%, #004e92 100%);
}

/* Pure Black */
animation-shootingstar.minimal {
  --shootingstar-background: #000;
}
```

## Methods

### `pause()`

Pause the animation.

```javascript
const stars = document.querySelector('animation-shootingstar');
stars.pause();
```

### `resume()`

Resume the animation.

```javascript
stars.resume();
```

### `trigger()`

Manually trigger a shooting star.

```javascript
stars.trigger();
```

### `clear()`

Clear all current shooting stars.

```javascript
stars.clear();
```

## Accessibility

This component respects the `prefers-reduced-motion` media query:
- Animation is completely disabled
- Static background stars remain visible
- No shooting stars are created

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

  .hero animation-shootingstar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    --shootingstar-height: 100%;
  }

  .hero-content {
    position: relative;
    z-index: 1;
    text-align: center;
  }
</style>

<section class="hero">
  <animation-shootingstar
    frequency="1500"
    speed="12"
    trail-length="30"
    trigger-on-click
  ></animation-shootingstar>
  <div class="hero-content">
    <h1>Your Content Here</h1>
  </div>
</section>
```

### Meteor Shower Effect

```html
<animation-shootingstar
  frequency="500"
  speed="20"
  trail-length="15"
  max-stars="12"
></animation-shootingstar>
```

### Slow and Majestic

```html
<animation-shootingstar
  frequency="4000"
  speed="5"
  trail-length="45"
  max-stars="3"
></animation-shootingstar>
```

### Interactive Wish Maker

```html
<animation-shootingstar
  id="wish-stars"
  frequency="5000"
  trigger-on-click
></animation-shootingstar>

<script>
  const stars = document.getElementById('wish-stars');
  let wishCount = 0;

  stars.addEventListener('star-created', () => {
    wishCount++;
    console.log(`Wish #${wishCount} made!`);
  });
</script>
```

### Without Background Stars

```html
<animation-shootingstar
  show-background-stars="false"
  style="--shootingstar-background: transparent;"
></animation-shootingstar>
```

### Color Themes

```javascript
// Warm colors
stars.colors = ['#ffd700', '#ff8c00', '#ff4500', '#ffb347'];

// Cool colors
stars.colors = ['#00ffff', '#00bfff', '#87ceeb', '#e0ffff'];

// Pink/Purple
stars.colors = ['#ff69b4', '#ff1493', '#da70d6', '#ee82ee'];

// Green Aurora
stars.colors = ['#00ff00', '#32cd32', '#7cfc00', '#adff2f'];
```

## License

MIT
