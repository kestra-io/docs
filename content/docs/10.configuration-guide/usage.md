---
title: Usage
icon: /docs/icons/admin.svg
---

Here are the configuration options for the usage report.

Understanding how you use Kestra is very important to us: it helps us improve the solution in many ways.
For this reason, the `kestra.anonymous-usage-report.enabled` option is mandatory: we want you to consider whether you wish to share anonymous data with us so that we can benefit from your experience and use cases.

- `kestra.anonymous-usage-report.enabled`: (default true)
- `kestra.anonymous-usage-report.initial-delay`: (default 5m)
- `kestra.anonymous-usage-report.fixed-delay`: (default 1h)


The collected data can be found [here](https://github.com/kestra-io/kestra/tree/develop/core/src/main/java/io/kestra/core/models/collectors). We collect only **anonymous data** that allows us to understand how you use Kestra. The data collected includes:

- **host data:** cpu, ram, os, jvm and a fingerprint of the machine.
- **plugins data:** the list of plugins installed and their current versions.
- **flow data:** the namespace count, flow count, the task type and the trigger type used.
- **execution data:** the execution and taskruns count for last 2 days with count and duration grouped by status.
- **common data:** the server type, version, timezone, env, start time and url.