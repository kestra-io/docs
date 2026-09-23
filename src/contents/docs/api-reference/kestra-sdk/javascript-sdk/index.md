---
title: "JavaScript SDK for Kestra: Client Setup and Examples"
h1: Install and Configure the Kestra JavaScript SDK
sidebarTitle: JavaScript SDK
description: Integrate Kestra with JavaScript using the official SDK. Install the library, configure the client, and programmatically create and execute workflows.
icon: /src/contents/docs/icons/api.svg
release: 1.2.0
---

Use the Kestra JavaScript SDK to interact with the Kestra API from JavaScript or TypeScript. The SDK is built on the standard `fetch` API, so it runs in Node.js and in the browser.

## Install the JavaScript SDK

Store credentials in environment variables:

```bash
export KESTRA_BASE_URL=http://localhost:8080
export KESTRA_USERNAME=root@root.com
export KESTRA_PASSWORD='Root!1234'
# export KESTRA_TOKEN='<your-api-token>'  # for bearer authentication
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
  baseUrl: process.env.KESTRA_BASE_URL ?? "http://localhost:8080",
  auth: () => `${process.env.KESTRA_USERNAME}:${process.env.KESTRA_PASSWORD}`,
});

setSelectedTenant("main");
```

:::alert{type="info"}
The `auth` callback is called once per security scheme (`bearer`, then `basic`), and the last non-empty value sets the `Authorization` header. A `username:password` string is sent as HTTP Basic auth. To authenticate with an API token instead, return the token only for the bearer scheme:

```javascript
configureClient({
  baseUrl: process.env.KESTRA_BASE_URL ?? "http://localhost:8080",
  auth: (a) => (a.scheme === "bearer" ? process.env.KESTRA_TOKEN : undefined),
});
```

Returning the token for every scheme (for example, `auth: () => process.env.KESTRA_TOKEN`) sends it as Basic credentials, and authentication fails.
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

Stream live execution state updates. `followExecution` returns a `{ stream }` object where `stream` is an async iterable of execution events. The server closes the stream once the execution reaches a terminal state, so the loop ends on its own:

```javascript
import * as Executions from "@kestra-io/kestra-sdk/executions";

async function followExecution() {
  const { stream } = await Executions.followExecution({
    executionId: "your-execution-id",
  });

  for await (const evt of stream) {
    if (!evt.state) continue; // skip the initial event, which carries only the execution ID
    console.log(`Status: ${evt.state.current}`);
  }
  console.log("Execution finished");
}
```

:::alert{type="info"}
The first event only identifies the execution and has no `state`. Skip it before processing updates. To stop following early, pass an `AbortSignal` as the second argument: `Executions.followExecution({ executionId }, { signal })`.
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
  filters: [{ field: "level", operation: "GREATER_THAN_OR_EQUAL_TO", value: "INFO" }],
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

The server infers the value type from `body`. Wrap strings in JSON quotes so that values such as `"42"` or `"true"` are stored as `STRING`. Unquoted values such as `42`, `true`, `2025-10-13`, or `PT15M` are stored as `NUMBER`, `BOOLEAN`, `DATE`, or `DURATION`.

```javascript
import * as Kv from "@kestra-io/kestra-sdk/kv";

async function setKvValue() {
  await Kv.setKeyValue({ namespace: "my_namespace", key: "my_key", body: '"my_value"' });
  console.log("Key set");
}
```

### Get a value

```javascript
import * as Kv from "@kestra-io/kestra-sdk/kv";

async function getKvValue() {
  const result = await Kv.keyValue({ namespace: "my_namespace", key: "my_key" });
  console.log(`Value (${result.type}):`, result.value); // Value (STRING): my_value
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
  // Each result pairs the trigger definition (`trigger`) with its runtime state (`state`)
  result.results.forEach(t => {
    console.log(`${t.state.triggerId}: disabled=${t.state.disabled ?? false}`);
  });
}
```

### Disable or enable a trigger

```javascript
import * as Triggers from "@kestra-io/kestra-sdk/triggers";

async function disableTrigger() {
  const disabled = true; // pass false to re-enable
  await Triggers.disabledTriggersByIds({
    triggers: [{ namespace: "my_namespace", flowId: "my_flow", triggerId: "my_schedule" }],
    disabled,
  });
  console.log(`Trigger disabled: ${disabled}`);
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

Unlock a trigger that is stuck in a locked state. If the trigger is not locked, the call throws an error with `status` `409`.

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

## Dashboards

Create, search, and delete dashboards.

### Create a dashboard

```javascript
import * as Dashboards from "@kestra-io/kestra-sdk/dashboards";

async function createDashboard() {
  const body = `id: my_dashboard
title: My Dashboard
description: Dashboard created with the JavaScript SDK
timeWindow:
  default: P30D
  max: P365D
charts: []
`;
  const dashboard = await Dashboards.createDashboard({ body });
  console.log("Dashboard created:", dashboard.id);
}
```

### Search dashboards

```javascript
import * as Dashboards from "@kestra-io/kestra-sdk/dashboards";

async function searchDashboards() {
  const result = await Dashboards.searchDashboards({ page: 1, size: 50 });
  result.results?.forEach(d => console.log(d.id));
}
```

### Delete a dashboard

```javascript
import * as Dashboards from "@kestra-io/kestra-sdk/dashboards";

async function deleteDashboard() {
  await Dashboards.deleteDashboard({ id: "my_dashboard_id" });
  console.log("Dashboard deleted");
}
```

---

## Namespace files

List, read, and delete files stored in a namespace.

### List files

```javascript
import * as Files from "@kestra-io/kestra-sdk/files";

async function listFiles() {
  const files = await Files.listNamespaceDirectoryFiles({
    namespace: "my_namespace",
    path: "/",
  });
  files?.forEach(f => console.log(f.fileName));
}
```

### Read file content

```javascript
import * as Files from "@kestra-io/kestra-sdk/files";

async function readFile() {
  const content = await Files.fileContent({
    namespace: "my_namespace",
    path: "/scripts/main.py",
  });
  console.log("Content received:", content?.size, "bytes");
}
```

### Delete a file

```javascript
import * as Files from "@kestra-io/kestra-sdk/files";

async function deleteFile() {
  await Files.deleteFileDirectory({
    namespace: "my_namespace",
    path: "/scripts/main.py",
  });
  console.log("File deleted");
}
```

---

## Test suites

:::alert{type="warning"}
Test suites require Kestra Enterprise Edition.
:::

Create, run, and fetch results for unit test suites. The example below assumes `my_flow` declares an `inputA` input and a `return` task of type `io.kestra.plugin.core.debug.Return` that outputs it.

### Create a test suite

```javascript
import * as TestSuites from "@kestra-io/kestra-sdk/test-suites";

async function createTestSuite() {
  const body = `id: my_tests
namespace: my_namespace
flowId: my_flow
testCases:
  - id: returns_input
    type: io.kestra.core.tests.flow.UnitTest
    fixtures:
      inputs:
        inputA: "Hi there"
    assertions:
      - value: "{{ outputs.return.value }}"
        equalTo: "Hi there"
`;
  const suite = await TestSuites.createTestSuite({ body });
  console.log("Test suite created:", suite.id);
}
```

### Run a test suite

```javascript
import * as TestSuites from "@kestra-io/kestra-sdk/test-suites";

async function runTestSuite() {
  const result = await TestSuites.runTestSuite({
    namespace: "my_namespace",
    id: "my_tests",
  });
  console.log(`Run ${result.id}: ${result.state}`);
}
```

### Get test results

```javascript
import * as TestSuites from "@kestra-io/kestra-sdk/test-suites";

async function getTestResult() {
  const result = await TestSuites.testResult({ id: "your-test-run-id" }); // `id` returned by runTestSuite
  console.log("State:", result.state);
}
```

---

## Apps

:::alert{type="warning"}
Apps require Kestra Enterprise Edition.
:::

Create, enable, disable, and delete apps. An app is bound to an existing flow through `namespace` and `flowId`.

### Create an app

```javascript
import * as Apps from "@kestra-io/kestra-sdk/apps";

async function createApp() {
  const body = `id: my_app
type: io.kestra.plugin.ee.apps.Execution
namespace: my_namespace
flowId: my_flow
displayName: My App
layout:
  - on: OPEN
    blocks:
      - type: io.kestra.plugin.ee.apps.core.blocks.Markdown
        content: "# My App"
  - on: RUNNING
    blocks:
      - type: io.kestra.plugin.ee.apps.core.blocks.Markdown
        content: "Running..."
  - on: SUCCESS
    blocks:
      - type: io.kestra.plugin.ee.apps.core.blocks.Markdown
        content: "Done!"
`;
  const app = await Apps.createApp({ body });
  console.log("App created:", app.uid);
}
```

### Enable or disable an app

```javascript
import * as Apps from "@kestra-io/kestra-sdk/apps";

async function enableApp() {
  await Apps.enableApp({ uid: "app-uid" });
  console.log("App enabled");
}

async function disableApp() {
  await Apps.disableApp({ uid: "app-uid" });
  console.log("App disabled");
}
```

### Delete an app

```javascript
import * as Apps from "@kestra-io/kestra-sdk/apps";

async function deleteApp() {
  await Apps.deleteApp({ uid: "app-uid" });
  console.log("App deleted");
}
```

---

## Best practices

- **Configure once:** call `configureClient` and `setSelectedTenant` once at startup and reuse them globally.
- **Externalize config:** keep URL and auth in environment variables.
- **Validate YAML:** invalid flow YAML returns `422` responses. Failed calls throw an error that carries the HTTP status as `err.status`.
- **Use labels** for governance, search, and routing across executions.
