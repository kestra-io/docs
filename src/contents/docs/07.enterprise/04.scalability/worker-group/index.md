---
title: "Worker Groups in Kestra Enterprise: Target Workers"
h1: Route Tasks to Specific Workers by Hardware or Region
description: Manage workloads with Kestra Worker Groups. Target specific workers for tasks based on hardware, region, or security requirements for optimized execution.
sidebarTitle: Worker Group
icon: /src/contents/docs/icons/admin.svg
editions: ["EE"]
version: ">= 2.0.0"
---

Worker Groups route tasks to the right machines in your fleet. A Worker Group is a named, token-authenticated pool of workers that subscribes to one or more Worker Queues — tag-based routing lanes that tasks declare requirements against. The result is flexible many-to-many routing: GPU machines and spot instances can serve the same queue, or a single group can cover multiple queues with per-queue capacity guarantees.

Worker Groups are an Enterprise Edition feature. In the open-source edition, all work runs in a single implicit default pool.

## Getting started

To set up Worker Groups end-to-end:

1. [Create a Worker Queue](#worker-queues) — define a routing lane with tags
2. [Create a Worker Group](#creating-and-managing-worker-groups) — create a pool and subscribe it to queues
3. [Generate a registration token](#generating-a-registration-token) — authenticate workers to the group
4. [Start a worker](#starting-a-worker-for-a-group) — connect with the token and controller endpoint
5. [Route tasks](#using-workerselector-in-tasks) — add `workerSelector` to any task

## How Worker Groups work

Three building blocks define the routing model:

| Building block | Role |
|---|---|
| **Worker** | A process that runs tasks; joins a group by presenting a registration token and locally enforces its capacity allocation |
| **Worker Group** | A named pool of workers that subscribes to queues and holds capacity reservation settings |
| **Worker Queue** | A routing lane identified by a tag set; tasks declare `workerSelector.tags` to target a queue |

The routing path flows from task requirements down to infrastructure:

1. A task declares `workerSelector.tags: [gpu, eu]`
2. Kestra finds the Worker Queue whose tags match
3. Kestra checks which Worker Groups subscribe to that queue
4. A worker from one of those groups picks up the task

**Developer perspective**: declare what a task needs using tags. No machine names, no group names.

**Operator perspective**: create queues with meaningful tags, subscribe groups to those queues, and set capacity guarantees per subscription.

## Using workerSelector in tasks

Add `workerSelector` to any task to route it to a matching Worker Queue. The `workerSelector` object has three properties:

| Property | Description | Default |
|---|---|---|
| `tags` | List of RFC 1123 labels (max 20) identifying the required Worker Queue | — |
| `match` | `ALL`: queue tags must include all selector tags. `ANY`: queue tags must include at least one selector tag | `ALL` |
| `fallback` | Behavior when no worker is available for the matched queue: `FAIL`, `WAIT`, `CANCEL`, or `IGNORE` | `FAIL` |

:::alert{type="warning"}
The default `fallback` in 2.0 is `FAIL`. If you upgraded from an earlier version where tasks waited by default, set `fallback: WAIT` directly on each task, or use a [Policy](../../02.governance/policies/index.md) with an `Add` rule to apply it across a namespace.
:::

```yaml
id: process_sensitive_data
namespace: company.team

tasks:
  - id: process
    type: io.kestra.plugin.scripts.python.Commands
    workerSelector:
      tags: [sensitive, eu]
      fallback: WAIT
    commands:
      - python process.py
```

Kestra routes the task to a Worker Queue whose tag set includes all declared tags (or any, when `match: ANY`). Any Worker Group subscribed to that queue may execute the task.

If `workerSelector` is absent or all tags resolve to null, the task routes to the default queue.

### Fallback options

| Value | Behavior |
|---|---|
| `FAIL` | Fail the task run immediately if no worker is available (default) |
| `WAIT` | Hold the task in `CREATED` state until a worker becomes available |
| `CANCEL` | Cancel the task gracefully; the execution is marked `KILLED` |
| `IGNORE` | Drop the tag requirement and route to the default Worker Queue instead |

`IGNORE` is useful when the target infrastructure is optional — the task proceeds on any available worker rather than failing when the specialized pool is unavailable.

`fallback` can only be set when `tags` is non-empty.

:::alert{type="warning"}
`fallback` only applies when a matching Worker Queue exists but has no live worker right now. If no queue matches the tags at all, the task fails immediately regardless of the `fallback` value — that is a configuration error, not a capacity gap.
:::

### Dynamic routing

Use Pebble expressions to set tags at runtime:

```yaml
inputs:
  - id: region
    type: STRING
    defaults: eu

tasks:
  - id: process
    type: io.kestra.plugin.scripts.python.Commands
    workerSelector:
      tags:
        - "{{ inputs.region }}"
        - sensitive
      fallback: WAIT
    commands:
      - python process.py
```

When an expression resolves to null or a blank string, that tag is omitted from the selector. If all tags resolve to null, the task routes to the default queue.

### Namespace and tenant-level routing defaults

Instead of adding `workerSelector` to every task, set a default selector at the namespace or tenant level. Kestra resolves the selector most-specific-first — task, then flow, then the nearest namespace ancestor, then the tenant — and stops at the first level that declares one.

Set a namespace-level default in the namespace settings:

```yaml
workerSelector:
  tags: [eu]
  fallback: WAIT
```

Every task in that namespace (and its child namespaces, unless overridden closer) inherits this selector automatically. Any selector closer to the task — on the task itself or the flow — wins over the namespace or tenant default.

This is the recommended approach when an entire namespace or team should always run on a specific fleet — it keeps flow YAML clean and makes routing changes a single admin update rather than a find-and-replace across all flows.

### Applying workerSelector with Policies

Use a [Policy](../../02.governance/policies/index.md) to route all tasks of a given plugin type to a specific Worker Queue without modifying each task individually:

```yaml
id: gpu-worker-routing
description: "Route all Python tasks to GPU workers."
enforcement: ACTIVE
rules:
  - type: io.kestra.plugin.ee.rules.Add
    on: PLUGIN
    where:
      - field: type
        operator: STARTS_WITH
        value: io.kestra.plugin.scripts.python
    values:
      workerSelector:
        tags: [gpu]
        fallback: WAIT
```

With this Policy applied to the namespace, flows need no per-task configuration:

```yaml
id: ml_pipeline
namespace: company.team

tasks:
  - id: train
    type: io.kestra.plugin.scripts.python.Commands
    commands:
      - python train.py

  - id: evaluate
    type: io.kestra.plugin.scripts.python.Commands
    commands:
      - python eval.py
```

## Worker Queues

A Worker Queue is a routing lane with a stable id and a set of tags. Multiple Worker Groups may subscribe to the same queue. Removing a group's subscription never deletes the queue — queues exist independently.

Two ids are reserved and never created manually:
- `default` — the global default queue; receives tasks with no `workerSelector`
- `system` — the in-process system worker

Worker Queue ids must follow RFC 1123 label format: lowercase alphanumerics and hyphens, starting and ending with an alphanumeric character, max 63 characters.

### Creating Worker Queues

Navigate to **Settings → Super Admin → Infrastructure → Worker Queues** and click **Create**. You can also create Worker Queues via the API or Terraform.

**Tenant scoping**: a Worker Queue can restrict which tenants may route tasks through it. An empty tenant list means unrestricted.

## Creating and managing Worker Groups

A Worker Group is identified by a stable id (RFC 1123 label), has a display name, and holds a list of queue subscriptions and registration tokens.

### Creating a Worker Group

Navigate to **Settings → Super Admin → Infrastructure → Worker Groups** and click **Add Worker Group**. Set an id, display name, and optional description. You can add queue subscriptions and generate registration tokens immediately, or configure them after creation.

Worker Group ids must follow RFC 1123 label format.

### The default group

One group always exists and cannot be deleted: the `default` group. It subscribes to the `default` queue and receives all tasks that have no `workerSelector`. Workers that start without a registration token join the default group automatically.

:::alert{type="warning"}
Keep at least one worker running in the default group to ensure tasks without a `workerSelector` always have somewhere to execute.
:::

### Queue subscriptions

A subscription connects a Worker Group to a Worker Queue. Each subscription specifies:

- **Target queue id** — which Worker Queue this group's workers will serve
- **Reserved capacity percentage** (optional) — a per-worker floor guarantee, 1–100
- **Interaction mode** — `STRICT` or `ELASTIC` (see [Capacity reservation](#capacity-reservation))

A group may subscribe to multiple queues. The sum of reserved percentages across a worker's subscriptions must not exceed 100.

Manage subscriptions through the UI or the subscriptions API:

| Operation | Endpoint |
|---|---|
| Add subscription | `POST /api/v1/instance/worker-groups/{id}/subscriptions` |
| Update reservation | `PATCH /api/v1/instance/worker-groups/{id}/subscriptions/{workerQueueId}` |
| Remove subscription | `DELETE /api/v1/instance/worker-groups/{id}/subscriptions/{workerQueueId}` |

## Capacity reservation

Reserved capacity is a per-worker floor guarantee, not a fleet-wide quota. Remaining slots beyond reserved percentages form a shared pool available to all of that worker's subscriptions.

**Example**: a worker with 16 slots subscribing to two queues at 50% and 25% reserves 8 slots for queue A and 4 slots for queue B, with 4 slots in the shared pool.

### Interaction modes

- **STRICT** — idle reserved slots remain exclusive to this subscription and are never lent to other work
- **ELASTIC** — idle reserved slots may be lent to other `ELASTIC` subscriptions on the same worker when the subscription has spare capacity

In both modes, tasks also draw from the shared pool once reserved slots are busy. Lent slots are not preempted — a busy lender may temporarily dip below its floor until borrowed work completes.

Capacity reservations are live-configurable: updating a subscription's reserved percentage takes effect within seconds with no worker restarts required.

## Worker authentication

:::alert{type="info"}
Worker authentication must be enabled server-side before registration tokens have any effect. A worker configured with a token but connecting to an instance where auth is disabled will join the default group instead.
:::

Workers join a group by presenting a registration token generated for that group. The token is stored as a hash and shown only once at creation — copy it immediately.

On first connect, the worker exchanges the registration token for a short-lived access token and a rotating refresh token. The access token is refreshed automatically before it expires. Revoking or deleting a token immediately invalidates credentials for any workers that registered with it; those workers fail closed once their current access token expires.

### Generating a registration token

In the Worker Groups UI, select a group and generate a token from the **Tokens** tab. Alternatively, use the API:

| Operation | Endpoint |
|---|---|
| Generate token | `POST /api/v1/instance/worker-groups/{id}/tokens` |
| Revoke token | `POST /api/v1/instance/worker-groups/{id}/tokens/{tokenId}/revoke` |
| Delete token | `DELETE /api/v1/instance/worker-groups/{id}/tokens/{tokenId}` |

### Server-side configuration

Enable worker authentication on your webserver or standalone Kestra instance:

```yaml
kestra:
  ee:
    worker:
      auth:
        enabled: true
        jwt-signing-key: "{{ a strong shared secret, >= 32 bytes }}"
        access-token-lifetime: PT5M    # optional, default PT5M
        refresh-token-lifetime: P7D    # optional, default P7D
```

### Worker-side configuration

Each worker needs two things to join a group: a registration token that identifies the group, and a controller endpoint that tells the worker where to connect. Both are required — a worker started with only the token will try `localhost` and fail.

```yaml
kestra:
  worker:
    name: gpu-pool-1                       # optional display name
    auth:
      registration-token: "{{ token generated for the target group }}"
      credentials-path: /var/kestra/worker/.auth/worker-credentials.json  # default: /tmp/kestra/worker/.auth/...
      refresh-buffer: PT60S               # how early to refresh the access token before it expires
    controllers:
      type: STATIC
      static:
        endpoints:
          - host: kestra-controller.internal
            port: 50051
```

:::alert{type="warning"}
The endpoint `host` and `port` must be separate YAML keys. A single `host:port` string fails with `Static configuration requires at least one endpoint`.
:::

#### Controller discovery strategies

`type: STATIC` is the default and suitable for most bare-metal and Docker deployments. Two other strategies are available:

| Type | When to use |
|---|---|
| `STATIC` | Fixed controller addresses — explicit `host`/`port` list |
| `DNS` | Kubernetes or any environment where controllers are reachable by a stable DNS name; resolves SRV or A records on an interval |
| `STORAGE` | Dynamic, cross-cloud deployments; controllers self-register in internal storage and workers list the registry |

For Kubernetes, use `type: DNS` with a service hostname:

```yaml
kestra:
  worker:
    controllers:
      type: DNS
      dns:
        hostname: kestra-controller.kestra.svc.cluster.local
        record-type: SRV      # or A if no SRV records
        default-port: 50051   # used with A records only
        refresh-interval: PT30S
```

For Helm deployments, controller discovery is preconfigured — see the [Helm gRPC and Worker-Controller migration guide](../../../11.migration-guide/v2.0.0/helm-grpc-worker-controller/index.md). For bare-metal or Docker with components on separate hosts, see [running Kestra with separated server components](../../../kestra-cli/kestra-server/index.md#kestra-with-server-components-in-different-services).

### Starting a worker for a group

With both the registration token and controller endpoint configured, start the worker normally:

```bash
kestra server worker
```

No additional CLI flags are needed. The registration token in `kestra.worker.auth.registration-token` identifies which group the worker joins at connection time.

## Transport security (TLS)

By default, gRPC traffic between workers and the controller is unencrypted. For production deployments, enable TLS on both sides.

### Server-side TLS

Add TLS config to the controller (or standalone) instance:

```yaml
kestra:
  grpc:
    tls:
      enabled: true
      key-store:
        path: /etc/kestra/tls/controller-keystore.p12
        password: "{{ secret('TLS_KEYSTORE_PASSWORD') }}"
      # Required when client-auth is OPTIONAL or REQUIRE
      trust-store:
        path: /etc/kestra/tls/ca-truststore.p12
        password: "{{ secret('TLS_TRUSTSTORE_PASSWORD') }}"
      client-auth: NONE    # NONE | OPTIONAL | REQUIRE (mTLS)
```

### Worker-side TLS

Add matching TLS config to each worker:

```yaml
kestra:
  grpc:
    tls:
      enabled: true
      # Required only for mTLS (client-auth: REQUIRE on the server)
      key-store:
        path: /etc/kestra/tls/worker-keystore.p12
        password: "{{ secret('TLS_KEYSTORE_PASSWORD') }}"
      # Optional — falls back to the system trust store
      trust-store:
        path: /etc/kestra/tls/ca-truststore.p12
        password: "{{ secret('TLS_TRUSTSTORE_PASSWORD') }}"
```

:::alert{type="info"}
When using `type: STATIC` discovery with TLS, the synthetic gRPC authority derived from the endpoint list may not match the certificate's SANs. Add `authority-override` to the worker config to specify the hostname the certificate was issued for:

```yaml
kestra:
  grpc:
    tls:
      enabled: true
      authority-override: kestra-controller
```

Under `type: DNS` discovery, the authority is derived from the DNS hostname automatically and no override is needed.
:::

## Use cases

### Hardware affinity

Dedicate workers with GPUs, high-memory configurations, or OS-specific environments to tasks that need them. Developers declare the requirement via tags; operators manage the physical mapping independently.

```yaml
workerSelector:
  tags: [gpu, cuda-12]
```

### Multi-tenant isolation

Give each tenant a dedicated Worker Queue with a reserved capacity percentage to prevent noisy-neighbor effects. An additional ELASTIC subscription to a shared burst queue lets idle capacity absorb traffic spikes while the per-tenant floor stays guaranteed.

### Regulated and air-gapped environments

Workers in restricted networks connect outbound-only, presenting a registration token to authenticate. No inbound firewall rules are required. Revoking a token immediately stops those workers from receiving new work, giving operators a fast, clean isolation path.

### Spiky workloads

Use a fixed worker pool with STRICT reservations to handle baseline load, and a spot pool with ELASTIC subscriptions that claims shared-pool capacity during spikes. The ELASTIC pool scales out and in without changing the baseline pool's guarantees.

### Priority lanes

Split capacity across multiple queues with reserved percentages to guarantee throughput for high-priority work:

```yaml
# Three priority queues — critical: 50%, standard: 25%, batch: 25%
workerSelector:
  tags: [critical]    # or [standard], or [batch]
```

Critical work always has guaranteed slots regardless of the volume of batch jobs in the queue.

### Day/night capacity shifting

Reserved percentages are live-configurable via the API. Changes propagate to all workers within seconds, with no restarts required. Shift capacity toward batch workloads during off-peak hours and back to interactive workloads during business hours without touching any worker process.

### Zero-downtime worker upgrades

Run two Worker Groups subscribed to the same queues simultaneously. Reduce the old group's reservation to 0% to drain it of new work, bring up the new group, verify it is healthy, then delete the old group. At no point does the queue go unserved.

For guidance on when to use Worker Groups versus Task Runners for compute-intensive scripting workloads, see [Task Runners vs Worker Groups](../../../task-runners/03.task-runners-vs-worker-groups/index.md).

## Worker shutdown and task continuity

When a worker process stops — whether from a deployment, a crash, or a manual restart — any tasks it was running may be interrupted. The `worker-task-restart-strategy` setting controls what happens to those tasks cluster-wide:

| Strategy | Behavior |
|---|---|
| `AFTER_TERMINATION_GRACE_PERIOD` | The worker stops accepting new work and waits up to the grace period for in-flight tasks to finish; any tasks still running at that point are re-dispatched to another worker (default) |
| `IMMEDIATELY` | Interrupted tasks are re-dispatched immediately to another worker without waiting |
| `NEVER` | Interrupted tasks fail permanently and are not re-dispatched |

Configure these in `application.yml` on each worker:

```yaml
kestra:
  server:
    termination-grace-period: 5m
    worker-task-restart-strategy: AFTER_TERMINATION_GRACE_PERIOD
```

During the grace period, the worker stops accepting new jobs but lets running tasks finish. If the grace period elapses before all tasks complete, the worker force-terminates and the restart strategy decides the outcome for the remaining tasks.

:::alert{type="info"}
`AFTER_TERMINATION_GRACE_PERIOD` is the recommended setting for production deployments. It gives tasks time to finish cleanly while still guaranteeing that a stalled worker does not block the cluster indefinitely.
:::

## Monitoring

Metrics scoped to a group carry a `worker_group` tag; metrics scoped to a queue also carry a `worker_queue` tag. The configurable metrics prefix (default `kestra`) is prepended before export.

### Controller metrics

Published by the controller process — the server-side view of fleet capacity and dispatch activity:

| Metric | Type | Tags | Description |
|---|---|---|---|
| `controller.worker.active` | gauge | `worker_group`, `worker_queue` | Workers currently subscribed to a queue |
| `controller.worker.active.all` | gauge | — | Total workers connected to this controller |
| `controller.permits.available` | gauge | `worker_group`, `worker_queue` | Remaining advertised capacity across subscribed workers |
| `controller.permits.available.all` | gauge | — | Remaining capacity across all connected workers |
| `controller.job.inflight` | gauge | `worker_queue` | In-flight jobs for a queue |
| `controller.worker.group.job.inflight` | gauge | `worker_group` | In-flight jobs across workers in a group |
| `controller.capacity.subscription.allocated` | gauge | `worker_group`, `worker_queue` | Reserved slots allocated to a queue subscription |
| `controller.capacity.subscription.used` | gauge | `worker_group`, `worker_queue` | Reserved slots currently in use |
| `controller.capacity.shared.allocated` | gauge | `worker_group` | Shared (unreserved) slots allocated |
| `controller.capacity.shared.used` | gauge | `worker_group` | Shared slots currently in use |
| `controller.job.dispatched.total` | counter | `worker_queue` | Total jobs dispatched to workers |
| `controller.job.requeued.total` | counter | `worker_queue` | Jobs re-queued because no worker had capacity |
| `controller.job.killed.total` | counter | `worker_queue` | Jobs short-circuited by the pre-dispatch kill check |
| `controller.job.dispatch.failed.total` | counter | `worker_queue` | Dispatch attempts that failed on send |
| `controller.worker.registered.total` | counter | — | Worker-queue subscription registrations |
| `controller.worker.unregistered.total` | counter | — | Worker-queue subscription removals |
| `controller.subscription.paused.total` | counter | — | Queue subscription pause transitions |
| `controller.subscription.resumed.total` | counter | — | Queue subscription resume transitions |

### Worker metrics

Published by each worker process — the worker-side view of capacity and throughput:

| Metric | Type | Description |
|---|---|---|
| `worker.job.thread` | gauge | Configured thread count (maximum concurrent jobs) |
| `worker.max.concurrency` | gauge | Maximum in-flight capacity: threads + buffered jobs |
| `worker.running.count` | gauge | Tasks currently executing |
| `worker.pending.count` | gauge | Tasks waiting for a free thread slot |
| `worker.queue.size` | gauge | Items currently held in a buffer (job, result, log, or metric) |
| `worker.queue.remaining.capacity` | gauge | Free slots in the inbound job buffer — equals the worker's advertised permit count |
| `worker.queued.duration` | timer | Time a task spent waiting before a thread was available |
| `worker.started.count` | counter | Total tasks started |
| `worker.ended.count` | counter | Total tasks completed (any terminal state) |
| `worker.ended.duration` | timer | Task run duration as measured by the worker |
| `worker.timeout.count` | counter | Tasks that exceeded their configured timeout |
| `worker.killed.count` | counter | Kill events received from the controller |
| `worker.queue.enqueued` | counter | Total items put into a buffer |
| `worker.queue.dequeued` | counter | Total items drained from a buffer |
| `worker.trigger.running.count` | gauge | Trigger evaluations currently in progress |
| `worker.trigger.started.count` | counter | Total trigger evaluations started |
| `worker.trigger.ended.count` | counter | Total trigger evaluations completed |
| `worker.trigger.error.count` | counter | Trigger evaluations that failed |
| `worker.trigger.execution.count` | counter | Executions produced by triggers on this worker |
| `worker.trigger.duration` | timer | Trigger evaluation duration |

When `worker.running.count` consistently equals `worker.job.thread` and `worker.pending.count` is non-zero, that worker is fully saturated — scale by adding more workers to the group or increasing the thread count. When `worker.queue.remaining.capacity` on the `job` buffer approaches zero, the worker's local inbound buffer is full.

The live capacity snapshot is also available via the API:

```
GET /api/v1/instance/worker-groups/{id}/capacity
GET /api/v1/instance/worker-groups/{id}/workers
```

## Migrating from earlier versions

In Kestra 2.0, the task-level routing property changed from targeting a group by name to declaring requirements via tags:

| Before 2.0 | 2.0+ |
|---|---|
| `workerGroup.key: gpu` | `workerSelector.tags: [gpu]` |
| Routes directly to a named group | Routes to a Worker Queue by tags; any subscribed group may serve the task |
| `workerGroup.fallback` — defaults to `WAIT` | `workerSelector.fallback` — defaults to `FAIL` |
| No `match` strategy | `workerSelector.match: ALL` or `ANY` |
| No capacity control per queue | Reserved percentage per subscription, STRICT or ELASTIC mode |
| No worker authentication | Registration token-based authentication with rotating credentials |

`workerGroup` is not recognized in 2.0 — flows using it will fail validation and cannot be saved. Update your flows to replace `workerGroup.key` with `workerSelector.tags`. The group name in the old property corresponds to a tag on a Worker Queue in the new model.

:::alert{type="warning"}
The fallback default changed from `WAIT` to `FAIL`. Tasks that previously waited for an unavailable worker will now fail immediately unless you explicitly set `workerSelector.fallback: WAIT`.
:::
