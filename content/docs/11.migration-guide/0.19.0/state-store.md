---
title: Deprecation of State Store in favor of KV Store
icon: /docs/icons/migration-guide.svg
release: 0.19.0
---

How to migrate from State Store to KV Store.

## Overview

The State Store is a mechanism used under the hood by kestra to store the state of a task execution as a file in internal storage.

With the general availability of the [KV Store](../../05.concepts/05.kv-store.md) in Kestra 0.18.0, the State Store is deprecated starting with Kestra 0.19.0.

## Why the change?

State Store was difficult to troubleshoot and manage. There was no way to view what data is actually stored in the State Store from the UI/API, and the data stored there was tied to a given flow execution, making it chalenging to manage the lifecycle of the data.

The KV Store provides more flexibility and control over the data persisted during your task execution, allowing you to:
- set a type for each key (e.g. string, number, boolean, datetime, date, duration, JSON),
- view the data from the UI,
- query the persisted values via key from your flows or via API,
- manage the lifecycle for each key via TTL.


## State Store tasks

The [State Store tasks](https://kestra.io/plugins/core#state) are deprecated in favor of equivalent [KV Store tasks](https://kestra.io/plugins/core#kv). The table below shows a mapping of the deprecated State Store tasks to the KV Store tasks.

| State Store task | KV Store task |
|------------------|---------------|
| `io.kestra.plugin.core.state.Get` | `io.kestra.plugin.core.kv.Get` |
| `io.kestra.plugin.core.state.Set` | `io.kestra.plugin.core.kv.Set` |
| `io.kestra.plugin.core.state.Delete` | `io.kestra.plugin.core.kv.Delete` |


## How to migrate

All plugins that were using State Store now leverage KV Store under the hood. This includes:
- all [Singer plugins](https://kestra.io/plugins/plugin-singer)
- all [Debezium plugins](https://github.com/kestra-io/plugin-debezium)
- [CloudQuery plugin](https://kestra.io/plugins/plugin-cloudquery)

If you were using one of those plugins, make sure to run this command after upgrading to Kestra 0.19.0:

```bash
/app/kestra sys state-store migrate
```

Additionally, if you were using the [State Store tasks](https://kestra.io/plugins/core#state) directly in your flows, make sure to update your flows to use the equivalent [KV Store tasks](https://kestra.io/plugins/core#kv).

