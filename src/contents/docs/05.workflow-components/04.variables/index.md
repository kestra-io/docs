---
title: Variables in Kestra – Reuse Values Across Flows
h1: Configure and Use Dynamic Variables with Pebble Templating
description: Master Variables in Kestra to reuse values across tasks and flows. Learn to configure, modify, and utilize dynamic variables with Pebble templating.
sidebarTitle: Variables
icon: /src/contents/docs/icons/flow.svg
docId: variables
---

Variables are key-value pairs that let you reuse values across tasks in a flow, or across multiple flows when stored at the namespace level.

For sensitive values such as API keys, use [Secrets](../../06.concepts/04.secret/index.md) instead. For values that must persist across executions or be shared between flows without being embedded in YAML, use the [KV Store](../../06.concepts/05.kv-store/index.md). For a full comparison, see [Choosing where to store sensitive and shared values](../../14.best-practices/10.credentials-vs-secrets-vs-kv-store/index.md).

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/1iSam2aftKo?si=NfrnWM86SFQ_IePo" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Declaring variables

The `variables` key at the flow level defines a map of named values. Each variable is accessible in any dynamic property via `{{ vars.variable_name }}`:

```yaml
id: hello_world
namespace: company.team

variables:
  myvar: hello
  numeric_variable: 42

tasks:
  - id: log
    type: io.kestra.plugin.core.debug.Return
    format: "{{ vars.myvar }} world {{ vars.numeric_variable }}"
```

## Rendering

Variables are rendered by the [Pebble templating engine](../../expressions/index.mdx), which processes expressions with filters and functions. You can use variables in any task property marked as **dynamic**.

:::alert{type="info"}
Variables are no longer rendered recursively. See the [migration guide](../../11.migration-guide/v0.14.0/recursive-rendering/index.md) for details.
:::

## Dynamic variables

If a variable contains an expression, wrap it with `render()` when using it in a task. Without it, the expression is treated as a literal string:

```yaml
id: dynamic_variable
namespace: company.team

variables:
  time: "{{ now() }}"

tasks:
  - id: log
    type: io.kestra.plugin.core.log.Log
    message: "{{ render(vars.time) }}"
```

:::alert{type="warning"}
Without `render()`, an expression-valued variable resolves to the literal string rather than the evaluated expression.
:::

## Set or modify variables at runtime

The `SetVariables` task updates variables in the execution context. Later tasks see the new values immediately:

```yaml
id: variables_demo
namespace: company.team

variables:
  status: pending

tasks:
  - id: update
    type: io.kestra.plugin.core.execution.SetVariables
    variables:
      status: complete

  - id: log
    type: io.kestra.plugin.core.log.Log
    message: "Status is now {{ vars.status }}"
```

## Unset variables

The `UnsetVariables` task deletes variables from the execution context. It supports dot notation for nested keys:

```yaml
  - id: deleteVariables
    type: io.kestra.plugin.core.execution.UnsetVariables
    variables:
      - state
      - ansibleTicket
      - nested.child
```

## Variable behavior

### Escaping Pebble expressions in variable values

The `{% raw %}` and `{% endraw %}` tags prevent a Pebble expression from being evaluated. The following returns the string `{{ myvar }}` literally:

```yaml
{% raw %}{{ myvar }}{% endraw %}
```

See [Pebble syntax](../../expressions/02.syntax/index.mdx#raw) for details.

### Variable resolution order

[Inputs](../05.inputs/index.md) are resolved first, before the execution starts; an invalid input value prevents the execution from being created. Inputs are usable within variables, but variables are not usable within inputs (see [Dynamic Inputs](../05.inputs/index.md#dynamic-inputs) for the exception).

Triggers are resolved before the execution starts, like inputs, so trigger variables are referenceable inside `variables`, but inputs are not referenceable within triggers unless they have `defaults`.

### Pebble filters and functions in variable values

Pebble filters and functions work in any dynamic property. A variable can store a format string and apply it with the `date` filter:

```yaml
variables:
  DATE_FORMAT: "yyyy-MM-dd"

tasks:
  - id: formatted
    type: io.kestra.plugin.core.debug.Return
    format: "{{ execution.startDate | date(vars.DATE_FORMAT) }}"
```

See the [Expressions reference](../../expressions/index.mdx) for the full list of available filters and functions.

### Nested variables and `json()` access

`json(item.value).key` accesses fields on a nested object:

```yaml
id: vars
namespace: company.myteam

variables:
  servers:
    - fqn: server01.mydomain.io
      user: root
    - fqn: server02.mydomain.io
      user: guest

tasks:
  - id: loop
    type: io.kestra.plugin.core.flow.Loop
    concurrencyLimit: 0
    values: "{{ vars.servers }}"
    tasks:
      - id: log
        type: io.kestra.plugin.core.log.Log
        message:
           - "{{ item.value }}"
           - "{{ json(item.value).fqn }}"
           - "{{ json(item.value).user }}"
```
