# Custom Icons

This directory is used by [`astro-icon`](https://www.astroicon.dev/) for local SVG icons.

## Usage

Place individual `.svg` files in this directory (or subdirectories) to reference them with the `<Icon />` component:

```astro
---
import { Icon } from "astro-icon/components";
---

<!-- Loads src/icons/my-icon.svg -->
<Icon name="my-icon" />
```

> **Note**: For general icons, this project primarily uses the `@iconify-json/mdi` set (e.g. `<Icon name="mdi:..." />`).
