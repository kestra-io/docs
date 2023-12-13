---
title: Flow-level concurrency control
---

The flow-level `concurrency` property allows you to control the number of concurrent executions of a given flow. You can limit the number of concurrent executions of a given flow by setting the `limit` key.

You can treat that concurrency as a global concurrency limit for that specific flow. The concurrency limit and behavior is then applied to all executions of that flow, regardless of whether those executions have been started automatically via a trigger, webhook, an API call or an ad-hoc run created from the UI.

For example, if you set the concurrency `limit` to 2, then only two executions of that flow will be allowed to run at the same time. If you try to trigger a third execution, it will be, by default, queued until one of the two running executions is completed.

It's also possible to CANCEL or FAIL an execution if the concurrency limit is reached. You can customize that behavior by setting the `behavior`, which is an Enum-type property with three possible values: `QUEUE`, `CANCEL` or `FAIL`. When using the `CANCEL` or `FAIL` behavior, the third execution's state will be immediately set to `CANCELLED` or `FAILED` status without running any task.

Here is an example flow that uses the `concurrency` property to limit the number of concurrent executions to 2. The `bash` task will sleep for 10 seconds, so you can trigger multiple executions of that flow and see how the `concurrency` property behaves.

```yaml
id: concurrency_limited_flow
namespace: dev

concurrency:
  behavior: QUEUE # or CANCEL or FAIL
  limit: 2 # can be any integer >= 1

tasks:
  - id: bash
    type: io.kestra.plugin.scripts.shell.Commands
    commands:
      - sleep 10
```