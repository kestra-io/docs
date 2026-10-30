---
title: "Script Checkpoints: Resume a Task After a Failure"
h1: Resume Script Tasks from a Checkpoint
sidebarTitle: Checkpoints
icon: /src/contents/docs/icons/dev.svg
version: ">= 2.1.0"
description: Save checkpoints from a script task so a retry or restart resumes from the last completed step instead of starting over.
---

Save checkpoints from a script so a retried task resumes where it stopped.

:::alert{type="info"}
Checkpoints are a beta feature. The syntax and behavior can change in a future release.
:::

## How checkpoints work

Kestra already recovers at the task level: a failed task is retried, a failed execution can be restarted, and a task on a lost worker is resubmitted. Each recovery reruns the task from the beginning. For a script that loops over hundreds of batches, a failure on batch 300 means processing batches 1 to 299 again.

A checkpoint is a key-value pair that your script saves while it runs. When the same task runs again, Kestra passes the saved checkpoints back to the script, and the script uses them to skip the work it already finished.

Checkpoints work on every script task, `Script` and `Commands` alike, in any language and with any task runner. You need two things:

- `durable: true` on the task, so Kestra passes saved checkpoints to the script.
- A script that writes checkpoints as it progresses and reads them when it starts.

## Make a script resumable

The flow below processes ten batches and saves the index of the next batch after each one. On its first attempt, the script fails at batch 3. The retry starts at batch 3 instead of batch 0:

```yaml
id: resumable_batches
namespace: company.team

tasks:
  - id: process
    type: io.kestra.plugin.scripts.python.Script
    durable: true
    retry:
      type: constant
      interval: PT5S
      maxAttempts: 3
    script: |
      import json
      from time import sleep

      start = int("{{ checkpoints.next_batch ??? 0 }}")
      print(f"Starting at batch {start}")

      for batch in range(start, 10):
          if batch == 3 and start == 0:
              raise RuntimeError("Simulated failure on the first attempt")

          print(f"Processing batch {batch}")
          sleep(1)

          print("::" + json.dumps({"checkpoints": {"next_batch": str(batch + 1)}}) + "::")
```

The `??? 0` fallback covers the first attempt, when no checkpoint exists yet. Save the checkpoint after the work it marks is done, so a failure mid-batch reruns that batch rather than skipping it.

Execute the flow and open the **Logs** tab. The first attempt logs batches 0 to 2 and fails. The second attempt logs `Starting at batch 3` and completes.

## Write a checkpoint

Print a `checkpoints` object between `::` markers to standard output, the same way scripts send [outputs and metrics](../06.outputs-metrics/index.md):

```plaintext
::{"checkpoints": {"next_batch": "3", "cursor": "2026-10-01T00:00:00Z"}}::
```

- Each key holds a single string value. Kestra stores values as strings, so pass numbers and dates as strings and convert them when you read them back.
- Writing a key again replaces its previous value. One line can set several keys.
- Each line is saved immediately, as a separate call to the Kestra backend. Checkpoint after units of work that are expensive to repeat, not on every iteration of a tight loop.

## Read checkpoints

With `durable: true`, Kestra exposes the saved checkpoints to the script in three ways:

| Method | Syntax | Notes |
| --- | --- | --- |
| Pebble expression | `{{ checkpoints.next_batch }}` | Rendered into the script before it runs. Use `??? <default>` for the first attempt. |
| Environment variable | `CHECKPOINTS_NEXT_BATCH` | The key upper-cased, with every character other than a letter, digit, or `_` replaced by `_`. |
| Execution context file | `checkpoints.next_batch` | Requires `executionContext: true`. See [Execution Context](../09.execution-context/index.md). |

Because of the renaming rule, keys that differ only by case or punctuation, such as `next-batch` and `next_batch`, map to the same environment variable. Use distinct keys if you read them as environment variables.

The environment variable fits shell scripts and scripts kept as [Namespace Files](/docs/concepts/namespace-files), where a Pebble expression would not be valid code:

```yaml
id: resumable_shell
namespace: company.team

tasks:
  - id: process
    type: io.kestra.plugin.scripts.shell.Script
    durable: true
    retry:
      type: constant
      interval: PT5S
      maxAttempts: 3
    script: |
      start=${CHECKPOINTS_NEXT_BATCH:-0}
      for batch in $(seq "$start" 9); do
        echo "Processing batch $batch"
        echo "::{\"checkpoints\": {\"next_batch\": \"$((batch + 1))\"}}::"
      done
```

<!-- TODO(eng): TaskLogLineMatcher saves checkpoints even when durable is false, but they are only passed back to the script when durable is true. Confirm this is intended before documenting it. -->

## When checkpoints are restored

A checkpoint belongs to one task run in one execution. Kestra restores it whenever the same task run runs again:

- a [task retry](../../05.workflow-components/12.retries/index.md)
- a restart of the execution
- a resubmission of the task after a worker is lost

A [replay](../../15.how-to-guides/replay/index.md) creates a new execution, so the replayed task starts with no checkpoints. Checkpoints are also not shared between tasks or between executions of the same flow. To keep state across executions, use the [KV Store](../../06.concepts/05.kv-store/index.md).

## Checkpoint lifecycle

Checkpoints stay in the Kestra database after the task finishes. Kestra deletes them when the [`PurgeExecutions`](/plugins/core/execution/io.kestra.plugin.core.execution.purgeexecutions) task purges the execution they belong to. The task reports how many it deleted in its `checkpointsCount` output.

<!-- TODO(eng): the checkpoint repository is implemented for H2, MySQL and Postgres only. Confirm availability on EE deployments that use the Elasticsearch/Kafka backend. -->
