---
title: "JavaScript SDK for Kestra: Client Setup and Examples"
h1: Install and Configure the Kestra JavaScript SDK
sidebarTitle: JavaScript SDK
description: Integrate Kestra with JavaScript using the official SDK. Install the library, configure the client, and programmatically create and execute workflows.
icon: /src/contents/docs/icons/api.svg
release: 1.2.0
---

Use the Kestra JavaScript SDK to interact with the Kestra API from Node.js applications.

## Install the JavaScript SDK

Store credentials in environment variables:

```bash
KESTRA_BASE_URL=http://localhost:8080
KESTRA_USERNAME=root@root.com
KESTRA_PASSWORD=Root!1234
```

Install the SDK:

```shell
npm install @kestra-io/kestra-sdk
```

## Configure the client

Call `configureClient` once at application startup, then call `setSelectedTenant` to set the active tenant. Both are applied globally — you do not need to pass connection details or tenant to individual method calls.

```javascript
import { configureClient } from "@kestra-io/kestra-sdk";
import { setSelectedTenant } from "@kestra-io/kestra-sdk/shared";

configureClient({
  baseURL: process.env.KESTRA_BASE_URL ?? "http://localhost:8080",
  auth: () => `${process.env.KESTRA_USERNAME}:${process.env.KESTRA_PASSWORD}`,
});

setSelectedTenant("main");
```

:::alert{type="info"}
For bearer token authentication, set `auth: () => process.env.KESTRA_TOKEN` and pass the token directly.
:::

Each API group is a separate subpath module. Import only what you need:

```javascript
import * as Flows from "@kestra-io/kestra-sdk/flows";
import * as Executions from "@kestra-io/kestra-sdk/executions";
import * as Kv from "@kestra-io/kestra-sdk/kv";
import * as Triggers from "@kestra-io/kestra-sdk/triggers";
```

---

## Create a flow

Send the flow definition as a YAML string:

```javascript
import * as Flows from "@kestra-io/kestra-sdk/flows";

async function createFlow() {
  const body = `id: my_flow
namespace: my_namespace
tasks:
  - id: hello
    type: io.kestra.plugin.core.log.Log
    message: Hello World!
`;

  const created = await Flows.createFlow({ body });
  console.log("Flow created:", created.id);
}
```

:::alert{type="info"}
`body` must be valid flow YAML. If a flow with the same `id` and `namespace` already exists, use `updateFlow` instead.
:::

---

## Delete a flow

Remove a flow by its `namespace` and `id`:

```javascript
import * as Flows from "@kestra-io/kestra-sdk/flows";

async function deleteFlow() {
  await Flows.deleteFlow({ namespace: "my_namespace", id: "my_flow" });
  console.log("Flow deleted");
}
```

:::alert{type="info"}
Deleting a flow removes its definition. Execution history is retained unless you delete executions separately.
:::

---

## Execute a flow

Trigger an execution and optionally wait for it to complete:

```javascript
import * as Executions from "@kestra-io/kestra-sdk/executions";

async function executeFlow() {
  const exec = await Executions.createExecution({
    namespace: "my_namespace",
    id: "my_flow",
    wait: true,  // set false for a non-blocking call
  });
  console.log("Execution started:", exec.id);
}
```

---

## Delete an execution

Delete an execution and optionally purge its logs, metrics, and storage:

```javascript
import * as Executions from "@kestra-io/kestra-sdk/executions";

async function deleteExecution() {
  await Executions.deleteExecution({
    executionId: "your-execution-id",
    deleteLogs: true,
    deleteMetrics: true,
    deleteStorage: true,
  });
  console.log("Execution deleted");
}
```

---

## Follow an execution

Stream live execution state updates. `followExecution` returns a `{ stream }` object where `stream` is an async iterable of execution events:

```javascript
import * as Executions from "@kestra-io/kestra-sdk/executions";

async function followExecution() {
  const { stream } = await Executions.followExecution({
    executionId: "your-execution-id",
  });

  for await (const evt of stream) {
    if (!evt.state) continue; // skip keepalive frames
    console.log(`Status: ${evt.state.current}`);
    if (evt.state.current === "SUCCESS" || evt.state.current === "FAILED") break;
  }
}
```

:::alert{type="info"}
The server emits an initial keepalive event with no `state` — skip it before processing updates.
:::

---

## Read execution logs

### List logs

Fetch all log entries for a completed execution:

```javascript
import * as Logs from "@kestra-io/kestra-sdk/logs";

async function listLogs() {
  const logs = await Logs.listLogsFromExecution({
    executionId: "your-execution-id",
  });
  logs?.forEach(entry => console.log(`[${entry.level}] ${entry.message}`));
}
```

To filter by minimum log level, pass a `filters` array:

```javascript
const logs = await Logs.listLogsFromExecution({
  executionId: "your-execution-id",
  filters: [{ field: "LEVEL", operation: "GREATER_THAN_OR_EQUAL_TO", value: "INFO" }],
});
```

### Search logs

Search across all executions with pagination:

```javascript
import * as Logs from "@kestra-io/kestra-sdk/logs";

async function searchLogs() {
  const result = await Logs.searchLogs({ page: 1, size: 50 });
  result?.results?.forEach(entry => console.log(`[${entry.level}] ${entry.message}`));
}
```

---

## KV Store

The KV Store lets you read and write key-value pairs scoped to a namespace.

### Set a value

```javascript
import * as Kv from "@kestra-io/kestra-sdk/kv";

async function setKvValue() {
  await Kv.setKeyValue({ namespace: "my_namespace", key: "my_key", body: "my_value" });
  console.log("Key set");
}
```

### Get a value

```javascript
import * as Kv from "@kestra-io/kestra-sdk/kv";

async function getKvValue() {
  const result = await Kv.keyValue({ namespace: "my_namespace", key: "my_key" });
  console.log("Value:", result?.value);
}
```

### Delete a key

```javascript
import * as Kv from "@kestra-io/kestra-sdk/kv";

async function deleteKvKey() {
  await Kv.deleteKeyValue({ namespace: "my_namespace", key: "my_key" });
  console.log("Key deleted");
}
```

---

## Manage triggers

### Search triggers

```javascript
import * as Triggers from "@kestra-io/kestra-sdk/triggers";

async function searchTriggers() {
  const result = await Triggers.searchTriggers({ page: 1, size: 50 });
  result.results?.forEach(t => {
    console.log(`${t.triggerContext?.triggerId}: disabled=${t.triggerContext?.disabled}`);
  });
}
```

### Disable or enable a trigger

```javascript
import * as Triggers from "@kestra-io/kestra-sdk/triggers";

async function disableTrigger() {
  await Triggers.disabledTriggersByIds({
    triggers: [{ namespace: "my_namespace", flowId: "my_flow", triggerId: "my_schedule" }],
    disabled: true,  // pass false to re-enable
  });
  console.log("Trigger disabled");
}
```

### Restart a trigger

```javascript
import * as Triggers from "@kestra-io/kestra-sdk/triggers";

async function restartTrigger() {
  await Triggers.restartTrigger({
    namespace: "my_namespace",
    flowId: "my_flow",
    triggerId: "my_schedule",
  });
  console.log("Trigger restarted");
}
```

### Unlock a trigger

```javascript
import * as Triggers from "@kestra-io/kestra-sdk/triggers";

async function unlockTrigger() {
  await Triggers.unlockTrigger({
    namespace: "my_namespace",
    flowId: "my_flow",
    triggerId: "my_schedule",
  });
  console.log("Trigger unlocked");
}
```

---

## Best practices

- **Configure once:** call `configureClient` and `setSelectedTenant` once at startup and reuse them globally.
- **Externalize config:** keep URL and auth in environment variables.
- **Validate YAML:** invalid flow YAML returns `422` responses.
- **Use labels** for governance, search, and routing across executions.
