---
order: 9
---
# Templates

Templates are list of tasks that can be shared between flows. You can define a template and call it from other flows allowing to share a list of tasks and keep these task updated without changing your flow.

All tasks in a template will be executed sequentially, you can provide the same tasks than in *standard* flow and you can also have an *errros* path. 

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
      renamed-store: "{{ inputs.store }}
```

If the template is defined like that : 

```yaml
id: template
namespace: io.kestra.tests

tasks:
  - id: 1-return
    type: io.kestra.core.tasks.debugs.Return
    format: "{{ parent.outputs.args.renamed-store }}"
```

It will produce a flow same that this one :

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

All the tasks within the template will be *copied* at the runtime.

:::warning
From the template, you can access all the variables defined on the context executions. But it's highly discouraged, the better will be to use `args` to rename variables from global context to a local one. 
:::

By this way, your template will be usable on many flows. Just think `args` as argument for a function in code ! 

