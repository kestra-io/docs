---
title: How to Use Flowable Tasks in Kestra
icon: /docs/icons/tutorial.svg
---

Use Flowable Tasks to build powerful Flows

## Sequential

This flow will start the two sequential tasks in parallel and those will launch tasks one after the other.
::collapse{title="Example"}
```yaml file=public/examples/flows_sequential.yml
```
::

## Parallel

This flow will run three parallel tasks based on the `concurrent` property and will start the `last` task at the end.

::collapse{title="Example"}
```yaml file=public/examples/flows_parallel.yml
```
::
