---
title: "Kestra 2.0: MCP Tools, Worker Groups, and a Leaner Core"
description: "Kestra 2.0 makes flows callable by AI agents via MCP, redesigns Worker Groups with tag-based routing and JWT auth, brings action-based RBAC, and removes legacy constructs in favor of cleaner primitives."
date: 2026-09-01T10:00:00
category: News & Product Updates
authors:
  - name: "AJ Emerich"
    image: aemerich
    linkedin: https://www.linkedin.com/in/alex-emerich/
image: ./main.jpg
---

<!-- TODO: hero image (main.jpg) needed -->

Kestra 2.0 ships with intentional breaking changes. Version 2.0 removes constructs that accumulated technical debt across three release cycles (ForEach, Java-class trigger conditions, CRUD-based RBAC permissions) and replaces them with designs that hold up under production load, multi-team governance, and the increasingly common requirement that your orchestration platform be reachable by AI agents.

The headline capability is MCP: Kestra flows can now be exposed as typed tools on an MCP server and invoked directly by Claude, Cursor, Codex, or any MCP-compatible agent. That unlocks a class of AI-driven automation that previously required bespoke integrations. Worker Groups got a complete architectural overhaul with tag-based routing, capacity reservation, and JWT-based worker authentication. RBAC moves from generic CRUD on resources to resource-plus-action pairs, so you can grant a CI service account the right to execute flows without being able to delete them.

This post covers what shipped. The [engineering post from April](/blogs/kestra-2-0-engineering) covers why.

| Feature | What | Edition |
|---|---|---|
| MCP Tool Trigger + MCP Server | Expose flows as tools callable by AI agents | EE, Cloud |
| Worker Groups 2.0 | Tag-based routing, capacity reservation, JWT auth | EE |
| RBAC action-based permissions | Resource + action model replaces CRUD | EE |
| Policies | Namespace-scoped governance rules replace `pluginDefaults` | EE |
| Loop task | Replaces ForEach and ForEachItem with isolated sub-executions | All |
| Trigger `when` expression | Pebble replaces Java-class conditions on all trigger types | All |
| kestractl IAM commands | Full IAM management (users, groups, roles, service accounts) from CLI | EE |
| Blueprint version control | PushBlueprints and SyncBlueprints tasks for Git-based governance | EE |
| AWS EC2 Task Runner | Native EC2 execution via SSM, with Spot support | EE, Cloud |
| PurgeStorage | Storage-driven cleanup for orphaned execution files | All |
| Reusable Inputs | Shared input groups defined once at namespace level | EE, Cloud |

<!-- TODO: video embed if one exists at release time -->

## MCP Tool Trigger and MCP Server

<!-- TODO: screenshot of MCP server Tool Flows tab or Connect tab config snippet -->

Any Kestra flow can now register as a named tool on an MCP server. An AI agent sends a tool call; Kestra creates an execution with the matched inputs, runs the flow, and returns the outputs. No custom API wrapper, no polling loop, no manual result parsing.

The `McpToolTrigger` handles registration. Add it to any flow alongside your task list:

```yaml
id: run_dbt_model
namespace: company.data

tasks:
  - id: dbt
    type: io.kestra.plugin.dbt.cli.DbtCLI
    commands:
      - dbt run --select {{ inputs.model_name }}

triggers:
  - id: mcp
    type: io.kestra.plugin.core.trigger.McpToolTrigger
    toolName: run-dbt-model
    title: Run a dbt model
    toolDescription: >
      Runs a specific dbt model in the production warehouse. Use when a user asks
      to refresh a specific model or rebuild a table. Input: the model name as it
      appears in the dbt project (e.g. "stg_orders", "fct_revenue").
```

The `toolDescription` field is the most important property to get right. Agents use it to decide when and how to invoke the tool, so a vague description produces poor routing. Write it from the agent's perspective: what situation should trigger this call, and what does the input represent.

Flow inputs map automatically to the tool's JSON schema parameter spec. Outputs become the tool's response payload. If a flow has a `JSON` input with a `jsonSchema` property, the schema propagates to the tool spec.

A `default` MCP server is provisioned for every tenant on startup. Additional servers (separate servers per team, or one per environment) can be created from the UI. Each server generates ready-to-paste connection configuration for Claude Desktop, Claude Code, Cursor, and Codex on its Connect tab.

Authentication options vary by edition: BASIC is available on all editions, API_TOKEN on EE, and OAuth2 on EE and Cloud. OAuth2 support means browser-based clients like Claude web can authenticate without any local credential setup.

All executions created via MCP are tagged with `system.from: mcp`, `system.mcpServerId`, and `system.mcpSessionId`, so filtering by agent origin in the execution list is straightforward.

For access control, the `MCP_SERVER` resource in the EE RBAC model governs who can create and manage MCP servers. A user needs `FLOW: EXECUTE` permission on at least one namespace with a registered `McpToolTrigger` to call the matching tool.

See the [MCP server docs](/docs/ai-tools/mcp-server) and [McpToolTrigger reference](/docs/workflow-components/triggers/mcp-tool-trigger) for full setup.

## Worker Groups 2.0

Worker Groups in 2.0 is a ground-up redesign. The old model assigned tasks to a group by name with `workerGroup.key`. The new model separates three concerns that the old model conflated: Workers (compute units that authenticate via tokens), Worker Groups (pools of workers), and Worker Queues (routing lanes identified by tags).

Tasks declare routing requirements with `workerSelector.tags`:

```yaml
tasks:
  - id: gpu_inference
    type: io.kestra.plugin.scripts.python.Commands
    workerSelector:
      tags:
        - gpu
        - a100
      match: ALL
      fallback: FAIL
```

A Worker Group subscribes to one or more queues. The platform routes a task to the first available group that covers all required tags (or any, with `match: ANY`). `fallback` controls what happens when no matching group is available: `FAIL` (the default in 2.0, changed from the 1.x default of `WAIT`), `WAIT`, `CANCEL`, or `IGNORE` (drop the requirement and route to the default queue).

The fallback default flip is the sharpest gotcha for upgraders. Tasks that previously waited silently for a matching worker will now fail immediately. Set `fallback: WAIT` explicitly on tasks where the old behavior was intentional.

### Capacity reservation

Each Worker Group subscription now supports per-subscription capacity reservation. A `reservedPercent` value on a subscription sets a floor: the worker keeps that percentage of its thread pool available for tasks from that queue, regardless of competing demand. Two modes control whether idle reserved slots can be used by other queues:

- `STRICT` keeps reserved capacity exclusive. An idle reserved slot stays idle rather than being used by another queue.
- `ELASTIC` lends idle reserved capacity to other ELASTIC subscriptions, reclaiming it when the owning queue has work. Strict guarantees beat elastic ones when both queues have work.

Reserved percentages are configurable live, without restarting workers. Changes propagate within seconds.

### Worker authentication

Workers now authenticate with the platform using JWT. The setup flow: a registration token is created in the UI or via kestractl; the worker presents it on first connect; Kestra issues a short-lived JWT access token and a rotating refresh token. Revoking a registration token fails the next refresh, cutting off that worker immediately.

This replaces the previous trust model where workers connected without credential verification.

See the [Worker Groups reference](/docs/enterprise/scalability/worker-group) for migration steps, including the `workerGroup.key` to `workerSelector.tags` mapping.

## RBAC: Action-Based Permissions

The CRUD permission model (READ, CREATE, UPDATE, DELETE on generic resources) is replaced by a resource-plus-action model. Each resource now exposes only the actions that make sense for it.

A few examples of what this unlocks:

| Goal | Old model (minimum viable) | New model |
|---|---|---|
| CI/CD service account deploys and runs flows | FLOW: CREATE + EXECUTION: CREATE | `FLOW: EXECUTE` |
| Support engineer reads logs | EXECUTION: READ | `EXECUTION: ACCESS_LOGS` |
| Scheduler triggers backfills | EXECUTION: CREATE | `TRIGGER: BACKFILL` |
| Analyst follows a live execution | EXECUTION: READ | `EXECUTION: FOLLOW` |

New resources in 2.0 include `TRIGGER` (previously part of `FLOW`), `SYSTEM_SETTINGS`, `TENANT_SETTINGS`, and `COPILOT`. The MCP server resource (`MCP_SERVER`) is also new.

Five managed roles ship with 2.0: Viewer, Launcher, Editor, Developer, and Admin. Existing custom roles and bindings are migrated automatically on upgrade.

See the [RBAC reference](/docs/enterprise/auth/rbac) and the [migration guide for the RBAC action model](/docs/migration-guide/v2.0.0/rbac-action-model).

## Policies

Without enforcement tooling, keeping flows compliant across many namespaces is a manual coordination problem: authors must set values correctly on every task, and administrators have no way to verify or block non-compliant flows. Policies solves this at the platform layer.

Policies is the EE replacement for `pluginDefaults`. It gives platform administrators governance rules that inject configuration, validate compliance, and block non-conforming flows — across namespaces, tenants, and flow-level properties that `pluginDefaults` could never reach, like `retry`, `concurrency`, and `labels`.

A Policy is a named set of rules scoped to a namespace or a tenant. Rules from a parent namespace cascade to all child namespaces automatically, so a company-wide constraint placed at the root namespace reaches every team without per-namespace configuration.

Five rule types ship in 2.0: `Add` and `Delete` mutate configuration before execution without altering stored flow YAML; `Deny`, `Restrict`, and `Require` validate it and can block or warn when a flow violates a constraint. Rules target either the flow (`on: flow`) or any plugin instance in it — tasks, triggers, task runners (`on: plugin`) — narrowed by a `where` clause that matches on the plugin type.

A practical example: require that every flow carries a team label, and restrict all script tasks to an approved container registry.

```yaml
id: prod-standards
description: "Label requirements and registry policy for production flows."
enforcement: active

rules:
  - type: io.kestra.plugin.ee.rules.Require
    on: flow
    properties:
      - labels.team
    errorMessage: "Every flow must declare labels.team."

  - type: io.kestra.plugin.ee.rules.Restrict
    on: plugin
    where:
      - field: type
        operator: STARTS_WITH
        value: io.kestra.plugin.scripts
    property: containerImage
    regex: "^registry.internal/.*"
    action: block
    errorMessage: "Container images must be pulled from registry.internal."
```

`Add` rules inject values at resolution time. With `override: false` (the default), the author's explicit value wins and the policy fills in only what's absent. With `override: true`, the policy value always wins. Either way, every injection is annotated in the flow editor's merged preview — forced values are never invisible to authors.

Before enabling enforcement, set `enforcement: evaluate`. The policy checks every flow in scope and surfaces violations in the Governance UI, but nothing is blocked and no values are injected. When the violation report looks right, flip to `active`.

Policies also support opt-in bundles with `enforcement: reference`. A reference policy only applies to flows or tasks that explicitly list it in `policyRefs`. This covers named configuration profiles — an analytics warehouse connection vs an OLTP connection, or a CPU-bound runner profile vs a GPU-bound one, selected per task in the same flow.

`pluginDefaults` is removed in 2.0 for both OSS and EE. The [migration guide](/docs/migration-guide/v2.0.0/plugin-defaults-removed) covers all three scopes (flow-level, namespace-level, and global server config) with before-and-after examples. See the [Policies reference](/docs/enterprise/governance/policies) for the full rule DSL.

## Loop Task

ForEach and ForEachItem are removed in 2.0. The `Loop` task replaces both.

The removal was driven by a real stability problem. A `ForEach` task with a large input list could generate thousands of child task runs within a single flow execution, exhausting executor memory and affecting every other flow running on the instance at the same time. `Loop` runs each iteration as an isolated sub-execution. A runaway loop cannot destabilize the instance.

The expression syntax is also cleaner. Where ForEach used `{{ taskrun.value }}` and ForEachItem used `{{ taskrun.value }}` with a `parentOutput()` helper for nested access, Loop uses:

| Old expression | New expression |
|---|---|
| `{{ taskrun.value }}` | `{{ item.value }}` |
| `{{ taskrun.iteration }}` | `{{ item.index }}` |
| `{{ parent.taskrun.value }}` | `{{ item.parent.value }}` |

Outputs work differently too. ForEach had implicit output collection; Loop requires an explicit `outputs:` block on each task inside the loop, and the `loopOutputs()` function extracts a flat list of one field across all iterations:

:::collapse{title="Example: Collect outputs across loop iterations"}

```yaml
id: process_files
namespace: company.data

tasks:
  - id: loop
    type: io.kestra.plugin.core.flow.Loop
    values: "{{ inputs.file_list }}"
    tasks:
      - id: transform
        type: io.kestra.plugin.scripts.python.Commands
        commands:
          - python transform.py --input "{{ item.value }}"
        outputs:
          - id: result_path
            type: STRING

  - id: collect_results
    type: io.kestra.plugin.core.log.Log
    message: "{{ loopOutputs(outputs.loop.outputs, 'result_path') | join(', ') }}"
```

:::

The [ForEach to Loop migration guide](/docs/migration-guide/v2.0.0/foreach-loop) maps every ForEach and ForEachItem pattern to its Loop equivalent, including nested loops, subflow iteration, and output collection.

## Trigger `when` Expression

The `conditions` list on all trigger types is removed. All triggers gain a top-level `when` property that takes a Pebble expression. This applies to Schedule, Webhook, Flow, and Polling triggers.

The old model required fully-qualified Java class names:

```yaml
triggers:
  - id: weekly
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 9 * * 1"
    conditions:
      - type: io.kestra.plugin.core.condition.DayWeek
        dayOfWeek: MONDAY
      - type: io.kestra.plugin.core.condition.NotCondition
        conditions:
          - type: io.kestra.plugin.core.condition.PublicHolidayCondition
            country: FR
```

The same logic in 2.0:

```yaml
triggers:
  - id: weekly
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 9 * * 1"
    when: "{{ isWeekend(trigger.date, 'Europe/Paris') == false and isPublicHoliday(trigger.date, 'FR') == false }}"
```

New date and calendar helper functions ship alongside the redesign: `isWeekend()`, `isPublicHoliday()` (with country and subdivision), `isDayWeekInMonth()`, `isLastWorkingDay()`, `dayOfWeek()`, `dayOfMonth()`, `monthOfYear()`, and `hourOfDay()`.

Flow triggers also change significantly. The old `conditions` and `preconditions` system is replaced by a `dependsOn` list of upstream flow entries, each specifying `flowId`, `namespace`, `states` (default: SUCCESS and WARNING), `labels`, and an optional per-entry `when`. A top-level `when` on the Flow trigger evaluates before the `dependsOn` check and can use `trigger.namespace`, `trigger.flowId`, `trigger.state`, and `trigger.outputs`.

The [trigger conditions migration guide](/docs/migration-guide/v2.0.0/trigger-conditions-redesign) maps every condition class to its `when` equivalent.

## kestractl IAM Commands

kestractl, introduced in Kestra 1.3, gains full EE IAM management in 2.0. The new command groups cover every entity in the action-based permission model:

- `kestractl users` — create, list, get, update, delete users; set passwords
- `kestractl groups` — manage groups and memberships (tenant-scoped)
- `kestractl roles` — create and bind roles; assign permissions via `--permission TYPE:ACTION[,ACTION]` or `--permissions-file`
- `kestractl service-accounts` — create and manage service accounts (instance-level)

The `--output json` flag applies across all commands, so kestractl output can pipe directly into `jq` or other tooling in CI scripts.

:::collapse{title="Example: Provision a CI service account from a script"}

```bash
# Create the service account
kestractl service-accounts create \
  --name ci-deployer \
  --description "Flow deploy and execute for CI"

# Create a role with exactly the permissions it needs
kestractl roles create \
  --name ci-role \
  --permission FLOW:READ,CREATE,UPDATE \
  --permission EXECUTION:CREATE,READ

# Bind the role to the service account
kestractl roles bind \
  --role ci-role \
  --service-account ci-deployer
```

:::

See the [kestractl reference](/docs/kestra-cli/kestractl) for all commands and authentication configuration.

## Blueprint Version Control

Custom Blueprints can now be version-controlled with Git using two new EE tasks: `PushBlueprints` commits and pushes blueprints from Kestra to a Git repository, and `SyncBlueprints` pulls blueprints from Git into Kestra, treating Git as the single source of truth.

The pattern mirrors the `PushFlows`/`SyncFlows` GitOps model. Platform teams can manage the approved blueprint library centrally, review changes via pull requests, and deploy consistently across multiple Kestra instances or environments.

This complements Templated Blueprints (also new in 2.0), which let platform teams author blueprints with Pebble-based form templates. Users fill a form; Kestra generates the flow YAML. Combined with version control, the governance loop closes: templates are authored in code, reviewed in Git, and distributed as a self-service library.

See the [Custom Blueprints reference](/docs/enterprise/governance/custom-blueprints).

## AWS EC2 Task Runner

<!-- TODO: optional screenshot or flow snippet for GPU Spot example -->

The EC2 task runner is a new EE runner type that executes task commands directly on an EC2 instance via [AWS Systems Manager Run Command](https://docs.aws.amazon.com/systems-manager/latest/userguide/execute-remote-commands.html). No SSH. No container runtime.

Kestra launches the instance from the configured AMI, waits for the SSM Agent to register, uploads any input files to S3, runs the task as a bash script, streams output via CloudWatch Logs to the Kestra execution log in near real-time, downloads output files, and then terminates the instance unconditionally when the run finishes.

The primary use cases are workloads that cannot or should not run inside a container: GPU training and inference jobs tied to a custom CUDA AMI, licensed software bound to a specific machine image, and Spot-optimized workloads where you want direct control over the instance type and max bid price.

:::collapse{title="Example: GPU inference on a Spot instance"}

```yaml
id: gpu_inference
namespace: company.ml

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
      iamInstanceProfile: "{{ secret('INSTANCE_PROFILE_ARN') }}"
      bucket: "{{ secret('S3_STAGING_BUCKET') }}"
      spotMaxPrice: "0.25"
    commands:
      - python /opt/myapp/inference.py --model /opt/models/my-model
```

:::

If the Kestra Worker restarts mid-run, the runner reattaches to the existing instance and SSM command rather than launching a new one (`resume: true` by default).

For comparison: use the [AWS Batch task runner](/docs/task-runners/04.types/04.aws-batch-task-runner) for containerized workloads on Batch (ECS Fargate, EC2, EKS). Use the EC2 task runner when containers are not an option.

See the [AWS EC2 Task Runner reference](/docs/task-runners/04.types/05.aws-ec2-task-runner) for IAM permissions, AMI requirements, and setup.

## PurgeStorage

The existing `PurgeExecutions` task deletes execution records and their associated files, but it is database-driven: it cannot clean files whose execution records are already gone. This becomes a problem in deployments where worker groups use isolated internal storage, where files accumulate without any corresponding execution record to trigger a cleanup.

`io.kestra.plugin.core.storage.PurgeStorage` takes the storage-driven approach instead. It walks the storage tree directly and deletes files based on last-modified date, regardless of whether a matching execution record exists. The task defaults to `dryRun: true`, so the first run only reports what would be deleted.

The workerGroup property (inherited from all Kestra tasks) means PurgeStorage can target a specific worker's isolated storage by running on that worker group.

See the [purge guide](/docs/administrator-guide/purge) for setup and the two-step orphan-file remediation pattern.

## Additional Improvements

**Reusable Inputs (EE/Cloud).** Define a named input group once at the namespace level (`type: REUSABLE_INPUTS`) and reference it across flows with a single line. Child inputs are accessible as `{{ inputs.<refId>.<childId> }}`. Supports namespace hierarchy inheritance and revision pinning.

**ION binary format.** ION output files are now stored in binary format, reducing storage consumption by roughly 20 to 40 percent. Expressions that call `read()` on ION outputs and then do string operations need `fromIon()` wrapping. The [migration guide](/docs/migration-guide/v2.0.0/ion-binary-format) covers affected tasks and patterns.

**Input improvements.** SELECT and MULTISELECT inputs now support `{label, value}` objects, so the UI can show a human-readable label while flows receive the underlying technical value. JSON inputs gain a `jsonSchema` property (JSON Schema Draft 2020-12) that validates at execution creation time, rejecting invalid payloads before any task runs.

**Unit test expectedState.** Flow unit tests can now assert that a test case ends in `FAILED`, `WARNING`, or `KILLED`. Testing intentional failure paths (validation guards using `io.kestra.plugin.core.execution.Fail`, SLA breaches, etc.) is now first-class.

**TRACEPARENT propagation.** Pass `{{ trace.parent }}` as the `TRACEPARENT` environment variable in script tasks to parent their OpenTelemetry spans under the Kestra task span. Closes a distributed tracing gap for teams running scripts inside Docker containers.

**Syslog (CEF) log exporter.** The EE Log Shipper and Audit Log Shipper gain a Syslog CEF destination over TCP, UDP, or TLS. CEF-formatted Kestra log events route directly into SIEM infrastructure (Graylog, Splunk, QRadar) without a custom adapter.

**AI Agent observability.** AI Agents emit Prometheus metrics for tool calls, provider calls, and embedding store calls (`ai.agent.tool.calls`, `ai.provider.calls`, `ai.embedding.store.calls`). New MCP client tasks (`SseMcpClient`, `StdioMcpClient`, `DockerMcpClient`, `StreamableHttpMcpClient`) let Agent tasks call external MCP servers as tools.

## Upgrade and Migration

2.0 requires being on Kestra 1.3.x before upgrading. If you are on an earlier version, follow the [1.1](/docs/migration-guide/v1.1.0) and [1.2](/docs/migration-guide/v1.2.0) migration guides first.

The breaking changes that require action:

| Change | What to update |
|---|---|
| `ForEach` and `ForEachItem` removed | Migrate to `Loop`. Use `item.value` / `item.index` / `loopOutputs()`. |
| Trigger `conditions` removed | Replace with `when` Pebble expression. Flow trigger uses `dependsOn` + `window`. |
| `workerGroup.key` removed | Migrate to `workerSelector.tags`. Check the `fallback` default change (WAIT to FAIL). |
| RBAC CRUD model replaced | Existing roles migrate automatically. Review custom roles against the new action model. |
| `io.kestra.plugin.core.condition.json` Pebble function removed | Replace with `fromJson()` (same signature). |
| `forced: true` on flow-level `pluginDefaults` removed | Move forced defaults to global or namespace level. |
| ION binary format | `read()` on ION outputs followed by string ops needs `fromIon()` wrapping. |

Each has a dedicated migration guide in the [v2.0.0 migration hub](/docs/migration-guide/v2.0.0).

## Get Started

The [Kestra 2.0 migration guide](/docs/migration-guide/v2.0.0) covers every breaking change with before/after examples. The [quickstart](/docs/getting-started/quickstart) and [Docker Compose setup](/docs/installation/docker-compose) are updated for 2.0.

If you run into anything unexpected during the upgrade, open an issue on [GitHub](https://github.com/kestra-io/kestra/issues) or reach out on [Slack](https://kestra.io/slack).
