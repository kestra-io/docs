---
title: Subflow outputs behavior
icon: /docs/icons/migration-guide.svg
release: 0.15.0
---

The `outputs` property of a parent flow's `Subflow` task is deprecated. Instead, use flow `outputs` to pass data between flows.

## Subflow outputs behavior before Kestra 0.15.0

If you are on Kestra 0.14.4 or earlier, passing data between subflows required using the `outputs` property within the parent flow's `Subflow` task.

### Example

Let's say you have a following subflow (aka child flow) with a task `mytask` generating an output called `value`:

```yaml
id: flow_outputs
namespace: company.team

tasks:
  - id: mytask
    type: io.kestra.plugin.core.debug.Return
    format: this is a task output used as a final flow output
```

To access this output in a different task within the same flow, you would use the syntax `{{outputs.mytask.value}}`. However, if you want to access this output in a parent flow, you would need to define the output in the `outputs` property within the parent flow's `Subflow` task as follows:

```yaml
id: parent_flow
namespace: company.team

tasks:
  - id: subflow
    type: io.kestra.plugin.core.flow.Subflow
    flowId: flow_outputs
    namespace: company.team
    wait: true
    outputs: # 🚨 this property is deprecated in Kestra 0.15.0
      final: "{{ outputs.mytask.value }}"

  - id: log
    type: io.kestra.plugin.core.log.Log
    message: "{{ outputs.subflow.outputs.final }}"
```

You can see that the `outputs` property is used to define the output of the subflow and stored in the variable named `final` (_the name of the keys are arbitrary_). This approach is not ideal, as **you need to know the internals of the subflow to access its outputs**. Also, it's not clear to the consumer what type of data is being passed. This is why this property is deprecated in Kestra 0.15.0.

### How to keep the old subflow outputs behavior

Before looking at how the same is achieved in Kestra 0.15.0, let's look at how you can keep this behavior **if you are not ready to migrate** to the new subflow outputs behavior.

To keep the old behavior with the `outputs` property, you can set the following configuration in your `application.yml`:

```yaml
kestra:
  plugins:
    configurations:
      - type: io.kestra.plugin.core.flow.Subflow
        values:
          outputs:
            enabled: true # for backward-compatibility -- false by default
      - type: io.kestra.plugin.core.flow.Flow
        values:
          outputs:
            enabled: true # for backward-compatibility -- false by default
```

Once the `outputs` configuration is set to `enabled: true`, you can use the old behavior of defining `outputs` within the Subflow or Flow task in the parent flow.

## Improved subflow outputs in Kestra 0.15.0

### Why the change?
Kestra 0.15.0 introduced a concept of flow-level `outputs` to make it easier to pass data between flows. Until now, the parent flow had to know the internals of the subflow to access its outputs. This introduced a **tight coupling** as the parent flow was **dependent on the subflow's internal logic**, which can change over time, potentially breaking the parent flow. Also, it was **exposing all outputs** from child flows (producers) to all parent flows (consumers), which is not always desirable. Often you don't want to expose all outputs of a subflow to the parent flow.

### Benefits of the new subflow outputs
Now, you have **more control** over what subflow outputs do you want to expose to other flows. The parent flow does not need to know the internals of the child flow — it can simply access the subflow outputs by key. This **more decoupled** approach means that the parent flow is less dependent on the subflow, and **the subflow can change its implementation without breaking the parent flow**.

You can think of flow outputs as **data contracts** between flows. The subflow defines what data it produces, and the parent flow defines what data it consumes. This makes it easier to understand the dataflow between workflows and improves maintainability of both flows over time.


### How to use the new subflow outputs
Since 0.15.0, the flow can produce `outputs` simply by defining them in the flow file. Here is an example of a flow that produces an output:

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

You can see that outputs are defined as a list of key-value pairs. The `id` is the name of the output attribute (which must be unique within a flow), and the `value` is the value of the output. The `type` lets you define the expected type of the output. You can also add a `description` to the output.

You will see the output of the flow on the **Executions** page in the **Overview** tab.

![subflow_output](/docs/workflow-components/subflow_output.png)

Here is how you can access the flow output in the parent flow:

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

In the example above, the `subflow` task produces an output attribute `final`. This output attribute is then used in the `log_subflow_output` task.

::alert{type="info"}
Note how the `outputs` are set twice within the `"{{outputs.subflow.outputs.final}}"`:
1. once to access outputs of the `subflow` task
2. once to access the outputs of the subflow itself — specifically, the `final` output.
::

Here is what you will see in the Outputs tab of the **Executions** page in the parent flow:

![subflow_output_parent](/docs/workflow-components/subflow_output_parent.png)

