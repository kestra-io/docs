---
title: Kestra JavaScript SDK
description: Integrate Kestra with your JavaScript applications using the Kestra JavaScript SDK. Learn to install the SDK, configure the client, and programmatically create and execute workflows.
icon: /src/contents/docs/icons/api.svg
release: 1.2.0
---

Interact with Kestra's API via the JavaScript SDK.

## Install the JavaScript SDK

This guide shows how to create and execute flows programmatically with the JavaScript SDK.
Before starting, ensure your Kestra instance is reachable (for example via `KESTRA_API_URL`), and keep credentials in environment variables or an `.env` file:

```
KESTRA_API_URL=http://localhost:8080
KESTRA_USERNAME=root@root.com
KESTRA_PASSWORD=Root!1234
# KESTRA_TOKEN=...            # optional if you use token auth instead of basic auth
```

Install the SDK (and `dotenv` if you want to load `.env` automatically):

```shell
npm install @kestra-io/kestra-sdk
npm install dotenv --save-dev
```

:::alert{type="info"}
**Notes**
- Prefer environment variables over hardcoding credentials.
- Use **either** username/password (basic auth) or an access token (bearer).
- Reuse a single `KestraClient` instance throughout your application.
:::

### Configure the client

Initialize the client once and share it:

```javascript
import 'dotenv/config';
import KestraClient from '@kestra-io/kestra-sdk';

const client = new KestraClient(
  process.env.KESTRA_API_URL ?? 'http://localhost:8080',
  process.env.KESTRA_TOKEN ?? '',            // accessToken (preferred if set)
  process.env.KESTRA_USERNAME ?? 'root@root.com',
  process.env.KESTRA_PASSWORD ?? 'Root!1234'
);

export default client;
```

---

## Create a flow

Send the flow definition as YAML. This mirrors what you would define in the UI.

```javascript
import client from './client.js'; // the shared client above

async function createFlow() {
  const tenant = 'main';
  const body = `id: my_flow
namespace: my_namespace
tasks:
  - id: hello
    type: io.kestra.plugin.core.log.Log
    message: Hello World! 🚀
`;

  const created = await client.flowsApi.createFlow(tenant, body);
  console.log('Flow created:', created?.id ?? 'my_flow');
}

createFlow().catch(console.error);
```

:::alert{type="info"}
**Important**
- `body` must be valid flow YAML. Invalid YAML or missing fields returns a `4xx`.
- Ensure the correct `tenant` for multi-tenant setups.
- The response contains the created flow (including metadata and source).
:::

---

## Update a flow

Send the full YAML (including the same `id` and `namespace`) to update a flow.

```javascript
import 'dotenv/config';
import client from './client.js';

async function updateFlow() {
  const tenant = 'main';
  const namespace = 'company.team';
  const id = 'my_flow';

  const body = `id: ${id}
namespace: ${namespace}
tasks:
  - id: hello
    type: io.kestra.plugin.core.log.Log
    message: Hello World! with update 🚀
`;

  const updated = await client.flowsApi.updateFlow(namespace, id, tenant, body);
  console.log('Flow updated:', updated?.id ?? `${namespace}/${id}`);
}

updateFlow().catch(console.error);
```

:::alert{type="info"}
**Tips**
- Provide the **full** YAML on update; partial payloads are not merged.
- Keep flow YAML in source control for versioning and code review.
- Reuse the same `tenant`/`namespace`/`id` to target the correct flow.
:::

---

## Delete a flow

Remove a flow by `namespace`/`id`/`tenant`.

```javascript
import 'dotenv/config';
import client from './client.js';

async function deleteFlow() {
  const tenant = 'main';
  const namespace = 'company.team';
  const id = 'my_flow';

  const deleted = await client.flowsApi.deleteFlow(namespace, id, tenant);
  console.log('Flow deleted:', deleted || 'No data returned');
}

deleteFlow().catch(console.error);
```

:::alert{type="info"}
**Notes**
- Deleting a flow removes its definition; executions remain in history unless separately deleted.
- Ensure you target the correct `tenant` before deleting.
:::

---

## Execute a flow

Trigger an execution and optionally pass inputs, labels, or scheduling parameters.

```javascript
import client from './client.js';

async function executeFlow() {
  const tenant = 'main';
  const namespace = 'company.team';
  const flowId = 'my_flow';
  const wait = true; // set false for a non-blocking call

  const exec = await client.executionsApi.createExecution(namespace, flowId, wait, tenant);
  console.log('Execution started:', exec?.id ?? 'No data returned');
}

executeFlow().catch(console.error);
```

:::alert{type="info"}
**Notes**
- `wait=true` blocks until the execution finishes (handy for tests/CLI).
- You can also pass labels, schedule dates, breakpoints, variables, and inputs — see the method signature for optional parameters.
- For multi-tenant setups, set the correct `tenant` value.
:::

---

## Delete an execution

Delete an execution and optionally purge logs, metrics, and internal storage.

```javascript
import client from './client.js';

async function deleteExecution() {
  const executionId = '6nN8Eqt0sq5gXJDj6NjfgO';
  const tenant = 'main';
  const opts = {
    deleteLogs: true,
    deleteMetrics: true,
    deleteStorage: true,
  };

  const deleted = await client.executionsApi.deleteExecution(executionId, tenant, opts);
  console.log('Execution deleted:', deleted || 'No data returned');
}

deleteExecution().catch(console.error);
```

:::alert{type="info"}
**Notes**
- Use the flags to remove associated logs/metrics/storage when needed.
- Ensure you target the correct `tenant` and execution ID before deleting.
:::

---

## Follow (stream) an execution

Stream execution events/logs for live feedback.

```javascript
import client from './client.js';

async function followExecution() {
  const executionId = 'your-execution-id';
  const tenant = 'main';

  const stream = client.executionsApi.followExecution(executionId, tenant);

  stream.onmessage = (event) => {
    const data = JSON.parse(event.data || '{}');
    if (!data || !data.state) return; // first message may be empty (keepalive)
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
**Tips**
- The first SSE payload is an empty keepalive — skip it before processing updates.
- If you only need the final result, poll the execution by ID instead of streaming.
- Add retry/backoff when streaming over unstable networks.
:::

---

## Best practices

- **Reuse your client:** Create one `KestraClient` and share it across your app.
- **Externalize config:** Keep URL/auth in env vars or your config system.
- **Validate YAML:** Invalid flow YAML returns `422` responses.
- **Automate:** Combine `createFlow` + `createExecution` for CI/CD pipelines.
- **Label consistently:** Use labels for governance, search, and routing.
