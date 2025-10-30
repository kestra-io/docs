---
title: Kestra Python SDK
icon: /docs/icons/api.svg
release: 1.0.0
---

## Install the Python SDK

This example demonstrates how to use the Kestra Python SDK to create and execute a flow.  
Before starting, make sure your Kestra instance is running and accessible via the `KESTRA_HOST` environment variable.  
You should also set your username and password in a `.env` file, for example:

```
KESTRA_HOST=http://localhost:8080
KESTRA_USERNAME=admin@kestra.io
KESTRA_PASSWORD=Admin1234
```

### Set up your environment

Create a virtual environment and install the [Kestra Python SDK](https://github.com/kestra-io/client-sdk/blob/main/README_PYTHON_SDK.md), where `kestrapy` is the core package:

```shell
uv venv
source .venv/bin/activate
uv pip install kestrapy
uv pip install python-dotenv # For loading auth environment variables from .env file
```

::alert{type="info"}
**Tip:** Using `python-dotenv` allows you to store credentials securely and load them automatically when your script runs.
::

### Set up the configuration

Replace the following variables with your `host`, `username`, and `password` to set up the configuration for the Kestra Client:

```python
# Setup the config
configuration = Configuration()
configuration.host = "http://localhost:8080"
configuration.username = "root@root.com"
configuration.password = "Root!1234"
```
Once set, create the client with:

```python
kestra_client = KestraClient(configuration)
```

and begin using methods.

---

## Create a flow

Use the following Python script to create a simple Sleep task flow.
This example uses the [`create_flow` method](https://github.com/kestra-io/client-sdk/blob/main/python-sdk/docs/FlowsApi.md#create_flow).

```python
def create_flow():
    flow_id = "my_flow"
    namespace = "my_namespace"
    tenant = "main"

    body = f"""id: {flow_id}
namespace: {namespace}

tasks:
  - id: hello
    type: io.kestra.plugin.core.flow.Sleep
    duration: PT1S
"""
    created = kestra_client.flows.create_flow(tenant=tenant, body=body)
```

After running this script, you’ll see a new flow in the Kestra UI with the ID **`my_flow`** that runs a Sleep task.

::alert{type="info"}
**Notes:**  
- If your script defines a flow with matching `id`, `namespace`, and `tenant`, then an error is thrown. Use the `update_flow` method below to update an existing flow.
- Ensure the tenant and namespace values match your Kestra configuration.  
- You can modify the flow YAML to include additional tasks or parameters (this script is a basic example template).
::

---
## Update a flow

Use the following Python script to update a flow with a log message.

```python
def update_flow():
    flow_id = "my_flow"
    namespace = "my_namespace"
    tenant = "main"

    body_updated = f"""id: {flow_id}
namespace: {namespace}

tasks:
  - id: hello
    type: io.kestra.plugin.core.log.Log
    message: "updated message"
"""
    updated = kestra_client.flows.update_flow(id=created_id, namespace=namespace, tenant=tenant, body=body_updated)
```

::alert{type="info"}
**Notes:**  
- Ensure your script defines a flow with matching `id`, `namespace`, and `tenant` to the desired existing flow. If the flow does not exist, it'll result in an error.
- You can modify the flow YAML to include additional tasks or parameters (this script is a basic example template).
::

## Execute a flow

You can also execute flows programmatically using the [`create_execution` method](https://github.com/kestra-io/client-sdk/blob/main/python-sdk/docs/ExecutionsApi.md#create_execution).

```python
def create_execution():
    flow_id = "my_flow"
    namespace = "my_namespace"
    tenant = "main"

    inputs = {"input_id": "value"}

    execution = kestra_client.executions.create_execution(tenant=tenant, namespace=namespace, flow_id=flow_id, multipart_form_datas=inputs)
```

::alert{type="info"}
**Notes:**  
- You can modify the `inputs` for the execution depending on your flow requirements.
- Use the returned execution ID to monitor progress or fetch logs.  
::

## Follow an execution

Use the following `follow_execution` method to follow a created execution's progress.
```python
def follow_execution():
    flow_id = "my_flow"
    namespace = "my_namespace"
    tenant = "main"

    execution = kestra_client.executions.create_execution(namespace=namespace, id=flow_id, wait=False, tenant=tenant)

    following = kestra_client.executions.follow_execution(execution_id=execution.id, tenant=tenant)

    for event in following:
        print(event)
```

::alert{type="info"}
**Notes:**  
- Make sure you correctly capture the execution ID of the created execution to follow its progress.
::

---

## Next steps

- Check the [Kestra Python SDK reference](https://github.com/kestra-io/client-sdk/tree/main/python-sdk) for all available APIs.  
- Combine flow creation and execution for automation pipelines.  
- Use [Kestra CLI](https://kestra.io/docs/cli/) alongside the SDK for more advanced workflows.
