---
order: 9
---
# Conditions

Conditions are used in [Triggers](../triggers) and [Listeners](../listeners) to limit the cases in which a task/execution is triggered.
For example: 
* you can limit a listener to only a specified status,
* you can limit a trigger to a specific namespace prefix. 
* .... 

You can pass a list of conditions, in this case, all the conditions must match to enable the current action.

Available conditions include: 

- [ExecutionFlowCondition](/plugins/core/conditions/io.kestra.core.models.conditions.types.ExecutionFlowCondition.html)
- [ExecutionNamespaceCondition](/plugins/core/conditions/io.kestra.core.models.conditions.types.ExecutionNamespaceCondition.html)
- [ExecutionStatusCondition](/plugins/core/conditions/io.kestra.core.models.conditions.types.ExecutionStatusCondition.html)
- [FlowCondition](/plugins/core/conditions/io.kestra.core.models.conditions.types.FlowCondition.html)
- [FlowNamespaceCondition](/plugins/core/conditions/io.kestra.core.models.conditions.types.FlowNamespaceCondition.html)
- [VariableCondition](/plugins/core/conditions/io.kestra.core.models.conditions.types.VariableCondition.html)
