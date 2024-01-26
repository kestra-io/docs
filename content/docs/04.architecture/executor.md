---
title: Executor
icon: /docs/icons/architecture.svg
---

The **Executor** handles all executions and [flowable tasks](flowable-tasks.md). The only goal of the Executor is to receive created executions and look for the next tasks to run. This server component doesnot handle any heavy computation.

The Executor also handles special execution cases:
- [Listeners](listeners.md)
- [Flow Triggers](05.triggers/flow-trigger.md)
- [Templates](templates.md)

You can scale Executors as necessary. Given that no heavy computations are performed by this component, it requires very few resources (except for deployments with a large number of executions).