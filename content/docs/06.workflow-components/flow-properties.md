---
title: Flow properties
icon: /docs/icons/components.svg
---

This section summarizes all required and optional properties of a flow.

## Required properties

A flow **must** have:

1. an `id`,
2. a `namespace`,
3. a list of `tasks`.

Those three are the only **required** properties. All other properties are **optional**.

## Optional properties

The **optional properties** include:

- a `description`,
- a map of `labels`,
- a map of `variables`,
- a list of `inputs`,
- a list of `triggers`,
- a list of `taskDefaults`.

## Description of all flow properties

The table below describes each property in detail.


| Field          | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
|----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `id`           | The flow identifier which represents the name of the flow. This ID must be unique within a namespace and is immutable (you cannot rename the flow ID later; you could only recreate it with a new name).                                                                                                                                                                                                                                                                    |
| `namespace`    | Each flow lives in one namespace. Namespaces are used to group flows and provide structure. Allocation of a flow to a namespace is immutable. Once a flow is created, you cannot change its namespace. If you need to change the namespace of a flow, create a new flow with the desired namespace and delete the old flow.                                                                                                                                                 |
| `tasks`        | The list of tasks to be executed within the flow. By default, tasks will run sequentially one after the other. However, you can use additional flowable tasks to run tasks in parallel.                                                                                                                                                                                                                                                                                     |
| `inputs`       | The list of inputs that allow you to make your flows more dynamic and reusable. Instead of hardcoding values in your flow, you can use inputs to trigger multiple Executions of your flow with different values determined at runtime. Use the syntax `{{ inputs.your_input_name }}` to access specific input values in your tasks.                                                                                                                                         |
| `triggers`     | The list of triggers which automatically start a new execution based on events, such as a scheduled date, a new file arrival, a new message in a queue, or the completion event of another flow's execution.                                                                                                                                                                                                                                                                |
| `errors`       | The list of tasks that will be executed sequentially on errors — Kestra will run those tasks anytime there is an error in the current execution.                                                                                                                                                                                                                                                                                                                            |
| `labels`       | A map of custom key-value pairs that you can use to organize your flows based on your project, maintainers, or any other criteria. You can use labels to filter Executions in the UI.                                                                                                                                                                                                                                                                                       |
| `variables`    | A map of custom key-value pairs (such as an API endpoint, table name, etc.) that you can use in your flow to avoid repetition. When you declare some flow variables, you can then access them in all tasks using the syntax `{{ vars.your_variable_name }}`.                                                                                                                                                                                                                |
| `revision`     | The flow version, handled internally by Kestra, and incremented upon each modification. You should not manually set it.                                                                                                                                                                                                                                                                                                                                                     |
| `description`  | A markdown description of the flow, providing a simple way of documenting your workflows. That description is automatically rendered on the flow's page in the UI.                                                                                                                                                                                                                                                                                                          |
| `disabled`     | Set it to true to temporarily disable any new executions of the flow. This is useful when you want to stop a flow from running (even manually) without deleting it. Once you set this property to true, nobody will be able to trigger any execution of that flow, whether from the UI or via an API call, until the flow is reenabled by setting this property back to false (default behavior) or by simply deleting this property in your flow configuration.            |
| `taskDefaults` | The list of default task values, allowing you to avoid repeating the same properties on each task. Includes sub-fields: `taskDefaults.[].type` (the task type is a full qualified Java class name, i.e., the task name such as `io.kestra.core.tasks.log.Log`), `taskDefaults.[].forced` (if set to `forced: true`, the `taskDefault` will take precedence over properties defined in the task), and `taskDefaults.[].values.xxx` (the task property to be set as default). |

---

## Flow example

Here is an example flow. It uses a `Log` task available in Kestra core for testing purposes and demonstrates how to use `labels`, `inputs`, `variables`, `triggers` and various `descriptions`.

```yaml
id: getting_started
namespace: dev

description: |
  # This is a flow description that will be rendered in the UI
  Let's `write` some **markdown** - [first flow](https://t.ly/Vemr0) 🚀

labels:
  owner: rick.astley
  project: never-gonna-give-you-up
  environment: dev
  country: US

inputs:
  - name: user
    type: STRING
    required: false
    defaults: Rick Astley
    description: |
      This is an optional value. If not set at runtime,
      it will use the default value "Rick Astley".

variables:
  first: 1
  second: "{{ vars.first }} > 2"

tasks:
  - id: hello
    type: io.kestra.core.tasks.log.Log
    description: this is a *task* documentation
    message: |
      The variables we used are {{ vars.first }} and {{vars.second}}.
      The input is {{ inputs.user }} and the task was started at {{ taskrun.startDate }} from flow {{ flow.id }}.

taskDefaults:
  - type: io.kestra.core.tasks.log.Log
    values:
      level: TRACE

triggers:
  - id: monthly
    type: io.kestra.core.models.triggers.types.Schedule
    cron: "0 9 1 * *"
    description: |
      This trigger will start a new execution of the flow every first day of the month at 9am. It will use the default values defined in the taskDefaults section, as well as the default input values.
```

## Add descriptions to flows, tasks, inputs and triggers

Each component of your workflow can be documented in the [Markdown](https://en.wikipedia.org/wiki/Markdown) syntax using the `description` property.

All markdown descriptions will be rendered in the UI.

![](https://s3.us-west-2.amazonaws.com/content.podia.com/h34v7ivitlv6j1mq2mvfpg4rojeq)

To keep all elements of a flow documented, you can add the description to the `flow` itself, as well as to each `task`, `input` and `trigger`.
