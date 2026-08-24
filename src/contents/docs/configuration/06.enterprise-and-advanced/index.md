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
| `kestra.grpc.tls.client-auth` | `NONE` | Client auth mode: `NONE`, `OPTIONAL`, or `REQUIRE` |
| `kestra.grpc.tls.insecure-trust-all-certificates` | `false` | Skip CA verification (development only) |
| `kestra.grpc.tls.authority-override` | — | Override TLS authority for static discovery |

## Elasticsearch, Kafka, and indexing

This section is really about one architectural choice: running Kestra on the Kafka plus Elasticsearch stack instead of the simpler JDBC-backed setup. If you are on PostgreSQL or MySQL only, much of this page will not apply.

These settings cover the advanced repository and queue stack used in Enterprise deployments:

- Elasticsearch repository settings
- Kafka client and topic settings
- Kafka message protection
- indexer behavior

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

To reject oversized Kafka messages early:

```yaml
kestra:
  kafka:
    message-protection:
      enabled: true
      limit: 1048576
```

Indexer settings control batch indexing from Kafka into Elasticsearch:

```yaml
kestra:
  indexer:
    batch-size: 500
    batch-duration: PT1S
```

If indexing falls behind, tune indexer batch settings before changing flow definitions. Those settings control how aggressively Kafka-backed events are flushed into Elasticsearch.

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

`kestra.ai.enabled` (default: `true`) controls whether AI Copilot is active. Set it to `false` to disable the feature entirely, including the built-in fallback to `api.kestra.io`.

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
          model-name: gemini-2.5-flash
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
