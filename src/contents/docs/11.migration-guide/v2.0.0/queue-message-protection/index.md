---
title: Queue Message Protection Is On by Default in Kestra 2.0
h1: Check Tasks That Return Large Outputs
sidebarTitle: Queue Message Protection
icon: /src/contents/docs/icons/migration-guide.svg
release: 2.0.0
editions: ["OSS", "EE"]
description: Kestra 2.0 enables queue message protection by default with a 1 MiB limit, under a new configuration key. Tasks whose results exceed the limit fail after the upgrade.
---

Kestra 2.0 rejects queue messages larger than 1 MiB by default, so a task that returns a large output can fail after the upgrade.

## What changed

[Queue message protection](../../../configuration/02.runtime-and-storage/index.md#queue-prefix-and-message-protection) checks the size of each message before Kestra writes it to the queue. In 2.0, it's on by default, with a lower limit and a new configuration key:

| | 1.3 | 2.0 |
|---|---|---|
| Configuration key | `kestra.jdbc.queues.message-protection` | `kestra.queue.message-protection` |
| Enabled by default | No | Yes |
| Limit | 10 MiB, applied only when enabled | 1 MiB (`1048576` bytes) |
| Queue backends | JDBC | All |

A task's outputs travel in its result message. When that message exceeds the limit, the task fails with:

```
Unable to emit the worker task result to the queue: [WorkerTaskResult] message of size 10001240 has exceeded the configured limit of 1048576.
```

## Who is affected

You are affected if a task returns more than about 1 MiB in its outputs, for example:

- an HTTP `Request` task whose response body is large, since the body becomes a task output
- a script task that returns a large value through its outputs
- a query or API task that returns its results with `fetchType: FETCH`

Flows that ran on 1.3 with the default configuration can fail on 2.0 without any change to the flow.

If you set `kestra.jdbc.queues.message-protection` on 1.3, Kestra 2.0 ignores it. Move the values to `kestra.queue.message-protection`.

## How to migrate

Before you upgrade, find the tasks that return large outputs, then choose one of the following options.

### Option 1: Store large data in internal storage

Keep the queue message small by writing large data to internal storage and passing its URI between tasks:

- Download the file with the HTTP `Download` task instead of reading the response body with `Request`.
- Use `fetchType: STORE` on query and API tasks.
- Write large script results to files with `outputFiles` instead of returning them as output values.

This is the recommended option, since large messages also slow down the queue.

### Option 2: Raise the limit

If a task needs to return a large value in its outputs, raise the limit:

```yaml
kestra:
  queue:
    message-protection:
      enabled: true
      limit: 10485760   # 10 MiB
```

Disabling message protection with `enabled: false` also works, but isn't recommended: a very large message can put memory pressure on every component that reads the queue.

## Related

- [Queue prefix and message protection](../../../configuration/02.runtime-and-storage/index.md#queue-prefix-and-message-protection)
