---
title: "Worker Groups in Kestra Enterprise: Target Workers"
h1: Route Tasks to Specific Workers by Hardware or Region
description: Manage workloads with Kestra Worker Groups. Target specific workers for tasks based on hardware, region, or security requirements for optimized execution.
sidebarTitle: Worker Group
icon: /src/contents/docs/icons/admin.svg
editions: ["EE"]
version: ">= 2.0.0"
docId: worker-groups
---

Worker Groups route tasks to the right machines in your fleet. A Worker Group is a named, token-authenticated pool of workers that subscribes to one or more Worker Queues — tag-based routing lanes that tasks declare requirements against. The result is flexible many-to-many routing: GPU machines and spot instances can serve the same queue, or a single group can cover multiple queues with per-queue capacity guarantees.

Worker Groups are an Enterprise Edition feature. In the open-source edition, all work runs in a single implicit default pool.

## Getting started

The setup sequence is: create a Worker Queue, create a Worker Group and subscribe it to the queue, generate a registration token, start a worker with the token and controller endpoint, then add `workerSelector` to any task. For IaC and Helm deployments, see [Declarative configuration](#declarative-configuration) to provision the full topology at startup without runtime API calls.

## How Worker Groups work

Three building blocks define the routing model:

| Building block | Role |
|---|---|
| **Worker** | A process that runs tasks; joins a group by presenting a registration token. The Worker Controller enforces its capacity allocation |
| **Worker Group** | A named pool of workers that subscribes to queues and holds capacity reservation settings |
| **Worker Queue** | A routing lane with an id and a set of tags; tasks declare `workerSelector.tags` to target a queue |

The routing path flows from task requirements down to infrastructure:

1. A task declares `workerSelector.tags: [gpu, eu]`
2. Kestra finds the Worker Queues whose tags match and picks the best match that has a connected worker
3. Kestra checks which Worker Groups subscribe to that queue
4. A worker from one of those groups picks up the task

**Developer view**: tasks declare requirements via tags. No machine names, no group names.

**Operator view**: operators create queues with matching tags, subscribe worker groups, and set capacity guarantees per subscription.

## Using workerSelector in tasks

Add `workerSelector` to any task to route it to a matching Worker Queue. The `workerSelector` object has three properties:

| Property | Description | Default |
|---|---|---|
| `tags` | List of RFC 1123 labels (max 20, each up to 64 characters) identifying the required Worker Queue | — |
| `match` | `ALL`: queue tags must include all selector tags. `ANY`: queue tags must include at least one selector tag | `ALL` |
| `fallback` | Behavior when no worker is connected to any matching queue: `FAIL`, `WAIT`, `CANCEL`, or `IGNORE` | `FAIL` |

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

Kestra routes the task to a Worker Queue whose tag set includes all declared tags (or at least one, when `match: ANY`). Any Worker Group subscribed to that queue may execute the task.

If no level declares a `workerSelector` with tags, the task routes to the default queue. An empty `tags` list counts as no selector, so resolution continues to the next level.

### When several queues match

More than one Worker Queue can match the same selector. Kestra ranks the matching queues and sends the task to the first one in that ranking that has at least one connected worker:

1. Queues restricted to the task's tenant rank before unrestricted queues.
2. With `match: ALL`, the queue with the fewest tags beyond the requested ones ranks first. With `match: ANY`, the queue sharing the most tags ranks first, then the queue with the fewest tags.
3. Remaining ties are broken alphabetically.

`fallback` applies only when none of the matching queues has a connected worker. Busy workers do not trigger `fallback`: when all connected workers are at capacity, the task waits in the queue for a free slot.

### Fallback options

| Value | Behavior |
|---|---|
| `FAIL` | Fail the task run immediately and log an error (default) |
| `WAIT` | Send the task to the matched queue anyway, where it waits as `SUBMITTED` until a worker connects. An info log records the wait |
| `CANCEL` | Set the task run to `CANCELLED` and log the reason |
| `IGNORE` | Drop the tag requirement and route to the default Worker Queue instead, with no log |

`IGNORE` is useful when the target infrastructure is optional. Instead of failing when the specialized pool is unavailable, the task runs on the default Worker Queue, so only groups subscribed to the `default` queue can pick it up.

`fallback` and `match` can only be set when `tags` is non-empty.

:::alert{type="warning"}
`fallback` only applies when a matching Worker Queue exists but has no connected worker right now. If no queue matches the tags at all, the task fails immediately regardless of the `fallback` value. That is a configuration error, not a capacity gap.
:::

Triggers that run on workers follow the same rules with one difference: when no queue matches, or the fallback is `FAIL` or `CANCEL`, Kestra skips that trigger evaluation and logs the reason instead of failing anything. With `WAIT`, the trigger evaluation is sent to the matched queue.

### Flow, namespace, and tenant-level routing defaults

Instead of adding `workerSelector` to every task, set a default selector at a higher level. Kestra resolves the selector most-specific-first: task, then flow, then the nearest namespace ancestor, then the tenant. It stops at the first level that declares tags. Triggers resolve the same way, starting from the trigger's own `workerSelector`.

Set a flow-level default with `workerSelector` at the root of the flow:

```yaml
id: eu_pipeline
namespace: company.team

workerSelector:
  tags: [eu]
  fallback: WAIT

tasks:
  - id: extract
    type: io.kestra.plugin.core.log.Log
    message: Runs on a worker serving the eu queue
```

Set a namespace-level default from the namespace **Details** tab, and a tenant-level default from the tenant's settings (**Instance Owner → Tenants → All tenants**, then the settings icon in the tenant's row). Both use a **Default Worker Selector** form with the same tags, match, and fallback fields. In the API and Terraform, the field is `defaultWorkerSelector`:

```yaml
defaultWorkerSelector:
  tags: [eu]
  fallback: WAIT
```

Every task in that namespace (and its child namespaces, unless overridden closer) inherits this selector. Any selector closer to the task, on the task itself or the flow, wins over the namespace or tenant default.

### Applying workerSelector with Policies

A [Policy](../../02.governance/policies/index.md) routes all tasks of a given plugin type to a specific Worker Queue without per-task configuration:

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

The `Add` rule fills in values only where the task does not already set them. A task that declares its own `workerSelector.tags` keeps them and only picks up a missing `fallback`. Set `override: true` on the rule to replace the task's values instead. Because the Policy writes the selector onto the task, it takes precedence over flow, namespace, and tenant defaults.

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

A Worker Queue is a routing lane with a stable id and a set of at least one tag. Multiple Worker Groups may subscribe to the same queue. Removing a group's subscription never deletes the queue, because queues exist independently. A queue cannot be deleted while any group still subscribes to it: the API returns `409`.

Two ids are reserved and never created manually:
- `default` — the global default queue; receives tasks with no `workerSelector`
- `system` — the in-process system worker

Worker Queue ids must follow RFC 1123 label format: lowercase alphanumerics and hyphens, starting and ending with an alphanumeric character, max 64 characters.

### Creating Worker Queues

Worker Queues are managed under **Instance Owner → Infrastructure → Worker Queues**. Creation is also available via the API and Terraform.

**Tenant scoping**: a Worker Queue can restrict which tenants may route tasks through it. An empty tenant list means unrestricted. For tasks from any other tenant, a restricted queue does not count as a match. If it is the only queue with matching tags, those tasks fail as if no queue matched.

## Creating and managing Worker Groups

A Worker Group is identified by a stable id (RFC 1123 label), has a display name, and holds a list of queue subscriptions and registration tokens.

### Creating a Worker Group

Worker Groups are managed under **Instance Owner → Infrastructure → Worker Groups**. Each group requires an id, display name, and optional description; queue subscriptions and registration tokens are configurable at creation or after.

Worker Group ids must follow RFC 1123 label format.

### The default group

One group always exists and cannot be deleted: the `default` group. It always subscribes to the `default` queue, which receives every task without a `workerSelector` and every task rerouted by `fallback: IGNORE`. Other groups can subscribe to the `default` queue too.

Group membership comes from the registration token, so it depends on [worker authentication](#worker-authentication):

- When worker authentication is disabled, every worker joins the default group. Other groups and their tokens have no effect, and a named queue is served only if the `default` group subscribes to it.
- When it is enabled, a worker that starts without a registration token is rejected.

:::alert{type="warning"}
Keep at least one worker running in the default group to ensure tasks without a `workerSelector` always have somewhere to execute.
:::

### Queue subscriptions

A subscription connects a Worker Group to a Worker Queue. Each subscription specifies:

- **Target queue id**: which Worker Queue this group's workers serve
- **Reserved capacity percentage** (optional): a per-worker floor guarantee from 1 to 100. In the API, `reservedPercent: -1` means no reservation
- **Interaction mode**: `STRICT` (default) or `ELASTIC` (see [Capacity reservation](#capacity-reservation))

A group may subscribe to multiple queues. The sum of reserved percentages across a group's subscriptions must not exceed 100.

Manage subscriptions through the UI or the subscriptions API:

| Operation | Endpoint |
|---|---|
| Add subscription | `POST /api/v1/instance/worker-groups/{id}/subscriptions` |
| Update reservation | `PATCH /api/v1/instance/worker-groups/{id}/subscriptions/{workerQueueId}` |
| Remove subscription | `DELETE /api/v1/instance/worker-groups/{id}/subscriptions/{workerQueueId}` |

The `PATCH` endpoint changes only `reservedPercent` and keeps the subscription's mode. To change the mode, update the group with `PUT /api/v1/instance/worker-groups/{id}` and the full subscription list, or remove the subscription and add it again.

## Capacity reservation

Reserved capacity is a per-worker floor guarantee, not a fleet-wide quota. The Worker Controller enforces it for each connected worker. Remaining slots beyond reserved percentages form a shared pool available to all of that worker's subscriptions.

**Example**: a worker with 16 slots subscribing to two queues at 50% and 25% reserves 8 slots for queue A and 4 slots for queue B, with 4 slots in the shared pool.

Reserved slots round down, and the remainder goes to the shared pool. On small workers, a low percentage can reserve no slots at all: 25% of a 2-slot worker reserves 0 slots.

### Interaction modes

- **STRICT**: idle reserved slots remain exclusive to this subscription and are never lent to other work
- **ELASTIC**: idle reserved slots may be lent to any other subscription on the same worker, whatever that subscription's mode

In both modes, tasks also draw from the shared pool once reserved slots are busy. Lent slots are not preempted — a busy lender may temporarily dip below its floor until borrowed work completes.

Capacity reservations are live-configurable: updating a subscription's reserved percentage takes effect within seconds with no worker restarts required.

## Worker authentication

Workers join a group by presenting a registration token generated for that group. The token is stored as a hash and shown only once at creation, so copy it immediately. One token can register any number of workers, and you can give it an expiry date when you generate it.

On first connect, the worker exchanges the registration token for a short-lived access token and a rotating refresh token. The access token is refreshed automatically before it expires. The worker stores the refresh token in the file at `credentials-path`. If that file is missing or rejected, for example after a restart with an ephemeral temp directory, the worker registers again with its registration token. Keep the registration token configured on the worker even after the first registration.

Revoking or deleting a token, or force-deleting its Worker Group, disconnects the workers that registered with it immediately. They cannot reconnect until they are restarted with a new token.

### Generating a registration token

In the Worker Groups UI, select a group and generate a token from the **Tokens** tab. Alternatively, use the API with an Instance Owner account:

| Operation | Endpoint |
|---|---|
| Generate token | `POST /api/v1/instance/worker-groups/{id}/tokens` |
| Revoke token | `POST /api/v1/instance/worker-groups/{id}/tokens/{tokenId}/revoke` |
| Delete token | `DELETE /api/v1/instance/worker-groups/{id}/tokens/{tokenId}` |

### Where each setting goes

Worker authentication is off by default. The settings use two prefixes that are easy to confuse:

- `kestra.ee.worker.auth` turns authentication on and controls how Kestra signs worker tokens.
- `kestra.worker.auth` holds the credentials of one worker.

In a distributed deployment, each server role needs a different subset:

| Setting | Webserver, executor, scheduler, Worker Controller | Worker |
|---|---|---|
| `kestra.ee.worker.auth.enabled: true` | Required | Required |
| `kestra.ee.worker.auth.jwt-signing-key` | Optional. Same value on every server | Not used |
| `kestra.ee.worker.auth.access-token-lifetime`, `refresh-token-lifetime` | Optional | Not used |
| `kestra.worker.auth.registration-token` | Not used | Required |
| `kestra.worker.controllers` | Not used | Required, unless the controller runs on the same host as the worker |

A standalone server runs every role in one process, so it needs only `kestra.ee.worker.auth.enabled: true`. Its embedded worker needs no registration token. If authentication is enabled and the `default` group has no tokens yet, the standalone server generates one at startup, uses it for the embedded worker, and prints it once in the logs. To register a token of your own instead, set `kestra.worker.auth.registration-token` on the standalone server.

:::alert{type="warning"}
Set `kestra.ee.worker.auth.enabled: true` on the workers too. Without it, the worker ignores its registration token, and a controller with authentication enabled rejects the connection with `UNAUTHENTICATED: Missing or invalid authorization header`.
:::

### Server-side configuration

Add this block to the configuration of every server except workers, including any dedicated Worker Controller:

```yaml
kestra:
  ee:
    worker:
      auth:
        enabled: true
        jwt-signing-key: "{{ a strong shared secret, >= 32 bytes }}"  # optional, defaults to kestra.encryption.secret-key
        access-token-lifetime: PT5M    # optional, default PT5M
        refresh-token-lifetime: P7D    # optional, default P7D
```

If you set `jwt-signing-key`, use the same value on every server. If you leave it out, every server must share the same `kestra.encryption.secret-key`. Either way, the key must be at least 32 bytes long, or the server fails to start. If controllers use different keys, workers fail with `Invalid or expired access token`.

### Worker-side configuration

Each worker needs three things to join a group:

- `kestra.ee.worker.auth.enabled: true`, the same switch as on the other servers
- a registration token that identifies the group
- a controller endpoint that tells the worker where to connect

A worker started without a controller endpoint tries `localhost` and fails. Workers do not sign tokens, so they need no `jwt-signing-key`.

```yaml
kestra:
  ee:
    worker:
      auth:
        enabled: true                      # required on workers too
  worker:
    name: gpu-pool-1                       # optional display name
    auth:
      registration-token: "{{ token generated for the target group }}"
      credentials-path: /var/kestra/worker/.auth/worker-credentials.json  # default: ${java.io.tmpdir}/kestra/worker/auth/worker-credentials.json; use persistent storage to skip re-registration on restart
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
| `DNS` | Kubernetes or any environment where controllers are reachable by a DNS name; the worker connects to every A and AAAA record the name resolves to |
| `STORAGE` | Dynamic, cross-cloud deployments; controllers self-register in internal storage and workers list the registry |

With `type: DNS`, set the hostname and the port used for every resolved address:

```yaml
kestra:
  worker:
    controllers:
      type: DNS
      dns:
        hostname: kestra-controller-headless.kestra.svc.cluster.local
        default-port: 50051   # port used for every resolved address
```

A regular Kubernetes `ClusterIP` Service resolves to a single virtual IP, so `STATIC` and `DNS` behave the same against it. To spread workers across several controller pods, point `DNS` at a headless Service (`clusterIP: None`), which resolves to each pod's address.

The Helm chart does not configure controller discovery for you. Only a standalone deployment works without it, because its embedded worker connects to `localhost`. For detached workers in Helm, see the [Helm gRPC and Worker-Controller migration guide](../../../11.migration-guide/v2.0.0/helm-grpc-worker-controller/index.md). For bare-metal or Docker with components on separate hosts, see [running Kestra with separated server components](../../../kestra-cli/kestra-server/index.md#kestra-with-server-components-in-different-services).

### Starting a worker for a group

With both the registration token and controller endpoint configured, start the worker normally:

```bash
kestra server worker
```

No additional CLI flags are needed. The registration token in `kestra.worker.auth.registration-token` identifies which group the worker joins at connection time.

:::alert{type="info"}
Workers never open a database connection. A worker ignores any `datasources` entries in its configuration.
:::

## Declarative configuration

The entire worker topology — queues, groups, subscriptions, and registration tokens — is declarable in `application.yml` under `kestra.ee.setup`. Kestra applies this configuration at startup, which enables a fully automated single-pass deployment with no runtime API calls.

```yaml
kestra:
  ee:
    setup:
      enabled: true

      worker-queues:
        - id: gpu
          tags: [gpu, linux]
          allowed-tenants: [acme]   # optional; empty = unrestricted
        - id: etl
          tags: [etl]

      worker-groups:
        - id: gpu-workers
          name: GPU workers
          registration-tokens:
            - name: bootstrap
              token-file: /var/run/secrets/kestra/gpu-workers-token
          subscriptions:
            - worker-queue-id: gpu
              reserved-percent: 70
              mode: ELASTIC         # optional; STRICT (default) or ELASTIC
            - worker-queue-id: etl
```

`name` is optional on groups and tokens: a group's name defaults to its id, and a token's name defaults to `bootstrap`.

A worker whose token is rejected at startup, for example because no server has applied the configuration yet, exits with an authentication error. It does not wait for the token to appear. When all services start at the same time, rely on a restart policy (such as Kubernetes restarting the pod) to bring the worker back once the configuration is applied, or start workers after at least one other Kestra server is running.

### Secret handling

Registration tokens must not appear as plaintext in a committed configuration file. Two options are available per token entry:

- **`token-file`**: path to a file containing the pre-generated token. Preferred in Kubernetes environments where Secrets mount as files. When the group does not exist yet, the file must exist and be non-empty at startup.
- **`token: "${ENV_VAR}"`**: environment variable placeholder resolved at startup. Simpler outside Kubernetes, but environment variables are readable from `/proc/<pid>/environ` and may appear in crash dumps.

Exactly one of the two is required. Use [`kestractl workers registration-tokens generate`](../../../kestra-cli/kestractl/index.md#kestractl-workers-registration-tokens-generate) to mint a token offline before deployment. The server CLI command `kestra workers registration-tokens generate`, which Kestra's error messages refer to, produces the same kind of token.

### Example: control plane and worker configuration

A distributed deployment needs two configuration files: one shared by every non-worker server, and one per Worker Group. The token is the same value in both places. The control plane registers it on the group, and the worker presents it to join that group.

The control plane file enables worker authentication and declares the topology. Use it for the webserver, executor, scheduler, and Worker Controller:

```yaml
# control-plane.yml
kestra:
  ee:
    worker:
      auth:
        enabled: true
    setup:
      enabled: true
      worker-queues:
        - id: gpu
          tags: [gpu]
      worker-groups:
        - id: gpu-workers
          name: GPU workers
          registration-tokens:
            - name: bootstrap
              token-file: /var/run/secrets/kestra/gpu-workers-token
          subscriptions:
            - worker-queue-id: gpu
```

The worker file enables worker authentication, presents the token, and points to the controller. It contains no `kestra.ee.setup` block and no signing key:

```yaml
# gpu-worker.yml
kestra:
  ee:
    worker:
      auth:
        enabled: true
  worker:
    auth:
      registration-token: "${GPU_WORKERS_TOKEN}"   # same token as in gpu-workers-token
    controllers:
      type: STATIC
      static:
        endpoints:
          - host: kestra-controller.internal
            port: 50051
```

When the worker connects, the controller logs `Worker [...] connected, workerGroup='gpu-workers'`. If the worker logs `The token is ignored and this worker joins the default worker group`, the worker is missing `kestra.ee.worker.auth.enabled: true`.

### The default group

The default group can be declared under its reserved id `default`:

```yaml
worker-groups:
  - id: default
    name: Shared workers
    registration-tokens:
      - name: bootstrap
        token-file: /var/run/secrets/kestra/default-workers-token
```

The default group always subscribes to the default queue — Kestra adds that subscription automatically even when `subscriptions` is omitted or does not include the default queue. Any subscriptions you declare are added alongside it.

Kestra creates the built-in default group on first startup, so this declaration only takes effect on a fresh installation. On an existing installation, Kestra skips it and logs a warning. Add the token through the API or UI instead.

### Semantics

`kestra.ee.setup` is a seed, not a desired state:

- Each declared entity is created only when no entity with the same id already exists in the database.
- An existing entity is skipped as a whole — no subscriptions are changed, no tokens are added or revoked.
- Re-applying a changed configuration against an existing entity is a no-op. The database remains the source of truth once an entity exists; editing a live topology stays an API or UI operation.

A rogue instance cannot self-authorize by changing configuration: declarative setup can only add what is absent, never replace or revoke what the authenticated API created.

### Which server roles apply it

Every Kestra server except workers applies `kestra.ee.setup` at startup. Worker processes never apply it, because a worker must not be able to create the group or the token it authenticates against.

### Validation

The entire declaration is validated before anything is written. An invalid configuration fails startup with an actionable message identifying the offending path:

```
The subscription declared at 'kestra.ee.setup.worker-groups[0].subscriptions[1]'
references the unknown Worker Queue 'etl'. Declare it under
'kestra.ee.setup.worker-queues' or create it first.
```

Validation rejects:

- missing or duplicate ids, and non-RFC-1123 ids or tags
- the reserved worker queue ids `default` and `system`
- empty tag sets
- two queues with the same tag set and tenant scope, whether both are declared or one already exists
- unknown or missing `worker-queue-id` references, and the same queue listed twice in one group
- `reserved-percent` out of range or summing above 100
- token entries with both or neither of `token` and `token-file`, and unreadable or empty token files
- the same token declared for two groups, tokens already registered on another group, and malformed registration tokens

Validation is all-or-nothing, but writes are not atomic. A failure mid-apply leaves already-created entities in place. The next startup resumes from where it stopped because existing entities are skipped.

### Observability

Kestra logs one line per created queue, created group, and registered token. Skipped entities are grouped into one line for queues (`Skipped already-existing Worker Queue(s) [...]`) and one line for groups. Each created entity also produces a regular audit log entry. Token values are never logged.

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
        password: "${TLS_KEYSTORE_PASSWORD}"
      # Required when client-auth is OPTIONAL or REQUIRE
      trust-store:
        path: /etc/kestra/tls/ca-truststore.p12
        password: "${TLS_TRUSTSTORE_PASSWORD}"
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
        password: "${TLS_KEYSTORE_PASSWORD}"
      # Optional — falls back to the system trust store
      trust-store:
        path: /etc/kestra/tls/ca-truststore.p12
        password: "${TLS_TRUSTSTORE_PASSWORD}"
```

:::alert{type="info"}
With `type: STATIC` or `type: STORAGE` discovery, the worker uses a synthetic gRPC authority (`controllers`) that does not match the certificate's SANs. Add `authority-override` to the worker config to specify the hostname the certificate was issued for:

```yaml
kestra:
  grpc:
    tls:
      enabled: true
      authority-override: kestra-controller
```

Under `type: DNS` discovery, the authority is derived from the DNS hostname automatically and no override is needed.
:::

## Dedicated storage isolation

If a worker group uses its own storage bucket rather than the internal storage that the webserver and Worker Controller use, KV Store values, namespace files, and managed plugin artifacts are not consistent across the deployment without additional configuration. Set the following properties on the worker:

```yaml
kestra:
  kv:
    worker-access: CONTROLLER          # default: STORAGE

  namespace-files:
    worker-access: CONTROLLER          # default: STORAGE

  plugins:
    management:
      worker-access: CONTROLLER        # default: STORAGE
```

See [Dedicated-storage workers](../../../configuration/06.enterprise-and-advanced/index.md#dedicated-storage-workers) for the full explanation and property reference.

Workers in a group that cannot reach the secrets manager, or that must not hold its credentials, can read secrets through the controller instead. See [Worker access to secrets](../../02.governance/secrets-manager/index.md#worker-access-to-secrets).

## Use cases

### Hardware affinity

Dedicate workers with GPUs, high-memory configurations, or OS-specific environments to tasks that need them. Developers declare the requirement via tags; operators manage the physical mapping independently.

```yaml
workerSelector:
  tags: [gpu, cuda-12]
```

### Multi-tenant isolation

Give each tenant a dedicated Worker Queue, restricted to that tenant, and reserve a capacity percentage on each subscription to prevent noisy-neighbor effects. Use `STRICT` for a hard floor. Use `ELASTIC` to let other tenants borrow a tenant's idle reserved slots, accepting that its floor can dip until borrowed work completes. Slots left unreserved form a shared pool that every subscription draws from once its reserved slots are busy.

### Regulated and air-gapped environments

Workers in restricted networks connect outbound-only, presenting a registration token to authenticate. No inbound firewall rules are required. Revoking a token immediately stops those workers from receiving new work, giving operators a fast, clean isolation path.

### Spiky workloads

Use a fixed Worker Group to handle baseline load, and a second Worker Group on spot instances subscribed to the same queues. Scale the spot group out during spikes and back in afterwards. Capacity reservations apply per worker, so scaling the spot group never changes the reservations on the baseline workers.

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

Run two Worker Groups subscribed to the same queues simultaneously. Bring up the new group and verify it is healthy, then stop the old group's workers so their running tasks finish within the termination grace period, and delete the old group. At no point does the queue go unserved.

Deleting a group that still has running workers returns a `409` error unless you pass `?force=true`. Force deletion revokes those workers' credentials, and their in-flight tasks can be lost.

For guidance on when to use Worker Groups versus Task Runners for compute-intensive scripting workloads, see [Task Runners vs Worker Groups](../../../task-runners/03.task-runners-vs-worker-groups/index.md).

## Worker shutdown and task continuity

When a worker process stops, whether from a deployment, a crash, or a manual restart, any tasks it was running may be interrupted. Each worker's `worker-task-restart-strategy` setting controls what happens to its tasks:

| Strategy | Behavior |
|---|---|
| `AFTER_TERMINATION_GRACE_PERIOD` | The worker stops accepting new work and waits up to the grace period for in-flight tasks to finish; any tasks still running at that point are re-dispatched to another worker (default) |
| `IMMEDIATELY` | Interrupted tasks are re-dispatched to another worker as soon as the worker is detected as disconnected |
| `NEVER` | Interrupted tasks are not re-dispatched and stay `RUNNING` |

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

Metrics scoped to a group carry a `worker_group` tag, and metrics scoped to a queue carry a `worker_queue` tag. The configurable metrics prefix (default `kestra`) is prepended before export.

### Controller metrics

Published by the controller process — the server-side view of fleet capacity and dispatch activity:

| Metric | Type | Tags | Description |
|---|---|---|---|
| `controller.worker.active` | gauge | `worker_queue` | Workers currently subscribed to a queue |
| `controller.worker.active.all` | gauge | — | Total workers connected to this controller |
| `controller.permits.available` | gauge | `worker_queue` | Remaining advertised capacity across subscribed workers |
| `controller.permits.available.all` | gauge | — | Remaining capacity across all connected workers |
| `controller.job.inflight` | gauge | `worker_queue` | In-flight jobs for a queue |
| `controller.worker.group.job.inflight` | gauge | `worker_group` | In-flight jobs across workers in a group |
| `controller.capacity.subscription.allocated` | gauge | `worker_group`, `worker_queue` | Reserved slots allocated to a queue subscription |
| `controller.capacity.subscription.used` | gauge | `worker_group`, `worker_queue` | Reserved slots currently in use |
| `controller.capacity.shared.allocated` | gauge | `worker_group` | Shared (unreserved) slots allocated |
| `controller.capacity.shared.used` | gauge | `worker_group` | Shared slots currently in use |
| `controller.job.dispatched.total` | counter | `worker_group`, `worker_queue` | Total jobs dispatched to workers |
| `controller.job.requeued.total` | counter | `worker_queue` | Jobs re-queued because no worker had capacity |
| `controller.job.killed.total` | counter | `worker_queue` | Jobs short-circuited by the pre-dispatch kill check |
| `controller.job.dispatch.failed.total` | counter | `worker_group`, `worker_queue` | Dispatch attempts that failed: a send error, a failure to save the running state, or a payload above the worker's message size limit |
| `controller.worker.registered.total` | counter | `worker_group`, `worker_queue` | Worker-queue subscription registrations |
| `controller.worker.unregistered.total` | counter | `worker_group`, `worker_queue` | Worker-queue subscription removals |
| `controller.subscription.paused.total` | counter | `worker_queue` | Queue subscription pause transitions |
| `controller.subscription.resumed.total` | counter | `worker_queue` | Queue subscription resume transitions |

### Worker metrics

Published by each worker process — the worker-side view of capacity and throughput:

| Metric | Type | Description |
|---|---|---|
| `worker.job.thread` | gauge | Configured thread count (maximum concurrent jobs) |
| `worker.max.concurrency` | gauge | Maximum in-flight capacity: threads + buffered jobs (`kestra.worker.job-buffer-size`, which defaults to the thread count and is capped at it) |
| `worker.running.count` | gauge | Tasks currently executing |
| `worker.tasks.running.count` | gauge | Tasks currently executing, also tagged by task type, namespace, flow, and tenant |
| `worker.pending.count` | gauge | Tasks waiting for a free thread slot |
| `worker.abandoned.count` | gauge | Jobs the worker stopped waiting for, such as a polling trigger past its timeout, that still hold a thread |
| `worker.queue.size` | gauge | Items currently held in a buffer, identified by the `name` tag (for example `workerjob`) |
| `worker.queue.remaining.capacity` | gauge | Free slots in the inbound job buffer, an upper bound on the permits the worker advertises |
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

When `worker.running.count` consistently equals `worker.job.thread` and `worker.pending.count` is non-zero, that worker is fully saturated. Scale by adding more workers to the group or increasing the thread count. When `worker.queue.remaining.capacity` with `name=workerjob` approaches zero, the worker's local inbound buffer is full.

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
| `workerGroup.fallback` (defaults to `WAIT`) | `workerSelector.fallback` (defaults to `FAIL`) |
| No `match` strategy | `workerSelector.match: ALL` or `ANY` |
| No capacity control per queue | Reserved percentage per subscription, STRICT or ELASTIC mode |
| No worker authentication | Registration token-based authentication with rotating credentials |

`workerGroup` is not recognized in 2.0. Flows using it will fail validation and cannot be saved. Update your flows to replace `workerGroup.key` with `workerSelector.tags`. The group name in the old property corresponds to a tag on a Worker Queue in the new model.

:::alert{type="warning"}
The fallback default changed from `WAIT` to `FAIL`. Tasks that previously waited for an unavailable worker will now fail immediately unless you explicitly set `workerSelector.fallback: WAIT`.
:::
