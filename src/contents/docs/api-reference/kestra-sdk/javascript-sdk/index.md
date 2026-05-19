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

Before starting, make sure your Kestra instance is reachable. Store credentials in environment variables or an `.env` file:

```bash
KESTRA_API_URL=http://localhost:8080
KESTRA_USERNAME=root@root.com
KESTRA_PASSWORD=Root!1234
# KESTRA_TOKEN=...  # use instead of username/password for token auth
```

Install the SDK and `dotenv`:

```shell
npm install @kestra-io/kestra-sdk
npm install dotenv --save-dev
```

## Configure the client

Initialize `KestraClient` once and share it across your application.

```javascript
import 'dotenv/config';
import KestraClient from '@kestra-io/kestra-sdk';

const client = new KestraClient(
  process.env.KESTRA_API_URL ?? 'http://localhost:8080',
  process.env.KESTRA_TOKEN ?? '',
  process.env.KESTRA_USERNAME ?? 'root@root.com',
  process.env.KESTRA_PASSWORD ?? 'Root!1234'
);

export default client;
```

:::alert{type="info"}
Provide either `KESTRA_TOKEN` (bearer) or `KESTRA_USERNAME`/`KESTRA_PASSWORD` (basic auth), not both.
:::

---

## Create a flow

Send the flow definition as YAML. The first argument is always `tenant`.

```javascript
import client from './client.js';

async function createFlow() {
  const tenant = 'main';
  const body = `id: my_flow
namespace: my_namespace
tasks:
  - id: hello
    type: io.kestra.plugin.core.log.Log
    message: Hello World!
`;

  const created = await client.flowsApi.createFlow(tenant, body);
  console.log('Flow created:', created?.id ?? 'my_flow');
}

createFlow().catch(console.error);
```

:::alert{type="info"}
`body` must be valid flow YAML. If a flow with the same `id` and `namespace` already exists, use `updateFlow`.
:::

---

## Update a flow

Send the full YAML — including the same `id` and `namespace` — to replace an existing flow.

```javascript
import client from './client.js';

async function updateFlow() {
  const tenant = 'main';
  const namespace = 'my_namespace';
  const id = 'my_flow';

  const body = `id: ${id}
namespace: ${namespace}
tasks:
  - id: hello
    type: io.kestra.plugin.core.log.Log
    message: Updated message!
`;

  const updated = await client.flowsApi.updateFlow(namespace, id, tenant, body);
  console.log('Flow updated:', updated?.id ?? `${namespace}/${id}`);
}

updateFlow().catch(console.error);
```

---

## Delete a flow

Remove a flow by `namespace`, `id`, and `tenant`.

```javascript
import client from './client.js';

async function deleteFlow() {
  const tenant = 'main';
  const deleted = await client.flowsApi.deleteFlow('my_namespace', 'my_flow', tenant);
  console.log('Flow deleted:', deleted || 'No data returned');
}

deleteFlow().catch(console.error);
```

:::alert{type="info"}
Deleting a flow removes its definition. Execution history is retained unless you delete executions separately.
:::

---

## Execute a flow

Trigger an execution and optionally wait for it to complete. Options such as `wait`, `labels`, and `revision` go in the fourth `opts` argument.

:::alert{type="info"}
If you used an earlier version of this SDK, the parameter order changed: `tenant` is now the third argument and `opts` is the fourth. The old positional `wait` boolean is now `{ wait: true }` inside `opts`.
:::

```javascript
import client from './client.js';

async function executeFlow() {
  const tenant = 'main';

  const exec = await client.executionsApi.createExecution(
    'my_namespace',
    'my_flow',
    tenant,
    { wait: true }  // set false for a non-blocking call
  );
  console.log('Execution started:', exec?.id);
}

executeFlow().catch(console.error);
```

To pass inputs, add them via `formData`:

```javascript
async function executeFlowWithInputs() {
  const tenant = 'main';

  const exec = await client.executionsApi.createExecution(
    'my_namespace',
    'my_flow',
    tenant,
    { wait: true },
    { input_id: 'value' }  // formData: keys match flow input IDs
  );
  console.log('Execution started:', exec?.id);
}
```

---

## Delete an execution

Delete an execution and optionally purge its logs, metrics, and internal storage.

```javascript
import client from './client.js';

async function deleteExecution() {
  const tenant = 'main';
  const executionId = 'your-execution-id';

  const deleted = await client.executionsApi.deleteExecution(
    executionId,
    tenant,
    { deleteLogs: true, deleteMetrics: true, deleteStorage: true }
  );
  console.log('Execution deleted:', deleted || 'No data returned');
}

deleteExecution().catch(console.error);
```

---

## Follow an execution

Stream execution events for live feedback.

```javascript
import client from './client.js';

async function followExecution() {
  const tenant = 'main';
  const executionId = 'your-execution-id';

  const stream = client.executionsApi.followExecution(executionId, tenant);

  stream.onmessage = (event) => {
    const data = JSON.parse(event.data || '{}');
    if (!data || !data.state) return; // first message may be an empty keepalive
    console.log(`Event: ${data.id} | Status: ${data.state.current}`);
  };

  stream.onerror = (err) => {
    console.error('Stream error:', err);
    stream.close();
  };
}

followExecution().catch(console.error);
```

:::alert{type="info"}
The first SSE payload is an empty keepalive — skip it before processing updates. If you only need the final result, poll the execution by ID instead of streaming.
:::

---

## KV Store

The KV Store lets you read and write key-value pairs scoped to a namespace.

### Set a value

```javascript
import client from './client.js';

async function setKvValue() {
  const tenant = 'main';
  await client.kvApi.setKeyValue('my_namespace', 'my_key', tenant, 'my_value');
  console.log('Key set');
}

setKvValue().catch(console.error);
```

### Get a value

```javascript
import client from './client.js';

async function getKvValue() {
  const tenant = 'main';
  const result = await client.kvApi.keyValue('my_namespace', 'my_key', tenant);
  console.log('Value:', result?.value);
}

getKvValue().catch(console.error);
```

### List keys

Use `listAllKeys` with tenant first, then options for pagination:

```javascript
import client from './client.js';

async function listKvKeys() {
  const tenant = 'main';
  const result = await client.kvApi.listAllKeys(tenant, { page: 1, size: 50 });
  result.results?.forEach(entry => console.log('Key:', entry.key));
}

listKvKeys().catch(console.error);
```

### Delete a key

```javascript
import client from './client.js';

async function deleteKvKey() {
  const tenant = 'main';
  await client.kvApi.deleteKeyValue('my_namespace', 'my_key', tenant);
  console.log('Key deleted');
}

deleteKvKey().catch(console.error);
```

---

## Manage triggers

Search, enable or disable, unlock, and restart triggers for flows.

### Search triggers

Pass tenant first, then options for pagination and filtering:

```javascript
import client from './client.js';

async function searchTriggers() {
  const tenant = 'main';
  const result = await client.triggersApi.searchTriggers(tenant, { page: 1, size: 50 });
  result.results?.forEach(t => {
    console.log(`${t.triggerContext?.triggerId}: disabled=${t.triggerContext?.disabled}`);
  });
}

searchTriggers().catch(console.error);
```

### Disable or enable a trigger

```javascript
import client from './client.js';
import { TriggerControllerSetDisabledRequest, Trigger } from '@kestra-io/kestra-sdk';

async function disableTrigger() {
  const tenant = 'main';
  const request = new TriggerControllerSetDisabledRequest(
    [new Trigger('my_namespace', 'my_flow', 'my_schedule', new Date())],
    true  // pass false to re-enable
  );
  await client.triggersApi.disabledTriggersByIds(tenant, request);
  console.log('Trigger disabled');
}

disableTrigger().catch(console.error);
```

### Restart a trigger

```javascript
import client from './client.js';

async function restartTrigger() {
  const tenant = 'main';
  await client.triggersApi.restartTrigger('my_namespace', 'my_flow', 'my_schedule', tenant);
  console.log('Trigger restarted');
}

restartTrigger().catch(console.error);
```

### Unlock a trigger

Use `unlockTrigger` to unlock a trigger that is stuck in a locked state:

```javascript
import client from './client.js';

async function unlockTrigger() {
  const tenant = 'main';
  await client.triggersApi.unlockTrigger('my_namespace', 'my_flow', 'my_schedule', tenant);
  console.log('Trigger unlocked');
}

unlockTrigger().catch(console.error);
```

---

## Best practices

- **Reuse your client:** create one `KestraClient` and share it across your app.
- **Externalize config:** keep URL and auth in environment variables.
- **Validate YAML:** invalid flow YAML returns `422` responses.
- **Combine `createFlow` and `createExecution`** for CI/CD pipelines.
- **Use labels** for governance, search, and routing.
