# @manufosela/animation-fireflies

A floating firefly particles animation web component built with Lit 3 and Canvas API. Create magical glowing particle effects with customizable colors, speeds, and interactive mouse attraction.

## Installation

```bash
npm install @manufosela/animation-fireflies
```

## Usage

### Basic Usage

```html
<script type="module">
  import '@manufosela/animation-fireflies';
</script>

<animation-fireflies></animation-fireflies>
```

### With Custom Properties

```html
<animation-fireflies
  count="80"
  glow-size="25"
  speed="1.5"
  blink-speed="0.8"
  interactive
  mouse-attraction="0.8"
></animation-fireflies>
```

### With Overlay Content

```html
<animation-fireflies>
  <div class="content">
    <h1>Magical Night</h1>
  </div>
</animation-fireflies>
```

### JavaScript API

```javascript
const fireflies = document.querySelector('animation-fireflies');

// Control animation
fireflies.pause();
fireflies.resume();
fireflies.toggle();
fireflies.reset();

// Modify fireflies
fireflies.addFireflies(20);
fireflies.removeFireflies(10);

// Update properties
fireflies.speed = 2;
fireflies.glowSize = 30;
fireflies.setColors(['#ff0000', '#ff8800', '#ffff00']);

// Get current count
const count = fireflies.getFireflyCount();
```

## Properties

| Property          | Type      | Default           | Description                          |
| ----------------- | --------- | ----------------- | ------------------------------------ |
| `count`           | `Number`  | `50`              | Number of fireflies                  |
| `glowSize`        | `Number`  | `20`              | Glow radius in pixels                |
| `speed`           | `Number`  | `1`               | Movement speed multiplier            |
| `colors`          | `Array`   | Yellow variants   | Array of hex color strings           |
| `minSize`         | `Number`  | `2`               | Minimum firefly size                 |
| `maxSize`         | `Number`  | `5`               | Maximum firefly size                 |
| `blinkSpeed`      | `Number`  | `1`               | Blink/pulse animation speed          |
| `interactive`     | `Boolean` | `false`           | Enable mouse interaction             |
| `mouseAttraction` | `Number`  | `0.5`             | Mouse attraction strength (-1 to 2)  |
| `paused`          | `Boolean` | `false`           | Whether animation is paused          |

## Events

| Event             | Detail                  | Description                     |
| ----------------- | ----------------------- | ------------------------------- |
| `firefly-click`   | `{ firefly: Object }`   | Fired when a firefly is clicked |
| `animation-start` | -                       | Fired when animation starts     |
| `animation-stop`  | -                       | Fired when animation stops      |

## Methods

| Method              | Parameters            | Description                    |
| ------------------- | --------------------- | ------------------------------ |
| `pause()`           | -                     | Pause the animation            |
| `resume()`          | -                     | Resume the animation           |
| `toggle()`          | -                     | Toggle pause state             |
| `reset()`           | -                     | Reset and reinitialize         |
| `addFireflies()`    | `amount: number`      | Add more fireflies             |
| `removeFireflies()` | `amount: number`      | Remove fireflies               |
| `setColors()`       | `colors: string[]`    | Set custom color palette       |
| `getFireflyCount()` | -                     | Get current firefly count      |

## CSS Custom Properties

| Property                 | Default                     | Description             |
| ------------------------ | --------------------------- | ----------------------- |
| `--fireflies-width`      | `100%`                      | Component width         |
| `--fireflies-height`     | `400px`                     | Component height        |
| `--fireflies-background` | Night sky gradient          | Background gradient     |

## Examples

### Forest Night Theme

```html
<style>
  .forest {
    --fireflies-background: linear-gradient(180deg,
      #0a2618 0%,
      #1a4a2e 50%,
      #0d2f1c 100%
    );
  }
</style>

<animation-fireflies
  class="forest"
  count="40"
></animation-fireflies>

<script>
  document.querySelector('.forest').colors = ['#88ff88', '#66dd66', '#aaff88'];
</script>
```

### Ocean Bioluminescence

```html
<style>
  .ocean {
    --fireflies-background: linear-gradient(180deg,
      #0a1628 0%,
      #0d3a5c 50%,
      #062840 100%
    );
  }
</style>

<animation-fireflies
  class="ocean"
  count="60"
  glow-size="25"
></animation-fireflies>

<script>
  document.querySelector('.ocean').colors = ['#00ffff', '#88ffff', '#00aaff'];
</script>
```

### Sunset Embers

```html
<animation-fireflies
  count="35"
  speed="0.5"
></animation-fireflies>

<script>
  document.querySelector('animation-fireflies').colors = [
    '#ff6600', '#ff8800', '#ffaa00', '#ff4400'
  ];
</script>
```

### Interactive Swarm

```html
<animation-fireflies
  interactive
  mouse-attraction="1.5"
  count="100"
></animation-fireflies>
```

### Gentle Giants

```html
<animation-fireflies
  count="15"
  glow-size="40"
  min-size="4"
  max-size="8"
  speed="0.3"
  blink-speed="0.3"
></animation-fireflies>
```

### Dense Swarm

```html
<animation-fireflies
  count="150"
  glow-size="10"
  min-size="1"
  max-size="3"
  speed="1.5"
></animation-fireflies>
```

## Mouse Interaction

When `interactive` is enabled:

- **Positive `mouseAttraction`**: Fireflies are attracted to the cursor
- **Negative `mouseAttraction`**: Fireflies are repelled from the cursor
- **Zero `mouseAttraction`**: No effect from cursor

```html
<!-- Attraction mode -->
<animation-fireflies interactive mouse-attraction="1"></animation-fireflies>

<!-- Repulsion mode -->
<animation-fireflies interactive mouse-attraction="-1"></animation-fireflies>
```

## Performance

- Uses `requestAnimationFrame` for smooth 60fps animation
- Implements `ResizeObserver` for responsive canvas sizing
- Uses device pixel ratio for crisp rendering on high-DPI displays
- Automatically pauses when `prefers-reduced-motion` is enabled
- Optimized particle physics with delta time calculations

## Accessibility

- Respects `prefers-reduced-motion` media query
- Includes proper ARIA attributes (`role="img"`, descriptive `aria-label`)
- Content overlay slot allows for accessible text content
- Animation can be controlled programmatically

## Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+

## License

MIT
