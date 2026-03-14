---
title: Kestra Enterprise and Advanced Configuration
description: Configure Enterprise-only and advanced Kestra settings including licenses, Elasticsearch, Kafka, indexer behavior, UI custom links, AI Copilot, and air-gapped deployments.
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

EE Java security lets you restrict filesystem access and thread creation:

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

The old multi-tenancy and default-tenant configuration documented in the full reference was removed in `0.23.0`; keep it only for migration work.

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

The full reference also covers:

- SSL-secured Kafka clients
- default topic partition and replication settings
- consumer, producer, and stream defaults
- custom topic names and topic properties
- consumer and topic prefixes for shared clusters
- Kafka Streams local state directory
- message protection for oversized Kafka messages

Indexer settings control batch indexing from Kafka into Elasticsearch:

```yaml
kestra:
  indexer:
    batch-size: 500
    batch-duration: PT1S
```

## AI and isolated environments

These are the most optional settings on the page. They matter only if you are enabling Copilot integrations or operating Kestra in restricted network environments.

The full reference also includes:

- AI Copilot provider configuration
- air-gapped instance settings

Use this page when an instance needs non-default enterprise infrastructure, custom UI platform behavior, or advanced deployment constraints rather than routine runtime configuration.

## When to use this page

- Need secure runtime or secret backend settings: [Security and Secrets](../05.security-and-secrets/index.md)
- Need full Elasticsearch or Kafka property examples: [Full Reference](../99.full-reference/index.md#elasticsearch)
