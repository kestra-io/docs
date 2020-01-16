# Dynamic fields

Dynamic fields are specific fields for task description. They use the power of [handlebars](https://handlebarsjs.com/guide/) with Kestra's special context system, allowing powerfull task description and composition.

## Context concept

Dynamic fields can use variable information registrered / existing in the execution context. This context are some data injected in dynamic fields and are from different sources:

**Core context**: These data come from Kestra's general context it make it possible to reach system wide information. See below what data are concretely provided in handlebars templates.


**Task context**: This is some task related context data. You can reach data from task curently processed. Data are reachable from the **task** variable.

```yaml
format: second {{task.id}}
```

**Flow context**: The current flow processing let you generate data from one task and make it availalbe to other tasks of the same flow. So one task can use data produced else where in the current flow. Data are reachable from the **taskrun** variable.

```yaml
format: "{{task.id}} > {{taskrun.value}} > {{taskrun.startDate}}"
```

**Inter flow context**: A flow processing can generate some contextual data and can be shared to other flow. So flows can reach other flow data from context.

**Input context**: A task can access flow input variable using the **input** value. Have a look at [inputs](/inputs) for more details about flows input system.

```yaml
id: context_input
namespace: org.kestra.tests
inputs:
  - name: myinput
    type: STRING
tasks:
  - id: mytask
    type: org.kestra.core.tasks.debugs.Return
    format: "{{inputs.myinput}}"
```



## Usage

## Available context in Kestra
