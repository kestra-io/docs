---
title: How To Pass Inputs via an API call in Kestra
icon: /docs/icons/tutorial.svg
---

Passing Inputs via an API Call

## What are Inputs

Inputs allow you to dynamically pass data to your execution at runtime. For a detailed overview of inputs, see the [Inputs](/docs/workflow-components/inputs) documentation page.

## Example

If you want to trigger a flow and change the value for an input, you can do so by triggering your flow by the API and passing your new input in the form data.

Let's assume the following flow:

```yaml
id: inputs_demo
namespace: dev

inputs:
  - id: user
    type: STRING
    defaults: Rick Astley

tasks:
  - id: hello
    type: io.kestra.core.tasks.log.Log
    message: Hey there, {{ inputs.user }}
```

This flow has the input `user` which we can modify via an API call. We can do that by triggering this flow and passing our new input using the form data.

```yaml
id: input_api
namespace: dev
tasks:
  - id: basic_auth_api
    type: io.kestra.plugin.fs.http.Request
    uri: http://host.docker.internal:8080/api/v1/executions/dev/inputs_demo
    method: POST
    contentType: multipart/form-data
    formData:
      user: John Doe
```

The above example assumes you are running Kestra locally in Docker. If you are running Kestra in a different environment, replace `http://host.docker.internal:8080` with the correct URL.

If you configured basic authentication for your Kestra instance, you can add the `basicAuthUser` and `basicAuthPassword` options to the `Request` task:

```yaml
id: api_call
namespace: dev
tasks:
  - id: basic_auth_api
    type: io.kestra.plugin.fs.http.Request
    uri: http://host.docker.internal:8080/api/v1/executions/dev/inputs_demo
    options:
      basicAuthUser: admin
      basicAuthPassword: admin
    method: POST
    contentType: multipart/form-data
    formData:
      user: John Doe
```

When you execute the `api_call` flow, this will execute the `input_api` flow with the new `user` input

![input_api_log](/docs/how-to-guides/inputs/input_api_log.png)