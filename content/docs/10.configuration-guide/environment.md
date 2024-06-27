---
title: Environment
icon: /docs/icons/admin.svg
---

How to configure the environment UI display.

Here are the configuration options for the environment UI display.

You can add a label and a color to identify your environment in the UI by adding this configuration:

```yaml
kestra:
  environment:
    name: Production
    color: "#FCB37C"
```

You can also set that environment name and color directly from the UI. Just go to the settings page and type the desired Environment name and select the color.

![env_color](/docs/administrator-guide/configuration/env_color.png)
