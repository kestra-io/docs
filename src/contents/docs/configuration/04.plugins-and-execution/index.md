---
title: Kestra Plugins and Execution Configuration
description: Configure plugin installation, plugin defaults, feature flags, retries, task settings, system flows, templates, and execution-related behavior in Kestra.
sidebarTitle: Plugins and Execution
icon: /src/contents/docs/icons/admin.svg
---

Use this page when configuring how tasks, plugins, and execution-time behaviors work across your Kestra instance.

## Plugins

This area includes:

- installing plugins
- custom Maven repositories
- Enterprise plugin repositories
- plugin defaults
- forced plugin defaults
- plugin security and allowed plugins
- plugin management settings

For many teams, this is the most important section after runtime setup because it centralizes behavior shared across many flows.

## Execution behavior

This part of the configuration also includes:

- retries
- temporary task storage
- tutorial flows
- system flows
- local flow synchronization
- enabling templates
- storing execution data in internal storage

## Variables and rendering

Relevant runtime-wide settings include:

- environment variable prefixes
- global variables
- recursive rendering
- template cache

These settings shape how expressions and templated values behave across flows.

## Related docs

- Flow-level plugin defaults: [Plugin Defaults](../../05.workflow-components/09.plugin-defaults/index.md)
- Universal file access: [File Access](../../06.concepts/file-access/index.md)
- Full property-level details: [Full Reference](../99.full-reference/index.md#plugins)
