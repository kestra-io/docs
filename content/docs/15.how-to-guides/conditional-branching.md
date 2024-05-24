---
title: Conditional Branching
icon: /docs/icons/tutorial.svg
---

How to use the Switch task to branch the flow based on a value.


Depending on the value passed as input, the will flow branch to different tasks. If there is no matching value, Kestra will use the `defaults` branch.

```yaml
id: switch
namespace: example

inputs:
  - id: string
    type: STRING

tasks:
  - id: parent-seq
    type: io.kestra.plugin.core.flow.Switch
    value: "{{inputs.string}}"
    cases:
      FIRST:
        - id: first
          type: io.kestra.plugin.core.debug.Return
          format: "{{task.id}} > {{taskrun.startDate}}"
      SECOND:
        - id: second1
          type: io.kestra.plugin.core.debug.Return
          format: "{{task.id}} > {{taskrun.startDate}}"
        - id: second2
          type: io.kestra.plugin.core.debug.Return
          format: "{{task.id}} > {{taskrun.startDate}}"
      THIRD:
        - id: third1
          type: io.kestra.plugin.core.flow.Sequential
          tasks:
            - id: failed
              type: io.kestra.plugin.scripts.shell.Commands
              runner: PROCESS
              commands:
                - 'exit 1'
          errors:
            - id: error1
              type: io.kestra.plugin.core.debug.Return
              format: "Error Trigger ! {{task.id}}"
    defaults:
      - id: default
        type: io.kestra.plugin.core.debug.Return
        format: "{{task.id}} > {{taskrun.startDate}}"

outputs:
  - id: extracted
    type: STRING
    value: "{{ outputs.first ?? outputs.second1 ?? outputs.third1 ?? outputs.default }}"
```
