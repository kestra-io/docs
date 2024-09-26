---
title: Synchronous Executions API
icon: /docs/icons/tutorial.svg
stage: Intermediate
topics:
  - Integrations
---

Manage the Executions API Synchronously.

There are many use cases where you may want to trigger the flow and get the flow's output in the API's response. In other words, you want the Executions API to behave synchronously.

## Executions API

Executions API is capable of creating a parametrized flow execution. Say you have the following flow:

```yaml
id: myflow
namespace: company.team
tasks:
  - id: mytask
    type: io.kestra.plugin.core.debug.Return
    format: hello from kestra

outputs:
  - id: mydata
    type: STRING
    value: "{{ outputs.mytask.value }}"
    description: return some data
```

You invoke this flow using the Executions API as follows:

```
curl -X POST  http://localhost:8080/api/v1/executions/company.team/myflow
```

By default, the Executions API is asynchronous. It will invoke the execution of the flow, and return immediately with a response that includes the Execution ID and the time at which the execution was created:

```json
{
  "id": "1KWLxLeaXEXNDaXWP7YSKA",
  "namespace": "company.team",
  "flowId": "myflow",
  "flowRevision": 1,
  "state": {
    "current": "CREATED",
    "histories": [
      {
        "state": "CREATED",
        "date": "2024-07-12T05:07:28.447110427Z"
      }
    ],
    "duration": "PT0.002939292S",
    "startDate": "2024-07-12T05:07:28.447110427Z"
  },
  "originalId": "1KWLxLeaXEXNDaXWP7YSKA",
  "deleted": false,
  "metadata": {
    "attemptNumber": 1,
    "originalCreatedDate": "2024-07-12T05:07:28.447113302Z"
  }
}
```

## Synchronous Executions API

In order to wait for an execution to finish and return the outputs from the flow in the response, you can call the Executions API with the `wait=true` query parameter. This would make the API call synchronous, and you will receive all outputs in the response that are explicitly exposed in the flow. You can invoke the Executions API in a synchronous fashion as follows:

```
curl -X POST 'http://localhost:8080/api/v1/executions/company.team/myflow?wait=true'
```

Here is the output of this API invocation:

```json
{
  "id": "24znmto07B2ZGrI9IQoSSH",
  "namespace": "company.team",
  "flowId": "myflow",
  "flowRevision": 1,
  "taskRunList": [
    {
      "id": "4536yghIDGwqeRWZEE7AEE",
      "executionId": "24znmto07B2ZGrI9IQoSSH",
      "namespace": "company.team",
      "flowId": "myflow",
      "taskId": "mytask",
      "attempts": [
        {
          "state": {
            "current": "SUCCESS",
            "histories": [
              {
                "state": "CREATED",
                "date": "2024-07-12T05:13:42.140Z"
              },
              {
                "state": "RUNNING",
                "date": "2024-07-12T05:13:42.140Z"
              },
              {
                "state": "SUCCESS",
                "date": "2024-07-12T05:13:42.142Z"
              }
            ],
            "duration": "PT0.002S",
            "endDate": "2024-07-12T05:13:42.142Z",
            "startDate": "2024-07-12T05:13:42.140Z"
          }
        }
      ],
      "outputs": {
        "value": "hello from kestra"
      },
      "state": {
        "current": "SUCCESS",
        "histories": [
          {
            "state": "CREATED",
            "date": "2024-07-12T05:13:42.011Z"
          },
          {
            "state": "RUNNING",
            "date": "2024-07-12T05:13:42.140Z"
          },
          {
            "state": "SUCCESS",
            "date": "2024-07-12T05:13:42.144Z"
          }
        ],
        "duration": "PT0.133S",
        "endDate": "2024-07-12T05:13:42.144Z",
        "startDate": "2024-07-12T05:13:42.011Z"
      }
    }
  ],
  "outputs": {
    "mydata": "hello from kestra"   # ✅ this is the data that we returned in the flow
  },
  "state": {
    "current": "SUCCESS",
    "histories": [
      {
        "state": "CREATED",
        "date": "2024-07-12T05:13:41.789Z"
      },
      {
        "state": "RUNNING",
        "date": "2024-07-12T05:13:42.012Z"
      },
      {
        "state": "SUCCESS",
        "date": "2024-07-12T05:13:42.335Z"
      }
    ],
    "duration": "PT0.546S",
    "endDate": "2024-07-12T05:13:42.335Z",
    "startDate": "2024-07-12T05:13:41.789Z"
  },
  "originalId": "24znmto07B2ZGrI9IQoSSH",
  "deleted": false,
  "metadata": {
    "attemptNumber": 1,
    "originalCreatedDate": "2024-07-12T05:13:41.789Z"
  }
}
```

As expected, the API response returned the outputs from the flow. It also contains all execution states.

## Authentication

You can use the same authentication mechanism for this API call as applicable to the other Kestra's APIs.

### Basic Authentication

First, make sure to base64 encode your username and password. You can do this using the following command:

```bash
echo -n "username:password" | base64
```

Then, you can use the encoded string in the `Authorization` header:

```bash
curl -X POST 'http://localhost:8080/api/v1/executions/company.team/myflow?wait=true' -H 'Authorization: Basic <encoded-string>'
```

### API Token

If you're on the Enterprise Edition, you can use the API token for authentication. You can use the API token in the `Authorization` header as follows:

```bash
curl -X POST 'http://localhost:8080/api/v1/executions/company.team/myflow?wait=true' -H 'Authorization: Bearer YOUR_API_TOKEN'
```

Usually, you would need to include your tenant ID in the URL. Here is an example:

```bash
curl -X POST 'http://localhost:8080/api/v1/{tenant_id}/executions/company.team/myflow?wait=true' -H 'Authorization: Bearer YOUR_API_TOKEN'
```

For Kestra Cloud, this would be:

```bash
curl -X POST https://us.kestra.cloud/api/v1/YOUR_TENANT/executions/company.team/myflow?wait=true' -H 'Authorization: Bearer YOUR_API_TOKEN'
```

