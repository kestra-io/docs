---
title: Kestra JavaScript SDK
icon: /docs/icons/api.svg
release: 1.0.0
---

## Install JavaScript SDK

There are two ways to install the Kestra JavaScript SDK: with Node.js and the browser.

### Node.js

For [Node.js](https://nodejs.org/), you need to publish the library as an [npm](https://www.npmjs.com/), please follow the procedure in ["Publishing npm packages"](https://docs.npmjs.com/getting-started/publishing-npm-packages). Once published, install it via:

```shell
npm install @kestra-io/kestra-sdk --save
```

and build the module with:

```shell
npm run build
```

#### Local development

To use the library locally without publishing to a remote npm registry, first install the dependencies by changing into the directory containing `package.json` (and this README). Let's call this `JAVASCRIPT_CLIENT_DIR`. Then run:

```shell
npm install
```

Next, [link](https://docs.npmjs.com/cli/link) it globally in npm with the following, also from `JAVASCRIPT_CLIENT_DIR`:

```shell
npm link
```

To use the link you just defined in your project, switch to the directory you want to use your @kestra-io/kestra-sdk from, and run:

```shell
npm link /path/to/<JAVASCRIPT_CLIENT_DIR>
```

Finally, you need to build the module:

```shell
npm run build
```

#### Git

If the library is hosted at a Git repository (for example, `https://github.com/GIT_USER_ID/GIT_REPO_ID`)
then install it via:

```shell
npm install GIT_USER_ID/GIT_REPO_ID --save
```

### Browser installation

The library also works in the browser environment via `npm` and [browserify](http://browserify.org/). After following the above steps with Node.js and installing browserify with `npm install -g browserify`,
perform the following (assuming `*main.js*` is your entry file):

```shell
browserify main.js > bundle.js
```

Then include `*bundle.js*` in the HTML pages.

## Getting Started

After installation, execute the following JavaScript code to begin using the SDK:

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

## Create flow

Use the following JavaScript to [create or update a flow](https://github.com/kestra-io/client-sdk/blob/main/javascript-sdk/docs/FlowsApi.md#createflow):

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

## Execute a flow

The following executes a flow using the [createExecution model](https://github.com/kestra-io/client-sdk/blob/main/javascript-sdk/docs/ExecutionsApi.md#createexecution):

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
