# @manufosela/scene-stwtext

A Lit 3 web component that creates Star Wars style text crawl animations using CSS 3D perspective. Perfect for dramatic introductions, announcements, or any content that needs an epic reveal.

## Installation

```bash
npm install @manufosela/scene-stwtext
```

## Usage

### Basic Usage

```html
<script type="module">
  import '@manufosela/scene-stwtext';
</script>

<scene-stwtext>
  <h1>EPISODE IV</h1>
  <p>It is a period of civil war...</p>
</scene-stwtext>
```

### With Intro and Full Options

```html
<scene-stwtext
  intro-text="A long time ago in a galaxy far, far away...."
  speed="60"
  perspective="400"
  fade-distance="30"
  show-stars
  show-controls
>
  <h1>EPISODE IV</h1>
  <h1>A NEW HOPE</h1>
  <p>
    It is a period of civil war. Rebel spaceships, striking from a hidden base,
    have won their first victory against the evil Galactic Empire.
  </p>
</scene-stwtext>
```

### Using Slots

```html
<scene-stwtext>
  <span slot="intro">Custom intro text here....</span>
  <img slot="logo" src="your-logo.svg" alt="Logo">
  <h1>Your Title</h1>
  <p>Your content here...</p>
</scene-stwtext>
```

### Using Text Property

```html
<scene-stwtext
  text="# EPISODE IV

This is the first paragraph of the crawl.

This is the second paragraph with more content."
></scene-stwtext>
```

## Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `text` | `text` | `string` | `''` | Text content (use `# ` prefix for headings) |
| `speed` | `speed` | `number` | `60` | Duration of crawl animation in seconds |
| `perspective` | `perspective` | `number` | `400` | 3D perspective value in pixels |
| `fadeDistance` | `fade-distance` | `number` | `30` | Top fade gradient height (%) |
| `introText` | `intro-text` | `string` | `''` | Intro text before crawl |
| `introDuration` | `intro-duration` | `number` | `4` | Intro animation duration (seconds) |
| `logoDuration` | `logo-duration` | `number` | `6` | Logo animation duration (seconds) |
| `logoSrc` | `logo-src` | `string` | `''` | URL for logo image |
| `showStars` | `show-stars` | `boolean` | `true` | Show stars background |
| `showControls` | `show-controls` | `boolean` | `true` | Show playback controls on hover |
| `paused` | `paused` | `boolean` | `false` | Whether animation is paused |
| `autoplay` | `autoplay` | `boolean` | `true` | Auto-start animation |

## Slots

| Slot | Description |
|------|-------------|
| (default) | Main crawl text content |
| `intro` | Custom intro text element |
| `logo` | Custom logo element |

## Events

| Event | Description |
|-------|-------------|
| `crawl-start` | Fired when crawl animation starts |
| `crawl-end` | Fired when crawl animation ends |
| `animation-pause` | Fired when animation is paused |
| `animation-resume` | Fired when animation is resumed |

## CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--stwtext-width` | `100%` | Component width |
| `--stwtext-height` | `100vh` | Component height |
| `--stwtext-background` | `#000` | Background color |
| `--stwtext-text-color` | `#ffd700` | Crawl text color |
| `--stwtext-font-size` | `2rem` | Text font size |
| `--stwtext-font-family` | `Franklin Gothic Medium...` | Font family |
| `--stwtext-perspective` | `400px` | 3D perspective |
| `--stwtext-rotation` | `25deg` | X-axis rotation |
| `--stwtext-fade-distance` | `30%` | Top fade height |
| `--stwtext-intro-color` | `#4ee` | Intro text color |
| `--stwtext-intro-size` | `2rem` | Intro text size |
| `--stwtext-text-width` | `80%` | Text container width |

## Methods

### `pause()`

Pause the animation.

```javascript
const crawl = document.querySelector('scene-stwtext');
crawl.pause();
```

### `resume()`

Resume the animation.

```javascript
crawl.resume();
```

### `togglePause()`

Toggle between pause and resume.

```javascript
crawl.togglePause();
```

### `restart()`

Restart the animation from the beginning.

```javascript
crawl.restart();
```

## Accessibility

This component respects the `prefers-reduced-motion` media query:
- Animation is disabled
- Static centered text is displayed instead
- All content remains readable

## Browser Support

- Chrome/Edge (Chromium) 88+
- Firefox 78+
- Safari 14+

## Examples

### Custom Colors Theme

```html
<scene-stwtext
  style="
    --stwtext-text-color: #00ffcc;
    --stwtext-intro-color: #ff66cc;
    --stwtext-background: linear-gradient(to bottom, #1a1a2e, #16213e);
  "
>
  <h1>Custom Theme</h1>
  <p>With teal text and pink intro...</p>
</scene-stwtext>
```

### Product Announcement

```html
<scene-stwtext
  intro-text="Introducing something revolutionary...."
  speed="45"
  logo-src="product-logo.svg"
>
  <h1>PRODUCT NAME</h1>
  <h1>VERSION 2.0</h1>
  <p>
    After months of development, we're excited to announce
    the next generation of our product.
  </p>
  <p>
    Featuring new capabilities, improved performance, and
    a completely redesigned interface.
  </p>
</scene-stwtext>
```

### Fast Crawl for Short Content

```html
<scene-stwtext
  speed="20"
  intro-duration="2"
  logo-duration="3"
>
  <h1>Quick Message</h1>
  <p>Short and sweet content that moves faster.</p>
</scene-stwtext>
```

### No Stars Background

```html
<scene-stwtext
  show-stars="false"
  style="--stwtext-background: #1a1a1a;"
>
  <h1>Clean Background</h1>
  <p>Focus on the text without star distractions.</p>
</scene-stwtext>
```

## License

MIT
