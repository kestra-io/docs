---
title: Disabled flag
---

The `disabled` flag is a boolean property that allows you to disable a flow, task or trigger.

## Disabled flow

When a flow is disabled, it will not be executed — even if a trigger is set. If you have an active trigger on a disabled flow, it will be effectively ignored. You don't even need to disable the trigger — it will be ignored automatically. Setting a flow to `disabled` will effectively prefent any future executions of the flow until it is re-enabled.

Try adding the following flow and try to both run it and observe the scheduled executions:

```yaml
id: disabled_flow
namespace: dev
disabled: true

tasks:
  - id: hello
    type: io.kestra.core.tasks.log.Log
    message: Kestra team wishes you a great day! 👋

triggers:
  - id: fail_every_minute
    type: io.kestra.core.models.triggers.types.Schedule
    cron: "*/1 * * * *"
```

You will see that you cannot run the flow and that the trigger is ignored — no executions are created.

![disabled_flag](/docs/concepts/disabled_flag_1.png)

When trying to execute a disabled flow from a subflow:

```yaml
id: parent_runs_disabled_flow
namespace: dev
tasks:
  - id: disabled_subflow
    type: io.kestra.core.tasks.flows.Subflow
    flowId: disabled_flow
    namespace: dev
```

When you execute the parent flow, it will immediately fail with the error message: `Cannot execute a flow which is disabled`.

![disabled_flag_2](/docs/concepts/disabled_flag_2.png)

Similarly, try running a disabled flow via an API call:

```bash
curl -X POST http://localhost:28080/api/v1/executions/trigger/dev/parent_runs_disabled_flow
```

The API call itself will be successful:

```bash
{"id":"5ScXvrnOkjfKIXqYylRYME","namespace":"dev","flowId":"parent_runs_disabled_flow","flowRevision":1,"state":{"current":"CREATED","histories":[{"state":"CREATED","date":"2024-01-19T20:38:48.474047013Z"}],"duration":"PT0.011094958S","startDate":"2024-01-19T20:38:48.474047013Z"},"originalId":"5ScXvrnOkjfKIXqYylRYME"}%
```

However, that execution will be immediately marked as failed with the error message: `Cannot execute a flow which is disabled`.

## Disabled trigger

Often, when you use a Schedule trigger, it's useful to disable it temporarily. For example, you may want to disable a trigger while you are debugging a flow. You can do this by setting the `disabled` flag to `true` on the trigger:

```yaml
id: myflow
namespace: dev

tasks:
  - id: hello
    type: io.kestra.core.tasks.log.Log
    message: hello from a scheduled flow

triggers:
  - id: daily
    type: io.kestra.core.models.triggers.types.Schedule
    cron: "0 9 * * *"
    disabled: true
```

You will see that no scheduled executions are created for this flow. Once you are done debugging, you can re-enable the trigger by setting the `disabled` flag to `false` or simply by removing the `disabled` flag:

```yaml
id: myflow
namespace: dev

tasks:
  - id: hello
    type: io.kestra.core.tasks.log.Log
    message: hello from a scheduled flow

triggers:
  - id: daily
    type: io.kestra.core.models.triggers.types.Schedule
    cron: "0 9 * * *"
```

## Disabled task

In contrast to preventing the entire flow from being executed by setting the flow or trigger to `disabled`, you can also disable a single task. This is useful when you want to temporarily disable a single task without deleting it e.g. when troubleshooting a failure. You can do this by setting the `disabled` flag to `true` on the task:

```yaml
id: myflow
namespace: dev

tasks:
  - id: enabled
    type: io.kestra.core.tasks.log.Log
    message: this task will run

  - id: disabled
    type: io.kestra.core.tasks.debugs.Return
    format: this task will be skipped
    disabled: true
```

You will see in the UI that disabled tasks are greyed out:

![disabled_flag_3](/docs/concepts/disabled_flag_3.png)

