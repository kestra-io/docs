---
title: Server Configuration
icon: /docs/icons/admin.svg
---

This section describes the configuration options for the Kestra Server.

## HTTP Basic Authentication

You can protect your Kestra installation with HTTP Basic Authentication.

```yaml
kestra:
  server:
    basic-auth:
      enabled: true
      username: admin
      password: kestra
```

HTTP Basic Authentication is disabled by default - you can enable it in your Kestra configuration, as shown above. If you need more fine-grained control over user and access management, the Enterprise Edition provides additional authentication mechanisms, including features such as SSO and RBAC. For more details, see
the [Authentication page](../05.enterprise/authentication.md).

## Delete configuration files

### `kestra.configurations.delete-files-on-start`:

This setting allows to delete all configuration files after the server startup. It prevents the ability to read
configuration files (that may contain your secrets) from a Bash task for example. The server will keep these values in
memory, and they won't be accessible from tasks.

::ConfigPropertyCard
---
type: Boolean
defaultValue: false
---
::

## Server Liveness & Heartbeats

Kestra's servers use a heartbeat mechanism to periodically send their current state to the Kestra backend,
indicating their liveness. That mechanism is crucial for the timely detection of server failures and for ensuring
seamless continuity in workflow executions.

Here are the configuration parameters for all server types starting from Kestra **0.16.0**.

Note that although it's recommended to deploy the same configuration for all Kestra servers,
it's perfectly safe to set different values for those parameters depending on the server type.

### `kestra.server.liveness.enabled`

Enable the liveness probe for the server. This property controls whether a server can be detected as `DISCONNECTED` or
not. Must always be `true` for production environment.

::ConfigPropertyCard
---
type: Boolean
defaultValue: true
---
::

### `kestra.server.liveness.interval`

Frequency at which an `Executor` will check the liveness of connected servers.

::ConfigPropertyCard
---
type: Duration
defaultValue: 5s
---
::

### `kestra.server.liveness.timeout`

The time an `Executor` will wait for a state update from a server before considering it as `DISCONNECTED`.

::ConfigPropertyCard
---
type: Duration
defaultValue: 45s
---
::

::alert{type="warning"}
Note that this parameter MUST be configured with the same value for all `Executor` server.
::

### `kestra.server.liveness.initialDelay`

The initial delay after which an `Executor` will start monitoring the liveliness of a server joining the cluster.

::ConfigPropertyCard
---
type: Duration
defaultValue: 45s
---
::

::alert{type="warning"}
Note that this parameter MUST be configured with the same value for all `Executor` server.
::

### `kestra.server.liveness.heartbeatInterval`

The interval at which a server will send a heartbeat indicating its current state.
Must be strictly inferior to `kestra.server.liveness.timeout`.

::ConfigPropertyCard
---
type: Duration
defaultValue: 3s
---
::

### Recommended configuration for production

Here is the default and recommended configuration for production ():

**For JDBC deployment-mode (OSS):**
```yaml
kestra:
  server:
    liveness:
      enabled: true
      interval: 5s
      timeout: 45s
      initialDelay: 45s
      heartbeatInterval: 3s
```

**For Kafka deployment-mode (Enterprise Edition):**
```yaml
kestra:
  server:
    liveness:
      timeout: 1m
      initialDelay: 1m
```

::alert{type="warning"}
Note that Worker liveness is directly managed by the Apache Kafka protocol which natively provides
durability and reliability of task executions.
::

### For Kestra versions prior to 0.16.0

Prior to Kestra 0.16.0, the liveness mechanism was only supported by **Workers** ([JDBC deployment mode](/docs/architecture#architecture-with-jdbc-backend)).
A **Worker** was either `UP` or `DEAD`. `Executors` was responsible to detect unhealthy workers as follows:

* If the last received Heartbeat for a `Worker` is older than `heartbeat-missed * frequency`, then the `Worker` is
  marked as unhealthy.
* If the last received Heartbeat for a `Worker` is older than `heartbeat-missed * frequency * 2`, then the `Worker` is
  deleted from the server metadata.

### `kestra.heartbeat.frequency`

The interval at which a Worker will send a heartbeat indicating its current state.

::ConfigPropertyCard
---
type: Duration
defaultValue: 10s
---
::

### `kestra.heartbeat.heartbeat-missed`

The number of missed heartbeats before `Executors` will consider a Worker as `DEAD`.

::ConfigPropertyCard
---
type: Integer
defaultValue: 3
---
::

## Worker Task Restart Strategy

Starting with Kestra `0.16.0`, you can configure the strategy to be used by `Executors` when a `Worker` is
detected as unhealthy regarding uncompleted tasks ([JDBC deployment mode](/docs/architecture#architecture-with-jdbc-backend)).

### `kestra.server.workerTaskRestartStrategy`

The strategy to be used for restarting uncompleted tasks in the event of a worker failure.

Supported strategies are:

* **`NEVER`**:

Tasks will never be restarted in the event of a worker failure (i.e., tasks are run at most once).

* **`IMMEDIATELY`**:

Tasks will be restarted immediately in the event of a worker failure, (i.e., as soon as a worker is detected
as `DISCONNECTED`).
This strategy can be used to reduce task recovery times at the risk of introducing duplicate executions (i.e., tasks are
run at least once).

* **`AFTER_TERMINATION_GRACE_PERIOD`**:

Tasks will be restarted on worker failure after the `kestra.server.terminationGracePeriod`.
This strategy should prefer to reduce the risk of task duplication  (i.e., tasks are run exactly once in the best
effort).


::ConfigPropertyCard
---
type: String
defaultValue: AFTER_TERMINATION_GRACE_PERIOD
validValues: NEVER, IMMEDIATELY, AFTER_TERMINATION_GRACE_PERIOD
---
::

## Termination Grace Period

When a Kestra Server receives a `SIGTERM` signal it will immediately try to stop gracefully.

Starting with Kestra `0.16.0`, you can configure the termination grace period for each Kestra Server.
The termination grace period defines the allowed period for a server to stop gracefully.

### `kestra.server.terminationGracePeriod`

The expected time for the server to complete all its tasks before shutting down.

::ConfigPropertyCard
---
type: Duration
defaultValue: 5m
---
::

