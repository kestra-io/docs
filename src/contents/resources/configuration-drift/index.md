---
title: "Configuration Drift: Automated Detection, Prevention, and Remediation"
description: "Configuration drift is the unintended divergence of an IT system's actual state from its desired baseline. This guide covers its causes and how to detect, prevent, and remediate it with approved, automated workflows."
metaTitle: "Configuration Drift: Causes, Detection & Remediation"
metaDescription: "What configuration drift is, why it happens, and how to detect it on servers, Kubernetes, and cloud resources, then fix it with an approved, automated workflow."
tag: infrastructure
date: 2026-11-18
slug: configuration-drift
faq:
  - question: What does configuration management mean?
    answer: Configuration management is the process of maintaining consistency in an IT system's configuration over time. It defines, tracks, and controls changes to ensure that systems operate as intended and remain compliant with policies.
  - question: What does "misconfiguration" mean?
    answer: Misconfiguration refers to an incorrect or suboptimal setting in a system or application, often due to human error during initial setup or modification. Unlike drift, it implies an incorrect state from the outset, rather than a deviation from an initially correct state.
  - question: What is data drift?
    answer: Data drift is a change in the statistical properties of input data to a machine learning model over time, leading to a degradation in model performance. It differs from configuration drift, which concerns system settings and infrastructure state.
  - question: What is the meaning of configuration error?
    answer: A configuration error is a mistake in a system's settings that causes it to function incorrectly or not at all. It can be a type of misconfiguration or result from configuration drift if a system deviates into an erroneous state.
  - question: How to fix a configuration error?
    answer: Fixing a configuration error typically involves identifying the incorrect setting, reverting it to a known good state, or applying the correct configuration. Automated remediation often uses Infrastructure as Code (IaC) to redeploy or reconfigure the system to its desired state.
  - question: What does "configuration" mean?
    answer: In IT, "configuration" refers to the specific setup of a system, software, or hardware, including its parameters, settings, and components. It defines how a system operates and interacts with other parts of an infrastructure.
  - question: How does configuration drift impact security?
    answer: Configuration drift can introduce security vulnerabilities by deviating from hardened baselines. This might include open ports, insecure access controls, or outdated software versions, creating attack vectors that bypass intended security policies.
---

> **TL;DR** — Configuration drift is the unintended deviation of an IT system's actual state from its defined, desired baseline, on servers, Kubernetes clusters, or cloud accounts. It leads to security gaps, unstable releases, and failed audits. Scheduled detection in check mode, plus remediation that a human approves, keeps infrastructure consistent with its code.

A hotfix applied by hand at 2 a.m., a package upgraded on one server but not the others, a security group opened "temporarily": each change is small, and none of them makes it back into code. Over months, production stops matching what the repository says it should be. That gap is configuration drift, and it is behind many security findings, failed audits, and "works in staging" outages.

In any environment that changes often, some drift is unavoidable. This article explains what configuration drift is, why it occurs, how to detect it across servers, Kubernetes, and cloud resources, and how to remediate it with an orchestrated workflow that keeps a human in the loop.

## What is Configuration Drift?

Configuration drift is the divergence between an IT system's expected state (the baseline) and its actual state in a live environment. The baseline is the "source of truth," typically defined in version-controlled files like Terraform configurations, Ansible playbooks, Kubernetes manifests, or Docker images. The actual state is what's running on the server, in the cloud account, or on the network device. When they no longer match, drift has occurred.

### Defining baseline versus actual state
- **Baseline State:** The intended, documented, and version-controlled configuration of a system. This is the state you expect your infrastructure to be in, as defined by your Infrastructure as Code (IaC).
- **Actual State:** The live, real-time configuration of the system in its operational environment.

Drift is the delta between these two states. It’s not necessarily a catastrophic failure, but a silent erosion of consistency that accumulates over time.

### Configuration drift versus misconfiguration
While related, drift and misconfiguration are distinct. A misconfiguration is an error in the baseline itself: the source-of-truth configuration was incorrect from the start. For example, a firewall rule in your Terraform code that is too permissive is a misconfiguration.

Configuration drift happens when a correctly configured system is altered in production, causing it to deviate from its correct baseline. For example, an engineer manually opening a port on a production firewall for debugging and forgetting to close it creates drift.

### Configuration drift versus data drift
Data drift is a term from the machine learning world. It refers to changes in the statistical properties of the input data a model receives over time, which can degrade the model's predictive accuracy. It has nothing to do with the configuration of the underlying infrastructure. Configuration drift affects the state of your systems, while data drift affects the state of your data.

## Why Configuration Drift Matters: Risks and Impact

Small, unrecorded changes might seem harmless, but their cumulative effect can lead to significant operational and security risks.

### Security vulnerabilities and compliance exposure
This is the most critical impact. A drifted configuration can undo carefully planned security hardening. A port left open, a default password re-enabled, or a logging agent disabled can create an entry point for attackers. For organizations subject to compliance standards like PCI DSS, SOC 2, or HIPAA, undocumented changes can lead to failed audits and severe penalties.

### Discrepancies between environments (dev, staging, production)
When production drifts from staging and development environments, the "it worked on my machine" problem becomes an "it worked in staging" outage. These discrepancies make it impossible to reliably test changes, leading to unpredictable deployment failures and prolonged troubleshooting sessions.

### Unplanned downtime and operational outages
A seemingly minor change can have cascading effects, causing services to fail in unexpected ways. Because the change isn't documented, a significant amount of time is spent trying to identify the root cause, increasing Mean Time to Recovery (MTTR) and impacting service availability.

## Common Causes of Configuration Drift

Drift is rarely malicious. It typically stems from well-intentioned actions and process gaps in a fast-moving environment.

- **Manual adjustments and emergency hotfixes:** The most frequent cause. During an incident, engineers often make direct changes to production systems to restore service. If these changes are not back-ported to the baseline configuration, they become permanent drift.
- **Fragmented deployment pipelines across teams:** When different teams use different tools or processes to deploy and manage infrastructure, inconsistencies are inevitable. Without a unified approach, each team's actions can cause the overall system to drift from a centrally defined state.
- **Gaps in centralized configuration management and version control:** If not all infrastructure is managed through a version control system like Git, there is no single source of truth to compare against. Ad-hoc scripts and manual changes to unmanaged resources are a primary source of drift.

## Detecting Configuration Drift: Methods and Tools

Effective detection relies on continuously comparing the actual state of your systems against the desired baseline.

### Continuous monitoring and baseline comparison
The fundamental method is to periodically capture the actual state of a system and diff it against the baseline. This can be done with scheduled scripts or specialized tools that generate reports on any detected changes.

### Infrastructure as Code (IaC) drift detection
Tools like Terraform provide built-in mechanisms for drift detection. Running [`terraform plan -refresh-only`](https://developer.hashicorp.com/terraform/tutorials/state/resource-drift) compares the state file (the last known applied state) with the actual resources in the cloud provider. A non-empty plan indicates drift. The Terraform-specific commands and automation are covered in our guide to [Terraform drift detection](/resources/infrastructure/terraform-drift-detection).

### Configuration management check modes and GitOps reconcilers
- **Configuration Management Tools:** Tools like Ansible ([`--check --diff`](https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_checkmode.html)), Puppet ([`--noop`](https://www.puppet.com/docs/puppet/8/man/agent)), and Chef (Why-Run mode) can simulate configuration changes without applying them. Running these tools in check mode against your servers will report any discrepancies between the playbook's definition and the server's actual state.
- **GitOps Reconcilers:** In Kubernetes environments, GitOps tools like Argo CD and Flux continuously monitor the state of the cluster and compare it to the manifests stored in a Git repository. They flag drift and, with [automated sync and self-heal](https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/) enabled in Argo CD, revert it, which is the core principle of [GitOps](/resources/infrastructure/gitops). Kubernetes itself supports this model through [declarative object management](https://kubernetes.io/docs/concepts/overview/working-with-objects/object-management/).

### Auditing environment consistency across clouds
For multi-cloud or hybrid environments, detection involves running checks across all platforms and aggregating the results. This often requires a higher-level tool that can orchestrate checks across different cloud APIs, on-prem servers, and Kubernetes clusters.

## Why Automated Drift Management Needs Orchestration

Detection alone is not enough. A daily report listing hundreds of drifted resources creates alert fatigue and manual toil. A complete solution requires an automated workflow to manage the entire lifecycle of detection, notification, approval, and remediation. Point solutions often fall short because they can't coordinate actions across different tools or enforce complex business logic.

Orchestration provides the necessary control plane to:
- **Schedule and automate** detection routines across your entire stack (cloud, Kubernetes, servers).
- **Coordinate multiple tools** in a single workflow (e.g., run Terraform, then Ansible).
- **Implement conditional logic** to route alerts and trigger remediation based on the severity of the drift.
- **Integrate human-in-the-loop approvals** for any automated changes to production.
- **Provide an auditable trail** of every drift event, notification, and action taken.

## Orchestrate Configuration Drift with Kestra: Automated Detection and Remediation

With Kestra, you can define a declarative workflow to detect and remediate configuration drift in a controlled, auditable manner. This example runs a nightly check of cloud resources with Terraform and of server configuration with Ansible in check mode. Each check publishes a drift flag as an output. If either finds drift, the flow alerts Slack and pauses until a human approves the remediation; without approval within eight hours, the execution is cancelled.

```yaml
id: configuration-drift-detection-and-remediation
namespace: company.team.infra

triggers:
  - id: nightly_schedule
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 2 * * *"

tasks:
  - id: drift_check
    type: io.kestra.plugin.core.flow.WorkingDirectory
    tasks:
      - id: clone_repo
        type: io.kestra.plugin.git.Clone
        url: https://github.com/your-org/infra-as-code.git
        branch: main

      - id: terraform_drift_check
        type: io.kestra.plugin.terraform.cli.TerraformCLI
        env:
          AWS_ACCESS_KEY_ID: "{{ secret('AWS_ACCESS_KEY_ID') }}"
          AWS_SECRET_ACCESS_KEY: "{{ secret('AWS_SECRET_ACCESS_KEY') }}"
        beforeCommands:
          - terraform -chdir=terraform init -input=false
        commands:
          - |
            set +e
            terraform -chdir=terraform plan -refresh-only -detailed-exitcode -input=false -no-color
            code=$?
            echo "::{\"outputs\":{\"drift\":$([ $code -eq 2 ] && echo true || echo false)}}::"
            [ "$code" -ne 1 ]

      - id: ansible_drift_check
        type: io.kestra.plugin.scripts.shell.Commands
        taskRunner:
          type: io.kestra.plugin.scripts.runner.docker.Docker
        containerImage: cytopia/ansible:latest-tools
        inputFiles:
          id_rsa: "{{ secret('ANSIBLE_SSH_KEY') }}"
        commands:
          - chmod 600 id_rsa
          - |
            set -o pipefail
            ansible-playbook -i inventory/production.yml playbooks/configure-servers.yml \
              --private-key id_rsa --check --diff | tee check.log
            changed=$(grep -oE 'changed=[0-9]+' check.log | cut -d= -f2 | awk '{s+=$1} END {print s+0}')
            echo "::{\"outputs\":{\"changed\":$changed}}::"

  - id: if_drift_detected
    type: io.kestra.plugin.core.flow.If
    condition: "{{ outputs.terraform_drift_check.vars.drift or outputs.ansible_drift_check.vars.changed > 0 }}"
    then:
      - id: notify_on_drift
        type: io.kestra.plugin.slack.notifications.SlackIncomingWebhook
        url: "{{ secret('SLACK_DRIFT_WEBHOOK') }}"
        payload: |
          {"text": "Configuration drift detected (Terraform drift: {{ outputs.terraform_drift_check.vars.drift }}, Ansible changes: {{ outputs.ansible_drift_check.vars.changed }}). Remediation is paused for approval: execution {{ execution.id }}."}

      - id: approve_remediation
        type: io.kestra.plugin.core.flow.Pause
        pauseDuration: PT8H
        behavior: CANCEL

      - id: remediate
        type: io.kestra.plugin.core.flow.WorkingDirectory
        tasks:
          - id: clone_for_remediation
            type: io.kestra.plugin.git.Clone
            url: https://github.com/your-org/infra-as-code.git
            branch: main

          - id: remediate_with_ansible
            type: io.kestra.plugin.ansible.cli.AnsibleCLI
            inputFiles:
              id_rsa: "{{ secret('ANSIBLE_SSH_KEY') }}"
            commands:
              - chmod 600 id_rsa
              - ansible-playbook -i inventory/production.yml playbooks/configure-servers.yml --private-key id_rsa
```

A few things are worth noticing:
- **Check mode first:** `terraform plan -refresh-only -detailed-exitcode` and `ansible-playbook --check --diff` only report what differs. Each check publishes its result as an output (`drift`, `changed`), so the `If` condition reads a value instead of guessing from logs.
- **Errors stay errors:** a Terraform exit code of 1 still fails the task, and `set -o pipefail` makes a failed or unreachable Ansible run fail its task instead of reporting `changed: 0`, so a broken check never looks like "no drift".
- **Human approval before any change:** the `Pause` task holds the run for up to eight hours. A team member reviews the diff in the execution logs and resumes; with no answer, the execution is cancelled and nothing is changed.
- **Terraform remediation left out on purpose:** reverting cloud drift with `terraform apply` can destroy manual fixes, so this example only reapplies the Ansible baseline. The Terraform drift guide linked above covers when to apply and when to import the change into code.
- **One history:** every check, approval, and remediation is recorded in the same execution, which is the audit trail compliance teams ask for.

## Where Automated Drift Management Pays Off

Implementing an orchestrated approach to drift management yields significant benefits beyond just fixing inconsistencies.

- **Enhanced security posture and compliance adherence:** By continuously enforcing a known-good baseline, you close security gaps as soon as they appear and maintain a provable state for audits.
- **Reduced mean time to recovery (MTTR) for incidents:** When an issue arises, you can be more confident that it's not due to random, undocumented infrastructure changes, allowing teams to focus on the real problem.
- **Increased operational efficiency and team productivity:** Automating detection and remediation frees engineers from manual, repetitive checks and allows them to focus on value-adding work.
- **Greater confidence in multi-environment deployments:** With drift under control, you can trust that your staging environment accurately reflects production, making deployments more predictable and less risky.

This approach embodies the principles of [Everything as Code](/resources/infrastructure/everything-as-code), where not just your infrastructure, but also your operational processes like drift detection, are defined and managed as version-controlled code.

## Related Concepts

- [Orchestrate Ansible with Kestra: drift detection, rolling waves, dynamic inventory](/orchestration/ansible)
- [Pipeline as Code: Definition, Benefits, and Best Practices](/resources/infrastructure/pipeline-as-code)
- [Terraform Drift Detection and Remediation Planner on Kestra](/blueprints/terraform-drift-detection-remediation-planner)
- [Provider configurations](/docs/terraform/guides/configurations)

Ready to bring your infrastructure under control? Explore how Kestra can help you [orchestrate your entire infrastructure from one control plane](/infra-automation).
