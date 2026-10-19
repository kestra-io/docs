---
title: AWS EC2 Task Runner – Run Tasks Natively on EC2 Instances
h1: Execute Kestra Tasks Directly on AWS EC2 Instances
sidebarTitle: AWS EC2 Task Runner
icon: /src/contents/docs/icons/concepts.svg
editions: ["EE", "Cloud"]
description: Execute tasks natively on AWS EC2 instances via SSM Run Command — ideal for GPU workloads, licensed software, and Spot instance cost optimization.
---

Run tasks natively on AWS EC2 instances via [AWS Systems Manager Run Command](https://docs.aws.amazon.com/systems-manager/latest/userguide/execute-remote-commands.html) — no SSH, no container runtime required.

## When to use the EC2 task runner

Use the EC2 task runner when your workload cannot or should not run inside a container:

- **GPU workloads** that require a specific CUDA-capable AMI without the overhead of AWS Batch queue setup
- **Non-containerized scripts** that use locally installed binaries or proprietary software tied to a specific AMI
- **Spot instance optimization** where you need direct control over the instance type and max bid price
- **Network-sensitive workloads** that must run inside a specific VPC subnet with fine-grained security group control

For containerized workloads on AWS, use the [AWS Batch task runner](../04.aws-batch-task-runner/index.md) instead.

## How it works

For each task run, the EC2 task runner:

1. Launches an EC2 instance from the configured AMI and instance type
2. Waits for the instance to reach `running` state and for the SSM Agent to register with Systems Manager (up to `instanceReadyTimeout`, default 5 minutes)
3. If `bucket` is set, uploads `inputFiles` and `namespaceFiles` to S3 from the Kestra worker
4. Sends the task's commands to the instance via SSM Run Command, which also downloads input files from S3 and uploads output files back to S3 on the instance side
5. Streams command output from CloudWatch Logs to the Kestra execution logs in near real-time (when `streamLogs: true`, the default)
6. Downloads `outputFiles` from S3 to Kestra internal storage once the command completes
7. Terminates the instance unconditionally — on success, failure, or worker interruption

This runner ignores the `containerImage` property. Commands execute directly on the instance OS.

:::alert{type="info"}
If the Kestra Worker restarts mid-run, the runner reattaches to the existing instance and SSM command rather than launching a new one (`resume: true` by default). The instance is still terminated when the run eventually finishes.
:::

The following Pebble expressions and environment variables are available inside the task:

| Pebble expression | Environment variable | Description |
|---|---|---|
| `{{ workingDir }}` | `WORKING_DIR` | Path to the task's working directory on the instance where input files are placed |
| `{{ outputDir }}` | `OUTPUT_DIR` | Path to the output directory; all files written here are automatically captured — useful when the set of output files is not known in advance |
| `{{ bucketPath }}` | `BUCKET_PATH` | S3 URI of the task's staging folder in the configured bucket (only available when `bucket` is set) |

### Exit codes

When the SSM command reaches a successful or failed terminal state, the task's exit code is the real exit code of your last command. For other terminal SSM statuses, the runner maps them to fixed codes:

| SSM command status | Exit code |
|---|---|
| `SUCCESS` / `FAILED` | Real command exit code |
| `IN_PROGRESS` | `2` |
| `DELAYED` | `3` |
| `PENDING` | `4` |
| `CANCELLED` | `5` |
| `CANCELLING` | `6` |
| `TIMED_OUT` | `7` |
| Unknown | `-1` |

## Minimum IAM permissions required

:::alert{type="warning"}
**Running on Kestra Cloud?** The Cloud control plane runs outside your AWS account and has no EC2 instance profile to supply a base AWS identity. Static `accessKeyId` / `secretKeyId` credentials are required.
:::

The IAM principal used by Kestra (the user or role whose credentials are passed via `accessKeyId`/`secretKeyId`, or the worker's instance profile) needs the following minimum permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:RunInstances",
        "ec2:DescribeInstances",
        "ec2:CreateTags",
        "ec2:TerminateInstances",
        "ssm:SendCommand",
        "ssm:GetCommandInvocation",
        "ssm:DescribeInstanceInformation",
        "ssm:ListCommands",
        "ssm:CancelCommand",
        "logs:DescribeLogGroups",
        "logs:CreateLogGroup"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "iam:PassRole"
      ],
      "Resource": "<iamInstanceProfileRoleArn>"
    }
  ]
}
```

Replace `<iamInstanceProfileRoleArn>` with the ARN of the IAM role backing your instance profile.

Two of these permissions are only exercised in specific situations:
- `ssm:ListCommands` — used during resume when the instance is found but its command ID tag is missing (fallback to locate the in-flight command)
- `ssm:CancelCommand` — used when the task is killed to cancel the in-flight SSM command before terminating the instance

:::alert{type="info"}
`logs:CreateLogGroup` allows Kestra to create the `/aws/ec2/kestra-run-command` log group if it does not already exist. You can pre-create the log group and omit this permission if your security policy prohibits it.
:::

### CloudWatch Logs streaming permission

When `streamLogs` is `true` (the default), the runner polls CloudWatch Logs in real time using `logs:FilterLogEvents`. Add this permission to the statement above:

```json
{
  "Effect": "Allow",
  "Action": [
    "logs:FilterLogEvents"
  ],
  "Resource": "arn:aws:logs:<region>:<accountId>:log-group:/aws/ec2/kestra-run-command:*"
}
```

Set `streamLogs: false` to skip live polling. Command output is always delivered at the end of the run via SSM's `GetCommandInvocation` response (capped at ~24 KB per stream) regardless of this setting.

### S3 permissions when using `bucket`

When the `bucket` property is set, the Kestra worker uploads `inputFiles` and `namespaceFiles` to S3 before the instance runs, and downloads `outputFiles` after the command completes. Add these permissions to the Kestra principal:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": "*"
    }
  ]
}
```

## IAM instance profile requirements

The EC2 instance profile attached via `iamInstanceProfile` must allow the SSM Agent to register and receive commands. At minimum, attach the `AmazonSSMManagedInstanceCore` AWS managed policy to the instance profile's role.

If `bucket` is set, the instance also needs S3 access to download input files and upload output files at runtime. The instance uses the AWS CLI (`aws s3 sync` / `aws s3 cp`) to transfer files, so grant the following on the staging bucket:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::<bucket>",
        "arn:aws:s3:::<bucket>/*"
      ]
    }
  ]
}
```

If `streamLogs` is `true` (the default), the instance also needs permission to write logs to CloudWatch. `AmazonSSMManagedInstanceCore` does **not** include these. Add them to the instance profile role:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "*"
    }
  ]
}
```

## AMI requirements

The AMI must have the SSM Agent installed and running. This is true by default for:

- Amazon Linux 2 and Amazon Linux 2023
- Ubuntu Server 16.04 LTS and later (AWS-provided AMIs)
- Most AWS-provided Windows Server AMIs

For custom AMIs, verify the SSM Agent is present and enabled. See the [SSM Agent installation guide](https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-agent.html) for details.

## Example flows

### Basic shell command

```yaml
id: ec2_shell
namespace: company.team

variables:
  region: eu-west-3
  amiId: ami-0c55b159cbfafe1f0

tasks:
  - id: shell
    type: io.kestra.plugin.scripts.shell.Commands
    taskRunner:
      type: io.kestra.plugin.ee.aws.runner.Ec2
      accessKeyId: "{{ secret('AWS_ACCESS_KEY_ID') }}"
      secretKeyId: "{{ secret('AWS_SECRET_KEY_ID') }}"
      region: "{{ vars.region }}"
      amiId: "{{ vars.amiId }}"
      instanceType: t3.micro
      iamInstanceProfile: kestra-ec2-ssm-profile
    commands:
      - echo "Hello from EC2"
```

### Input and output files via S3

```yaml
id: ec2_with_files
namespace: company.team

inputs:
  - id: file
    type: FILE

variables:
  region: eu-west-3
  amiId: ami-0c55b159cbfafe1f0
  bucket: my-kestra-staging-bucket

tasks:
  - id: shell
    type: io.kestra.plugin.scripts.shell.Commands
    inputFiles:
      data.txt: "{{ inputs.file }}"
    outputFiles:
      - out.txt
    taskRunner:
      type: io.kestra.plugin.ee.aws.runner.Ec2
      accessKeyId: "{{ secret('AWS_ACCESS_KEY_ID') }}"
      secretKeyId: "{{ secret('AWS_SECRET_KEY_ID') }}"
      region: "{{ vars.region }}"
      amiId: "{{ vars.amiId }}"
      instanceType: t3.micro
      iamInstanceProfile: kestra-ec2-ssm-profile
      subnetId: subnet-0123456789abcdef0
      securityGroupIds:
        - sg-0123456789abcdef0
      bucket: "{{ vars.bucket }}"
    commands:
      - cp "{{ workingDir }}/data.txt" "{{ workingDir }}/out.txt"
```

### GPU workload on a Spot instance

```yaml
id: gpu_spot_job
namespace: company.team

tasks:
  - id: inference
    type: io.kestra.plugin.scripts.shell.Commands
    taskRunner:
      type: io.kestra.plugin.ee.aws.runner.Ec2
      accessKeyId: "{{ secret('AWS_ACCESS_KEY_ID') }}"
      secretKeyId: "{{ secret('AWS_SECRET_KEY_ID') }}"
      region: "{{ secret('AWS_REGION') }}"
      amiId: "{{ secret('DEEP_LEARNING_AMI_ID') }}"
      instanceType: g4dn.xlarge
      subnetId: "{{ secret('PRIVATE_SUBNET_ID') }}"
      securityGroupIds:
        - "{{ secret('SG_ID') }}"
      iamInstanceProfile: "{{ secret('INSTANCE_PROFILE_ARN') }}"
      bucket: "{{ secret('S3_BUCKET') }}"
      spotMaxPrice: "0.25"
    commands:
      - python /opt/myapp/inference.py --model /opt/models/my-model
```

## Monitoring

Set `monitoring.enabled: true` to run the task command under [kotlp](https://github.com/kestra-io/kotlp), a portable observability wrapper Kestra stages into the task's working directory and uploads with other input files. No image change is needed.

kotlp reports the instance's resource usage as `process.*` task metrics, sampled every `monitoring.metricsInterval` (default `PT1S`):

| Metric | Type | Unit | Attribute |
|---|---|---|---|
| `process.cpu.time` | sum | `s` | `cpu.mode`: `user` or `system` |
| `process.cpu.utilization` | gauge | `1` | `cpu.mode`: `user` or `system` |
| `process.memory.usage` | gauge | `By` | — |
| `process.memory.virtual` | gauge | `By` | — |
| `process.disk.io` | sum | `By` | `disk.io.direction`: `read` or `write` |
| `process.network.io` | sum | `By` | `network.io.direction`: `receive` or `transmit` |
| `process.thread.count` | gauge | `{thread}` | — |
| `process.open_file_descriptor.count` | gauge | `{count}` | — |

The three sum metrics (`process.cpu.time`, `process.disk.io`, `process.network.io`) are cumulative and reflect totals for the entire run. `process.network.io` counts all traffic in the network namespace the command runs in, including loopback, not only the command's own. The gauge metrics reflect the last sample taken before the command exits, not a peak. A task that spikes memory early and frees it before finishing reports the figure at exit, not the high-water mark.

kotlp also runs an embedded OTLP receiver, so traces the command exports are captured as task traces.

Monitoring fixes a limitation of the SSM log stream: stdout and stderr are both delivered as a single stream with no way to distinguish them. kotlp tags each line with the stream it came from, so lines the command wrote to stderr are logged at ERROR instead of INFO.

```yaml
id: ec2_with_monitoring
namespace: company.team

tasks:
  - id: run
    type: io.kestra.plugin.scripts.shell.Commands
    taskRunner:
      type: io.kestra.plugin.ee.aws.runner.Ec2
      accessKeyId: "{{ secret('AWS_ACCESS_KEY_ID') }}"
      secretKeyId: "{{ secret('AWS_SECRET_KEY_ID') }}"
      region: "{{ secret('AWS_REGION') }}"
      amiId: "{{ secret('EC2_AMI_ID') }}"
      instanceType: t3.micro
      iamInstanceProfile: kestra-ec2-ssm-profile
      subnetId: "{{ secret('SUBNET_ID') }}"
      bucket: "{{ secret('S3_BUCKET') }}"
      monitoring:
        enabled: true
    commands:
      - echo "stdout line"
      - echo "stderr line" >&2
```

| Property | Default | Description |
|---|---|---|
| `monitoring.enabled` | `false` | When true, wraps the task command with kotlp. |
| `monitoring.metricsInterval` | `PT1S` | How often kotlp samples resource usage. Accepts values between `PT0.001S` and `PT1H`. |

### Constraints

Three requirements apply when monitoring is enabled:

- `bucket` must be configured. kotlp is staged as a working-directory file and uploaded to S3 alongside other input files. The task fails immediately if `bucket` is absent.
- The image must provide `/bin/sh`, `gzip`, and `chmod`. The instance must also have a writable `$TMPDIR` (default `/tmp`). Standard AMIs (Amazon Linux, Ubuntu) satisfy all requirements.
- An explicit `commands` list is required. kotlp wraps the command you supply; it cannot wrap an image entrypoint.

## Security hardening

### No public IP

Set `associatePublicIp: false` to launch the instance without a public IPv4 address. When set, `subnetId` is required. The instance must still reach AWS Systems Manager to register and receive commands — provide a NAT gateway or a `ssm`, `ssmmessages`, and `ec2messages` VPC endpoint bundle, otherwise the SSM Agent never registers and the run times out. If `bucket` is set, S3 must also be reachable. If `streamLogs: true` (the default), the subnet must also reach CloudWatch Logs (a `logs` VPC endpoint or NAT gateway), otherwise the command hangs until `waitUntilCompletion` expires; set `streamLogs: false` to avoid this requirement.

```yaml
taskRunner:
  type: io.kestra.plugin.ee.aws.runner.Ec2
  accessKeyId: "{{ secret('AWS_ACCESS_KEY_ID') }}"
  secretKeyId: "{{ secret('AWS_SECRET_KEY_ID') }}"
  region: "{{ secret('AWS_REGION') }}"
  amiId: "{{ secret('EC2_AMI_ID') }}"
  instanceType: t3.micro
  iamInstanceProfile: kestra-ec2-ssm-profile
  subnetId: "{{ secret('PRIVATE_SUBNET_ID') }}"
  securityGroupIds:
    - "{{ secret('SG_ID') }}"
  associatePublicIp: false
  requireImdsv2: true
  # No `logs` VPC endpoint or NAT in this subnet, so disable CloudWatch log streaming
  streamLogs: false
```

### IMDSv2

Set `requireImdsv2: true` to enforce session-token (IMDSv2) requests on the instance metadata service. The SSM Agent supports IMDSv2, but software in your task that still calls IMDSv1 will fail. With the default hop limit of 1, a `docker run` started by your task cannot fetch instance profile credentials (e.g. for `aws s3`); raise the hop limit on the AMI or launch template if you need that.

### Secure Boot

Secure Boot is not a runner property — choose an AMI that already has UEFI Secure Boot enabled via `amiId`.

## Key properties

| Property | Required | Default | Description |
|---|---|---|---|
| `amiId` | Yes | — | AMI ID to launch from. Must have the SSM Agent installed. |
| `instanceType` | Yes | — | EC2 instance type, e.g. `t3.micro`, `g4dn.xlarge`. |
| `iamInstanceProfile` | Yes | — | Name or ARN of the instance profile. See [IAM instance profile requirements](#iam-instance-profile-requirements). |
| `bucket` | No | — | S3 bucket for file staging. Required when using `inputFiles`, `outputFiles`, or `namespaceFiles`. |
| `subnetId` | No | — | Subnet to launch into. Defaults to the account's default VPC subnet. |
| `securityGroupIds` | No | — | Security group IDs. Defaults to the subnet's default security group. |
| `spotMaxPrice` | No | — | Max hourly Spot price in USD. When set, launches a Spot instance. |
| `associatePublicIp` | No | subnet default | Whether to assign a public IPv4 address. Leave unset to inherit the subnet's `MapPublicIpOnLaunch` setting. Set to `false` to launch without a public IP; the instance must still reach SSM via a NAT gateway or VPC endpoints (`ssm`, `ssmmessages`, `ec2messages`), otherwise the SSM Agent never registers and the run times out. When `bucket` is set, S3 must also be reachable. When `streamLogs: true` (the default), CloudWatch Logs must be reachable (a `logs` VPC endpoint or NAT gateway), otherwise the command hangs until `waitUntilCompletion` expires; set `streamLogs: false` to avoid this. Set to `true` to force a public IP; the subnet needs a route to an internet gateway. When set (either value), `subnetId` is required. |
| `requireImdsv2` | No | `false` | When `true`, enforces IMDSv2 (session-token) on the instance metadata service. The SSM Agent supports IMDSv2, but software in your task that still calls IMDSv1 will fail. With the default hop limit of 1, a `docker run` started by your task cannot fetch instance profile credentials (e.g. for `aws s3`); raise the hop limit on the AMI or launch template if you need that. |
| `streamLogs` | No | `true` | Poll CloudWatch Logs for live output. Requires additional [instance profile permissions](#iam-instance-profile-requirements). |
| `waitUntilCompletion` | No | `PT1H` | Maximum time to wait for the SSM command to finish. |
| `completionCheckInterval` | No | `PT5S` | How often to poll SSM for command completion. Increase (e.g. `PT1M`) for long-running tasks to reduce API calls if you hit rate limits. |
| `instanceReadyTimeout` | No | `PT5M` | Maximum time to wait for the instance and SSM Agent to become ready. |
| `resume` | No | `true` | Reattach to an existing instance and command if the Kestra Worker restarts. |

For the full property reference, see the [plugin documentation](/plugins/plugin-ee-aws/aws-task-runners/io.kestra.plugin.ee.aws.runner.ec2).
