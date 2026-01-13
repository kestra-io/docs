---
title: JSON Object Serialization
icon: /docs/icons/migration-guide.svg
release: 0.17.0
---

How to adapt flows to the `NON_NULL` JSON serialization strategy.

Kestra 0.17 migrates away from the previously used `NON_DEFAULT` JSON serialization strategy to fix various limitations and make the flow behavior more user-friendly. This change makes empty lists or maps serialized instead of being undefined. Adapting [Pebble expressions](../../expressions/index.md) relying on the previously existing behavior is necessary to keep the functionality untouched.

There are three main cases where Pebble expressions might be affected:

1) [Ternary operator](../../expressions/index.md#conditional-ternary-operator)
2) [Null-Coalescing Operator](../../expressions/index.md#null-coalescing-operator)
3) [Conditions in Pebble](../../06.concepts/06.pebble.md#using-conditions-in-pebble)

## Examples

### 0.16

```yaml
id: inputsV16
namespace: company.team

inputs:
  - id: optionalInput
    type: STRING
    required: false

tasks:
  - id: testNullCoalescing
    type: io.kestra.core.tasks.log.Log
    message: "=>{{ inputs.optionalInput ?? 'undefined' }}<=" # =>undefined<=
  - id: testOutputsMapPrepare
    type: io.kestra.plugin.scripts.python.Script
    script: "print('test')"
  - id: testOutputsMap
    type: io.kestra.core.tasks.log.Log
    message: "=>{{ outputs.testOutputsMapPrepare.outputFiles ?? 'empty' }}<=" # =>empty<=
  - id: testCondition
    type: io.kestra.core.tasks.flows.If
    condition: "{{ outputs.testOutputsMapPrepare.outputFiles is defined }}"
    then:
      - id: logOutputFiles
        type: io.kestra.core.tasks.log.Log
        message: "found"
    else:
      - id: logNoOutputFiles
        type: io.kestra.core.tasks.log.Log
        message: "not found" # not found
```

### 0.17

```yaml
id: inputsV17
namespace: company.team

inputs:
  - id: optionalInput
    type: STRING
    required: false

tasks:
  - id: testNullCoalescing
    type: io.kestra.plugin.core.log.Log
    message: "=>{{ inputs.optionalInput ?? 'undefined' }}<=" # =><=
  - id: testOutputsMapPrepare
    type: io.kestra.plugin.scripts.python.Script
    taskRunner:
      type: io.kestra.plugin.scripts.runner.docker.Docker
    containerImage: python:3.11-slim
    script: "print('test')"
  - id: testOutputsMap
    type: io.kestra.plugin.core.log.Log
    message: "=>{{ outputs.testOutputsMapPrepare.outputFiles ?? 'empty' }}<=" # =>{}<=
  - id: testCondition
    type: io.kestra.core.tasks.flows.If
    condition: "{{ outputs.testOutputsMapPrepare.outputFiles is defined }}"
    then:
      - id: logOutputFiles
        type: io.kestra.plugin.core.log.Log
        message: "found" # found
    else:
      - id: logNoOutputFiles
        type: io.kestra.plugin.core.log.Log
        message: "not found"
```

For more information, you can refer the [Improved serialization of JSON objects](../../../blogs/2024-06-04-release-0-17.md#improved-serialization-of-json-objects) page.
