---
title: Heartbeat Configuration
icon: /docs/icons/admin.svg
---

Here are the configuration options for the heartbeat.

JDBC have a concept of heartbeats that periodically check the health of a worker at the specified `frequency`.

* If the last healthcheck is older than `heartbeat-missed * frequency`, the worker will be marked as unhealthy.
* If the last healthcheck is older than `heartbeat-missed * frequency * 2`, the worker will be deleted.

If a worker is still running after being deleted, it will stop itself.

### `kestra.heartbeat.frequency`

This property indicates the healthcheck frequency specified using the duration string.

The default value is `10s` i.e. every 10 seconds.

### `kestra.heartbeat.heartbeat-missed`

This property indicates the number of missed heartbeats allowed before a worker is marked as unhealthy.

The default value is `3` i.e. 3 missed heartbeats are allowed before a worker is marked as unhealthy.
