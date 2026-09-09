---
title: Automate Clever Cloud with Kestra
h1: Automate Clever Cloud with Kestra
icon: /src/contents/docs/icons/clevercloud.svg
stage: Intermediate
topics:
  - Integrations
  - Cloud
description: Use Kestra flows to deploy applications, provision add-ons, forward logs, and manage organisation members on Clever Cloud.
---

Orchestrate Clever Cloud infrastructure from Kestra: deploy applications, provision managed databases, route logs to external platforms, and manage organisation members. For the full task and trigger reference, see the [plugin page](https://kestra.io/plugins/plugin-clevercloud).

## Prerequisites

- A [Clever Cloud](https://www.clever-cloud.com/) account
- A Clever Cloud API token — generate one in the console under **Profile > API tokens**
- An organisation ID if managing organisation-owned resources (find it in the console URL: `console.clever-cloud.com/organisations/orga_xxx`)

## Authentication

All Clever Cloud tasks share a single `apiToken` property. Store it as a [Kestra secret](../../06.concepts/04.secret/index.md) and reference it with `{{ secret('CC_API_TOKEN') }}`.

Most tasks also accept an optional `organisationId`. When omitted, the plugin targets your personal account via the `/self` API endpoint. Two task groups always require `organisationId`: all `logs` tasks (the APIv4 log endpoints have no `/self` shortcut) and the organisation member tasks (`ListMembers`, `AddMember`, `RemoveMember`).

### Inject credentials with a Policy (EE)

On Enterprise Edition, a [Policy](../../07.enterprise/02.governance/policies/index.md) `Add` rule injects `apiToken` into every Clever Cloud task in a namespace without touching any flow YAML:

```yaml
id: clever-cloud-auth
namespace: company.team
enforcement: ACTIVE

rules:
  - type: io.kestra.plugin.ee.rules.Add
    on: PLUGIN
    where:
      - field: type
        operator: STARTS_WITH
        value: io.kestra.plugin.clevercloud
    properties:
      apiToken: "{{ secret('CC_API_TOKEN') }}"
```

## Deploy an application and wait for it

Trigger a redeployment and block the flow until the deployment reaches a terminal state.

```yaml
id: redeploy_and_wait
namespace: company.team

inputs:
  - id: app_id
    type: STRING

tasks:
  - id: redeploy
    type: io.kestra.plugin.clevercloud.applications.Redeploy
    apiToken: "{{ secret('CC_API_TOKEN') }}"
    applicationId: "{{ inputs.app_id }}"

  - id: get_deployment
    type: io.kestra.plugin.clevercloud.deployments.List
    apiToken: "{{ secret('CC_API_TOKEN') }}"
    applicationId: "{{ inputs.app_id }}"
    limit: 1
    fetchType: FETCH_ONE

  - id: wait
    type: io.kestra.plugin.clevercloud.deployments.WaitForState
    apiToken: "{{ secret('CC_API_TOKEN') }}"
    applicationId: "{{ inputs.app_id }}"
    deploymentId: "{{ outputs.get_deployment.deployment.uuid }}"
    targetState: OK
    failOnUnreached: true
    timeout: PT20M
```

Deployment states: `WIP` (in progress), `OK` (success), `FAIL` (error), `CANCELLED`. Set `failOnUnreached: true` to fail the flow if the deployment reaches `FAIL` or `CANCELLED` instead of `OK`. Use `deployments.Trigger` to fire a flow automatically when a deployment reaches a target state.

:::alert{type="warning"}
`Redeploy` returns no output. The `get_deployment` step fetches the most recent deployment immediately after — if the new deployment has not yet registered in the Clever Cloud API, it may return the previous one. Add a short `Wait` task between `redeploy` and `get_deployment` if you observe this in practice.
:::

## Provision a database add-on and read its credentials

Provision a managed database and retrieve its connection credentials.

```yaml
id: provision_postgres
namespace: company.team

tasks:
  - id: create_addon
    type: io.kestra.plugin.clevercloud.addons.Create
    apiToken: "{{ secret('CC_API_TOKEN') }}"
    organisationId: "{{ secret('CC_ORG_ID') }}"
    providerId: postgresql-addon
    plan: dev
    region: par
    name: my-app-db

  - id: get_credentials
    type: io.kestra.plugin.clevercloud.addons.GetEnv
    apiToken: "{{ secret('CC_API_TOKEN') }}"
    organisationId: "{{ secret('CC_ORG_ID') }}"
    addonId: "{{ outputs.create_addon.id }}"

  - id: link_to_app
    type: io.kestra.plugin.clevercloud.addons.LinkToApplication
    apiToken: "{{ secret('CC_API_TOKEN') }}"
    organisationId: "{{ secret('CC_ORG_ID') }}"
    applicationId: "{{ secret('CC_APP_ID') }}"
    addonId: "{{ outputs.create_addon.id }}"
```

`addons.GetEnv` returns connection credentials in plain text via `{{ outputs.get_credentials.variables }}`. Avoid logging or persisting this output directly — pass values to downstream tasks using Kestra's secret store or output references.

Use `addons.AddonProvisionedTrigger` to fire a flow automatically when a new add-on appears in your account.

## Forward application logs to an external platform

Create a log drain to continuously forward an application's logs to New Relic, Datadog, Elasticsearch, or a syslog endpoint.

```yaml
id: setup_log_drain
namespace: company.team

tasks:
  - id: create_drain
    type: io.kestra.plugin.clevercloud.logs.CreateDrain
    apiToken: "{{ secret('CC_API_TOKEN') }}"
    organisationId: "{{ secret('CC_ORG_ID') }}"
    applicationId: "{{ secret('CC_APP_ID') }}"
    drainType: NEWRELIC
    url: https://log-api.newrelic.com/log/v1
    newRelicApiKey: "{{ secret('CC_NEWRELIC_API_KEY') }}"
    kind: LOG
```

Supported `drainType` values:

- `NEWRELIC` — requires `url` and `newRelicApiKey`; use `https://log-api.eu.newrelic.com/log/v1` for EU accounts
- `DATADOG` — requires `url`
- `ELASTICSEARCH` — requires `url`
- `RAW_HTTP`, `SYSLOG_TCP`, `SYSLOG_UDP` — generic syslog or HTTP; use these for OVHcloud (no dedicated drain type)

Use `logs.DeleteDrain` to remove a drain and `logs.ListDrains` to audit active forwarding.

## Trigger a flow when a log line matches a pattern

`LogPatternTrigger` polls application logs at each interval and fires when a line matches a regex. Use it to react to application errors, OOM kills, or deployment signals without polling from a separate flow.

```yaml
id: alert_on_error
namespace: company.team

triggers:
  - id: on_oom
    type: io.kestra.plugin.clevercloud.logs.LogPatternTrigger
    apiToken: "{{ secret('CC_API_TOKEN') }}"
    organisationId: "{{ secret('CC_ORG_ID') }}"
    applicationId: "{{ secret('CC_APP_ID') }}"
    pattern: "OutOfMemoryError|OOM killed"
    interval: PT2M
    limit: 500

tasks:
  - id: notify
    type: io.kestra.plugin.core.log.Log
    message: "OOM detected at {{ trigger.matchedAt }}: {{ trigger.matchedLine }}"
```

Available trigger outputs:

| Output | Description |
|--------|-------------|
| `trigger.matchedLine` | Full text of the matched log line |
| `trigger.matchedAt` | Timestamp of the matched log line |
| `trigger.severity` | Log severity level |
| `trigger.service` | Service that emitted the log |

When multiple lines match in the same poll, only the most recent fires the trigger.

Replace the `notify` task with your preferred alerting method — a Slack message, a PagerDuty call, or an email via `io.kestra.plugin.notifications.slack.SlackIncomingWebhook`.

## Manage organisation members

Add a member and react when the organisation's membership changes.

```yaml
id: onboard_member
namespace: company.team

inputs:
  - id: email
    type: STRING
  - id: role
    type: STRING
    defaults: DEVELOPER

tasks:
  - id: add_member
    type: io.kestra.plugin.clevercloud.organisations.AddMember
    apiToken: "{{ secret('CC_API_TOKEN') }}"
    organisationId: "{{ secret('CC_ORG_ID') }}"
    email: "{{ inputs.email }}"
    role: "{{ inputs.role }}"
```

Valid roles: `ADMIN`, `MANAGER`, `DEVELOPER`, `ACCOUNTING`, `READ_ONLY`.

To offboard, call `organisations.RemoveMember` with a `userId` retrieved from `organisations.ListMembers`.

`MemberChangeTrigger` fires when any member is added or removed. It uses the KV store to track membership between polls — the first evaluation always establishes the baseline without firing.
