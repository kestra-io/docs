---
title: Expressions
icon: /docs/icons/concepts.svg
---

Expressions allow you to dynamically set values for your tasks and flows using a simple templating language.

Kestra relies on an [integrated Pebble templating engine](./pebble.md) to dynamically render variables, inputs and outputs within the execution context.

You can use [expressions](../expressions/01.index.md) inside your flow definition by using a special syntax: `{{ expression_name }}`. They can be used on each task property that is documented as **dynamic**.

Dynamic expressions will be rendered, thanks to the Pebble templating engine. Pebble allows the processing of expressions with filters and functions.

Flows, tasks, executions, triggers, and schedules, have default expressions; for example `{{ flow.id }}` allows accessing the identifier of a flow inside an execution.

Flow inputs can be accessed using `{{ inputs.myinput }}`, and task's output attributes are available as `{{ outputs.task_id.output_attribute }}` expressions.

Most expressions will be stored inside the execution context. Expressions of a FILE-type are stored inside Kestra's internal storage and fetched from there at execution time.

Expressions use [Pebble Templating](https://pebbletemplates.io/) along with Kestra's execution context, allowing flexible access patterns to the data you need.

The execution context encompasses flow and execution, environment variables, global variables, task defaults, flow inputs, and task outputs.

