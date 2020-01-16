# The Kestra's task model

In this documentation you will learn what is a task and how to describe them working together to create a working flow.
There are in Kestra three main tasks groups that are the following :

* **Core tasks** : they are included in the Kestra Comunity Edition and make it possible to handle common tasks.
* **Structural tasks** : they are mostly included in the Kestra Comunity Edition let you compose tasks together. More details below.
* **Plugin tasks** : these tasks are created and managed by community as external dependencies for Kestra. Their usage depends on both author and Kestra licence terms.
* **Business tasks** : they are provided as part of the Kestra Enterprise Edition and add higher level tasks convinient operation for kestra.

## Task types

First, there are many tasks types. Each of them is targeted to handle specific tasks. It is for exemple a Bash task that allows linux shell command to run. Another task type is Big query operation. You will have to use the appropriate task to acheive your computation goals accordingly. Find below the description of core tasks provided in the Kestra Comunity Edition

## Task sample

The task model is a yaml document descibing how kestra will schedule and compute your workload.

Here is a simple sample task demonstrating the task model. The following code is a minimal sample existing task in Kestra for testing purposes.

```yaml
id: minimal # Task identifier, must be unique across namespaces.
namespace: org.kestra.tests # Each task live in one arbitrary namespace, this is useful for task organisation. Namespace is required on root task node.
revision: 8 # Task verion version, initially optional, becomes mandatory if a task with same id and namespace already exists.
tasks: # A list of related sub tasks the current tasks manage.
  - id: date # Another task id describing this subtask.
    type: org.kestra.core.tasks.debugs.Return # The task type. There are many tasks types described below.
    format: "A log line content with a contextual date variable {{taskrun.startDate}}" # Here is a specific field for this task type (Retrun) that append a formatted line in log file stream.

```

## Task field types

Tasks fields in the yaml representation have key values pairs that can be one of the following types:

|Type|Description|
|-|-|
|Integer|An integer value|
|Float|A float value|
|String|A string value|
|Object|A nested yaml object describing properties of the referenced object in current object key property|
|List|A nested yaml section list where each item can be of any type in this list|
|Dynamic|A special field where that can handle handlebars template interpolations. For more details about dynamic fields and their usage in Kestra, have a look at [dynamic templates section](/dynamic-fields)|

## Core tasks

In the following table you will find all base properties for the core task model.

|Name|Description|
|-|-|
|Bash|Run bash scripts using this task|

## Structural tasks

Kestra's core comes with many tasks that structure tasks organisation. It allows to group, distribute and schedule tasks groups.

|Name|Description|
|-|-|
|Sequential|A task container to execute many tasks sequentially|
|Parallel|A task container to execute many tasks in parallel, this helps acheive more efficient flows|
|Switch|A task executing a specific sub branch of tasks depending on it's input value|
|Each|A single task generating a parametrized task list depending on it's inputs|
|Error|A nested task list to execute in case the associated task fails. It is a specific task field called errors expecting nested task desciption|

### Sequential sample

```yaml
id: sequential
namespace: org.kestra.tests
revision: 8
tasks:
  - id: 1-seq
    type: org.kestra.core.tasks.flows.Sequential
    tasks:
      - id: 1-1
        type: org.kestra.core.tasks.debugs.Return
        format: "{{task.id}} > {{taskrun.startDate}}"
      - id: 1-2
        type: org.kestra.core.tasks.debugs.Return
        format: "{{task.id}} > {{taskrun.id}}"
      - id: 1-3-seq
        type: org.kestra.core.tasks.flows.Sequential
        tasks:
          - id: 1-3-1
            type: org.kestra.core.tasks.debugs.Return
            format: "{{task.id}} > {{taskrun.id}}"
          - id: 1-3-2.seq
            type: org.kestra.core.tasks.flows.Sequential
            tasks:
              - id: 1-3-2.1
                type: org.kestra.core.tasks.debugs.Return
                format: "{{task.id}} > {{taskrun.startDate}}"
              - id: 1-3-2.2.end
                type: org.kestra.core.tasks.debugs.Return
                format: "{{task.id}} > {{taskrun.id}}"
          - id: 1-3-3.end
            type: org.kestra.core.tasks.debugs.Return
            format: "{{task.id}} > {{taskrun.id}}"
      - id: 1-4.end
        type: org.kestra.core.tasks.debugs.Return
        format: "{{task.id}} > {{taskrun.startDate}}"
  - id: 2.end
    type: org.kestra.core.tasks.debugs.Return
    format: "{{task.id}} > {{taskrun.startDate}}"
```

### Parallel sample

```yaml
id: parallel
namespace: org.kestra.tests
revision: 8
tasks:
  - id: parent-par
    type: org.kestra.core.tasks.flows.Parallel
    tasks:
      - id: 1st
        type: org.kestra.core.tasks.debugs.Return
        format: "{{task.id}} > {{taskrun.startDate}}"
      - id: 2nd
        type: org.kestra.core.tasks.debugs.Return
        format: "{{task.id}} > {{taskrun.id}}"
      - id: 3th - child par
        type: org.kestra.core.tasks.flows.Parallel
        tasks:
          - id: 3th - 1st
            type: org.kestra.core.tasks.debugs.Return
            format: "{{task.id}} > {{taskrun.id}}"
          - id: 3th - 2nd
            type: org.kestra.core.tasks.debugs.Return
            format: "{{task.id}} > {{taskrun.id}}"
          - id: 3th - 3rd
            type: org.kestra.core.tasks.debugs.Return
            format: "{{task.id}} > {{taskrun.id}}"
  - id: last
    type: org.kestra.core.tasks.debugs.Return
    format: "{{task.id}} > {{taskrun.startDate}}"
```

### Switch sample

```yaml
id: switch
namespace: org.kestra.tests
revision: 8
inputs:
  - name: string
    type: STRING
    required: true
tasks:
  - id: parent-seq
    type: org.kestra.core.tasks.flows.Switch
    value: "{{inputs.string}}"
    cases:
      FIRST:
        - id: 1st
          type: org.kestra.core.tasks.debugs.Return
          format: "{{task.id}} > {{taskrun.startDate}}"
      SECOND:
        - id: 2nd
          type: org.kestra.core.tasks.debugs.Return
          format: "{{task.id}} > {{taskrun.startDate}}"
      THIRD:
        - id: 3th
          type: org.kestra.core.tasks.flows.Sequential
          errors:
            - id: error-1st
              type: org.kestra.core.tasks.debugs.Return
              format: Error Trigger ! {{task.id}}
          tasks:
            - id: failed
              type: org.kestra.core.tasks.scripts.Bash
              commands:
                - exit 1
    defaults:
      - id: default
        type: org.kestra.core.tasks.debugs.Return
        format: "{{task.id}} > {{taskrun.startDate}}"
```

### Each sample

```yaml
id: each-sequential
namespace: org.kestra.tests
revision: 8
tasks:
  - id: 1.each
    type: org.kestra.core.tasks.flows.EachSequential
    tasks:
      - id: 1.each.1
        type: org.kestra.core.tasks.debugs.Return
        format: "{{task.id}} > {{taskrun.value}} > {{taskrun.startDate}}"
      - id: 1.each.2
        type: org.kestra.core.tasks.debugs.Return
        format: "{{task.id}} > {{taskrun.value}} > {{taskrun.startDate}}"
    value: '["value 1", "value 2", "value 3"]'
  - id: 2.end
    type: org.kestra.core.tasks.debugs.Return
    format: "{{task.id}} > {{taskrun.startDate}}"
```

### Error sample

```yaml
id: errors
namespace: org.kestra.tests
revision: 8
tasks:
  - id: failed
    type: org.kestra.core.tasks.scripts.Bash
    commands:
      - exit 1
errors:
  - id: 2nd
    type: org.kestra.core.tasks.debugs.Echo
    format: second {{task.id}}
    level: INFO
  - id: 3rd
    type: org.kestra.core.tasks.flows.Parallel
    tasks:
      - id: 3rd - 1st
        type: org.kestra.core.tasks.flows.Parallel
        tasks:
          - id: 3rd - 1st - 1st
            type: org.kestra.core.tasks.flows.Parallel
            tasks:
              - id: 3rd - 1st - 1st - 1st
                type: org.kestra.core.tasks.flows.Parallel
                tasks:
                  - id: 3rd - 1st - 1st - 1st - last
                    type: org.kestra.core.tasks.scripts.Bash
                    commands:
                      - 'echo "3rd - 1st - 1st - 1st - last : {{task.id}}"'
```

## Custom tasks

Each specialized task can implement custom behaviors and use specific additional fields. Have a look at [plugins](/plugins) for more information about these kind of tasks.