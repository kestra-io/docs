---
title: "Optimizing Performance in Kestra in Version 0.23"
description: "Performance is a critical aspect of an orchestrator. Discover how Kestra 0.23 significantly enhances execution speed, reduces resource consumption, and improves overall system performance."
date: 2025-06-18T13:00:00
category: Solutions
author:
  name: Loïc Mathieu
  image: lmathieu
  role: Lead Developer
image: TODO
---

In 0.22, the engineering team focused on performance in multiple areas, you can find the details in the blog post [Optimizing Performance in Kestra in Version 0.22](https://kestra.io/blogs/2025-04-08-performance-improvements).

Even if in 0.23 we didn't focus on performance, we still made some pretty interesting optimization that we will introduce in this article.

## Smarter Output Processing

The Kestra Executor merges task outputs so that subsequent tasks can access previous task outputs via our expression language. This operation clones the entire output map, incurring high CPU and memory costs.

With 0.22, we optimized this by only merging outputs for tasks that require it (e.g., ForEach tasks as they produce outputs from the same task identifier) among other enhancements.

We continue further on improvements in this area by avoiding merging empty task outputs and improving the way we iteratively merge the outputs.

For example, the following flow goes down from 44s to 13s to process the 160 loop iterations!

::collapse{title="Expand to see the Benchmark Flow"}
```yaml
id: hummingbird_941521
namespace: company.team

tasks:

  - id: foreach
    type: io.kestra.plugin.core.flow.ForEach
    values: "{{range(1, 160)}}"
    concurrencyLimit: 0
    tasks:
      - id: log
        type: io.kestra.plugin.core.log.Log
        message: Some log
```
::

This was the happy case, when there are no outputs, using the same flow with the `OutpuValues` task instead of the `Log` task will still bring an enhancement from 44s to 24s.

Further details on these two pull requests: [PR #8914](https://github.com/kestra-io/kestra/pull/8914) and [PR #8911](https://github.com/kestra-io/kestra/pull/8911)

## Flowable task processing improvements

Flowable tasks provide the orchestration logic of Kestra; they are run by the Executor, not the Worker.

But for simplicity, we mimic a task execution by the Worker for all flowable tasks, sending them unnecessarily to our internal queue, leading to another update then processing of the execution. This was suboptimal.

In 0.23, we directly record flowable tasks results inside the execution when processing them in the Executor, avoiding unnecessary work by both our internal queue and the Executor.

Further details on this pull request: [PR #8236](https://github.com/kestra-io/kestra/pull/8236).

Let's take as example this flow that have 5 [If](https://kestra.io/plugins/core/flow/io.kestra.plugin.core.flow.if) task, the `If` task is a flowable task:

::collapse{title="Expand to see the Benchmark Flow"}
```yaml
id: bench-flowable
namespace: company.team

inputs:
  - id: condition
    type: BOOL
    defaults: true

triggers:
  - id: webhook
    type: io.kestra.plugin.core.trigger.Webhook
    key: webhook

tasks:
  - id: if1
    type: io.kestra.plugin.core.flow.If
    condition: "{{inputs.condition}}"
    then:
    - id: hello-true-1
      type: io.kestra.plugin.core.log.Log
      message: Hello True 1
    else:
    - id: hello-false-1
      type: io.kestra.plugin.core.log.Log
      message: Hello False 1
  - id: if2
    type: io.kestra.plugin.core.flow.If
    condition: "{{inputs.condition}}"
    then:
    - id: hello-true-2
      type: io.kestra.plugin.core.log.Log
      message: Hello True 2
    else:
    - id: hello-false-2
      type: io.kestra.plugin.core.log.Log
      message: Hello False 2
  - id: if1-3
    type: io.kestra.plugin.core.flow.If
    condition: "{{inputs.condition}}"
    then:
    - id: hello-true-3
      type: io.kestra.plugin.core.log.Log
      message: Hello True 3
    else:
    - id: hello-false-3
      type: io.kestra.plugin.core.log.Log
      message: Hello False 3
  - id: if4
    type: io.kestra.plugin.core.flow.If
    condition: "{{inputs.condition}}"
    then:
    - id: hello-true-4
      type: io.kestra.plugin.core.log.Log
      message: Hello True 4
    else:
    - id: hello-false-4
      type: io.kestra.plugin.core.log.Log
      message: Hello False 4
  - id: if5
    type: io.kestra.plugin.core.flow.If
    condition: "{{inputs.condition}}"
    then:
    - id: hello-true-5
      type: io.kestra.plugin.core.log.Log
      message: Hello True 5
    else:
    - id: hello-false-5
      type: io.kestra.plugin.core.log.Log
      message: Hello False 5
```
::

When launching a single execution, this would not make any noticeable difference. But under a load of 10 executions per second, performance is increased by x3: from 12 seconds by execution in 0.22 to 4 seconds in 0.23.

## Missing indices on the JDBC backend

Thanks to user feedback, we discover that we miss some indices on tables on our JDBC backend.

The `service_instance` table was missing and index, and a purge mechanism! We added both and queries on this table show not to be an issue anymore. This table is used to monitor Kestra services liveness and is queried periodically by all the Kestra components. See [PR #8319](https://github.com/kestra-io/kestra/pull/8319).

The `queues` table, which is at the heart of our internal queue, was missing an index on the `key` column which is used since 0.22 to purge queue messages at the end of an execution. We added one in 0.23, see [PR #8243](https://github.com/kestra-io/kestra/pull/8243).

## Scheduler improvements on the JDBC backend

[Wei Bo](https://github.com/gluttonweb), an external contributor from Xiaomi, implement two improvements to our JDBC Scheduler:
- A missing index on the `next_execution_date` column of the `triggers` table, this column is queried on each scheduler evaluation loop so it brings a nice improvement. See [PR #8387](https://github.com/kestra-io/kestra/pull/8387)
- An improvement to move triggered execution monitoring out of the main evaluation loop. See [PR #8741](https://github.com/kestra-io/kestra/pull/8741).

The later improvement is the most interesting one.

The Kestra Scheduler has an evaluation loop executed each second. This evaluation loop first selects all triggers that should be evaluated based on their next evaluation date and the triggers for which an execution has been triggered but not yet terminated, what we called locked triggers.
For each trigger, if there is no triggered execution, it checks the trigger conditions then sends it to the Worker for evaluation if the conditions pass.
If there is a triggered execution, the Scheduler check if the execution is already created or not, and log a WARNING if it's not the case. This monitoring functionality is important but has nothing to do inside the main evaluation loop!

A new monitoring loop has been implemented to extract the monitoring of triggered execution from the main evaluation loop. On installations with a high number of triggers and executions, this can dramatically improve the Scheduler evaluation loop, the external contributor reports an improvement from 1mn to 40ms!

Why is it important? Because if we evaluate each second but the evaluation loop took more than 1s, this means we may miss some trigger executions. Imagine you want to poll a database each 10s, you will use, for example, a Postgres Trigger with a polling interval of 10s, but if the Scheduler took more than 20s to evaluate all triggers, you would not be able to trigger a flow more than each 20s!

This is the kind of issues that was encountered by installation with a lot of triggers and a lot of executions, and is now greatly improved thanks to this contribution.
We really want to thank Weibo and the whole Xiaomi team here as they give us awesome feedback on Kestra and such great contributions to improve the Scheduler!.

## Changed the way we parallelized JDBC Backend Queues

In 0.22, we parallelized JDBC Backend queues processing by the Kestra executor, this brings tremendous performance improvements but with a caveat of way bigger memory usage and high load on the database.

In 0.23, we changed the way we parallelized JDBC Backend queues processing, instead of querying the database multiple times in parallel, we made a single query but process the query results in parallel. See [PR #8648](https://github.com/kestra-io/kestra/pull/8648)

We then made slight improvements to our queue polling mechanism, which improve performance on high throughput. See [PR #8840](https://github.com/kestra-io/kestra/pull/8840) and [PR #8263](https://github.com/kestra-io/kestra/pull/8263).

These slightly decrease performance on low throughput but have an overall neutral performance with a net benefit on memory usage and database load.

## Conclusion

Version 0.23 brings efficiency improvements, making Kestra faster and more scalable. As we continue to optimize performance, stay tuned for more updates on how far we can push Kestra’s execution capabilities in upcoming versions.

::alert{type="info"}
If you have any questions, reach out via [Slack](https://kestra.io/slack) or open [a GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us [a GitHub star](https://github.com/kestra-io/kestra) and join [the community](https://kestra.io/slack).
::
