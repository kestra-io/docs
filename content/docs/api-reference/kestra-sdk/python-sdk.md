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

---

## Create a flow

Use the following Python script to create or update a flow that logs a message.  
This example uses the [`create_flow` method](https://github.com/kestra-io/client-sdk/blob/main/python-sdk/docs/FlowsApi.md#create_flow).

```python
import kestra_api_client
from dotenv import load_dotenv
import os
import json

# Load environment variables
load_dotenv()

# Configure client connection
configuration = kestra_api_client.Configuration(
    host=os.environ.get("KESTRA_HOST"),
    username=os.environ.get("KESTRA_USERNAME"),
    password=os.environ.get("KESTRA_PASSWORD")
)

api_client = kestra_api_client.ApiClient(configuration)
api_instance = kestra_api_client.FlowsApi(api_client)

tenant = 'main'
flow_id = 'sdk'
namespace = 'demo'

body = f"""id: {flow_id}
namespace: {namespace}
tasks:
  - id: hello
    type: io.kestra.plugin.core.log.Log
    message: Hello from the SDK! 👋
"""

try:
    api_response = api_instance.create_flow(tenant, body)
    print(api_response)
except kestra_api_client.rest.ApiException as e:
    if e.status == 422 and "Flow id already exists" in json.loads(e.body).get("message", ""):
        try:
            api_response = api_instance.update_flow(flow_id, namespace, tenant, body)
            print(api_response)
        except ValueError:
            print("Flow updated successfully")
    else:
        print(e)
```

After running this script, you’ll see a new flow in the Kestra UI with the ID **`sdk`** that logs a “Hello from the SDK!” message.

::alert{type="info"}
**Notes:**  
- The script attempts to update the flow automatically if it already exists.  
- Ensure the tenant and namespace values match your Kestra configuration.  
- You can modify the flow YAML to include additional tasks or parameters.
::

---

## Execute a flow

You can also execute flows programmatically using the [`create_execution` method](https://github.com/kestra-io/client-sdk/blob/main/python-sdk/docs/ExecutionsApi.md#create_execution).

```python
import kestrapy

def kestra_client():
    configuration = kestrapy.Configuration()
    configuration.host = "http://localhost:9902"
    configuration.username = "root@root.com"
    configuration.password = "Root!1234"

    return kestrapy.KestraClient(configuration)

def test_execute_flow():
    kestra = kestra_client()
    tenant = 'main'
    flow_id = 'create-execution'
    namespace = 'main'
    body = f"""
    id: {flow_id}
    namespace: {namespace}
    
    tasks:
      - id: hello
        type: io.kestra.plugin.core.log.Log
        message: Hello from the SDK! 👋
    """
    try:
        flow_deleted = kestra.flows.delete_flow(id=flow_id, namespace=namespace, tenant=tenant)
    except:
        print("Flow probably does not exist, continuing...")

    # Create and execute a new flow
    flow_created = kestra.flows.create_flow(tenant=tenant, body=body)
    print("Flow created:", flow_created)

    execution = kestra.executions.create_execution(namespace, flow_id, tenant)
    print("Execution started:", execution)
```

::alert{type="info"}
**Notes:**  
- The example first deletes any existing flow with the same ID to avoid conflicts.  
- You can modify the flow YAML and pass inputs dynamically.  
- Use the returned execution ID to monitor progress or fetch logs.  
- The SDK handles both basic authentication and bearer token authorization.
::

---

## Next steps

- Check the [Kestra Python SDK reference](https://github.com/kestra-io/client-sdk/tree/main/python-sdk) for all available APIs.  
- Combine flow creation and execution for automation pipelines.  
- Use [Kestra CLI](https://kestra.io/docs/cli/) alongside the SDK for more advanced workflows.
