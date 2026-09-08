---
title: Subflows in Kestra – Modularize and Reuse Flows
h1: Call Flows from Other Flows and Build Reusable Components
description: Modularize your Kestra workflows with Subflows. Learn to call flows from other flows, pass inputs and outputs, and build reusable orchestration components.
sidebarTitle: Subflows
icon: /src/contents/docs/icons/flow.svg
---

Subflows let you build modular and reusable workflow components.

They work like function calls: executing a subflow creates a new flow run from within another flow.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/ZIwgNNtUf64?si=pCPFFFEgmuo77Zy8" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Why use a subflow?

For example, you might define a subflow that handles error alerts by posting to Slack and email. Any flow that needs error notifications calls this subflow rather than duplicating those tasks.

## How to declare a subflow

Use the `io.kestra.plugin.core.flow.Subflow` task and specify the `flowId` and `namespace` of the flow to execute. Pass custom `inputs` the same way you would pass arguments to a function.

The `wait` and `transmitFailed` properties control execution behavior. If `wait` is `false`, the parent flow continues without waiting for the subflow to finish. `transmitFailed` determines whether a failure in the subflow causes the parent flow to fail.

:::alert{type="warning"}
Recursive flows are not supported. A flow cannot call itself directly or indirectly — any cycle makes the flow invalid and risks infinite loops and unbounded fan-out.

**Do instead:** Use **[Loop](/plugins/core/flow/io.kestra.plugin.core.flow.loop)** and **[branching flowable](../01.tasks/00.flowable-tasks/index.md)** tasks to iterate or split work without creating cycles (e.g., [LoopUntil](/plugins/core/flow/io.kestra.plugin.core.flow.loopuntil)).
:::

## Practical example

A subflow can encapsulate business logic that is reusable across flows and easy to test in isolation:

```yaml
id: critical_service
namespace: company.team

tasks:
  - id: return_data
    type: io.kestra.plugin.jdbc.duckdb.Query
    sql: |
      INSTALL httpfs;
      LOAD httpfs;
      SELECT sum(total) as total, avg(quantity) as avg_quantity
      FROM read_csv_auto('https://huggingface.co/datasets/kestra/datasets/raw/main/csv/orders.csv', header=True);
    store: true

outputs:
  - id: some_output
    type: STRING
    value: "{{ outputs.return_data.uri }}"
```

Here, `return_data` outputs the URI of the stored query result — a reference to its location in Kestra's internal storage. The parent flow can pass this URI to downstream tasks for further processing.

```yaml
id: parent_service
namespace: company.team

tasks:
  - id: subflow_call
    type: io.kestra.plugin.core.flow.Subflow
    namespace: company.team
    flowId: critical_service
    wait: true
    transmitFailed: true

  - id: log_subflow_output
    type: io.kestra.plugin.scripts.shell.Commands
    taskRunner:
      type: io.kestra.plugin.core.runner.Process
    commands:
      - cat "{{ outputs.subflow_call.outputs.some_output }}"
```

The `outputs` map task IDs to their results. Here, the parent flow accesses the `some_output` value from the `subflow_call` task.

## Subflow properties

`io.kestra.plugin.core.flow.Subflow` task properties:

| Field                  | Description                                                                 |
|------------------------|-----------------------------------------------------------------------------|
| `flowId`               | The subflow's identifier                                                   |
| `namespace`            | The namespace where the subflow is located                                 |
| `inheritLabels`        | Determines if the subflow inherits labels from the parent (default: false). |
| `inputs`               | Inputs passed to the subflow                                               |
| `labels`               | Labels assigned to the subflow                                             |
| `outputs` (deprecated) | Passes subflow outputs to the parent flow. Use [flow outputs](../06.outputs/index.md#pass-data-between-flows-using-flow-outputs) instead. |
| `revision`             | The subflow revision to execute (defaults to the latest)                   |
| `scheduleDate`         | Schedule subflow execution on a specific date rather than immediately.      |
| `transmitFailed`       | If true, parent flow fails on subflow failure (requires `wait` to be true). |
| `wait`                 | If true, parent flow waits for subflow completion (default: true).         |


## Passing data between parent and child flows

Any flow can emit outputs accessible to the parent flow. For more details and examples, see the [Outputs page](../06.outputs/index.md#pass-data-between-flows-using-flow-outputs).

### Accessing outputs from a subflow execution

Outputs include the execution ID, extracted outputs, and the final state (if `wait` is true). For example:

```yaml
id: flow_outputs
namespace: company.team

tasks:
  - id: mytask
    type: io.kestra.plugin.core.debug.Return
    format: this is a task output used as a final flow output

outputs:
  - id: final
    type: STRING
    value: "{{ outputs.mytask.value }}"
```

Access these outputs in the parent flow:

```yaml
id: parent_flow
namespace: company.team

tasks:
  - id: subflow
    type: io.kestra.plugin.core.flow.Subflow
    flowId: flow_outputs
    namespace: company.team
    wait: true

  - id: log_subflow_output
    type: io.kestra.plugin.core.log.Log
    message: "{{ outputs.subflow.outputs.final }}"
```


### Passing inputs to a subflow

The example below passes a URL input from the parent flow into the subflow.

Subflow:
```yaml
id: subflow_example
namespace: company.team

inputs:
  - id: http_uri
    type: STRING

tasks:
  - id: download
    type: io.kestra.plugin.core.http.Request
    uri: "{{ inputs.http_uri }}"

  - id: log
    type: io.kestra.plugin.core.log.Log
    message: "{{ outputs.download.body }}"

outputs:
  - id: data
    type: STRING
    value: "{{ outputs.download.body }}"
```

Parent flow:
```yaml
id: inputs_subflow
namespace: company.team

inputs:
  - id: url
    type: STRING

tasks:
  - id: subflow
    type: io.kestra.plugin.core.flow.Subflow
    flowId: subflow_example
    namespace: company.team
    inputs:
      http_uri: "{{ inputs.url }}"
    wait: true

  - id: hello
    type: io.kestra.plugin.core.log.Log
    message: "{{ outputs.subflow.outputs.data }}"
```


#### Nested inputs

In the example below, the flow extracts JSON data from a REST API and passes it to a subflow as a nested input:

```yaml
id: extract_json
namespace: company.team

tasks:
  - id: api
    type: io.kestra.plugin.core.http.Request
    uri: https://dummyjson.com/users

  - id: read_json
    type: io.kestra.plugin.core.log.Log
    message: "{{ outputs.api.body }}"

  - id: subflow
    type: io.kestra.plugin.core.flow.Subflow
    namespace: company.team
    flowId: subflow
    inputs:
      users.firstName: "{{ outputs.api.body | jq('.users') | first | first | jq('.firstName') | first }}"
      users.lastName: "{{ outputs.api.body | jq('.users') | first | first | jq('.lastName') | first }}"
    wait: true
    transmitFailed: true
```

To provide type validation to extracted JSON fields, you can use [nested inputs](../05.inputs/index.md#nested-inputs) in the subflow definition:

```yaml
id: subflow
namespace: company.team

inputs:
  - id: users.firstName
    type: STRING
    defaults: Rick

  - id: users.lastName
    type: STRING
    defaults: Astley

tasks:
  - id: process_user_data
    type: io.kestra.plugin.core.log.Log
    message: hello {{ inputs.users }}
```

You can then pass the entire `users` object, including nested fields, to any task in the subflow.
