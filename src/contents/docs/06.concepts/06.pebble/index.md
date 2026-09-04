---
title: "Pebble Templating in Kestra: Dynamic Variables"
h1: Dynamically Render Variables, Inputs and Outputs with Pebble
description: Dynamically render variables, inputs, and outputs in Kestra using Pebble templating. Use expressions to build flexible, data-driven workflows.
sidebarTitle: Pebble Templating Engine
icon: /src/contents/docs/icons/concepts.svg
---

Pebble is a Java templating engine inspired by [Twig](https://twig.symfony.com/) and similar to [Jinja](https://palletsprojects.com/p/jinja/). Kestra uses it to dynamically render variables, inputs, and outputs within the execution context. For the full list of available variables, filters, and functions, see the [Expressions](../../expressions/index.md) reference.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/TJ4BFBV8ZvU?si=KO8dnt105CVuvo8D" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Reading inputs

Access input values in tasks using the `inputs` variable:

```yaml
id: input_string
namespace: company.team

inputs:
  - id: name
    type: STRING

tasks:
  - id: say_hello
    type: io.kestra.plugin.core.log.Log
    message: "Hello 👋, my name is {{ inputs.name }}"
```

## Reading task outputs

Most tasks expose output values accessible as `outputs.<task_id>.<output_name>`. The available outputs for each task are listed in its plugin documentation.

This example reads the `value` output of the `Return` task in a downstream `Log` task:

```yaml
id: input_string
namespace: company.team

inputs:
  - id: name
    type: STRING

tasks:
  - id: say_hello
    type: io.kestra.plugin.core.debug.Return
    format: "Hello 👋, my name is {{ inputs.name }}"

  - id: can_you_repeat
    type: io.kestra.plugin.core.log.Log
    message: '{{ outputs.say_hello.value }}'
```

## Dynamically render a task with `TemplatedTask`

`TemplatedTask` lets you fully template all task properties using Pebble — including properties that are not natively dynamic. This example uses [TemplatedTask](/plugins/core/templating/io.kestra.plugin.core.templating.templatedtask) to create a Databricks job with inputs controlling the cluster, task key, and wait time:

```yaml
id: templated_databricks_job
namespace: company.team

inputs:
  - id: host
    type: STRING
  - id: clusterId
    type: STRING
  - id: taskKey
    type: STRING
  - id: pythonFile
    type: STRING
  - id: sparkPythonTaskSource
    type: ENUM
    defaults: WORKSPACE
    values:
      - GIT
      - WORKSPACE
  - id: maxWaitTime
    type: STRING
    defaults: "PT30M"

tasks:
  - id: templated_spark_job
    type: io.kestra.plugin.core.templating.TemplatedTask
    spec: |
      type: io.kestra.plugin.databricks.job.CreateJob
      authentication:
        token: "{{ secret('DATABRICKS_API_TOKEN') }}"
      host: "{{ inputs.host }}"
      jobTasks:
        - existingClusterId: "{{ inputs.clusterId }}"
          taskKey: "{{ inputs.taskKey }}"
          sparkPythonTask:
            pythonFile: "{{ inputs.pythonFile }}"
            sparkPythonTaskSource: "{{ inputs.sparkPythonTaskSource }}"
      waitForCompletion: "{{ inputs.maxWaitTime }}"
```

`waitForCompletion` and `sparkPythonTaskSource` are not natively dynamic properties — `TemplatedTask` makes it possible to drive them from inputs.

---

## Date formatting

Use the `date` filter to format date values inline: `'{{ inputs.my_date | date("yyyyMMdd") }}'`

## Coalesce operator to conditionally use trigger or execution date

Scheduled flows can use `trigger.date` to get the trigger’s date, but that variable is not set on manual executions. Use the coalesce operator `??` to fall back to `execution.startDate` when the trigger date is unavailable:

```yaml
id: pebble_date_trigger
namespace: company.team

tasks:
  - id: return_date
    type: io.kestra.plugin.core.debug.Return
    format: '{{ trigger.date ?? execution.startDate | date("yyyy-MM-dd") }}'

triggers:
  - id: schedule
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "* * * * *"
```

## Parsing objects and lists using jq

Use the `jq` filter to slice, filter, and transform nested objects or lists returned by task outputs — similar to how `sed`, `awk`, and `grep` work on strings.

```yaml
id: object_example
namespace: company.team

inputs:
  - id: data
    type: JSON
    defaults: '{"value": [1, 2, 3]}'

tasks:
  - id: hello
    type: io.kestra.plugin.core.log.Log
    message: "{{ inputs.data }}"
```

The expression `{{ inputs.data.value }}` returns the list `[1, 2, 3]`

The expression `{{ inputs.data.value | jq(".[1]") | first }}` returns `2`.

`jq(".[1]")` accesses the second value of the list and returns an array with one element. We then use `first` to access the value itself.

`{{ inputs | jq(".data.value[1]") | first }}` also works — jq can parse any object in the Kestra context.

Use the **Debug Expression** button in the **Outputs** tab of an execution to troubleshoot complex expressions and validate how objects will be parsed.


## Using conditions in Pebble

Tasks like `If` and `Switch` accept Pebble expressions as conditions, letting you branch on inputs or previous task outputs:

```yaml
id: test-object
namespace: company.team

inputs:
  - id: data
    type: JSON
    defaults: '{"value": [1, 2, 3]}'

tasks:

  - id: if
    type: io.kestra.plugin.core.flow.If
    condition: '{{ inputs.data.value | jq(".[2]") | first == 3 }}'
    then:
      - id: when_true
        type: io.kestra.plugin.core.log.Log
        message: 'Condition was true'
    else:
      - id: when_false
        type: io.kestra.plugin.core.log.Log
        message: 'Condition was false'
```
