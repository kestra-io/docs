---
title: Elasticsearch
icon: /docs/icons/admin.svg
editions: ["EE"]
---

Configure Kestra to use Elasticsearch as a repository and indexer.

**Elasticsearch is an [Enterprise Edition](/enterprise) functionality.**

The most important thing is to configure the way Kestra connects to the Elasticsearch cluster.

Here is a minimal configuration example:

```yaml
kestra:
  elasticsearch:
    client:
      http-hosts: "http://localhost:9200"
  repository:
    type: elasticsearch
```

Here is another example with a secured Elasticsearch cluster with basic authentication:

```yaml
kestra:
  elasticsearch:
    client:
      http-hosts:
        - "http://node-1:9200"
        - "http://node-2:9200"
        - "http://node-3:9200"
      basic-auth:
        username: "<your-user>"
        password: "<your-password>"
  repository:
    type: elasticsearch
```

## `kestra.elasticsearch.client.trust-all-ssl`
Default `false`, if you enable this option, we trust all certificate during connection. Useful for development server with self-signed certificate.

```yaml
kestra:
  elasticsearch:
    client:
      http-hosts: "https://localhost:9200"
      trust-all-ssl: true
```

## `kestra.elasticsearch.defaults.indice-prefix`
This configuration allows to change the indices prefix. By default, the prefix will be `kestra_`.

For example, if you want to share a common Elasticsearch cluster for multiple instances of Kestra, add a different prefix for each instance like this:

```yaml
kestra:
  elasticsearch:
    defaults:
      indice-prefix: "uat_kestra"
```

## `kestra.elasticsearch.indices`
By default, a unique indices is used for all different data, it could be useful to split the index by day / week / month to avoid having large indices in ElasticSearch.

For now, `executions`, `logs` & `metrics` can be split, and we support all this split type:
- `DAILY`
- `WEEKLY`
- `MONTHLY`
- `YEARLY`

```yaml
kestra:
  elasticsearch:
    indices:
      executions:
        alias: daily
      logs:
        alias: daily
      metrics:
        alias: daily
```

### Index Rotation

When you enable index rotation, it creates an alias and one index per periodicity (day, week, etc.).

It's safe to enable it on an existing instance however the alias will clash with the existing index so you should move the existing index, for example change `kestra_logs` to `kestra_logs-1` before switching to the alias.

As indexes will be created with `name-periodicity` using the `-1` suffix, make sure you will still include the old data (until you make the decision to purge it).

Be careful that not all indexes can be safely purged. You should only enable alias for historical data that keeps growing (like logs, metrics and executions).

It's safe to disable aliases but in the case existing data would not be recovered anymore.

It is totally safe to switch from one periodicity to another as the alias is for `name-*` so the periodicity is not important.

## `kestra.elasticsearch.client.trust-all-ssl`

## `kestra.indexer`
Indexer send data from Kafka to Elasticsearch using Bulk Request. You can control the batch size and frequency to reduce the load on ElasticSearch. This will delay some information on the UI raising that values, example:

```yaml
kestra:
  indexer:
    batch-size: 500 # (default value, any integer > 0)
    batch-duration: PT1S # (default value, any duration)
```
