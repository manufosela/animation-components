# @manufosela/christmas-tree

A Lit 3 web component that renders a festive animated Christmas tree with blinking lights using SVG. Perfect for holiday-themed websites and seasonal decorations.

## Installation

```bash
npm install @manufosela/christmas-tree
```

## Usage

### Basic Usage

```html
<script type="module">
  import '@manufosela/christmas-tree';
</script>

<christmas-tree></christmas-tree>
```

### With Custom Properties

```html
<christmas-tree
  height="400"
  light-count="30"
  blink-speed="600"
  show-star
  show-ornaments
  show-snow
></christmas-tree>
```

### With Custom Light Colors

```javascript
const tree = document.querySelector('christmas-tree');
tree.lightColors = ['#ffd700', '#ff8c00', '#ff4500', '#ffb347'];
```

## Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `height` | `height` | `number` | `300` | Height of the tree in pixels |
| `lightColors` | `light-colors` | `string[]` | `['#ff0000', '#00ff00', ...]` | Array of colors for lights |
| `blinkSpeed` | `blink-speed` | `number` | `800` | Speed of light blinking in ms |
| `showStar` | `show-star` | `boolean` | `true` | Show star on top |
| `showOrnaments` | `show-ornaments` | `boolean` | `true` | Show ornaments |
| `showSnow` | `show-snow` | `boolean` | `false` | Show snow on branches |
| `lightCount` | `light-count` | `number` | `20` | Number of lights |
| `lightsOn` | `lights-on` | `boolean` | `true` | Whether lights are blinking |

## Events

| Event | Description |
|-------|-------------|
| `tree-ready` | Fired when the tree is fully rendered |
| `lights-toggle` | Fired when lights change state |

## CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--christmas-tree-height` | `300px` | Height of the tree |
| `--christmas-tree-color` | `#0d5c0d` | Color of tree foliage |
| `--christmas-trunk-color` | `#8b4513` | Color of the trunk |
| `--christmas-star-color` | `#ffd700` | Color of the star |

### Custom Styling Example

```css
christmas-tree {
  --christmas-tree-color: #1a5c1a;
  --christmas-trunk-color: #654321;
  --christmas-star-color: #ffcc00;
}
```

## Methods

### `toggleLights()`

Toggle the light blinking on/off.

```javascript
tree.toggleLights();
```

### `lightsAllOn()`

Turn all lights on (fully lit).

```javascript
tree.lightsAllOn();
```

### `lightsAllOff()`

Turn all lights off (dimmed).

```javascript
tree.lightsAllOff();
```

## Color Presets

```javascript
// Classic Christmas
tree.lightColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

// Warm White
tree.lightColors = ['#ffd700', '#ff8c00', '#ff4500', '#ffb347', '#ffa500'];

// Cool Blue
tree.lightColors = ['#00bfff', '#87ceeb', '#add8e6', '#e0ffff', '#b0e0e6'];

// Rainbow
tree.lightColors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#8f00ff'];

// White Only
tree.lightColors = ['#ffffff'];
```

## Accessibility

This component respects the `prefers-reduced-motion` media query:
- Star pulsing animation is disabled
- Light blinking is stopped
- Static lit tree is displayed

## Browser Support

- Chrome/Edge (Chromium) 88+
- Firefox 78+
- Safari 14+

## Examples

### Multiple Trees Scene

```html
<style>
  .forest {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    gap: 20px;
    padding: 40px;
    background: linear-gradient(to bottom, #0a1628, #1a2a4a);
  }
</style>

<div class="forest">
  <christmas-tree height="150" light-count="10"></christmas-tree>
  <christmas-tree height="300" light-count="25"></christmas-tree>
  <christmas-tree height="150" light-count="10"></christmas-tree>
</div>
```

### Winter Theme

```html
<christmas-tree
  height="350"
  show-snow
  show-star
  show-ornaments
  light-count="30"
  style="
    --christmas-tree-color: #2d5a2d;
    --christmas-star-color: #ffeb3b;
  "
></christmas-tree>
```

### Minimal Modern

```html
<christmas-tree
  height="250"
  show-star
  show-ornaments="false"
  show-snow="false"
  light-count="15"
></christmas-tree>
```

## License

MIT
