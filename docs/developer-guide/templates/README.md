---
order: 9
---
# Templates

Templates are list of tasks that can be shared between flows. You can define a template and call it from other flows allowing to share a list of tasks and keep these task updated without changing your flow.

All tasks in a template will be executed sequentially, you can provide the same tasks than in *standard* flow and you can also have an *errros* path. 

<div style="text-align: right"> 
    <a class="btn" href="/plugins/core/tasks/flows/org.kestra.core.tasks.flows.Template">Template Task documentation</a> 
</div>

## Example

Below a flow sample that will include a template :
```yaml
id: with-template
namespace: org.kestra.tests

tasks:
  - id: template
    type: org.kestra.core.tasks.flows.Template
    namespace: org.kestra.tests
    templateId: template
```

If the template is defined like that : 

```yaml
id: template
namespace: org.kestra.tests

tasks:
  - id: 1-return
    type: org.kestra.core.tasks.debugs.Return
    format: "{{task.id}} > {{taskrun.startDate}}"
```

It will produce a flow same that this one :

```yaml
id: with-template
namespace: org.kestra.tests

tasks:
  - id: template
    type: org.kestra.core.tasks.flows.Sequential
    tasks:
      - id: 1-return
        type: org.kestra.core.tasks.debugs.Return
        format: "{{task.id}} > {{taskrun.startDate}}"
```

All the tasks within the template will be *copied* at the runtime 

