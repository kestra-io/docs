---
title: "Policy as Code: Automating Governance Across Your SDLC"
description: "Policy as Code (PaC) defines and enforces organizational rules through machine-readable definitions. Learn how to integrate PaC into your CI/CD and IaC workflows with orchestration to ensure compliance, security, and operational consistency."
metaTitle: "Policy as Code: Automated Governance & Compliance"
metaDescription: "Define and enforce security, compliance, and operational rules using Policy as Code. Learn how orchestration automates checks in CI/CD and IaC pipelines."
tag: infrastructure
date: 2026-10-23
slug: "policy-as-code"
faq:
  - question: "What is the difference between Policy as Code and Infrastructure as Code?"
    answer: "Infrastructure as Code (IaC) manages and provisions infrastructure through code, like Terraform or CloudFormation. Policy as Code (PaC) defines rules and constraints for that infrastructure (and other aspects of the SDLC) also through code. IaC describes what to build; PaC describes the rules that what you build must respect."
  - question: "Why do modern engineering teams need Policy as Code?"
    answer: "Modern engineering teams adopt Policy as Code to automate compliance, enforce security guardrails, and reduce manual review bottlenecks. It applies the same rules in every environment and allows policies to be version-controlled and tested just like application code, integrating governance directly into the development lifecycle."
  - question: "What are the key elements of an automated security policy?"
    answer: "An automated security policy, defined as code, typically includes declarative rule definitions (e.g., Rego for OPA), a policy engine to evaluate these rules, integration points within CI/CD or deployment pipelines, and mechanisms for reporting or enforcing violations. It covers aspects like resource configurations, access controls, and data handling."
  - question: "Can Policy as Code replace manual architecture reviews?"
    answer: "No. Policy as Code takes the repetitive checks out of architecture reviews, such as tagging, encryption, or network exposure, so reviewers can focus on design. New patterns, trade-offs, and exceptions still need human judgment; PaC enforces the rules that come out of those reviews."
  - question: "What are some popular Policy as Code frameworks?"
    answer: "Popular Policy as Code frameworks include Open Policy Agent (OPA) for general-purpose policy enforcement, HashiCorp Sentinel for HashiCorp products such as HCP Terraform and Terraform Enterprise, Conftest for testing configuration files against OPA policies, and Kyverno for Kubernetes-native policy management. These tools allow organizations to write, test, and deploy policies in a declarative, version-controlled manner."
  - question: "How does Kestra help with Policy as Code?"
    answer: "Kestra orchestrates Policy as Code by integrating policy engines like OPA into automated workflows. It can trigger policy evaluations at various stages (e.g., during CI/CD, before IaC apply, or as a continuous audit), fail or pause a run when a rule is broken, and record every decision in the execution history. Kestra Enterprise also has its own Policies feature to enforce rules on flows themselves."
---

> **TL;DR** — Policy as Code (PaC) writes security, compliance, and operational rules as versioned, testable code that a policy engine such as Open Policy Agent evaluates automatically. Checks run inside CI/CD and infrastructure pipelines, so a non-compliant change is blocked before it ships instead of being found in a later audit.

In the world of cloud-native development, where infrastructure is code and deployments are automated, governance can often feel like a bottleneck. Manual reviews struggle to keep pace with rapid changes, leading to security vulnerabilities, compliance gaps, and inconsistent configurations. The challenge isn't just to move fast, but to move fast *safely* and *consistently*.

Policy as Code (PaC) offers a solution by translating organizational rules, security standards, and compliance requirements into machine-readable definitions. This approach embeds governance directly into your automated pipelines, ensuring that policies are enforced proactively, every time, without human intervention.

## What is Policy as Code?

Policy as Code (PaC) is the practice of managing and automating policies by defining them in a high-level, declarative language. Instead of relying on manual reviews, checklists, or human-readable documents stored in a wiki, PaC translates these rules into a format that machines can understand and enforce automatically. These policies are stored in a version control system like Git, where they can be reviewed, tested, and deployed just like any other piece of code.

This approach is a core component of [Everything as Code (EaC)](/resources/infrastructure/everything-as-code), where all aspects of system configuration and operation are managed declaratively. By codifying policies, teams create a single source of truth for governance that is transparent, repeatable, and auditable.

### Policy as Code vs. Infrastructure as Code

While closely related, Policy as Code and Infrastructure as Code (IaC) serve distinct but complementary purposes.

**[Infrastructure as Code (IaC)](/resources/infrastructure/everything-as-code)** uses declarative files (like Terraform HCL or AWS CloudFormation YAML) to define the desired state of your infrastructure: which servers, networks, and databases to create. It describes *what* to build.

**Policy as Code (PaC)** defines the constraints, rules, and guardrails for that infrastructure. It describes *how* resources should be configured and operated to meet security, compliance, and operational standards. PaC answers questions like:
- Can this S3 bucket be public?
- Does this virtual machine have the required tags?
- Is this database encrypted at rest?

In practice, IaC provisions the infrastructure, and PaC validates that the provisioned state complies with organizational rules. You can't have effective, automated governance at scale without both.

## Why Policy as Code is Essential for Modern Engineering

PaC moves governance from manual review after the fact to automatic checks at the moment a change is proposed.

- **Automate Compliance:** For organizations subject to regulations like GDPR, HIPAA, or SOC 2, PaC provides an automated way to enforce and prove compliance. For example, you can write policies to ensure all data processing adheres to strict [data residency](/resources/infrastructure/data-residency) requirements.
- **Enforce Security Guardrails:** PaC allows security teams to define and enforce best practices automatically. Instead of discovering a publicly exposed S3 bucket during an audit, a policy can prevent it from ever being created. This embeds security directly into the development workflow, a key principle of DevSecOps.
- **Reduce Human Error and Manual Overhead:** Manual reviews are slow, inconsistent, and prone to error. By automating policy checks, you free up senior engineers from tedious review tasks and ensure that rules are applied consistently every time. This accelerates the entire development lifecycle.
- **Ensure Consistency Across Environments:** PaC prevents configuration drift between development, staging, and production environments. Because policies are code, the same set of rules can be applied everywhere, guaranteeing that what you test is what you deploy. It is a natural extension of [infrastructure automation](/resources/infrastructure/automation).

## Popular Policy as Code Tools and Frameworks

Several tools have emerged to help teams implement Policy as Code. While they share a common goal, they differ in their language, scope, and integration points.

- **[Open Policy Agent (OPA)](https://www.openpolicyagent.org/docs):** an open-source, general-purpose policy engine and a graduated CNCF project. OPA separates policy decisions from enforcement. Policies are written in Rego, and OPA can be called from Kubernetes admission control, CI/CD pipelines, APIs, and microservices.
- **[Conftest](https://www.conftest.dev/):** a command-line tool that tests structured files (Terraform plans, Kubernetes manifests, Dockerfiles) against Rego policies. It is the simplest way to put OPA into a pipeline.
- **[HashiCorp Sentinel](https://developer.hashicorp.com/sentinel):** the policy framework built into HashiCorp's commercial products, such as HCP Terraform and Terraform Enterprise. HCP Terraform also [accepts OPA policies](https://developer.hashicorp.com/terraform/cloud-docs/policy-enforcement).
- **[Kyverno](https://kyverno.io/docs/):** a Kubernetes-native policy engine. Policies are Kubernetes resources that can validate, mutate, or generate configurations, which suits teams focused on Kubernetes governance.

For rules that span clouds, Kubernetes, and pipelines, OPA is the common choice, and Kestra can [orchestrate OPA](/orchestration/opa) directly.

## Orchestrating Policy as Code with Kestra

A policy engine like OPA makes decisions, but it doesn't take action on its own. You need an orchestration layer to integrate these policy checks into your workflows and enforce the outcomes. This is where Kestra comes in.

Kestra runs policy checks as steps in your workflows, so you can:
- **Integrate policy evaluation** at any stage of your CI/CD and IaC pipelines.
- **Automate enforcement** by stopping a non-compliant deployment, rolling back a change, or creating an alert.
- **Trigger remediation workflows** to automatically fix policy violations.
- **Manage the policy lifecycle** by testing and promoting policies through different environments.

Every check becomes part of a recorded execution. You can start with a simple [CI/CD policy gate](/blueprints/opa-policy-gate-ci) and add approvals or remediation steps as the rules mature.

### A Practical Example: OPA Policy Gate for IaC

A common scenario: block Terraform changes that would create an unencrypted or public S3 bucket. The workflow below:

1.  Clones the repository that holds the Terraform code and the Rego policies into a shared working directory.
2.  Runs `terraform plan` in the official Terraform image and exports the plan as JSON.
3.  Tests the JSON plan against the policies with Conftest. Any `deny` rule that matches makes the command exit with an error, which fails the execution and blocks the change.
4.  Alerts Slack when the gate fails.

```yaml
id: terraform-opa-policy-gate
namespace: company.team.guardrails

inputs:
  - id: repo_url
    type: STRING
    defaults: https://github.com/your-org/infrastructure.git

tasks:
  - id: policy_workspace
    type: io.kestra.plugin.core.flow.WorkingDirectory
    tasks:
      - id: clone
        type: io.kestra.plugin.git.Clone
        url: "{{ inputs.repo_url }}"
        branch: main

      - id: terraform_plan
        type: io.kestra.plugin.scripts.shell.Commands
        taskRunner:
          type: io.kestra.plugin.scripts.runner.docker.Docker
        containerImage: hashicorp/terraform:1.9
        env:
          AWS_ACCESS_KEY_ID: "{{ secret('AWS_ACCESS_KEY_ID') }}"
          AWS_SECRET_ACCESS_KEY: "{{ secret('AWS_SECRET_ACCESS_KEY') }}"
        commands:
          - terraform -chdir=terraform init -input=false
          - terraform -chdir=terraform plan -input=false -out=tfplan
          - terraform -chdir=terraform show -json tfplan > plan.json

      - id: opa_policy_check
        type: io.kestra.plugin.scripts.shell.Commands
        taskRunner:
          type: io.kestra.plugin.scripts.runner.docker.Docker
        containerImage: openpolicyagent/conftest:v0.56.0
        commands:
          - conftest test plan.json --policy policy/

errors:
  - id: alert_policy_violation
    type: io.kestra.plugin.slack.notifications.SlackIncomingWebhook
    url: "{{ secret('SLACK_WEBHOOK_URL') }}"
    payload: |
      {"text": "Policy gate failed for {{ inputs.repo_url }} (execution {{ execution.id }}). See the opa_policy_check logs for the violated rules."}
```

If you run OPA as a server, the Enterprise `io.kestra.plugin.ee.opa.policy.Evaluate` task can query it instead of running Conftest.

A few things are worth noticing:
-   **Declarative:** the whole gate is one YAML file you can review and version next to the policies.
-   **Tool Agnostic:** While this example uses Terraform, the pattern is adaptable. You could replace the `terraform` commands with `kubectl` to [test Kubernetes manifests](/blueprints/conftest-opa-manifest-tests), or any other tool that can output JSON.
-   **Extensible:** this is a pass/fail gate. You can add a Jira ticket, or a [human approval step for sensitive changes](/blueprints/iac-opa-policy-gate-human-approval).
-   **Auditable:** Every execution of this workflow is logged, providing a clear audit trail of what was checked, when it was checked, and what the outcome was.

## Beyond Enforcement: Managing the Policy Lifecycle

Policies change as the organization does, so they need the same lifecycle as application code.

- **Version Control:** All policies should live in a [Git repository](/orchestration/git), making it the single source of truth. This enables code reviews, version history, and collaboration between security, compliance, and engineering teams.
- **Policy Testing:** Just like application code, policies can have bugs. You should write unit tests for your policies to ensure they behave as expected. Frameworks like `opa test` allow you to validate your Rego logic against mock data.
- **Automated Promotion:** Use orchestration to create a promotion path for your policies. A change might first be deployed to a development environment, run against a suite of tests, and then require approval before being [promoted to production](/blueprints/opa-policy-lifecycle).
- **Continuous Auditing:** Don't just check policies at deploy time. Configuration drift can happen post-deployment due to manual changes or other unforeseen events. You can use scheduled Kestra workflows to continuously scan your environments and report on any policy violations, ensuring ongoing compliance. For rules on the workflows themselves, Kestra Enterprise has built-in [Policies](/docs/enterprise/governance/policies) that validate or block non-compliant flows.

Treating policies like application code, including [pipeline as code](/resources/infrastructure/pipeline-as-code) for their deployment, is what separates a mature PaC practice from a folder of scripts.

## Where Policy as Code Pays Off

Implementing PaC delivers value across multiple domains:

- **Compliance Automation:** Automatically enforce standards required by GDPR, HIPAA, PCI-DSS, and SOC 2, so audit evidence comes from execution history rather than manual collection.
- **Cloud Security Posture Management (CSPM):** Define and enforce security best practices for your cloud resources, such as restricting network access, enforcing encryption, and managing IAM roles. The same approach applies to [firewall automation](/resources/infrastructure/firewall-automation).
- **DevOps Guardrails:** Prevent common mistakes and enforce organizational standards within CI/CD pipelines, such as ensuring container images are from trusted registries or that deployments have appropriate resource limits.
- **AI Governance:** As organizations adopt AI, PaC can enforce rules on which models are allowed and which data they may see, as part of [AI governance workflows](/resources/ai/ai-governance-workflows).

Pairing a policy engine like OPA with an orchestrator like Kestra turns governance into an automatic step of delivery rather than a review queue.

## Related Concepts
- [Orchestrate Terraform with Kestra](/orchestration/terraform)
- [Workflow governance](/resources/ai/ai-governance-workflows)
- [Human-in-the-loop orchestration](/resources/ai/human-in-the-loop-orchestration)
- [Incident response automation](/resources/infrastructure/incident-response-automation)
