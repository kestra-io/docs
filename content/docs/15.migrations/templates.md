---
title: Deprecation of Templates
---

Templates are marked as deprecated and disabled by default starting from the 0.11.0 release. Please use subflows instead. You can re-enable them with this [configuration](../09.administrator-guide/01.configuration/05.others.md).


## Why templates are deprecated

1. Subflows are more powerful — subflows provide the same functionality as templates while simultaneously being more flexible than templates. For instance,  `inputs` are not allowed in a template because a template is only a list of tasks that get copied to another flow that references it. In contrast, when invoking a subflow, you can parametrize it with custom parameters. This way, subflows allow you to define workflow logic once and invoke it in other flows with custom parameters.
2. Subflows are more transparently reflected in the topology view and don't require copying tasks.


If you are using templates and you are not ready to migrate to subflows yet, add the following Kestra configuration option to still be able to use them:

```yaml
kestra:
  templates:
    enabled: true
```


---

## Templates :warning:

A typical template has an ID, a namespace, and a list of tasks. Here is an example template:

```yaml
id: mytemplate
namespace: dev
tasks:
  - id: workingDir
    type: io.kestra.core.tasks.flows.WorkingDirectory
    tasks:
      - id: bash
        type: io.kestra.plugin.scripts.shell.Commands
        commands:
          - mkdir -p out
          - echo "Hello from 1" >> out/output1.txt
          - echo "Hello from 2" >> out/output2.txt
          - echo "Hello from 3" >> out/output3.txt
          - echo "Hello from 4" >> out/output4.txt
        runner: PROCESS
      - id: out
        type: io.kestra.core.tasks.storages.LocalFiles
        outputs:
          - out/**
  - id: each
    type: io.kestra.core.tasks.flows.EachParallel
    value: "{{outputs.out.uris | jq('.[]')}}"
    tasks:
      - id: path
        type: io.kestra.core.tasks.debugs.Return
        format: "{{taskrun.value}}"
      - id: contents
        type: io.kestra.plugin.scripts.shell.Commands
        commands:
          - cat "{{taskrun.value}}"
        runner: PROCESS
```

You can trigger it in a flow using the `io.kestra.core.tasks.flows.Template` task:

```yaml
id: templatedFlow
namespace: dev

tasks:
  - id: first
    type: io.kestra.core.tasks.log.Log
    message: first task

  - id: template
    type: io.kestra.core.tasks.flows.Template
    namespace: dev
    templateId: mytemplate

  - id: last
    type: io.kestra.core.tasks.log.Log
    message: last task
```

This example shows that templates are pretty restrictive — you can only invoke them as-is. You cannot set custom input values, and there is no link from this flow to the template. In contrast, subflows can be parametrized, and you can navigate to the subflow in the topology view. From the 0.11.0 release, you can also expand and collapse a subflow (child flow) to inspect the available tasks directly from the parent flow.

---

## Subflows ✅

To migrate from a template to a subflow, you can create a flow that is a 1:1 copy of your template. This flow can then be invoked as a subflow the same way you used to invoke a template (only using a different task).

In our example, we can create a new flow called `mytemplate` in a namespace `dev`. This flow will be invoked from a parent flow as a subflow.

Then, to create a child flow (a subflow), you only need to change the following values in the `templatedFlow`:
- Change the `io.kestra.core.tasks.flows.Template` task type to `io.kestra.core.tasks.flows.Flow`
- Change the `templateId` to `flowId`.

See the example below showing how you can invoke a subflow from a parent flow:

```yaml
id: parentFlow
namespace: dev
tasks:
  - id: subflow
    type: io.kestra.core.tasks.flows.Flow
    namespace: dev
    flowId: mytemplate
```

And here is a complete example showing how a template task can be migrated to a subflow task:

```yaml
id: parentFlow
namespace: dev

tasks:
  - id: first
    type: io.kestra.core.tasks.log.Log
    message: first task

  - id: subflow
    type: io.kestra.core.tasks.flows.Flow
    namespace: dev
    flowId: mytemplate

  - id: last
    type: io.kestra.core.tasks.log.Log
    message: last task
```

If your subflow has input parameters and you want to override them when calling the subflow, you can configure them as follows:

```yaml
id: parentFlow
namespace: dev

tasks:
  - id: first
    type: io.kestra.core.tasks.log.Log
    message: first task

  - id: subflow
    type: io.kestra.core.tasks.flows.Flow
    namespace: dev
    flowId: mytemplate
    inputs:
      myIntegerParameter: 42
      myStringParameter: hello world!

  - id: last
    type: io.kestra.core.tasks.log.Log
    message: last task
```

---

## Side-by-side comparison

You can look at both a flow with a template task and a flow with a subflow task side by side to see the difference in syntax:


![template-vs-subflow](/docs/migrations/template-vs-subflow.png)


If you still have questions about migrating from templates to subflows, reach out via our [Community Slack](https://kestra.io/slack).

