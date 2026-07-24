---
title: Trigger Kestra Flows from Splunk Alerts
h1: Trigger Kestra Flows from Splunk Alerts
icon: /src/contents/docs/icons/splunk.svg
stage: Intermediate
topics:
  - Integrations
editions: ["EE"]
description: Install the Kestra Add-on for Splunk and configure the Trigger Kestra Flow alert action to start Kestra flows from Splunk saved-search alerts using a Bearer API token.
---

The Kestra Add-on for Splunk adds a **Trigger Kestra Flow** alert action that starts Kestra flows when a saved search fires.

When an alert fires, the add-on calls the Kestra Executions API with a Bearer token, forwarding alert metadata and search results as flow inputs. No webhook URL required — the token is stored encrypted in Splunk's credential store.

This guide covers the Kestra-side setup: creating an API token, designing a receiving flow, and wiring up the alert action fields. For Splunk-side installation, see the [TA-kestra README](https://github.com/kestra-io/splunk-addon).

## Prerequisites

- Kestra Enterprise Edition with at least one namespace and a service account or user API token with `EXECUTION:CREATE` permission on the target namespace.
- Splunk Enterprise or Splunk Cloud with the TA-kestra add-on installed. See [Installation](https://github.com/kestra-io/splunk-addon#installation) in the add-on README.
- A saved search with a trigger condition. Any search that produces results can be used as a trigger.

## Step 1: Create a Kestra API token

The add-on authenticates with Kestra using a Bearer token stored encrypted in Splunk's credential store. Create a dedicated token for the integration.

In the Kestra UI, open **Administration → API Tokens** and create a new token scoped to the service account or user that has `EXECUTION:CREATE` on the target namespace.

Copy the full token value now — it is shown only once.

See [API Tokens](../../07.enterprise/03.auth/api-tokens/index.md) for token creation and rotation details.

## Step 2: Configure a Kestra connection in the add-on

The add-on stores Kestra credentials as named connections. Each connection holds a base URL and an API token. Alert actions reference a connection by name, so you configure the URL and token once per Kestra instance.

In Splunk Web, go to **Apps → Kestra Add-on for Splunk → Configuration → Kestra Connections → Add** and fill in:

| Field | Value |
|-------|-------|
| Name | A unique identifier for this connection, e.g. `prod_kestra`. |
| Kestra URL | Base URL of your instance, e.g. `https://kestra.corp.example.com` (no trailing slash). |
| API token | The token from Step 1. Splunk stores it encrypted in `storage/passwords` — it is never written in plaintext to a `.conf` file or logged. |

## Step 3: Design the receiving flow

Create a flow in the target namespace with inputs that match what the alert action will send.

All flow inputs from the alert action are optional at the Kestra API level, so declare them with `required: false` unless you want Kestra to reject executions that omit them.

```yaml
id: splunk-alert-handler
namespace: company.ops

inputs:
  # From "Input mapping" — map any result field or alert token
  - id: severity
    type: STRING
    required: false

  - id: src_host
    type: STRING
    required: false

  # From "Send alert metadata" (enabled by default)
  - id: splunk_search_name
    type: STRING
    required: false

  - id: splunk_sid
    type: STRING
    required: false

  - id: splunk_owner
    type: STRING
    required: false

  - id: splunk_app
    type: STRING
    required: false

  - id: splunk_results_link
    type: STRING
    required: false

  - id: splunk_trigger_time
    type: STRING
    required: false

  # From "Attach results file" (enabled by default)
  - id: results
    type: FILE
    required: false

tasks:
  - id: triage
    type: io.kestra.plugin.core.log.Log
    message: |
      Alert '{{ inputs.splunk_search_name }}' fired at {{ inputs.splunk_trigger_time }}.
      Severity: {{ inputs.severity }} — host: {{ inputs.src_host }}
```

### What the add-on sends

The alert action has three input sources, all controlled by the alert configuration:

**Alert metadata** (sent when **Send alert metadata** is on, which is the default):

| Input name | Splunk source |
|------------|---------------|
| `splunk_search_name` | Saved search name |
| `splunk_sid` | Search ID |
| `splunk_app` | Splunk app context |
| `splunk_owner` | Alert owner |
| `splunk_results_link` | Link to search results in Splunk |
| `splunk_trigger_time` | Alert trigger timestamp |

**Input mapping** (free-form, one `flow_input=$token$` per line):

Map any Splunk alert token or search result field to a named flow input. Splunk resolves the tokens before passing them to the handler.

```
severity=$result.severity$
src_host=$result.src_host$
search_name=$name$
```

`$result.fieldname$` picks the value from the first matching result row. `$name$` is the saved search name (same as `splunk_search_name`, useful when you want a shorter input name).

**Results file** (sent when **Attach results file** is on, which is the default):

The full search results CSV is attached as a `FILE` input named `results`. Declare it as `type: FILE` in your flow if you want to process it.

## Step 4: Attach the alert action

Open the saved search in Splunk, go to **Edit → Edit Alert**, and under **Trigger Actions** click **+ Add Actions → Trigger Kestra Flow**.

Fill in the action fields:

| Field | Description |
|-------|-------------|
| Kestra connection | The connection from Step 2 (URL + API token). |
| Tenant | Kestra tenant ID. Use `main` for single-tenant instances. |
| Namespace | Namespace of the flow, e.g. `company.ops`. |
| Flow ID | ID of the flow, e.g. `splunk-alert-handler`. |
| Attach results file | Attaches the search results CSV as a `FILE` input named `results`. On by default. |
| Send alert metadata | Sends alert metadata as `splunk_*` inputs. On by default. |
| Input mapping | One `flow_input=$token$` per line. Leave blank if you only need metadata and the results file. |

## Step 5: Verify the integration

When the alert fires, the add-on logs the created execution ID and a link to it in the alert action log:

```
Kestra execution created: id=<execution-id> url=https://kestra.corp.example.com/ui/main/executions/company.ops/splunk-alert-handler/<execution-id>
```

Open the execution in Kestra to confirm the inputs arrived and the flow completed.

If the execution is not created, check the modalert log in Splunk at `$SPLUNK_HOME/var/log/splunk/trigger_kestra_flow_modalert.log`. Common errors and their fixes:

| Error in log | Fix |
|---|---|
| `connection 'x' does not exist` | The connection name in the alert action does not match any connection on the Configuration page. |
| `missing a URL or API token` | Edit the connection on the Configuration page and re-enter the API token. |
| `HTTP 401` | The API token is expired or revoked. Rotate it in Kestra and update the Splunk connection. |
| `HTTP 404` | The namespace or flow ID does not exist. Check the tenant, namespace, and flow ID fields. |
| `HTTP 422` | The flow rejected a required input or an input type mismatch. Check the flow's input declarations. |

The add-on makes up to three attempts on 5xx responses and transient network errors, with backoff between retries. The API token is never written to logs.

## Related

- [TA-kestra add-on source and installation](https://github.com/kestra-io/splunk-addon)
- [Kestra API Tokens](../../07.enterprise/03.auth/api-tokens/index.md)
- [Trigger flows via the Kestra API](./api/index.md)
- [Log Shipper](../../07.enterprise/02.governance/logshipper/index.md) — the reverse direction: ship Kestra logs into Splunk
