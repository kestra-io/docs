---
title: "Size & Scale Kestra: Executors, Workers, Schedulers"
h1: How to Size and Scale Your Kestra Infrastructure
sidebarTitle: Sizing and Scaling Infrastructure
icon: /src/contents/docs/icons/admin.svg
description: Guidance on sizing and scaling your Kestra infrastructure, including Executors, Workers, and Schedulers, for optimal performance.
---

Size a Kestra deployment from your expected task runs per minute, then scale each server component as your workload grows.

Kestra runs anything from a few scheduled flows to thousands of task runs per minute. The right infrastructure depends on your workload patterns, execution volume, and latency requirements. This page covers baseline sizing, how many Executors and Workers you need, and when to scale or tune each component.

## Core concepts

Each server component handles a different part of the work, so each one scales on its own signal. See [Server components](../../08.architecture/02.server-components/index.md) for the full description.

1. **Executors** drive the execution state machine. They process flowable tasks and Flow triggers, apply concurrency limits, retries, and pauses, and hand runnable tasks to the Worker Controller.
2. **Worker Controllers** dispatch jobs to Workers over gRPC and collect their results, logs, and metrics. Workers never connect to the queue or the database directly.
3. **Workers** run runnable tasks, polling triggers, and realtime triggers. Each realtime trigger holds one Worker thread for as long as it runs.
4. **Schedulers** evaluate Schedule and polling triggers and start the matching executions.
5. **Webservers** serve the API and UI and receive Webhook triggers.
6. **Indexers** write flows, executions, logs, and metrics from the queue to the repository.

By default, each Webserver runs an embedded Indexer and an embedded Worker Controller. Start the Webserver with `--no-indexer` or `--no-controller` to run either one as a separate process.

Performance depends on balancing **throughput** (task runs per minute) and **latency** (how quickly executions start and complete) for your infrastructure.

## Baseline infrastructure recommendations

Start with the CPU and memory allocation below for your expected number of task runs per minute. As your workload grows, scale vertically by adding CPU and RAM per node, or horizontally by adding nodes.

### Up to 1,000 task runs/minute

The table below is a baseline for a deployment handling up to 1,000 task runs per minute.

| Component  | CPU | RAM | Notes |
|------------|-----|-----|-------|
| Webserver  | 1   | 2 GB | Includes the embedded Indexer and Worker Controller. Add CPU for heavy API usage or large file uploads. |
| Executor   | 2   | 2 GB | Add +2 CPU / +2 GB per additional 1,000 task runs/min. |
| Scheduler  | 1   | 2 GB | Add +1 CPU / +1 GB per additional 1,000 triggers. |
| Worker     | 2   | 4 GB | Heavily workload-dependent. Use the [Worker sizing methodology](#worker-sizing-methodology). |

### More than 1,000 task runs/minute

For workloads above 1,000 task runs per minute, increase Executor and Worker resources:

| Component  | CPU | RAM | Notes |
|------------|-----|-----|-------|
| Webserver  | 1   | 2 GB | Scale for traffic. |
| Executor   | 4   | 4 GB | Add +2 CPU / +2 GB per additional 1,000 task runs/min. |
| Scheduler  | 1   | 2 GB | Scale with triggers. |
| Worker     | 4   | 8 GB | Scale with the [Worker sizing methodology](#worker-sizing-methodology). |

:::alert{type="info"}
**Extra tips**:
1. Provision at least one extra node per component for maintenance and one extra node for high availability.
2. These guidelines are starting points. Monitor your actual usage and adjust based on performance metrics.
3. Use these guidelines with the [Worker Calculator](https://v0-worker-calculator.vercel.app/) to find the right number of Workers for your workload.
:::

These recommendations use CPU and memory rather than VM instance types, since instance types vary across cloud providers, on-premises hardware, and company requirements.

## How many Executors and Workers do I need?

### Workers

Workers scale with workload type and concurrency:

- **Lightweight tasks**, such as API calls that trigger remote jobs or variable manipulation, allow high concurrency per Worker.
- **Heavy tasks**, such as complex scripts, containers, and large data transformations, allow fewer concurrent tasks per Worker.

Use the [Worker sizing methodology](#worker-sizing-methodology) to compute the number of Workers from your expected task runs, triggers, and average task duration.

### Executors

Executors scale with orchestration load, measured in task runs per minute. Each task in an execution is one task run, so a flow with 10 tasks costs the Executor more than a flow with 2.

In the [benchmarks](../benchmark/index.md), run on a single node with 4 vCPUs and 16 GB RAM:

- Kestra OSS on Postgres sustains about 8,000 task runs/min with under 1 second of execution latency.
- Kestra Enterprise Edition on RabbitMQ and Postgres sustains at least 14,000 task runs/min, the most the benchmark harness could send.

The benchmark flows are deliberately simple. Production flows that use concurrency limits, SLAs, and other features add work for the Executor, so they need more capacity than these figures suggest. Size from the [baseline recommendations](#baseline-infrastructure-recommendations), and use the benchmarks as an upper bound.

**Add Executors when**:
- execution latency exceeds a few seconds under normal load;
- you consistently exceed 1,000 task runs/min per 2 vCPUs allocated to Executors.

#### Executor throughput factors

The following factors affect Executor throughput, with examples from the [benchmarks](../benchmark/index.md):

| Factor | Effect on throughput | Example from the benchmarks |
|---|---|---|
| **Load** | Latency stays flat until the system reaches its limit, then rises sharply. | On OSS, average execution latency is 150 ms at 8,000 task runs/min and 10.8 s at 10,000. |
| **Concurrency** | Unbounded concurrency in a loop adds orchestration overhead, since each iteration runs as a sub-execution. | A `Loop` with 100 unbounded iterations (101 task runs) completes in about 1.5 s, about 67 task runs/s. |
| **System resources** | Fixed CPU and RAM cap throughput. More resources, or more Executors and Workers, raise capacity. | All benchmarks run on 4 vCPUs and 16 GB RAM. |
| **Queue backend** | A message broker lowers latency and raises the throughput ceiling compared to the database queue. | The Enterprise Edition on RabbitMQ has 55% lower latency than OSS on Postgres and sustains more task runs per minute. |

#### Improve Executor throughput

To improve Executor throughput:

- Keep **tasks per execution low** where you can. With fewer tasks in each execution, the same Executors handle more executions per minute.
- Apply **concurrency limits** in your flows to avoid orchestration bottlenecks.
- Scale horizontally with more Executors and Workers for higher loads.

## Queue backend considerations

The queue backend sets the throughput ceiling and the latency of the deployment. See [Deployment architecture](../../08.architecture/03.deployment-architecture/index.md) to compare the options.

- **Database queue (Postgres or MySQL, Open Source and Enterprise Edition)**: the simplest option, and enough for most production workloads. Postgres sustains about 8,000 task runs/min in the simple-flow benchmark. Tune it with the JDBC queue polling settings and Executor threads described in [Performance tuning](../performance-tuning/index.md).
- **RabbitMQ or Redis (Enterprise Edition)**: lower latency and a higher throughput ceiling than the database queue. RabbitMQ is the recommended broker.
- **Kafka (Enterprise Edition)**: the highest throughput, with every server component scaling independently. Allocate at least as many partitions as the largest number of instances of one component, such as Executors or Workers, to keep them all busy.

## Scale the Webserver for many UI users

When many users access the Kestra UI, for example to trigger flows manually, monitor executions, or browse logs, the **Webserver is rarely the bottleneck**. It is stateless, so you can scale it horizontally by adding replicas behind a load balancer.

### Estimate concurrent users

Not all registered users are active at the same time. A common rule of thumb for internal tools is a ratio of 10:1 to 100:1 between total users and concurrent users:

| Total users | Estimated concurrent users |
|-------------|---------------------------|
| 100         | 1 – 10                    |
| 800         | 8 – 80                    |
| 5,000       | 50 – 500                  |

A single Webserver instance (1 vCPU, 2 GB RAM) handles **dozens of concurrent users**. For larger deployments or heavy API usage, such as bulk trigger calls or large file uploads, add Webserver replicas.

### The real bottleneck: the database

When many users browse dashboards, execution lists, or large logs at the same time, **the database becomes the main concern**, not the Webserver. Each UI page can run several queries against the execution and log tables, which grow continuously.

To keep the database healthy under this load:

- **Purge execution history regularly**: use [purge tasks](../../10.administrator-guide/purge/index.md) to delete old executions, logs, and storage files. At high throughput, execution data can reach terabytes per year.
- **Keep the default chart time range short**: `kestra.ui.charts.default-duration` sets the time range dashboards and lists use when none is selected, and defaults to 24 hours. A longer default scans more data on every page load.
- **Monitor slow queries**: track query latency on your database to find execution or log queries that benefit from index tuning or shorter retention.

:::alert{type="info"}
If you use a managed Postgres instance, such as Cloud SQL on GCP, size its tier for the read load from concurrent UI users as well as the write load from executions.
:::

## Scaling and performance tuning

### When to scale

- **Executors**: scale when orchestration latency grows with load.
- **Workers**: scale when task runs wait in the queue for too long.
- **Worker Controllers**: run them as separate processes, with `--no-controller` on the Webserver, when you need to scale dispatch independently of API traffic.
- **Webservers**: scale with API and UI traffic, especially for large file inputs and trigger payloads.
- **Schedulers**: scale with the number of triggers and their frequency.

### Tuning options

- **JDBC queue**: adjust `minPollInterval`, `maxPollInterval`, and `pollSize` to trade latency against database load.
- **Executor threads**: increase beyond the default, one thread per allocated CPU core with a minimum of 4, to raise concurrency.
- **Worker threads**: the default is 8 threads per available processor. Use more threads for I/O-bound tasks and fewer for memory-intensive ones.
- **Kafka (Enterprise Edition)**: tune `linger.ms` and other producer and consumer properties to trade latency against broker load.

See [Performance tuning](../performance-tuning/index.md) for the configuration of each option.

## Worker sizing methodology

Use this formula, which the [Worker Calculator](https://v0-worker-calculator.vercel.app/) applies:
- `Total Threads Needed = Realtime Triggers + Polling Triggers + Task Execution`
- `Workers Needed = ⌈Total Threads ÷ Threads per Worker⌉`

Where:
- **Realtime triggers**: each realtime trigger needs 1 thread.
- **Polling triggers**: depends on duration and frequency.
- **Task execution**: depends on the number of task runs per day, average duration, and active hours.

:::alert{type="info"}
**Rule of thumb**: start with the calculated number of Workers, then add a **20–30% buffer** for production workloads.
:::

## Best practices for long-term performance

- **Benchmark early**: test flows with representative workloads. The [Benchmarks repository](https://github.com/kestra-io/benchmarks) README explains how to run the [benchmarks](../benchmark/index.md) yourself.
- **Monitor resource usage**: track CPU, memory, and thread usage, and scale before bottlenecks appear.
- **Account for data growth**: above 1,000 task runs/min, **Postgres storage can grow by terabytes per year**. Purge execution history regularly.
- **Plan for peaks**: use active hours in the Worker Calculator to size for peak periods rather than a daily average.
  **Example:** you expect **120,000 task runs per day**, and 100,000 of them run in a **6-hour nightly ETL window**.
  - Dividing 120,000 task runs by 24 hours gives **about 5,000 task runs/hour**, which leads to a modest Worker count.
  - Setting active hours to 6 spreads the 100,000 task runs over 6 hours, giving **about 16,600 task runs/hour** and **3× more Workers** to handle the load without queuing.
  - Use active hours to check that your infrastructure absorbs **spikes** when they happen, instead of sizing from averages.
- **Tune cautiously**: each tuning option has trade-offs. Validate changes in staging before applying them to production.
- **Maintain high availability**: run at least two instances of each component. See [High availability](../../10.administrator-guide/high-availability/index.md).

:::alert{type="info"}
**Indexer and Worker Controller in the Webserver**: each Webserver replica runs an embedded Indexer and Worker Controller, so adding a second Webserver for high availability also adds indexing and dispatch capacity without deploying another component. Run them as separate processes only when you need to scale or isolate them.
:::

## Quick reference checklist

- Start with baseline sizing based on task runs per minute, with **1,000 task runs/min** as the first threshold.
- Use the [Worker Calculator](https://v0-worker-calculator.vercel.app/) to estimate the number of Workers.
- Scale Executors with orchestration load (flowable tasks).
- Scale Workers with task execution load (runnable tasks and triggers that run on Workers).
- Monitor latency, throughput, and resource usage continuously.
- Add a 20–30% capacity buffer in production.
- Run at least two instances of each component for high availability.
