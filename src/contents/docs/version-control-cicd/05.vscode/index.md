---
title: "Kestra VS Code Extension: Edit, Validate, and Run Flows"
h1: Edit, Validate, and Run Flows in VS Code
sidebarTitle: VS Code Extension
icon: /src/contents/docs/icons/dev.svg
description: Install the Kestra VS Code extension to get instance-aware schema validation, Pebble autocompletion, topology preview, and run-from-editor with live log streaming.
---

The Kestra VS Code extension connects your editor to a Kestra instance for instance-aware autocompletion, inline validation, topology preview, and flow execution.

## Prerequisites

- VS Code with the [Red Hat YAML extension](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml) installed — the Kestra extension depends on it for YAML schema support.
- A running Kestra instance reachable from your machine.

## Installation

Install the extension from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=kestra-io.kestra) or by searching for **Kestra** in the Extensions panel.

## Setup

Open VS Code settings with `Cmd+,` (macOS) or `Ctrl+,` (Windows/Linux), search for **kestra**, and set your instance URL. Alternatively, add the following directly to your `settings.json`:

```json
"kestra.api.url": "http://localhost:8080/api/v1"
```

For multi-tenant instances, also set the tenant:

```json
"kestra.api.tenant": "main"
```

On Kestra Cloud, your tenant ID is the path segment immediately after `app.kestra.io/` in the URL. On self-hosted multi-tenant instances, the tenant ID is set by your administrator.

### Authentication

On a secured instance, the extension prompts for credentials on the first request. It accepts three credential types:

- **Basic auth** — your Kestra username and password.
- **API token** — an [Enterprise Edition API token](../../../07.enterprise/03.auth/api-tokens/index.md) sent as a Bearer token. Recommended for non-interactive environments.
- **JWT session token** — a legacy token obtained from a browser session.

Use the **Kestra: Sign in** command to set or change credentials, and **Kestra: Sign out** to clear them.

## Features

### Schema and autocompletion

The extension downloads the flow schema from the configured instance (`/plugins/schemas/flow`), so autocompletion and structural validation reflect the plugin versions actually installed — not a generic all-plugins schema. A property valid in `latest` but absent on your instance is flagged correctly. The schema is cached per instance and refreshed automatically when the URL or tenant setting changes. Use the **Download Kestra schema** command to force a manual refresh, for example after installing a new plugin.

The schema applies to any YAML file detected as a flow (one that defines `id`, `namespace`, and either `tasks` or `triggers`). To restrict it to files under a specific directory, set `kestra.schema.match-path` to a regex substring that matches the path:

```json
"kestra.schema.match-path": "_flows"
```

This matches any file whose path contains `_flows`, such as `/workspace/_flows/my_flow.yaml`. The value is tested as a regex, so characters like `.` and `*` carry regex meaning.

In addition to structural schema validation, the extension provides:

- **Live validation** — calls the instance's `validate` endpoint on each edit (500 ms debounce) and surfaces errors, warnings, and deprecated property paths as VS Code diagnostics.
- **`{{ }}` Pebble autocompletion** — context variables, functions, filters, and the flow's own input IDs and task IDs.
- **Missing required fields** — inline suggestions for properties a task still needs.

### Topology preview

Open a flow file and run **Kestra: Preview flow topology** from the command palette, or click the graph button in the editor title bar. The topology panel opens beside the editor and shows the flow graph the connected instance generates from the current buffer. The graph updates as you type (600 ms debounce).

- Clicking a task node in the topology panel jumps to that task's YAML definition in the editor.
- The rotate button in the panel toolbar flips the layout between vertical and horizontal.
- While a run is active, task nodes update in real time with their live execution state.

If the instance is unreachable or the flow YAML is invalid, the panel displays a notice and preserves the last valid graph so intermediate edits don't blank the view.

### Documentation panel

Run **Open Kestra documentation** from the command palette to open the Kestra docs and plugin reference beside the editor. The panel follows your cursor: moving it to a task type shows that plugin's documentation, properties, examples, and outputs. The content is versioned to the connected instance.

### Run from editor

Open a flow file and run **Kestra: Save and run flow** from the command palette, the play button in the editor title bar, or press `Ctrl+Alt+R` (`Cmd+Alt+R` on macOS).

The extension performs these steps:

1. Validates the flow against the instance's `validate` endpoint.
2. Deploys the current editor buffer to the instance.
3. If the flow declares inputs, opens an input form in the run panel (or prompts sequentially in the log channel when `kestra.run.output` is `logs`).
4. Starts the execution and streams logs with a link to the execution page.

By default, the run output opens in a styled webview panel that shows a status badge, a log-level filter, and collapsible per-task logs. To use a native VS Code output channel instead, set:

```json
"kestra.run.output": "logs"
```

To save the current buffer to the instance without starting an execution, run **Kestra: Save flow to Kestra** (the save button in the editor title bar).

## Configuration reference

| Setting | Type | Default | Description |
| --- | --- | --- | --- |
| `kestra.api.url` | string | — | URL of the Kestra API, e.g. `http://localhost:8080/api/v1`. |
| `kestra.api.tenant` | string | — | Tenant ID for multi-tenant instances. Leave empty for single-tenant deployments. |
| `kestra.run.output` | string | `panel` | Where to display run output: `panel` (styled webview) or `logs` (native output channel). |
| `kestra.run.logLevel` | string | `INFO` | Minimum log level streamed during a run. Options: `TRACE`, `DEBUG`, `INFO`, `WARN`, `ERROR`. |
| `kestra.schema.match-path` | string | — | Regex substring restricting which YAML files receive the Kestra schema. When unset, the schema applies to any file detected as a flow. |

## Troubleshooting

**Schema does not load or autocompletion is missing**

Check that `kestra.api.url` is set to the correct API root (include `/api/v1`). Open the command palette and run **Download Kestra schema** to trigger a fresh download and see whether an error is reported. Also confirm the Red Hat YAML extension is installed and enabled.

**Sign in fails or the instance rejects requests**

Verify that the credential type matches your instance. Open source instances accept only basic auth. Enterprise Edition instances also accept API tokens — generate one from your user profile in the Kestra UI, then paste it when the extension prompts for a password.

**Topology panel shows a notice instead of the graph**

This means the extension could not reach the instance or the flow YAML is not yet valid. Check the instance URL and your sign-in state. The panel preserves the last valid graph through intermediate edit states, so the notice only appears when no valid graph has been generated for the current file.

**Run fails at the validate step**

Validation errors appear in the run panel or log channel. Fix the reported constraint violations in the flow YAML and retry. If the validate endpoint itself is unreachable, the extension falls through to the deploy step and surfaces any deploy error instead.

## Next steps

- [Flows](../../05.workflow-components/01.flow/index.md) — flow structure, tasks, triggers, and inputs reference.
- [Blueprints](/blueprints) — ready-to-use flow examples you can copy into the editor.
- [Version control with Git](../04.git/index.md) — push flows to a Git repository from Kestra and integrate with CI/CD pipelines.
