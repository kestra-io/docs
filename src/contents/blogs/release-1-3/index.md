---
title: "Kestra 1.3 introduces the Kestra CLI, Kill Switch, Credentials, and New Plugins"
description: "Kestra 1.3 delivers a Go-based CLI, enterprise-grade Kill Switch and Credentials for secure auth, improved UI/UX for plugin defaults, and new infrastructure plugins."
date: 2026-03-03T17:00:00
category: News & Product Updates
authors:
  - name: "Benoit Pimpaud"
    image: bpimpaud
image: /blogs/release-1-3.jpg
---
Kestra 1.3 focuses on developer automation, safer production operations, and centralized authentication. This release introduces the new Kestra CLI for managing flows and executions from the terminal, along with enterprise-grade Kill Switch controls and reusable Credentials for OAuth-based APIs.

We've also improved namespace configuration workflows with a dedicated Plugin Defaults UI, shipped a refreshed GitHub Action based on the Kestra CLI, and added new infrastructure and policy plugins.

The table below highlights the key features of this release.

| Feature | Description | Edition |
|---|---|---|
| Kill Switch | UI-based control to stop or contain problematic executions | Enterprise Edition |
| Credentials | Centralized server-to-server OAuth2 credentials with token minting and refresh | Enterprise Edition |
| Kestra CLI | Go-based CLI to manage flows, executions, namespaces, and namespace files | All Editions |
| Plugin Defaults UI | Manage plugin defaults directly from the namespace page | Enterprise Edition |
| New GitHub Action | CLI-based action to deploy, validate, and trigger flows | All Editions |
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

Credentials provide reusable server-to-server authentication for flows. You configure authentication once and reference it in workflows with a simple expression, while Kestra handles token management behind the scenes.

Credentials are available in the **Enterprise Edition** and can be created at the **tenant** or **namespace** scope. During setup, you can test token retrieval directly from the UI. Sensitive values (client secrets, private keys, certificates) are always stored as [Secrets](../04.secret/index.md).

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

Supported credential types include OAuth2 `client_credentials`, OAuth2 JWT Bearer (`jwt_bearer`), OAuth2 `private_key_jwt`, and GitHub App. Tokens are retrieved during task execution, never persisted, and can be cached in memory based on the credential configuration.

## Plugin Defaults UI (Namespace)

Plugin defaults are essential for consistent configurations, but managing them only in YAML makes them harder to discover, edit, and share across teams. This often slows down onboarding and pushes configuration drift into production.

Kestra 1.3 adds a dedicated Plugin Defaults UI on the namespace page so you can fully manage these settings from the UI while keeping them versionable. Create new defaults with an **Add plugin default** button, select the plugin from a dropdown, and fill a form that clearly separates required and optional fields, with the option to switch to YAML at any time.

You can also import plugin defaults from YAML to bootstrap or migrate from OSS, and export all defaults to YAML for Git, Terraform, or other IaC workflows.

## Kestra CLI

Teams often need to automate flow deployment and operations across multiple environments, but relying only on the UI or custom API scripts is error-prone and inconsistent. A dedicated CLI makes those workflows repeatable in local and CI environments.

Kestra 1.3 introduces a new Go-based CLI to manage flows, executions, namespaces, and namespace files directly from the terminal. It complements the UI and API, making automation, CI/CD, and multi-environment operations much easier.

Get started by building the binary and configuring your first context:

```bash
go build -o kestractl
kestractl config add default http://localhost:8080 main --token YOUR_TOKEN --default
```

Key capabilities include:
- **Flows**: deploy and validate flows from files or folders
- **Executions**: run, wait, and terminate executions from the CLI
- **Namespaces**: list and filter namespaces across tenants
- **Namespace Files**: upload, list, and delete files with recursive support

Configuration follows a predictable precedence model: **flags** override **env vars**, which override the **config file**, then **defaults**. This makes it easy to use `kestractl` locally and in CI pipelines.

## GitHub Action

Teams often rely on custom scripts to deploy and validate flows in CI, which leads to inconsistent pipelines and hard-to-maintain automation. A dedicated action makes these workflows repeatable across repositories.

Kestra 1.3 introduces a refreshed GitHub Action built on the Kestra CLI, so you can reuse the same commands in CI that you run locally. It supports:
- **Deploy namespace files**
- **Deploy flows to multiple namespaces**
- **Validate flows**
- **Trigger a deployed flow**

## Plugins


### Infrastructure

- **Canonical MAAS** – Automate bare-metal provisioning and lifecycle management at scale.
- **NetBox** – Integrate your infrastructure source of truth (DCIM/IPAM) into orchestration workflows.
- **Nutanix** – Manage VM lifecycle on hyper-converged infrastructure.
- **Open Policy Agent (OPA)** – Add policy-as-code checks for governance and compliance.

### Storage

- [SeaweedFS Storage](https://github.com/kestra-io/storage-seaweedfs/releases/tag/v1.0.0) – Store namespace files and artifacts on SeaweedFS.


## Next Steps

This post highlighted the new features and enhancements introduced in Kestra 1.3. Which updates are most exciting to you? Are there additional capabilities you'd like to see in future releases? We welcome your feedback.

If you have any questions, reach out via [Slack](/slack) or open [a GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us a [GitHub star](https://github.com/kestra-io/kestra) and join [the community](/slack).
