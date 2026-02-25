---
title: "Kestra 1.3 introduces Kill Switch, Credentials, kestractl, new GitHub Action and New Infrastructure Plugins"
description: "Kestra 1.3 introduces Kill Switch, Credentials, kestractl, a new GitHub Action, and new Infrastructure Plugins for safer production operations and developer automation."
date: 2026-03-03T17:00:00
category: News & Product Updates
authors:
  - name: "Benoit Pimpaud"
    image: bpimpaud
image: ./main.jpg
---
Kestra 1.3 focuses on developer automation, safer production operations, and centralized authentication. This release introduces enterprise-grade Kill Switch controls, reusable Credentials for OAuth-based APIs, kestractl and new GitHub Action for managing flows and executions from the terminal and the CI/CD.

The table below highlights the key features of this release.

| Feature | Description | Edition |
|---|---|---|
| Kill Switch | UI-based control to stop or contain problematic executions | Enterprise Edition |
| Credentials | Centralized server-to-server OAuth2 credentials with token minting and refresh | Enterprise Edition |
| Assets | Second iteration of Assets (introduced in 1.2), with imperative lifecycle management plus event-driven and freshness-driven automation for SLA and governance workflows | Enterprise Edition |
| AI Copilot Enhancements | RBAC permission controls, expanded UI coverage, speech-to-text, model selection, and improved custom model settings | Enterprise Edition |
| kestractl | Command-line tool to interact with the Kestra host API for flows, executions, namespaces, and namespace files | All Editions |
| New GitHub Action | CLI-based action to deploy, validate, and trigger flows | All Editions |
| Plugin Defaults UI | Manage plugin defaults directly from the namespace page | Enterprise Edition |
| New Plugins | Infrastructure and policy integrations, including MAAS, NetBox, Nutanix, and OPA | All Editions |

Check the video below for a quick overview of all enhancements.
<div class="video-container">
  <iframe src="" title="" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Kill Switch

When production incidents happen, relying on CLI-only skip commands is slow, confusing, and limited to server admins.

Kill Switch introduces a UI-based mechanism to stop or contain problematic executions, designed for administrators. It provides a comprehensive administration interface and ensures every action is visible and auditable.

You can access it under **Instance Administration > Kill Switch**, where you can create new Kill Switches and review active or archived ones. Three types are available:

| Type | Behavior |
|---|---|
| **KILL** | Immediately kills running executions and worker tasks. New executions transition to `KILLED` instantly. |
| **CANCEL** | Cancels new executions and lets current task runs finish before transitioning to `CANCELLED`. |
| **IGNORE** | Ignores all execution messages. Use as a last resort for executions that cannot be killed. |

Kill Switches can target a **tenant**, **namespace**, **flow**, or **execution**. They support scheduling with a mandatory start date and optional end date, and include an optional reason to document why the switch was applied. All actions are recorded in Audit Logs, and deletions are soft-deleted to preserve history.

An announcement banner is displayed based on scope: namespace-level switches are shown only to users working in that namespace, while tenant-level switches appear for all users in the tenant.

The CLI remains available for power users and administrators who prefer terminal workflows, with the commands renamed to align with behavior:

```
--ignore-executions
--ignore-flows
```

## Credentials

Teams struggle to connect workflows to modern APIs because credentials are scattered, brittle, and hard to rotate across environments. Managing authentication separately in each integration slows delivery and makes incidents harder to fix.

Credentials provide reusable server-to-server (machine-to-machine) authentication for flows. You configure authentication once and reference it in workflows with a simple expression, while Kestra handles token retrieval and refresh centrally.

Use the `credential()` function to retrieve an access token at runtime:

```yaml
id: api_call
namespace: company.team

tasks:
  - id: request
    type: io.kestra.plugin.core.http.Request
    uri: https://api.example.com/v1/ping
    method: GET
    auth:
      type: BEARER
      token: "{{ credential('my_oauth') }}"
```

Supported credential types include OAuth2 `client_credentials`, OAuth2 JWT Bearer (`jwt_bearer`), OAuth2 `private_key_jwt`, and GitHub App.

## Assets

Kestra 1.3 brings the second iteration of **Assets**, building on the foundation introduced in [Kestra 1.2](../release-1-2/index.md).

In 1.2, Assets introduced a stateful inventory and lineage model directly in workflows. In 1.3, Assets becomes more operational: teams can now manage assets imperatively, react to lifecycle events in real time, monitor freshness, and automate remediation and governance workflows with richer filters and trigger outputs.

What this means in practice:

- **Imperative lifecycle tasks** to create/update, list, and delete assets directly from flows (`Set`, `List`, `Delete`).
- **Event-based trigger automation** with `EventTrigger` to react on asset lifecycle events (`CREATED`, `UPDATED`, `DELETED`, `USED`).
- **Freshness monitoring trigger** to detect stale assets and launch workflows automatically (`FreshnessTrigger`).
- **Flexible scoping** by asset ID, namespace, type, and metadata conditions.
- **Actionable trigger context** with `event`, `eventTime`, `lastUpdated`, `staleDuration`, and `checkTime` to drive alerts, routing, and recovery actions.

:::collapse{title="Example: React in real time to asset events"}

```yaml
id: asset_event_driven_pipeline
namespace: company.data

tasks:
  - id: transform_to_mart
    type: io.kestra.plugin.core.flow.Subflow
    namespace: company.data
    flowId: create_mart_tables
    inputs:
      source_asset_id: "{{ trigger.asset.id }}"
      source_event: "{{ trigger.asset.event }}"
      event_time: "{{ trigger.asset.eventTime }}"

triggers:
  - id: staging_table_event
    type: io.kestra.plugin.ee.assets.EventTrigger
    namespace: company.data
    assetType: io.kestra.plugin.ee.assets.Table
    events:
      - CREATED
      - UPDATED
    metadataQuery:
      - field: model_layer
        type: EQUAL_TO
        value: staging
```

:::

:::collapse{title="Example: Audit asset deletions"}

```yaml
id: audit_asset_deletions
namespace: company.security

tasks:
  - id: log_deletion
    type: io.kestra.plugin.jdbc.postgresql.Query
    sql: |
      INSERT INTO audit_log (asset_id, asset_type, namespace, event, event_time)
      VALUES (
        '{{ trigger.asset.id }}',
        '{{ trigger.asset.type }}',
        '{{ trigger.asset.namespace }}',
        '{{ trigger.asset.event }}',
        '{{ trigger.asset.eventTime }}'
      )

triggers:
  - id: asset_deletion_event
    type: io.kestra.plugin.ee.assets.EventTrigger
    events:
      - DELETED
```

:::

:::collapse{title="Example: Trigger a flow when assets are stale"}

```yaml
id: stale_assets_monitor
namespace: company.monitoring

tasks:
  - id: log_stale
    type: io.kestra.plugin.core.log.Log
    message: >
      Found {{ trigger.assets | length }} stale assets.
      First asset: {{ trigger.assets[0].id ?? 'n/a' }}.
      Stale for: {{ trigger.assets[0].staleDuration ?? 'n/a' }}.

triggers:
  - id: stale_assets
    type: io.kestra.plugin.kestra.ee.assets.FreshnessTrigger
    maxStaleness: PT24H
    interval: PT1H
```

:::

:::collapse{title="Example: Scope freshness checks to production mart assets"}

```yaml
id: prod_assets_freshness
namespace: company.monitoring

tasks:
  - id: trigger_remediation
    type: io.kestra.plugin.core.flow.Subflow
    namespace: company.data
    flowId: refresh_marts
    inputs:
      asset_id: "{{ trigger.assets[0].id }}"
      last_updated: "{{ trigger.assets[0].lastUpdated }}"
      stale_duration: "{{ trigger.assets[0].staleDuration }}"

triggers:
  - id: stale_prod_marts
    type: io.kestra.plugin.kestra.ee.assets.FreshnessTrigger
    namespace: company.data
    assetType: TABLE
    maxStaleness: PT6H
    interval: PT30M
    metadataQuery:
      - field: environment
        type: EQUAL_TO
        value: prod
      - field: model_layer
        type: EQUAL_TO
        value: mart
```

:::

:::collapse{title="Example: Imperative asset lifecycle tasks"}

```yaml
id: asset_lifecycle_ops
namespace: company.data

tasks:
  - id: upsert_asset
    type: io.kestra.plugin.kestra.ee.assets.Set
    namespace: assets.data
    assetId: customers_by_country
    assetType: TABLE
    displayName: Customers by Country
    assetDescription: Customer distribution by country
    metadata:
      owner: data-team
      environment: prod

  - id: list_assets
    type: io.kestra.plugin.kestra.ee.assets.List
    namespace: assets.data
    types:
      - TABLE
    metadataQuery:
      - field: owner
        type: EQUAL_TO
        value: data-team
    fetchType: FETCH

  - id: delete_asset
    type: io.kestra.plugin.kestra.ee.assets.Delete
    assetId: customers_by_country
```

:::

## AI Copilot Enhancements

AI assistants are most useful when teams can control where and how they are used. In many organizations, administrators need permission boundaries, predictable model behavior, and simple input options before enabling copilots broadly.

Kestra 1.3 expands AI Copilot capabilities for enterprise teams with better governance and day-to-day usability:

- **RBAC control** - A new permission lets enterprise administrators allow or disallow AI Copilot usage by role.
- **Wider product coverage** - AI Copilot is now available in apps, unit tests, and dashboards.
- **Speech-to-text input** - A new button lets users dictate prompts directly in the UI.
- **Model selection in UI** - You can configure multiple models and let users choose the right one from a dropdown.
- **Custom model configuration improvements** - Custom model setup now supports request headers and timeout configuration.


## kestractl

Teams often need to automate flow deployment and operations across multiple environments, but relying only on the UI or custom API scripts is error-prone and inconsistent. A dedicated CLI makes those workflows repeatable in local and CI environments.

Kestra 1.3 introduces **`kestractl`**, a command-line interface focused on API-driven workflow operations.

Use `kestractl` to interact with the Kestra host API for flows, executions, namespaces, and namespace files.

For server components, plugins, and system maintenance commands, see the [Kestra Server CLI](/docs/server-cli).

The **Kestra Server CLI** is the original CLI many teams already know and trust, and it remains the right choice for server administration. **Kestractl** is the new companion focused on direct host operation.

## GitHub Action

Teams often rely on custom scripts to deploy and validate flows in CI, which leads to inconsistent pipelines and hard-to-maintain automation. A dedicated action makes these workflows repeatable across repositories.

Kestra 1.3 introduces a refreshed GitHub Action built on kestractl, so you can reuse the same commands in CI that you run locally. It supports:
- **Deploy namespace files**
- **Deploy flows to multiple namespaces**
- **Validate flows**
- **Trigger a deployed flow**

## Plugin Defaults UI (Namespace)

Plugin defaults are essential for consistent configurations, but managing them only in YAML makes them harder to discover, edit, and share across teams. This often slows down onboarding and pushes configuration drift into production.

Kestra 1.3 adds a dedicated Plugin Defaults UI on the namespace page so you can fully manage these settings from the UI while keeping them versionable. Create new defaults with an **Add plugin default** button, select the plugin from a dropdown, and fill a form that clearly separates required and optional fields, with the option to switch to YAML at any time.

You can also import plugin defaults from YAML to bootstrap or migrate from OSS, and export all defaults to YAML for Git, Terraform, or other IaC workflows.


## Additional Improvements

- **SeaweedFS Internal Storage** - Added support for `storage-seaweedfs` as an internal storage backend, giving teams an OSS-friendly option as the OSS MinIO server repository ([minio/minio](https://github.com/minio/minio)) is archived and no longer maintained.
- **BeyondTrust Secret Manager** - Added `secret-beyondtrust` as a new secret manager integration for secure credential retrieval.
- **Kafka Plugin** - Added support for Kafka 4.2 queues and share groups to make event processing more reliable, reduce duplicate work, and distribute messages more smoothly across consumers (`Consume`, `Trigger`, `RealtimeTrigger`).

## Plugins


### Infrastructure

- **ArgoCD** – Automate GitOps delivery by syncing applications and checking sync and health status from ArgoCD inside Kestra workflows (`Sync`, `Status`).
- **Canonical MAAS** – List machines, enlist servers, commission hardware, deploy OS images, and control power states (on/off/cycle/query) for end-to-end bare-metal lifecycle automation (`ListMachines`, `EnlistMachine`, `CommissionMachine`, `DeployMachine`, `PowerControlMachine`).
- **KVM** – Manage virtualization workloads and automate VM operations on KVM, including listing VMs, creating and updating VM definitions, starting and stopping instances, and deleting domains with optional storage cleanup (`ListVms`, `CreateVm`, `UpdateVm`, `StartVm`, `StopVm`, `DeleteVm`).
- **NetBox** – Integrate your infrastructure source of truth (DCIM/IPAM) into orchestration workflows, including listing sites and devices, creating and updating device records, and assigning IP addresses (`ListSites`, `ListDevices`, `CreateDevice`, `UpdateDevice`, `AssignIpAddress`).
- **Nutanix** – Manage AHV VM lifecycle and recovery workflows on hyper-converged infrastructure, including VM listing, creation, updates, start/stop/reboot/reset operations, cloning and template conversions, plus snapshot creation, listing, restore, and cleanup (`ListVms`, `CreateVm`, `UpdateVm`, `StartVm`, `StopVm`, `RebootVm`, `ResetVm`, `DeleteVm`, `CloneVm`, `CloneTemplate`, `ConvertVmToTemplate`, `ConvertTemplateToVm`, `CreateVmSnapshot`, `ListVmSnapshots`, `RestoreVmSnapshot`, `DeleteVmSnapshot`).

### Observability & Governance

- **Graylog** – Export Kestra execution logs to Graylog GELF HTTP inputs for centralized observability and SIEM workflows, with configurable host, batching, and HTTP client settings (`LogExporter`).
- **Open Policy Agent** – Add policy-as-code checks for governance and compliance by uploading, listing, compiling, evaluating, and deleting OPA policies and decisions (`Upload`, `List`, `Compile`, `Evaluate`, `Delete`).

### Data & Automation

- **Beam** – Orchestrate Apache Beam jobs for unified batch and streaming pipelines, with YAML-based execution across Java and Python SDKs on Direct, Flink, Spark, and Dataflow runners (`RunPipeline`).
- **COBOL** – Run and orchestrate legacy IBM i COBOL workloads by compiling programs from inline or stored source, executing jobs synchronously with parameters, and submitting batch jobs asynchronously (`CreateProgram`, `CallJob`, `SubmitJob`).
- **Trello** – Automate Trello card workflows from Kestra by creating, updating, moving, and commenting on cards, and by polling boards or lists for new and updated card activity (`Create`, `Update`, `Move`, `Comment`, `Trigger`).

## LTS and Enterprise Licensing

- **LTS (Long-Term Support):** Kestra 1.3 is an LTS release, which means one year of support with security and bug-fix backports. LTS releases are promoted every ~6 months and are recommended for production. As described in our [Releases & LTS policy](/docs/releases), Kestra 1.0 support is planned to end in September 2026, and Kestra 1.3 will be supported for one year from its release date.
- **Enterprise licensing:** Enterprise users need a new license for 1.3. To prevent mismatches, new 1.3 Enterprise instances will not start with older licenses. Our Customer Success team has already reached out to customers with upgrade guidance.

## Next Steps

This post highlighted the new features and enhancements introduced in Kestra 1.3. Which updates are most exciting to you? Are there additional capabilities you'd like to see in future releases? We welcome your feedback.

If you have any questions, reach out via [Slack](/slack) or open [a GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us a [GitHub star](https://github.com/kestra-io/kestra) and join [the community](/slack).
