---
title: Runnable Tasks in Kestra – Execute Workloads
description: Learn about Runnable Tasks in Kestra. Execute compute-intensive workloads like scripts, API calls, and database queries using distributed workers.
sidebarTitle: Runnable Tasks
icon: /src/contents/docs/icons/flow.svg
---

Data processing tasks handled by the workers.

## Execute work with runnable tasks

Runnable tasks handle data processing, such as file system operations, API calls, and database queries. They can be compute-intensive and are executed by workers.

Each task requires an identifier (`id`) and a type, defined by its Java Fully Qualified Class Name (FQCN).

Tasks include properties specific to their type. Refer to each task’s documentation for a full list of available properties.

Most tasks are runnable, except for [Flowable tasks](../00.flowable-tasks/index.md), which control orchestration logic.

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
