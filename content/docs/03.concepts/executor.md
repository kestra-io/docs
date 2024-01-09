---
title: Executor
---

The **Executor** handles all executions and [flowable tasks](./05.developer-guide/02.tasks.md#flowable-tasks). The only goal of the Executor is to receive created executions and look for the next tasks to run. There is no heavy computation required (and no capacity for it) for this server component.

The Executor also handles special execution cases:
- [Listeners](./03.concepts/listeners.md)
- [Flow Triggers](./05.developer-guide/08.triggers/02.flow.md)
- [Templates](./05.developer-guide/03.concepts/templates.md)

You can scale Executors as necessary, but as no heavy computations are done in the Executor, this server component only requires little resources (unless you have a very high rate of executions).