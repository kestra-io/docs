---
title: Flows FAQ
---

## Where does kestra store flows?

Flows are stored in a serialized format directly **in the Kestra backend database**.

The easiest way to add new flows is to add them directly from the [Kestra UI](../04.user-interface-guide/index.md). You can also use the [CI/CD](../05.developer-guide/13.cicd/index.md) to add flows automatically after a pull request is merged to a given Git branch.

To see how flows are represented in a file structure, you can leverage the `_flows` directory in the [Namespace Files](../05.developer-guide/namespace-files.md) editor.

### How to load flows at server startup?

If you want to load a given local directory of flows to be loaded into Kestra (e.g. during local development), you can use the `-f` or `--flow-path` flag when starting Kestra:

```bash
./kestra server standalone -f /path/to/flows
```

That path should point to a directory containing YAML files with the flow definition. These files will be loaded to the Kestra repository at startup. Kestra will make sure to add flows to the right namespace, as declared in the flow YAML definition.

For more information about the Kestra server CLI, check the [Administrator Guide](../09.administrator-guide/04.servers.md) section.

### Can I sync a local flows directory to be continuously loaded into Kestra?
At the time of writing, there is no syncing of a flows directory to Kestra. However, we are aware of that need and we are working on a solution. You can follow up in [this GitHub issue](https://github.com/kestra-io/kestra/issues/2403).

---

## How to trigger a flow?

There are multiple ways to trigger a flow.

### The `Execute` button in the UI

You can trigger a flow manually from the [Kestra UI](../04.user-interface-guide/index.md).

### Triggers

You can add a **[Schedule trigger](../03.concepts/triggers/schedule-trigger)** to automatically launch a flow execution at a regular time interval.

Alternatively, you can add a **[Flow trigger](../03.concepts/triggers/flow-trigger.md)** to automatically launch a flow execution when another flow execution is completed. This pattern is particularly helpful when you want to:
- Implement a centralized namespace-level error handling strategy, e.g. to send a notification when any flow execution fails in a production namespace. Check the [Alerting & Monitoring](../09.administrator-guide/03.monitoring/index.md) section for more details.
- Decouple your flows by following an event-driven pattern, in a backwards direction (_backwards because the flow is triggered by the completion of another flow; this is in contrast to the [subflow pattern](https://kestra.io/plugins/core/tasks/flows/io.kestra.core.tasks.flows.subflow), where a parent flow starts the execution of child flows and waits for the completion of each of them_).

Lastly, you can use the **[Webhook trigger](../03.concepts/triggers/03.webhook.md)** to automatically launch a flow execution when a given HTTP request is received. You can leverage the `{{ trigger.body }}` variable to access the request body and the `{{ trigger.headers }}` variable to access the request headers in your flow.

To launch a flow and send data to the flow's execution context from an external system using a webhook, you can send a POST request to the Kestra API using the following URL: `http://<kestra-host>:<kestra-port>/api/v1/executions/webhook/<namespace>/<flow-id>/<webhook-key>`. Here is an example: `http://localhost:8080/api/v1/executions/webhook/dev/hello-world/secretWebhookKey42`.

You can also pass inputs to the flow using the `inputs` query parameter.

### API calls

You can trigger a flow execution by calling the [API](../12.api-guide/index.md) directly. This is useful when you want to trigger a flow execution from another application or service.

Let's use the following flow as example:

```yaml
id: hello-world
namespace: dev

inputs:
  - name: greeting
    type: STRING
    defaults: hello

tasks:
  - id: hello
    type: io.kestra.core.tasks.log.Log
    message: "{{ inputs.greeting }}, kestra team wishes you a great day!"
```

Assuming that you run Kestra locally, you can trigger a flow execution by calling the ``executions/trigger`` endpoint:

```bash
curl -X POST http://localhost:8080/api/v1/executions/trigger/dev/hello-world
```

The above command will trigger an execution of the latest revision of the `hello-world` flow from the `dev` namespace. If you want to trigger an execution for a specific revision, you can use the `revision` query parameter:

```bash
curl -X POST http://localhost:8080/api/v1/executions/trigger/dev/hello-world?revision=6
```

You can also trigger a flow execution with inputs by passing the `inputs` query parameter:

```bash
curl -X POST http://localhost:8080/api/v1/executions/trigger/dev/hello-world -F greeting="hey there"
```


### Python SDK

You can also launch a flow using the [kestra pip package](https://github.com/kestra-io/libs). This is useful when you want to trigger a flow execution from a Python application or service.

First, install the package:

```bash
pip install kestra
```

Then, you can trigger a flow execution by calling the `execute()` method. Here is an exmaple for the same `hello-world` flow in the namespace `dev` as above:

```python
from kestra import Flow
flow = Flow()
flow.execute('dev', 'hello-world', {'greeting': 'hello from Python'})
```


---

## How to batch-process data in parallel at scale? Use the `ForEachItem` task!

The `ForEachItem` task allows you to iterate over a list of items and run a subflow for each item, or for each batch containing multiple items. This is useful when you want to process a large list of items in parallel, e.g. to process millions of records from a database table or an API payload.

The `ForEachItem` task is a **[Flowable](../01.tutorial/05.flowable.md)** task, which means that it can be used to define the flow logic and control the execution of the flow.

Syntax:

```yaml
  - id: each
    type: io.kestra.core.tasks.flows.ForEachItem
    items: "{{ inputs.file }}" # could be also an output variable {{ outputs.extract.uri }}
    inputs:
      file: "{{ taskrun.items }}" # items of the batch
    batch:
      rows: 4
      bytes: 1024
      partitions: 2
    namespace: dev
    flowId: subflow
    revision: 1 # optional (default: latest)
    wait: true # wait for the subflow execution
    transmitFailed: true # fail the task run if the subflow execution fails
    labels: # optional labels to pass to the subflow to be executed
      key: value
```

### Full end to end example

Subflow:

```yaml
id: subflow
namespace: qa

inputs:
  - name: items
    type: STRING

tasks:
  - id: for_each_item
    type: io.kestra.plugin.scripts.shell.Commands
    runner: PROCESS
    commands:
      - cat "{{ inputs.items }}"

  - id: read
    type: io.kestra.core.tasks.log.Log
    message: "{{ read(inputs.items) }}"
```

Flow that uses the `ForEachItem` task to iterate over a list of items and run the `subflow` for a batch of 10 items at a time:

```yaml
id: each_parent
namespace: qa

tasks:
  - id: extract
    type: io.kestra.plugin.jdbc.duckdb.Query
    sql: |
      INSTALL httpfs;
      LOAD httpfs;
      SELECT *
      FROM read_csv_auto('https://raw.githubusercontent.com/kestra-io/datasets/main/csv/orders.csv', header=True);
    store: true

  - id: each
    type: io.kestra.core.tasks.flows.ForEachItem
    items: "{{ outputs.extract.uri }}"
    batch:
      rows: 10
    namespace: qa
    flowId: subflow
    wait: true
    transmitFailed: true
    inputs:
      items: "{{taskrun.items}}"
```

