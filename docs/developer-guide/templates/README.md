---
order: 9
---
# Templates

Templates are lists of tasks that can be shared between flows. You can define a template and call it from other flows, allowing it to share a list of tasks and keep these tasks updated without changing your flow.

All tasks in a template will be executed sequentially, you can provide the same tasks that are found in a *standard* flow and you can also provide an *errors* path.

<div style="text-align: right">
    <a class="btn" href="/plugins/core/tasks/flows/io.kestra.core.tasks.flows.Template">Template Task documentation</a>
</div>

## Example

Below a flow sample that will include a template :
```yaml
id: with-template
namespace: io.kestra.tests

inputs:
  - name: store
    type: STRING
    required: true

tasks:
  - id: template
    type: io.kestra.core.tasks.flows.Template
    namespace: io.kestra.tests
    templateId: template
    args:
      renamedStore: "{{ inputs.store }}
```

If the template is defined like this :

```yaml
id: template
namespace: io.kestra.tests

tasks:
  - id: 1-return
    type: io.kestra.core.tasks.debugs.Return
    format: "{{ parent.outputs.args.renamedStore }}"
```

It will produce a flow similar to this one:

```yaml
id: with-template
namespace: io.kestra.tests

tasks:
  - id: template
    type: io.kestra.core.tasks.flows.Sequential
    tasks:
      - id: 1-return
        type: io.kestra.core.tasks.debugs.Return
        format: "{{ inputs.store }}"
```

All the tasks within the template will be *copied* at runtime.

:::warning
From the template, you can access all the variables defined on the context executions. However, this is highly discouraged, the better will be to use `args` to rename variables from global context to a local one.
:::

By this way, your template will be usable on many flows. Just think `args` as argument for a function in code !

