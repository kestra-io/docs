---
title: Kestra Python SDK
icon: /docs/icons/api.svg
release: 1.0.0
---
Interact with Kestra's API via Python SDK.

## Install the Python SDK

This guide demonstrates how to use the Kestra Python SDK to create and execute flows programmatically.  
Before starting, make sure your Kestra instance is running and accessible via the `KESTRA_HOST` environment variable.  
You can store credentials in an `.env` file:

```
KESTRA_HOST=http://localhost:8080
KESTRA_USERNAME=admin@kestra.io
KESTRA_PASSWORD=Admin1234
```

### Set up your environment

Create a virtual environment and install the [Kestra Python SDK](https://github.com/kestra-io/client-sdk/blob/main/README_PYTHON_SDK.md).  
`kestrapy` is the core package.

```shell
uv venv
source .venv/bin/activate
uv pip install kestrapy
uv pip install python-dotenv  # Optional: for loading .env variables automatically
```

::alert{type="info"}
**Tip:** Using `python-dotenv` allows you to store credentials securely and load them automatically when your script runs.
::

### Configure the client

Import and initialize the client with your Kestra credentials:

```python
from kestrapy import Configuration, KestraClient

configuration = Configuration(
    host="http://localhost:8080",
    username="root@root.com",
    password="Root!1234"
)

kestra_client = KestraClient(configuration)
```

::alert{type="info"}
**Notes:**  
- Use `.env` or environment variables for credentials (avoid hardcoding).  
- Configure either **basic** or **token-based** authentication.  
- Reuse a single `KestraClient` instance throughout your application.
::

---

## Create a flow

Use the following Python script to create a simple flow with a `Sleep` task.  
This example uses the [`create_flow` method](https://github.com/kestra-io/client-sdk/blob/main/python-sdk/docs/FlowsApi.md#create_flow).

```python
def create_flow():
    tenant = "main"
    body = """
    id: my_flow
    namespace: my_namespace

    tasks:
      - id: hello
        type: io.kestra.plugin.core.flow.Sleep
        duration: PT1S
    """
    created = kestra_client.flows.create_flow(tenant=tenant, body=body)
    print(f"Flow created: {created.id}")
```

::alert{type="info"}
**Notes:**  
- `body` must be valid YAML for a Kestra flow.  
- If a flow with the same `id`, `namespace`, and `tenant` already exists, use `update_flow` instead.  
- The response contains metadata for the created flow.
::

---

## Update a flow

Use the following Python script to update an existing flow.

```python
def update_flow():
    tenant = "main"
    body = """
    id: my_flow
    namespace: my_namespace

    tasks:
      - id: hello
        type: io.kestra.plugin.core.log.Log
        message: "Updated message!"
    """
    updated = kestra_client.flows.update_flow(
        id="my_flow",
        namespace="my_namespace",
        tenant=tenant,
        body=body
    )
    print(f"Flow updated: {updated.id}")
```

::alert{type="info"}
**Notes:**  
- You must provide the same `id`, `namespace`, and `tenant` as the target flow.  
- Updating requires sending the full YAML, including all inputs, tasks, and metadata.  
- Invalid YAML or missing fields will return a `4xx` error.
::

---

## Execute a flow

Execute flows programmatically using the [`create_execution` method](https://github.com/kestra-io/client-sdk/blob/main/python-sdk/docs/ExecutionsApi.md#create_execution).

```python
def create_execution():
    tenant = "main"
    execution = kestra_client.executions.create_execution(
        tenant=tenant,
        namespace="my_namespace",
        flow_id="my_flow",
        wait=True,
        inputs={"input_id": "value"}
    )
    print(f"Execution started: {execution.id}")
```

::alert{type="info"}
**Notes:**  
- `wait=True` blocks the call until the execution completes. Use `wait=False` for asynchronous runs.  
- `inputs` correspond to the flow’s defined input parameters.  
- The response includes execution details and the unique execution ID.
::

---

## Follow an execution

You can stream live execution updates using the `follow_execution` method.

```python
def follow_execution():
    tenant = "main"
    execution = kestra_client.executions.create_execution(
        namespace="my_namespace",
        id="my_flow",
        wait=False,
        tenant=tenant
    )

    for event in kestra_client.executions.follow_execution(
        execution_id=execution.id,
        tenant=tenant
    ):
        print(event.state.current)
```

::alert{type="info"}
**Notes:**  
- Use `follow_execution` to monitor running flows in real-time.  
- The stream yields execution state updates (e.g., RUNNING, SUCCESS, FAILED).  
- The first SSE payload is intentionally empty; it acts as a keepalive so you can ignore it before processing subsequent events.  
- Use this method in CI/CD, CLI tools, or real-time dashboards.
::

---

## Best practices

- **Reuse your client:** Initialize one `KestraClient` per application and share it.  
- **Avoid hardcoding credentials:** Use `.env` or environment variables.  
- **Validate YAML before submission:** Invalid syntax causes `422` responses.  
- **Automate your workflows:** Combine `create_flow` and `create_execution` for full CI/CD automation.  
