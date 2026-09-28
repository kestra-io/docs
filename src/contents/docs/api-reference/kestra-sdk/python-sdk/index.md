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
KESTRA_PASSWORD='Root!1234'
```

Create a virtual environment and install the [Kestra Python SDK](https://github.com/kestra-io/client-sdk/blob/main/python/python-sdk/README.md). The SDK requires Python 3.9 or later.

```shell
uv venv
source .venv/bin/activate
uv pip install kestrapy regex
uv pip install python-dotenv  # optional: loads the .env file into environment variables
```

If you don't use `uv`, `pip install kestrapy regex` works the same way.

:::alert{type="info"}
`kestrapy` 2.0.1 imports the `regex` package but does not declare it as a dependency, so install `regex` alongside it. Without it, `import kestrapy` fails with `ModuleNotFoundError: No module named 'regex'`.
:::

## Configure the client

Import and initialize the client with your Kestra credentials. Construct `KestraClient` once and reuse it throughout your application.

The SDK does not read environment variables on its own. Load the `.env` file with `python-dotenv` and pass the values explicitly:

```python
import os

from dotenv import load_dotenv
from kestrapy import Configuration, KestraClient

load_dotenv()

configuration = Configuration(
    host=os.environ["KESTRA_HOST"],
    username=os.environ["KESTRA_USERNAME"],
    password=os.environ["KESTRA_PASSWORD"]
)

kestra_client = KestraClient(configuration)
```

To authenticate with an API token instead of a username and password, pass `host` and `token` as keyword arguments. The client sends the token as a `Bearer` authorization header:

```python
from kestrapy import KestraClient

kestra_client = KestraClient(host="http://localhost:8080", token="your-api-token")
```

:::alert{type="info"}
Use environment variables rather than hardcoding credentials. `KestraClient` only reads `host`, `username`, `password`, and `api_key["Authorization"]` from a `Configuration` object — other `Configuration` fields such as `access_token` are ignored. Use the `token` keyword argument for token-based authentication.
:::

---

## Configure timeouts

By default, requests wait indefinitely. Pass a `timeout` argument to `KestraClient` to limit how long requests wait before raising `requests.Timeout`.

Using a `Configuration` object:

```python
from kestrapy import Configuration, KestraClient

configuration = Configuration(host="http://localhost:8080", username="root@root.com", password="Root!1234")

kestra_client = KestraClient(configuration, timeout=30.0)        # float: connect + read combined
kestra_client = KestraClient(configuration, timeout=(10.0, 300.0))  # tuple: (connect, read)
kestra_client = KestraClient(configuration, timeout=None)        # None: no timeout (default)
```

Using keyword arguments directly:

```python
from kestrapy import KestraClient

kestra_client = KestraClient(host="http://localhost:8080", token="your-api-token", timeout=30.0)
kestra_client = KestraClient(host="http://localhost:8080", token="your-api-token", timeout=(10.0, 300.0))
kestra_client = KestraClient(host="http://localhost:8080", token="your-api-token", timeout=None)
```

The `timeout` value is forwarded directly to [`requests`](https://docs.python-requests.org/en/latest/user/advanced/#timeouts), so any form that `requests` accepts is valid.

---

## Create a flow

Pass the flow definition as a YAML string to [`create_flow`](https://github.com/kestra-io/client-sdk/blob/main/python/python-sdk/docs/FlowsApi.md#create_flow).

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

Trigger an execution using [`create_execution`](https://github.com/kestra-io/client-sdk/blob/main/python/python-sdk/docs/ExecutionsApi.md#create_execution).

The first three positional arguments are `tenant`, `namespace`, and `id` (the flow ID). All other parameters, such as `wait`, `labels`, and `inputs`, are optional; pass them as keyword arguments.

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

To pass inputs, use `inputs` with a dictionary keyed by input ID. String values are sent as-is, `bytes` values (or a `(filename, content)` tuple) are sent as files for `FILE` inputs, and other values such as numbers, booleans, lists, and dictionaries are JSON-encoded:

```python
def create_execution_with_inputs():
    tenant = "main"
    execution = kestra_client.executions.create_execution(
        namespace="my_namespace",
        id="my_flow",
        wait=True,
        tenant=tenant,
        inputs={"input_id": "value"}
    )
    print(f"Execution started: {execution.id}")
```

:::alert{type="info"}
`wait=True` blocks until the execution completes. Use `wait=False` for non-blocking calls. The `inputs` keys must match the flow's defined input IDs.
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
        if getattr(event, "state", None) is None:
            continue  # initial "start" event, without a state
        print(event.state.current)
```

:::alert{type="info"}
The first SSE event is a partial execution without a `state` attribute — skip it before processing subsequent events. The stream ends when the execution reaches a final state. Use `follow_execution` for CI/CD pipelines or real-time dashboards.
:::

---

## Read execution logs

### List logs

Fetch all log entries for a completed execution:

```python
def list_logs():
    tenant = "main"
    logs = kestra_client.logs.list_logs_from_execution(
        execution_id="your-execution-id",
        tenant=tenant,
    )
    for entry in logs:
        print(f"[{entry.level}] {entry.message}")
```

### Stream logs live

`follow_logs_from_execution` yields `LogEntry` items as the execution produces them. The server sends an initial keepalive frame with all fields `None` — skip entries where `execution_id` is `None`.

The server keeps the log stream open after the execution ends, so the loop never exits on its own. This example reads the stream in a background thread and returns once `follow_execution` reports that the execution has finished:

```python
import threading
import time

def follow_logs():
    tenant = "main"
    execution_id = "your-execution-id"

    def print_logs():
        for entry in kestra_client.logs.follow_logs_from_execution(
            execution_id=execution_id,
            tenant=tenant,
        ):
            if entry.execution_id is None:
                continue  # keepalive frame
            print(f"[{entry.level}] {entry.message}")

    threading.Thread(target=print_logs, daemon=True).start()

    # follow_execution ends when the execution reaches a final state
    for _ in kestra_client.executions.follow_execution(execution_id=execution_id, tenant=tenant):
        pass
    time.sleep(1)  # let the last log entries arrive
```

:::alert{type="info"}
The `min_level` parameter on `list_logs_from_execution` and `follow_logs_from_execution` is not applied by the Kestra 2.x server — pass no filter and filter on `entry.level` in your code if needed.
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

`search_triggers` is paginated; `page` and `size` are optional. It returns the raw JSON response as a dictionary: `results` holds one entry per trigger, each with a `trigger` (the trigger definition) and a `state` (its runtime state), and `total` holds the total count:

```python
def search_triggers():
    tenant = "main"
    result = kestra_client.triggers.search_triggers(
        page=1,
        size=50,
        tenant=tenant
    )
    for t in result["results"]:
        state = t["state"]
        print(f"{state['triggerId']}: disabled={state.get('disabled')}")
```

### Disable or enable a trigger

```python
from kestrapy.models import TriggerControllerApiTriggerId, TriggerControllerSetDisabledRequest

def disable_trigger():
    tenant = "main"
    request = TriggerControllerSetDisabledRequest(
        triggers=[
            TriggerControllerApiTriggerId(
                namespace="my_namespace",
                flow_id="my_flow",
                trigger_id="my_schedule"
            )
        ],
        disabled=True  # pass False to re-enable
    )
    kestra_client.triggers.disabled_triggers_by_ids(
        tenant=tenant,
        request=request
    )
    print(f"Trigger disabled: {request.disabled}")
```

### Unlock a trigger

Use `unlock_trigger` to unlock a trigger that is stuck in a locked state. If the trigger is not locked, the call raises a `ConflictException` (`409`):

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
    description: Dashboard created from the Python SDK
    timeWindow:
      default: P30D
      max: P365D
    charts: []
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

A test suite targets one flow through `flowId` and must define at least one entry in `testCases`. The flow must already exist. This example assumes `my_flow` has a `STRING` input `inputA` and a `return` task of type `io.kestra.plugin.core.debug.Return` that outputs it.

```python
def create_test_suite():
    tenant = "main"
    body = """
    id: my_tests
    namespace: my_namespace
    flowId: my_flow
    testCases:
      - id: returns_input
        type: io.kestra.core.tests.flow.UnitTest
        fixtures:
          inputs:
            inputA: "Hi there"
        assertions:
          - value: "{{ outputs.return.value }}"
            equalTo: "Hi there"
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
    print(f"Run: {result.id} State: {result.state}")
```

### Get test results

Pass the run ID returned by `run_test_suite`.

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

An `Execution` app runs the flow referenced by `namespace` and `flowId`, which must already exist, and renders a layout for each execution stage.

```python
def create_app():
    tenant = "main"
    body = """
    id: my_app
    type: io.kestra.plugin.ee.apps.Execution
    namespace: my_namespace
    flowId: my_flow
    displayName: My App
    layout:
      - on: OPEN
        blocks:
          - type: io.kestra.plugin.ee.apps.core.blocks.Markdown
            content: "# My App"
      - on: RUNNING
        blocks:
          - type: io.kestra.plugin.ee.apps.core.blocks.Markdown
            content: "Running..."
      - on: SUCCESS
        blocks:
          - type: io.kestra.plugin.ee.apps.core.blocks.Markdown
            content: "Done!"
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

## Handle errors

When the server responds with an HTTP error status, the SDK raises an `ApiException` (or a subclass such as `NotFoundException` for `404`, `ConflictException` for `409`, or `UnprocessableEntityException` for `422`, all importable from `kestrapy.exceptions`). The exception exposes the HTTP `status`, `reason`, and response `body`:

```python
from kestrapy import ApiException

def get_flow_safely():
    tenant = "main"
    try:
        flow = kestra_client.flows.flow(namespace="my_namespace", id="my_flow", tenant=tenant)
        print(f"Found flow: {flow.id}")
    except ApiException as e:
        print(f"Request failed: {e.status} {e.reason}")
```

---

## Best practices

- **Reuse your client:** construct one `KestraClient` per application and share it.
- **Avoid hardcoding credentials:** use environment variables or a secrets manager.
- **Validate YAML before submission:** invalid syntax causes `422` responses.
- **Combine `create_flow` and `create_execution`** for end-to-end CI/CD automation.
