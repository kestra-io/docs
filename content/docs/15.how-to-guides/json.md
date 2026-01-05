---
title: Interacting with JSONs in Kestra 
icon: /docs/icons/api.svg
stage: Getting Started
topics:
  - Integrations
---

Interact with JSONs using expressions.

APIs often use JSON bodies to send data. Being able to interact with them inside of your workflows is crucial to any API related orchestration.

<div class="video-container">
    <iframe src="https://www.youtube.com/embed/OaZ5t5lqKO4?si=jf7opiGXlBho9JPj" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Making a Request Inside of Your Workflow

The API `https://kestra.io/api/mock` will return a JSON body that looks like the following:

```json
{
    "title":"Success",
    "method":"GET",
    "params":{},
    "code":200,
    "createdAt":"2025-07-04T15:42:29.545Z",
    "body":"Request processed successfully"
}
```


Kestra can make a request to this API using the `Request` task. This will give us an output called `body` containing our JSON body. To access this in later tasks, we can use an [expression](../expressions/index.md) like `{{ outputs.request.body }}`. This will return the full body:

```yaml
id: json_demo
namespace: company.team

tasks:
  - id: request
    type: io.kestra.plugin.core.http.Request
    uri: https://kestra.io/api/mock

  - id: log
    type: io.kestra.plugin.core.log.Log
    message: "My response: {{ outputs.request.body }}"
```

The log message returns:

```json
My response: {"title":"Success","method":"GET","params":{},"code":200,"createdAt":"2025-07-04T16:36:44.193Z","body":"Request processed successfully"}
```

## Accessing Part of the Body

However, if the body is large, we may only want to access a certain part of it. To do this, `jq` is required as the expression returns a string, not a JSON. Using `jq`, the JSON can be parsed and accessed:

```yaml
{{ outputs.request.body | jq('.title') | first }}
```

This will access the key `title` from the JSON. `jq` will return the result inside of an array when used within an expression. In order to access the value, the function `first` is added to the end of the expression, removing it from the array.

We can put that into the example:

```yaml
id: json_demo
namespace: company.team

tasks:
  - id: request
    type: io.kestra.plugin.core.http.Request
    uri: https://kestra.io/api/mock

  - id: log
    type: io.kestra.plugin.core.log.Log
    message: "My response: {{ outputs.request.body | jq('.title') | first }}"
```

The log message says `My response: Success`.

## Nested JSON

If the JSON you're working with has multiple levels, you can extend the `jq` expression.

In this example, the API `https://kestra.io/api/mock?example=test` has additional parameters which return the following body with nesting:

```json
{
  "title": "Success",
  "method": "GET",
  "params": {
    "example": "test"
  },
  "code": 200,
  "createdAt": "2025-07-04T16:39:02.871Z",
  "body": "Request processed successfully"
}
```

The `jq` expression can be extended as follows to access `example`:

```yaml
{{ outputs.request.body | jq('.params.example') | first }}
```

It looks like this when added to the workflow:

```yaml
id: json_demo
namespace: company.team

tasks:
  - id: request
    type: io.kestra.plugin.core.http.Request
    uri: https://kestra.io/api/mock?example=test

  - id: log
    type: io.kestra.plugin.core.log.Log
    message: "My response: {{ outputs.request.body | jq('.params.example') | first }}"
```

The log message returns `My response: test`.

## Debugging Expressions

You can use [Debug Expression](../05.workflow-components/06.outputs.md#using-debug-expression) to test expressions without running your workflow. This is useful if you want to be able to see different parts of the JSON easily.

![debug_outputs](/docs/how-to-guides/json/json1.png)
