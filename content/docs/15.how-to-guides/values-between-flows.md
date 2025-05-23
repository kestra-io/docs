---
title: Access Values Between Flows
icon: /docs/icons/tutorial.svg
stage: Getting Started
topics:
  - Kestra Concepts
---

How to access values across different flows.

Sometimes it's useful to be able to store values so they can be used between multiple flows. Whether that's some configuration, or states generated by flows performing similar functions, accessing values between flows has a load of benefits. There's multiple ways to do that in Kestra, with each having different benefits to suit different use cases.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/1XqujT5HeDM?si=Vx-lscIKtQ0vLsfK" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

---

There's 3 different ways you can access values across different flows:
1. Subflows
2. KV Store
3. Namespace Variables

## Subflows

Using [Subflows](../04.workflow-components/10.subflows.md), you can execute another flow from inside of a flow. As part of that, you can pass inputs from the parent flow to the subflow, and retrieve outputs generated from it. This is good if you want to have multiple Flows execute together, and interact directly with one and another. However, this doesn't work if you want one flow to generate a value, and then another use it later when it executes.

In this example, our parent flow is passing the [variable](../04.workflow-components/04.variables.md) `debug` into the subflow as an [input](../04.workflow-components/05.inputs.md). On top of that, the subflow returns an [output](../04.workflow-components/06.outputs.md) `subflow_output` too.

```yaml
id: parent_flow
namespace: company.team

variables:
  debug: true

tasks:
  - id: subflow
    type: io.kestra.plugin.core.flow.Subflow
    flowId: subflow
    namespace: company.team
    inputs:
      debug: "{{ vars.debug }}"
  
  - id: log
    type: io.kestra.plugin.core.log.Log
    message: "{{ outputs.subflow.outputs.subflow_output }}"
```

As we can see in the subflow directly, we have explicitly defined the output to make it easier to access in our parent flow. This example uses the input to generate the output sent to the parent flow.

```yaml
id: subflow
namespace: company.team

inputs:
  - id: debug
    type: BOOLEAN

tasks:
  - id: return
    type: io.kestra.plugin.core.debug.Return
    format: "Subflow: {{ inputs.debug }}"

outputs:
  - id: subflow_output
    type: STRING
    value: "{{ outputs.return.value }}"
```

## KV Store

Using the [KV Store](../05.concepts/05.kv-store.md), you can set and get values across different flows. This is good if you want to be able to store values without flows directly interacting with one another, like they do with Subflows. Flows can use the Get and Set tasks to make themselves stateful, allowing one flow to store the state, and another to access it when it wants. However, this approach isn't ideal if you don't want these values to be modified by the flows directly.

For example, you can use `io.kestra.plugin.core.kv.Set` task as well as use the UI interface to manage the values in the KV Store. To access them, you can use the  `io.kestra.plugin.core.kv.Get` task which will return them as an output. 

```yaml
id: kv_store
namespace: company.team

variables:
  debug: true

tasks:
  - id: set
    type: io.kestra.plugin.core.kv.Set
    key: debug
    value: "{{ vars.debug }}"
    namespace: "{{ flow.namespace }}"

  - id: get
    type: io.kestra.plugin.core.kv.Get
    key: debug
  
  - id: log
    type: io.kestra.plugin.core.log.Log
    message: "{{ outputs.get.value }}"
```

## Namespace Variables

::alert{type="info"}
This is an [Enterprise Edition](../06.enterprise/index.md) feature.
::

Using [Namespace Variables](../06.enterprise/02.governance/07.namespace-management.md), you can define values that can be accessed betweens flows inside of a namespace, similar to the KV Store. However, these can only be set in the [Namespace page](../08.ui/04.namespaces/ee.md). This is good if you want to access values across flows, but you don't want to dynamically update them inside your flows at the same time.

For example, we can define our variables as a key-value pair in our Namespace:

```yaml
debug: true
state: failed
hello: world
```

We can access them using the `{{ namespace.var_key }}` expression where `var_key` is the key of our key-value pair.

```yaml
id: global_variables
namespace: company.team

variables:
  debug: true

tasks:
  - id: debug_1
    type: io.kestra.plugin.core.log.Log
    message: "Namespace: {{ namespace.state }}"
  
  - id: debug_2
    type: io.kestra.plugin.core.log.Log
    message: "Local: {{ vars.debug }}"
```
