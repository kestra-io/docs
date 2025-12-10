---
title: Sizing and Scaling Infrastructure
icon: /docs/icons/admin.svg
---

Kestra is designed to scale from lightweight workflows to enterprise-scale orchestration with thousands of task runs per minute. Choosing the right infrastructure depends on your workload patterns, execution volume, and latency requirements. This page provides practical guidance on how to size your Kestra deployment, how many Executors and Workers you need, and how to scale and tune performance over time.


## Core concepts

Before diving into numbers, it helps to understand how Kestra executes work:
1. **Executors** orchestrate workflows: they orchestrate workflow logic via flowable tasks, delegate tasks to the right worker nodes, and manage execution state and concurrency.
2. **Workers** run the tasks themselves: from lightweight logging to long-running scripts or container workloads.
3. **Schedulers** handle triggers such as scheduled events, webhook calls, or polling external resources.
4. **Webservers** provide the API and UI, they handle user interactions incl. processing execution inputs.

Performance depends on balancing **throughput** (task runs per minute) and **latency** (how quickly executions start and complete) given your infrastructure.

---

## Baseline infrastructure recommendations

Start with the CPU and memory allocation listed below based on your expected number of task runs per minute. As your workload grows, you can later scale vertically (add more CPU/RAM per node) or horizontally (add more nodes).

### Up to 1,000 task runs/minute

The table below provides a baseline for a typical Kestra deployment handling up to 1,000 task runs per minute.

| Component  | CPU | RAM | Notes |
|------------|-----|-----|-------|
| Webserver  | 1   | 2 GB | Add CPU for heavy API usage or large file uploads. |
| Executor   | 2   | 2 GB | Add +2 CPU / +2 GB per additional 1,000 task runs/min. |
| Scheduler  | 1   | 2 GB | Add +1 CPU / +1 GB per additional 1,000 triggers. |
| Worker     | 2   | 4 GB | Heavily workload-dependent. Use [Worker Calculator](#worker-sizing-methodology). |

### More than 1,000 task runs/minute

For workloads exceeding 1,000 task runs per minute, increase Executor and Worker resources as follows:

| Component  | CPU | RAM | Notes |
|------------|-----|-----|-------|
| Webserver  | 1   | 2 GB | Scale for traffic. |
| Executor   | 4   | 4 GB | Add +2 CPU / +2 GB per additional 1,000 task runs/min. |
| Scheduler  | 1   | 2 GB | Scale with triggers. |
| Worker     | 4   | 8 GB | Scale based on [Worker Calculator](#worker-sizing-methodology). |

:::alert{type="info"}
**Extra Tips**:
1. It is best practice to provision at least one extra node per component for maintenance and one extra node for high availability.
2. These guidelines are starting points. Monitor your actual usage and adjust based on performance metrics.
3. Use the above guidelines in conjunction with the [Worker Calculator](https://v0-worker-calculator.vercel.app/) to determine the right number of Workers for your workload.
:::

**Why we don’t provide exact information about VM instance type?** Compute nodes vary across cloud providers, on-prem and internal requirements of any company. Thus, we focus on simple CPU/memory recommendations you can use regardless of where you deploy Kestra.

---

## How many executors and workers do I need?

### Workers

Workers scale with workload type and concurrency:

- **Lightweight tasks** such as simple API calls triggering remote jobs, variable manipulation → high concurrency per Worker.
- **Heavy tasks** such as complex scripts, running containers and heavy data transformations → fewer concurrent tasks per Worker.

👉 Use the [Worker Calculator](#worker-sizing-methodology) to compute the number of Workers based on task runs, triggers, and average task duration you expect.

### Executors

Executors scale with [orchestration load](https://kestra.io/docs/performance/benchmark):

- **Simple flows (few tasks)**: ~1500 executions/min with JDBC backend, ~2000 with Kafka backend before latency rises.
- **Complex flows (many tasks per execution)**: throughput is lower (300–400 exec/min), as each execution spawns many task runs.

**Add Executors when**:
- Execution latency exceeds a few seconds under normal load.
- You consistently exceed 1,000 task runs/min per 2 vCPUs allocated.

#### Kestra executor throughput factors

Below are key factors affecting Executor throughput, with examples from our [Benchmarks](https://kestra.io/docs/performance/benchmark):

| **Factor**                        | **Effect on Throughput**                                                                                                                                                                                         | **Examples from Benchmarks**                                                                                                                            |
|-----------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Number of tasks per execution** | More tasks per execution increase orchestration overhead and reduce sustainable execution rate.                                                                                                                  | Benchmark 2: with 10 task runs/execution, OSS sustains ~300 exec/min, EE ~400 exec/min.                                                                 |
| **Execution context size**        | Larger payloads or many task runs per execution make orchestration heavier and lower throughput.                                                                                                                 | Benchmark 3: `ForEach` loop with 200 tasks sustains ~20 task runs/s (10–11s total). Benchmark 4: Large 160 KB messages cause latency spikes (OSS: 34s at 625 exec/min). |
| **Execution rate (load)**         | Higher incoming execution rate raises latency once system limits are reached.                                                                                                                                    | Benchmark 1 (simple flow, OSS): latency jumps from 0.9s at 1500 exec/min to 24s at 2000 exec/min.                                                       |
| **System resources**              | Fixed CPU/RAM constrain throughput; more resources or horizontal scaling (extra Executors/Workers) increase capacity.                                                                                            | All benchmarks run on 4 vCPUs, 16 GB RAM. Scaling beyond this would allow higher sustained throughput.                                                   |
| **Concurrency & scheduling**      | Unbounded concurrency leads to orchestration bottlenecks; limiting concurrency helps control overhead.                                                                                                           | Benchmark 3: unbounded `ForEach` (100 concurrent iterations) slows orchestration to ~20 task runs/s.                                                     |
| **Backend type**                  | Kafka backend (EE) sustains higher execution rates before latency increases; Postgres (EE & OSS) saturates earlier. However, the differences aren't dramatic — we recommend JDBC Postgres as a baseline backend. | Benchmark 1: OSS sustains ~1500 exec/min (<1s latency), EE sustains ~2000 exec/min (<0.5s latency).                                                      |

#### Improving executor throughput

To improve executor throughput:
- Keep **tasks per execution low** where possible, e.g. a flow with 5 tasks delivers higher throughput than a flow with 10 tasks. Use subflows to break up complex flows.
- Watch **execution context size** and avoid passing large raw payloads between tasks, use external storage (e.g. use `store: true` on tasks), and avoid large loops in a single flow.
- Apply **concurrency limits** in your flow configuration to avoid orchestration bottlenecks.
- Scale horizontally with more Executors/Workers for higher loads.

---

## Backend considerations

- **JDBC/Postgres backend (Enterprise and OSS)**: simpler to operate with low latency for up to ~1,000 task runs/min. [Performance tunin](../performance/performance-tuning.md)g involves adjusting JDBC queue polling intervals and executor threads beyond scaling the infrastructure.
- **Kafka backend (Enterprise)**: required for higher throughput, real-time triggers, and scaling beyond ~2,000 task runs/min. Ensure enough partitions are allocated (≥ number of Executors/Workers) for full parallelism.

---

## Scaling and performance tuning

### When to scale

- **Executors**: scale when orchestration latency grows with load.
- **Workers**: scale when task runs start lagging or queue for too long.
- **Webservers**: scale with API/UI traffic, especially if handling large file inputs and trigger payloads.
- **Schedulers**: scale with number of triggers and their frequency.

### Tuning options

- **JDBC backend**: adjust `minPollInterval`, `maxPollInterval`, and `pollSize` to trade off latency vs. DB load.
- **Executor threads**: increase beyond default (0.5 × CPU cores) to raise concurrency.
- **Kafka backend**: tune `poll.ms` and `commit.interval.ms` for lower latency at cost of broker load.
- **Worker threads**: set based on workload (4–16 threads per core).

More details in our [Performance Tuning guide](../performance/performance-tuning.md).

---

## Worker sizing methodology

Use this formula (applied in the [Worker Calculator](https://v0-worker-calculator.vercel.app/)):
- `Total Threads Needed = Realtime Triggers + Polling Triggers + Task Execution`
- `Workers Needed = ⌈Total Threads ÷ Threads per Worker⌉`

Where:
- **Realtime triggers**: 1 thread is needed for each realtime trigger.
- **Polling triggers**: depends on duration × frequency.
- **Task execution**: depends on the number of task runs per day, average duration, and active hours.

:::alert{type="info"}
**Rule of thumb**: Start with calculated number of Workers, then add a **20–30% buffer** for production workloads.
:::

---

## Best practices for long-term performance

- **Benchmark early**: Test flows with representative workloads using our [Benchmarks](https://kestra.io/docs/performance/benchmark). Refer to the README in the [Benchmarks repo](https://github.com/kestra-io/benchmarks) for setup instructions.
- **Monitor resource usage**: Track CPU, memory, and thread utilization. Scale before bottlenecks appear.
- **Account for data growth**: At >1,000 task runs/min, **Postgres storage can grow quickly** (terabytes per year). **Purge execution history regularly**.
- **Plan for peaks**: Use active hours in the Worker Calculator to size for peak load periods rather than averaging across a full day.
  **Example:** Suppose you expect **120,000 task runs per day**, but most of them (100,000) occur during a **6-hour nightly ETL window**.
  - If you divide 120,000 task runs by 24 hours, the calculator would estimate **~5,000 task runs/hour** → leading to a modest Worker requirement.
  - If you set Active Hours to 6, the calculator will distribute those 100,000 tasks across just 6 hours → **~16,600 task runs/hour**, which means **3× more Workers** are required to handle the load without queuing.
  - Use **Active Hours** to estimate if your infrastructure can absorb **spikes** when they actually happen, instead of under-estimating based on averages.
- **Tune cautiously**: Each tuning option has trade-offs; always validate in staging before applying to production.
- **Maintain High Availability (HA)**: Run at least two nodes per component (webserver, executor, worker, scheduler).

:::alert{type="info"}
🔧 **Why no separate Indexer service is needed**: each Webserver replica has an Indexer component running as a background process. Adding a second Webserver (for HA) also **doubles indexing throughput** without introducing a new component to deploy and manage. This reduces complexity while still providing high availability and adequate indexing throughput for most workloads.
:::

---

## Quick reference checklist

- Start with baseline sizing based on task runs/minute. Use **1,000 task runs/min** as a key threshold.
- Use [Worker Calculator](https://v0-worker-calculator.vercel.app/) for estimation of the required number of Workers.
- Scale Executors with orchestration load (Flowable tasks)
- Scale Workers with task execution load (Runnable tasks)
- Monitor latency, throughput, and resource usage continuously.
- Add 20–30% capacity buffer in production.
- Ensure HA by running ≥2 nodes per component.

With these guidelines, you can right-size Kestra for your workload today and scale confidently as your orchestration needs grow.
