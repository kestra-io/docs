---
title: "SSH Script: Automating Remote Commands with Orchestration"
description: "What an SSH script is, how to run commands and local scripts on remote hosts, where ad-hoc SSH automation breaks in production, and how to run it as a governed workflow."
metaTitle: "SSH Script: Run Remote Commands and Automate Them"
metaDescription: "How SSH scripts run commands and local scripts on remote hosts, why ad-hoc SSH automation breaks in production, and how to orchestrate it with retries and logs."
tag: "infrastructure"
date: 2026-11-25
slug: "ssh-script"
faq:
  - question: "What is an SSH script?"
    answer: "An SSH script is a sequence of commands executed on a remote server via the Secure Shell (SSH) protocol. It allows administrators and engineers to automate tasks, deploy applications, and manage infrastructure on distant machines securely, usually with SSH keys for authentication."
  - question: "Why are ad-hoc SSH scripts problematic in production?"
    answer: "Ad-hoc SSH scripts often lack reliable error handling, centralized logging, and proper secret management, making them difficult to debug, audit, and scale. They can also introduce security risks if authentication isn't managed properly, leading to operational fragility."
  - question: "How does Kestra improve SSH scripting?"
    answer: "Kestra replaces ad-hoc SSH scripts with declarative YAML workflows, with key-based authentication from Kestra secrets and retries declared on each task. Every run is recorded with its logs and outputs in one place, so a failed remote command is visible and can be retried or escalated."
  - question: "Can Kestra execute local scripts on remote machines via SSH?"
    answer: "Yes, Kestra runs commands on remote machines with the `io.kestra.plugin.fs.ssh.Command` task, and can upload a script first with `io.kestra.plugin.fs.sftp.Upload`. This allows you to manage script versions in Git and deploy them to remote targets as part of a larger, auditable workflow, ensuring consistency and control."
  - question: "What are the security benefits of using Kestra for SSH automation?"
    answer: "SSH private keys are stored as Kestra secrets (and, in Kestra Enterprise, can come from external secret managers), so they never appear in flow code. Every run is recorded with its logs and outputs; Kestra Enterprise adds RBAC on who can trigger or edit flows and audit logs."
  - question: "Is it possible to manage SSH authorized_keys with Kestra?"
    answer: "Yes, as a scheduled workflow: an `fs.ssh.Command` task reads each host's `authorized_keys`, a script compares it with an approved list kept in Git, and the flow alerts or opens a ticket on any difference. Kestra has no built-in key management; the logic lives in the flow."
  - question: "What are common use cases for SSH orchestration with Kestra?"
    answer: "Common use cases include automated patching and software deployment, configuration management, remote server health checks, data synchronization between distributed systems, and automating incident response runbooks. Kestra provides the control plane to orchestrate these tasks across diverse infrastructure."
---

> **TL;DR** — An SSH script runs commands or a local script on a remote server over an encrypted connection, usually with key-based authentication. It works well for one-off jobs but becomes fragile in production. Running the same commands as orchestrated tasks adds stored keys, retries, failure alerts, and a log of every run.

SSH scripts are how most teams run commands on remote servers: a patch, a service restart, a log collection, a deployment step. They are quick to write and need nothing but the [OpenSSH client](https://man.openbsd.org/ssh). The trouble starts when the same scripts run unattended, on many hosts, with nobody watching the terminal.

This article covers how SSH scripts work, where they break in production, and how to run remote commands as orchestrated workflows with Kestra.

## How SSH Scripts Work: The Fundamentals of Remote Execution

At its core, an SSH script uses the OpenSSH `ssh` client to establish a secure connection to a remote server and execute a command. The simplest form involves passing a command string directly:

```bash
ssh user@remote_host 'uptime'
```

This command connects to `remote_host` as `user`, executes the `uptime` command, prints the output to your local terminal, and closes the connection.

To run a more complex local script on a remote machine, you can redirect the script's content to the SSH client's standard input. The remote server then pipes this input to a shell for execution:

```bash
ssh user@remote_host 'bash -s' < local_script.sh
```

This method is powerful because it avoids the need to copy the script file to the remote host first. You can also pass arguments to the script:

```bash
ssh user@remote_host 'bash -s' -- "arg1" "arg2" < local_script.sh
```

For all this to work non-interactively, authentication must be automated. Instead of typing a password for every connection, SSH keys provide a secure and standard way to establish trust between machines. A public key is placed on the remote server in the [`~/.ssh/authorized_keys`](https://man.openbsd.org/sshd.8#AUTHORIZED_KEYS_FILE_FORMAT) file, while the corresponding private key stays on the client machine.

## The Limitations of Ad-Hoc SSH Scripting in Production

While effective for manual tasks and simple automation, ad-hoc SSH scripts quickly show their limitations in production environments.

*   **Fragile Authentication and Secret Management:** Hardcoding passwords or relying on interactive prompts is a non-starter for automation. Even with SSH keys, managing private keys across multiple scripts and machines becomes a security and operational burden.
*   **No Centralized Logging or Observability:** When a script fails, debugging involves manually connecting to the remote host and inspecting logs. There is no central place to see which scripts ran, when they failed, and why.
*   **Poor Error Handling and Retries:** A transient network issue or a temporary server failure will cause a simple script to fail. Implementing retry logic, backoffs, and conditional error handling in shell scripts is complex and often inconsistent.
*   **Lack of State and Dependency Management:** Scripts are typically stateless. Orchestrating a sequence of tasks, where one step depends on the output of another, requires writing complex wrapper scripts to manage state and dependencies, which are difficult to maintain.
*   **Security and Auditability Gaps:** Without a central control plane, it's difficult to enforce who can run which scripts on which servers. There is no audit trail to track changes, executions, and outcomes, which is a major compliance concern in regulated industries.

## Orchestrate Remote Commands with Kestra: A Declarative Approach

Kestra addresses the limitations of ad-hoc scripting by providing a structured, declarative framework for orchestrating remote commands. Instead of writing shell scripts to manage connections, Kestra uses native tasks that are configured with YAML.

The primary tool for this is the `io.kestra.plugin.fs.ssh.Command` task, which is part of the [Filesystem plugin](/plugins/plugin-fs). This task handles all the complexities of connecting to a remote host and executing commands securely.

Key benefits of this approach include:
*   **Secure Credential Management:** SSH private keys are managed as [Kestra secrets](/docs/concepts/secret) and accessed via expressions like `{{ secret('SSH_PRIVATE_KEY') }}`. Credentials are never exposed in logs or workflow code.
*   **Built-in Error Handling:** Kestra's [retry policies](/docs/workflow-components/retries) can be applied to any SSH task, automatically re-running a command on failure with configurable delays and backoffs.
*   **Centralized Observability:** Every task execution is logged, including its outputs, metrics, and duration, and the UI shows each run step by step. Kestra Enterprise adds RBAC on who can run or edit flows, and audit logs.
*   **Declarative and Version-Controlled:** Workflows are defined as YAML files that can be stored in Git. This enables code reviews, versioning, and CI/CD practices for your automation.

### Example: Patching a Remote Server with Kestra

This workflow automates a common administrative task: updating packages on a remote Debian-based server and checking that a critical service is still running. It runs every Sunday night, connects with an SSH key stored as a Kestra secret, and sends a Slack notification if any step fails.

```yaml
id: remote-server-patching
namespace: company.team.infra

triggers:
  - id: weekly_patch_window
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 2 * * 0"

tasks:
  - id: apply_updates
    type: io.kestra.plugin.fs.ssh.Command
    host: your-server.example.com
    authMethod: PUBLIC_KEY
    username: admin
    privateKey: "{{ secret('REMOTE_SERVER_KEY') }}"
    commands:
      - sudo apt-get update && sudo DEBIAN_FRONTEND=noninteractive apt-get upgrade -y
    retry:
      type: constant
      maxAttempts: 3
      interval: PT1M

  - id: check_service_status
    type: io.kestra.plugin.fs.ssh.Command
    host: your-server.example.com
    authMethod: PUBLIC_KEY
    username: admin
    privateKey: "{{ secret('REMOTE_SERVER_KEY') }}"
    commands:
      - systemctl is-active --quiet my-app.service

  - id: log_success
    type: io.kestra.plugin.core.log.Log
    message: "Patching and service check completed on your-server.example.com"

errors:
  - id: send_failure_notification
    type: io.kestra.plugin.slack.notifications.SlackIncomingWebhook
    url: "{{ secret('SLACK_WEBHOOK_URL') }}"
    payload: |
      {"text": "Server patching failed for {{ flow.namespace }}.{{ flow.id }} (execution {{ execution.id }})."}
```

A few things are worth noticing in this example:
*   **Declarative Syntax:** The whole process is one YAML file. The `fs.ssh.Command` task opens the connection itself, so no shell wrapper around `ssh` is needed.
*   **Secret Management:** The SSH private key and Slack webhook URL are securely stored as secrets, not hardcoded in the workflow.
*   **Automatic Logging:** Kestra automatically captures the standard output and error streams from every command, making them available in the UI for debugging.
*   **Failure Notifications:** The `errors` block defines a task that only runs if a preceding task fails, ensuring that the operations team is immediately notified of any issues.

## Advanced SSH Orchestration Patterns in Kestra

Beyond single commands, Kestra can orchestrate more complex SSH-based automation patterns.

*   **Running Git-Versioned Scripts:** For complex logic, you can maintain your scripts in a Git repository. A Kestra workflow can [clone the repository](/blueprints/git-clone-run-repo-scripts), upload the desired script to the remote host using the `io.kestra.plugin.fs.sftp.Upload` task, and then execute it with `io.kestra.plugin.fs.ssh.Command`.
*   **Ensuring `authorized_keys` Compliance:** A scheduled workflow can connect to a fleet of servers, read each `authorized_keys` file, and compare it with an approved list stored in Git to detect [configuration drift](/resources/infrastructure/configuration-drift). Kestra has no built-in key management; this logic lives in the flow.
*   **Orchestrating Ansible:** While Kestra offers a native Ansible plugin, you can also orchestrate Ansible playbooks on remote hosts via SSH. This is a common pattern for teams looking to replace tools like [Ansible Tower](/resources/infrastructure/ansible-tower-alternatives) with a more universal orchestrator.
*   **Automated Maintenance:** You can implement complex maintenance tasks, such as a [guarded disk cleanup](/blueprints/ssh-disk-cleanup-maintenance) or a [VM patching process with approvals and rollback](/blueprints/ssh-patch-vm-approval-rollback), combining SSH commands with human validation steps.

## Where SSH Orchestration with Kestra Pays Off: Use Cases

By running remote commands as orchestrated tasks, you can build reliable, auditable automations for a wide range of use cases:

*   **Automated Software Deployment:** Push new application versions and run deployment scripts across your server fleet.
*   **Configuration Management:** Ensure servers are configured correctly and automatically remediate any detected drift.
*   **Remote Server Health Checks:** Schedule periodic checks to monitor disk space, CPU usage, and service status, triggering alerts when thresholds are breached.
*   **Data Synchronization:** Automate `rsync` or `scp` jobs to move data between distributed systems as part of a larger data pipeline.
*   **Incident Response:** Build automated [runbooks](/resources/infrastructure/runbook-automation-tools-2026) that execute diagnostic commands, collect logs, and perform remediation actions in response to alerts, accelerating [incident response automation](/resources/infrastructure/incident-response-automation).

## Related Concepts
- [Job Orchestration: Automating and Managing Complex Tasks](/resources/infrastructure/job-orchestration)
- [GitOps: Principles, Benefits, and Best Practices for Infrastructure Automation](/resources/infrastructure/gitops)
- [Kubernetes Job Orchestration: Managing Batch Workloads](/resources/infrastructure/kubernetes-job-orchestration)
- [Infrastructure Orchestration: Automating IT Operations](/resources/infrastructure/infrastructure-orchestration)

To go further, see how Kestra can [orchestrate your entire infrastructure from one control plane](/infra-automation).
