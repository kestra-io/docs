---
title: Queue Backend Configuration Moved Under kestra.queue
h1: Move Kafka, Redis, and AMQP Configuration Under kestra.queue
sidebarTitle: Queue Backend Configuration
icon: /src/contents/docs/icons/migration-guide.svg
release: 2.1.0
editions: ["EE"]
description: In 2.1.0, the Kafka, Redis, and AMQP queue backends read their configuration under kestra.queue.<type>. The previous keys still work and log a deprecation warning.
---

In Kestra 2.1.0, the Kafka, Redis, and AMQP queue backends read their configuration under `kestra.queue.<type>`. Move your configuration to the new keys.

The previous keys still work. At startup, Kestra maps them to the new location and logs a deprecation warning for each previous prefix it finds:

```text
The configuration under 'kestra.redis.client' is deprecated, move it to 'kestra.queue.redis'.
```

When a property is set under both the previous and the new key, the new key wins.

## Key mapping

| Previous prefix | New prefix |
|---|---|
| `kestra.kafka` | `kestra.queue.kafka` |
| `kestra.server.metrics.kafka` | `kestra.queue.kafka.metrics` |
| `kestra.redis.client` | `kestra.queue.redis` |
| `kestra.redis.reclaim` | `kestra.queue.redis.reclaim` |
| `kestra.amqp.client` | `kestra.queue.amqp` |

Property names below the prefix don't change. For example, `kestra.redis.client.pool.size` becomes `kestra.queue.redis.pool.size`.

Before:

```yaml
kestra:
  queue:
    type: redis
  redis:
    client:
      url: redis://localhost:6379
      password: "${REDIS_PASSWORD}"
```

After:

```yaml
kestra:
  queue:
    type: redis
    redis:
      url: redis://localhost:6379
      password: "${REDIS_PASSWORD}"
```

The GCP Pub/Sub and NATS queue backends are new in 2.1.0 and only read `kestra.queue.gcp-pubsub` and `kestra.queue.nats`. For every property, see [Redis, AMQP, GCP Pub/Sub, and NATS queue backends](../../../configuration/06.enterprise-and-advanced/index.md#redis-amqp-gcp-pubsub-and-nats-queue-backends).
