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

## Worker Queues

A Worker Queue is a routing lane with a stable id and a set of tags. Multiple Worker Groups may subscribe to the same queue. Removing a group's subscription never deletes the queue — queues exist independently.

Two ids are reserved and never created manually:
- `default` — the global default queue; receives tasks with no `workerSelector`
- `system` — the in-process system worker

Worker Queue ids must follow RFC 1123 label format: lowercase alphanumerics and hyphens, starting and ending with an alphanumeric character, max 63 characters.

### Creating Worker Queues

Create Worker Queues through the Instance administration UI, the API, or Terraform.

**Tenant scoping**: a Worker Queue can restrict which tenants may route tasks through it. An empty tenant list means unrestricted.

## Creating and managing Worker Groups

A Worker Group is identified by a stable id (RFC 1123 label), has a display name, and holds a list of queue subscriptions and registration tokens.

### Creating a Worker Group

Navigate to **Instance → Worker Groups → Add Worker Group**. Set an id, display name, and optional description. You can add queue subscriptions and generate registration tokens immediately, or configure them after creation.

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

Reserved capacity is a per-worker floor guarantee, not a fleet-wide quota. Each worker independently allocates `floor(threads × reservedPercent / 100)` slots to a subscription. Remaining slots form a shared pool available to all of that worker's subscriptions.

**Example**: a worker with 16 threads subscribing to two queues at 50% and 25% reserves 8 slots for queue A and 4 slots for queue B, with 4 slots in the shared pool.

### Interaction modes

- **STRICT** — idle reserved slots remain exclusive to this subscription and are never lent to other work
- **ELASTIC** — idle reserved slots may be lent to other `ELASTIC` subscriptions on the same worker when the subscription has spare capacity

In both modes, tasks also draw from the shared pool once reserved slots are busy. Lent slots are not preempted — a busy lender may temporarily dip below its floor until borrowed work completes.

Capacity reservations are live-configurable: updating a subscription's reserved percentage takes effect within seconds with no worker restarts required.

## Worker authentication

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

Configure each worker with the registration token for its target group:

```yaml
kestra:
  worker:
    name: gpu-pool-1    # optional display name
    auth:
      registration-token: "{{ token generated for the target group }}"
```

### Starting a worker for a group

Start the worker with the `--worker-group` flag and the auth configuration above:

```bash
kestra server worker --worker-group gpu
```

:::alert{type="info"}
Running workers as separate server components requires a distributed deployment. See [running Kestra with separated server components](../../../kestra-cli/kestra-server/index.md#kestra-with-server-components-in-different-services).
:::

## Using workerSelector in tasks

Add `workerSelector` to any task to route it to a matching Worker Queue. The `workerSelector` object has three properties:

| Property | Description | Default |
|---|---|---|
| `tags` | List of RFC 1123 labels (max 20) identifying the required Worker Queue | — |
| `match` | `ALL`: queue tags must include all selector tags. `ANY`: queue tags must include at least one selector tag | `ALL` |
| `fallback` | Behavior when no worker is available for the matched queue: `FAIL`, `WAIT`, `CANCEL`, or `IGNORE` | `FAIL` |

:::alert{type="warning"}
The default `fallback` in 2.0 is `FAIL`. If you upgraded from an earlier version where tasks waited by default, set `fallback: WAIT` on any tasks or in `pluginDefaults` to preserve the old behavior.
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

### Applying workerSelector with pluginDefaults

Use `pluginDefaults` to apply a worker selector to all tasks of a given plugin type without modifying each task individually:

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

pluginDefaults:
  - type: io.kestra.plugin.scripts.python
    values:
      workerSelector:
        tags: [gpu]
        fallback: WAIT
```

A default `workerSelector` can also be configured at the namespace or tenant level to apply across all tasks that do not declare their own selector.

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

For guidance on when to use Worker Groups versus Task Runners for compute-intensive scripting workloads, see [Task Runners vs Worker Groups](../../../../task-runners/03.task-runners-vs-worker-groups/index.md).

## Monitoring

The following metrics are published by each running controller and tagged with `worker_group` and `worker_queue`:

| Metric | Type | Description |
|---|---|---|
| `kestra.controller.capacity.subscription.allocated` | gauge | Reserved slots allocated to a queue subscription, aggregated across workers in the group |
| `kestra.controller.capacity.subscription.used` | gauge | Reserved slots currently in use |
| `kestra.controller.capacity.shared.allocated` | gauge | Shared (unreserved) slots allocated |
| `kestra.controller.capacity.shared.used` | gauge | Shared slots currently in use |
| `kestra.controller.workergroup.job.inflight` | gauge | Total in-flight jobs being processed by workers in the group |

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

Update your flows to replace `workerGroup.key` with `workerSelector.tags`. The group name in the old property corresponds to a tag on a Worker Queue in the new model.

:::alert{type="warning"}
The fallback default changed from `WAIT` to `FAIL`. Tasks that previously waited for an unavailable worker will now fail immediately unless you explicitly set `workerSelector.fallback: WAIT`.
:::
