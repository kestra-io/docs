---
title: "Terraform Drift Detection: How to Find and Fix Drift Automatically"
description: "Terraform drift can lead to security vulnerabilities and operational chaos. Understand what causes drift, how to detect it, and how Kestra orchestrates automated checks to keep your infrastructure in sync."
metaTitle: "Terraform Drift Detection: Native Commands & Automation"
metaDescription: "How Terraform detects drift with plan -refresh-only and -detailed-exitcode, which tools help, and how to run a scheduled drift check that alerts your team."
tag: "infrastructure"
date: 2026-10-23
slug: "terraform-drift-detection"
faq:
  - question: "What is Terraform drift?"
    answer: "Terraform drift occurs when the actual state of your cloud infrastructure deviates from the desired state defined in your Terraform configuration files. This can happen due to manual changes, out-of-band updates, or changes made by other automated systems, leading to inconsistencies and potential risks."
  - question: "Why is infrastructure drift a problem?"
    answer: "Unmanaged infrastructure drift introduces significant risks, including security vulnerabilities from unapproved changes, operational instability due to unknown configurations, and compliance violations. It also erodes the benefits of Infrastructure-as-Code (IaC), making infrastructure less predictable and harder to manage."
  - question: "How does Terraform detect drift natively?"
    answer: "Terraform detects drift using the `terraform plan` command. During a plan, Terraform refreshes the state by reading the real resources from the provider APIs, then compares them with the configuration. `terraform plan -refresh-only` reports only the changes made outside Terraform, and `-detailed-exitcode` returns exit code 2 when there is a difference, which makes it easy to automate."
  - question: "What tools can I use for Terraform drift detection?"
    answer: "The Terraform CLI itself is enough for managed resources. HCP Terraform offers health assessments that run drift detection on workspaces. For resources created outside Terraform, `driftctl` scanned cloud accounts but is now in maintenance mode. Orchestrators like Kestra schedule the checks, collect the results, and route alerts."
  - question: "How can Kestra automate Terraform drift detection?"
    answer: "Kestra can orchestrate automated Terraform drift detection by scheduling `terraform plan` commands, pulling code from Git repositories, and reading the exit code of `terraform plan -detailed-exitcode` (2 means drift). It can then send alerts, open tickets, or start a remediation workflow with an approval step, and it keeps the history of every check."
  - question: "Can Terraform drift be prevented?"
    answer: "While completely preventing drift is challenging, its impact can be minimized through strict GitOps practices, limiting direct console access, and enforcing change management policies. Scheduled drift detection then catches what still slips through."
  - question: "What is the difference between managed and unmanaged drift?"
    answer: "Managed drift refers to changes made to resources that are still tracked by Terraform but have diverged from the configuration. Unmanaged drift occurs when resources exist in the cloud but are not defined in Terraform, or when Terraform-managed resources are deleted out-of-band. Both types compromise the integrity of your IaC."
---

> **TL;DR** — Terraform drift is any difference between your Terraform configuration and the resources actually running, usually caused by manual or out-of-band changes. `terraform plan -refresh-only -detailed-exitcode` detects it for managed resources. Running that check on a schedule, with alerts and a recorded history, turns drift from a surprise into a routine ticket.

Infrastructure-as-Code (IaC) promises consistent, predictable environments, but the reality often involves unexpected deviations. These inconsistencies, known as Terraform drift, occur when your live infrastructure no longer matches the state defined in your Terraform configurations. Whether it's a manual change, an emergency fix, or an update from another automated system, drift erodes the reliability and security benefits of IaC.

This guide explains what Terraform drift is, why it matters, how Terraform detects it natively, and how to run drift detection automatically with Kestra.

## Understanding Terraform Drift and Its Impact

At its core, drift represents a loss of control and visibility over your infrastructure. When the code is no longer the single source of truth, managing infrastructure becomes reactive and risky.

### What is Terraform Drift?

Terraform drift is any discrepancy between the actual state of your infrastructure (e.g., resources in AWS, GCP, or Azure) and the state that Terraform expects based on your configuration files (`.tf`) and state file (`.tfstate`).

This divergence can happen for several reasons:
*   **Manual Changes:** An engineer makes a quick change directly in the cloud provider's console to resolve an incident.
*   **Out-of-Band Automation:** Another system, like a security script or a different IaC tool, modifies a resource that Terraform manages.
*   **Human Error:** A resource is deleted or modified accidentally outside of the standard Terraform workflow.
*   **Resource Decay:** Cloud providers sometimes make automatic changes to resources, such as updating a managed database version, which may not be reflected in your code.

Understanding the principles of [Infrastructure-as-Code](/resources/infrastructure/everything-as-code) explains why drift matters so much.

### Why Unmanaged Drift is a Risk

Ignoring drift isn't an option. The consequences can be severe:
*   **Security Vulnerabilities:** Unapproved changes can create security holes, such as opening a firewall port or misconfiguring IAM permissions, exposing your systems to attack.
*   **Operational Instability:** When the live environment is unknown, future Terraform runs can have unpredictable and potentially destructive outcomes. An `apply` might overwrite a critical manual fix or fail entirely.
*   **Compliance Gaps:** In regulated industries, auditors expect changes to go through an approved process. Undetected drift makes it hard to show that the running infrastructure matches what was approved.
*   **Erosion of IaC Benefits:** The core value of IaC (predictability, repeatability, and auditability) is lost. Your infrastructure reverts to a state of undocumented, manual configuration.

## How Terraform Detects Drift Natively

Terraform provides built-in commands to identify drift, forming the foundation of any detection strategy. The process relies on comparing three sources of information: your code, the state file, and the real-world infrastructure.

### How `terraform plan` Finds Drift

When you run `terraform plan`, Terraform:
1.  **Reads the configuration:** it parses your `.tf` files to build the desired state.
2.  **Reads the state:** it loads the state file, which records the resources Terraform last created or modified.
3.  **Refreshes the state:** it queries the provider APIs for the current attributes of every resource in the state.
4.  **Compares and plans:** it shows the differences as a plan of resources to create, update, or destroy.

A normal plan mixes two things: changes you made in code and changes made outside Terraform. To see only drift, use [`terraform plan -refresh-only`](https://developer.hashicorp.com/terraform/tutorials/state/resource-drift), which reports how the real resources differ from the state without proposing configuration changes. The standalone `terraform refresh` command is deprecated in favor of this option.

Add [`-detailed-exitcode`](https://developer.hashicorp.com/terraform/cli/commands/plan) to make the result machine-readable:
*   **0:** no changes; infrastructure is in sync.
*   **1:** an error occurred.
*   **2:** changes were found; infrastructure has drifted.

### Distinguishing Managed vs. Unmanaged Resource Drift

Drift can be categorized into two types:
*   **Managed Drift:** This occurs when a resource managed by Terraform is altered outside of the IaC workflow. For example, a tag is manually added to an EC2 instance. `terraform plan` will detect this and propose a plan to revert the change.
*   **Unmanaged Drift:** This involves resources that Terraform doesn't know about at all. For instance, an engineer manually creates a new S3 bucket. Because this resource isn't in the state file, a standard `terraform plan` won't see it. Detecting it requires an inventory of the cloud account to compare against the state, for example from your provider's configuration inventory service. [driftctl](https://github.com/snyk/driftctl) did this for AWS, Azure, and GCP, but the project is now in maintenance mode.

This guide focuses on detecting managed drift, which is the most common and immediate challenge for teams using [Terraform for orchestration](/orchestration/terraform).

## Why Terraform Drift Detection Needs Orchestration

Running `terraform plan` by hand works for one workspace. Across many environments, teams, and clouds, the check needs to run on its own and route its results.

An [orchestration platform](/orchestration) adds what a one-off CI job does not. HCP Terraform users also get [health assessments](https://developer.hashicorp.com/terraform/cloud-docs/workspaces/health) for their workspaces; an orchestrator covers the rest of the estate:
*   **Scheduled, Continuous Checks:** Run drift detection on a recurring schedule (e.g., daily or hourly) to catch deviations quickly, not just when a pull request is opened.
*   **Centralized Alerting:** Automatically route notifications to the right team via Slack, Teams, or PagerDuty when drift is detected, ensuring it doesn't go unnoticed.
*   **Conditional Logic:** Parse exit codes and plan outputs to trigger different workflows, such as creating an incident ticket for critical drift or attempting automated remediation for safe changes.
*   **Cross-System Coordination:** Manage drift detection across dozens of Terraform projects, each with its own state file and cloud credentials, from a single control plane.
*   **Auditability:** Maintain a historical record of all drift checks, providing a clear audit trail for compliance and security reviews.

## Orchestrate Terraform Drift Detection with Kestra: A Daily Sentinel

The following flow runs every morning. It clones the repository that holds the Terraform code, runs a refresh-only plan, stores the plan output, and alerts Slack when drift is found.

```yaml
id: terraform-drift-detection
namespace: company.team.sre

inputs:
  - id: repo_url
    type: STRING
    defaults: https://github.com/your-org/infrastructure.git

triggers:
  - id: daily
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 7 * * *"

tasks:
  - id: drift_workspace
    type: io.kestra.plugin.core.flow.WorkingDirectory
    tasks:
      - id: clone_repository
        type: io.kestra.plugin.git.Clone
        url: "{{ inputs.repo_url }}"
        branch: main

      - id: terraform_plan
        type: io.kestra.plugin.terraform.cli.TerraformCLI
        containerImage: hashicorp/terraform:1.9
        env:
          AWS_ACCESS_KEY_ID: "{{ secret('AWS_ACCESS_KEY_ID') }}"
          AWS_SECRET_ACCESS_KEY: "{{ secret('AWS_SECRET_ACCESS_KEY') }}"
        beforeCommands:
          - terraform init -input=false
        commands:
          - |
            set +e
            terraform plan -refresh-only -detailed-exitcode -input=false -no-color > plan.txt
            code=$?
            cat plan.txt
            echo "::{\"outputs\":{\"plan_exit_code\":$code}}::"
            [ "$code" -ne 1 ]
        outputFiles:
          - plan.txt

  - id: check_for_drift
    type: io.kestra.plugin.core.flow.If
    condition: "{{ outputs.terraform_plan.vars.plan_exit_code == 2 }}"
    then:
      - id: notify_on_drift
        type: io.kestra.plugin.slack.notifications.SlackIncomingWebhook
        url: "{{ secret('SLACK_WEBHOOK_URL') }}"
        payload: |
          {"text": "Terraform drift detected in {{ inputs.repo_url }}. Plan output: execution {{ execution.id }} (plan.txt)."}
    else:
      - id: log_in_sync
        type: io.kestra.plugin.core.log.Log
        message: "No drift: infrastructure matches the Terraform state."
```

What's worth noticing in this workflow:
*   **Declarative & Version-Controlled:** The entire workflow is a single YAML file that can be stored in Git, just like your Terraform code.
*   **Shared working directory:** `WorkingDirectory` lets the clone and the Terraform task use the same files, and the check always runs against the latest `main`.
*   **Exit code handling:** the script captures the plan exit code and publishes it as an output. Exit code 2 (drift) does not fail the task, while exit code 1 (a real error) still does.
*   **Secrets:** cloud credentials and the Slack webhook come from Kestra secrets, not from the flow definition.
*   **Extensibility:** You can extend it to create a Jira ticket, trigger a remediation playbook, or [promote a change to another environment](/docs/enterprise/governance/promote) after a manual approval step. You can also adapt this pattern for related tools using blueprints for [OpenTofu drift detection](/blueprints/opentofu-drift-detection) or [Terragrunt drift detection](/blueprints/terragrunt-drift-watch). The [Terraform plugin](/plugins/plugin-terraform) covers the other Terraform commands.

## Where Automated Drift Detection Pays Off

Automated drift detection helps in several places:
*   **Compliance evidence:** a dated record of every check helps show auditors that changes outside the approved process are caught and handled, for frameworks such as PCI DSS, SOC 2, or HIPAA.
*   **Maintaining Security Posture:** By immediately flagging unauthorized changes, you can close security gaps before they are exploited. Reverting a change to a security group or IAM policy can be added behind an approval step.
*   **Preventing Outages:** Drift in networking rules, database configurations, or auto-scaling groups can lead to performance degradation or outages. Early detection allows you to fix these issues proactively.
*   **[GitOps](/resources/infrastructure/gitops):** drift detection enforces the rule that Git is the source of truth for your infrastructure.
*   **Reducing Manual Toil:** Automating these checks frees up your platform engineering team from tedious manual validation, allowing them to focus on building new capabilities. You can even use this pattern to detect drift in specific resources like a [GCS bucket retention policy](/blueprints/gcp-gcs-bucket-retention-lifecycle-drift-sentinel).

## Related Concepts

*   [Infrastructure Automation Resources](/resources/infrastructure): Explore more guides and playbooks for Terraform, Ansible, and IaC.
*   [Puppet vs. Kestra](/vs/puppet): Compare different approaches to configuration management and infrastructure orchestration.
*   [Orchestrate Ansible with Kestra](/orchestration/ansible): Learn how to combine configuration management with workflow orchestration.
*   [Orchestrate Jenkins with Kestra](/orchestration/jenkins): Integrate your CI/CD pipelines with broader infrastructure automation workflows.

Automated drift detection keeps Infrastructure as Code true after the first apply. Kestra runs the checks on schedule, keeps their history, and connects the result to the people and systems that act on it.
