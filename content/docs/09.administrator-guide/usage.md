---
title: Usage
icon: /docs/icons/admin.svg
---

Configuration options for the usage report.

Understanding how you use Kestra is important to us, as it helps improve the solution in many ways.
For this reason, the `kestra.anonymous-usage-report.enabled` option is mandatory: you must decide whether to share anonymous data so we can learn from your experience and use cases.

- `kestra.anonymous-usage-report.enabled`: (default true)
- `kestra.anonymous-usage-report.initial-delay`: (default 5m)
- `kestra.anonymous-usage-report.fixed-delay`: (default 1h)


The collected data can be found [here](https://github.com/kestra-io/kestra/tree/develop/core/src/main/java/io/kestra/core/models/collectors). We collect only **anonymous data** that allows us to understand how you use Kestra. The data collected includes:

- **host data:** CPU, RAM, OS, JVM, and a machine fingerprint.
- **plugins data:** plugins installed and their current versions.
- **flow data:** namespace count, flow count, the task type and the trigger type used.
- **execution data:** execution and task run counts for the last two days, with counts and durations grouped by status.
- **UI interaction:** data to help us understand user experience in the interface.
- **common data:** server type, version, time zone, environment, start time, and URL.
