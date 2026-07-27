---
title: "Anonymous Usage Reporting in Kestra: Enable or Disable"
h1: Enable or disable anonymous usage data collection
sidebarTitle: Usage
icon: /src/contents/docs/icons/admin.svg
description: Learn about anonymous usage reporting in Kestra and how to configure or disable data collection.
---

Configuration options for the usage report.

The `kestra.anonymous-usage-report.enabled` option is mandatory: decide whether to share anonymous data to help improve Kestra.

- `kestra.anonymous-usage-report.enabled`: (default true)
- `kestra.anonymous-usage-report.initial-delay`: (default 5m)
- `kestra.anonymous-usage-report.fixed-delay`: (default 1h)

Kestra collects anonymous usage through **two independent streams**, each controlled by its own option:

- `kestra.anonymous-usage-report.enabled`: the **server-side** report (host, plugins, flow, and execution data listed below).
- `kestra.ui-anonymous-usage-report.enabled`: (default true) the **UI (frontend)** usage report, sent separately from the browser to help us understand user experience in the interface.

To disable **all** anonymous usage reporting, set **both** options to `false`:

```yaml
kestra:
  anonymous-usage-report:
    enabled: false
  ui-anonymous-usage-report:
    enabled: false
```

Setting only `kestra.anonymous-usage-report.enabled` to `false` stops the server-side report but leaves UI reporting enabled (and vice versa).

The collected data can be found [here](https://github.com/kestra-io/kestra/tree/develop/core/src/main/java/io/kestra/core/models/collectors). We collect only **anonymous data** that allows us to understand how you use Kestra. The data collected includes:

- **host data:** CPU, RAM, OS, JVM, and a machine fingerprint.
- **plugins data:** plugins installed and their current versions.
- **flow data:** namespace count, flow count, the task type and the trigger type used.
- **execution data:** execution and task run counts for the last two days, with counts and durations grouped by status.
- **UI interaction:** data to help us understand user experience in the interface.
- **common data:** server type, version, time zone, environment, start time, and URL.
