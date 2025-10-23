---
title: Kestra JavaScript SDK
icon: /docs/icons/api.svg
release: 1.0.0
---

## Install JavaScript SDK

You can use the Kestra JavaScript SDK in **Node.js** and the **browser**.

### Node.js

For [Node.js](https://nodejs.org/), publish the library as an [npm](https://www.npmjs.com/) package (see **[Publishing npm packages](https://docs.npmjs.com/getting-started/publishing-npm-packages)**). Once published, install it with:

```shell
npm install @kestra-io/kestra-sdk --save
```

Build the module with:

```shell
npm run build
```

#### Local development

To work with the library locally (without publishing to a registry), change into the directory containing `package.json` (referred to as `JAVASCRIPT_CLIENT_DIR`) and run:

```shell
npm install
```

Then [link](https://docs.npmjs.com/cli/link) it globally:

```shell
npm link
```

In your application project, link the local SDK:

```shell
npm link /path/to/<JAVASCRIPT_CLIENT_DIR>
```

Finally, build the module:

```shell
npm run build
```

#### Git

If the library is hosted in a Git repository (for example, `https://github.com/GIT_USER_ID/GIT_REPO_ID`), install it via:

```shell
npm install GIT_USER_ID/GIT_REPO_ID --save
```

### Browser installation

The library also works in the browser via `npm` and [browserify](http://browserify.org/). After following the Node.js steps and installing browserify (`npm install -g browserify`), bundle your entry file (assume `main.js`):

```shell
browserify main.js > bundle.js
```

Then include `bundle.js` in your HTML.

---

## Getting started

After installation, initialize the SDK and call the API:

```javascript
var KestraIoKestraSdk = require('@kestra-io/kestra-sdk');

var api = new KestraIoKestraSdk.AIApi()
var tenant = "tenant_example"; // {String} 
var flowGenerationPrompt = new KestraIoKestraSdk.FlowGenerationPrompt(); // {FlowGenerationPrompt} Prompt and context required for flow generation
var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
api.generateFlow(tenant, flowGenerationPrompt, callback);
```

::alert{type="info"}
**Notes:**  
- If needed, set the base URL with `KestraIoKestraSdk.ApiClient.instance.basePath = "http://localhost:8080";`.  
- Configure authentication (_basic_ or _bearer_) before making requests when your Kestra instance requires it.
::

---

## Create flow

Create or update a flow using the [`createFlow` method](https://github.com/kestra-io/client-sdk/blob/main/javascript-sdk/docs/FlowsApi.md#createflow):

```javascript
import KestraIoKestraSdk from '@kestra-io/kestra-sdk';
let defaultClient = KestraIoKestraSdk.ApiClient.instance;
// Configure HTTP basic authorization: basicAuth
let basicAuth = defaultClient.authentications['basicAuth'];
basicAuth.username = 'YOUR USERNAME';
basicAuth.password = 'YOUR PASSWORD';
// Configure Bearer (Bearer) access token for authorization: bearerAuth
let bearerAuth = defaultClient.authentications['bearerAuth'];
bearerAuth.accessToken = "YOUR ACCESS TOKEN"

let apiInstance = new KestraIoKestraSdk.FlowsApi();
let tenant = "tenant_example"; // String | 
let body = "body_example"; // String | The flow source code
apiInstance.createFlow(tenant, body, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

::alert{type="info"}
**Important:**  
- `body` must contain **valid YAML** for a Kestra flow; invalid YAML will result in a `4xx` response.  
- Ensure the `tenant` is set correctly for multi-tenant deployments.  
- When using ESM in Node, import with `import KestraIoKestraSdk from '@kestra-io/kestra-sdk'`; for CommonJS use `require(...)`.
::

---

## Execute a flow

Execute a flow using the [`createExecution` method](https://github.com/kestra-io/client-sdk/blob/main/javascript-sdk/docs/ExecutionsApi.md#createexecution):

```javascript
import KestraIoKestraSdk from '@kestra-io/kestra-sdk';
let defaultClient = KestraIoKestraSdk.ApiClient.instance;
// Configure HTTP basic authorization: basicAuth
let basicAuth = defaultClient.authentications['basicAuth'];
basicAuth.username = 'YOUR USERNAME';
basicAuth.password = 'YOUR PASSWORD';
// Configure Bearer (Bearer) access token for authorization: bearerAuth
let bearerAuth = defaultClient.authentications['bearerAuth'];
bearerAuth.accessToken = "YOUR ACCESS TOKEN"

let apiInstance = new KestraIoKestraSdk.ExecutionsApi();
let namespace = "namespace_example"; // String | The flow namespace
let id = "id_example"; // String | The flow id
let wait = false; // Boolean | If the server will wait the end of the execution
let tenant = "tenant_example"; // String | 
let opts = {
  'labels': ["null"], // [String] | The labels as a list of 'key:value'
  'revision': 56, // Number | The flow revision or latest if null
  'scheduleDate': new Date("2013-10-20T19:20:30+01:00"), // Date | Schedule the flow on a specific date
  'breakpoints': "breakpoints_example", // String | Set a list of breakpoints at specific tasks 'id.value', separated by a coma.
  'kind': new KestraIoKestraSdk.ExecutionKind() // ExecutionKind | Specific execution kind
};
apiInstance.createExecution(namespace, id, wait, tenant, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

::alert{type="info"}
**Notes:**  
- `wait: true` blocks until the execution completes; keep `false` for non-blocking calls.  
- Use `labels` (e.g., `["team:platform"]`) to tag executions for search/observability.  
- `scheduleDate` submits a future run; ensure delayed executions are enabled on your Kestra instance.  
- `breakpoints` pause at specific task IDs to debug step‑by‑step.  
- The response contains execution identifiers and status you can poll via the API.
::
