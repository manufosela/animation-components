# @manufosela/animation-raincss

CSS-based rain effect web component built with [Lit 3](https://lit.dev). Renders animated falling rain drops as a full-viewport overlay using CSS keyframes — no canvas, no JavaScript animation loop.

## Install

```bash
npm install @manufosela/animation-raincss
```

## Usage

```html
<script type="module">
  import '@manufosela/animation-raincss';
</script>

<animation-raincss
  num-drops="100"
  speed="1"
  color="#7fc8f8"
  active
></animation-raincss>
```

## Attributes

| Attribute   | Type    | Default    | Description                        |
|-------------|---------|------------|------------------------------------|
| `num-drops` | Number  | `100`      | Number of rain drops               |
| `speed`     | Number  | `1`        | Fall speed multiplier              |
| `color`     | String  | `#7fc8f8`  | Drop color (any CSS color value)   |
| `active`    | Boolean | `true`     | Whether the animation is visible   |

## Methods

| Method    | Description                                      |
|-----------|--------------------------------------------------|
| `start()` | Show and resume the rain animation               |
| `stop()`  | Hide the rain animation with a fade transition   |

## CSS Custom Properties

| Property         | Default | Description                    |
|------------------|---------|--------------------------------|
| `--rain-z-index` | `9999`  | Z-index of the rain overlay    |

## Events

| Event             | Description                       |
|-------------------|-----------------------------------|
| `animation-start` | Fired when `start()` is called    |
| `animation-stop`  | Fired when `stop()` is called     |

## License

Apache-2.0
