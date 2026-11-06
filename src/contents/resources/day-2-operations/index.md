---
title: "Day 2 Operations: Definition, Examples, and How to Automate Them"
description: "Day 2 operations are everything a team does to infrastructure after it goes live: patching, resizing, rotating certificates, backups, drift, incidents, and decommissioning. This guide covers examples, why day 2 is harder than day 1, the tools, and how to automate it."
metaTitle: "Day 2 Operations: Definition, Examples & Automation"
metaDescription: "Day 2 operations cover everything after go-live: patching, resizing, certificate rotation, drift, incidents, and decommissioning. Examples, tools, and how to automate them."
tag: "infrastructure"
date: 2026-05-28
lastUpdated: 2026-11-04
slug: "day-2-operations"
faq:
  - question: "What are day 2 operations?"
    answer: "Day 2 operations are the work done on infrastructure and applications after they go live, until they are retired. They include patching, resizing, scaling, certificate and secret rotation, backups and restore tests, drift detection, compliance remediation, incident remediation, access changes, and decommissioning. Day 2 is the longest phase of a resource's life and where most operational effort goes."
  - question: "What is the difference between day 0, day 1, and day 2 operations?"
    answer: "Day 0 is design: architecture, standards, and the templates or modules that define what can be built. Day 1 is delivery: provisioning and configuring the resource and putting it into service. Day 2 is everything after go-live: keeping the resource patched, secure, right-sized, compliant, and recoverable, then retiring it. Day 0 and day 1 happen once per resource; day 2 is continuous."
  - question: "What are examples of day 2 operations?"
    answer: "Common examples are OS and package patching, rotating TLS certificates and credentials, taking snapshots and testing restores, resizing CPU, memory, or disk, scaling out and in, detecting and correcting configuration drift, remediating compliance findings, responding to alerts with runbooks, granting or revoking access, and decommissioning resources that are no longer needed."
  - question: "Can Terraform handle day 2 operations?"
    answer: "Partly. Terraform and OpenTofu handle changes to the declared state of a resource, such as a new instance size, and a scheduled plan can detect drift. Many day 2 operations are procedures rather than state: rotating a certificate, restarting a service in order, running a failover, or testing a restore. Those need a workflow that calls Terraform, Ansible, cloud APIs, and scripts in sequence, with approvals and an audit trail."
  - question: "What are day 2 operations in Kubernetes?"
    answer: "Kubernetes automates much of the application's day 2 work, such as restarting pods and scaling replicas. Cluster day 2 remains: control-plane and node upgrades, certificate rotation, etcd or Velero backups and restore tests, add-on upgrades for ingress, CNI, CSI, and operators, drift and admission policies, and capacity clean-up. GitOps covers declared workloads; upgrades, restores, and operations that reach outside the cluster need orchestrated workflows."
  - question: "How do you automate day 2 operations?"
    answer: "List the recurring work from tickets, cron jobs, and runbooks. Turn each operation into a versioned, parameterized workflow. Attach the trigger that fits: a schedule, a monitoring alert, a request, or a Git change. Require approval only where the risk justifies it, make failed runs resumable, and keep a record of which operation ran on which resource. Then measure how much of the recurring work no longer needs a person."
  - question: "What tools are used for day 2 operations?"
    answer: "Teams combine several categories: configuration management and job runners such as Ansible AWX or Rundeck, IaC platforms such as Spacelift or HCP Terraform, monitoring and incident tools such as Datadog or PagerDuty, ITSM platforms such as ServiceNow, cloud management platforms such as VMware Aria Automation or Morpheus, and orchestration platforms such as Kestra that run operations across all of these tools."
---

Day 2 operations are everything a team does to infrastructure after it goes live: patching it, resizing it, rotating its certificates, backing it up, correcting its drift, fixing it when it breaks, and finally retiring it. Day 1 puts a resource into service once. Day 2 lasts for the rest of its life, and it is where most operational work, risk, and cost sit.

> **TL;DR** — Day 0 designs the infrastructure, day 1 delivers it, day 2 runs it until it is retired. Day 2 work is continuous and triggered by things you do not schedule: alerts, CVEs, expiring certificates, requests. Most of it is procedure rather than declared state, so IaC alone does not cover it. Automating day 2 means turning each recurring operation into a versioned workflow with the right trigger, approvals by risk, resumable failures, and a record of what ran where.

## What are day 2 operations?

Day 2 operations are the recurring and event-driven work performed on a system between the moment it goes live and the moment it is decommissioned. The term comes from infrastructure and platform engineering, where a resource's life is split into three phases: day 0 (design), day 1 (delivery), and day 2 (operation).

Day 2 is not a single day. For a virtual machine that runs for three years, day 1 lasts an hour and day 2 lasts the other three years. Every patch cycle, certificate renewal, disk extension, access change, and incident during that time is a day 2 operation.

The term is also used for applications, Kubernetes clusters, and databases, with the same meaning: what it takes to keep something running correctly once it exists. This guide focuses on infrastructure, where day 2 work is the most fragmented across tools and teams.

## Day 0, day 1, and day 2 operations

| | Day 0: design | Day 1: delivery | Day 2: operation |
|---|---|---|---|
| **Question answered** | What should we build, and how? | Is it running? | Is it still running correctly, and should it still exist? |
| **Typical work** | Architecture, standards, modules and templates, security baselines, naming and tagging rules | Provisioning, initial configuration, integration, go-live | Patching, rotation, backups, resizing, drift, compliance, incidents, access, decommissioning |
| **How often** | Once per platform or service type | Once per resource | Continuously, for the resource's whole life |
| **What starts it** | A project | A request or a release | A schedule, an alert, a vulnerability, an expiry, a request, an audit |
| **Typical tools** | Design docs, IaC modules, policy definitions | Terraform or OpenTofu, Ansible, cloud consoles, CI/CD | Configuration management, job runners, monitoring, ITSM, orchestration |
| **Main risk** | A bad standard that every resource inherits | A failed or inconsistent deployment | Silent decay: unpatched, drifted, unowned, or forgotten resources |

Day 0 and day 1 are projects with an end. Day 2 is an operating model. That difference explains why day 1 is usually well automated and day 2 usually is not.

### What is day 0?

Day 0 is design and preparation, before any resource exists. Platform teams choose the architecture, write the modules and templates, and set the security baselines, naming and tagging rules, and policies that every resource will inherit. Mistakes made on day 0 are the most expensive, because every resource built afterwards copies them.

In network engineering, day 0 also means the minimum configuration a device needs to join the network. It is usually delivered by zero-touch provisioning (ZTP): the switch or router boots, fetches its base configuration, and becomes reachable for the rest of the automation. See [network automation](/resources/infrastructure/network-automation).

### What is day 1?

Day 1 is delivery: the resource is provisioned, configured, integrated, and put into service. For a virtual machine, that means Terraform creates it, Ansible configures it, monitoring and backups are attached, and the CMDB is updated. Day 1 has a clear finish line, the resource is live and passes its checks, which is why it is the phase most teams automate first, often behind a [self-service catalog](/resources/infrastructure/self-service-infrastructure).

### What is day 2?

Day 2 starts at go-live and ends when the resource is decommissioned. It covers everything needed to keep the resource secure, recoverable, right-sized, correct, and governed in the meantime, triggered by schedules, alerts, vulnerabilities, expiries, and requests. The rest of this guide is about day 2.

## Examples of day 2 operations

The list below groups the operations infrastructure teams run most often. The trigger column matters: it decides how each operation should be automated.

| Goal | Operation | Usual trigger |
|---|---|---|
| Keep it secure | OS and package patching | Schedule, or a new CVE |
| | TLS certificate renewal and rotation | Schedule, or certificate nearing expiry |
| | Secret and credential rotation | Schedule, or a suspected leak |
| | Vulnerability remediation | Scanner finding |
| Keep it recoverable | Snapshots and backups | Schedule |
| | Restore tests | Schedule |
| | Failover and disaster recovery drills | Schedule, or an incident |
| Keep it right-sized | Resize CPU, memory, or disk | Alert, or a request |
| | Scale out and scale in | Load metric, or a calendar |
| | Power off idle environments | Schedule, or idle detection |
| Keep it correct | Configuration drift detection and correction | Schedule |
| | Compliance scans and remediation | Schedule, or an audit |
| | Incident remediation with a runbook | Monitoring alert |
| Keep it governed | Access grants and revocations | Request, or a departure |
| | Ownership and tagging updates | Request, or a reorganization |
| | Decommissioning | Request, or the end of a project |

Each of these is a sequence of steps across several systems. Renewing a certificate, for example, means requesting it from a CA, storing it in a vault, deploying it to the load balancer and the hosts, reloading the services in order, checking the endpoint, and updating the record of what uses it. For worked examples, see [patch management automation](/resources/infrastructure/patch-management-automation), [secrets rotation](/resources/infrastructure/secrets-rotation-automation), and [vulnerability remediation](/resources/infrastructure/vulnerability-remediation).

## Why day 2 is harder than day 1

Day 1 gets the tooling investment because it is visible and has a clear finish line. Day 2 is harder for five structural reasons.

1.  **You do not choose when it happens.** Day 1 is planned. Day 2 is triggered by alerts at 3 a.m., CVEs published on a Friday, certificates expiring, and requests from other teams. Automation has to react to events, not just run on demand.
2.  **Most of it is procedure, not state.** IaC describes what a resource should look like. Restarting services in the right order, draining a node before patching it, failing over a database, or testing a restore are procedures with ordering, checks, and rollback. They do not fit in a `.tf` file.
3.  **It crosses tools and teams.** A single operation can touch the hypervisor or cloud, the configuration tool, the vault, the load balancer, the CMDB, the ticketing system, and a chat channel. Each team owns a piece; nobody owns the sequence.
4.  **It touches production.** Day 1 creates something new. Day 2 changes something people already depend on, so it needs approvals for risky changes, change records, and an audit trail.
5.  **Ownership decays.** The team that provisioned a resource is rarely the team that runs it a year later. Without an owner and a record of what exists, resources drift, stay unpatched, or keep running long after anyone needs them.

The result in most organizations is the same: day 2 lives in tickets, cron jobs on a jump host, scripts on someone's laptop, and runbooks in a wiki that may or may not match reality.

## Can Terraform handle day 2 operations?

Partly. [Terraform](/orchestration/terraform) and OpenTofu are good at changes to declared state: a new instance size, an extra disk, a new firewall rule. A scheduled plan is also the standard way to [detect drift](/resources/infrastructure/terraform-drift-detection) between the code and what is actually running.

What Terraform does not do on its own:

*   **Run procedures.** Patching, rotations, restarts, failovers, and restore tests are ordered steps inside the resource, usually handled by [Ansible](/orchestration/ansible), scripts, or vendor APIs.
*   **React to events.** Terraform runs when someone or something calls it. Turning an alert or a CVE into an action needs something that listens and decides.
*   **Coordinate across tools.** Updating the CMDB, opening and closing a change record, notifying the owner, and verifying the result happen outside Terraform.
*   **Wait for people.** Approvals, maintenance windows, and owner confirmations need a step that can pause and resume with a recorded decision.

This is why day 2 automation usually sits one level above IaC: a workflow that calls Terraform where state changes, Ansible where configuration changes, and APIs everywhere else.

## Day 2 operations in Kubernetes

Kubernetes moved much of the application's day 2 work into the platform: controllers restart failed pods, autoscalers adjust replicas, and rolling updates replace releases. What remains is the cluster's own day 2, and it is substantial:

*   **Cluster and node upgrades.** A new minor version every few months, applied to the control plane, node pools, and add-ons in order, with nodes cordoned and drained before they are replaced.
*   **Certificates and credentials.** Control-plane certificates, service account tokens, and the cloud credentials controllers use, each with its own expiry.
*   **Backup and restore.** etcd snapshots or Velero backups of resources and persistent volumes, and restore tests to prove they work.
*   **Add-on lifecycle.** Ingress controllers, CNI and CSI drivers, cert-manager, and operators, each with its own release cycle and compatibility matrix.
*   **Drift and policy.** Live manifests diverge from Git; GitOps controllers such as Argo CD or Flux reconcile workloads, and admission policies such as OPA Gatekeeper or Kyverno block non-compliant ones.
*   **Capacity and cost.** Right-sizing requests and limits, and cleaning up unused namespaces, load balancers, and volumes.

[GitOps](/resources/infrastructure/gitops) handles declared workloads well. Cluster upgrades, restores, and operations that span the cluster and systems outside it, such as DNS, load balancers, the cloud account, and the CMDB, still need workflows with ordering, approvals, and checks. See how to [orchestrate Kubernetes](/orchestration/kubernetes) operations alongside the rest of the stack.

## How to automate day 2 operations

A practical approach that works for platform and infrastructure teams of any size:

1.  **Inventory the recurring work.** Export six months of tickets and list the cron jobs and runbooks you already have. Group them by operation and count them. The top ten operations usually cover most of the volume.
2.  **Write each operation as a versioned workflow.** One workflow per operation, stored in Git, parameterized by resource, environment, and options. The runbook becomes executable, and its history becomes reviewable.
3.  **Attach the trigger that fits.** Schedules for patching, backups, and drift checks. Alerts and webhooks for remediation. Requests from a form or a [self-service catalog](/resources/infrastructure/self-service-infrastructure) for resizes and access changes. Git changes for configuration updates.
4.  **Gate by risk, not by habit.** Run low-risk operations automatically: a dev environment resize, a disk extension under a threshold. Require approval for production, destructive, or expensive changes, and record who approved and why. Express the rules as code so they apply the same way every time; see [policy as code](/resources/infrastructure/policy-as-code).
5.  **Make failures resumable.** Add retries and timeouts to steps that call flaky systems, notify the right channel on failure, and restart a failed run from the failed step instead of starting over.
6.  **Keep a record of what ran where.** Every operation should leave a trace: which resource, which parameters, who triggered or approved it, what changed, and the logs. That record is what auditors and incident reviews ask for.
7.  **Measure the toil you removed.** Track the share of recurring operations that run without a person, mean time to remediate for common alerts, patch latency, certificates renewed before expiry, and ticket volume for automated operation types.

Teams that follow this path usually start with one high-volume, low-risk operation, such as disk extension or certificate renewal, then extend the same pattern to the rest. Over time this becomes [self-healing infrastructure](/resources/infrastructure/self-healing-infrastructure) for the common failures and [automated incident response](/resources/infrastructure/incident-response-automation) for the rest.

## Day 2 operations tools

No single tool covers all of day 2. Most teams combine several of the categories below, and the gaps between them are where manual work accumulates.

| Category | Examples | What it does well | What it leaves out |
|---|---|---|---|
| Configuration management and job runners | Ansible AWX and Automation Platform, Rundeck | Runs playbooks and jobs on hosts, with credentials and schedules | Workflows that span many tools, event handling beyond basic webhooks, approvals outside the tool |
| IaC platforms | Spacelift, HCP Terraform, env zero | State, plans, policies, and drift for IaC stacks; Spacelift added Flows for day 2 workflows in 2026 | Operations that are not IaC, and teams whose estate is not mostly in Terraform |
| Monitoring and incident management | Datadog, PagerDuty, Grafana | Detection, alerting, on-call, and simple automated actions | Multi-step remediation across infrastructure tools |
| ITSM | ServiceNow, Jira Service Management | Requests, change approvals, the CMDB, and audit | Execution: the actual work still runs in scripts or other tools |
| Cloud management platforms | VMware Aria Automation, Morpheus | Day 2 actions on resources they provisioned | Resources created elsewhere, licensing and platform lock-in |
| Orchestration platforms | Kestra | Any tool as a step, event and schedule triggers, approvals, retries, and one record of every run | You define the workflows; it is not a prebuilt catalog of operations |

For comparisons inside each category, see [AWX alternatives](/resources/infrastructure/awx-alternatives), [Rundeck alternatives](/resources/infrastructure/rundeck-alternatives), [Spacelift alternatives](/resources/infrastructure/spacelift-alternatives), and [VMware Aria Automation alternatives](/resources/infrastructure/vmware-aria-automation-alternatives).

## Day 2 operations with Kestra

Kestra is an open-source orchestration platform with declarative YAML workflows. For day 2, each operation is a workflow, and the triggers, tool calls, approvals, retries, and history live in that workflow.

*   **Every trigger day 2 needs.** [Schedules](/docs/workflow-components/triggers/schedule-trigger) for patching, backups, and drift checks. [Webhooks](/docs/workflow-components/triggers/webhook-trigger) for alerts from Alertmanager, Datadog, or a scanner. [Flow triggers](/docs/workflow-components/triggers/flow-trigger) to chain operations, for example a verification run after every patch.
*   **The tools you already use.** Plugins for [Ansible](/orchestration/ansible), [Terraform](/orchestration/terraform), OpenTofu, Kubernetes, VMware, the major clouds, ServiceNow, and any script or API run as steps of the same workflow. Playbooks and modules run as they are.
*   **Approvals where the risk is.** A [`Pause` task](/docs/how-to-guides/pause-resume) stops the run, waits for a decision, and resumes with the approver's answer and reason, which stay in the execution history.
*   **Failures you can resume.** [Retries](/docs/workflow-components/retries), timeouts, and [error handlers](/docs/workflow-components/errors) per step, and [replay](/docs/concepts/replay) from the failed task once the cause is fixed.
*   **Guardrails across teams.** In Kestra Enterprise Edition, [Policies](/docs/enterprise/governance/policies) validate and inject configuration across namespaces, and [assets](/docs/enterprise/governance/assets) keep an [up-to-date record of provisioned infrastructure](/docs/how-to-guides/asset-infrastructure-inventory) linked to the executions that changed it.

[Kestra for Infrastructure](/infra-automation) brings this model to platform and infrastructure teams in Kestra Enterprise Edition: self-service without losing control, on the same Kestra that already runs data and AI workflows.

### Example: alert-driven disk extension with approval in production

The workflow below handles one of the most common day 2 alerts: a filesystem running out of space. Alertmanager calls the webhook. Outside production, the disk is extended immediately. In production, the on-call engineer approves first, and the decision is recorded. The extension itself is an existing Ansible playbook stored next to the workflow.

```yaml
id: extend_disk_on_alert
namespace: platform.day2

tasks:
  - id: approval_in_production
    type: io.kestra.plugin.core.flow.If
    condition: "{{ trigger.body.alerts[0].labels.env == 'prod' }}"
    then:
      - id: notify_oncall
        type: io.kestra.plugin.slack.notifications.SlackIncomingWebhook
        url: "{{ secret('SLACK_ONCALL') }}"
        payload: |
          {
            "text": "Disk almost full on {{ trigger.body.alerts[0].labels.instance }} (prod). Approve the extension in execution {{ execution.id }}."
          }

      - id: wait_for_approval
        type: io.kestra.plugin.core.flow.Pause
        onResume:
          - id: approved
            type: BOOL
            defaults: false
          - id: reason
            type: STRING

      - id: stop_if_rejected
        type: io.kestra.plugin.core.execution.Fail
        condition: "{{ outputs.wait_for_approval.onResume.approved == false }}"
        errorMessage: "Extension rejected: {{ outputs.wait_for_approval.onResume.reason }}"

  - id: extend_disk
    type: io.kestra.plugin.ansible.cli.AnsibleCLI
    namespaceFiles:
      enabled: true
      include:
        - inventory.ini
        - extend_disk.yml
    limit: "{{ trigger.body.alerts[0].labels.instance }}"
    commands:
      - ansible-playbook -i inventory.ini extend_disk.yml

  - id: notify_done
    type: io.kestra.plugin.slack.notifications.SlackIncomingWebhook
    url: "{{ secret('SLACK_ONCALL') }}"
    payload: |
      {
        "text": "Disk extended on {{ trigger.body.alerts[0].labels.instance }}. Execution {{ execution.id }}."
      }

triggers:
  - id: disk_pressure_alert
    type: io.kestra.plugin.core.trigger.Webhook
    key: disk-pressure-alert
```

The same structure covers most alert-driven operations: replace the playbook and the approval condition, and keep the trigger, the notification, and the record. Configure Alertmanager to send only firing alerts to this webhook, so resolved notifications do not start a run.

## Related reading

*   [Day 2 is where infrastructure automation breaks](/blogs/day-2-infrastructure-automation-breaks): why every tool reports success while the change across them fails.
*   [Self-service infrastructure](/resources/infrastructure/self-service-infrastructure): how engineers request resources through a governed catalog instead of tickets.
*   [VM lifecycle management](/resources/infrastructure/vm-lifecycle-management): the full life of a virtual machine, from request to decommissioning.
*   [Patch management automation](/resources/infrastructure/patch-management-automation): scheduled, verified patching across environments.
*   [Terraform drift detection](/resources/infrastructure/terraform-drift-detection): finding the gap between code and reality.
*   [Self-healing infrastructure](/resources/infrastructure/self-healing-infrastructure): turning alerts into remediation.
*   [Runbook automation tools](/resources/infrastructure/runbook-automation-tools-2026): the tools that turn runbooks into workflows.
*   [Infrastructure orchestration](/resources/infrastructure/infrastructure-orchestration): coordinating Terraform, Ansible, and everything around them.
