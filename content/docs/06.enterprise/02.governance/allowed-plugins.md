---
title: Allowed & Restricted Plugins
icon: /docs/icons/admin.svg
editions: ["EE", "Cloud"]
version: ">= 0.19.0"
---

How to configure Kestra with and without specified plugins.

## Allowed plugins

By default, Kestra comes with the full library of official plugins. In some cases, you may want to limit which plugins a user or team can use, for example there may be a team you want to only allow to query data specifically with BigQuery and not be able to run script tasks. You can govern which plugins can be used in a Kestra instance by configuring an include / exclude list using regexes.

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
