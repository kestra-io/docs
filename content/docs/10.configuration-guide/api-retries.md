---
title: API Retries Configuration
icon: /docs/icons/admin.svg
---

This page describes how you can configure retries for internal storage and secrets API calls.

Kestra uses external storage and secrets so that your private data and secrets are stored in a secure way in your private infrastructure. These external systems communicate with Kestra through APIs. Those API calls, however, might eperience transient failures. To handle these transient failures, Kestra allows you to configure retries.

Here are the available retry configuration options:

- `kestra.retries.attempts`: the max number of retries (default `5`)
- `kestra.retries.delay`: the initial delay between retries (default `1s`)
- `kestra.retries.max-delay`: the max amount of time to retry (default `undefined`)
- `kestra.retries.multiplier`: the multiplier of `delay` between each attempt (default `2.0`)

::alert{type="warning"}
Note that those retries are only applied to API calls made to internal storage (like S3 or GCS) and to secrets managers (like Vault or AWS Secrets Manager). They are not applied to tasks.
::

In order to globally configure retries for tasks, you can use the [task defaults](/docs/workflow-components/task-defaults) with a global scope tied to the main `io.kestra` plugin path as follows:

```yaml
- type: io.kestra
  retry:
    type: constant # type: string
    interval: PT5M # type: Duration
    maxDuration: PT1H # type: Duration
    maxAttempt: 3 # type: int
    warningOnRetry: true # type: boolean, default is false
```
