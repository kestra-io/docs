---
title: Workflow Components
---

Flow is a container for tasks and and their orchestration logic, as well as labels, variables, inputs, outputs and triggers.

## Components of a flow

A flow is a container for `tasks`, their `inputs`, `outputs`, handling `errors` and overall orchestration logic. It defines the **order** in which tasks are executed and **how** they are executed, e.g. **sequentially**, **in parallel**, based on upstream task dependencies and their state, etc.

You can define a flow declaratively using a [YAML](https://en.wikipedia.org/wiki/YAML) file.

A flow must have:
- identifier (`id`)
- [namespace](/docs/workflow-components/namespace)
- [list of tasks](/docs/workflow-components/tasks)

Optionally, a flow can also have:
- [inputs](/docs/workflow-components/inputs)
- [outputs](/docs/workflow-components/outputs)
- [variables](/docs/workflow-components/variables)
- [triggers](/docs/workflow-components/triggers)
- [labels](/docs/workflow-components/labels)
- [taskDefaults](/docs/workflow-components/task-defaults)
- [errors](/docs/workflow-components/errors)
- [retries](/docs/workflow-components/retries)
- [timeout](/docs/workflow-components/timeout)
- [concurrency](/docs/workflow-components/concurrency)
- [descriptions](/docs/workflow-components/descriptions)
- [disabled](/docs/workflow-components/disabled)
- [revision](/docs/concepts/revision)

::collapse{title="Description of all flow properties"}
| Field | Description |
|-|-|
| `id` | The flow identifier which represents the name of the flow. This ID must be unique within a namespace and is immutable (you cannot rename the flow ID later; you could only recreate it with a new name). |
| `namespace` | Each flow lives in one namespace. Namespaces are used to group flows and provide structure. Allocation of a flow to a namespace is immutable. Once a flow is created, you cannot change its namespace. If you need to change the namespace of a flow, create a new flow with the desired namespace and delete the old flow.                                                                                                                                                 |
| `tasks` | The list of tasks to be executed within the flow. By default, tasks will run sequentially one after the other. However, you can use additional flowable tasks to run tasks in parallel. |
| `inputs` | The list of inputs that allow you to make your flows more dynamic and reusable. Instead of hardcoding values in your flow, you can use inputs to trigger multiple Executions of your flow with different values determined at runtime. Use the syntax `{{ inputs.your_input_name }}` to access specific input values in your tasks. |
| `variables` | A map of custom key-value pairs (such as an API endpoint, table name, etc.) that you can use in your flow to avoid repetition. When you declare some flow variables, you can then access them in all tasks using the syntax `{{ vars.your_variable_name }}`. |
| `triggers` | The list of triggers which automatically start a new execution based on events, such as a scheduled date, a new file arrival, a new message in a queue, or the completion event of another flow's execution. |
| `labels` | A map of custom key-value pairs that you can use to organize your flows based on your project, maintainers, or any other criteria. You can use labels to filter Executions in the UI. |
| `taskDefaults` | The list of default task values, allowing you to avoid repeating the same properties on each task. Includes sub-fields: `taskDefaults.[].type` (the task type is a full qualified Java class name, i.e., the task name such as `io.kestra.core.tasks.log.Log`), `taskDefaults.[].forced` (if set to `forced: true`, the `taskDefault` will take precedence over properties defined in the task), and `taskDefaults.[].values.xxx` (the task property to be set as default). |
| `errors` | The list of tasks that will be executed sequentially on errors — Kestra will run those tasks anytime there is an error in the current execution. |
| `retries` | Retries handle transient failures in your workflows. They are defined at the task level and can be configured to retry a task a certain number of times, or with a certain delay between each retry. |
| `timeout` | Timeout allows you to set a maximum duration for a task run. If the task run exceeds the specified duration, Kestra will automatically stop the task run and mark it as failed. This is useful for tasks that may hang and run indefinitely. |
| `concurrency` | The flow level `concurrency` property allows you to control the number of concurrent executions of a given flow by setting the `limit` key. |
| `description` | A markdown description of the flow, providing a simple way of documenting your workflows. That description is automatically rendered on the flow's page in the UI. |
| `disabled` | Set it to true to temporarily disable any new executions of the flow. This is useful when you want to stop a flow from running (even manually) without deleting it. Once you set this property to true, nobody will be able to trigger any execution of that flow, whether from the UI or via an API call, until the flow is reenabled by setting this property back to false (default behavior) or by simply deleting this property in your flow configuration.            |
| `revision` | The flow version, handled internally by Kestra, and incremented upon each modification. You should not manually set it.                                                                                                                                                                                                                                                                                                                                                     |
::

## Examples
Here is a sample flow definition. It uses tasks available in Kestra core for testing purposes, such as the `Return` or `Log` tasks, and demonstrates how to use `labels`, `inputs`, `variables`, `triggers` and various `descriptions`.

::collapse{title="Example 1"}
```yaml
id: example1
namespace: example

description: flow **documentation** in *Markdown*

labels:
  env: prod
  team: engineering

inputs:
  - id: my-value
    type: STRING
    required: false
    defaults: "default value"
    description: This is a not required my-value

variables:
  first: "1"
  second: "{{vars.first}} > 2"

tasks:
  - id: date
    type: io.kestra.core.tasks.debugs.Return
    description: "Some tasks **documentation** in *Markdown*"
    format: "A log line content with a contextual date variable {{taskrun.startDate}}"

taskDefaults:
  - type: io.kestra.core.tasks.log.Log
    values:
      level: ERROR
```
::

In this next example flow, it uses a `Log` task available in Kestra core for testing purposes and demonstrates how to use `labels`, `inputs`, `variables`, `triggers` and various `descriptions`.

::collapse{title="Example 2"}
```yaml
id: example2
namespace: example

description: |
  # This is a flow description that will be rendered in the UI
  Let's `write` some **markdown** - [first flow](https://t.ly/Vemr0) 🚀

labels:
  owner: rick.astley
  project: never-gonna-give-you-up
  environment: dev
  country: US

inputs:
  - id: user
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
::



::ChildCard
::
