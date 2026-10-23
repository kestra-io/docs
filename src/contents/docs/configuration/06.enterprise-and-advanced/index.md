---
title: Enterprise & Advanced Configuration in Kestra
h1: "Configure Enterprise Features: Kafka, Elasticsearch & AI Copilot"
description: Configure Enterprise-only Kestra settings. Manage licenses, Elasticsearch, Kafka, indexer behavior, UI custom links, AI Copilot, and air-gapped deployments.
sidebarTitle: Enterprise and Advanced
icon: /src/contents/docs/icons/admin.svg
editions: ["EE", "Cloud"]
---

Use this page for configuration areas that are either Enterprise-specific or advanced platform concerns.

## Enterprise platform settings

This page groups together settings that are important but not part of a normal OSS-style runtime setup. If the instance is not using EE features, you can ignore most of this page.

This area includes:

- Enterprise license configuration
- Enterprise Java security
- gRPC TLS/mTLS for worker ↔ controller communication
- UI sidebar customization
- historical multi-tenancy and default tenant settings
- custom links in the UI

EE license configuration:

```yaml
kestra:
  ee:
    license:
      id: <LICENSE ID>
      fingerprint: <LICENSE FINGERPRINT>
      key: |
        <LICENSE KEY>
```

Kestra validates the license on startup. The `fingerprint` is also required for versioned plugins.

EE Java security lets you restrict filesystem access and thread creation. Three controls are available:

- `forbidden-paths` — disallows read/write on listed filesystem paths
- `authorized-class-prefix` — limits which classes are allowed to create threads
- `forbidden-class-prefix` — blocks specific classes from creating threads

```yaml
kestra:
  ee:
    java-security:
      enabled: true
      forbidden-paths:
        - /etc/
      authorized-class-prefix:
        - io.kestra.plugin.core
        - io.kestra.plugin.gcp
```

Use `forbidden-class-prefix` when you want to block a specific plugin family from spawning threads rather than maintaining an allowlist:

```yaml
kestra:
  ee:
    java-security:
      enabled: true
      forbidden-class-prefix:
        - io.kestra.plugin.scripts
```

Use EE Java security carefully. It is a platform hardening feature, so the goal is to narrow what plugin code is allowed to touch, not to tune routine runtime behavior.

UI customization examples:

```yaml
kestra:
  ee:
    right-sidebar:
      custom-links:
        internal-docs:
          title: "Internal Docs"
          url: "https://kestra.io/docs/"
```

```yaml
kestra:
  ee:
    left-sidebar:
      disabled-menus:
        - "Blueprints/Flow Blueprints"
```

The old multi-tenancy and default-tenant configuration is no longer supported.

## Tenant example seeding (kestra.ee.tenant-examples)

When a tenant of a type that ships an example bundle (`INFRASTRUCTURE`) is created, Kestra seeds it with a namespace, flows, apps, a dashboard, and a bootstrap execution. This behavior is enabled by default and controlled with:

```yaml
kestra:
  ee:
    tenant-examples:
      enabled: false   # set to false to disable example seeding globally
```

| Property | Default | Description |
|---|---|---|
| `kestra.ee.tenant-examples.enabled` | `true` | When `true`, creating a tenant of a seeded type provisions the example bundle. Set to `false` to skip seeding entirely. |

The example bundle ships inside the JAR — no network access is required at tenant creation time.

## Asset TTL checks (kestra.assets.ttl-check)

Kestra periodically checks the TTL of every asset to start [`TtlTrigger`](../../07.enterprise/02.governance/01.assets/index.md#operational-automation) flows and to notify asset owners in-app when a TTL is expiring or has expired. The check runs on executor nodes. When several executors run, only one of them checks a given tenant at a time.

```yaml
kestra:
  assets:
    ttl-check:
      enabled: true
      initial-delay: PT1M
      fixed-delay: PT1H
```

| Property | Default | Description |
|---|---|---|
| `kestra.assets.ttl-check.enabled` | `true` | When `false`, no TTL check runs: `TtlTrigger` flows never start and owners receive no TTL notifications. |
| `kestra.assets.ttl-check.initial-delay` | `PT1M` | Delay between executor startup and the first check. |
| `kestra.assets.ttl-check.fixed-delay` | `PT1H` | Delay between the end of one check and the start of the next. |

`fixed-delay` sets how late a `TtlTrigger` flow or notification can be. With the default, a flow starts up to one hour after an asset enters its window.

## Worker topology bootstrap (kestra.ee.setup)

`kestra.ee.setup` lets you declare worker queues, worker groups, subscriptions, and registration tokens in configuration so the full topology is provisioned at startup without any runtime API calls.

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
            - worker-queue-id: etl
```

Only the webserver and standalone server roles apply this configuration at startup. Worker processes never apply it.

Each declared entity is created only if it does not already exist in the database. Existing entities are skipped as a whole — no subscriptions are changed and no tokens are added or revoked. The database remains the source of truth once an entity exists.

**Token secret handling.** Each registration token entry requires exactly one of:

| Field | Description |
|---|---|
| `token-file` | Path to a mounted secret file containing the token. Preferred in Kubernetes environments. |
| `token` | Environment variable placeholder resolved at startup, e.g. `"${MY_TOKEN}"`. |

Plaintext tokens in committed configuration files are not recommended.

**Configuration reference**

| Property | Required | Description |
|---|---|---|
| `kestra.ee.setup.enabled` | No | Set to `true` to activate declarative bootstrap. Defaults to `false`. |
| `worker-queues[].id` | Yes | RFC 1123 label. `default` and `system` are reserved and cannot be used. |
| `worker-queues[].tags` | Yes | Non-empty list of routing tags. Must be unique across queues. |
| `worker-queues[].allowed-tenants` | No | Tenant ids permitted to route through this queue. Empty = unrestricted. |
| `worker-groups[].id` | Yes | RFC 1123 label. Use `default` to seed the default group. |
| `worker-groups[].name` | No | Display name. Defaults to the id when omitted. |
| `worker-groups[].registration-tokens[].name` | No | Token display name. Defaults to `bootstrap`. |
| `worker-groups[].registration-tokens[].token-file` | One of | Path to a file containing a pre-generated registration token. Surrounding whitespace is trimmed. |
| `worker-groups[].registration-tokens[].token` | One of | Environment variable placeholder, e.g. `"${MY_TOKEN}"`. Surrounding whitespace is trimmed. |
| `worker-groups[].subscriptions[].worker-queue-id` | Yes | Id of a queue declared under `worker-queues` or already in the database. |
| `worker-groups[].subscriptions[].reserved-percent` | No | Per-worker capacity floor, 1–100. Sum across subscriptions must not exceed 100. |
| `worker-groups[].subscriptions[].mode` | No | `STRICT` or `ELASTIC`. See [Capacity reservation](../../07.enterprise/04.scalability/worker-group/index.md#capacity-reservation). Defaults to `STRICT`. |

See [Declarative configuration](../../07.enterprise/04.scalability/worker-group/index.md#declarative-configuration) for full semantics, validation behavior, and a Kubernetes deployment example.

## gRPC TLS/mTLS (EE only)

Use this section when running Kestra in a distributed topology where the Worker Controller and Workers communicate over gRPC and you need to encrypt that channel. By default, gRPC traffic is plaintext. Enabling TLS here encrypts the controller ↔ worker channel; enabling mTLS additionally requires workers to present a certificate the controller trusts.

This feature is active on any component with server type `CONTROLLER`, `WORKER`, or `STANDALONE`.

### One-way TLS

The controller presents a certificate; workers verify it against a truststore. Configure the controller (server side) with a keystore and the workers (client side) with a matching truststore:

**Controller:**

```yaml
kestra:
  grpc:
    tls:
      enabled: true
      key-store:
        path: /etc/kestra/tls/controller-keystore.p12
        type: PKCS12
        password: "<keystore-password>"
```

**Worker:**

```yaml
kestra:
  grpc:
    tls:
      enabled: true
      trust-store:
        path: /etc/kestra/tls/ca-truststore.p12
        type: PKCS12
        password: "<truststore-password>"
```

If no truststore is provided on the worker side, the JVM default trust store is used. This is appropriate when the controller certificate is signed by a well-known CA.

### Mutual TLS (mTLS)

Set `client-auth: REQUIRE` on the controller to enforce that workers present a certificate. Both sides need a keystore and a truststore:

**Controller:**

```yaml
kestra:
  grpc:
    tls:
      enabled: true
      client-auth: REQUIRE
      key-store:
        path: /etc/kestra/tls/controller-keystore.p12
        type: PKCS12
        password: "<keystore-password>"
      trust-store:
        path: /etc/kestra/tls/ca-truststore.p12
        type: PKCS12
        password: "<truststore-password>"
```

**Worker:**

```yaml
kestra:
  grpc:
    tls:
      enabled: true
      key-store:
        path: /etc/kestra/tls/worker-keystore.p12
        type: PKCS12
        password: "<keystore-password>"
      trust-store:
        path: /etc/kestra/tls/ca-truststore.p12
        type: PKCS12
        password: "<truststore-password>"
```

`client-auth` also accepts `OPTIONAL`, which requests a client certificate but does not require one.

### Authority override for static discovery

When using static discovery, the gRPC channel authority is the synthetic value `controllers` rather than a real hostname. If the controller certificate's Subject Alternative Names (SANs) do not include `controllers`, TLS verification will fail. Set `authority-override` on the worker to a hostname that is present in the certificate's SANs:

```yaml
kestra:
  grpc:
    tls:
      enabled: true
      authority-override: kestra-controller
      trust-store:
        path: /etc/kestra/tls/ca-truststore.p12
        type: PKCS12
        password: "<truststore-password>"
```

This is not needed with DNS-based discovery, where the authority is derived from the actual hostname.

### JKS keystores

PKCS12 is the recommended format. For JKS keystores, set `type: JKS`. JKS also supports a separate key password (used when the private key entry password differs from the store password):

```yaml
kestra:
  grpc:
    tls:
      enabled: true
      key-store:
        path: /etc/kestra/tls/keystore.jks
        type: JKS
        password: "<store-password>"
        key-password: "<key-entry-password>"
```

### PEM certificates

PEM files can be used instead of keystores. This is the natural format for Kubernetes deployments using cert-manager, kubelet-managed Secrets, or tools such as `kestractl`, Vault, or `openssl`, which all write PEM output and would otherwise require a manual conversion step on every certificate renewal.

Set a `pem` block under `kestra.grpc.tls` on both the controller and each worker. The `pem` identity (`certificate-chain*` + `private-key*`) and the keystore (`key-store`) are mutually exclusive, as are `pem` trust (`trust-certificates*`) and `trust-store`. Combining them fails at startup with a message naming the conflicting properties.

**Controller:**

```yaml
kestra:
  grpc:
    tls:
      enabled: true
      client-auth: REQUIRE
      pem:
        certificate-chain-path: /tls/controller.crt
        private-key-path: /tls/controller.key
        trust-certificates-path: /tls/ca.crt
```

**Worker:**

```yaml
kestra:
  grpc:
    tls:
      enabled: true
      pem:
        certificate-chain-path: /tls/worker.crt
        private-key-path: /tls/worker.key
        trust-certificates-path: /tls/ca.crt
```

Private keys can be PKCS#8, PKCS#1 (RSA), or SEC1 (EC). Certificate chains are leaf-first. Trust bundles may contain multiple concatenated CA certificates.

#### Kubernetes and cert-manager

The standard field names in a Kubernetes `tls` Secret (`tls.crt`, `tls.key`, `ca.crt`) map directly to the `pem` properties, so a cert-manager `Certificate` or kubelet-managed Secret can be mounted and used without conversion:

```yaml
kestra:
  grpc:
    tls:
      enabled: true
      pem:
        certificate-chain-path: /tls/tls.crt
        private-key-path: /tls/tls.key
        trust-certificates-path: /tls/ca.crt
        reload-interval: PT1M
```

Mount the Secret as a volume in your Kubernetes deployment:

```yaml
volumes:
  - name: grpc-tls
    secret:
      secretName: kestra-worker-tls
volumeMounts:
  - name: grpc-tls
    mountPath: /tls
    readOnly: true
```

#### Hot reload

When at least one `pem` item is a `-path` property, a background thread checks each file every `reload-interval` (default `PT1M`). When file content changes, the new material is loaded and verified. New TLS handshakes use the updated certificate immediately; open connections continue with the previous material until they reconnect. If a reloaded file is invalid or the private key does not match its certificate, the current material is kept and an error is logged.

Inline values (`certificate-chain`, `private-key`, `trust-certificates`) are loaded once at startup and never reloaded.

### Development: skip certificate verification

:::alert{type="warning"}
`insecure-trust-all-certificates: true` disables CA verification entirely. Use only in local development or CI environments where certificates are self-signed and not managed. Never enable this in production.
:::

```yaml
kestra:
  grpc:
    tls:
      enabled: true
      insecure-trust-all-certificates: true
```

### Configuration reference

| Property | Default | Description |
| --- | --- | --- |
| `kestra.grpc.tls.enabled` | `false` | Enable TLS for gRPC communication |
| `kestra.grpc.tls.key-store.path` | — | Path to keystore file |
| `kestra.grpc.tls.key-store.type` | `PKCS12` | Keystore format (`PKCS12` or `JKS`) |
| `kestra.grpc.tls.key-store.password` | — | Keystore password |
| `kestra.grpc.tls.key-store.key-password` | — | Private key entry password (JKS only) |
| `kestra.grpc.tls.trust-store.path` | — | Path to truststore file |
| `kestra.grpc.tls.trust-store.type` | `PKCS12` | Truststore format |
| `kestra.grpc.tls.trust-store.password` | — | Truststore password |
| `kestra.grpc.tls.pem.certificate-chain-path` | — | Path to PEM certificate chain (leaf first) |
| `kestra.grpc.tls.pem.certificate-chain` | — | Inline PEM certificate chain |
| `kestra.grpc.tls.pem.private-key-path` | — | Path to unencrypted private key (PKCS#8, PKCS#1, or SEC1) |
| `kestra.grpc.tls.pem.private-key` | — | Inline unencrypted private key |
| `kestra.grpc.tls.pem.trust-certificates-path` | — | Path to trusted CA certificates (bundle supported) |
| `kestra.grpc.tls.pem.trust-certificates` | — | Inline trusted CA certificates |
| `kestra.grpc.tls.pem.reload-interval` | `PT1M` | How often path-based files are checked for changes |
| `kestra.grpc.tls.client-auth` | `NONE` | Client auth mode: `NONE`, `OPTIONAL`, or `REQUIRE` |
| `kestra.grpc.tls.insecure-trust-all-certificates` | `false` | Skip CA verification (development only) |
| `kestra.grpc.tls.authority-override` | — | Override TLS authority for static discovery |

## Dedicated-storage workers

Some deployments run workers with their own dedicated storage bucket: a separate region, a customer-managed account, or a different storage provider from the rest of the deployment. Three categories of data need explicit configuration to stay consistent across the deployment.

**KV Store values.** KV metadata is always routed through the controller, but values are written directly to storage. On a worker with dedicated storage, a key set from a flow on that worker is listed in the UI but its value is unreachable from anywhere else. A key set from the UI is visible to the worker in listings but cannot be read.

Set `kestra.kv.worker-access: CONTROLLER` on the worker to route all KV reads and writes through the controller over gRPC. The worker no longer accesses its own storage for KV operations.

**Namespace files.** Namespace file metadata is routed through the controller, but file content is read and written directly to storage. On a worker with dedicated storage, a file uploaded from the UI is listed on the worker but its content is unreachable, and a file written by a task on the worker cannot be read anywhere else.

Set `kestra.namespace-files.worker-access: CONTROLLER` on the worker to route all namespace file reads and writes through the controller over gRPC.

**Managed plugin artifacts.** When plugin versioning is enabled, workers sync plugin artifacts from the deployment's shared storage. On a worker with dedicated storage, those artifacts are unreachable directly.

Set `kestra.plugins.management.worker-access: CONTROLLER` on the worker to pull plugin artifacts through the controller over gRPC instead.

All three properties default to `STORAGE`, preserving the existing behavior for workers that share the deployment's storage.

```yaml
# Worker configuration — dedicated-storage deployment
kestra:
  kv:
    worker-access: CONTROLLER          # default: STORAGE; requires Kestra 2.1

  namespace-files:
    worker-access: CONTROLLER          # default: STORAGE

  plugins:
    management:
      worker-access: CONTROLLER        # default: STORAGE; requires Kestra 2.1
```

`CONTROLLER` mode requires the EE Worker Controller and is authorized against the worker's registration token. Only workers registered with this Kestra instance can use it. `kestra.namespace-files.worker-access` is available from Kestra 2.0.4; `kestra.kv.worker-access` and `kestra.plugins.management.worker-access` require Kestra 2.1.

| Property | Values | Default | Description |
|---|---|---|---|
| `kestra.kv.worker-access` | `STORAGE`, `CONTROLLER` | `STORAGE` | Where the worker reads and writes KV values. `CONTROLLER` routes all KV operations through the controller over gRPC. Requires Kestra 2.1. |
| `kestra.namespace-files.worker-access` | `STORAGE`, `CONTROLLER` | `STORAGE` | Where the worker reads and writes namespace file content. `CONTROLLER` routes all file operations through the controller over gRPC. |
| `kestra.plugins.management.worker-access` | `STORAGE`, `CONTROLLER` | `STORAGE` | How the worker fetches managed plugin artifacts. `CONTROLLER` pulls them through the controller over gRPC. Requires Kestra 2.1. |

## Elasticsearch, Kafka, and indexing

This section is really about one architectural choice: running Kestra on the Kafka plus Elasticsearch stack instead of the simpler JDBC-backed setup. If you are on PostgreSQL or MySQL only, much of this page will not apply.

These settings cover the advanced repository and queue stack used in Enterprise deployments:

- Elasticsearch repository settings
- Kafka client and topic settings
- Kafka message protection

Use this section when you are running the Kafka plus Elasticsearch architecture instead of a JDBC-only deployment.

Minimal Elasticsearch repository configuration:

```yaml
kestra:
  elasticsearch:
    client:
      http-hosts: "http://localhost:9200"
  repository:
    type: elasticsearch
```

Start by proving the minimal connection first. After that, add auth, SSL handling, index prefixes, or rotation only when the deployment model requires them.

With authentication:

```yaml
kestra:
  elasticsearch:
    client:
      http-hosts:
        - "http://node-1:9200"
        - "http://node-2:9200"
      basic-auth:
        username: "<your-user>"
        password: "<your-password>"
  repository:
    type: elasticsearch
```

Related advanced Elasticsearch settings include:

- `trust-all-ssl` for self-signed development clusters
- custom index prefixes
- daily, weekly, monthly, or yearly index rotation

Minimal Kafka queue configuration:

```yaml
kestra:
  kafka:
    client:
      properties:
        bootstrap.servers: "localhost:9092"
  queue:
    type: kafka
```

Kafka tuning is usually about cluster shape rather than syntax. Partition count limits how much component-level concurrency you can achieve, while replication settings should match your broker topology and HA expectations.

This page also covers:

- SSL-secured Kafka clients
- default topic partition and replication settings
- consumer, producer, and stream defaults
- custom topic names and topic properties
- consumer and topic prefixes for shared clusters
- Kafka Streams local state directory
- message protection for oversized Kafka messages

Representative advanced Kafka settings:

```yaml
kestra:
  kafka:
    client:
      properties:
        bootstrap.servers: "localhost:9092"
        security.protocol: SSL
    defaults:
      topic:
        partitions: 3
        replication-factor: 3
    topics:
      executions:
        properties:
          retention.ms: 604800000
```

Use client properties for transport and auth, `defaults` for cluster-wide topic behavior, and `topics.*.properties` only when one topic needs behavior that differs from the rest.

Full SSL client configuration with keystores:

```yaml
kestra:
  kafka:
    client:
      properties:
        bootstrap.servers: "host:port"
        security.protocol: "SSL"
        ssl.endpoint.identification.algorithm: ""
        ssl.key.password: "<your-password>"
        ssl.keystore.location: "/etc/ssl/private/keystore.p12"
        ssl.keystore.password: "<your-password>"
        ssl.keystore.type: "PKCS12"
        ssl.truststore.location: "/etc/ssl/private/truststore.jks"
        ssl.truststore.password: "<your-password>"
  queue:
    type: kafka
```

Consumer, producer, and stream defaults:

```yaml
kestra:
  kafka:
    defaults:
      consumer:
        properties:
          isolation.level: "read_committed"
          auto.offset.reset: "earliest"
          enable.auto.commit: "false"
      producer:
        properties:
          acks: "all"
          compression.type: "lz4"
          max.request.size: "10485760"
      stream:
        properties:
          processing.guarantee: "exactly_once"
          replication.factor: "${kestra.kafka.defaults.topic.replication-factor}"
          acks: "all"
          compression.type: "lz4"
          max.request.size: "10485760"
          state.dir: "/tmp/kafka-streams"
```

Client loggers for debugging message flow:

```yaml
kestra:
  kafka:
    client:
      loggers:
        - level: INFO
          type: PRODUCER
          topic-regexp: "kestra_(executions|workertaskresult)"
          key-regexp: .*parallel.*
          value-regexp: .*parallel.*
```

:::alert{type="warning"}
Client loggers have a heavy performance impact. Use them only for short-lived debugging sessions.
:::

Shared-cluster deployments often also need prefixes or dedicated topic names to avoid collisions with other tenants or environments.

To reject oversized messages early, use `kestra.queue.message-protection`, described in [Queue prefix and message protection](#queue-prefix-and-message-protection). It applies to every queue backend, including Kafka.

The Indexer has no settings of its own. It runs with every queue and repository backend and writes logs, metrics, execution statistics, audit logs, and asset lineage events in batches. With a JDBC queue, the batch size is `kestra.jdbc.queues.poll-size` (default `100`).

## Redis, AMQP, GCP Pub/Sub, and NATS queue backends

Redis, AMQP (RabbitMQ), GCP Pub/Sub, and NATS are Enterprise Edition queue backends, alongside Kafka which is covered above. All four use the same internal queue contracts as the JDBC and Kafka backends. Select a backend with `kestra.queue.type` and configure it under `kestra.queue.<type>`; no producer or consumer code changes. Your Enterprise license must include the backend you select. All four require a JDBC repository (PostgreSQL or MySQL) unless you are also deploying Elasticsearch.

### Queue prefix and message protection

These properties apply to all queue backends:

| Property | Description | Default |
|---|---|---|
| `kestra.queue.prefix` | Name prefix added to every queue. Use this when multiple Kestra clusters share one backend to prevent stream collisions. | — |
| `kestra.queue.message-protection.enabled` | Reject messages larger than `limit` before they reach the backend. Terminal execution states are always allowed through regardless of size. | `true` |
| `kestra.queue.message-protection.limit` | Maximum serialized message size in bytes. Required when `message-protection.enabled` is `true`. | `1048576` (1 MiB) |

```yaml
kestra:
  queue:
    prefix: prod
    message-protection:
      enabled: true
      limit: 1048576   # 1 MiB
```

Set `prefix` when multiple Kestra clusters share one backend (for example, staging and production on the same Redis instance). Each cluster's queues are namespaced independently.

### Redis

Set `kestra.queue.type: redis` and configure the client connection under `kestra.queue.redis`.

Minimal configuration:

```yaml
kestra:
  queue:
    type: redis
    redis:
      url: redis://localhost:6379
```

With authentication:

```yaml
kestra:
  queue:
    type: redis
    redis:
      url: redis://localhost:6379
      username: kestra
      password: "${REDIS_PASSWORD}"
```

#### Configuration reference

| Property | Description | Default |
|---|---|---|
| `kestra.queue.redis.url` | Redis connection URI (`redis://` or `rediss://` for TLS). Required. | — |
| `kestra.queue.redis.username` | Redis username. | — |
| `kestra.queue.redis.password` | Redis password. | — |
| `kestra.queue.redis.pool.size` | Maximum connection pool size. | `32` |
| `kestra.queue.redis.pool.min-idle` | Minimum idle connections in the pool. | — |
| `kestra.queue.redis.pool.max-idle` | Maximum idle connections in the pool. | `32` |
| `kestra.queue.redis.pool.connection-acquire-timeout` | Maximum wait time to acquire a connection from the pool. | `PT5S` |
| `kestra.queue.redis.reclaim.enabled` | When a Kestra instance is confirmed dead, move the messages it was processing back to their queues so another instance redelivers them. Runs on the Executor and on standalone servers. | `true` |

Use a `rediss://` scheme in the URL for TLS-secured connections.

### AMQP (RabbitMQ)

Set `kestra.queue.type: amqp` and configure the client under `kestra.queue.amqp`. RabbitMQ is the supported broker.

Minimal configuration:

```yaml
kestra:
  queue:
    type: amqp
    amqp:
      url: amqp://kestra:password@localhost:5672/kestra
```

Kestra creates the virtual host at startup if it does not already exist, using the RabbitMQ management API. The management API is expected on port `15672` (or `15671` for TLS) at the same host as the broker unless overridden.

#### Configuration reference

| Property | Description | Default |
|---|---|---|
| `kestra.queue.amqp.url` | AMQP broker URI. Required. | — |
| `kestra.queue.amqp.connection-timeout` | TCP connection timeout. | `PT60S` |
| `kestra.queue.amqp.handshake-timeout` | AMQP protocol handshake timeout. | `PT10S` |
| `kestra.queue.amqp.shutdown-timeout` | Socket close timeout on connection shutdown. | `PT10S` |
| `kestra.queue.amqp.channel-rpc-timeout` | Timeout for synchronous channel RPC operations. | `PT10M` |
| `kestra.queue.amqp.requested-heartbeat` | Heartbeat interval requested from the broker. | `PT60S` |
| `kestra.queue.amqp.requested-channel-max` | Maximum channels per connection. | `2047` |
| `kestra.queue.amqp.requested-frame-max` | Maximum AMQP frame size in bytes. `0` means negotiated (typically ~131 KB). | `0` |
| `kestra.queue.amqp.automatic-recovery-enabled` | Automatically reconnect after network failure. | `true` |
| `kestra.queue.amqp.topology-recovery-enabled` | Re-declare exchanges, queues, and bindings after recovery. | `true` |
| `kestra.queue.amqp.network-recovery-interval` | Delay between automatic recovery attempts. | `PT5S` |
| `kestra.queue.amqp.publish-confirm-timeout` | Maximum wait for broker publish confirms before failing a publish. | `PT30S` |
| `kestra.queue.amqp.publish-channel-cache-size` | Number of idle publisher channels cached for reuse. `0` disables caching. | `32` |
| `kestra.queue.amqp.batch-size` | Per-consumer prefetch count and maximum messages processed per batch. | `100` |
| `kestra.queue.amqp.management.port` | HTTP port of the RabbitMQ management API. | `15672` |
| `kestra.queue.amqp.management.tls-port` | HTTPS port of the management API (used when the URL scheme is `amqps://`). | `15671` |
| `kestra.queue.amqp.management.connect-timeout` | HTTP connect timeout for management API calls. | `PT5S` |
| `kestra.queue.amqp.management.request-timeout` | HTTP request timeout for management API calls. | `PT10S` |

For TLS-secured brokers, use `amqps://` in the URL. The management API port automatically switches to `management.tls-port` when the scheme is `amqps://`.

### GCP Pub/Sub

Set `kestra.queue.type: gcp-pubsub` and configure the client under `kestra.queue.gcp-pubsub`.

Minimal configuration:

```yaml
kestra:
  queue:
    type: gcp-pubsub
    gcp-pubsub:
      project-id: my-gcp-project
```

Kestra creates the topics and subscriptions it needs. The credentials must allow creating, listing, and deleting topics and subscriptions in the project.

Without a `service-account`, Kestra uses [Application Default Credentials](https://cloud.google.com/docs/authentication/application-default-credentials): Workload Identity on GKE, the GCE metadata server, or `GOOGLE_APPLICATION_CREDENTIALS` in the environment.

With an explicit service account key:

```yaml
kestra:
  queue:
    type: gcp-pubsub
    gcp-pubsub:
      project-id: my-gcp-project
      service-account: |
        { "type": "service_account", ... }
```

When Kestra runs outside Google Cloud, set `endpoint` to a [locational endpoint](https://cloud.google.com/pubsub/docs/reference/service_apis_overview#locational_endpoints) to keep round trips within one region:

```yaml
kestra:
  queue:
    type: gcp-pubsub
    gcp-pubsub:
      project-id: my-gcp-project
      endpoint: europe-west9-pubsub.googleapis.com:443
```

Kestra includes `kestra.queue.prefix` in topic and subscription names. With Pub/Sub, the prefix must start with a letter, contain only letters, digits, `-`, `_`, `.`, `~`, `+`, and `%`, and not start with `goog`. Kestra fails to start if the prefix, `ack-deadline`, `broadcast-subscription-ttl`, or `endpoint` is outside the range Pub/Sub accepts.

Exactly-once delivery and message ordering are off by default, which matches the at-least-once delivery of the other queue backends. With `message-ordering: true`, messages that share a key arrive in order, but messages with different keys can overtake each other.

Kestra applies `ack-deadline`, `message-ordering`, `exactly-once-delivery`, and `message-retention-duration` only when it creates a subscription. If a subscription already exists with different settings, Kestra logs a warning and leaves the subscription unchanged. To apply new values, delete the subscription so Kestra recreates it, or set a different `kestra.queue.prefix`.

#### Configuration reference

| Property | Description | Default |
|---|---|---|
| `kestra.queue.gcp-pubsub.project-id` | Google Cloud project that holds the topics and subscriptions. Required. | — |
| `kestra.queue.gcp-pubsub.service-account` | Service account key as JSON. Falls back to Application Default Credentials when omitted. | — |
| `kestra.queue.gcp-pubsub.endpoint` | `host:port` of a Pub/Sub locational endpoint, such as `europe-west9-pubsub.googleapis.com:443`. Ignored when `emulator-host` is set. | Global endpoint |
| `kestra.queue.gcp-pubsub.emulator-host` | `host:port` of a Pub/Sub emulator, reached without TLS or credentials. Use it for local testing. | — |
| `kestra.queue.gcp-pubsub.ack-deadline` | How long Pub/Sub waits for an acknowledgment before it redelivers a message. Must be between `PT10S` and `PT10M`. | `PT10S` |
| `kestra.queue.gcp-pubsub.compression-enabled` | Compress published batches. | `false` |
| `kestra.queue.gcp-pubsub.compression-bytes-threshold` | Batch size in bytes at or above which compression applies. | `240` |
| `kestra.queue.gcp-pubsub.exactly-once-delivery` | Create subscriptions with exactly-once delivery. The Pub/Sub emulator does not support it. | `false` |
| `kestra.queue.gcp-pubsub.message-ordering` | Publish and deliver messages that share a key in order. | `false` |
| `kestra.queue.gcp-pubsub.message-retention-duration` | How long Pub/Sub retains unacknowledged messages. Leave unset to use the Pub/Sub subscription default. | — |
| `kestra.queue.gcp-pubsub.broadcast-subscription-ttl` | How long an inactive broadcast subscription survives before Pub/Sub deletes it. Must be at least `P1D`. | `P1D` |
| `kestra.queue.gcp-pubsub.batch-size` | Number of messages a subscriber holds ahead of processing, and the size of a processed batch. | `100` |

### NATS

Set `kestra.queue.type: nats` and configure the connection under `kestra.queue.nats`. NATS with JetStream enabled is required.

Minimal configuration:

```yaml
kestra:
  queue:
    type: nats
    nats:
      servers:
        - nats://localhost:4222
```

With token authentication:

```yaml
kestra:
  queue:
    type: nats
    nats:
      servers:
        - nats://localhost:4222
      token: "${NATS_TOKEN}"
```

With username and password:

```yaml
kestra:
  queue:
    type: nats
    nats:
      servers:
        - nats://localhost:4222
      username: kestra
      password: "${NATS_PASSWORD}"
```

With a credentials file (NKey or JWT):

```yaml
kestra:
  queue:
    type: nats
    nats:
      servers:
        - nats://nats.example.com:4222
      credentials-file: /etc/kestra/nats.creds
```

`token`, `credentials-file`, and `username` are mutually exclusive — set exactly one.

With TLS:

```yaml
kestra:
  queue:
    type: nats
    nats:
      servers:
        - tls://nats.example.com:4222
      truststore-path: /etc/kestra/truststore.jks
      truststore-password: "${TRUSTSTORE_PASSWORD}"
```

For mutual TLS, also set `keystore-path` and `keystore-password`.

#### Configuration reference

**Connection (`kestra.queue.nats`)**

| Property | Description | Default |
|---|---|---|
| `kestra.queue.nats.servers` | List of NATS server URLs to connect to. | `[nats://localhost:4222]` |
| `kestra.queue.nats.connection-name` | Connection name visible in the NATS server monitoring. | `kestra` |
| `kestra.queue.nats.credentials-file` | Path to a credentials file (NKey or JWT). Exclusive with `token` and `username`. | — |
| `kestra.queue.nats.token` | Authentication token. Exclusive with `credentials-file` and `username`. | — |
| `kestra.queue.nats.username` | Username for user/password authentication. Exclusive with `credentials-file` and `token`. | — |
| `kestra.queue.nats.password` | Password for user/password authentication. | — |
| `kestra.queue.nats.truststore-path` | Path to the JKS truststore holding server certificates, for TLS. | — |
| `kestra.queue.nats.truststore-password` | Truststore password. | — |
| `kestra.queue.nats.keystore-path` | Path to the JKS keystore holding the client certificate, for mutual TLS. | — |
| `kestra.queue.nats.keystore-password` | Keystore password. | — |
| `kestra.queue.nats.jetstream-domain` | JetStream domain. Exclusive with `jetstream-api-prefix`. | — |
| `kestra.queue.nats.jetstream-api-prefix` | JetStream API prefix. Exclusive with `jetstream-domain`. | — |
| `kestra.queue.nats.request-timeout` | Timeout for requests to the NATS server. | `PT2S` |

**Queue tuning (`kestra.queue.nats.queues`)**

| Property | Description | Default |
|---|---|---|
| `kestra.queue.nats.queues.replicas` | Number of stream replicas. Applied only when a stream is first created. | `1` |
| `kestra.queue.nats.queues.storage` | Stream storage type: `FILE` or `MEMORY`. Applied only when a stream is first created. | `FILE` |
| `kestra.queue.nats.queues.emit-timeout` | Overall deadline for an emit, including retries. | `PT10S` |
| `kestra.queue.nats.queues.max-in-flight` | Maximum unacknowledged messages across all queues before emits start waiting. | `500` |
| `kestra.queue.nats.queues.broadcast-max-age` | How long broadcast stream messages are retained. | `PT1H` |
| `kestra.queue.nats.queues.fetch-batch-size` | Messages a batch subscriber requests ahead of processing. | `100` |
| `kestra.queue.nats.queues.fetch-single-size` | Messages a single-message subscriber requests ahead of processing. | `10` |
| `kestra.queue.nats.queues.fetch-wait` | How long a subscriber waits for a message before checking for pause or close. | `PT1S` |
| `kestra.queue.nats.queues.ack-wait` | How long the server waits for an acknowledgement before redelivering. | `PT60S` |
| `kestra.queue.nats.queues.max-ack-pending` | Maximum unacknowledged messages per consumer, shared across all its subscribers. | `1000` |

## MCP server cache

Each webserver node caches MCP server configuration in memory and hot-reloads it when a server is created, updated, or deleted. Two properties control this cache:

| Property | Default | Description |
|---|---|---|
| `kestra.mcp.server-cache-config.maximum-size` | `500` | Maximum number of MCP server entries held in the cache. |
| `kestra.mcp.server-cache-config.expire-after-access` | `PT5M` | Duration after which a cache entry expires if not accessed. |

```yaml
kestra:
  mcp:
    server-cache-config:
      maximum-size: 200
      expire-after-access: PT10M
```

Tune these only if you have a large number of MCP servers or tight memory constraints. The defaults are sufficient for most deployments.

## AI and isolated environments

These are the most optional settings on the page. They matter only if you are enabling Copilot integrations or operating Kestra in restricted network environments.

This page also includes:

- AI Copilot provider configuration
- air-gapped instance settings

### AI Copilot

AI Copilot configuration lives under `kestra.ai` and controls which LLM providers are active, how each provider is authenticated and tuned, and how the agent runtime behaves.

#### Enabling and disabling

`kestra.ai.enabled` (default: `true`) controls whether AI Copilot is active. Set it to `false` to disable the feature entirely.

#### Providers

Enterprise Edition lets you configure multiple providers in a single deployment. Each entry in `kestra.ai.providers` is an independent provider the UI can offer to users.

```yaml
kestra:
  ai:
    enabled: true
    providers:
      - id: internal-gemini
        display-name: Gemini (internal)
        type: gemini
        configuration:
          api-key: YOUR_GEMINI_API_KEY
          model-name: gemini-3.5-flash-lite
      - id: openai-gpt
        display-name: OpenAI GPT
        type: openai
        is-default: true
        configuration:
          api-key: YOUR_OPENAI_API_KEY
          model-name: gpt-4o
```

**Provider wrapper fields**

| Field | Required | Description |
|---|---|---|
| `id` | ✅ | Unique identifier for this provider entry. |
| `display-name` | ✅ | Label shown to users in the Copilot UI. |
| `type` | ✅ | Provider type. One of: `openai`, `azure-openai`, `gemini`, `googlevertexai`, `anthropic`, `bedrock`, `deepseek`, `mistralai`, `ollama`, `open-router`. |
| `is-default` | ❌ | When `true`, this provider is selected automatically when no explicit choice is made. |
| `configuration` | ❌ | Provider-specific settings. See the property reference and provider sections below. |
| `system-prompt` | ❌ | (EE only) Override the built-in system prompt per Copilot mode. A non-blank value for a mode fully replaces the built-in prompt for that mode. |
| `system-prompt.ask` | ❌ | Custom system prompt for Ask mode. |
| `system-prompt.plan` | ❌ | Custom system prompt for Plan mode. |
| `system-prompt.edit` | ❌ | Custom system prompt for Edit mode. |


For OSS users, only Gemini is currently available; you can provide your Gemini API key to use the AI Copilot.

```yaml
kestra:
  ai:
    - id: gemini
      display-name: Gemini
      type: gemini
      configuration:
        api-key: YOUR_GEMINI_API_KEY
        model-name: gemini-3.5-flash-lite
```

#### Configuration property reference

These properties appear inside the `configuration:` block of a provider entry. Not every property is available on every provider — the per-provider sections below show which apply and which are required.

**Authentication**

| Property | Description |
|---|---|
| `api-key` | API key for the provider. Most providers require this; Anthropic and Google Vertex AI do not (see their sections). |
| `access-key-id` | AWS access key ID. Amazon Bedrock only. |
| `secret-access-key` | AWS secret access key. Amazon Bedrock only. |
| `client-pem` | PEM-encoded client certificate used for mutual TLS (mTLS) when the provider endpoint requires client authentication. |
| `ca-pem` | PEM-encoded CA certificate to add additional TLS trust beyond the system trust store. Not required for standard provider endpoints. |

**Model selection**

| Property | Description |
|---|---|
| `model-name` | The model identifier to use. The accepted values are provider-specific (e.g. `gpt-4o`, `gemini-2.5-flash`, `claude-opus-4-5`). Each provider section lists its default. |

**Generation parameters**

| Property | Description |
|---|---|
| `temperature` | Controls randomness in sampling. Lower values (e.g. `0.2`) produce more deterministic output; higher values (e.g. `1.0`) produce more varied responses. Most providers default to `0.7`; OpenAI and OpenRouter default to `1`. |
| `top-p` | Nucleus sampling: only tokens whose cumulative probability reaches `top-p` are considered. An alternative to `temperature` — set one or the other, not both. |
| `top-k` | Limits sampling to the top K most probable tokens at each step. Supported by Gemini, Google Vertex AI, Anthropic, Amazon Bedrock, and Ollama. |
| `max-output-tokens` | Maximum number of tokens the model may produce in a single response. Defaults to `8000` on providers that support it. Mistral AI does not expose this setting. |

**Extended reasoning**

| Property | Description |
|---|---|
| `thinking-enabled` | When `true`, enables the provider's extended reasoning or thinking mode. Supported by OpenAI, Azure OpenAI, Gemini, Anthropic, and Amazon Bedrock. Anthropic requires `temperature: 1` and disables `top-p` and `top-k` when thinking is on — these constraints are applied automatically. |
| `thinking-effort` | Provider-neutral reasoning effort: `LOW`, `MEDIUM`, or `HIGH`. Supported by OpenAI, Azure OpenAI, and Gemini. Each provider maps this to its own vocabulary (e.g. OpenAI `reasoning_effort`, Gemini `thinkingLevel`). |
| `thinking-budget-tokens` | Token budget for the reasoning process. Supported by Gemini, Anthropic, and Amazon Bedrock. Anthropic requires a minimum of `1024`; when `thinking-enabled` is `true` and no budget is set, `1024` is used automatically. |

**Network and connectivity**

| Property | Description |
|---|---|
| `base-url` | Override the default API endpoint. Use this for self-hosted deployments, proxies, or OpenAI-compatible local servers. Available on OpenAI, Gemini, DeepSeek, Mistral AI, Ollama, and OpenRouter. For Ollama, `base-url` is required (there is no cloud endpoint). |
| `custom-headers` | A flat map of extra HTTP headers sent with every request to the provider. Useful for passing organization IDs, routing headers, or authentication tokens that the provider requires alongside the API key. |
| `timeout` | Maximum duration for a single HTTP request to the provider (e.g. `PT30S`, `PT2M`). Does not apply to Google Vertex AI. |

**Logging**

| Property | Description |
|---|---|
| `log-requests` | When `true`, logs the full request body sent to the provider. Useful for debugging prompt construction. Avoid in production — request bodies may contain sensitive data. |
| `log-responses` | When `true`, logs the full response body received from the provider. Same caveats as `log-requests`. |
| `log-requests-and-responses` | Azure OpenAI equivalent of `log-requests` + `log-responses` combined in a single toggle. |

#### Provider types

Each provider section lists only its required fields and properties unique to that provider. All other properties from the reference above are available unless noted.

##### OpenAI (`type: openai`)

| Property | Required | Default |
|---|---|---|
| `api-key` | ✅ | — |
| `model-name` | ❌ | `gpt-5-nano` |
| `temperature` | ❌ | `1` |
| `max-output-tokens` | ❌ | `8000` |

Supports `thinking-enabled` and `thinking-effort`. Supports `base-url` for OpenAI-compatible self-hosted endpoints.

Does not support `top-k`.

##### Azure OpenAI (`type: azure-openai`)

Supports two authentication methods: API key or Azure Active Directory (AAD).

| Property | Required | Default |
|---|---|---|
| `endpoint` | ✅ | — |
| `model-name` | ✅ | — |
| `api-key` | ❌ (use this or AAD) | — |
| `tenant-id` | ❌ (AAD auth) | — |
| `client-id` | ❌ (AAD auth) | — |
| `client-secret` | ❌ (AAD auth) | — |
| `service-version` | ❌ | — |
| `temperature` | ❌ | `1` |
| `max-output-tokens` | ❌ | `8000` |

Supports `thinking-enabled` and `thinking-effort`.

Uses `log-requests-and-responses` instead of separate `log-requests` / `log-responses` toggles. Does not support `top-k`, `base-url`, `client-pem`, or `ca-pem`.

##### Gemini (`type: gemini`)

| Property | Required | Default |
|---|---|---|
| `api-key` | ✅ | — |
| `model-name` | ❌ | `gemini-2.5-flash` |
| `temperature` | ❌ | `0.7` |
| `max-output-tokens` | ❌ | `8000` |

Supports `thinking-enabled`, `thinking-effort`, and `thinking-budget-tokens`. Supports `base-url` and `top-k`.

##### Google Vertex AI (`type: googlevertexai`)

Authenticates via [Application Default Credentials](https://cloud.google.com/docs/authentication/application-default-credentials). No `api-key` field — ensure the Kestra runtime environment has ADC configured (e.g. a service account key via `GOOGLE_APPLICATION_CREDENTIALS`, Workload Identity, or `gcloud auth application-default login`).

| Property | Required | Default |
|---|---|---|
| `project` | ✅ | — |
| `location` | ✅ | — |
| `model-name` | ✅ | — |
| `temperature` | ❌ | `0.7` |

Supports `top-k`. Does not support `thinking-enabled`, `thinking-effort`, `thinking-budget-tokens`, `base-url`, `client-pem`, `ca-pem`, `max-output-tokens`, or `timeout`.

##### Anthropic (`type: anthropic`)

No `api-key` configuration field. Set the `ANTHROPIC_API_KEY` environment variable on the Kestra server instead.

| Property | Required | Default |
|---|---|---|
| `model-name` | ✅ | — |
| `temperature` | ❌ | `0.7` |
| `max-output-tokens` | ❌ | `8000` |

Supports `thinking-enabled` and `thinking-budget-tokens` (minimum `1024`; defaults to `1024` when thinking is enabled without an explicit budget). When `thinking-enabled` is `true`, Anthropic requires `temperature: 1` and ignores `top-p` and `top-k` — these constraints are applied automatically regardless of what you configure. Supports `top-k`.

Does not support `thinking-effort`.

##### Amazon Bedrock (`type: bedrock`)

| Property | Required | Default |
|---|---|---|
| `access-key-id` | ✅ | — |
| `secret-access-key` | ✅ | — |
| `model-name` | ✅ | — |
| `temperature` | ❌ | `0.7` |
| `max-output-tokens` | ❌ | `8000` |

Supports `thinking-enabled` and `thinking-budget-tokens`. Supports `top-k`.

Does not support `thinking-effort`, `base-url`, `client-pem`, or `ca-pem`.

##### DeepSeek (`type: deepseek`)

| Property | Required | Default |
|---|---|---|
| `api-key` | ✅ | — |
| `model-name` | ❌ | `deepseek-chat` |
| `temperature` | ❌ | `0.7` |
| `max-output-tokens` | ❌ | `8000` |

Supports `base-url` for self-hosted or compatible endpoints. Does not support `top-k`, `thinking-enabled`, or `thinking-effort`.

##### Mistral AI (`type: mistralai`)

| Property | Required | Default |
|---|---|---|
| `api-key` | ✅ | — |
| `model-name` | ✅ | — |
| `temperature` | ❌ | `0.7` |

Supports `base-url`. Does not support `max-output-tokens`, `top-k`, `thinking-enabled`, or `thinking-effort`.

##### Ollama (`type: ollama`)

Ollama runs locally — there is no cloud API key. `base-url` points to your Ollama server and is required.

| Property | Required | Default |
|---|---|---|
| `base-url` | ✅ | — |
| `model-name` | ✅ | — |
| `temperature` | ❌ | `0.7` |
| `max-output-tokens` | ❌ | `8000` |

Supports `top-k`. Does not support `api-key`, `thinking-enabled`, or `thinking-effort`.

##### OpenRouter (`type: open-router`)

| Property | Required | Default |
|---|---|---|
| `api-key` | ✅ | — |
| `model-name` | ❌ | `gpt-5-nano` |
| `temperature` | ❌ | `1` |
| `max-output-tokens` | ❌ | `8000` |

Supports `base-url`. Does not support `top-k`, `thinking-enabled`, or `thinking-effort`.

#### Agent runtime settings

`kestra.ai.agent` controls the Copilot agent runtime. The defaults suit most deployments — tune only when hitting provider rate limits, memory pressure, or needing to adjust conversation scope.

| Property | Default | Description |
|---|---|---|
| `model-call-timeout` | `PT5M` | Maximum duration of a single streaming model call. If a provider call hangs beyond this threshold, the turn is failed rather than leaving a thread pinned indefinitely. |
| `docs-mcp-url` | `https://api.kestra.io/v1/mcp` | Kestra docs MCP endpoint used for context grounding in Ask mode. Override this in air-gapped deployments that run a local docs MCP server. |
| `max-sequential-tools-invocations` | `25` | Maximum number of sequential tool-calling round-trips within a single turn. Bounds runaway reasoning loops — each round-trip is a paid model call. |
| `max-turns-per-thread` | `50` | Maximum number of user turns in a single conversation thread before new turns are refused. |
| `max-concurrent-turns` | `32` | Per-node ceiling on simultaneously running agent turns. New turns receive a 429 response when the ceiling is reached rather than queuing. Bounds concurrent provider load — agent turns run on virtual threads so the thread count itself is not a concern. |
| `max-context-turns` | `10` | How many of the most recent turns are replayed into the model context per turn. Older turns remain stored for history but are windowed out of the prompt. Windowing operates on whole turns so tool-call and result pairs are never split. |
| `in-memory-conversation-ttl` | `PT1H` | In-memory store only: how long a conversation is retained after its last activity before eviction. Ignored when a durable backend is configured. |
| `max-in-memory-conversations` | `50` | In-memory store only: hard cap on retained conversations. The least-recently-active conversation is evicted when the cap is exceeded. Ignored when a durable backend is configured. |

```yaml
kestra:
  ai:
    agent:
      model-call-timeout: PT5M
      max-sequential-tools-invocations: 25
      max-concurrent-turns: 32
      max-context-turns: 10
```

### Air-gapped mode

Use air-gapped mode when the UI and blueprint experience must avoid external dependencies:

```yaml
kestra:
  ee:
    airgapped: true
```

When enabled, the UI hides or adapts features that normally depend on external services, such as hosted fonts, external blueprint sources, or embedded internet content.

### Mail service

Invitation and password-reset emails rely on the EE mail service:

```yaml
kestra:
  ee:
    mail-service:
      host: host.smtp.io
      port: 587
      username: user
      password: password
      from: configurable@mail.com
      from-name: Kestra
      auth: true
      starttls-enable: true
```

Use this page when an instance needs non-default enterprise infrastructure, custom UI platform behavior, or advanced deployment constraints rather than routine runtime configuration.

## When to use this page

- Need secure runtime or secret backend settings: [Security and Secrets](../05.security-and-secrets/index.md)
- Need queue, repository, storage, or JVM setup: [Runtime and Storage](../02.runtime-and-storage/index.md)
