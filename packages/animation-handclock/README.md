# @manufosela/animation-handclock

An SVG analog clock web component with animated hands built with Lit 3. Features customizable appearance, timezone support, and theme switching.

## Installation

```bash
npm install @manufosela/animation-handclock
```

## Usage

### Basic Usage

```html
<script type="module">
  import '@manufosela/animation-handclock';
</script>

<animation-handclock></animation-handclock>
```

### With Properties

```html
<animation-handclock
  show-seconds
  show-numbers
  show-minute-markers
  theme="dark"
  timezone="America/New_York"
></animation-handclock>
```

### JavaScript API

```javascript
const clock = document.querySelector('animation-handclock');

// Set a specific time manually
clock.setTime(10, 30, 45);

// Resume automatic time updates
clock.resumeAutoTime();

// Get current displayed time
const time = clock.getTime();
console.log(time); // { hours: 10, minutes: 30, seconds: 45 }
```

## Properties

| Property             | Type      | Default     | Description                        |
| -------------------- | --------- | ----------- | ---------------------------------- |
| `size`               | `Number`  | `200`       | Clock size in pixels               |
| `showSeconds`        | `Boolean` | `true`      | Show second hand                   |
| `showNumbers`        | `Boolean` | `true`      | Show hour numbers (1-12)           |
| `showMinuteMarkers`  | `Boolean` | `true`      | Show minute markers                |
| `theme`              | `String`  | `'light'`   | Theme: 'light' or 'dark'           |
| `timezone`           | `String`  | Local       | IANA timezone string               |

## Events

| Event         | Detail                                                      | Description                    |
| ------------- | ----------------------------------------------------------- | ------------------------------ |
| `time-change` | `{ hours: number, minutes: number, seconds: number, timezone: string }` | Fired every second |

## Methods

| Method             | Parameters                        | Description                      |
| ------------------ | --------------------------------- | -------------------------------- |
| `setTime()`        | `hours, minutes, seconds`         | Set time manually (stops auto)   |
| `resumeAutoTime()` | -                                 | Resume automatic time updates    |
| `getTime()`        | -                                 | Get current displayed time       |

## CSS Custom Properties

| Property                         | Default               | Description                 |
| -------------------------------- | --------------------- | --------------------------- |
| `--handclock-size`               | `200px`               | Clock size                  |
| `--handclock-face-color`         | `#ffffff` / `#1a1a2e` | Clock face color            |
| `--handclock-border-color`       | `#333333` / `#4a4a6a` | Border color                |
| `--handclock-border-width`       | `4`                   | Border width                |
| `--handclock-hour-hand-color`    | `#333333` / `#e0e0e0` | Hour hand color             |
| `--handclock-hour-hand-width`    | `6`                   | Hour hand width             |
| `--handclock-minute-hand-color`  | `#333333` / `#e0e0e0` | Minute hand color           |
| `--handclock-minute-hand-width`  | `4`                   | Minute hand width           |
| `--handclock-second-hand-color`  | `#e74c3c` / `#ff6b6b` | Second hand color           |
| `--handclock-second-hand-width`  | `2`                   | Second hand width           |
| `--handclock-marker-color`       | `#333333` / `#e0e0e0` | Hour/minute marker color    |
| `--handclock-number-color`       | `#333333` / `#e0e0e0` | Hour number color           |
| `--handclock-number-size`        | `16px`                | Hour number font size       |
| `--handclock-font-family`        | `'Georgia', serif`    | Font family for numbers     |
| `--handclock-center-color`       | `#333333` / `#e0e0e0` | Center dot color            |

## Theming Examples

### Elegant Gold Theme

```html
<style>
  animation-handclock.elegant {
    --handclock-size: 180px;
    --handclock-face-color: #1a1a2e;
    --handclock-border-color: #c9a227;
    --handclock-border-width: 3;
    --handclock-hour-hand-color: #c9a227;
    --handclock-minute-hand-color: #c9a227;
    --handclock-second-hand-color: #ff6b6b;
    --handclock-marker-color: #c9a227;
    --handclock-number-color: #c9a227;
    --handclock-center-color: #c9a227;
  }
</style>

<animation-handclock class="elegant"></animation-handclock>
```

### Neon Theme

```html
<style>
  animation-handclock.neon {
    --handclock-face-color: #0a0a0a;
    --handclock-border-color: #00ff88;
    --handclock-hour-hand-color: #00ff88;
    --handclock-minute-hand-color: #00ff88;
    --handclock-second-hand-color: #ff00ff;
    --handclock-marker-color: #00ff88;
    --handclock-number-color: #00ff88;
  }
</style>

<animation-handclock class="neon"></animation-handclock>
```

## World Clock Example

```html
<animation-handclock timezone="America/New_York"></animation-handclock>
<animation-handclock timezone="Europe/London"></animation-handclock>
<animation-handclock timezone="Asia/Tokyo"></animation-handclock>
```

## Accessibility

- The component includes proper ARIA attributes (`role="img"` and descriptive `aria-label`)
- Respects `prefers-reduced-motion` media query
- Screen readers will announce the current time

## Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+

## License

MIT
