# @manufosela/animation-snowcss

CSS-based snow effect web component built with [Lit 3](https://lit.dev). Renders animated falling snowflakes as a full-viewport overlay using CSS keyframes with a gentle horizontal drift — no canvas, no JavaScript animation loop.

## Install

```bash
npm install @manufosela/animation-snowcss
```

## Usage

```html
<script type="module">
  import '@manufosela/animation-snowcss';
</script>

<animation-snowcss
  num-snowflakes="200"
  speed="2"
  color="white"
  active
></animation-snowcss>
```

## Attributes

| Attribute        | Type    | Default  | Description                        |
|------------------|---------|----------|------------------------------------|
| `num-snowflakes` | Number  | `200`    | Number of snowflakes               |
| `speed`          | Number  | `2`      | Fall speed multiplier              |
| `color`          | String  | `white`  | Snowflake color (any CSS color)    |
| `active`         | Boolean | `true`   | Whether the animation is visible   |

## Methods

| Method    | Description                                       |
|-----------|---------------------------------------------------|
| `start()` | Show and resume the snow animation                |
| `stop()`  | Hide the snow animation with a fade transition    |

## CSS Custom Properties

| Property          | Default | Description                    |
|-------------------|---------|--------------------------------|
| `--snow-z-index`  | `9999`  | Z-index of the snow overlay    |

## Events

| Event             | Description                       |
|-------------------|-----------------------------------|
| `animation-start` | Fired when `start()` is called    |
| `animation-stop`  | Fired when `stop()` is called     |

## License

Apache-2.0
