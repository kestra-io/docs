---
title: Synchronous Executions API
icon: /docs/icons/tutorial.svg
---

There are use-cases wher you want to trigger the flow, and get the flow's output in the API's response. In other words, you want the Executions API to behave synchronously.

## Executions API

Firstly, let us take a quick look at the Executions API. Executions API is an API used to invoke a flow execution. Say you have the following flow:

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
% curl -X POST  http://localhost:8080/api/v1/executions/company.team/myflow
```

By default, the Executions API is asynchronous. It will invoke the execution of the flow, and return back with only the time at which the execution was invoked. The response you will get from the above API call will look like:

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

In case you would like the API to wait till the execution is complete, and return back with the outputs from the flow in the response, you can call the Executions API with `wait=true` query parameter. This would make the API call synchronous, and you will receive all the outputs in the response that are explicitly exposed in the flow. You can invoke the Executions API in synchronous fashion as follows:

```
% curl -X POST 'http://localhost:8080/api/v1/executions/company.team/myflow?wait=true'
```

The output of this API invocation will be as follows:

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

As you can see, the API waited for the execution to complete, and returns the outputs from the flow. It also contains the timeline of the complete lifecycle of the flow.

Note that you can use the same authentication mechanism for this API as applicable to the other APIs.
