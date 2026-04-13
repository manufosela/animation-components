# @manufosela/scene-protonimg

Particle animation web component that morphs between two images using the [Proton](https://github.com/a-jie/Proton) engine. Built with Lit 3.

## Installation

```bash
npm install @manufosela/scene-protonimg
```

## Usage

```html
<script type="module">
  import '@manufosela/scene-protonimg';
</script>

<scene-protonimg
  width="900"
  height="300"
  time="5"
  background="#000"
  imagen1="img/demo1.png"
  imagen2="img/demo2.png"
></scene-protonimg>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `time` | Number | 2 | Seconds between image swaps. Use `0` for click-to-change |
| `width` | Number | 800 | Canvas width in pixels |
| `height` | Number | 400 | Canvas height in pixels |
| `background` | String | `#000` | Canvas background color |
| `imagen1` | String | — | First image URL |
| `imagen2` | String | — | Second image URL |

## License

MIT — Proton.js and PxLoader libs are included in `src/lib/` (see their own licenses).
