---
title: Allowed & Restricted Plugins in Kestra Enterprise
description: Control plugin usage in Kestra Enterprise. Configure allowed and restricted plugins to enforce security policies and compliance standards.
sidebarTitle: Allowed & Restricted Plugins
icon: /src/contents/docs/icons/admin.svg
editions: ["EE", "Cloud"]
version: ">= 0.19.0"
---

How to configure Kestra to allow or restrict specific plugins.

## Allowed & Restricted Plugins

Kestra comes with the full library of official plugins by default. However, in some cases you may want to restrict which plugins are available to specific teams or users. For example, you might allow a team to use only BigQuery tasks while blocking script execution. Kestra enables this by letting you define allowlists (`includes`) and blocklists (`excludes`) using plugin names or regular expressions.

To allow specific plugins, add the `includes` attribute in your [Kestra configuration](../../../configuration/index.md) file and list the approved plugins or use a regular expression. Below is an example that `includes` all plugins from the `io.kestra` package using a regular expression.

```yaml
kestra:
  plugins:
    security:
      includes:
        - io.kestra.*
```

## Restricted plugins

To restrict certain plugins, add the `excludes` attribute in your [Kestra configuration](../../../configuration/index.md) file and list the disallowed plugins or use a regular expression. Below is the previous example with `excludes` added to disallow the `io.kestra.plugin.core.debug.Echo` plugin.

```yaml
kestra:
  plugins:
    security:
      includes:
        - io.kestra.*
      excludes:
        - io.kestra.plugin.core.debug.Echo
```
