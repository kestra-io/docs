---
title: "Performance Upgrades Fueled by Contributions from Xiaomi Engineers"
description: "Kestra 0.23 levels up with faster execution, smarter scheduling, and reduced resource usage—powered by contributions from Xiaomi Engineering and insights from the open-source community."
date: 2025-06-24T13:00:00
category: Solutions
author:
  name: Loïc Mathieu
  image: lmathieu
  role: Lead Developer
image: ./main.jpg
---

In 0.22, the engineering team focused on performance in multiple areas, you can find the details in this blog post [Optimizing Performance in Kestra in Version 0.22](../2025-04-08-performance-improvements/index.md).

One of our most advanced power users, the Xiaomi Engineering team, extensively leverages Kestra at a massive scale. Xiaomi's continuous insights and active contributions have significantly accelerated our performance optimization efforts in Kestra 0.23. Thanks to their help, this latest version delivers even more substantial enhancements in speed, efficiency, and system responsiveness.

## Smarter Output Processing

The Kestra Executor merges task outputs, enabling subsequent tasks to access previous outputs through our expression language. Historically, this merging process involved cloning the entire output map, consuming significant CPU and memory resources.

In Kestra 0.22, we limited merges exclusively to tasks that explicitly required it, notably improving efficiency. Kestra 0.23 further refines this process by:

- Avoiding unnecessary merges for empty task outputs.

- Enhancing iterative output merging methods.

For example, a workflow with 160 loop iterations improved dramatically from 44 seconds down to just 13 seconds.

:::collapse{title="Expand to see the Benchmark Flow"}
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
:::

This was the happy case, when there are no outputs, using the same flow with the `OutputValues` task instead of the `Log` task will still bring an enhancement from 44s to 24s.

Further details are available in these two pull requests: [PR #8914](https://github.com/kestra-io/kestra/pull/8914) and [PR #8911](https://github.com/kestra-io/kestra/pull/8911)

## Flowable task processing improvements

Flowable tasks provide the orchestration logic of Kestra; they are run by the Executor, not the Worker.

Historically, for simplicity, we mimicked task execution by the Worker for all flowable tasks, unnecessarily adding them to our internal queue, causing redundant overhead. Kestra 0.23 now directly records flowable task results within the Executor, significantly reducing overhead.

Further details can be found in this pull request: [PR #8236](https://github.com/kestra-io/kestra/pull/8236).

Let's take as an example this flow that has 5 [If](/plugins/core/flow/io.kestra.plugin.core.flow.if) tasks, the `If` task is flowable:

:::collapse{title="Expand to see the Benchmark Flow"}
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
:::

In high-load scenarios (e.g., 10 executions per second), performance improved dramatically, reducing execution times from 12 seconds per task in 0.22 to just 4 seconds in 0.23.

## Missing indices on the JDBC backend

Thanks to user feedback, we discovered that we missed some indices on tables on our JDBC backend.

The `service_instance` table was missing a few indices and a purge mechanism! We added both, and queries on this table show no longer an issue. This table monitors Kestra services' liveness and is queried periodically by all the Kestra components. See [PR #8319](https://github.com/kestra-io/kestra/pull/8319) and [PR #8505](https://github.com/kestra-io/kestra/pull/8505) which were contributions from [lw-yang](https://github.com/lw-yang) from Xiaomi.

The `queues` table, which is the heart of our internal queue, was missing an index on the `key` column, which has been used since 0.22 to purge queue messages at the end of an execution. We added one in 0.23; see [PR #8243](https://github.com/kestra-io/kestra/pull/8243).

## Outstanding Scheduler improvements from Xiaomi

[Wei Bo](https://github.com/gluttonweb) from Xiaomi significantly contributed two major improvements to our JDBC Scheduler:

- A missing index on the `next_execution_date` column of the `triggers` table, which drastically accelerates scheduler evaluation times. See [PR #8387](https://github.com/kestra-io/kestra/pull/8387).
- A huge enhancement that extracts triggered execution monitoring from the main scheduler evaluation loop, dramatically improving efficiency. Before this change, the evaluation loop could take as long as 1 minute under heavy workloads. With Xiaomi’s contribution, the execution time plummeted to just 40 milliseconds! See [PR #8741](https://github.com/kestra-io/kestra/pull/8741).

The latter enhancement, championed by Xiaomi, represents a leap forward in performance. Previously, the Kestra Scheduler ran a single evaluation loop every second, performing various tasks—from checking triggers' next execution dates to verifying pending executions and logging warnings. While crucial, these monitoring checks unnecessarily slowed down the main loop, severely impacting performance in large-scale scenarios like those experienced at Xiaomi.

Xiaomi’s engineering team re-engineered the scheduler by introducing a dedicated monitoring loop. This separation improved efficiency and responsiveness. Xiaomi’s benchmarks at their massive scale showed a remarkable decrease in loop execution time, from roughly 1 minute down to an astonishing 40 milliseconds!

This breakthrough is especially impactful in large-scale deployments. If a scheduler loop exceeds 1 second, scheduled triggers could be missed entirely, severely impacting operational reliability. For instance, imagine polling a database every 10 seconds: if scheduler evaluations took longer than intended, the trigger frequency would be compromised.

Xiaomi tackled these issues head-on, contributing profoundly to Kestra’s capabilities. We extend our deepest appreciation to Wei Bo and the entire Xiaomi Engineering team, whose detailed feedback and substantial contributions continue to improve Kestra's performance benchmarks.

## Changed the way we parallelized JDBC Backend Queues

In 0.22, we parallelized JDBC Backend queues processing by the Kestra executor, which brings tremendous performance improvements, but with a caveat of way bigger memory usage and high load on the database.

In 0.23, we changed the way we parallelized JDBC Backend queues processing. Instead of querying the database multiple times in parallel, we made a single query but processed the query results in parallel. See [PR #8648](https://github.com/kestra-io/kestra/pull/8648)

We then made slight improvements to our queue polling mechanism, improving high-throughput performance. See [PR #8840](https://github.com/kestra-io/kestra/pull/8840) and [PR #8263](https://github.com/kestra-io/kestra/pull/8263).

These changes slightly decrease performance on low throughput but have an overall neutral performance with a net benefit on memory usage and database load.

## Conclusion

Version 0.23 brings major upgrades in performance and scalability, thanks in no small part to the Xiaomi Engineering team. Their production-scale usage, diagnostics, and highly targeted contributions, like the scheduler improvements, continue to shape how Kestra evolves.

We're incredibly grateful for their collaboration and the broader open-source community, which make Kestra better with every release. As Xiaomi pushes the platform to its limits, they help us unlock new levels of efficiency for everyone.

Stay tuned—there’s even more to come as we double down our focus on performance, resiliency, and scalability.

:::alert{type="info"}
If you have any questions, reach out via [Slack](/slack) or open [a GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us [a GitHub star](https://github.com/kestra-io/kestra) and join [the community](/slack).
:::
