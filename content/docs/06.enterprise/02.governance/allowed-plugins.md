---
title: Allowed & Restricted Plugins
icon: /docs/icons/admin.svg
editions: ["EE"]
version: ">= 0.19.0"
---

How to configure Kestra with allowed and restricted plugins.

## Allowed plugins

You can restrict which plugins can be used in a Kestra instance by configuring an include / exclude list using regexes.

To allow specific plugins, add the `includes` attribute in your Kestra configuration file and list the approved plugins or use a regex expression. Below is an example that `includes` all plugins from the `io.kestra` package using a regex expression.

```yaml
kestra:
  plugins:
    security:
      includes:
        - io.kestra.*
```

## Restricted plugins

To restrict certain plugins, add the `excludes` attribute in your Kestra configuraiton file and list the disallowed plugins or use a regex expression. Below is the previous example with `excludes` added to disallow the `io.kestra.plugin.core.debug.Echo` plugin.

```yaml
kestra:
  plugins:
    security:
      includes:
        - io.kestra.*
      excludes:
        - io.kestra.plugin.core.debug.Echo
```
