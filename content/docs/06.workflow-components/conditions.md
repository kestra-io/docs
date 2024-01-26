---
title: Conditions
icon: /docs/icons/concepts.svg
---

Conditions are specific criteria or events that determine when a specific [Triggers](05.triggers/index.md) should create a new [Execution](04.execution.md). Usually, they limit the scope of a trigger to a specific set of cases.

For example, you can restrict a Flow trigger to a specific namespace prefix or execution status, and you can restrict a Schedule trigger to a specific time of the week or month.

You can pass a list of conditions; in this case, all the conditions must match to enable the current action.

Available conditions include:

- [ExecutionFlowCondition](/plugins/core/conditions/io.kestra.core.models.conditions.types.executionflowcondition)
- [ExecutionNamespaceCondition](/plugins/core/conditions/io.kestra.core.models.conditions.types.executionnamespacecondition)
- [ExecutionStatusCondition](/plugins/core/conditions/io.kestra.core.models.conditions.types.executionstatuscondition)
- [FlowCondition](/plugins/core/conditions/io.kestra.core.models.conditions.types.flowcondition)
- [FlowNamespaceCondition](/plugins/core/conditions/io.kestra.core.models.conditions.types.flownamespacecondition)
- [VariableCondition](/plugins/core/conditions/io.kestra.core.models.conditions.types.variablecondition)
