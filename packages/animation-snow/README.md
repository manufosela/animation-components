# @manufosela/animation-snow

Canvas-based snow effect web component built with [Lit 3](https://lit.dev). Renders smooth, high-performance animated snowflakes using the Canvas 2D API and a `requestAnimationFrame` loop with wind drift. Better suited than CSS snow for large particle counts (500+).

## Install

```bash
npm install @manufosela/animation-snow
```

## Usage

```html
<script type="module">
  import '@manufosela/animation-snow';
</script>

<animation-snow
  num-snowflakes="200"
  speed="2"
  active
></animation-snow>
```

## Attributes

| Attribute        | Type    | Default | Description                        |
|------------------|---------|---------|------------------------------------|
| `num-snowflakes` | Number  | `200`   | Number of snowflakes               |
| `speed`          | Number  | `2`     | Fall speed multiplier              |
| `active`         | Boolean | `true`  | Whether the animation is running   |

## Methods

| Method    | Description                                      |
|-----------|--------------------------------------------------|
| `start()` | Start (or resume) the animation loop             |
| `stop()`  | Stop the animation loop and fade out the canvas  |

## CSS Custom Properties

| Property          | Default | Description                     |
|-------------------|---------|---------------------------------|
| `--snow-z-index`  | `9999`  | Z-index of the canvas overlay   |

## Events

| Event             | Description                       |
|-------------------|-----------------------------------|
| `animation-start` | Fired when the animation starts   |
| `animation-stop`  | Fired when the animation stops    |

## Notes

- Automatically handles canvas resizing via `ResizeObserver`
- Respects `prefers-reduced-motion` — pauses when the user prefers reduced motion
- Snowflakes wrap horizontally and recycle at the bottom edge

## License

Apache-2.0
