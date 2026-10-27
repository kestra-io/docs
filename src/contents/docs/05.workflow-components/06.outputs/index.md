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

Outputs are stored in the flow's execution context and accessible by all downstream tasks and flows. Each task defines its own output attributes; see the task's plugin documentation for details, or inspect them in the **Input/Output** tab of the **Execution** page.

:::alert{type="warning"}
Do not use outputs to fetch sensitive data such as passwords, secrets, or API tokens. All data fetched via outputs is stored in clear text in the backend database, internal storage, logs, and API responses. Use [Secrets](../../06.concepts/04.secret/index.md) instead. Enterprise Edition and Kestra Cloud offer native integrations with [external secrets managers](../../07.enterprise/02.governance/secrets-manager/index.md).
:::

## Output reference syntax

Task outputs are referenced with `{{ outputs.<task_id>.<attribute> }}` in any dynamic property:

```yaml
id: task_outputs_example
namespace: company.team

tasks:
  - id: produce_output
    type: io.kestra.plugin.core.output.OutputValues
    values:
      result: my output {{ execution.id }}

  - id: use_output
    type: io.kestra.plugin.core.log.Log
    message: "The previous task output is {{ outputs.produce_output.values.result }}"
```

Use [OutputValues](/plugins/core/output/io.kestra.plugin.core.output.outputvalues) to emit named values for downstream tasks. Access each entry with `outputs.<task_id>.values.<key>`.

File outputs are previewable and downloadable from the execution's **Input/Output** tab; any output can be inspected and debugged using the built-in expression evaluator on the same tab. See [Outputs](../../03.tutorial/03.outputs/index.md) in the tutorial.

For loop iteration outputs, sibling task outputs, and the `loopOutputs()` function, see [Flowable tasks](../01.tasks/00.flowable-tasks/index.md#loop) and the [Loop how-to guide](../../15.how-to-guides/loop/index.md).

## Internal storage

Tasks that produce large results write them to Kestra's internal storage and return a URI. Downstream tasks reference the URI directly. For a full explanation of how internal storage works, including `fetchType` and file lifetime, see [Data Storage](../../06.concepts/11.storage/index.md).

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

Flows can declare strongly typed outputs that are surfaced in the **Overview** tab and accessible to parent flows via the [Subflow](/plugins/core/flow/io.kestra.plugin.core.flow.subflow) task:

```yaml
id: flow_outputs
namespace: company.team

tasks:
  - id: mytask
    type: io.kestra.plugin.core.output.OutputValues
    values:
      result: this is a task output used as a final flow output

outputs:
  - id: final
    type: STRING
    value: "{{ outputs.mytask.values.result }}"
```

Supported output types: `ARRAY`, `BOOL`, `DATE`, `DATETIME`, `DURATION`, `EMAIL`, `SELECT`, `FILE`, `FLOAT`, `INT`, `JSON`, `MULTISELECT`, `SECRET`, `STRING`, `TIME`, `URI`, `YAML`.

### Child flow output access

A child flow's declared outputs are accessible in the parent via `{{ outputs.<subflow_task_id>.outputs.<output_id> }}`:

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

### Conditional output values

A ternary expression selects between output values based on task state:

```yaml
id: conditionally_return_output
namespace: company.team

inputs:
  - id: run_task
    type: BOOL
    defaults: true

tasks:
  - id: main
    type: io.kestra.plugin.core.output.OutputValues
    values:
      result: Hello World!
    runIf: "{{ inputs.run_task }}"

  - id: fallback
    type: io.kestra.plugin.core.output.OutputValues
    values:
      result: fallback output

outputs:
  - id: flow_output
    type: STRING
    value: "{{ tasks.main.state != 'SKIPPED' ? outputs.main.values.result : outputs.fallback.values.result }}"
```

### Searchable outputs

:::badge{version=">=2.1" editions="OSS,EE,Cloud"}
:::

Set `searchable: true` on a flow output to find executions by its value, such as an order ID or a customer code. When the execution ends, Kestra stores the value in a separate index that the executions list can filter on.

```yaml
id: process_orders
namespace: company.sales

tasks:
  - id: parse
    type: io.kestra.plugin.core.output.OutputValues
    values:
      customerId: CUST-12
      orderIds:
        - ORD-8841
        - ORD-8842

outputs:
  - id: customerId
    type: STRING
    value: "{{ outputs.parse.values.customerId }}"
    searchable: true

  - id: orderIds
    type: ARRAY
    value: "{{ outputs.parse.values.orderIds }}"
    searchable: true
```

Kestra stores each item of an `ARRAY` output separately, so a search for `ORD-8841` finds this execution. [Labels](../08.labels/index.md) hold one value per key and can be changed after the execution ends. Searchable outputs can hold many values and are written once.

Searchable outputs follow these rules:

- **Types:** `STRING`, `EMAIL`, `SELECT`, `INT`, `FLOAT`, `BOOL`, `URI`, `DATE`, `DATETIME`, `TIME`, `DURATION`, and `ARRAY` of those scalar values. Saving a flow that marks an output of any other type as searchable fails with an error that names the output.
- **When values are stored:** at the end of the execution, in any final state, once the flow outputs render. A running execution has no searchable values yet. Executions of [Loop](../01.tasks/00.flowable-tasks/index.md#loop) iterations don't compute flow outputs, so only the execution that runs the Loop task stores searchable values.
- **Size limits:** each value is stored up to 2,048 characters, and an array up to its first 1,000 items. Kestra truncates longer values and arrays and logs a warning in the execution logs.
- **Errors:** if an array item is not a scalar value or the value can't be stored, Kestra logs an error and the output is not searchable. The execution state doesn't change.
- **Existing executions:** adding `searchable: true` to a flow applies to new executions only.
- **Cleanup:** purging executions, for example with the [PurgeExecutions](/plugins/core/execution/io.kestra.plugin.core.execution.purgeexecutions) task, also removes their searchable values.

<!-- TODO(runtime, 2.1 RC): verify the stored string form of DATE, DATETIME, TIME, DURATION, FLOAT, and BOOL values and document it here, since filters match the exact string. -->

#### Find executions by output value

On the **Executions** page, add the **Searchable outputs** filter, enter the output ID as the key, and enter the value. The filter supports equals, not equals, in, and not in. Matching is exact and case-sensitive, and the filter combines with the namespace, flow, state, and date filters. The search box does not match output values.

<!-- TODO(runtime, 2.1 RC): confirm the comparator labels shown in the filter UI and add a screenshot of the filter. -->

The execution's **Overview** tab shows up to 10 searchable values as `outputId: value`, followed by a count of the remaining values. The **Input/Output** tab marks searchable flow outputs with a **Searchable** tag.

<!-- TODO(runtime, 2.1 RC): screenshots of the Overview header values and the Searchable tag. -->

Through the API, filter executions with the `outputs` field. See [Filter on outputs](../../api-reference/04.query-filters.md#filter-on-outputs):

```
GET /api/v1/{tenant}/executions/search?filters[outputs][EQUALS][orderIds]=ORD-8841
```

To list the searchable values of one execution, call `GET /api/v1/{tenant}/outputs/searchable/{executionId}`. Results are paginated with `page` and `size`.

:::alert{type="info"}
In the Enterprise Edition, filtering by searchable outputs and listing an execution's searchable values both require the `ACCESS_OUTPUTS` action on `EXECUTION`. See [RBAC](../../07.enterprise/03.auth/rbac/index.md).
:::

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
