---
title: "Python SDK for Kestra: Client Setup and Examples"
h1: Set Up the Kestra Python SDK and Execute Workflows
description: Integrate Kestra with your Python applications. Learn to set up the Kestra Python SDK, configure the client, and programmatically create and execute workflows.
sidebarTitle: Python SDK
icon: /src/contents/docs/icons/api.svg
release: 1.0.0
---

Use the Kestra Python SDK (`kestrapy`) to interact with the Kestra API from Python applications.

## Install the Python SDK

Before starting, make sure your Kestra instance is running. Store credentials in an `.env` file:

```bash
KESTRA_HOST=http://localhost:8080
KESTRA_USERNAME=root@root.com
KESTRA_PASSWORD=Root!1234
```

Create a virtual environment and install the [Kestra Python SDK](https://github.com/kestra-io/client-sdk/blob/main/README_PYTHON_SDK.md).

```shell
uv venv
source .venv/bin/activate
uv pip install kestrapy
uv pip install python-dotenv  # optional: loads .env automatically
```

## Configure the client

Import and initialize the client with your Kestra credentials. Construct `KestraClient` once and reuse it throughout your application.

```python
from kestrapy import Configuration, KestraClient

configuration = Configuration(
    host="http://localhost:8080",
    username="root@root.com",
    password="Root!1234"
)

kestra_client = KestraClient(configuration)
```

:::alert{type="info"}
Use environment variables rather than hardcoding credentials. You can also use token-based authentication by setting `access_token` on the `Configuration` object instead of `username`/`password`.
:::

---

## Create a flow

Pass the flow definition as a YAML string to [`create_flow`](https://github.com/kestra-io/client-sdk/blob/main/python-sdk/docs/FlowsApi.md#create_flow).

```python
def create_flow():
    tenant = "main"
    body = """
    id: my_flow
    namespace: my_namespace

    tasks:
      - id: hello
        type: io.kestra.plugin.core.log.Log
        message: "Hello World!"
    """
    created = kestra_client.flows.create_flow(tenant=tenant, body=body)
    print(f"Flow created: {created.id}")
```

:::alert{type="info"}
`body` must be valid YAML. If a flow with the same `id`, `namespace`, and `tenant` already exists, use `update_flow` instead.
:::

---

## Update a flow

Send the full YAML — including the same `id` and `namespace` — to replace an existing flow.

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

---

## Delete a flow

Remove a flow by its `namespace`, `id`, and `tenant`.

```python
def delete_flow():
    tenant = "main"
    kestra_client.flows.delete_flow(
        namespace="my_namespace",
        id="my_flow",
        tenant=tenant
    )
    print("Flow deleted")
```

:::alert{type="info"}
Deleting a flow removes its definition. Execution history is retained unless you delete executions separately.
:::

---

## Execute a flow

Trigger an execution using [`create_execution`](https://github.com/kestra-io/client-sdk/blob/main/python-sdk/docs/ExecutionsApi.md#create_execution).

The first three positional arguments are `namespace`, `id` (the flow ID), and `wait`.

```python
def create_execution():
    tenant = "main"
    execution = kestra_client.executions.create_execution(
        namespace="my_namespace",
        id="my_flow",
        wait=True,
        tenant=tenant
    )
    print(f"Execution started: {execution.id}")
```

To pass inputs, use `additional_form_datas` with a dictionary keyed by input ID:

```python
def create_execution_with_inputs():
    tenant = "main"
    execution = kestra_client.executions.create_execution(
        namespace="my_namespace",
        id="my_flow",
        wait=True,
        tenant=tenant,
        additional_form_datas={"input_id": "value"}
    )
    print(f"Execution started: {execution.id}")
```

:::alert{type="info"}
`wait=True` blocks until the execution completes. Use `wait=False` for non-blocking calls. The `additional_form_datas` keys must match the flow's defined input IDs.
:::

---

## Follow an execution

Stream live execution updates using `follow_execution`.

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
        if event.state is None:
            continue  # keepalive frame
        print(event.state.current)
```

:::alert{type="info"}
The first SSE payload is an empty keepalive — skip it before processing subsequent events. Use `follow_execution` for CI/CD pipelines or real-time dashboards.
:::

---

## KV Store

The KV Store lets you read and write key-value pairs scoped to a namespace.

### List keys

Use `list_all_keys` to get a paged list of keys across the tenant:

```python
def list_kv_keys():
    tenant = "main"
    result = kestra_client.kv.list_all_keys(
        page=1,
        size=50,
        tenant=tenant
    )
    for entry in result.results:
        print(f"Key: {entry.key}")
```

### Get a value

```python
def get_kv_value():
    tenant = "main"
    result = kestra_client.kv.key_value(
        namespace="my_namespace",
        key="my_key",
        tenant=tenant
    )
    print(f"Value: {result.value}")
```

### Set a value

```python
def set_kv_value():
    tenant = "main"
    kestra_client.kv.set_key_value(
        namespace="my_namespace",
        key="my_key",
        tenant=tenant,
        body="my_value"
    )
    print("Key set")
```

### Delete a key

```python
def delete_kv_key():
    tenant = "main"
    kestra_client.kv.delete_key_value(
        namespace="my_namespace",
        key="my_key",
        tenant=tenant
    )
    print("Key deleted")
```

---

## Manage triggers

Search, enable or disable, unlock, and restart triggers for flows.

### Search triggers

`search_triggers` is paginated and requires `page` and `size`:

```python
def search_triggers():
    tenant = "main"
    result = kestra_client.triggers.search_triggers(
        page=1,
        size=50,
        tenant=tenant
    )
    for t in result.results:
        print(f"{t.trigger_context.trigger_id}: disabled={t.trigger_context.disabled}")
```

### Disable or enable a trigger

```python
import datetime
from kestrapy.models import TriggerControllerSetDisabledRequest, Trigger

def disable_trigger():
    tenant = "main"
    request = TriggerControllerSetDisabledRequest(
        triggers=[
            Trigger(
                namespace="my_namespace",
                flow_id="my_flow",
                trigger_id="my_schedule",
                var_date=datetime.datetime.now(datetime.timezone.utc)
            )
        ],
        disabled=True  # pass False to re-enable
    )
    kestra_client.triggers.disabled_triggers_by_ids(
        tenant=tenant,
        trigger_controller_set_disabled_request=request
    )
    print("Trigger disabled")
```

### Unlock a trigger

Use `unlock_trigger` to unlock a trigger that is stuck in a locked state:

```python
def unlock_trigger():
    tenant = "main"
    kestra_client.triggers.unlock_trigger(
        namespace="my_namespace",
        flow_id="my_flow",
        trigger_id="my_schedule",
        tenant=tenant
    )
    print("Trigger unlocked")
```

### Restart a trigger

```python
def restart_trigger():
    tenant = "main"
    kestra_client.triggers.restart_trigger(
        namespace="my_namespace",
        flow_id="my_flow",
        trigger_id="my_schedule",
        tenant=tenant
    )
    print("Trigger restarted")
```

---

## Dashboards

Create, search, and delete dashboards.

### Create a dashboard

```python
def create_dashboard():
    tenant = "main"
    body = """
    id: my_dashboard
    title: My Dashboard
    """
    dashboard = kestra_client.dashboards.create_dashboard(tenant=tenant, yaml_body=body)
    print(f"Dashboard created: {dashboard.get('id')}")
```

### Search dashboards

```python
def search_dashboards():
    tenant = "main"
    result = kestra_client.dashboards.search_dashboards(tenant=tenant)
    for d in result.get('results', []):
        print(d.get('id'))
```

### Delete a dashboard

```python
def delete_dashboard():
    tenant = "main"
    kestra_client.dashboards.delete_dashboard(id="my_dashboard_id", tenant=tenant)
    print("Dashboard deleted")
```

---

## Namespace files

List, read, and delete files stored in a namespace.

### List files

```python
def list_files():
    tenant = "main"
    files = kestra_client.files.list_namespace_directory_files(
        namespace="my_namespace",
        tenant=tenant,
        path="/"
    )
    for f in files:
        print(f.file_name)
```

### Read file content

```python
def read_file():
    tenant = "main"
    content = kestra_client.files.file_content(
        namespace="my_namespace",
        path="/scripts/main.py",
        tenant=tenant,
        revision=None
    )
    print(f"Downloaded {len(content)} bytes")
```

### Delete a file

```python
def delete_file():
    tenant = "main"
    kestra_client.files.delete_file_directory(
        namespace="my_namespace",
        path="/scripts/main.py",
        tenant=tenant
    )
    print("File deleted")
```

---

## Test suites

:::alert{type="warning"}
Test suites require Kestra Enterprise Edition.
:::

Create, run, and fetch results for unit test suites.

### Create a test suite

```python
def create_test_suite():
    tenant = "main"
    body = """
    id: my_tests
    namespace: my_namespace
    flows:
      - flowId: my_flow
    """
    suite = kestra_client.test_suites.create_test_suite(tenant=tenant, yaml_body=body)
    print(f"Test suite created: {suite.id}")
```

### Run a test suite

```python
def run_test_suite():
    tenant = "main"
    result = kestra_client.test_suites.run_test_suite(
        namespace="my_namespace",
        id="my_tests",
        tenant=tenant
    )
    print(f"State: {result.state}")
```

### Get test results

```python
def get_test_result():
    tenant = "main"
    result = kestra_client.test_suites.test_result(id="run-id", tenant=tenant)
    print(f"State: {result.state}")
```

---

## Apps

:::alert{type="warning"}
Apps require Kestra Enterprise Edition.
:::

Create, enable, disable, and delete apps.

### Create an app

```python
def create_app():
    tenant = "main"
    body = """
    id: my_app
    title: My App
    """
    app = kestra_client.apps.create_app(tenant=tenant, yaml_body=body)
    print(f"App created: {app.uid}")
```

### Enable or disable an app

```python
def enable_app():
    tenant = "main"
    kestra_client.apps.enable_app(uid="app-uid", tenant=tenant)
    print("App enabled")

def disable_app():
    tenant = "main"
    kestra_client.apps.disable_app(uid="app-uid", tenant=tenant)
    print("App disabled")
```

### Delete an app

```python
def delete_app():
    tenant = "main"
    kestra_client.apps.delete_app(uid="app-uid", tenant=tenant)
    print("App deleted")
```

---

## Best practices

- **Reuse your client:** construct one `KestraClient` per application and share it.
- **Avoid hardcoding credentials:** use environment variables or a secrets manager.
- **Validate YAML before submission:** invalid syntax causes `422` responses.
- **Combine `create_flow` and `create_execution`** for end-to-end CI/CD automation.
