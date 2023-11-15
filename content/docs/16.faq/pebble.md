---
title: Pebble FAQ
---

## What's Pebble ?
Pebble is a Java templating engine inspired by [Twig](https://twig.symfony.com/) and similar to the [Python Jinja Template Engine](https://palletsprojects.com/p/jinja/) syntax.

In Kestra, it's used for variable operations and passing metadata between tasks.

## How to reading outputs & inputs ?

### Read inputs

When using `inputs` property in a Flow, you can access the corresponding values just by using `inputs` variable in your tasks.

```yaml
id: input_string
namespace: demo.kestra

inputs:
  - name: name
    type: STRING

tasks:
  - id: say_hello
    type: io.kestra.core.tasks.log.Log
    message: "Hello 👋, my name is {{ inputs.name }}"
```

### Read task ouputs

Most of Kestra tasks expose outputs value. You can access those outputs in other tasks by using `outputs.<task_name>.<output_name>`. Every task outputs are in each task documentation.

In the example below we use the `value` outputs of the `io.kestra.core.tasks.debugs.Return` task in the downstream task.

```yaml
id: input_string
namespace: demo.kestra

inputs:
  - name: name
    type: STRING

tasks:
  - id: say_hello
    type: io.kestra.core.tasks.debugs.Return
    format: "Hello 👋, my name is {{ inputs.name }}"


  - id: can_you_repeat
    type: io.kestra.core.tasks.log.Log
    message: '{{ outputs.say_hello.value }}'
```

## How to format date ?

Pebble can be very useful to make small transformation on the fly - without the need to use Python or some dedicated programming language. 
For instance, we can use the `date` function to format date values: `'{{ inputs.my_date | date("yyyyMMdd") }}'``

### Coalesce operator for trigger or manual execution

Most of the time, a flow will be triggered automatically. Either on schedule or based on external events. It’s common to use the date of the execution to process the corresponding data and make the flow dependent on time. 
With Pebble you can use the `trigger.date` to get the date of the executed trigger.
Still, sometimes you want to manually execute a flow. Then the `trigger.date` variable won’t work anymore. For this you can use the `execution.startDate` variable that returns the execution start date.
Using the coalesce operator `??`, it’s easy to make both behavior work without overhead.

```yaml
id: pebble-date-trigger
namespace: demo.kestra.pebble
tasks:

  - id: return_date
    type: io.kestra.core.tasks.debugs.Return
    format: '{{ trigger.date ?? execution.startDate | date("yyyy-MM-dd")}}'

triggers:
  - id: schedule
    type: io.kestra.core.models.triggers.types.Schedule
    cron: "* * * * *"
```

## How to parse objects & list ?

## How to use conditions

## How to access sibling objects ?




Parse objects and lists
👉 parse an object
👉 give data to ForEach type tasks
👉
Siblings & Conditions
👉 using siblings element between ForEachParallel and an upstream task

