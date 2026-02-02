---
title: Fallback on unhealthy workers
description: "Worker Group Fallback changes in Kestra 0.20.0 (Enterprise). Configure fallback: FAIL to retain previous behavior when no workers are available in a group."
icon: /src/contents/docs/icons/migration-guide.svg
release: 0.20.0
editions: ["EE"]
---


## Fallback on unhealthy workers

Migrating usage of worker group keys

By default, a task configured to run on a worker group where no workers are available will wait for the worker to be available. The previous behavior was to fail.

This behavior is configurable. To keep the previous behavior, simply set the `fallback` behavior to `FAIL` as follows:
```yaml
  - id: hello
    type: io.kestra.plugin.core.log.Log
    message: Hello World!
    workerGroup:
      key: wg1
      fallback: FAIL #  possible values are WAIT (default), FAIL or CANCEL
```

If you want to set a custom `workerGroup` `key` and `behavior` per plugin type and/or namespace, you can leverage `pluginDefaults`.
