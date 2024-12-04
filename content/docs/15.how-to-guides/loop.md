---
title: Loop Over a List of Values
icon: /docs/icons/tutorial.svg
stage: Intermediate
topics:
  - Kestra Workflow Components
---

How to iterate over a list of values in your flow.

In this guide, you will learn how to iterate over a list of values using the `ForEach` task. This task enables you to loop through a list of values and execute specific tasks for each value in the list. This approach is useful for scenarios where multiple similar tasks need to be run for different inputs.

## Prerequisites

Before you begin:

- Deploy [Kestra](../02.installation/index.md) in your preferred development environment.
- Ensure you have a [basic understanding of how to run Kestra flows.](../01.getting-started/03.tutorial.md)
  
## Loop Over Nested Lists of Values

This example demonstrates how to use `ForEach` to loop over a list of strings and then loop through a nested list for each string. To see the flow in action, define the `each_nested` flow as shown below:

```yaml
id: each_nested
namespace: company.team

tasks:
  - id: 1_each
    type: io.kestra.plugin.core.flow.ForEach
    values: '["s1", "s2", "s3"]'
    tasks:
      - id: 1-1_return
        type: io.kestra.plugin.core.debug.Return
        format: "{{task.id}} > {{taskrun.value}} > {{taskrun.startDate}}"
      - id: 1-2_each
        type: io.kestra.plugin.core.flow.ForEach
        values: '["a a", "b b"]'
        tasks:
          - id: 1-2-1_return
            type: io.kestra.plugin.core.debug.Return
            format: "{{task.id}} > {{taskrun.value}} > {{taskrun.startDate}}"
          - id: 1-2-2_return
            type: io.kestra.plugin.core.debug.Return
            format: "{{task.id}} > {{ outputs['1-2-1_return'].s1[taskrun.value].value }} >> get {{ outputs['1-2-1_return']['s1'][taskrun.value].value }} > {{taskrun.startDate}}"
      - id: 1-3_return
        type: io.kestra.plugin.core.debug.Return
        format: "{{task.id}} > {{ outputs['1-1_return'][taskrun.value].value }} > {{taskrun.startDate}}"
  - id: 2_return
    type: io.kestra.plugin.core.debug.Return
    format: "{{task.id}} > {{outputs['1-2-1_return'].s1['a a'].value}}"
```

Save and execute the `each_nested` flow.

The above flow, when executed, iterates over a nested list of values, logging messages at each level of iteration to track the processing of both the outer and inner list items.

Within the flow:

- `1_each`: Uses the `ForEach` task to iterate over the list `["s1", "s2", "s3"]`. For each value, it runs the nested tasks defined within.
  
  - `1-1_return`: Logs the task ID, the current list value, and the task run start time.
  
  - `1-2_each`: Iterates over a second list `["a a", "b b"]` and runs a set of tasks for each value in this nested list.
    
    - `1-2-1_return`: Logs the task ID, the nested list value, and the start time of the task run.
    
    - `1-2-2_return`: Logs a custom output from `1-2-1_return`, which shows how to access outputs from previous iterations within the nested loop.

  - `1-3_return`: Logs the output from `1-1_return` after the inner loop is completed and displays the corresponding value processed in the outer loop.

- `2_return`: Fetches the output from the nested loop (`1-2-1_return` for the value `a a`) and logs it.


## Next Steps

Now that you've seen how to loop over a list of values using `ForEach`, you can apply this technique to any scenario where multiple iterations of similar tasks are needed. You can further extend this flow by:
- Adding more complex nested loops.
- Using dynamic input values instead of hardcoded lists.
- Logging or processing additional data from each iteration.

For more advanced use cases, refer to Kestra’s official [ForEach](https://kestra.io/plugins/core/tasks/flow/io.kestra.plugin.core.flow.foreach) task documentation.

