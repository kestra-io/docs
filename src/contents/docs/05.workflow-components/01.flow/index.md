---
title: Flows in Kestra – Define Orchestration Units
h1: "Understand Flows: The Core Units of Kestra Orchestration"
description: Understand Kestra Flows, the fundamental units of orchestration. Learn to define tasks, inputs, outputs, and logic to automate your business processes.
sidebarTitle: Flow
icon: /src/contents/docs/icons/flow.svg
docId: flows
---

A flow is a container for tasks and their orchestration logic.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/sJJORcNmpM4?si=Xkaak8Je_f19km5e" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-background; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Components of a flow

A flow organizes tasks, their inputs and outputs, error handling, and orchestration logic. It specifies **what** tasks run, **when** they run, and **how** they interact (sequentially, in parallel, or conditionally).

You can define a flow declaratively in YAML or build it using the [No Code editor](../../09.ui/01.flows/index.md).

A flow must have:

- identifier (`id`)
- [`namespace`](../02.namespace/index.md)
- [list of `tasks`](../01.tasks/index.mdx)

Optionally, a flow can also have:

- [inputs](../05.inputs/index.md) — typed parameters passed at execution time
- [outputs](../06.outputs/index.md) — values or files a flow produces for downstream use
- [variables](../04.variables/index.md) — reusable key/value pairs scoped to the flow
- [triggers](../07.triggers/index.mdx) — schedule or event conditions that start executions automatically
- [labels](../08.labels/index.md) — key/value metadata for filtering and grouping executions
- [errors](../11.errors/index.md) — tasks that run when a flow or task fails
- [finally](../19.finally/index.md) — tasks that always run at the end, regardless of execution outcome
- [retries](../12.retries/index.md) — automatic retry policy on task failure
- [sla](../18.sla/index.md) — time-based constraints that fail or alert when exceeded
- [concurrency](../14.concurrency/index.md) — limits on how many executions of this flow can run simultaneously
- [descriptions](../15.descriptions/index.md) — Markdown documentation attached to flows and tasks
- [disabled](../16.disabled/index.md) — prevent a flow from executing without deleting it
- [checks](../07.checks/index.md) — assertions that must pass before an execution is created

## Flow sample

The example below uses several of the optional components listed above — refer to each component's documentation for full configuration details.

```yaml
id: hello-world
namespace: company.team

description: flow **documentation** in *Markdown*

labels:
  env: prod
  team: engineering

inputs:
  - id: my-value
    type: STRING
    defaults: "default value"
    description: This input has a default value.

variables:
  first: "1"
  second: "{{ vars.first }} > 2"

tasks:
  - id: hello
    type: io.kestra.plugin.core.log.Log
    description: "Log the input value passed at execution time."
    message: "Hello, {{ inputs.['my-value'] }}!"

  - id: date
    type: io.kestra.plugin.core.debug.Return
    description: "Return the current date as a task output."
    format: "{{ taskrun.startDate }}"

outputs:
  - id: execution_date
    type: STRING
    value: "{{ outputs.date.value }}"

triggers:
  - id: daily
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 9 * * *"
```

## Revision

Every change to a flow creates a new revision. Kestra automatically manages revisions, similar to version control, and you can view them in the **Revisions** tab.

Use **Save as draft** to stage changes without affecting running executions. Draft revisions are not executed — any trigger or manual run falls back to the last published revision until you publish the draft. See [Draft revisions](../../06.concepts/03.revision/index.md#draft-revisions) for details.

## Flow variable expressions

| Parameter | Description |
|---|---|
| `{{ flow.id }}` | The identifier of the flow. |
| `{{ flow.namespace }}` | The name of the flow namespace. |
| `{{ flow.tenantId }}` | The identifier of the tenant (EE only). |
| `{{ flow.revision }}` | The revision of the flow. |

## FAQ

### Where does Kestra store flows?

Flows are stored in a serialized format directly in the Kestra backend database.

The easiest way to add new flows is from the Kestra UI. You can also use [`kestractl flows deploy`](../../kestra-cli/kestractl/index.md) to push flows from the command line, or use the Git Sync pattern or CI/CD integration to deploy flows automatically after a pull request is merged. On Kestra Enterprise, [Promote](../../version-control-cicd/06.promote/index.md) lets you move a flow between environments (dev, staging, production) directly from the UI without a pipeline.

To see how flows are represented in a file structure, use the `_flows` directory in the [Namespace Files](../../06.concepts/02.namespace-files/index.md) editor.

### How to load flows at server startup?

To pre-load flows from a directory when Kestra starts, use the `-f` or `--flow-path` flag:

```bash
./kestra server standalone --flow-path /path/to/flows
```

### Can I sync a local flows directory into Kestra?

Yes. See [Synchronize Local Flows](../../15.how-to-guides/local-flow-sync/index.md) for syncing a local directory, or [Sync Flows from a Git Repository](../../15.how-to-guides/syncflows/index.md) for Git-based workflows.
