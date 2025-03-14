---
title: Kestra 0.22 introduces XXX
description: TBD
date: 2025-04-01T17:00:00
category: News & Products Updates
author:
  name: Benoit Pimpaud
  image: bpimpaud
image: /blogs/release-0-22.jpg
---

Kestra 0.22 introduces TBD and several other improvements.

The table below highlights the key features of this release.

| Feature                                   | Description                                                                | Edition |
|-------------------------------------------|----------------------------------------------------------------------------| --- |
|  Plugin Versioning       | TBD                 | Enterprise Edition |
| External Secrets Manager        | TBD                 | Enterprise Edition |
| `afterExecution` property       | TBD                 | All Edition |
| Sharing of Namespace Files and KV Store across namespaces       | TBD                 | All Edition |

Check the video below for a quick overview of the new features.

<div class="video-container">
    <iframe src="LINK_TBD" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

---

Let's dive into these highlights and other enhancements in more detail.

## Feature Highlights

### Plugin Versioning


Managing plugin versions is essential for maintaining stability while enabling innovation in your automation workflows. This release introduces Plugin Versioning capabilities, giving you unprecedented control over your plugin ecosystem.
With the new Plugin Versioning feature, you can now manage multiple versions of plugins simultaneously across your entire environment. This powerful capability allows teams to progressively adopt new features while maintaining critical production workflows.

You can access Plugin Versioning through the new dedicated page under Administration > Instance > Versioned Plugin. Here you'll find an intuitive interface that displays all available versions and prompts to upload and manage plugins.

Plugins are now stored in internal storage and automatically synchronized across all workers, ensuring consistency throughout your environment. For organizations with custom plugins, we've added support for customer-specific artifact registries, allowing you to manage proprietary automation components with the same robust tools used for standard plugins.


### External Secrets Manager 

- New read-only mode for external secrets managers
- Currently implemented for Vault with path prefix support
- Secrets remain managed in external system
- UI shows lock icon for read-only secrets
- Cannot edit/create/delete read-only secrets through Kestra
- Known limitations:
    - UI caching issues
    - Pagination needed for large secret sets
    - Tenant-level implementation pending

### `afterExecution` property

- https://github.com/kestra-io/kestra/pull/7791

### Sharing of Namespace Files and KV Store across namespaces

- https://github.com/kestra-io/kestra/issues/5467

## User Interface & Experience Improvements

As with each release, there are more UI and UX enhancements:

- Improved Editor contrast in the light mode
- Export topology view to PNG and JPG
- Improvements to flow filters in the UI (Filter flows by text, filter by multiple labels)

## Other Features and Improvements

- LDAP - https://github.com/kestra-io/kestra-ee/issues/687
- Audit log shipper + Splunk LogShipper
- Improvements to Queues 
- DevContainer mention - https://github.com/kestra-io/kestra/pull/7507
- pip package to read ION - https://github.com/kestra-io/libs/pull/16 (documentation already done by AJ)
- Ansible outputs   
- Many changes on the website: after nuxt 2 to 3 migration it's much faster, new plugin page
- Tons of v2 properties bug fixes 
- Inject taskrun and execution states in context (accessible via Pebble) - https://github.com/kestra-io/kestra/issues/7155

## Plugin enhancements

### New Snowflake CLI plugin

TBD

::collapse{title="Snowflake CLI task example"}
```yaml

```
::

### New Supabase plugin

TBD

::collapse{title="Supabase task example"}
```yaml

```
::

### New MariaDB tasks

- https://github.com/kestra-io/plugin-jdbc/commit/ab18b1bf14a656b8f469c5494b9f0d610d47c73e

### New ServiceNow tasks

TBD

::collapse{title="Supabase task example"}
```yaml

```
::

### New Hubspot tasks

TBD

::collapse{title="Supabase task example"}
```yaml

```
::

### New Pebble functions

TBD

- https://github.com/kestra-io/kestra/issues/6888

## Thanks to Our Contributors

Thank you to everyone who contributed to this release through feedback, bug reports, and pull requests. If you want to become a Kestra contributor, check out our [Contributing Guide](https://kestra.io/docs/getting-started/contributing) and the [list of good first issues](https://github.com/search?q=org%3Akestra-io+label%3A%22good+first+issue%22+is%3Aopen&type=issues&utm_source=GitHub&utm_medium=github&utm_content=Good+First+Issues).

## Next Steps

This post covered new features and enhancements added in Kestra 0.22.0. Which of them are your favorites? What should we add next? Your feedback is always appreciated.

If you have any questions, reach out via [Slack](https://kestra.io/slack) or open [a GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us a [GitHub star](https://github.com/kestra-io/kestra) ⭐️ and join [the community](https://kestra.io/slack).
