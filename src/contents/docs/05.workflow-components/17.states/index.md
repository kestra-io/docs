---
title: Execution States in Kestra – Lifecycle Reference
description: Understand the Kestra Execution Lifecycle. Reference guide to all execution and task run states, including Created, Running, Success, Failed, and more.
sidebarTitle: States
icon: /src/contents/docs/icons/flow.svg
---

States control the status of your workflow execution.

## Execution states – lifecycle reference

<div class="video-container">
    <iframe src="https://www.youtube.com/embed/h5AigXBAs6Y?si=ftaD1zM24b7BDUMo" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Overview

An execution is a single run of a flow in a specific state. Each state represents a point in the workflow where Kestra determines what happens next based on the control flow logic defined in the flow.

You can read more about executions in the [workflow components documentation](../03.execution/index.md).

## Execution states

Each Kestra execution can transition through several states during its lifecycle. The following diagram illustrates the possible states an execution can be in:

![execution_states](./execution_states.png)

Here is a brief description of each state:
1. **CREATED**: The execution has been created but not yet started. This transient state means the execution is waiting to be processed. It usually transitions quickly to `RUNNING`, `CANCELLED`, or `QUEUED`. If you see executions stuck in this state, it may indicate a problem with the system.
2. **QUEUED**: The execution is waiting for a free slot to start running. This transient state is only used when the flow has [concurrency](../14.concurrency/index.md) limits, and all available slots are taken.
3. **RUNNING**: The execution is currently in progress. This transient state continues until all task runs are completed.
4. **SUCCESS**: The execution has completed successfully. This terminal state indicates that the execution has completed successfully, and all tasks have finished without errors (or were allowed to fail).
5. **WARNING**: This terminal state is used when the execution has completed successfully, but one or more tasks have emitted warnings.
6. **FAILED**: This state indicates that one or more tasks have failed and will not be retried. If there is an `errors` branch defined in the flow, the error `tasks` will be executed before permanently ending the execution, e.g., to send an alert about failure. Without additional orchestration, this state is usually considered terminal. However, when the flow has a [flow-level retry policy](../12.retries/index.md#flow-level-retries) set to the `RETRY_FAILED_TASK` behavior, the execution will transition to the `RETRYING` state.
7. **RETRYING**: This transient state indicates that the execution is currently [retrying](../12.retries/index.md) one or more failed task runs. After all retry attempts are exhausted, the execution will transition to the terminal `SUCCESS`, `WARNING`, or `FAILED` state.
8. **RETRIED**: This terminal state indicates that the execution has been retried according to the [flow-level retry policy](../12.retries/index.md#flow-level-retries) set to the `CREATE_NEW_EXECUTION` behavior. This means that the original execution (which failed and has been retried) is marked as `RETRIED`, and a new execution is created to run the flow again.
9. **PAUSED**: This transient state indicates that the execution is awaiting manual approval or has been paused for a fixed duration before continuing the execution. There are no `RESUMING` or `RESUMED` states. A paused execution transitions directly from `PAUSED` to `RUNNING` when resumed.
10. **RESTARTED**: This transient state is equivalent to the `CREATED` state but for a failed execution that has been restarted e.g., from the UI. These executions transition to `RUNNING` once the restart is processed.
11. **CANCELLED**: This terminal state indicates that the execution has been automatically cancelled by the system, usually because the `concurrency` limit was reached and the [concurrency](../14.concurrency/index.md) `behavior` was set to `CANCEL`, which cancels all executions that exceed the concurrency limit.
12. **KILLING**: This transient state indicates that the user has issued a command to kill the execution, e.g., via a task or by clicking on the `Kill` button in the UI. The system is terminating (killing) any task runs still in progress. As soon as all task runs are terminated, the execution will transition to the `KILLED` state.
13. **KILLED**: This terminal state indicates that the execution has been killed upon request by the user. No more tasks will be able to run, and the execution is considered terminated.

## What is the difference between the `CANCELLED` and `KILLED` states?

1. The `CANCELLED` state is used when the **system** automatically cancels an execution due to the `concurrency` limit being reached.
2. The `KILLING` state is used when the **user** manually kills an execution and the system is in the process of terminating the task runs associated with the execution.
3. The `KILLED` state is used when the execution has been killed upon request by the **user**.

## How are task run states different from execution states?

Task run states represent the status of a single task run within an execution.

![taskrun_states](./taskrun_states.png)

Each task run can be in one of the following states:
1. **CREATED**: The task run has been created but not yet started.
2. **SUBMITTED**: The task run has been submitted to a Worker but has not started running yet.
3. **RUNNING**: The task run is currently in progress.
4. **SUCCESS**: The task run has completed successfully.
5. **WARNING**: The task run has completed successfully but with warnings.
6. **FAILED**: The task run has failed.
7. **RETRYING**: The task run is currently being retried.
8. **RETRIED**: The task run has been retried.
9. **RESTARTED**: The task run is currently being restarted.
10. **KILLING**: The task run is in the process of being killed.
11. **KILLED**: The task run has been killed upon request by the user.

Note how there is no `QUEUED`, `CANCELLED`, or `PAUSED` states for task runs.
