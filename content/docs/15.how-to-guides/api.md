---
title: Extend Kestra with the API
icon: /docs/icons/api.svg
stage: Intermediate
topics:
  - Kestra Workflow Components
---

Extend Kestra by using the API.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/uf-b7r_38Zk?si=jytDjFPxqiomcveI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

---

Kestra is API-first, so it’s straightforward to connect external systems to your flows or call the platform directly. This guide focuses on the Kestra API itself and how you can extend or integrate Kestra from other services.

## Using the API Reference

The docs include references for both the [Open Source](../api-reference/02.open-source.md) and [Cloud & Enterprise](../api-reference/01.enterprise.md) APIs so you know exactly what endpoints are available. Opening the [Open Source reference](../api-reference/02.open-source.md) shows a structured layout that’s easy to scan:

![api_reference](/docs/how-to-guides/api/api_reference.png)

## Making Requests with Authentication

If you have [Basic Auth enabled](../configuration/index.md#http-basic-authentication) or you’re using the [Enterprise Edition](/enterprise), authenticate each request. With cURL you can pass credentials via `-u username:password`. The example below uses the defaults from the [Kestra Docker Compose](../02.installation/03.docker-compose.md):

```bash
curl -X POST -u 'admin@kestra.io:kestra' http://localhost:8080/api/v1/executions/company.team/hello_world
```

Enterprise users can generate [API tokens](../07.enterprise/03.auth/api-tokens.md) and send them as Bearer headers:

```bash
curl -X POST http://localhost:8080/api/v1/executions/company.team/hello_world \
-H "Authorization: Bearer YOUR_API_TOKEN"
```

The remaining examples assume authentication is disabled.

## Create a Flow

To create a flow via API, open the **Flows** section and look for the `/api/v1/main/flows` [POST endpoint](https://kestra.io/docs/api-reference/open-source#post-/api/v1/flows). It expects a YAML payload containing the flow definition.

Our body of Content-Type `application/x-yaml` will look like the example below:
```yaml
id: created_by_api
namespace: company.team

tasks:
  - id: hello
    type: io.kestra.plugin.core.log.Log
    message: Hello World! 🚀
```

Send the request with [cURL](https://en.wikipedia.org/wiki/CURL):

```bash
curl -X POST http://localhost:8080/api/v1/main/flows -H "Content-Type:application/x-yaml" -d "id: created_by_api
namespace: company.team

tasks:
  - id: hello
    type: io.kestra.plugin.core.log.Log
    message: Hello World! 🚀"
```

The response looks like this:

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

To execute a flow, provide the namespace and flow ID. The sample flow below (`hello_world`) lives in the `company.team` namespace and accepts a string input:

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

Because the input has a default, we can call the [POST endpoint](https://kestra.io/docs/api-reference/open-source#post-/api/v1/executions/-namespace-/-id-) `/api/v1/main/executions/{namespace}/{id}` without providing additional data:

```bash
curl -X POST \
http://localhost:8080/api/v1/main/executions/company.team/hello_world
```

To override inputs, send them as form data with `-F`:

```bash
curl -X POST \
http://localhost:8080/api/v1/main/executions/company.team/hello_world \
-F greeting="hey there"
```

The response includes execution metadata and a link to the UI:

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

See the [Executions documentation](../05.workflow-components/03.execution.md#execute-a-flow-via-an-api-call) for additional examples.

## Get Information from an Execution

The execution response returns the execution ID, which you can use to fetch additional details once the run completes. Using `MYkTmLrI36s10iVXHwRbR` from the earlier example, call the [GET endpoint](https://kestra.io/docs/api-reference/open-source#get-/api/v1/executions/-executionId-) `/api/v1/main/executions/{executionId}`:

```bash
curl -X GET http://localhost:8080/api/v1/main/executions/MYkTmLrI36s10iVXHwRbR
```

The response includes state transitions, durations, and outputs:

:::collapse{title="Response Body"}
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
:::

Modify the flow to emit an output:

```yaml
id: hello_world
namespace: company.team

tasks:
  - id: hello
    type: io.kestra.plugin.core.debug.Return
    format: "This is an output"

```

Fetching execution `59uQXHbkMy5YwHEDom72Xv` now shows the output payload:

:::collapse{title="Response Body"}
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
:::

## Accessing the KV Store

Kestra’s [KV Store](../06.concepts/05.kv-store.md) keeps flows stateful. You can create, update, and delete entries via the API—either from code running inside a flow or from external systems.

Add a key/value pair with the [PUT endpoint](https://kestra.io/docs/api-reference/open-source#put-/api/v1/namespaces/-namespace-/kv/-key-) `/api/v1/main/namespaces/{namespace}/kv/{key}`. The example below writes `"Hello, World"` to `my_key` in the `company.team` namespace:

```bash
curl -X PUT -H "Content-Type: application/json" http://localhost:8080/api/v1/main/namespaces/company.team/kv/my_key -d '"Hello, World"'
```
Verify in Kestra that the entry exists:

![kv_api](/docs/how-to-guides/api/kv_api.png)

Update the value by sending a different body, for example `"This is a modified value"`:

```bash
curl -X PUT -H "Content-Type: application/json" http://localhost:8080/api/v1/main/namespaces/company.team/kv/my_key -d '"This is a modified value"'
```

Kestra shows the key as updated:

![modified_kv](/docs/how-to-guides/api/modified_kv.png)

Opening the entry reveals the new value.

![modified_value_kv](/docs/how-to-guides/api/modified_value_kv.png)

Fetch the value with the [GET endpoint](https://kestra.io/docs/api-reference/open-source#get-/api/v1/namespaces/-namespace-/kv/-key-) `/api/v1/main/namespaces/{namespace}/kv/{key}`:

```bash
curl -X GET http://localhost:8080/api/v1/main/namespaces/company.team/kv/my_key
```

The response contains the type and value:

```json
{
    "type": "STRING",
    "value": "This is a modified value"
}
```

See the [KV Store documentation](../06.concepts/05.kv-store.md#api-how-to-create-read-update-and-delete-kv-pairs-via-rest-api) for more operations.

## Get and Upload Namespaces Files

Beyond flows, you can manage namespace files via the API.

Use the [GET endpoint](https://kestra.io/docs/api-reference/open-source#get-/api/v1/namespaces/-namespace-/files/directory) `/api/v1/main/namespaces/{namespace}/files/directory` to list files in a namespace:

![files](/docs/how-to-guides/api/files.png)

For `company.team`:

```bash
curl -X GET http://localhost:8080/api/v1/main/namespaces/company.team/files/directory
```

The response is an array of file metadata:

```json
[
    {
        "type": "File",
        "size": 13,
        "fileName": "example.txt",
        "lastModifiedTime": 1731430406183,
        "creationTime": 1731430400773
    },
    {
        "type": "File",
        "size": 27,
        "fileName": "example.js",
        "lastModifiedTime": 1731415024668,
        "creationTime": 1730997234841
    },
    {
        "type": "File",
        "size": 19,
        "fileName": "example.sh",
        "lastModifiedTime": 1731415024667,
        "creationTime": 1730997234839
    },
    {
        "type": "File",
        "size": 171,
        "fileName": "example.ion",
        "lastModifiedTime": 1731430044778,
        "creationTime": 1731430012804
    },
    {
        "type": "File",
        "size": 21,
        "fileName": "example.py",
        "lastModifiedTime": 1731415024667,
        "creationTime": 1729781670534
    }
]
```

Use the [GET endpoint](https://kestra.io/docs/api-reference/open-source#get-/api/v1/namespaces/-namespace-/files) `/api/v1/main/namespaces/{namespace}/files` to fetch file contents:

Example request for `example.txt`:

```bash
curl -X GET 'http://localhost:8080/api/v1/main/namespaces/company.team/files?path=example.txt'
```

which returns:

```
Hello, World!
```

Upload files using the [POST endpoint](https://kestra.io/docs/api-reference/open-source#post-/api/v1/namespaces/-namespace-/files) `/api/v1/main/namespaces/{namespace}/files`. The example below uploads `api_example.py` with the following content:

```python
import requests

r = requests.get("https://kestra.io")
print({r.status_code})
```

Run:

```bash
curl -X POST 'http://localhost:8080/api/v1/main/namespaces/company.team/files?path=api_example.py' -H "Content-Type:multipart/form-data" -F "fileContent=@api_example.py"
```

:::alert{type="info"}
**Note:** Make sure `fileContent` has the correct path to your file.
:::

After the upload, the file appears in the Namespace editor:

![upload_file](/docs/how-to-guides/api/upload_file.png)
