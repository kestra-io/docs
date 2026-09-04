---
title: Runnable Tasks in Kestra – Execute Workloads
h1: Execute Scripts, API Calls, and Queries with Runnable Tasks
description: Learn about Runnable Tasks in Kestra. Execute compute-intensive workloads like scripts, API calls, and database queries using distributed workers.
sidebarTitle: Runnable Tasks
icon: /src/contents/docs/icons/flow.svg
---

Runnable tasks perform the actual work in a flow — file system operations, API calls, database queries, and scripts — executed by distributed workers.

Each task requires an `id` and a `type`, defined by its fully qualified Java class name. Refer to each task’s plugin documentation for a full list of available properties.

Most tasks are runnable. The exception is [Flowable tasks](../00.flowable-tasks/index.md), which control orchestration logic and run on the executor rather than workers.

By default, Kestra includes only a few runnable tasks. Many more are available as [plugins](/plugins), and the default Docker image comes preloaded with several of them.

## Example

The following example shows two runnable tasks: one that makes an HTTP request and another that logs its output.

```yaml
id: runnable_http
namespace: company.team

tasks:
  - id: make_request
    type: io.kestra.plugin.core.http.Request
    uri: https://kestra.io/api/mock
    method: GET
    contentType: application/json

  - id: print_status
    type: io.kestra.plugin.core.log.Log
    message: "{{ outputs.make_request.body }}"
```
