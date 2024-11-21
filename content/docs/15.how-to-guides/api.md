---
title: Extend Kestra with the API
icon: /docs/icons/api.svg
stage: Intermediate
topics:
  - Kestra Workflow Components
---

Extend Kestra by using the API.

Kestra is built with an API-first design in mind, with a powerful API allowing you to connect Kestra to 3rd party systems. Whether that's through your flows directly or using the Kestra API, there's lots of options.

In this guide, we're going to specifically look at the Kestra API and how that can enable you to extend Kestra and integrate it into other systems.

## Using the API Reference

In the documentation, there's references for both the [Open Source](../api-reference/open-source.md) as well as [Cloud & Enterprise APIs](../api-reference/enterprise.md) to make it easy to know what you can do. We're going to look at examples we can create with both references. When we open the [Open Source API Reference](../api-reference/open-source.md), we can see there's a number of sections to make it easy to navigate:

![api_reference](/docs/how-to-guides/api/api_reference.png)

## Create a Flow

To create a flow using the API, we can first go to the Flows section of the API Reference and see the `/api/v1/flows` POST Request which takes a YAML body with the Flow in it.

Our body of Content-Type `application/x-yaml` will look like the example below:
```yaml
id: created_by_api
namespace: company.team

tasks:
  - id: hello
    type: io.kestra.plugin.core.log.Log
    message: Hello World! 🚀
```

To make this request, we can use [cURL](https://en.wikipedia.org/wiki/CURL) in the command line:

```bash
curl -X POST http://localhost:8084/api/v1/flows -H "Content-Type:application/x-yaml" -d "id: created_by_api
namespace: company.team

tasks:
  - id: hello
    type: io.kestra.plugin.core.log.Log
    message: Hello World! 🚀"
```

When we make this request, we will get a response like below:

```json
{
  "id": "created_by_api",
  "namespace": "company.team",
  "revision": 1,
  "disabled": false,
  "deleted": false,
  "tasks":
    [
      {
        "id": "hello",
        "type": "io.kestra.plugin.core.log.Log",
        "message": "Hello World! \uD83D\uDE80",
      },
    ],
  "source": "id: created_by_api\nnamespace: company.team\n\ntasks:\n  - id: hello\n    type: io.kestra.plugin.core.log.Log\n    message: Hello World! \uD83D\uDE80",
}
```

## Execute a Flow

To execute a flow, we need the namespace and flow ID. We have an example flow called `hello_world` in the `company.team` namespace with one string input:

```yaml
id: hello_world
namespace: company.team

inputs:
  - id: greeting
    type: STRING
    defaults: hey

tasks:
  - id: hello
    type: io.kestra.plugin.core.log.Log
    message: "{{ inputs.greeting }}"
```

As our input has a default value, we can execute it by simply making a POST request like below:

```bash
curl -X POST \
http://localhost:8080/api/v1/executions/company.team/hello_world
```

If we want to add an input as part of our request, we can add it as part of our form data with `-F`:

```bash
curl -X POST \
http://localhost:8080/api/v1/executions/company.team/hello_world \
-F greeting="hey there"
```

When we do this, it will return the following response:

```json
{
    "id": "MYkTmLrI36s10iVXHwRbR",
    "namespace": "company.team",
    "flowId": "hello_world",
    "flowRevision": 10,
    "inputs": {
        "greeting": "hey"
    },
    "labels": [
        {
            "key": "system.correlationId",
            "value": "MYkTmLrI36s10iVXHwRbR"
        }
    ],
    "state": {
        "current": "CREATED",
        "histories": [
            {
                "state": "CREATED",
                "date": "2024-11-21T16:31:27.943162175Z"
            }
        ],
        "duration": 0.044177500,
        "startDate": "2024-11-21T16:31:27.943162175Z"
    },
    "originalId": "MYkTmLrI36s10iVXHwRbR",
    "deleted": false,
    "metadata": {
        "attemptNumber": 1,
        "originalCreatedDate": "2024-11-21T16:31:27.943194342Z"
    },
    "url": "http://localhost:8080//ui/executions/company.team/hello_world/MYkTmLrI36s10iVXHwRbR"
}
```

For more examples on executing with the API, check out the [Executions documentation](../04.workflow-components/03.execution.md#execute-a-flow-via-an-api-call)

## Get Information from an Execution

When we execute a flow with the API, our response includes the Execution ID from that execution. This means we can use this to fetch more information about the Execution, especially once it's completed. In the previous example, the execution ID generated was `MYkTmLrI36s10iVXHwRbR` so let's use that to get an updated status on the execution:

```bash
curl -X GET http://localhost:8084/api/v1/executions/MYkTmLrI36s10iVXHwRbR
```

The response received includes everything about the execution including the times the state changed, and any outputs generated:

::collapse{title="Response Body"}
```json
{
    "id": "MYkTmLrI36s10iVXHwRbR",
    "namespace": "company.team",
    "flowId": "hello_world",
    "flowRevision": 10,
    "taskRunList": [
        {
            "id": "1ZSXuswTiOeLggIwxT3V98",
            "executionId": "MYkTmLrI36s10iVXHwRbR",
            "namespace": "company.team",
            "flowId": "hello_world",
            "taskId": "hello",
            "attempts": [
                {
                    "state": {
                        "current": "SUCCESS",
                        "histories": [
                            {
                                "state": "CREATED",
                                "date": "2024-11-21T16:31:29.463Z"
                            },
                            {
                                "state": "RUNNING",
                                "date": "2024-11-21T16:31:29.463Z"
                            },
                            {
                                "state": "SUCCESS",
                                "date": "2024-11-21T16:31:29.512Z"
                            }
                        ],
                        "duration": 0.049000000,
                        "startDate": "2024-11-21T16:31:29.463Z",
                        "endDate": "2024-11-21T16:31:29.512Z"
                    }
                }
            ],
            "outputs": {},
            "state": {
                "current": "SUCCESS",
                "histories": [
                    {
                        "state": "CREATED",
                        "date": "2024-11-21T16:31:28.455Z"
                    },
                    {
                        "state": "RUNNING",
                        "date": "2024-11-21T16:31:29.448Z"
                    },
                    {
                        "state": "SUCCESS",
                        "date": "2024-11-21T16:31:29.512Z"
                    }
                ],
                "duration": 1.057000000,
                "startDate": "2024-11-21T16:31:28.455Z",
                "endDate": "2024-11-21T16:31:29.512Z"
            }
        }
    ],
    "inputs": {
        "greeting": "hey"
    },
    "labels": [
        {
            "key": "system.correlationId",
            "value": "MYkTmLrI36s10iVXHwRbR"
        }
    ],
    "state": {
        "current": "SUCCESS",
        "histories": [
            {
                "state": "CREATED",
                "date": "2024-11-21T16:31:27.943Z"
            },
            {
                "state": "RUNNING",
                "date": "2024-11-21T16:31:28.463Z"
            },
            {
                "state": "SUCCESS",
                "date": "2024-11-21T16:31:30.474Z"
            }
        ],
        "duration": 2.531000000,
        "startDate": "2024-11-21T16:31:27.943Z",
        "endDate": "2024-11-21T16:31:30.474Z"
    },
    "originalId": "MYkTmLrI36s10iVXHwRbR",
    "deleted": false,
    "metadata": {
        "attemptNumber": 1,
        "originalCreatedDate": "2024-11-21T16:31:27.943Z"
    }
}
```
::

We can modify our flow to generate an output like so:

```yaml
id: hello_world
namespace: company.team

tasks:
  - id: hello
    type: io.kestra.plugin.core.debug.Return
    format: "This is an output"

```

When we fetch the data from this execution, we get the following response:

::collapse{title="Response Body"}
```json
{
    "id": "59uQXHbkMy5YwHEDom72Xv",
    "namespace": "company.team",
    "flowId": "hello_world",
    "flowRevision": 13,
    "taskRunList": [
        {
            "id": "4G8EJhI2IwTdlHYi250h7m",
            "executionId": "59uQXHbkMy5YwHEDom72Xv",
            "namespace": "company.team",
            "flowId": "hello_world",
            "taskId": "hello",
            "attempts": [
                {
                    "state": {
                        "current": "SUCCESS",
                        "histories": [
                            {
                                "state": "CREATED",
                                "date": "2024-11-21T17:09:42.016Z"
                            },
                            {
                                "state": "RUNNING",
                                "date": "2024-11-21T17:09:42.016Z"
                            },
                            {
                                "state": "SUCCESS",
                                "date": "2024-11-21T17:09:42.045Z"
                            }
                        ],
                        "duration": 0.029000000,
                        "startDate": "2024-11-21T17:09:42.016Z",
                        "endDate": "2024-11-21T17:09:42.045Z"
                    }
                }
            ],
            "outputs": {
                "value": "This is an output"
            },
            "state": {
                "current": "SUCCESS",
                "histories": [
                    {
                        "state": "CREATED",
                        "date": "2024-11-21T17:09:40.937Z"
                    },
                    {
                        "state": "RUNNING",
                        "date": "2024-11-21T17:09:41.967Z"
                    },
                    {
                        "state": "SUCCESS",
                        "date": "2024-11-21T17:09:42.053Z"
                    }
                ],
                "duration": 1.116000000,
                "startDate": "2024-11-21T17:09:40.937Z",
                "endDate": "2024-11-21T17:09:42.053Z"
            }
        }
    ],
    "labels": [
        {
            "key": "system.correlationId",
            "value": "59uQXHbkMy5YwHEDom72Xv"
        }
    ],
    "state": {
        "current": "SUCCESS",
        "histories": [
            {
                "state": "CREATED",
                "date": "2024-11-21T17:09:40.204Z"
            },
            {
                "state": "RUNNING",
                "date": "2024-11-21T17:09:40.942Z"
            },
            {
                "state": "SUCCESS",
                "date": "2024-11-21T17:09:42.994Z"
            }
        ],
        "duration": 2.790000000,
        "startDate": "2024-11-21T17:09:40.204Z",
        "endDate": "2024-11-21T17:09:42.994Z"
    },
    "originalId": "59uQXHbkMy5YwHEDom72Xv",
    "deleted": false,
    "metadata": {
        "attemptNumber": 1,
        "originalCreatedDate": "2024-11-21T17:09:40.204Z"
    },
    "scheduleDate": "2024-11-21T17:09:40.181Z"
}
```
::

## Making Requests with Authentication

If you have [Basic Auth enabled](../configuration/index.md#http-basic-authentication), or you're using the [Enterprise Edition](/enterprise), you will need to add authentication to your requests. You can easily do this using the `-u` argument and passing our username and password in using the following format `username:password`. This example uses the default username and password inside of the [Kestra Docker Compose](../02.installation/03.docker-compose.md):

```bash
curl -X POST -u 'admin@kestra.io:kestra'  http://localhost:8084/api/v1/executions/company.team/hello_world
```

With the Enterprise Edition, you can generate [API Tokens](../06.enterprise/api-tokens.md) to authenticate when making requests, for example:

```bash
curl -X POST http://localhost:8080/api/v1/executions/company.team/hello_world \
-H "Authorization: Bearer YOUR_API_TOKEN"
```
