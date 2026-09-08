---
title: "Huawei Cloud CCI Task Runner: Serverless Container Execution"
h1: Run Kestra Tasks as Pods on Huawei Cloud CCI
sidebarTitle: Huawei Cloud CCI Task Runner
icon: /src/contents/docs/icons/concepts.svg
editions: ["EE", "Cloud"]
description: Run tasks as bare Pods on Huawei Cloud CCI (Cloud Container Instance) for serverless, scalable container execution.
---

Run tasks as bare Pods on Huawei Cloud CCI (Cloud Container Instance) — Huawei's serverless container service and the closest equivalent to AWS Batch/ECS on Huawei Cloud.

CCI 2.0 exposes a Kubernetes-shaped API but has no Job controller. The `runner.Cci` task runner creates a bare Pod with `restartPolicy: Never` and owns its entire lifecycle: create, poll, stream logs, delete. Set `containerImage` on the task — this runner always executes inside a container.

The container does not start in the Kestra working directory. Use the `{{ workingDir }}` Pebble expression or the `WORKING_DIR` environment variable to reference input files and outputs.

## Prerequisites

Before using this runner:

- A CCI **namespace** must already exist and be bound to a VPC `Network`. The runner does not create or manage namespaces, VPCs, or networking. If the namespace is missing or not yet bound to a network, Pod creation fails with an actionable error.
- For file staging (`inputFiles`, `outputFiles`, `namespaceFiles`), an OBS **bucket** must already exist in the same region. The bucket is not created on demand — staging fails with `NoSuchBucket` if it is missing.

## Authentication

All tasks require `region`, `namespace`, and credentials. Three options are available:

- **AK/SK** (recommended): set `accessKeyId` and `secretAccessKey`. Requests to CCI are signed with `SDK-HMAC-SHA256`, computed locally with no IAM round-trip. The same credentials are required for OBS file staging (`inputFiles`, `outputFiles`, `namespaceFiles`). Always supply via `{{ secret('NAME') }}`.
- **Temporary credentials** (`temporaryCredentials`): the runner exchanges IAM credentials once per task invocation and signs requests with the returned session AK/SK. Suitable when static AK/SK are unavailable. The exchange runs once at invocation start — if the task runs longer than the session token's lifetime, credentials expire mid-run. Use permanent AK/SK for long-running tasks.
- **Pre-obtained IAM token** (`securityToken` alone): sent as `X-Auth-Token`. Obtain one via `POST /v3/auth/tokens`. IAM tokens expire after 24 hours and cannot be renewed, so a scheduled flow configured with one stops working the next day. Use this only for ad-hoc runs where AK/SK are unavailable. The IAM token path does not support OBS file staging — OBS uses AK/SK signing, not IAM tokens.

When both AK/SK and `securityToken` are set, `securityToken` is treated as an STS session token folded into the AK/SK signature, not as a bearer token.

Store credentials in [Kestra secrets](../../concepts/secret) and apply connection properties globally with [plugin defaults](../../workflow-components/plugin-defaults).

## Minimal example

```yaml
id: run_on_cci
namespace: company.team

variables:
  region: eu-west-101
  cci_namespace: kestra

tasks:
  - id: shell
    type: io.kestra.plugin.scripts.shell.Commands
    containerImage: alpine
    taskRunner:
      type: io.kestra.plugin.ee.huawei.runner.Cci
      region: "{{ vars.region }}"
      endpointSuffix: myhuaweicloud.eu  # EU sovereign cloud; omit for myhuaweicloud.com
      namespace: "{{ vars.cci_namespace }}"
      accessKeyId: "{{ secret('HUAWEI_ACCESS_KEY_ID') }}"
      secretAccessKey: "{{ secret('HUAWEI_SECRET_ACCESS_KEY') }}"
    commands:
      - echo "Hello from CCI"
```

## File handling

Set the `bucket` property to use `inputFiles`, `outputFiles`, or `namespaceFiles`. File staging requires AK/SK credentials — OBS uses AK/SK signing, not IAM tokens. If your IAM user or access key is scoped to a project rather than a domain, also set `projectId`.

The Kestra Worker uploads input and namespace files to OBS before the Pod starts. An `input-files` init container then syncs them from OBS into the Pod's shared working directory. After the main container finishes, an `output-files` sidecar container uploads the output files from the working directory back to OBS. The Worker then downloads them to Kestra's internal storage.

To reference files inside the container, use these expressions:

| Expression | Environment variable | What it points to |
|---|---|---|
| `{{ workingDir }}` | `WORKING_DIR` | Working directory — contains all input and namespace files |
| `{{ outputDir }}` | `OUTPUT_DIR` | Output directory — files here are captured by `outputFiles` patterns |
| `{{ bucketPath }}` | `BUCKET_PATH` | OBS prefix used for this task run (`obs://bucket/path`) |

:::alert{type="warning"}
When using `outputFiles` or `{{ outputDir }}`, the main container command is wrapped in `/bin/sh -c` to write a completion signal file that the `output-files` sidecar waits for. The container image must include `/bin/sh`. Distroless or scratch images cause the Pod to fail.
:::

Set `syncWorkingDirectory: true` to download the entire working directory after completion instead of only files matched by `outputFiles` patterns. Requires `bucket` and AK/SK credentials.

### File staging with mirrored images

The sync containers use `amazon/aws-cli` by default (configurable via `obsSyncImage`) against OBS's S3-compatible API endpoint. In EU sovereign regions, CCI pulls all images — including `amazon/aws-cli` — through the in-region SWR mirror, whose anonymous Docker Hub passthrough is rejected with `401 Unauthorized`. Mirror the image into your own SWR organization and set `obsSyncImage` to the mirrored path. The same `imagePullSecret` used for your main container applies to the sync containers, since it is set Pod-wide.

```yaml
taskRunner:
  type: io.kestra.plugin.ee.huawei.runner.Cci
  region: eu-west-101
  endpointSuffix: myhuaweicloud.eu
  namespace: kestra
  accessKeyId: "{{ secret('HUAWEI_ACCESS_KEY_ID') }}"
  secretAccessKey: "{{ secret('HUAWEI_SECRET_ACCESS_KEY') }}"
  bucket: kestra-cci-staging
  imagePullSecret: imagepull-secret
  obsSyncImage: swr.eu-west-101.myhuaweicloud.eu/my-org/aws-cli:latest
```

OBS credentials are passed to the sync containers via a Kubernetes Secret (`secretKeyRef`), not as plaintext environment variables. The Secret is removed together with the Pod when `delete: true`.

### File staging example

```yaml
id: cci_with_files
namespace: company.team

inputs:
  - id: file
    type: FILE

variables:
  region: eu-west-101
  cci_namespace: kestra

tasks:
  - id: shell
    type: io.kestra.plugin.scripts.shell.Commands
    inputFiles:
      data.txt: "{{ inputs.file }}"
    outputFiles:
      - out.txt
    containerImage: swr.eu-west-101.myhuaweicloud.eu/my-org/alpine:3.20
    taskRunner:
      type: io.kestra.plugin.ee.huawei.runner.Cci
      region: "{{ vars.region }}"
      endpointSuffix: myhuaweicloud.eu
      namespace: "{{ vars.cci_namespace }}"
      accessKeyId: "{{ secret('HUAWEI_ACCESS_KEY_ID') }}"
      secretAccessKey: "{{ secret('HUAWEI_SECRET_ACCESS_KEY') }}"
      bucket: kestra-cci-staging
      imagePullSecret: imagepull-secret
      obsSyncImage: swr.eu-west-101.myhuaweicloud.eu/my-org/aws-cli:latest
    commands:
      - cp {{ workingDir }}/data.txt {{ workingDir }}/out.txt
```

## Resource sizing

CCI schedules Pods against fixed flavor tiers. `resources.request.cpu` must be one of:

`0.25` · `0.5` · `1` · `2` · `4` · `8` · `16` · `32` · `48` · `64`

`resources.request.memory` must use a `Gi` or `Mi` suffix (e.g. `1Gi`, `512Mi`) and must be between **1x and 8x** the vCPU value in GiB. Requests and limits are always set equal. The default is `0.5` vCPU / `1Gi`.

When `outputFiles` patterns are defined or `syncWorkingDirectory: true`, the runner adds an `output-files` sidecar. Its resource cost is summed with the main container's and the total is rounded up to the next schedulable vCPU tier and whole GiB. The default sidecar is `0.25` vCPU / `0.5Gi`, so a task at `0.5` vCPU / `1Gi` is billed as a `1` vCPU / `2Gi` Pod. The `input-files` init container is not added to this total — init containers are not counted alongside running containers. Override the sidecar size with `sidecarResources`.

```yaml
taskRunner:
  type: io.kestra.plugin.ee.huawei.runner.Cci
  region: eu-west-101
  namespace: kestra
  accessKeyId: "{{ secret('HUAWEI_ACCESS_KEY_ID') }}"
  secretAccessKey: "{{ secret('HUAWEI_SECRET_ACCESS_KEY') }}"
  resources:
    request:
      cpu: "2"
      memory: 4Gi
  sidecarResources:
    request:
      cpu: "0.5"
      memory: 1Gi
```

The shared working directory is backed by an `emptyDir` volume with a size limit set by `workingDirectorySizeLimit` (in MiB, default `10240` — 10 GiB). Increase this when staging large input or output files.

## Endpoint configuration

`endpointSuffix` determines the CCI and OBS endpoint hostnames. It defaults to `myhuaweicloud.com`. Set it to `myhuaweicloud.eu` for the EU sovereign cloud:

```yaml
taskRunner:
  type: io.kestra.plugin.ee.huawei.runner.Cci
  endpointSuffix: myhuaweicloud.eu
```

For testing against a local mock server, use `endpointOverride` to supply a full URL directly. `endpointOverride` takes precedence over `endpointSuffix`.

## Image pull in CCI

CCI 2.0 pulls **all** images through the in-region SWR mirror — including public Docker Hub images. Public egress (NAT gateway, EIP) is not involved. The subnet needs a route to the internal service range (`100.125.0.0/16`) and, in EU sovereign regions, a VPC endpoint for the SWR service with *Create a Private Domain Name* enabled.

If image pull fails as `ErrImagePull` or `ImagePullBackOff`, check that the VPC endpoint exists and that the SWR hostname resolves inside the Pod's subnet. For images in your own SWR organization, set `imagePullSecret`.

## Lifecycle and termination

The runner polls the Pod at each `completionCheckInterval` tick (default 5 seconds). If the Kestra Worker is terminated while a Pod is running, the Pod continues until completion. After the Worker restarts, it resumes polling the existing Pod — matched by flow, task, and execution labels, excluding the task run attempt number — unless `resume: false` is set.

Set the task-level `timeout` to bound how long a Pod can run before Kestra deletes it. Without a timeout, a stuck container bills until it is stopped manually.

After completion, `delete: true` (the default) removes the Pod, the OBS credentials Secret, and the OBS staging prefix. Use `delete: false` to keep the Pod for post-run inspection. Set `resume: false` to force a new Pod on every execution attempt instead of reconnecting to an existing one.

## Logs

Pod logs are polled via the CCI Pod-log subresource at each `completionCheckInterval` tick. The runner reports each Pod phase change and, before the Pod starts, the waiting reason (`ErrImagePull`, `ImagePullBackOff`, `Unschedulable`, etc.). A Pod that never starts produces no container logs — the phase and waiting reason are the primary diagnostic signals.

Log streaming is capped at 10 MiB per Pod. Beyond that limit, the runner stops streaming further lines (a one-time warning is logged) but the task continues to completion. The full log remains retrievable directly from CCI.

When a Pod ends in a failed phase, the runner reports each container's exit code, reason, and message, and dumps the log of each failed container other than `main`. This is the only way to see why file staging failed when `delete: true` — the Pod is gone before it can be inspected.

## Exit codes

| Pod phase | Exit code |
|---|---|
| `Succeeded` | `0` |
| `Failed` / `Stopped` | Main container exit code if non-zero; first failing container's exit code otherwise; fallback `1` |
| `Running` | `2` |
| `Pending` | `4` |
| `Unknown` / other | `-1` |
