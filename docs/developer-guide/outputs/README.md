---
order: 5
---
# Outputs

A flow can produce outputs when processing tasks. Outputs are stored in the execution flow context and can be used by all the tasks executed after the one that produces the output.

Outputs can have multiple attributes; please refer to the documentation of each task to see their output attributes.

You can use outputs everywhere [variables](../variables/) are allowed.

## Using outputs

Here is how to use the output of the `produce-output` task in the `use-output` task. Here we use the [Return](https://kestra.io/plugins/core/tasks/debugs/io.kestra.core.tasks.debugs.Return.html) task that have one output attribute named `value`.

```yaml
tasks:
- id: produce-output
  type: io.kestra.core.tasks.debugs.Return
  format: my output {{ execution.id }}
- id: use-output
  type: io.kestra.core.tasks.debugs.Echo
  format: This task display previous task output {{ outputs['produce-output'].value }}
```

In the example above, the first task produces an output based on the task property `format`. This output attribute is then used in the second task `format` property.

The `use-output` task uses the templating system <code v-pre>{{ outputs['produce-output'].value }}</code> to reference the previous task output attribute. If you're not familiar with the syntax used here, please read [variables basic usage](/docs/developer-guide/variables/basic-usage.md).

::: tip note
The `.value` in the template uses another task's output attribute using a variable name corresponding to the produced output attributes. In this case, the **Return** task produces the `value` output attribute that is accessible using the `value` variable. Every task produces different output attributes. Look at each task ouputs documentation or use the **Outputs** tab of the **Executions** page.
:::

## Storage variables

Each task can store data in Kestra's internal storage. If an output attribute is stored in the internal storage, the attribute will contain a URI that points to a file in the internal storage.

This output attribute could be used by other tasks to access the stored data, Kestra will automatically make it accessible.

The following example store the result of a BigQuery query in the internal storage, then access it in the `write-to-csv` task:

```yaml
tasks:
- id: output-from-query
  type: io.kestra.plugin.gcp.bigquery.Query
  sql: |
    SELECT * FROM `bigquery-public-data.wikipedia.pageviews_2023`
    WHERE DATE(datehour) = current_date()
    ORDER BY datehour desc, views desc
    LIMIT 10
  store: true
- id: write-to-csv
  type: io.kestra.plugin.serdes.csv.CsvWriter
  from: "{{outputs['output-from-query'].uri}}"
```

## Dynamic variables

#### Current taskrun value

You can access the current taskrun value with <code v-pre>{{ taskrun.value }}</code> like this:

```yaml
tasks:
  - id: each
    type: io.kestra.core.tasks.flows.EachSequential
    value: '["value 1", "value 2", "value 3"]'
    tasks:
      - id: inner
        type: io.kestra.core.tasks.debugs.Return
        format: "{{task.id}} > {{taskrun.value}} > {{taskrun.startDate}}"
```

###  Specific outputs for dynamic tasks

Dynamic tasks are tasks that will run other tasks a certain number of times. A dynamic task will run multiple iterations of a set of sub-tasks.

For example, **EachSequential** and **EachParallel** produce other tasks dynamically depending on their `value` property. 

It is possible to reach each iteration output of dynamic tasks by using the following syntax:

```yaml
id: output-sample
namespace: io.kestra.tests

tasks:
  - id: each
    type: io.kestra.core.tasks.flows.EachSequential
    tasks:
      - id: sub
        type: io.kestra.core.tasks.debugs.Return
        format: "{{ task.id }} > {{ taskrun.value }} > {{ taskrun.startDate }}"
    value: "[\"s1\", \"s2\", \"s3\"]"
  - id: use
    type: io.kestra.core.tasks.debugs.Return
    format: "Previous task produced output : {{ outputs.sub.s1.value }}"
```

The `outputs.sub.s1.value` variable reaches the `value` of the `sub` task of the `s1` iteration.

#### Previous task lookup

It is also possible to locate a specific dynamic task by its `value`:

```yaml
tasks:
  - id: each
    type: io.kestra.core.tasks.flows.EachSequential
    tasks:
      - id: inner
        type: io.kestra.core.tasks.debugs.Return
        format: "{{ task.id }}"
    value: "[\"value 1\", \"value 2\", \"value 3\"]"
  - id: end
    type: io.kestra.core.tasks.debugs.Return
    format: "{{ task.id }} > {{ outputs.inner['value 1'].value }}"
```

It uses the format `outputs.TASKID[VALUE].ATTRIBUTE`. The special bracket `[]` in  `[VALUE]` is called the subscript notation; it enables using special chars like space or '-' in task identifiers or output attributes.

#### Lookup in sibling tasks

Sometimes, it can be useful to access previous outputs on the current task tree, what is called sibling tasks.

If the task tree is static, for example when using the [Sequential](/plugins/core/tasks/flows/io.kestra.core.tasks.flows.Sequential.md) task, you can use the <code v-pre>{{outputs.sibling.value}}</code> notation where `sibling`is the identifier of the sibling task. 

If the task tree is dynamic, for example when using the [EachSequential](/plugins/core/tasks/flows/io.kestra.core.tasks.flows.EachSequential.md) task, you need to use `sibling[taskrun.value]` to access the current tree task. `taskrun.value` is a special variable that holds the current value of the EachSequential task.

For example:
```yaml
tasks:
  - id: each
    type: io.kestra.core.tasks.flows.EachSequential
    tasks:
      - id: first
        type: io.kestra.core.tasks.debugs.Return
        format: "{{task.id}}"
      - id: second
        type: io.kestra.core.tasks.debugs.Return
        format: "{{ outputs.first[taskrun.value].value }}"
    value: "[\"value 1\", \"value 2\", \"value 3\"]"
  - id: end
    type: io.kestra.core.tasks.debugs.Return
    format: "{{task.id}} > {{outputs.second['value 1'].value}}"
```

When there are multiple levels of [EachSequential](/plugins/core/tasks/flows/io.kestra.core.tasks.flows.EachSequential.md) tasks, you can use the `parents` variable to access the `taskrun.value` of the parent of the current EachSequential. For example, for two levels of EachSequential you can use `outputs.sibling[parents[0].taskrun.value][taskrun.value].value`.

The latter can become very complex when parents exist (multiple imbricated EachSequential). For this, you can use the special [currentEachOutput](/docs/developer-guide/variables/function/currentEachOutput.md) function. No matter the number of parents, the following example will retrieve the correct output attribute: `currentEachOutput(outputs.sibling).value` thanks to this function.

::: warning
Accessing sibling task outputs is not possible on [Parallel](/plugins/core/tasks/flows/io.kestra.core.tasks.flows.Parallel.md) or [EachParallel](/plugins/core/tasks/flows/io.kestra.core.tasks.flows.EachParallel.md) as they run tasks in parallel.
:::