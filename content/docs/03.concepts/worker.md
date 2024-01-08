---
title: Worker
---

All tasks and polling triggers are executed by a **Worker**. A Worker receives and processes tasks from the Executor and polling triggers from the Scheduler. Given that tasks and polling triggers can be virtually anything (heavy computations, simple API calls, etc.), the Worker is essentially a Thread Pool where you can configure the number of threads you need.

You can scale Workers as necessary and have many instances on multiple servers, each with its own Thread Pool.

As the worker executes the tasks and the polling triggers, it needs access to any external services they use (database, REST services, message broker, etc.). Workers are the only server components that need access to external services.