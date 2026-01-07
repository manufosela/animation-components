# @manufosela/animation-explosion

A Lit 3 web component that creates particle explosion effects using Canvas API. Perfect for adding visual feedback to button clicks, achievements, or any interactive element.

## Installation

```bash
npm install @manufosela/animation-explosion
```

## Usage

### Basic Usage

```html
<script type="module">
  import '@manufosela/animation-explosion';
</script>

<animation-explosion>
  <button>Click me!</button>
</animation-explosion>
```

### With Custom Properties

```html
<animation-explosion
  particle-count="50"
  duration="2000"
  gravity="0.2"
  spread="180"
>
  <button>Explode!</button>
</animation-explosion>
```

### With Custom Colors (JavaScript)

```javascript
const explosion = document.querySelector('animation-explosion');
explosion.colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00'];
```

### Programmatic Trigger

```html
<animation-explosion id="my-explosion" trigger-on-click="false">
  <div>Content here</div>
</animation-explosion>

<script>
  const explosion = document.getElementById('my-explosion');

  // Trigger at specific coordinates
  explosion.explode(100, 100);

  // Trigger at center
  explosion.explode();
</script>
```

## Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `particleCount` | `particle-count` | `number` | `30` | Number of particles in the explosion |
| `colors` | - | `string[]` | `['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7']` | Array of colors for particles |
| `duration` | `duration` | `number` | `1500` | Duration of animation in milliseconds |
| `gravity` | `gravity` | `number` | `0.1` | Gravity force applied to particles |
| `spread` | `spread` | `number` | `360` | Spread angle in degrees |
| `triggerOnClick` | `trigger-on-click` | `boolean` | `true` | Whether to trigger explosion on click |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `explosion-start` | `{ x: number, y: number }` | Fired when explosion animation starts |
| `explosion-end` | - | Fired when explosion animation ends |

## CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--explosion-width` | `100%` | Width of the component |
| `--explosion-height` | `100%` | Height of the component |

## Methods

### `explode(x?: number, y?: number)`

Programmatically trigger an explosion at the specified coordinates. If no coordinates are provided, the explosion occurs at the center of the component.

## Accessibility

This component respects the `prefers-reduced-motion` media query. When reduced motion is preferred, a simplified static burst is shown instead of the full animation.

## Browser Support

- Chrome/Edge (Chromium) 88+
- Firefox 78+
- Safari 14+

## License

MIT
