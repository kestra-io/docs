
# Flow trigger


```yaml
type: "org.kestra.core.models.triggers.types.Schedule"
```

> Kestra is able to trigger flow after another one. This allows chaining flow without need to update the base flows. 
  With that, you can break responsibility between different flow to different teams.

## Example

```yaml
triggers:
  - id: listen-flow
    type: org.kestra.core.models.triggers.types.Flow
    inputs:
      from-parent: '{{ outputs.invalid.value }}'
    conditions:
      - type: org.kestra.core.models.conditions.types.FlowCondition
        namespace: org.kestra.tests
        flowId: trigger-flow
```


## Inputs

### `id`
* **Type:** <Badge vertical="middle" text="String" />
* **Required:** ✔

> unique for a flow 


### `inputs`
* **Type:** <Badge vertical="middle" text="Map<String, Object>" />
* **Required:** ❌
* **Dynamic:** ✔

> fill input of this flow based on output of current flow, allowing to pass data or file on the triggered flow


::: warning
If you provide invalid input, the flow will be created and already state as FAILED! Since there is no task started, you can't log any reason visible on the ui.
So you will need to go to server log to understand the error
:::

### `conditions`
* **Type:** <Badge vertical="middle" text="List<Condition>" />
* **Required:** ❌

> List of  [Conditions](../conditions) in order to limit the flow trigger. 

::: warning
If you don't provide any conditions, the flow will be triggered for **EVERY execution** of **EVERY flow** on your instance.
:::


## Variables 
When the flow is trigger by another one, some context variables will be injected to allow some customization of the flow.

| Parameter | Description |
| ---------- | ----------- |
|  <code v-pre>{{ trigger.executionId }}</code> | the execution id that trigger the current flow |
|  <code v-pre>{{ trigger.namespace }}</code> | the namespace of the flow that trigger the current flow |
|  <code v-pre>{{ trigger.flowId }}</code> | the flow id that trigger the current flow |
|  <code v-pre>{{ trigger.flowRevision }}</code> | the flow revision that trigger the current flow |
