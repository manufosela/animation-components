# @manufosela/animation-matrix

A Matrix digital rain effect web component built with Lit 3 and Canvas API. Create the iconic falling code effect from The Matrix with customizable characters, colors, and animation parameters.

## Installation

```bash
npm install @manufosela/animation-matrix
```

## Usage

### Basic Usage

```html
<script type="module">
  import '@manufosela/animation-matrix';
</script>

<animation-matrix></animation-matrix>
```

### With Custom Properties

```html
<animation-matrix
  font-size="16"
  speed="1.5"
  color="#00ff00"
  highlight-color="#ffffff"
  density="1.2"
  trail-length="25"
></animation-matrix>
```

### JavaScript API

```javascript
const matrix = document.querySelector('animation-matrix');

// Control animation
matrix.pause();
matrix.resume();
matrix.toggle();
matrix.reset();

// Update properties
matrix.speed = 2;
matrix.color = '#00aaff';
matrix.fontSize = 18;

// Set custom characters
matrix.setCharacters('01'); // Binary mode

// Get canvas as image
const dataUrl = matrix.toDataURL();
```

## Properties

| Property         | Type      | Default      | Description                              |
| ---------------- | --------- | ------------ | ---------------------------------------- |
| `fontSize`       | `Number`  | `14`         | Character font size in pixels            |
| `speed`          | `Number`  | `1`          | Animation speed multiplier               |
| `color`          | `String`  | `'#00ff00'`  | Main character color (hex)               |
| `highlightColor` | `String`  | `'#ffffff'`  | Leading character color (hex)            |
| `characters`     | `String`  | Katakana+    | String of characters to display          |
| `density`        | `Number`  | `1`          | Column density multiplier                |
| `fadeOpacity`    | `Number`  | `0.05`       | Background fade opacity (0-1)            |
| `trailLength`    | `Number`  | `20`         | Number of characters in each trail       |
| `paused`         | `Boolean` | `false`      | Whether animation is paused              |

## Events

| Event             | Description                     |
| ----------------- | ------------------------------- |
| `animation-start` | Fired when animation starts     |
| `animation-stop`  | Fired when animation stops      |

## Methods

| Method            | Parameters          | Description                        |
| ----------------- | ------------------- | ---------------------------------- |
| `pause()`         | -                   | Pause the animation                |
| `resume()`        | -                   | Resume the animation               |
| `toggle()`        | -                   | Toggle pause state                 |
| `reset()`         | -                   | Reset and reinitialize animation   |
| `setCharacters()` | `chars: string`     | Set custom character set           |
| `toDataURL()`     | -                   | Get canvas as data URL             |

## CSS Custom Properties

| Property              | Default    | Description                |
| --------------------- | ---------- | -------------------------- |
| `--matrix-width`      | `100%`     | Component width            |
| `--matrix-height`     | `400px`    | Component height           |
| `--matrix-background` | `#000000`  | Background color           |

## Examples

### Classic Green Matrix

```html
<animation-matrix
  color="#00ff00"
  highlight-color="#ffffff"
></animation-matrix>
```

### Binary Rain

```html
<animation-matrix id="binary"></animation-matrix>

<script>
  document.getElementById('binary').setCharacters('01');
</script>
```

### Blue Code Theme

```html
<style>
  animation-matrix.blue {
    --matrix-background: #000010;
  }
</style>

<animation-matrix
  class="blue"
  color="#00aaff"
  highlight-color="#88ddff"
></animation-matrix>
```

### Slow Cinematic Effect

```html
<animation-matrix
  speed="0.3"
  trail-length="30"
  fade-opacity="0.02"
></animation-matrix>
```

### Emoji Rain

```html
<animation-matrix
  id="emoji"
  font-size="20"
  color="#ffff00"
></animation-matrix>

<script>
  const emoji = document.getElementById('emoji');
  emoji.setCharacters('🔥💧🌟⭐✨🎮🎯🎲');
</script>
```

### With Overlay Content

```html
<style>
  .matrix-container {
    position: relative;
  }
  .overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #00ff00;
    text-shadow: 0 0 20px #00ff00;
    z-index: 10;
  }
</style>

<div class="matrix-container">
  <animation-matrix></animation-matrix>
  <div class="overlay">
    <h1>WAKE UP</h1>
  </div>
</div>
```

## Character Sets

The default character set includes Japanese Katakana, numbers, and uppercase letters. Here are some preset options:

```javascript
// Classic Katakana + Alphanumeric
const classic = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Binary
const binary = '01';

// Hexadecimal
const hex = '0123456789ABCDEF';

// Code symbols
const code = '{}[]()<>=+-*/&|!?;:@#$%^~';

// Numbers only
const numbers = '0123456789';
```

## Performance Considerations

- Uses `requestAnimationFrame` for smooth animation
- Implements `ResizeObserver` for responsive canvas sizing
- Uses device pixel ratio for crisp rendering on high-DPI displays
- Automatically pauses when `prefers-reduced-motion` is enabled
- Canvas rendering is optimized with proper layer compositing

## Accessibility

- Respects `prefers-reduced-motion` media query (shows static frame when enabled)
- Includes proper ARIA attributes (`role="img"`, descriptive `aria-label`)
- Animation can be controlled programmatically for keyboard access

## Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+

## License

MIT
