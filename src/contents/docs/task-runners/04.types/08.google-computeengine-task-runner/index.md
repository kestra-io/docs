---
title: "Google Compute Engine Task Runner"
h1: Run Kestra Tasks on Google Compute Engine VMs
sidebarTitle: Google Compute Engine Task Runner
icon: /src/contents/docs/icons/concepts.svg
editions: ["EE", "Cloud"]
description: Run Kestra script tasks directly on Compute Engine VMs — no SSH, no IAP tunnel. The script runs as the instance's startup-script; logs stream from the serial console.
---

Run script tasks directly on a Compute Engine VM instance — no SSH, no IAP tunnel.

## Overview

The Google Compute Engine task runner injects the task script as the instance's `startup-script` metadata. When the VM boots, the guest environment runs the script automatically, mirrors its stdout and stderr to the serial console (port 1), and Kestra streams those lines back as task logs. Completion is detected via a `kestra/status` guest attribute the wrapper script writes on exit.

This mechanism requires:
- **Guest attributes enabled** — the runner sets `enable-guest-attributes` automatically on every instance it touches.
- **An image with `bash`, `curl`, and `python3`** — the default Debian and Ubuntu Compute Engine images satisfy this. Custom images must include all three.

Unlike the [Google Batch](../06.google-batch-task-runner/index.md) and [Google Cloud Run](../07.google-cloudrun-task-runner/index.md) runners, the Compute Engine runner executes commands from the working directory — use `{{ workingDir }}` or the `WORKING_DIR` environment variable when you need the explicit path.

:::alert{type="warning"}
If your project enforces the `compute.disableGuestAttributesAccess` organization policy, the runner fails fast with an actionable error on the first poll. Guest attributes cannot be selectively enabled for a single instance when this org policy is active.
:::

## Instance modes

### Create a new instance (default)

Provide `instanceConfig` — a raw JSON object matching the [`instances.insert`](https://cloud.google.com/compute/docs/reference/rest/v1/instances/insert) request body. At minimum, include `disks` (with `initializeParams.sourceImage`) and `networkInterfaces`. Any `name` field is ignored; Kestra generates the instance name from the flow, task, and execution.

```yaml
taskRunner:
  type: io.kestra.plugin.ee.gcp.runner.ComputeEngine
  projectId: "{{ secret('GCP_PROJECT_ID') }}"
  zone: europe-west1-b
  serviceAccount: "{{ secret('GOOGLE_SA') }}"
  instanceConfig:
    disks:
      - boot: true
        initializeParams:
          sourceImage: projects/debian-cloud/global/images/family/debian-12
    networkInterfaces:
      - network: projects/my-project/global/networks/default
        accessConfigs:
          - type: ONE_TO_ONE_NAT
```

The `machineType` property (default `e2-medium`) always overrides any `machineType` set inside `instanceConfig`.

### Target an existing instance

Set `instanceName` to run the task on an already-existing VM. Startup scripts run only on boot, so the runner reboots the instance (`instances.reset`) if it is already running.

:::alert{type="warning"}
Rebooting an existing instance interrupts anything else currently running on it. Never target the same `instanceName` from two concurrent Kestra executions — the second reboot kills the first task's in-flight script.
:::

The runner never deletes an instance it did not create. Setting `deleteInstance: true` when using `instanceName` only cleans up the staged GCS blob prefix for that run; the instance itself is left untouched. Use `stopInstance: true` if you also want the instance stopped after the task completes.

```yaml
taskRunner:
  type: io.kestra.plugin.ee.gcp.runner.ComputeEngine
  projectId: "{{ secret('GCP_PROJECT_ID') }}"
  zone: europe-west1-b
  serviceAccount: "{{ secret('GOOGLE_SA') }}"
  instanceName: my-persistent-vm
  stopInstance: false
  deleteInstance: false
```

## File handling

Set `bucket` to enable `inputFiles`, `namespaceFiles`, `outputFiles`, and `{{ outputDir }}`. The bucket acts as a staging area:

- Input and namespace files are uploaded before the instance starts the task.
- Output files are collected from the instance after the task completes and made available in the Kestra UI.

`bucket` is required when any file transfer is configured. The runner raises an error at task start if output files are requested without a bucket.

The instance's network must be able to reach Cloud Storage — an external IP, [Cloud NAT](https://cloud.google.com/nat/docs/overview), or [Private Google Access](https://cloud.google.com/vpc/docs/private-google-access) all satisfy this. When creating a new instance via `instanceConfig`, include `serviceAccounts` with at least the `https://www.googleapis.com/auth/cloud-platform` scope. The startup script calls the instance metadata server at `/service-accounts/default/token` to obtain a GCS authentication token; without an attached service account, this call fails and file transfer silently breaks.

```yaml
taskRunner:
  type: io.kestra.plugin.ee.gcp.runner.ComputeEngine
  projectId: "{{ secret('GCP_PROJECT_ID') }}"
  zone: europe-west1-b
  bucket: my-staging-bucket
  serviceAccount: "{{ secret('GOOGLE_SA') }}"
  instanceConfig:
    disks:
      - boot: true
        initializeParams:
          sourceImage: projects/debian-cloud/global/images/family/debian-12
    networkInterfaces:
      - network: projects/my-project/global/networks/default
    serviceAccounts:
      - email: default
        scopes:
          - https://www.googleapis.com/auth/cloud-platform
```

## IAM permissions

Grant the following IAM roles to the service account Kestra uses (`serviceAccount`):

| Role | Required for |
|---|---|
| `roles/compute.instanceAdmin.v1` | Create, start, stop, delete instances; read guest attributes; read the serial console |
| `roles/iam.serviceAccountUser` | Required when the Compute Engine instance runs under a dedicated service account |
| `roles/storage.admin` | Required when using `inputFiles`, `outputFiles`, or `namespaceFiles` with a `bucket` |

## Instance lifecycle

By default, the runner creates a new instance for every task run and deletes it on completion.

| Property | Default | Behavior |
|---|---|---|
| `stopInstance` | `true` | Stop the instance after the task completes. Ignored when `deleteInstance` is also `true`. Never applies to instances targeted via `instanceName`. |
| `deleteInstance` | `true` | Delete the instance and clean up its staged GCS prefix after the task completes. Never deletes an instance targeted via `instanceName`. |

Set both to `false` to keep the instance running for inspection after the task:

```yaml
taskRunner:
  type: io.kestra.plugin.ee.gcp.runner.ComputeEngine
  projectId: "{{ secret('GCP_PROJECT_ID') }}"
  zone: europe-west1-b
  serviceAccount: "{{ secret('GOOGLE_SA') }}"
  stopInstance: false
  deleteInstance: false
  instanceConfig:
    disks:
      - boot: true
        initializeParams:
          sourceImage: projects/debian-cloud/global/images/family/debian-12
    networkInterfaces:
      - network: projects/my-project/global/networks/default
```

## Termination and resume behavior

If the Kestra Worker is terminated mid-run, the instance continues running until the task script finishes. When `resume: true` (default), a restarted Worker reattaches to the existing Kestra-labeled instance rather than creating a duplicate.

If you stop the execution from the Kestra UI, Kestra deletes any instance it created for that run. Instances targeted via `instanceName` are left running with a log warning.

Set `resume: false` to force a new instance on every execution attempt:

```yaml
taskRunner:
  type: io.kestra.plugin.ee.gcp.runner.ComputeEngine
  projectId: "{{ secret('GCP_PROJECT_ID') }}"
  zone: europe-west1-b
  serviceAccount: "{{ secret('GOOGLE_SA') }}"
  resume: false
  instanceConfig:
    disks:
      - boot: true
        initializeParams:
          sourceImage: projects/debian-cloud/global/images/family/debian-12
    networkInterfaces:
      - network: projects/my-project/global/networks/default
```

## Timeout and polling

| Property | Default | Description |
|---|---|---|
| `waitUntilCompletion` | `PT1H` | Maximum wall-clock time before the task times out. The task's own `timeout` takes precedence when set. |
| `completionCheckInterval` | `PT5S` | How often to poll the guest attribute and stream new serial console log lines. |
| `waitForLogInterval` | `PT5S` | Quiet period after the task ends — Kestra keeps polling the serial console until no new log lines arrive for this duration, then finalizes logs and outputs. |

```yaml
taskRunner:
  type: io.kestra.plugin.ee.gcp.runner.ComputeEngine
  projectId: "{{ secret('GCP_PROJECT_ID') }}"
  zone: europe-west1-b
  serviceAccount: "{{ secret('GOOGLE_SA') }}"
  waitUntilCompletion: PT4H
  completionCheckInterval: PT30S
  waitForLogInterval: PT10S
  instanceConfig:
    disks:
      - boot: true
        initializeParams:
          sourceImage: projects/debian-cloud/global/images/family/debian-12
    networkInterfaces:
      - network: projects/my-project/global/networks/default
```

## Example flows

### Create a VM and run a shell command

```yaml
id: compute_engine_shell
namespace: company.team

variables:
  projectId: my-project
  zone: europe-west1-b

tasks:
  - id: shell
    type: io.kestra.plugin.scripts.shell.Commands
    taskRunner:
      type: io.kestra.plugin.ee.gcp.runner.ComputeEngine
      projectId: "{{ vars.projectId }}"
      zone: "{{ vars.zone }}"
      serviceAccount: "{{ secret('GOOGLE_SA') }}"
      instanceConfig:
        disks:
          - boot: true
            initializeParams:
              sourceImage: projects/debian-cloud/global/images/family/debian-12
        networkInterfaces:
          - network: "projects/{{ vars.projectId }}/global/networks/default"
            accessConfigs:
              - type: ONE_TO_ONE_NAT
    commands:
      - echo "Hello World"
```

### Pass input files to an existing instance and retrieve output files

```yaml
id: compute_engine_existing_instance
namespace: company.team

inputs:
  - id: file
    type: FILE

variables:
  projectId: my-project
  zone: europe-west1-b
  bucket: my-bucket

tasks:
  - id: shell
    type: io.kestra.plugin.scripts.shell.Commands
    inputFiles:
      data.txt: "{{ inputs.file }}"
    outputFiles:
      - out.txt
    taskRunner:
      type: io.kestra.plugin.ee.gcp.runner.ComputeEngine
      projectId: "{{ vars.projectId }}"
      zone: "{{ vars.zone }}"
      bucket: "{{ vars.bucket }}"
      instanceName: my-persistent-vm
      stopInstance: false
      deleteInstance: false
      serviceAccount: "{{ secret('GOOGLE_SA') }}"
    commands:
      - cp {{ workingDir }}/data.txt {{ workingDir }}/out.txt
```

:::alert{type="info"}
For a complete list of properties, see the [plugin documentation](/plugins/plugin-ee-gcp/task-runners/io.kestra.plugin.ee.gcp.runner.computeengine) or explore the configuration in the built-in Code Editor.
:::
