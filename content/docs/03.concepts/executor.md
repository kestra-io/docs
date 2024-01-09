---
title: Executor
---

The **Executor** handles all executions and [flowable tasks](flowable-tasks.md). The only goal of the Executor is to receive created executions and look for the next tasks to run. There is no heavy computation required (and no capacity for it) for this server component.

The Executor also handles special execution cases:
- [Listeners](listeners.md)
- [Flow Triggers](triggers/flow-trigger.md)
- [Templates](templates.md)

You can scale Executors as necessary, but as no heavy computations are done in the Executor, this server component only requires little resources (unless you have a very high rate of executions).