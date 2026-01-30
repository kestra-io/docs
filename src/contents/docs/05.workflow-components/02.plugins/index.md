---
title: Plugins in Kestra – Tasks, Triggers, and Integrations
description: Understand how Kestra plugins work, how to choose versions, and where to find or build the right integration.
sidebarTitle: Plugins
icon: /src/contents/docs/icons/flow.svg
---

## Plugins - tasks, triggers, and integrations

Plugins power every task and trigger in Kestra. They wrap external systems, expose orchestration primitives, and let you extend the platform with custom code. Think of them as the "integrations" or “drivers” that let flows talk to databases, queues, SaaS APIs, file systems, and runtime environments.

## Plugin categories

Most flows mix several categories:
- **Tasks** perform work (HTTP, JDBC, Python, Spark, Script, etc.).
- **Triggers** start executions ([Schedule](../07.triggers/01.schedule-trigger/index.md), [Webhook](../07.triggers/03.webhook-trigger/index.md), [Kafka](../07.triggers/05.realtime-trigger/index.md), Pub/Sub).
- **Conditions** gate paths (`If`, `Switch`, expressions).

Browse all available plugins at [kestra.io/plugins](/plugins).

## Choosing versions (Enterprise)

Kestra can host multiple versions of the same plugin. You can:
- Pin a version on an individual task/trigger (`version: "0.21.0"`).
- Rely on the instance-wide `defaultVersion` (often `LATEST`) when you omit it.
- In Enterprise, install and pin versions centrally under **Instance → Versioned Plugins** (see [Versioned Plugins](../../07.enterprise/05.instance/versioned-plugins/index.md)).

Example of pinning a task to a specific version:
```yaml
id: postgres_query
namespace: company.team

tasks:
  - id: fetch
    type: io.kestra.plugin.jdbc.postgresql.Query
    version: "1.0.0"
    url: jdbc:postgresql://127.0.0.1:56982/
    username: "{{ secret('POSTGRES_USERNAME') }}"
    password: "{{ secret('POSTGRES_PASSWORD') }}"
    sql: select * from orders limit 1000
    fetchType: STORE
```

## Common configuration patterns

Plugins often share the same properties; use them wisely to keep executions fast and safe:

- **Result handling (`fetchType` / `storeType`)** chooses how outputs are returned: `FETCH_ONE`, `FETCH`, `NONE`, or `STORE`. `STORE` writes results to internal storage and returns a URI instead of inlining the payload.
- **Pagination limits** (`fetchSize`, `limit`, `maxResults`) prevent oversized responses when you expect big result sets.
- [**Secrets**](../../06.concepts/04.secret/index.md): keep connection strings, tokens, and usernames in secrets (`{{ secret('KEY') }}`) so they don’t leak into flow revisions or logs.

### Handling outputs: fetch vs. store

A quick rule set to avoid bloated execution context:
- Use fetch-style outputs (`fetch`, `fetchType`, `store=false`) only for small payloads you need inline for control flow (e.g., a few rows feeding `Switch` or `ForEach`).
- For large datasets, switch to store-style (`store=true`, `storeType: STORE`): the data is written to internal storage, and only a URI is kept in the execution context, preventing repeated serialization on every task state change.
- `value` and `uri` are mutually exclusive: `store=false` exposes `value`; `store=true` exposes `uri`. Accessing the wrong one raises an execution error.

| Setting            | Use when you need | Stored in execution context | Pebble access            | Good for          |
|--------------------|-------------------|-----------------------------|--------------------------|-------------------|
| `fetchType: FETCH_ONE` | A single small record | The value itself          | `{{ outputs.task.value }}` | Lookups, routing |
| `fetchType: FETCH`     | A small list          | The list values           | `{{ outputs.task.value }}` | Branching logic  |
| `fetchType: NONE`      | No result needed      | Nothing                   | n/a                      | Fire-and-forget   |
| `storeType: STORE` or `store: true` | Large payloads/file-like results | Only a URI               | `{{ outputs.task.uri }}`  | Large exports, heavy queries |

:::alert{type="info"}
Handling large outputs? Prefer `STORE`/`storeType` and see [Managing output data volume](../../14.best-practices/0.flows/index.md#managing-output-data-volume).
:::

### Secrets in configuration properties

Some configuration properties such as "Database Password" are obvious secrets and should be protected, but consider using secrets for connection URLs, database names, user or service account names, and similar. Remember using these values in the flow code even once will appear in a [revision](../../06.concepts/03.revision/index.md).

Check out the how to guide for [Secrets in Open Source](../../15.how-to-guides/secrets/index.md), or [Secret Managers](../../07.enterprise/02.governance/secrets-managers/index.md) in Enterprise Edition.

## Installing plugins

Installation paths vary by role:
- **UI (Enterprise)**: install/upgrade/pin versions under **Instance → Versioned Plugins**.
- **CLI/API**: automate installs; see [Selected Plugin Installation](../../15.how-to-guides/selected-plugin-installation/index.md).

## Building or requesting plugins

If you can’t find the integration you need, you can build or request it:
- Build: follow the [Plugin Developer Guide](../../plugin-developer-guide/index.md) to scaffold, test, and publish.
- Request: ask in the [Kestra Slack community](https://kestra.io/slack) or open an issue in the [Kestra repository](https://github.com/kestra-io/kestra/issues).
