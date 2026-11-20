---
title: "Network Change Management: Automating Configuration Control"
description: "Network change management covers how changes to routers, switches, and firewalls are requested, approved, deployed, verified, and rolled back. This guide shows how to run that process as code, with approvals and an audit trail."
metaTitle: "Network Change Management: Process & Automation"
metaDescription: "The network change management process step by step, from request to rollback, and how to automate it with Git, validation, approvals, and audit logs."
tag: infrastructure
date: 2026-11-17
slug: network-change-management
faq:
  - question: "What is network change management?"
    answer: "Network change management is the systematic process of planning, reviewing, implementing, and verifying modifications to network infrastructure. Its goal is to minimize disruption, ensure security, maintain compliance, and provide full traceability for all network configuration changes."
  - question: "What is change control used for in networks?"
    answer: "Network change control focuses on the technical aspects of implementing approved changes. It ensures that modifications are executed precisely, often through automated tools, and that the network's state remains consistent with the intended design. It is one part of the broader change management process."
  - question: "What does modern network management entail?"
    answer: "Modern network management uses automation, Network as Code, and GitOps principles. Configuration is declared in files under version control, changes go through CI/CD pipelines with automated validation, devices are monitored continuously, and every change leaves an audit trail."
  - question: "What are the 5 stages of the configuration management process?"
    answer: "The 5 stages of the configuration management process typically include Planning & Identification, Configuration Control, Status Accounting, Configuration Verification & Audit, and Release Management. These stages ensure that all configurations are defined, managed, tracked, and validated throughout their lifecycle."
  - question: "What are the 7 steps of the change management process?"
    answer: "The 7 steps of the change management process generally cover change request submission, impact analysis, approval, planning, implementation, verification, and closure. This structured approach ensures that changes are systematically evaluated, executed, and documented to minimize risks."
  - question: "What are the 5 C's of change management?"
    answer: "The 5 C's of change management refer to Communication, Collaboration, Commitment, Clarity, and Capability. These principles guide effective organizational change, ensuring stakeholders are informed, engaged, and equipped to adapt to new processes or technologies."
  - question: "What are the 5 pillars of change management?"
    answer: "The 5 pillars of change management often include Sponsor, Change Agent, Target Audience, Communication, and Resistance Management. These elements represent key areas of focus for successfully leading individuals and organizations through transitional periods and adopting new ways of working."
---

> **TL;DR** — Network change management is the process of requesting, reviewing, approving, deploying, verifying, and rolling back changes to network devices. Run as code, each change is a Git commit that is validated before approval, deployed by a tool such as Ansible, verified automatically, and logged, so outages from manual CLI work become rarer and every change is traceable.

Network infrastructure is the backbone of every modern organization. Yet, managing changes to that infrastructure often remains a manual, error-prone process, leading to outages, security vulnerabilities, and compliance headaches. As networks grow more complex and dynamic, relying on manual CLI configurations and ad-hoc changes is no longer sustainable.

This guide covers the change management process step by step, the governance models behind it, and how to run it as code with Network as Code, CI/CD, and orchestration, so your team can deploy, verify, and roll back network changes with confidence.

## What is Network Change Management?

Network change management is a formal process that governs the entire lifecycle of a modification to network infrastructure. It's not just about applying a new configuration; it's about ensuring that every change is requested, reviewed, approved, implemented, and verified in a controlled and auditable manner. The goal is to balance speed with stability and security. ITIL calls this practice [change enablement](https://www.axelos.com/certifications/itil-service-management).

This process is distinct from change control, which is the tactical execution of an approved change. Change management is the strategic framework, while change control is the operational implementation. In modern enterprise IT, this framework is shifting from a manual, ticket-based system to an automated, code-driven practice. Instead of engineers logging into devices to run commands, changes are defined in version-controlled files and deployed through automated pipelines. For tools and principles, see our guide to [network automation](/resources/infrastructure/network-automation); this page focuses on the change process itself.

## Why Modern Infrastructure Demands Automated Network Change Management

As infrastructure becomes more dynamic and distributed, manual change management introduces significant risks. Automation is no longer a luxury but a necessity for maintaining operational integrity, security, and compliance.

Key drivers for automation include:

*   **Preventing Outages and Configuration Drift:** Manual changes are a leading cause of network outages. A typo, a missed step, or an out-of-sequence command can have cascading effects. Automation ensures that changes are applied consistently and predictably every time. It also helps prevent "configuration drift," where the actual state of a device diverges from its intended state, creating a source of instability and security holes.
*   **Meeting Compliance and Security Audit Requirements:** Regulations like PCI DSS, SOC 2, and DORA require organizations to demonstrate strict control over their infrastructure. Automated change management provides an immutable audit trail for every modification. Who requested the change, who approved it, what was changed, and was it successful? Orchestration platforms log this data automatically, simplifying compliance reporting. For more on this, see our guide to [Workflow Orchestration Security](/resources/infrastructure/workflow-orchestration-security).
*   **Reducing Mean Time To Recovery (MTTR):** When an outage does occur, the first question is always, "What changed?" With an automated and version-controlled system, you can pinpoint the exact change that caused the issue and trigger a deterministic rollback to the last known good state. This drastically reduces troubleshooting time and speeds up recovery.

## The Network Change Management Process: 7 Steps to Control Network Evolution

A sound change management process follows a structured lifecycle. While the specifics can vary, these seven steps form a reliable foundation for controlling network evolution.

1.  **Change Request Submission:** A formal request is initiated, detailing the proposed change, its business justification, and the desired outcome. This is often done through an ITSM tool like ServiceNow or a Git pull request.
2.  **Impact Analysis:** Engineers and architects assess the technical feasibility and potential impact of the change. This includes identifying affected devices, services, and users, and evaluating potential risks.
3.  **Approval Workflow:** The change request, along with its impact analysis, is submitted for approval. This may involve multiple stakeholders, from team leads to a formal Change Advisory Board (CAB). Automation can route requests by risk level and send the notifications. For an example of this, see our [ServiceNow Change Request Runbook](/blueprints/servicenow-change-request-runbook) blueprint.
4.  **Planning and Scheduling:** Once approved, the change is scheduled for implementation. This includes defining pre-deployment tests, a detailed execution plan, and a rollback strategy.
5.  **Implementation:** The change is deployed to the production network. In a modern environment, this step is fully automated, executed by a tool like Ansible or Terraform and orchestrated by a workflow management platform.
6.  **Verification:** After deployment, automated tests are run to verify that the change was successful and did not introduce any unintended side effects. This could involve ping tests, API health checks, or monitoring for specific log patterns.
7.  **Closure:** The change record is updated with the final status, including evidence of successful implementation and verification. All logs and artifacts from the process are archived for audit purposes.

## Governance Models: Applying Stages, Pillars, and the 5 C's to Network Operations

Effective network change management relies on established governance models. These frameworks provide the structure needed to manage change systematically, ensuring all stakeholders are aligned and risks are mitigated.

The **5 stages of the configuration management process** provide a lifecycle view:
1.  **Planning & Identification:** Defining what needs to be managed and how.
2.  **Configuration Control:** The process of managing and approving changes.
3.  **Status Accounting:** Recording and reporting the state of all items.
4.  **Configuration Verification & Audit:** Ensuring configurations match requirements.
5.  **Release Management:** Managing the deployment of new configurations.

The **5 pillars of change management** focus on the organizational aspects:
1.  **Sponsor:** The leader who authorizes and champions the change.
2.  **Change Agent:** The individual or team responsible for implementing the change.
3.  **Target Audience:** The people who will be affected by the change.
4.  **Communication:** The plan for keeping everyone informed.
5.  **Resistance Management:** Strategies for addressing pushback and concerns.

Finally, the **5 C's of change management** guide the human element, which still matters in highly automated environments:
*   **Communication:** Clearly articulating the "what" and "why" of a network change.
*   **Collaboration:** Involving network, security, and application teams in the planning process.
*   **Commitment:** Securing buy-in from leadership and operational teams.
*   **Clarity:** Ensuring the change plan and rollback procedures are unambiguous.
*   **Capability:** Providing teams with the tools and training needed to manage automated workflows, including [RBAC Workflow Orchestration](/resources/infrastructure/rbac-workflow-orchestration) to ensure proper permissions.

## From Manual CLI to Network CI/CD: Embracing Network as Code

The most significant evolution in network change management is the shift from manual, imperative commands to a declarative, code-driven approach. This practice, known as Network as Code, treats your network configuration as a software development project.

The operational hazards of manual CLI configuration are well-known: inconsistent application, lack of versioning, and no easy way to audit changes. Network as Code, managed through a [GitOps](/resources/infrastructure/gitops) workflow, solves these problems. Configurations are defined in declarative files (like YAML or JSON) and stored in a Git repository, which becomes the single source of truth.

When a change is needed, an engineer submits a pull request. This triggers a continuous integration (CI) pipeline that automatically validates the proposed configuration against a set of predefined rules. This pre-deployment validation can check for syntax errors, compliance violations, or conflicts with existing rules; tools such as [Batfish](https://batfish.readthedocs.io/en/latest/) model the network to catch reachability and ACL problems before deployment. For firewall rules specifically, [NIST SP 800-41](https://csrc.nist.gov/pubs/sp/800/41/r1/final) sets out how firewall policies should be reviewed and managed. Only after the code is reviewed, approved, and merged can the continuous deployment (CD) pipeline apply the change to the network. This creates a transparent, auditable, and repeatable process for every change.

## Orchestrate Network Change with Kestra: Automated Firewall Rule Deployment

An orchestration platform like Kestra runs the whole Network as Code lifecycle. It connects the dots between your Git repository, validation scripts, approval workflows, and deployment tools.

Let's consider a practical scenario: deploying a new firewall rule. The following Kestra flow automates this process from end to end: validation and a dry run, human approval, deployment with [Ansible network modules](https://docs.ansible.com/ansible/latest/network/getting_started/index.html), verification, and rollback.

```yaml
id: automated-firewall-rule-deployment
namespace: company.team.network

triggers:
  - id: on_merged_change
    type: io.kestra.plugin.core.trigger.Webhook
    key: "{{ secret('NETWORK_CHANGE_WEBHOOK_KEY') }}"

tasks:
  - id: validate_change
    type: io.kestra.plugin.core.flow.WorkingDirectory
    tasks:
      - id: clone_for_validation
        type: io.kestra.plugin.git.Clone
        url: https://github.com/your-org/network-configs.git
        branch: main
        username: "{{ secret('GIT_USERNAME') }}"
        password: "{{ secret('GIT_PAT') }}"

      - id: validate_rule
        type: io.kestra.plugin.scripts.shell.Commands
        containerImage: your-org/network-tools:1.4
        commands:
          - python scripts/validate_rule.py firewall/new_rule.yml

      - id: dry_run
        type: io.kestra.plugin.ansible.cli.AnsibleCLI
        checkMode: true
        diff: true
        commands:
          - ansible-playbook -i inventory/production playbooks/deploy_firewall_rule.yml

  - id: change_approval
    type: io.kestra.plugin.core.flow.Pause
    pauseDuration: PT4H
    behavior: CANCEL

  - id: deploy_change
    type: io.kestra.plugin.core.flow.WorkingDirectory
    tasks:
      - id: clone_for_deploy
        type: io.kestra.plugin.git.Clone
        url: https://github.com/your-org/network-configs.git
        branch: main
        username: "{{ secret('GIT_USERNAME') }}"
        password: "{{ secret('GIT_PAT') }}"

      - id: deploy_rule
        type: io.kestra.plugin.ansible.cli.AnsibleCLI
        commands:
          - ansible-playbook -i inventory/production playbooks/deploy_firewall_rule.yml

      - id: verify_deployment
        type: io.kestra.plugin.core.http.Request
        uri: "https://monitoring.example.com/check/firewall/{{ trigger.body.rule_id }}"
        headers:
          Authorization: "Bearer {{ secret('MONITORING_API_KEY') }}"
        retry:
          type: constant
          maxAttempts: 3
          interval: PT30S
    errors:
      - id: rollback
        type: io.kestra.plugin.core.flow.WorkingDirectory
        tasks:
          - id: clone_for_rollback
            type: io.kestra.plugin.git.Clone
            url: https://github.com/your-org/network-configs.git
            branch: main
            username: "{{ secret('GIT_USERNAME') }}"
            password: "{{ secret('GIT_PAT') }}"

          - id: rollback_rule
            type: io.kestra.plugin.ansible.cli.AnsibleCLI
            commands:
              - ansible-playbook -i inventory/production playbooks/rollback_firewall_rule.yml

errors:
  - id: alert_on_failure
    type: io.kestra.plugin.slack.notifications.SlackIncomingWebhook
    url: "{{ secret('SLACK_WEBHOOK_URL') }}"
    payload: |
      {"text": "Firewall rule change failed in {{ flow.id }} (execution {{ execution.id }}). Check the logs and the rollback status."}
```

**What this flow accomplishes:**

*   **Git-Driven Workflow:** The Git provider calls the webhook when a change is merged into the network configuration repository.
*   **Pre-Deployment Validation:** A validation script and an Ansible dry run (`checkMode` with `diff`) show the exact change *before* anyone approves it.
*   **Human-in-the-Loop Approval:** The `Pause` task waits up to four hours for a network engineer to approve; without an answer the execution is cancelled, so nothing is deployed by default.
*   **Idempotent Deployment:** Ansible ensures that the configuration is applied idempotently, meaning running the playbook multiple times has the same result as running it once.
*   **Automated Rollback:** The rollback is attached to the deployment step only: if the playbook or the verification fails, the rollback playbook runs, and the flow-level `errors` block alerts the team. A failed validation never triggers a rollback.
*   **Secure Credential Management:** All sensitive information, such as API keys and passwords, is handled using Kestra's [secrets management](/docs/concepts/secret).

## Best Practices for Automated Network Change Control

As you adopt automated network change management, several best practices can help ensure success:

*   **Enforce Automated Audit Logs:** Your orchestration platform should be the single source of truth for all change activities. Every action, from the initial trigger to the final verification, must be logged with timestamps and context. That audit trail is what compliance reviews and incident investigations rely on.
*   **Automate Deterministic Rollbacks:** Don't just plan for rollbacks; automate them. Every deployment workflow should have a corresponding, pre-tested rollback workflow. In the event of a failure, the system should be able to automatically revert to the last known good state without human intervention. 
*   **Resolve Concurrent Changes:** In a busy environment, multiple teams might try to change the same device simultaneously. Your workflow system should have mechanisms to handle concurrency, such as locking mechanisms or queuing systems, to prevent conflicting configurations from being applied.

## Evaluating Network Change and Configuration Management Solutions

The market for Network Change and Configuration Management (NCCM) solutions is mature, with many platforms offering capabilities like device discovery, configuration backup, compliance auditing, and change tracking. These tools are excellent for maintaining an inventory and understanding the current state of your network.

These platforms usually stay within the network domain. The real challenge in a modern enterprise is coordinating network changes with broader infrastructure and application workflows. This is where a universal orchestration platform like Kestra provides value. Kestra can sit on top of your NCCM tools, ITSM platforms, and CI/CD pipelines, for example with [ITSM automation](/resources/infrastructure/itsm-automation) for change tickets. It bridges the gap between different teams and technologies, enabling end-to-end automation that spans from a developer's code commit to a validated production network change. Dataport, Germany's public-sector IT services provider, uses Kestra to standardize API-driven cloud orchestration on its private cloud, and CAGIP, Crédit Agricole's IT production arm, transformed its infrastructure operations and scaled data workflows across more than 100 clusters.

By combining a dedicated NCCM solution for state management with an orchestration platform for workflow automation, you get a flexible, fully auditable system for managing network changes at scale.

To learn more about how Kestra can serve as your unified [infrastructure automation](/infra-automation) layer, explore our platform capabilities.

## Related Concepts
- [Infrastructure Orchestration: Automate Your IT Operations](/resources/infrastructure/infrastructure-orchestration)
- [VM Lifecycle Management Guide](/resources/infrastructure/vm-lifecycle-management)
- [CI/CD Orchestration: Automating Your Software Delivery](/resources/infrastructure/ci-cd-orchestration)
- [Runbook Automation Tools: The 2026 Guide](/resources/infrastructure/runbook-automation-tools-2026)
