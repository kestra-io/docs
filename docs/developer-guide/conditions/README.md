---
order: 7
---
# Conditions

Conditions are use in [Triggers](../triggers) & [Listeners](../listeners) in order to limit the case this one could happen.
For example: 
* you can limit the listeners to only specified status
* you can limit triggers to specified namespace prefix 
* .... 

You can pass a list of conditions and all the conditions must match to enable the current action.

Available conditions are : 

## ExecutionStatusCondition

```yaml
type: "org.kestra.core.models.conditions.types.ExecutionStatusCondition"
```

> Condition based on execution status 


Examples : 
```yaml
  - conditions:
      - type: org.kestra.core.models.conditions.types.ExecutionStatusCondition
        in:
          - SUCCESS
        notIn: 
          - FAILED
```

### Inputs

#### `in`
* **Type:** <Badge vertical="middle" text="List<org.kestra.core.models.flows.State.Type>" />
* **Required:** ❌

> List of state that are authorized

#### `notIn`
* **Type:** <Badge vertical="middle" text="List<org.kestra.core.models.flows.State.Type>" />
* **Required:** ❌

> List of state that aren't authorized


## FlowCondition

```yaml
type: "org.kestra.core.models.conditions.types.FlowCondition"
```

> Condition for a specific flow


Examples : 
```yaml
  - conditions:
      - type: org.kestra.core.models.conditions.types.FlowCondition
        namespace: org.kestra.tests
        flowId: my-current-flow
```

### Inputs

#### `namespace`
* **Type:** <Badge vertical="middle" text="String" />
* **Required:** ✔

> The namespace of the flow

#### `flowId`
* **Type:** <Badge vertical="middle" text="String" />
* **Required:** ✔

> The flow id 


## NamespaceCondition

```yaml
type: "org.kestra.core.models.conditions.types.NamespaceCondition"
```

> Condition for a specific flow


Examples : 
```yaml
  - conditions:
      - type: org.kestra.core.models.conditions.types.NamespaceCondition
        namespace: org.kestra.tests
        prefix: true
```

### Inputs

#### `namespace`
* **Type:** <Badge vertical="middle" text="String" />
* **Required:** ✔

> The namespace of the flow or the prefix if `prefix` is true

#### `prefix`
* **Type:** <Badge vertical="middle" text="Boolean" />
* **Required:** ❌
* **Default:** `false`


> If we must look at the flow namespace by prefix (simple startWith case sensitive)

