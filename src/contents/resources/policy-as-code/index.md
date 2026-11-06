---
title: "Policy as Code: What It Is, Tools, and Examples"
description: "Policy as code writes security, compliance, and operational rules as versioned code that a policy engine evaluates automatically. This guide covers how it works, examples, where to enforce policies, a comparison of policy as code tools, and how to implement it."
metaTitle: "Policy as Code: Definition, Tools & Examples"
metaDescription: "What policy as code is, how it works, and where to enforce it. Rego examples, a comparison of OPA, Sentinel, Kyverno, Checkov and more, and an implementation plan."
tag: infrastructure
date: 2026-10-23
lastUpdated: 2026-11-04
slug: "policy-as-code"
faq:
  - question: "What is policy as code?"
    answer: "Policy as code is the practice of writing security, compliance, and operational rules as code, storing them in version control, and having a policy engine evaluate them automatically wherever a change happens: in pull requests, CI pipelines, infrastructure plans, Kubernetes admission, or running environments. A rule such as 'every resource needs an owner tag' becomes a tested, reviewable file instead of a line in a wiki."
  - question: "What is an example of policy as code?"
    answer: "A Rego policy that rejects any Terraform plan creating a resource without owner and cost_center tags is a typical example. Others include blocking public storage buckets, requiring encryption at rest, limiting instance sizes per environment, rejecting container images from untrusted registries, and requiring resource limits on Kubernetes workloads."
  - question: "What are the most common policy as code tools?"
    answer: "Open Policy Agent (OPA) with the Rego language is the most widely used general-purpose engine. Conftest runs OPA policies against configuration files, and OPA Gatekeeper enforces them in Kubernetes. Kyverno is a Kubernetes-native alternative with YAML policies. HashiCorp Sentinel is built into HCP Terraform and Terraform Enterprise. Checkov and Trivy scan IaC with built-in rules, and Cloud Custodian, AWS Config, and Azure Policy enforce rules on running cloud resources."
  - question: "What is the difference between policy as code and infrastructure as code?"
    answer: "Infrastructure as code describes what to build, such as servers, networks, and databases. Policy as code describes the rules that what you build must respect, such as encryption, tagging, network exposure, or allowed sizes. IaC produces changes; policy as code decides whether those changes are allowed."
  - question: "What is the difference between OPA and Sentinel?"
    answer: "OPA is an open-source, general-purpose engine that works with Terraform, Kubernetes, CI pipelines, APIs, and any JSON input. Sentinel is HashiCorp's proprietary policy framework, available in HashiCorp's commercial products such as HCP Terraform and Terraform Enterprise. HCP Terraform supports both, so teams that want one policy language across tools usually choose OPA."
  - question: "Should I use OPA Gatekeeper or Kyverno for Kubernetes?"
    answer: "Both are Kubernetes admission controllers. Gatekeeper uses OPA and Rego, which makes sense if you already write Rego for Terraform or CI. Kyverno writes policies as Kubernetes YAML and can also mutate and generate resources, which many teams find easier to adopt when Kubernetes is their only target."
  - question: "Is compliance as code the same as policy as code?"
    answer: "They overlap. Policy as code is the mechanism: rules written as code and evaluated by an engine. Compliance as code applies that mechanism to regulatory frameworks such as SOC 2, PCI DSS, or HIPAA, mapping each control to automated checks and keeping the results as audit evidence."
---

Policy as code is the practice of writing security, compliance, and operational rules as code, storing them in Git, and letting a policy engine evaluate them automatically every time something changes. Instead of a reviewer remembering that production databases must be encrypted, a rule checks every change and blocks the ones that break it, with the reason attached.

> **TL;DR** — Policy as code has three parts: rules written in a policy language, an engine that evaluates them against structured input, and an enforcement point that acts on the decision. Rules are versioned, reviewed, and tested like application code. Enforce them where changes happen: in pull requests, at infrastructure plan time, at Kubernetes admission, when someone requests a resource, and continuously against what is already running. Open Policy Agent is the most common general-purpose engine; Kyverno, Sentinel, Checkov, and the cloud-native policy services cover narrower scopes.

## What is policy as code?

Policy as code (PaC) turns organizational rules into machine-readable definitions that are evaluated automatically. Every implementation has three parts:

1.  **The policy.** A rule written in a policy language, such as Rego for Open Policy Agent, YAML for Kyverno, or Sentinel's own language. For example: "every resource needs `owner` and `cost_center` tags".
2.  **The engine.** The component that evaluates the policy against structured input, usually JSON: a Terraform plan, a Kubernetes manifest, a request payload, or an inventory of running resources. The engine returns a decision, such as allow, deny, or a list of violations.
3.  **The enforcement point.** The place that asks for the decision and acts on it: a CI job that fails, an admission controller that rejects a pod, a workflow that stops before provisioning, or a scheduled audit that opens a ticket.

Because policies are code, they live in Git, go through pull requests, have tests, and keep a history. The same rule is applied identically in every environment, and every decision can be logged as audit evidence.

## How policy as code works

A mature policy as code practice follows the same lifecycle as application code:

1.  **Write the rule.** Translate a requirement, such as "no public buckets", into a policy file. Keep each rule small, named, and owned by a team.
2.  **Test it.** Write unit tests with sample inputs that should pass and fail. `opa test` and `conftest verify` run these tests in CI.
3.  **Distribute it.** Publish the policies to every enforcement point from one source of truth, as a bundle, a container image, or a Git reference, so CI, Kubernetes, and workflows all use the same version.
4.  **Evaluate it.** The enforcement point sends the input to the engine and gets a decision with the reasons.
5.  **Enforce and record.** Block, warn, or let the change through depending on the rule's severity, and keep the decision, the input, and the policy version as evidence.

Start new rules in an audit-only mode that reports violations without blocking, measure how many existing resources would fail, fix or grant exceptions, then switch to blocking. Rules that block on day one tend to be disabled on day two.

## Policy as code examples

The rules teams write first are usually the same:

| Rule | Input evaluated | Typical enforcement point |
|---|---|---|
| Every resource has `owner` and `cost_center` tags | Terraform or OpenTofu plan | CI or the provisioning workflow |
| Storage buckets are never public | Terraform plan, cloud inventory | Plan time, then continuous audit |
| Databases are encrypted at rest | Terraform plan, cloud inventory | Plan time, then continuous audit |
| Instance sizes are limited per environment | Request or plan | Request form, plan time |
| Container images come from approved registries | Kubernetes manifest | Admission controller |
| Workloads declare CPU and memory limits | Kubernetes manifest | Admission controller |
| Production changes happen inside maintenance windows | Change request | Workflow before execution |
| Only approved regions are used | Plan, request | Plan time, request form |

Here is the first rule written in Rego for Conftest. It reads the JSON output of `terraform show -json` and reports every created or updated resource that supports tags but is missing a required one:

```rego
package main

import rego.v1

required_tags := {"owner", "cost_center"}

deny contains msg if {
	some rc in input.resource_changes
	some action in rc.change.actions
	action in {"create", "update"}
	"tags" in object.keys(rc.change.after)
	tags := object.get(rc.change.after, "tags", {})
	missing := required_tags - {key | some key, _ in tags}
	count(missing) > 0
	msg := sprintf("%s is missing required tags: %v", [rc.address, missing])
}
```

Running `conftest test plan.json` returns a non-zero exit code and one message per violation, which is all an enforcement point needs to block the change and explain why.

## Where to enforce policies

The same rule is worth checking at several points, because each catches a different failure:

| Enforcement point | What it catches | Typical tools |
|---|---|---|
| Pull request and CI | Non-compliant code before it is merged | Conftest, Checkov, Trivy |
| Infrastructure plan | What will actually change, with computed values | OPA or Sentinel on the plan JSON |
| Request time | Invalid self-service requests, before anything runs | Validation in the request form or workflow |
| Kubernetes admission | Manifests applied by any path, including `kubectl` | OPA Gatekeeper, Kyverno |
| Runtime and continuous audit | Drift, console changes, resources created outside IaC | Cloud Custodian, AWS Config, Azure Policy, scheduled scans |
| Workflow and automation level | How automation itself runs: credentials, concurrency, ownership | Orchestrator governance, such as Kestra Policies |

Checks in pull requests give the fastest feedback. Checks at plan time are the most accurate for infrastructure. Continuous audit is the only way to catch what was changed outside the pipeline, which is why it pairs naturally with [drift detection](/resources/infrastructure/terraform-drift-detection). Request-time checks matter for [self-service infrastructure](/resources/infrastructure/self-service-infrastructure), where a rejected request should fail before any resource exists.

## Policy as code tools

| Tool | Policy language | Scope | Open source | Best for |
|---|---|---|---|---|
| [Open Policy Agent (OPA)](https://www.openpolicyagent.org/docs) | Rego | Any JSON input: IaC, Kubernetes, APIs, CI | Yes, CNCF graduated | One policy language across many enforcement points |
| [Conftest](https://www.conftest.dev/) | Rego | Configuration files: Terraform plans, manifests, Dockerfiles | Yes | Putting OPA policies into CI and workflows |
| [OPA Gatekeeper](https://open-policy-agent.github.io/gatekeeper/website/docs/) | Rego | Kubernetes admission and audit | Yes | Teams already writing Rego elsewhere |
| [Kyverno](https://kyverno.io/docs/) | Kubernetes YAML | Kubernetes admission, mutation, generation | Yes, CNCF | Kubernetes-only governance without learning Rego |
| [HashiCorp Sentinel](https://developer.hashicorp.com/sentinel) | Sentinel | HCP Terraform, Terraform Enterprise, other HashiCorp products | No | Organizations standardized on HashiCorp's commercial stack |
| [Checkov](https://www.checkov.io/) | Built-in rules, custom in Python or YAML | Static analysis of IaC and container files | Yes | Broad out-of-the-box security checks in CI |
| [Trivy](https://trivy.dev/) | Built-in rules, custom in Rego | IaC misconfiguration, images, dependencies | Yes | One scanner for misconfigurations and vulnerabilities |
| [Cloud Custodian](https://cloudcustodian.io/) | YAML | Running cloud resources, with remediation actions | Yes, CNCF | Continuous enforcement and clean-up in cloud accounts |
| AWS Config, Azure Policy, Google Cloud Organization Policy | Provider-specific | Resources in one cloud | No | Native guardrails inside a single provider |

IaC platforms such as HCP Terraform and Spacelift embed OPA or Sentinel to gate their own runs. That works well for changes that go through the platform, but the rules stop at its boundary: they do not see Kubernetes, scripts, or resources changed elsewhere. For a broader comparison of those platforms, see [Spacelift alternatives](/resources/infrastructure/spacelift-alternatives).

### OPA vs. Sentinel

OPA is open source, general-purpose, and evaluates any JSON, so the same Rego can govern Terraform plans, Kubernetes manifests, and API requests. Sentinel is proprietary and runs inside HashiCorp's commercial products. HCP Terraform supports both. Teams that want a single policy language across tools usually pick OPA; teams fully standardized on Terraform Enterprise often keep Sentinel.

### OPA Gatekeeper vs. Kyverno

Both enforce policies at Kubernetes admission and audit existing resources. Gatekeeper uses Rego through constraint templates, which is consistent if Rego is already used for infrastructure. Kyverno policies are plain Kubernetes YAML and can also mutate resources and generate defaults, which lowers the barrier for teams whose only target is Kubernetes.

### Scanners vs. policy engines

Checkov and Trivy ship hundreds of ready-made checks and give quick coverage of common misconfigurations. OPA and Kyverno start empty and enforce exactly the rules you write. Most teams combine them: a scanner for baseline security in CI, and a policy engine for organization-specific rules such as tags, sizes, regions, and ownership.

## Policy as code vs. infrastructure as code vs. compliance as code

| | Infrastructure as code | Policy as code | Compliance as code |
|---|---|---|---|
| **Describes** | What to build | Rules that what you build must respect | Regulatory controls mapped to automated checks |
| **Example** | A Terraform module for a database | "Databases must be encrypted at rest" | SOC 2 control mapped to the encryption rule, with evidence kept |
| **Output** | Changes to infrastructure | Allow, deny, or violations | Audit evidence and control status |
| **Typical tools** | Terraform, OpenTofu, Pulumi, Ansible | OPA, Kyverno, Sentinel | Policy engines plus evidence collection and reporting |

IaC produces changes, policy as code decides whether they are allowed, and compliance as code proves to an auditor that the decisions were made. All three are part of [everything as code](/resources/infrastructure/everything-as-code). For framework-specific guidance, see [SOC 2 compliance](/resources/infrastructure/soc2-compliance) and [PCI DSS compliance automation](/resources/infrastructure/pci-dss-compliance-automation).

## How to implement policy as code

1.  **Start with five rules that matter.** Pick the rules behind your last incidents and audit findings: public exposure, encryption, tags, regions, and sizes. A short list that blocks is worth more than a long list nobody reads.
2.  **Choose one engine and one language.** If you have more than one enforcement point, OPA and Rego avoid writing the same rule three times. Add Kyverno or a scanner only where they clearly fit better.
3.  **Store policies in their own repository.** Give them owners, pull request reviews, tests, and versioned releases, the same way you treat [pipelines as code](/resources/infrastructure/pipeline-as-code).
4.  **Run in audit mode first.** Report violations without blocking, measure how many existing resources fail, then fix or document exceptions before switching to enforcement.
5.  **Make exceptions explicit.** A rule without an exception process gets bypassed. Record exceptions in code, with an owner, a reason, and an expiry date.
6.  **Enforce at more than one point.** Pull request for fast feedback, plan or request time for accuracy, and a scheduled audit for what changed outside the pipeline.
7.  **Measure.** Track violations per week, time to fix, the number of active exceptions, and the share of changes evaluated. A rule that never fires may be useless; a rule that always fires may be wrong.

Common pitfalls: rules that are too broad and block legitimate changes, policies copied into several places that drift apart, no tests on the policies themselves, and enforcement only at deploy time, which misses everything changed by hand afterwards.

## Policy as code with Kestra

Kestra is an open-source orchestration platform with declarative YAML workflows. It applies policy as code at two levels: it runs your policy engines as steps of infrastructure workflows, and it enforces policies on the workflows themselves.

*   **Policy checks as workflow steps.** Run Conftest, Checkov, or Trivy in a container, or [orchestrate OPA](/orchestration/opa) directly, at any point of a workflow: after a Terraform plan, before a Kubernetes deployment, or on a self-service request. A failed check fails the run, and the result stays in the execution history.
*   **Continuous audit on a schedule.** A [scheduled workflow](/docs/workflow-components/triggers/schedule-trigger) can evaluate policies against what is running and open a ticket or start a remediation workflow when something drifts, one of the recurring [day 2 operations](/resources/infrastructure/day-2-operations).
*   **A lifecycle for the policies.** Workflows can test policies and [promote them between environments](/blueprints/opa-policy-lifecycle), so policy changes go through the same review and release path as code.
*   **Policies for automation itself.** In Kestra Enterprise Edition, [Policies](/docs/enterprise/governance/policies) are written in YAML and inject, restrict, require, or deny configuration on flows and plugins across namespaces. They support an `EVALUATE` mode that reports violations before an `ACTIVE` mode blocks them, and child namespaces inherit their parents' rules and can only tighten them.

### Example: a policy gate on a Terraform plan

The workflow below clones the repository that holds the Terraform code (in a `terraform/` folder) and the Rego policies (in `policy/`), runs `terraform plan`, exports it as JSON, and tests it with Conftest. Any `deny` rule that matches, such as the tagging rule above, makes Conftest exit with an error, which fails the execution and notifies Slack.

```yaml
id: terraform_policy_gate
namespace: platform.guardrails

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
        type: io.kestra.plugin.terraform.cli.TerraformCLI
        containerImage: hashicorp/terraform:1.9
        env:
          AWS_ACCESS_KEY_ID: "{{ secret('AWS_ACCESS_KEY_ID') }}"
          AWS_SECRET_ACCESS_KEY: "{{ secret('AWS_SECRET_ACCESS_KEY') }}"
        beforeCommands:
          - terraform -chdir=terraform init -input=false
        commands:
          - terraform -chdir=terraform plan -input=false -out=tfplan
          - terraform -chdir=terraform show -json tfplan > plan.json

      - id: policy_check
        type: io.kestra.plugin.scripts.shell.Commands
        taskRunner:
          type: io.kestra.plugin.scripts.runner.docker.Docker
        containerImage: openpolicyagent/conftest:v0.71.1
        commands:
          - conftest test plan.json --policy policy/

errors:
  - id: alert_policy_violation
    type: io.kestra.plugin.slack.notifications.SlackIncomingWebhook
    url: "{{ secret('SLACK_WEBHOOK_URL') }}"
    payload: |
      {"text": "Policy check failed for {{ inputs.repo_url }} (execution {{ execution.id }}). See the policy_check logs for the violated rules."}
```

The same pattern works for Kubernetes manifests: replace the plan step with the manifests to [test them with Conftest](/blueprints/conftest-opa-manifest-tests). If you run OPA as a server, the Enterprise `io.kestra.plugin.ee.opa.policy.Evaluate` task can query it instead of running Conftest. A simpler [CI policy gate](/blueprints/opa-policy-gate-ci) is available as a blueprint.

### Example: a policy on the workflows themselves

In Kestra Enterprise Edition, this Policy reports every flow in its namespace tree that does not declare a team label. Switching `enforcement` to `ACTIVE` turns the report into a block on save and execution.

```yaml
id: label-audit
enforcement: EVALUATE
rules:
  - type: io.kestra.plugin.ee.rules.Require
    on: FLOW
    properties:
      - labels.team
    errorMessage: "Every flow must declare labels.team."
```

## Related reading

*   [Terraform drift detection](/resources/infrastructure/terraform-drift-detection): finding what changed outside the pipeline.
*   [Self-service infrastructure](/resources/infrastructure/self-service-infrastructure): where request-time policies keep self-service safe.
*   [Day 2 operations](/resources/infrastructure/day-2-operations): continuous audit and remediation after go-live.
*   [GitOps](/resources/infrastructure/gitops): Git as the source of truth for infrastructure and policies.
*   [Orchestrate Terraform with Kestra](/orchestration/terraform): running Terraform alongside the rest of the stack.
*   [AI governance workflows](/resources/ai/ai-governance-workflows): the same principles applied to models and data.
