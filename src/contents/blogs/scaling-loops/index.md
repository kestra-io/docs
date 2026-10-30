---
title: "Scaling Loops in Kestra 2.0"
description: "The new Loop task runs each iteration as a sub-execution. It ran 100,000 iterations in 33 minutes, where ForEach in Kestra 1.x stalled past 1,000."
date: 2026-10-30T10:00:00
category: Engineering
author:
  name: Loïc Mathieu
  linkedin: https://www.linkedin.com/in/lo%C3%AFc-mathieu-475b144/
  image: lmathieu
  role: Lead Developer
---

During Kestra 2.0 development, Ludo, our CTO, told me he wanted to loop over millions of iterations inside a workflow. I love a challenge, so I answered with the only reasonable reply: hold my beer.

## Looping in Kestra 1.x

In Kestra 1.x, you loop inside a workflow with either the `ForEach` task or the `ForEachItem` task, and both have caveats.

`ForEach` creates task runs inside the execution for each iteration. With 1,000 iterations and 3 sub-tasks, you end up with 3,000 task runs inside the execution. The execution context grows linearly with the number of iterations, and the processing time grows much faster than that, because of the bookkeeping of execution messages inside the Executor and the construction of the `RunContext`. The `RunContext` is built for each task run and contains the information of all previous task runs, including their outputs. On top of that, outputs were stored inside the execution in 1.x, so in practice you hit a limit of a few hundred iterations before the message becomes too big to process and fills the memory.

`ForEachItem` processes each iteration in a subflow and only tracks the sub-executions with per-state counters. Its iteration values must come from an internal storage file, and you must pass inputs to the subflow if you need context from the parent execution.

We wanted the simplicity of `ForEach` with the flexibility and execution model of `ForEachItem`, so we built the new `Loop` task.

## How the Loop task works

The `Loop` task iterates over values defined inline, as with `ForEach`, or stored in an internal storage file, as with `ForEachItem`. You define its sub-tasks inline, like `ForEach`, but Kestra runs them as sub-executions, and the main execution only tracks per-state counters. It takes the best of both tasks, and the sub-executions stay invisible to the user.

To be honest, we were inspired by Netflix Conductor, which processes loops this way.

Here is how it works, simplified:

1. When the Executor sees a `Loop` task, it starts one or more sub-executions of kind `LOOP`, depending on the `concurrencyLimit` and the number of values. It attaches loop metadata to each of them in a `loopRun` attribute.
2. When the Executor sees an execution of kind `LOOP`, it finds the loop task ID in the `loopRun` and processes only the loop's sub-tasks, not the whole execution. It builds the `RunContext` from the main execution's context, so sub-tasks can use the outputs of any previous task as if they ran in the main execution. That's what keeps sub-executions invisible to the user.
3. When the Executor terminates an execution of kind `LOOP`, it sends a `LoopEvent` message.
4. When the Executor receives a `LoopEvent`, it updates the per-state counters of the parent execution, starts new `LOOP` sub-executions if needed, and terminates the `Loop` task of the main execution once all iterations are done. It also sends an event so the UI updates in real time.

This comes with a few caveats:

- In 1.x, a task outside the loop could read the outputs of the loop's sub-tasks. Now you declare those outputs inside the `Loop`, and the `Loop` task maps them once all iterations are done. It's more declarative than before, and we added a Pebble function, `loopOutputs()`, to help work with them.
- The sub-tasks no longer show up in the execution view or in the execution entity returned by the API. You see them on a separate page that lists all sub-executions. We plan to improve that soon, but for performance reasons we won't fetch every iteration and display every task of every iteration anymore.

It also simplifies a lot:

- Every loop sub-task can use the loop context directly, even inside flowable tasks, because the loop context applies to the whole loop sub-execution.
- Loops with a lot of iterations no longer need a separate concept.
- Values can be a list, a map (key/value) or an internal storage file.
- A per-state iteration counter and a progress bar show what's going on, so loops with many iterations are much easier to follow.

`Loop` also performs better than `ForEach`, even though it creates sub-executions. The lighter execution context and the reduced bookkeeping in the Executor more than make up for the cost of creating sub-executions. [Our benchmarks show a 3x improvement](/blogs/performance-improvements-2-0#kestra-13-vs-20-benchmark-3-large-loop-task).

## Can we scale to millions of iterations?

Back to Ludo's request. Here is the flow I used to measure `Loop`:

```yaml
id: loop-bench
namespace: benchmarks

inputs:
  - id: nbIteration
    type: INT

tasks:
  - id: setLabels
    type: io.kestra.plugin.core.execution.Labels
    labels:
      scenario: Loop
      iterations: "{{ inputs.nbIteration }}"

  - id: loop
    type: io.kestra.plugin.core.flow.Loop
    values: "{{ range(1, inputs.nbIteration) }}"
    concurrencyLimit: 16 # 4x the number of available cores
    tasks:
      - id: output
        type: io.kestra.plugin.core.output.OutputValues
        values:
          some: value
```

For the 1.x run, the same flow uses `io.kestra.plugin.core.flow.ForEach`.

| Iterations | 10 | 100 | 1,000 | 10,000 | 100,000 |
| :- | :- | :- | :- | :- | :- |
| ForEach (1.x) | 0.44s | 4.39s | 4min 23s | X\* | X\*\* |
| Loop (2.0) | 0.56s | 1.28s | 11.5s | 1min 47s | 33min |

\* I stopped it after 3h15 because I didn't want to wait any longer.<br>
\*\* Of course, I didn't even give it a try.

Loop handles 100,000 iterations, while ForEach didn't scale past 1,000. A few other things stand out:

- ForEach didn't scale nicely. From 100 to 1,000 iterations, the time was multiplied by 60, not 10. At 10,000 iterations I stopped it after 3h15. It might have finished, but the time was growing so fast that I didn't wait.
- You can't track the progress of a ForEach task with many iterations. The Gantt view never displays, and it crashes your browser or saturates your CPU, because showing every iteration as a sub-task doesn't scale.
- With a very high number of iterations, you can still track a Loop task, because it's only a progress bar with a counter.
- Loop scales roughly linearly up to 10,000 iterations. At 100,000 iterations it's no longer linear, but I suspect the small database instance used for this test fills up with iterations, which slows everything down.

So can we scale to millions of iterations with the new `Loop` task? Yes. The current implementation renders and loads the whole list of values for each iteration, so 1 million iterations would take about 80 hours. That's 288ms per iteration, which might be acceptable depending on what each iteration does.

We could improve that, for example, by rendering values in batches and saving them in the `Loop` output (a lookahead buffer). Honestly, that would mostly optimize this particular benchmark. A loop with millions of iterations doing real work would most likely run for days in a distributed environment, which would already perform better than my small 4-CPU benchmarking machine.

`Loop` is one piece of the 2.0 engine rewrite. The rest of the story, from the queue that deletes on consume to outputs stored outside the execution, is in [how we rebuilt the Kestra engine in 2.0](/blogs/2026-09-01-kestra20-rebuild-engine). If you're moving flows off `ForEach`, the [ForEach to Loop migration guide](/docs/migration-guide/v2.0.0/foreach-loop) covers the output mapping, and the [Loop best practices](/docs/best-practices/loop) cover the rest.

:::alert{type="info"}
If you have any questions, reach out via [Slack](/slack) or open a [GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us a [GitHub star](https://github.com/kestra-io/kestra) and join [the community](/slack).
:::
