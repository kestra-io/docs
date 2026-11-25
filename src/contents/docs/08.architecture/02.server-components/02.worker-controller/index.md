---
title: "Worker Controller in Kestra: How Workers Get Jobs"
h1: How the Kestra Worker Controller Connects Workers
description: Understand how the Kestra Worker Controller dispatches jobs to Workers over gRPC. Learn how it balances load, secures connections, and scales.
sidebarTitle: Worker Controller
icon: /src/contents/docs/icons/architecture.svg
---

The Worker Controller is the server component that every Worker connects to.

Workers never read the job queue or the database directly. They open a gRPC connection to a Worker Controller, which sends them jobs, receives their results, logs, and metrics, and relays their heartbeats. Each section below links to the page that documents how to configure the feature.

## What the Worker Controller does

For each connected Worker, the Worker Controller:

- Sends it [tasks](../../../05.workflow-components/01.tasks/index.mdx) and trigger evaluations from the queues it serves, and returns its task results to the [Executor](../01.executor/index.md).
- Receives its logs and metrics and passes them on to the rest of the cluster.
- Relays its heartbeats for [server liveness](../../../10.administrator-guide/server-lifecycle/index.md#the-liveness-mechanism), and tells it when the instance enters [maintenance mode](../../../07.enterprise/05.instance/maintenance-mode/index.md).
- Forwards kill requests so the Worker stops the tasks of a killed execution.
- Answers the Worker's metadata reads, such as flow definitions, and tells it when cached flows change.

The Worker Controller doesn't run tasks, evaluate triggers, or decide which task runs next. The Executor and the [Scheduler](../05.scheduler/index.md) make those decisions. The Worker Controller only delivers the work to a [Worker](../03.worker/index.md) and brings the result back.

## Where it runs

The Worker Controller can run in three places:

- **Embedded in the Webserver.** `kestra server webserver` starts a Worker Controller by default.
- **Embedded in a standalone server.** `kestra server standalone` also starts one by default.
- **As its own server**, with `kestra server controller`.

Start the Webserver or standalone server with `--no-controller` when you run the Worker Controller separately. See the [`kestra server` commands](../../../kestra-cli/kestra-server/index.md#kestra-server-webserver).

The Worker Controller listens on gRPC port `50051` by default, set with `kestra.controller.port`. Workers must be able to reach this port, so open it to wherever your Workers run, even when the Worker Controller is embedded in the Webserver. The [Helm migration guide](../../../11.migration-guide/v2.0.0/helm-grpc-worker-controller/index.md#port-50051-exposed-by-default) covers this for Kubernetes.

The Worker Controller exposes the standard gRPC health service under the name `kestra.controller`. When it shuts down, it reports `NOT_SERVING` first, so load balancers stop sending it new connections.

## How Workers connect

When a Worker starts, it calls the Worker Controller once to register. The reply tells the Worker which worker group it belongs to and gives it the instance settings it needs, such as the encryption key. The Worker then opens one long-lived stream to the Worker Controller and keeps it open for as long as it runs.

Workers find Worker Controllers in one of three ways:

- `STATIC` (default): a fixed list of addresses. The shipped default is `localhost:50051`.
- `DNS`: a host name that resolves to the Worker Controllers' A and AAAA records.
- `STORAGE`: each Worker Controller registers its address in internal storage, and Workers read that list. Use it only when Workers share the same internal storage as the Worker Controllers.

See [controller discovery strategies](../../../07.enterprise/04.scalability/worker-group/index.md#controller-discovery-strategies) for the configuration of each mode.

The Worker Controller closes each Worker's stream after one hour (`kestra.controller.max-connection-age`), with a 30-second grace period for calls in progress. The Worker reconnects right away, and the reconnection spreads Workers across any Worker Controllers you added since they first connected. Set the age to `PT0S` to keep streams open indefinitely.

## How work reaches Workers

Each Worker advertises how many jobs it can take, based on its thread count and job buffer. The Worker Controller counts a slot as used from the moment it sends a job until the Worker reports the result, not just until the job is delivered.

When a job is ready, the Worker Controller sends it to the eligible Worker with the fewest jobs in flight. If no eligible Worker has a free slot, the Worker Controller puts the job back on its queue and pauses reading that queue until a Worker has capacity again. The backlog stays with the Worker Controller, not on the Workers, so a Worker you add later starts receiving jobs right away. A queue is only read while at least one Worker that serves it is connected.

Before it sends a job, the Worker Controller records it as running. If that record can't be saved, or the job can't be sent, the job goes back on the queue.

:::alert{type="info"}
In Enterprise Edition, the Worker Controller also routes jobs to the Workers of each [worker group](../04.worker-group/index.md) and enforces each group's [capacity reservations](../../../07.enterprise/04.scalability/worker-group/index.md#capacity-reservation).
:::

### Kills

When an execution is killed, the Worker Controller forwards the kill to every connected Worker, so the Worker running the task stops it. For the next 24 hours, it also stops tasks of that execution before they reach a Worker and reports them as `KILLED`. Only tasks in an [`afterExecution`](../../../05.workflow-components/20.afterexecution/index.md) block still run on a killed execution.

### Payload size limits

A Worker accepts messages up to `kestra.grpc.max-inbound-message-size` (10 MiB by default). If a task is larger than the Worker's limit, the Worker Controller doesn't send it: the task run fails, and an error in the execution logs names the setting to raise on both the Workers and the Worker Controller. If a task's result is too large to forward, the Worker Controller reports the task run as `FAILED` without its outputs and logs the error to the execution.

## When a Worker goes away

When a Worker leaves the cluster, the Worker Controller doesn't resend its unfinished jobs itself. The Executor's liveness coordinator detects the lost Worker and resubmits its jobs to other Workers according to the Worker's restart strategy. See [worker job resubmission](../../../10.administrator-guide/server-lifecycle/index.md#worker-job-resubmission) and [liveness and worker task restarts](../../../configuration/05.security-and-secrets/index.md#liveness-and-worker-task-restarts).

### Jobs that never reach a Worker

A task can stay in `RUNNING` without ever starting, or a trigger can stop firing, while its Worker still looks healthy. The job was lost on its way to the Worker, but the Worker keeps sending heartbeats, so Kestra doesn't treat the Worker as dead and doesn't resubmit the job.

This usually happens when a load balancer or proxy between the Workers and the Worker Controller terminates HTTP/2 connections and answers keep-alive pings itself: the connection looks open, but jobs no longer get through. It can also happen when the Worker Controller closes a connection right after sending a job.

#### How Kestra recovers lost jobs

Each Worker reports the jobs it holds to the Worker Controller when it connects and then at a regular interval, and the Worker Controller acknowledges each report. When a Worker doesn't report a job that the Worker Controller sent it on an earlier connection, the job never arrived, and the Worker Controller resubmits it:

- A task goes back on its queue. A `WorkingDirectory` goes back as a whole, with all of its tasks.
- A trigger goes back to the Scheduler, which evaluates it again against the current flow revision.

The Worker Controller discards a task instead of resubmitting it when the task run already ended, when the execution is being killed, was killed or cancelled, or no longer exists, or when a [kill switch](../../../07.enterprise/05.instance/kill-switch/index.md) applies to it.

A Worker notices that its connection stopped delivering jobs when its reports are no longer acknowledged. After `sync-timeout` without an acknowledgment, the Worker opens a new connection, and the Worker Controller resubmits the lost jobs as soon as it reconnects. With the default settings, Kestra recovers a lost job in about a minute. When the Worker Controller closes the connection itself, the Worker reconnects right away, and recovery takes seconds.

#### Check whether jobs are lost

On the Worker Controller:

- The `controller.job.resubmitted.total` metric counts resubmitted jobs, tagged by worker group and worker queue.
- A resubmitted task logs a `WARN` message on its task run: `Resubmit WorkerTask: it never reached its worker.`
- A resubmitted trigger logs a `WARN` message: `Trigger never reached worker '<worker-id>', notifying the scheduler.`

On the Worker:

- The `worker.stream.reconnect.count` metric, with the `reason` tag `sync_unacknowledged`, counts the reconnections caused by unacknowledged reports.
- The Worker logs a `WARN` message that starts with `The controller has not acknowledged the jobs held by this worker`.

An occasional resubmission is expected, for example during a network interruption or a Worker Controller restart. If these counters keep increasing, check the HTTP/2 and keep-alive settings of the load balancer or proxy between your Workers and the Worker Controller. Resubmission limits the impact, but each lost job is still delayed until Kestra recovers it.

#### Tune the sync settings

Set these properties on the Workers:

| Property | Default | Description |
| --- | --- | --- |
| `kestra.worker.job-stream.sync-interval` | `30s` | How often a Worker reports the jobs it holds. |
| `kestra.worker.job-stream.sync-timeout` | `65s` | How long a Worker waits for the Worker Controller to acknowledge a report before it reconnects. It sets how long a lost job can wait before Kestra recovers it. |

Keep `sync-timeout` above `sync-interval`, ideally at least twice as long. Otherwise, a Worker reconnects between two reports even when its connection is healthy.

To recover lost jobs faster, lower `sync-timeout`, and lower `sync-interval` with it. Shorter intervals add traffic and work on the Worker Controller.

:::alert{type="info"}
During a rolling upgrade, a Worker connected to an older Worker Controller that doesn't acknowledge reports keeps its connection. `sync-timeout` only applies once the Worker Controller has acknowledged at least one report on that connection.
:::

## Storage access through the Worker Controller

By default, Workers read and write the [KV store](../../../06.concepts/05.kv-store/index.md) and [namespace files](../../../06.concepts/02.namespace-files/index.md) directly in internal storage, so they need storage credentials. To keep those credentials off your Workers, route these reads and writes through the Worker Controller instead:

```yaml
kestra:
  kv:
    worker-access: CONTROLLER
  namespace-files:
    worker-access: CONTROLLER
```

Set this on the Workers. Each setting accepts `STORAGE` (the default) or `CONTROLLER`, and only takes effect on servers started with `kestra server worker`.

:::alert{type="info"}
In Enterprise Edition, Workers can also be configured to download plugin artifacts and resolve secrets through the Worker Controller, so they don't need access to the plugin store or the secret backend.
:::

## Securing the connection

In the open-source edition, you can require shared Basic credentials on every gRPC call:

```yaml
kestra:
  grpc:
    basic-auth:
      enabled: true
      username: kestra-workers
      password: "{{ a strong shared secret }}"
```

Set the same values on the Worker Controller and on every Worker. The credentials authenticate the Worker fleet as a whole, not individual Workers, and gRPC health checks don't need them. The connection itself stays unencrypted, so keep it on a private network. See [gRPC basic authentication](../../../configuration/05.security-and-secrets/index.md#grpc-basic-authentication) and [transport security](../../../security-hardening/index.md#transport-security).

:::alert{type="info"}
Enterprise Edition replaces shared Basic credentials with [worker authentication](../../../07.enterprise/04.scalability/worker-group/index.md#worker-authentication): each Worker registers with a token for its worker group. When worker authentication is enabled, the Worker Controller also checks that each Worker only reaches data for the tenants its worker group serves. Enterprise Edition can also encrypt the connection with [TLS or mutual TLS](../../../07.enterprise/04.scalability/worker-group/index.md#transport-security-tls), and an Enterprise Edition Worker Controller rejects open-source Workers.
:::

## Running the Worker Controller

### Scaling and availability

You can run several Worker Controllers for availability. Each Worker's job stream is held by one Worker Controller, and stream recycling rebalances Workers across them over time. Use `DNS` or `STORAGE` discovery so Workers find new Worker Controllers without a configuration change.

See [high availability](../../../10.administrator-guide/high-availability/index.md#scaling-components) for deployment patterns.

### Configuration

| Property | Default | Purpose |
|---|---|---|
| `kestra.controller.port` | `50051` | gRPC port that Workers connect to. |
| `kestra.controller.max-connection-age` | `PT1H` | How long a Worker's stream stays open before the Worker reconnects. `PT0S` disables recycling. |
| `kestra.controller.max-connection-age-grace` | `PT30S` | Time given to calls in progress when a stream is recycled or the Worker Controller shuts down. |
| `kestra.controller.advertise.enabled` | `false` | Register this Worker Controller in internal storage for `STORAGE` discovery. |
| `kestra.grpc.max-inbound-message-size` | `10485760` | Largest message, in bytes, a Worker or Worker Controller accepts. Set the same value on both. |
| `kestra.grpc.basic-auth.enabled` | `false` | Require shared Basic credentials on every gRPC call (open-source edition). |

### Monitoring and troubleshooting

The Worker Controller publishes metrics under `kestra.controller.*`:

- Connected Workers and their free capacity, per queue and in total.
- Jobs in flight, dispatched, re-queued, killed before dispatch, and failed to dispatch.
- Queue subscriptions paused and resumed when Workers run out of capacity.
- In Enterprise Edition, reserved and shared capacity per worker group.

See the [Worker Controller metrics](../../../10.administrator-guide/prometheus-metrics/index.md#kestra-worker-controller-metrics) for the full list, and [controller metrics](../../../07.enterprise/04.scalability/worker-group/index.md#controller-metrics) for their tags.

A steadily growing count of re-queued jobs, with paused subscriptions, means the Workers serving that queue are at capacity. Add Workers, or raise their thread count.

A rising `controller.job.resubmitted.total` means jobs were sent on Worker streams that stopped delivering. Check the load balancers and proxies between your Workers and Worker Controllers. See [Jobs that never reach a Worker](#jobs-that-never-reach-a-worker).

If a queue record blocks the Worker Controller, start it with `--ignore-queue-records` to skip that record while you investigate. See the [kill switch CLI flags](../../../07.enterprise/05.instance/kill-switch/index.md#cli-compatibility).
