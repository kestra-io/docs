---
order: 7
---
# Conditions

Conditions are used in [Triggers](../triggers) & [Listeners](../listeners) in order to limit the cases in which a task/execution is triggered.
For example: 
* you can limit the listeners to only a specified status
* you can limit triggers to specified namespace prefix 
* .... 

You can pass a list of conditions and all the conditions must match to enable the current action.

Available conditions include: 

- [ExecutionFlowCondition](/plugins/core/conditions/io.kestra.core.models.conditions.types.ExecutionFlowCondition.html)
- [ExecutionNamespaceCondition](/plugins/core/conditions/io.kestra.core.models.conditions.types.ExecutionNamespaceCondition.html)
- [ExecutionStatusCondition](/plugins/core/conditions/io.kestra.core.models.conditions.types.ExecutionStatusCondition.html)
- [FlowCondition](/plugins/core/conditions/io.kestra.core.models.conditions.types.FlowCondition.html)
- [FlowNamespaceCondition](/plugins/core/conditions/io.kestra.core.models.conditions.types.FlowNamespaceCondition.html)
- [VariableCondition](/plugins/core/conditions/io.kestra.core.models.conditions.types.VariableCondition.html)
