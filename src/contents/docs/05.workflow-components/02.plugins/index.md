---
title: "Plugins in Kestra: Tasks, Triggers, Integrations"
h1: Find, Choose, and Use Kestra Plugins for Any Integration
description: Understand how Kestra plugins work, how to choose versions, and where to find or build the right integration.
sidebarTitle: Plugins
icon: /src/contents/docs/icons/flow.svg
---

Plugins are the integrations that let flows connect to databases, APIs, file systems, queues, and runtime environments — every task and trigger in Kestra is provided by a plugin. Browse the full catalog at [kestra.io/plugins](/plugins).

## Plugin categories

Plugins come in three categories:

- **Tasks** perform work (HTTP, JDBC, Python, Spark, Script, etc.).
- **Triggers** start executions ([Schedule](../07.triggers/01.schedule-trigger/index.md), [Webhook](../07.triggers/03.webhook-trigger/index.md), [Kafka](../07.triggers/05.realtime-trigger/index.md), Pub/Sub).
- **Conditions** control when triggers fire or which branch of a `Switch` runs.

:::alert{type="info"}
The [Kestra MCP server](../../ai-tools/kestra-mcp-resources/index.md) gives AI coding agents like Claude Code and Cursor live access to plugin task schemas, properties, and version history. Add it to your agent for accurate plugin reference while writing flows.
:::

## Choosing versions

Kestra can host multiple versions of the same plugin:

- Pin a version on an individual task or trigger with `version: "1.0.0"`.
- Omit `version` to use the instance-wide default (often `LATEST`).
- In Enterprise Edition, install and manage versions centrally under **Instance → Versioned Plugins** (see [Versioned Plugins](../../07.enterprise/05.instance/versioned-plugins/index.md)).

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

### Handling outputs: fetch vs. store

The `fetchType` property controls how task outputs are returned. For large datasets, use `STORE` — it writes results to internal storage and returns only a URI, preventing large payloads from bloating the execution context.

| Setting | Use when you need | Stored in context | Pebble access |
|---|---|---|---|
| `fetchType: FETCH_ONE` | A single small record | The value itself | `{{ outputs.task.value }}` |
| `fetchType: FETCH` | A small list | The list values | `{{ outputs.task.value }}` |
| `fetchType: NONE` | No result | Nothing | n/a |
| `fetchType: STORE` | Large payloads | Only a URI | `{{ outputs.task.uri }}` |

`value` and `uri` are mutually exclusive: `FETCH`/`FETCH_ONE` exposes `value`; `STORE` exposes `uri`. Accessing the wrong one raises an execution error.

:::alert{type="info"}
For guidance on large outputs, see [Managing output data volume](../../14.best-practices/0.flows/index.md#managing-output-data-volume).
:::

### Secrets

Use secrets for connection strings, URLs, usernames, tokens, and passwords. Any value written directly in a flow definition is stored in its [revision history](../../06.concepts/03.revision/index.md) and visible to anyone with access to the flow.

```yaml
username: "{{ secret('POSTGRES_USERNAME') }}"
password: "{{ secret('POSTGRES_PASSWORD') }}"
```

See [Secrets in Open Source](../../15.how-to-guides/secrets/index.md) or [Secrets Manager](../../07.enterprise/02.governance/secrets-manager/index.md) (Enterprise Edition).

## Installing plugins

- **OSS**: the standard Kestra Docker image ships with plugins pre-installed. For a minimal build, use the `-no-plugins` image and install selectively via `kestra plugins install <artifact>` or by mounting plugin JARs to `/app/plugins/`.
- **UI (Enterprise Edition)**: install, upgrade, and pin versions under **Instance → Versioned Plugins**.

See [Selected Plugin Installation](../../15.how-to-guides/selected-plugin-installation/index.md) for full setup options including Docker Compose automation.

## Building or requesting plugins

- **Build**: follow the [Plugin Developer Guide](../../plugin-developer-guide/index.mdx) to scaffold, test, and publish.
- **Request**: open an issue in the [Kestra repository](https://github.com/kestra-io/kestra/issues) or ask in the [Kestra Slack community](https://kestra.io/slack).
