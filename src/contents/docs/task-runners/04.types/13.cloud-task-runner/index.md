---
title: Cloud Task Runner – Managed Compute on Kestra Cloud
h1: Run Kestra Tasks on Managed Cloud Compute
sidebarTitle: Cloud Task Runner
icon: /src/contents/docs/icons/concepts.svg
editions: ["Cloud"]
description: Run script tasks on compute managed by Kestra. Pick a machine size, set timeouts and credentials, and Kestra handles provisioning, placement, and cleanup.
---

Run tasks on compute managed by Kestra. Pick a machine size; there is nothing to provision, authenticate, or clean up.

:::alert{type="info"}
Available on Kestra Cloud only.
:::

## The default on Kestra Cloud

On Kestra Cloud, every task that accepts a `taskRunner` property runs on this runner by default, unless you set `taskRunner` on the task or an administrator has set one by [Policy](../../../07.enterprise/02.governance/policies/index.md). You do not add anything to your flow.

Set `taskRunner` explicitly when you want to change how the task runs: a size other than `S`, a longer timeout, credentials for a private image, or a different runner altogether. The [property reference](#property-reference) lists everything you can set.

```yaml
id: cloud_runner_example
namespace: company.team

tasks:
  - id: transform
    type: io.kestra.plugin.scripts.python.Script
    taskRunner:
      type: io.kestra.plugin.cloud.runner.Cloud
      size: M
    containerImage: python:3.13-slim
    script: |
      print("running on managed compute")
```

Each task runs in its own container, removed when the task finishes. Runner time is billed by size and duration: see [Cloud compute](../../../07.enterprise/06.cloud/02.cloud-compute/index.md).

## Pick a size

`size` takes `S`, `M`, `L`, or `XL`. The default is `S`. Each step up roughly doubles the memory and the CPU available to your task. The resources behind each size are managed by the platform and can change, so your flow references the name rather than a fixed machine spec.

Requests equal limits, so your task gets its full size for the whole run, with no overcommit and no borrowing from a neighbour.

**Size up when:**

- the task is killed for running out of memory
- it is CPU-bound and parallel, and finishing sooner is worth the higher rate
- it is close to the one-hour default and you would rather not raise the timeout

**Stay on `S` when:**

- the task waits on an API, a database, or a file transfer
- the work is single-threaded, so extra cores sit idle
- you could split it into several `S` tasks instead

Sizing up also consumes more of your instance's shared capacity, so fewer tasks run at once. An `XL` task holds several `S` tasks' worth of room.

:::alert{type="warning"}
`size` cannot be an expression. `size: "{{ inputs.machine }}"` is rejected, because the value is read straight from the flow definition to determine billing. To vary it, use `If` or `Switch` with separate tasks.
:::

## Timeouts

| Property | Default | Covers |
|---|---|---|
| `waitUntilRunning` | 10 minutes | Waiting for the container to start |
| `waitUntilCompletion` | 1 hour | Waiting for your code to finish |

**A task running longer than an hour fails by default.** Raise it for long jobs:

```yaml
    taskRunner:
      type: io.kestra.plugin.cloud.runner.Cloud
      size: L
      waitUntilCompletion: PT6H
```

`waitUntilCompletion` applies when the task itself has no `timeout` set. A task-level `timeout` wins, and setting one shorter than an hour fails the task sooner and stops the billing sooner.

Both are billed. A job that hangs for six hours costs six hours.

## Test new images on a short timeout

A wrong image name or bad registry credentials does not fail fast. The task waits out `waitUntilRunning`, so it burns up to 10 minutes at your chosen size before failing.

Test a new image on `S`, and lower `waitUntilRunning` while you are iterating:

```yaml
    taskRunner:
      type: io.kestra.plugin.cloud.runner.Cloud
      waitUntilRunning: PT2M
```

## Private images

```yaml
    taskRunner:
      type: io.kestra.plugin.cloud.runner.Cloud
      credentials:
        username: "{{ secret('REGISTRY_USERNAME') }}"
        password: "{{ secret('REGISTRY_PASSWORD') }}"
    containerImage: registry.example.com/team/python-base:1.4
```

Bake your dependencies into the image. Installing packages at the start of every run is billed on every run, and it is usually the largest avoidable cost on this runner.

## Files

Only files declared in `outputFiles` come back from the container. If a downstream task reads a file this one left behind without declaring it, set `syncWorkingDirectory: true` to return the whole directory. It transfers more data and adds to the measured duration, so declare `outputFiles` where you can.

## Running as root

Set `runAsRoot: true` if your image needs root, for example to install system packages at run time. Your instance may have a Policy that restricts or forces this; if the setting looks ignored, that is why.

## Failures

Failed, killed, and timed-out tasks are billed for the time they ran. Each retry attempt is measured separately. See [Cloud compute](../../../07.enterprise/06.cloud/02.cloud-compute/index.md).

## Using your own infrastructure

Set `taskRunner` to any other [runner type](../index.mdx) and the task runs there instead, with no Kestra runner time billed. To make that the default across a namespace, use a [Policy](../../../07.enterprise/02.governance/policies/index.md) rather than editing every flow.

## Property reference

Everything below has a default. Set only what you need to change.

| Property | Default | What it does |
|---|---|---|
| `size` | `S` | Machine size: `S`, `M`, `L`, `XL`. Cannot be an expression |
| `waitUntilRunning` | 10 minutes | How long to wait for the container to start |
| `waitUntilCompletion` | 1 hour | How long to wait for your code to finish |
| `waitForLogs` | 30 seconds | How long to keep collecting logs after the container exits |
| `pullPolicy` | `ALWAYS` | Whether to pull the image on every run |
| `runAsRoot` | `false` | Run the task container as root |
| `syncWorkingDirectory` | `false` | Return the whole working directory, not just `outputFiles` |
| `credentials` | none | Username and password for a private registry |
| `resume` | `true` | Reattach to a running container if the Kestra worker restarts |
