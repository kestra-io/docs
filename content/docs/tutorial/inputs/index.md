---
order: 2
---

# Inputs

Flows can have Input. They are parameters provided when starting a flow. They help make your flow more dynamic and reusable.

## Defining inputs

We defined Inputs in the `inputs` section of the flow file. They must have a `name` and a `type`.
You can also set a `default` value.

```yaml
inputs:
  - name: isTutorial
    type: BOOLEAN
    default: true
```

| Type    | Description                                                            |
|---------|------------------------------------------------------------------------|
| STRING  | No control is done on this input type (no parsing), can be any string. |
| INT     | Must be a valid integer (without any decimals).                        |
| BOOLEAN | Must be a valid true or false as string.                               |

Discover more types on the [input documentation](https://kestra.io/docs/developer-guide/flow/inputs).

## Accessing inputs

Kestra includes a templating engine to access variables in your flow. Use the <code v-pre>{{ variable }}</code> syntax to access them.
Find more on the [variable documentation.](../../developer-guide/variables)

Inputs can be accessed in the flow using the <code v-pre>{{ inputs.name }}</code> syntax.


## Add inputs to your flow

In our example, we will provide the URL of the CSV file we want to download in Input. But we will set a default value if the user doesn't provide it.

```yaml
inputs:
  - name: url
    type: STRING
    default: "https://www.data.gouv.fr/fr/datasets/r/d33eabc9-e2fd-4787-83e5-a5fcfb5af66d"
```

:: details Click here to see the full flow
```yaml
id: kestra-tutorial
namespace: io.kestra.tutorial
labels:
  env: PRD
description: |
  # Kestra Tutorial
  As you notice, we can use markdown here.
inputs:
  - name: url
    type: STRING
    default: "https://www.data.gouv.fr/fr/datasets/r/d33eabc9-e2fd-4787-83e5-a5fcfb5af66d"
tasks:
  - id: download
    type: io.kestra.plugin.fs.http.Download
    uri: "{{ inputs.url }}"
```
::

<NextStep message="Follow the next step to see what's your task outputs" link="../outputs/"/>