---
title: "Kestra MCP Server: Let Any Coding Assistant Run Your Workflows, With Approvals Built In"
description: "Kestra 2.1 adds the Kestra MCP Server and the Approval task. In this run, Claude Code starts a flow through the MCP server, a manager approves it in Slack, and Kestra creates, tests, and deletes a Proxmox sandbox."
date: 2026-12-03T10:00:00
category: Solutions
author:
  name: Martin-Pierre Roset
  linkedin: https://www.linkedin.com/in/martin-pierre-roset/
  image: "mproset"
image: ./claude-execute-flow.webp
---

Kestra has worked with AI agents since 2.0, when [MCP Flows](/blogs/2026-09-04-kestra-2-0-flows-as-agent-tools) turned any flow into a tool your agents can call. [Kestra 2.1](/blogs/release-2-1) opens up the rest of the platform. The [Kestra MCP Server](/docs/develop-with-ai/kestra-mcp-server) gives Claude Code, Codex, Cursor, or any MCP client Kestra's own operations as tools, and the [Approval](/docs/workflow-components/approvals) task gives a flow a real yes or no from a person. Together, an agent starts the work and a person makes the decision.

This post covers what each feature does, then shows them in one run: Claude Code gets a Proxmox VE sandbox to test an app, a manager approves it in Slack, and the sandbox is deleted with a usage report. The flow is a [blueprint](/blueprints/proxmox-app-sandbox-with-approval) you can import.

![Coding agents such as Claude Code or Codex send tool calls to the MCP Server inside Kestra, which starts a flow. The flow waits for an approver, creates a sandbox through Kestra plugins on any system, such as Proxmox, VMware, Nutanix, AWS, Kubernetes, or Ansible, deploys and tests the app, then reports and deletes it, and the URL, test results, and usage go back to Claude Code](./mcp-server-architecture.webp)

## What the Kestra MCP Server gives an agent

MCP Flows let an agent call the flows you chose to expose. The MCP Server goes further and exposes Kestra itself, with the same tools as the AI Copilot in the Kestra UI. From a chat, an agent can:

- read and edit flows, and draft a new flow for you to review before anything is saved
- start, restart, replay, pause, resume, or kill executions
- read execution details, outputs, and logs, and search logs across executions
- manage namespace files and KV entries

In the Enterprise Edition, agents can also work with apps, test suites, groups, and announcement banners, for 78 tools in all. The AI Copilot uses the same tools from inside Kestra, and in its Edit and Plan modes it asks you to confirm before it changes anything.

The tools carry hints that tell the client whether a call only reads, makes changes, or deletes or starts something, so your client can ask before acting. The server is off until you turn it on, every request is authenticated, and you can limit it to some tenants and choose the sign-in methods it accepts, OAuth included.

You can also give every connected agent standing instructions. In this example, they point the agent at one flow and set the rules for using it:

```yaml
kestra:
  mcp:
    platform-server:
      enabled: true
      instructions: >-
        To test an application in a real environment, run the flow
        dev.sandbox/test_app_in_sandbox with the repository URL and branch.
        The flow waits for a human approval before it creates anything; you
        cannot approve it yourself. Report the app URL, the smoke test results
        and the sandbox usage to the user. To end a sandbox early, resume the
        paused execution so the flow deletes it. Never kill the execution: a
        kill skips the cleanup and leaves the sandbox running.
```

Connecting Claude Code is one command:

```bash
claude mcp add --transport http kestra https://kestra.example.com/api/v1/mcp --header "Authorization: Basic <credentials>"
```

## What the Approval task adds

Before 2.1, asking a person for a decision meant a `Pause` task, and the only way to say no was to kill the execution. The Approval task waits for a reviewer, then runs `onApprove` or `onDeny`. Reviewers can leave a comment and fill in fields, a request can approve itself when a condition is met, and it can expire after a timeout. An `onWait` branch runs before the pause, which is where you notify the approver.

The MCP server has no tool to approve a request, and `resume_execution` refuses an execution that waits on an Approval task. An agent can start a flow that needs approval, but it cannot approve it.

## One run, end to end

The app is Shortly, a FastAPI link shortener built with Claude and pushed to GitHub. In the repository folder, the prompt was:

> I vibe coded this link shortener with you. Before I share it, test it on a real environment: deploy the main branch, run the smoke tests, and give me the URL. Keep it up for 30 minutes.

Claude checked that `main` was pushed, then called `execute_flow` with the repository, the branch, who asked, and a 30-minute lifetime.

![Claude Code calling the execute_flow and read_execution tools of the Kestra MCP Server, with the flow inputs and the execution returned](./claude-execute-flow.webp)

The Approval task posted the request to Slack before pausing.

![The Slack sandbox request from Kestra, with the repository, the branch, a 30-minute lifetime, Requested through Kestra MCP server, and a Review in Kestra button](./slack-sandbox-request.webp)

Claude reported what it had started and that it could not approve the request itself. In Kestra, the execution carries the `system.from: mcp` label and waits for a review.

![Claude Code explaining that the sandbox flow is paused on approve_sandbox, that a request went to the manager's Slack channel, and what the flow does after approval](./claude-waits-for-approval.webp)

![The Kestra execution paused on approve_sandbox with the label system.from mcp and the message This execution is waiting for a review](./kestra-waiting-for-review.webp)

In this run I was both the developer and the approver, so I approved from the Claude session, and Claude recorded my decision through the Kestra API. In a team, the approver is someone else, deciding in Kestra or from the Slack link.

After approval, Kestra cloned a container from a template on Proxmox VE, configured and started it, and ran an Ansible playbook that deployed the branch and ran the smoke tests. Each Ansible task shows up as its own task run.

![The Kestra Gantt view with the Proxmox list, clone, configure and start tasks, then each Ansible task of the deploy as its own row](./kestra-gantt.webp)

![Proxmox VE 9.3 showing container 100 sandbox-100 running, with the kestra and sandbox tags, notes linking the execution, and the clone and start tasks run by kestra@pve](./proxmox-sandbox-running.webp)

Claude read the outputs, checked the public URL itself, and reported back. The sandbox was ready 27 seconds after the approval.

![Claude Code reporting that Shortly is deployed at a public trycloudflare.com URL, the health check returning HTTP 200, and a table of the five smoke tests, all passed](./claude-app-url.webp)

## What the sandbox consumed

When asked to tear down, Claude called `resume_execution`, which ends the pause and runs the flow's `finally` block. Killing the execution would skip that block and leave the container running, which is why the instructions above forbid it.

![Claude Code calling resume_execution and read_execution_outputs on the Kestra MCP Server, with the usage block in the outputs](./claude-resume-and-outputs.webp)

Before deleting the container, the flow measures it through the Proxmox API: lifetime, peak CPU and memory, network, and an estimated cost from internal rates. Claude, Slack, and Kestra all get the same numbers.

![Claude Code's usage report for sandbox-100: 427 seconds of lifetime, ready 27 seconds after approval, 2 vCPUs and 1024 MB, 86 MB peak memory, 17 percent peak CPU, 26.1 MB in and 0.3 MB out, and an estimated cost of $0.0064](./claude-usage-report.webp)

![The Slack Sandbox deleted message: 7 minutes of lifetime, ready 27 seconds after approval, 86 MB of 1024 MB peak memory, and an estimated cost of $0.0064](./slack-usage-summary.webp)

In Kestra, the usage is a flow output that other flows and agents can read, and a set of metrics on the execution.

![The usage flow output in the Kestra Input/Output tab, with the sandbox name, vCPUs, memory limit, lifetime, ready time, peak memory and CPU, network, and estimated cost](./kestra-usage-output.webp)

![The Kestra Metrics tab with sandbox.estimated_cost_usd, sandbox.lifetime, sandbox.network_in_mb, sandbox.peak_memory_mb and sandbox.ready_after_approval](./kestra-usage-metrics.webp)

Proxmox keeps the full life of the sandbox in its task log, every step run by the `kestra@pve` token.

![Proxmox VE after teardown with only the app-template container left and the task log showing clone, start, stop and destroy, all by kestra@pve](./proxmox-after-teardown.webp)

## The blueprint

The flow is available as the [Approved Proxmox VE Sandbox for AI Agents with Usage Report](/blueprints/proxmox-app-sandbox-with-approval) blueprint. It includes the Approval task with the Slack request, the Proxmox clone and teardown, the Ansible playbook inline, the smoke tests, and the usage report. Set six secrets for Proxmox, SSH, and Slack, adjust the template ID and network, and point your agent at it.

## With the Enterprise Edition

The open-source edition runs everything shown above. The Enterprise Edition adds what a team needs before agents touch shared infrastructure.

### Agents act as the person behind them

Each MCP call runs with that person's permissions, so an agent only sees and does what they can. With RBAC on namespaces, you can let developers run the sandbox flow and nothing else. Every change an agent makes shows up in the [audit logs](/docs/enterprise/governance/audit-logs) under the person's name.

### Approvals go to the right people

You can assign a request to specific people or groups, so a developer cannot approve their own sandbox, and give it a title. The Approvals page lists every pending and resolved request, reviewers and requesters get notifications, several approvals can chain into one multi-step sign-off, and reviewers can decide from an App without opening Kestra. See [Approvals in Kestra Enterprise](/docs/enterprise/governance/approvals).

### The same flow runs on VMware or Nutanix

If your sandboxes live on VMware vSphere or Nutanix AHV, replace the four Proxmox tasks with the Enterprise plugins. The approval, the playbook, the usage report, and the MCP side stay the same.

| Step | Proxmox | VMware vCenter | Nutanix AHV |
|---|---|---|---|
| Create | `proxmox.container.Clone` | [`vcenter.CloneTemplate`](/plugins/plugin-ee-vmware) | [`ahv.CloneTemplate`](/plugins/plugin-ee-nutanix) |
| Start | `proxmox.container.Start` | `vcenter.StartVm` | `ahv.StartVm` |
| Stop | `proxmox.container.Stop` | `vcenter.StopVm` | `ahv.StopVm` |
| Delete | `proxmox.container.Delete` | `vcenter.DeleteVm` | `ahv.DeleteVm` |

### Execution stays inside your network

[Worker groups](/docs/enterprise/scalability/worker-group) run the Ansible task on workers next to the hypervisor, and secrets can come from your existing vault instead of Kestra's own store.

## How this lab runs

To keep the demo on a laptop, the setup is smaller than a production one. Proxmox VE 9.3 for arm64 runs in a QEMU virtual machine, and the sandboxes are LXC containers on LVM-thin storage. Ansible reaches them through the Proxmox node as an SSH jump host. Kestra is a 2.1 build reachable through a Cloudflare tunnel, each sandbox publishes its app through its own tunnel, and the Slack messages go to a test workspace.

## Try it

- Read what else is in [Kestra 2.1](/blogs/release-2-1).
- Turn on the [Kestra MCP Server](/docs/develop-with-ai/kestra-mcp-server) and connect Claude Code, Cursor, or another MCP client.
- Import the [Proxmox sandbox blueprint](/blueprints/proxmox-app-sandbox-with-approval) and point it at your template and network.

If you build something with it, tell us in the [Kestra community on Slack](/slack).
