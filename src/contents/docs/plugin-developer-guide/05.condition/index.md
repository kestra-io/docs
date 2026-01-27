---
title: Develop a Kestra Condition Plugin
sidebarTitle: Develop a Condition
icon: /src/contents/docs/icons/dev.svg
description: Develop custom Condition plugins for Kestra to control flow execution logic based on specific criteria.
---


Here is how you can develop a new [Condition](../../05.workflow-components/07.triggers/index.mdx#conditions).

## Build a condition plugin for Kestra

:::collapse{title="Here is a simple condition example that validate the current flow:"}

```java
@SuperBuilder
@ToString
@EqualsAndHashCode
@Getter
@NoArgsConstructor
@Schema(
    title = "Condition for a specific flow"
)
@Plugin(
    examples = {
        @Example(
            full = true,
            code = {
                "- conditions:",
                "    - type: io.kestra.plugin.core.condition.FlowCondition",
                "      namespace: company.team",
                "      flowId: my-current-flow"
            }
        )
    }
)
public class FlowCondition extends Condition {
    @NotNull
    @Schema(title = "The namespace of the flow")
    public String namespace;

    @NotNull
    @Schema(title = "The flow ID")
    public String flowId;

    @Override
    public boolean test(ConditionContext conditionContext) {
        return conditionContext.getFlow().getNamespace().equals(this.namespace) && conditionContext.getFlow().getId().equals(this.flowId);
    }
}
```
:::

You just need to extend `Condition` and implement the `boolean test(ConditionContext conditionContext)` method.

You can have any properties you want for any task such as validation or documentation; everything works the same way.

The `test` will receive a `ConditionContext` that will expose:
- `conditionContext.getFlow()`: the current flow.
- `conditionContext.getExecution()`: the current execution that can be null for [Triggers](../04.trigger/index.md).
- `conditionContext.getRunContext()`: a RunContext in order to render your properties.

This method must simply return a boolean in order to validate the condition.

## Documentation

Remember to document your conditions. For this, we provide a set of annotations explained in the [Document each plugin](../07.document/index.md) section.
