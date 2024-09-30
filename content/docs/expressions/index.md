---
title: Expressions
icon: /docs/icons/expression.svg
---

Expressions to dynamically render various flow and task properties.

Kestra's expressions use [Pebble Templating](https://pebbletemplates.io/) along with flow's execution context to render various flow and task properties.

To dynamically set values for your tasks and flows, you can add an expression by using `{{ expression_name }}` syntax. Dynamic expressions can be used on each task property that is documented as **dynamic**.

Kestra uses an [integrated templating engine](../05.concepts/06.pebble.md) to dynamically render variables, inputs and outputs within the execution context.

Flows, tasks, executions, triggers, and schedules have default expressions. For example, `{{ flow.id }}` allows accessing the identifier of a flow within an execution.

Flow inputs can be accessed using `{{ inputs.myinput }}`, and task's output attributes are available as `{{ outputs.task_id.output_attribute }}` expressions.

Most expressions are stored in the execution context. The execution context encompasses flow and execution, environment variables, global variables, plugin defaults, flow inputs, and task outputs. Expressions of a FILE-type are stored in Kestra's internal storage and fetched from there at execution time.

::ChildCard
::
