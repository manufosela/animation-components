# @manufosela/animation-solarsystem

An SVG animated solar system web component built with Lit 3. Features orbiting planets around a glowing sun with customizable appearance and animation controls.

## Installation

```bash
npm install @manufosela/animation-solarsystem
```

## Usage

### Basic Usage

```html
<script type="module">
  import '@manufosela/animation-solarsystem';
</script>

<animation-solarsystem></animation-solarsystem>
```

### With Properties

```html
<animation-solarsystem
  show-labels
  show-orbits
  speed="1.5"
  scale="0.8"
></animation-solarsystem>
```

### JavaScript API

```javascript
const solarSystem = document.querySelector('animation-solarsystem');

// Control animation
solarSystem.pause();
solarSystem.resume();
solarSystem.toggle();
solarSystem.reset();

// Update properties
solarSystem.speed = 2;
solarSystem.scale = 0.5;
solarSystem.showLabels = false;
solarSystem.showOrbits = true;
```

## Properties

| Property     | Type      | Default | Description                           |
| ------------ | --------- | ------- | ------------------------------------- |
| `showLabels` | `Boolean` | `true`  | Show planet name labels               |
| `showOrbits` | `Boolean` | `true`  | Show orbital path lines               |
| `speed`      | `Number`  | `1`     | Animation speed multiplier            |
| `scale`      | `Number`  | `1`     | Scale factor for planets and orbits   |
| `paused`     | `Boolean` | `false` | Whether animation is paused           |

## Events

| Event          | Detail                    | Description                     |
| -------------- | ------------------------- | ------------------------------- |
| `planet-click` | `{ planet: PlanetObject }` | Fired when a planet is clicked  |

### Planet Object

```typescript
interface Planet {
  name: string;
  orbitRadius: number;
  size: number;
  color: string;
  orbitDuration: number;
}
```

## Methods

| Method     | Description                      |
| ---------- | -------------------------------- |
| `pause()`  | Pause the animation              |
| `resume()` | Resume the animation             |
| `toggle()` | Toggle pause/resume state        |
| `reset()`  | Reset animation to initial state |

## CSS Custom Properties

| Property                       | Default                                    | Description                |
| ------------------------------ | ------------------------------------------ | -------------------------- |
| `--solarsystem-width`          | `600px`                                    | Component width            |
| `--solarsystem-height`         | `600px`                                    | Component height           |
| `--solarsystem-background`     | `radial-gradient(...)`                     | Background gradient        |
| `--solarsystem-sun-color`      | `#ffd700`                                  | Sun fill color             |
| `--solarsystem-sun-glow`       | `#ff8c00`                                  | Sun glow effect color      |
| `--solarsystem-orbit-color`    | `rgba(255, 255, 255, 0.2)`                 | Orbit stroke color         |
| `--solarsystem-orbit-width`    | `1`                                        | Orbit line width           |
| `--solarsystem-orbit-dash`     | `4 4`                                      | Orbit dash pattern         |
| `--solarsystem-label-color`    | `#ffffff`                                  | Planet label text color    |
| `--solarsystem-label-size`     | `10px`                                     | Planet label font size     |
| `--solarsystem-font-family`    | `'Arial', sans-serif`                      | Label font family          |
| `--solarsystem-star-color`     | `#ffffff`                                  | Background star color      |
| `--solarsystem-border-radius`  | `8px`                                      | Component border radius    |

## Theming Example

```html
<style>
  animation-solarsystem.purple-theme {
    --solarsystem-width: 500px;
    --solarsystem-height: 500px;
    --solarsystem-background: radial-gradient(ellipse at center, #2d1b4e 0%, #1a0a2e 100%);
    --solarsystem-sun-color: #ff6b6b;
    --solarsystem-sun-glow: #ff4757;
    --solarsystem-orbit-color: rgba(255, 107, 107, 0.3);
    --solarsystem-label-color: #ffeaa7;
  }
</style>

<animation-solarsystem class="purple-theme"></animation-solarsystem>
```

## Accessibility

This component respects the `prefers-reduced-motion` media query. When users have reduced motion enabled in their system preferences, animations will be disabled.

## Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+

## License

MIT
