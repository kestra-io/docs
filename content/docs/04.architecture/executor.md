---
title: Executor
icon: /docs/icons/architecture.svg
---

The **Executor** processes all executions and flowable tasks.

The primary goal of the Executor is to receive created executions and look for the next tasks to run. This server component doesn't perform any heavy computation.

The Executor also handles special execution cases:
- Flow Triggers
- Templates (deprecated)
- Listeners (deprecated)

You can scale Executors as necessary. Given that no heavy computations are performed by this component, it requires very few resources (except for deployments with a large number of executions).