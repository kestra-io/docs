---
title: currentEachOutput
---

The `currentEachOutput` function retrieves the current output of a sibling task when using an [EachSequential](../../../../plugins/core/tasks/flows/io.kestra.core.tasks.flows.EachSequential.md) task. See [Lookup in sibling tasks](../../05.outputs.md#lookup-in-sibling-tasks) for background on sibling tasks.

Look at the following flow:

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
    value: ["value 1", "value 2", "value 3"]
```

To retrieve the output of the `first` task from the `second` task, you need to use the special `taskrun.value` variable to lookup for the execution of the `first` task that is on the same sequential execution as the `second` task.
And when there are multiple levels of EachSequential, you must use the special `parents` variable to lookup the correct execution. For example, `outputs.first[parents[1].taskrun.value][parents[0].taskrun.value]` for a 3-level EachSequential.

The `currentEachOutput` function will facilitate this by looking up the current output of the sibling task, so you don't need to use the special variables `taskrun.value` and `parents`.

The previous example can be rewritten as follow:

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
        format: "{{ currentEachOutput(outputs.first).value }}"
    value: ["value 1", "value 2", "value 3"]
```

And this works no matter the number of levels of EachSequential tasks used.
