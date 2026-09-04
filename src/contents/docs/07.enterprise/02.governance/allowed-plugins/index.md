---
title: Allowed & Restricted Plugins in Kestra Enterprise
h1: Control Which Plugins Are Allowed or Restricted
description: Control plugin usage in Kestra Enterprise. Configure allowed and restricted plugins to enforce security policies and compliance standards.
sidebarTitle: Allowed & Restricted Plugins
icon: /src/contents/docs/icons/admin.svg
editions: ["EE", "Cloud"]
version: ">= 0.19.0"
---

How to configure Kestra to allow or restrict specific plugins.

## Allowed & Restricted Plugins

Kestra comes with the full library of official plugins by default. However, in some cases you may want to restrict which plugins are available to specific teams or users. For example, you might allow a team to use only BigQuery tasks while blocking script execution. Kestra enables this by letting you define allowlists (`includes`) and blocklists (`excludes`) in your [Plugins and Execution configuration](../../../configuration/04.plugins-and-execution/index.md).

## Matching syntax

Each entry in `includes` or `excludes` supports three formats:

- **Trailing wildcard** (`io.kestra.*`) — matches all plugins whose class name starts with the given prefix. The trailing `*` is stripped and the remainder is used as a prefix.
- **Regex** (`regex:<pattern>`) — matches using a full Java regular expression. Example: `regex:^io\.kestra\.plugin\.core\.flow\.Parallel$`.
- **Plain value** (`io.kestra.plugin.core.flow.Parallel`) — prefix match for backward compatibility. Behaves the same as adding a trailing `*`. Use explicit trailing wildcard or `regex:` for clarity.

## Allowed plugins

To allow specific plugins, add the `includes` attribute and list the approved plugins. The following example allows all plugins from the `io.kestra` package:

```yaml
kestra:
  plugins:
    security:
      includes:
        - io.kestra.*
```

## Restricted plugins

To restrict certain plugins, add the `excludes` attribute. The following example allows all `io.kestra` plugins while blocking `io.kestra.plugin.core.debug.Echo`:

```yaml
kestra:
  plugins:
    security:
      includes:
        - io.kestra.*
      excludes:
        - io.kestra.plugin.core.debug.Echo
```

Use the `regex:` prefix for more precise pattern matching, such as excluding a single plugin without prefix side-effects:

```yaml
kestra:
  plugins:
    security:
      excludes:
        - regex:^io\.kestra\.plugin\.core\.flow\.Parallel$
```
