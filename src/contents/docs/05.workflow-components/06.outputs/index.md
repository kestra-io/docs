---
title: "Workflow Outputs in Kestra: Share Data Between Tasks"
h1: Capture and Reuse Execution Results Across Tasks and Flows
description: Leverage Outputs in Kestra to share data between tasks and flows. Learn to capture, store, and reuse execution results and artifacts in your workflows.
icon: /src/contents/docs/icons/flow.svg
sidebarTitle: Outputs
---

Outputs let you pass data between tasks and flows.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/j6Iyn5rCeRI?si=2al6ZgqzfNqAJ0Wf" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

Outputs are stored in the flow's execution context and accessible by all downstream tasks and flows. Each task defines its own output attributes — see the task's plugin documentation for details, or inspect them in the **Input/Output** tab of the **Execution** page.

:::alert{type="warning"}
Do not use outputs to fetch sensitive data such as passwords, secrets, or API tokens. All data fetched via outputs is stored in clear text in the backend database, internal storage, logs, and API responses. Use [Secrets](../../06.concepts/04.secret/index.md) instead. Enterprise Edition and Kestra Cloud offer native integrations with [external secrets managers](../../07.enterprise/02.governance/secrets-manager/index.md).
:::

## Using outputs

Reference a previous task's output with `{{ outputs.<task_id>.<attribute> }}` in any dynamic property:

```yaml
id: task_outputs_example
namespace: company.team

tasks:
  - id: produce_output
    type: io.kestra.plugin.core.debug.Return
    format: my output {{ execution.id }}

  - id: use_output
    type: io.kestra.plugin.core.log.Log
    message: The previous task output is {{ outputs.produce_output.value }}
```

File outputs are previewable and downloadable from the execution's **Input/Output** tab; any output can be inspected and debugged using the built-in expression evaluator on the same tab. See [Outputs](../../03.tutorial/03.outputs/index.md) in the tutorial if you're unfamiliar with either. 

For loop iteration outputs, sibling task outputs, and the `loopOutputs()` function, see [Flowable tasks](../01.tasks/00.flowable-tasks/index.md#loop) and the [Loop how-to guide](../../15.how-to-guides/loop/index.md).

## Internal storage

Tasks that produce large results write them to Kestra's internal storage and return a URI. Pass that URI to downstream tasks:

```yaml
id: output_sample
namespace: company.team

tasks:
  - id: output_from_query
    type: io.kestra.plugin.gcp.bigquery.Query
    sql: |
      SELECT * FROM `bigquery-public-data.wikipedia.pageviews_2023`
      WHERE DATE(datehour) = current_date()
      ORDER BY datehour desc, views desc
      LIMIT 10
    store: true

  - id: write_to_csv
    type: io.kestra.plugin.serdes.csv.IonToCsv
    from: "{{ outputs.output_from_query.uri }}"
```

## Flow outputs

Flows can declare strongly typed outputs that are surfaced in the **Overview** tab and accessible to parent flows via the Subflow task:

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

Supported output types: `ARRAY`, `BOOLEAN`, `DATE`, `DATETIME`, `DURATION`, `EMAIL`, `ENUM`, `FILE`, `FLOAT`, `INT`, `JSON`, `MULTISELECT`, `SECRET`, `STRING`, `TIME`, `URI`, `YAML`.

### Pass data between flows

Access a child flow's declared outputs in the parent via `{{ outputs.<subflow_task_id>.outputs.<output_id> }}`:

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

The double `outputs` is intentional: the first accesses the Subflow task's outputs, the second accesses the child flow's declared output `final`.

### Return outputs conditionally

Use a ternary expression to return different outputs based on task state:

```yaml
id: conditionally_return_output
namespace: company.team

inputs:
  - id: run_task
    type: BOOL
    defaults: true

tasks:
  - id: main
    type: io.kestra.plugin.core.debug.Return
    format: Hello World!
    runIf: "{{ inputs.run_task }}"

  - id: fallback
    type: io.kestra.plugin.core.debug.Return
    format: fallback output

outputs:
  - id: flow_output
    type: STRING
    value: "{{ tasks.main.state != 'SKIPPED' ? outputs.main.value : outputs.fallback.value }}"
```

## Encrypted outputs

:::badge{version=">=0.23" editions="EE,Cloud"}
:::

Script tasks can emit encrypted outputs that are masked in the UI using the `encryptedOutputs` syntax:

```yaml
id: encrypted_output
namespace: company.team

tasks:
  - id: hello
    type: io.kestra.plugin.scripts.shell.Script
    script: |
      echo '::{"outputs":{"plaintext":"plaintext_value"}}::'
      echo '::{"encryptedOutputs":{"encrypted":"my secret value"}}::'

  - id: print
    type: io.kestra.plugin.core.log.Log
    message: "{{ outputs.hello['vars']['encrypted'] }}"
```

The `encrypted` output is stored and displayed encoded. See [Script outputs and metrics](../../16.scripts/06.outputs-metrics/index.md) for full details.
