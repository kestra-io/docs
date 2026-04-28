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

The old multi-tenancy and default-tenant configuration was removed in `0.23.0`; keep it only in mind for migration work.

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

## AI and isolated environments

These are the most optional settings on the page. They matter only if you are enabling Copilot integrations or operating Kestra in restricted network environments.

This page also includes:

- AI Copilot provider configuration
- air-gapped instance settings

### AI Copilot

Set `kestra.ai.enabled` to `false` to fully disable the AI Copilot, including the built-in fallback to `api.kestra.io`. Defaults to `true`.

Enterprise Edition supports multiple providers in one configuration, which is useful when teams need both a default internal model and a fallback external model:

```yaml
kestra:
  ai:
    enabled: true # set to false to disable AI Copilot entirely
    providers:
      - id: gemini
        display-name: Gemini - Private
        type: gemini
        configuration:
          model-name: gemini-2.5-flash
          api-key: YOUR_GEMINI_API_KEY
      - id: gpt
        display-name: OpenAI
        type: openai
        isDefault: true
        configuration:
          model-name: gpt-4
          api-key: YOUR_OPENAI_API_KEY
```

Optional provider settings include `temperature`, `top-p`, `top-k`, `max-output-tokens`, `log-requests`, `log-responses`, and `base-url`.

### Air-gapped mode

Use air-gapped mode when the UI and blueprint experience must avoid external dependencies:

```yaml
kestra:
  ee:
    airgapped: true
```

When enabled, the UI hides or adapts features that normally depend on external services, such as hosted fonts, external blueprint sources, or embedded internet content.

### Execution data in internal storage

If EE outputs and inputs must be isolated per tenant or namespace, store execution data in internal storage:

```yaml
kestra:
  ee:
    execution-data:
      internal-storage:
        enabled: true
```

To enforce that behavior everywhere:

```yaml
kestra:
  ee:
    execution-data:
      internal-storage:
        force-globally: true
```

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
