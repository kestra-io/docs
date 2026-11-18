---
title: "Terraform Cloud Alternatives: Replacing HCP Terraform and Terraform Enterprise"
description: "What it takes to leave HCP Terraform (formerly Terraform Cloud) or Terraform Enterprise: the features to replace, open-source and commercial alternatives, and a step-by-step state migration."
metaTitle: "Terraform Cloud Alternatives: Leaving HCP Terraform"
metaDescription: "Terraform Cloud alternatives compared: what to replace (state, runs, registry, policies), open-source options like Terrakube and OTF, and how to migrate state."
tag: "infrastructure"
date: 2026-11-18
slug: "terraform-cloud-alternative"
faq:
  - question: "Why are teams looking for Terraform Cloud alternatives in 2026?"
    answer: "Teams look at alternatives because of the Terraform license change to BUSL 1.1, a pricing model based on resources under management, and vendor lock-in. The rise of OpenTofu and the need to orchestrate IaC alongside other workflows are also common reasons."
  - question: "What are the main types of Terraform Cloud alternatives?"
    answer: "Alternatives fall into several categories: dedicated IaC management platforms (e.g., Spacelift, env0, Scalr), self-hosted open-source platforms (Terrakube, OTF) and PR automation tools (Atlantis, Terramate), and general-purpose workflow orchestrators (e.g., Kestra, CI/CD platforms) that can integrate and manage Terraform/OpenTofu workflows."
  - question: "Can I use an alternative without rewriting existing HCL code?"
    answer: "Yes, most direct alternatives and orchestration platforms are designed to work with your existing HCL code. They typically focus on managing the execution, state, and policy layers around your Terraform/OpenTofu configurations, rather than requiring code rewrites."
  - question: "How does Kestra compare as a Terraform Cloud alternative?"
    answer: "Kestra is an orchestration platform that runs Terraform and OpenTofu alongside other infrastructure tools, cloud APIs, and even data or AI workflows. It is not a drop-in TACO: state stays in your own backend (S3, GCS, Azure Blob), and Kestra runs plan, approval and apply as steps in YAML workflows triggered by Git events, schedules or other systems."
  - question: "What is OpenTofu and how does it relate to Terraform Cloud alternatives?"
    answer: "OpenTofu is an open-source, community-driven fork of Terraform that emerged after HashiCorp's license change. Many Terraform Cloud alternatives now offer explicit support for OpenTofu, providing a vendor-neutral path for IaC automation and state management."
  - question: "What is the best free and open-source alternative to Terraform Cloud?"
    answer: "Terrakube and OTF are open-source, self-hosted platforms that replicate much of the HCP Terraform workflow (workspaces, remote runs, a module registry in Terrakube). Atlantis covers pull-request automation only. Kestra is open source (Apache 2.0) and orchestrates Terraform or OpenTofu runs alongside other workflows."
  - question: "Who are Terraform Cloud's main competitors?"
    answer: "Terraform Cloud's main competitors include commercial IaC orchestration platforms like Spacelift, env0, and Scalr, as well as broader orchestration tools like Kestra, and cloud-native CI/CD platforms like GitHub Actions and GitLab CI/CD when used for IaC workflows."
---

> **TL;DR** — Leaving HCP Terraform (formerly Terraform Cloud) means replacing several services: remote state, runs, the module registry, policies, VCS triggers and workspaces. Terrakube and OTF rebuild that workflow as self-hosted open source, Atlantis covers pull-request runs, and orchestrators like Kestra run plan, approval and apply inside broader workflows.

HCP Terraform bundles several critical Infrastructure as Code (IaC) functions: remote state storage, remote run execution, a private module registry, policy checks, and VCS-triggered workspaces. Since Terraform's move to the Business Source License (BUSL) in August 2023 and HashiCorp's acquisition by IBM in 2025, many teams are re-evaluating this all-in-one offering. Leaving the platform means replacing each of its components, not just finding a new user interface.

This guide covers the main Terraform Cloud alternatives in 2026, from self-hosted open-source platforms to orchestration engines. It details what you need to replace, compare open-source and commercial options, and provide a practical walkthrough for migrating your state and workflows off HCP Terraform.

## Why Teams Are Rethinking Terraform Cloud in 2026

The conversation around Terraform Cloud alternatives intensified for several key reasons. These factors have prompted platform engineering and DevOps teams to assess their dependency on a single vendor for a core part of their infrastructure stack.

*   **Licensing and Vendor Lock-In:** In August 2023, HashiCorp moved Terraform from the Mozilla Public License (MPL 2.0) to the Business Source License (BUSL 1.1). While not affecting most end-users directly, this move signaled a shift away from a fully open-source model. It raised concerns about future restrictions and increased vendor lock-in, especially following the 2025 acquisition by IBM. Teams are now more cautious about building their entire IaC practice on a platform controlled by a single large corporation.

*   **The Rise of OpenTofu:** The license change led to the creation of [OpenTofu](https://opentofu.org/), an open-source, community-driven fork of Terraform managed by the Linux Foundation. OpenTofu maintains MPL 2.0 licensing and provides a drop-in replacement for the Terraform CLI. This gives organizations a stable, vendor-neutral foundation for their IaC, making platforms that support both Terraform and OpenTofu more attractive.

*   **Pricing Model:** HCP Terraform's pricing is based on the number of resources under management. Teams whose infrastructure grows quickly sometimes prefer a model that is not tied to resource count, such as per-user or per-instance subscriptions, or a self-hosted open-source tool.

*   **Need for Broader Orchestration:** Many teams find that IaC is just one part of a larger automation landscape. A dedicated Terraform Cloud platform can become another silo. The need to coordinate Terraform with Ansible playbooks, Kubernetes jobs, data pipelines, and custom scripts drives teams toward more general-purpose orchestration tools that can manage the entire workflow end-to-end. This is a key consideration when deciding to [build vs. buy an orchestration platform](/resources/infrastructure/build-vs-buy-orchestration).

## What HCP Terraform Does That You Must Replace

Migrating from HCP Terraform requires a clear understanding of the features you rely on and how you will replace them. It's not a single tool but a bundle of services.

| HCP Terraform Feature | Open-Source Replacement | Orchestrator-Based Replacement (e.g., Kestra) |
| :-------------------- | :---------------------- | :--------------------------------------------- |
| **Remote State Backend** | S3, GCS, Azure Blob with state locking (DynamoDB, etc.) | Uses the same native backends; Kestra doesn't store state. |
| **Remote Runs & History** | Self-hosted runner (e.g., Atlantis) or CI/CD agent | Kestra executes runs on workers, providing a full execution history. |
| **Private Module Registry** | Terrakube's registry, Git tags, local filesystem | Use Git-based modules; Kestra clones the required version at runtime. |
| **Policy as Code** | Open Policy Agent (OPA), Conftest, tfsec | Run OPA/Conftest as a task within a Kestra workflow. |
| **VCS-Driven Runs** | Webhooks triggering a CI/CD pipeline or Atlantis | Webhook triggers in Kestra that initiate a `git clone` and `plan`/`apply`. |
| **Workspaces & Variables** | Directory structure in Git, environment files | Kestra namespaces for isolation and secrets management for variables. |
| **Drift Detection** | Scheduled CI/CD job running `terraform plan -refresh-only` | A scheduled Kestra flow that runs a refresh-only plan and alerts on drift. |

Replacing these features piece by piece with open-source tools works, but it creates a toolchain you have to run yourself. An orchestration platform puts those pieces in one place. For more on these concepts, see our guides on [policy as code](/resources/infrastructure/policy-as-code) and [Terraform drift detection](/resources/infrastructure/terraform-drift-detection).

## Essential Criteria for Evaluating IaC Orchestration Platforms

When comparing alternatives, focus on these core capabilities:

*   **State Management & Execution:** Does the platform manage state for you, or does it integrate with standard backends like S3 or GCS? Does it offer SaaS runners, or can you bring your own self-hosted agents for security and compliance?
*   **Drift Detection & Prevention:** How does the tool detect and report on differences between your code and the actual state of your infrastructure? Can it schedule automatic checks?
*   **Policy as Code (PaC):** What frameworks are supported for enforcing governance? Most modern tools integrate with Open Policy Agent (OPA) and its Rego language, the usual replacement for Sentinel.
*   **CI/CD and VCS Integration:** How deeply does it integrate with GitHub, GitLab, or Bitbucket? Does it support PR-based workflows, showing speculative plans directly in pull requests?
*   **Multi-Cloud & Multi-Runtime Support:** Does the platform exclusively support Terraform, or can it also run OpenTofu, Ansible, Pulumi, and other scripting tools? This is critical for avoiding a new form of tool-specific lock-in.

## Top Terraform Cloud Alternatives

The market offers a range of alternatives, from dedicated commercial platforms to flexible open-source orchestrators.

### 1. Kestra: Unified Orchestration Beyond IaC

Kestra is an open-source, declarative orchestration platform that can manage Terraform and OpenTofu as part of broader, multi-step workflows. It is not a dedicated TACO (Terraform Automation and Collaboration Software): it runs Terraform as one step among others in your automated processes.

Workflows are defined in YAML, allowing you to chain Terraform runs with anything else: Ansible playbooks, Kubernetes jobs, database queries, Python scripts, or API calls. This is Kestra's main differentiator: it places IaC in the context of the entire operational lifecycle. For example, a Kestra workflow can provision a database with Terraform, seed it with data using a SQL script, and then trigger a data pipeline, all within a single, auditable flow.

Kestra is event-driven, so workflows can be triggered by a Git push, a schedule, an API call, or a message on a Kafka topic. It doesn't replace Terraform's state backend; you continue to use S3, GCS, or Azure Blob for state, which Kestra's [Terraform plugin](/plugins/plugin-terraform) respects. This makes adoption less disruptive.

*   **Best for:** Teams that want one open-source platform for IaC, data and AI workflows, with event triggers and governance. It fits teams that see provisioning as a step in a larger process. See how to [orchestrate Terraform with Kestra](/orchestration/terraform) and the [Terraform plan and apply with approval gate blueprint](/blueprints/terraform-approval-plan-apply).

### 2. Terrakube: Open-Source, Self-Hosted HCP Terraform Replacement

[Terrakube](https://github.com/terrakube-io/terrakube) is an open-source platform (Apache 2.0) that aims to replicate the core experience of HCP Terraform in a self-hosted environment. It provides workspaces, remote run execution, and a private module registry. Its API is designed to be compatible with the Terraform CLI's `cloud` block, making it a near drop-in replacement for teams who want to keep their workflow but move off HashiCorp's hosted service. Because it's self-hosted, you have full control over your infrastructure and data.

*   **Best for:** Teams that want the specific workflow and features of HCP Terraform but require a self-hosted, open-source solution for security or compliance reasons.

### 3. OTF: Lightweight Open-Source TFC Clone

[OTF](https://github.com/leg100/otf) is another open-source project (MPL 2.0) that implements the Terraform Cloud API for remote state and run execution. It's more lightweight than Terrakube and focuses on providing the essential backend services needed to run Terraform in a collaborative environment without using HashiCorp's services. It's a good choice for teams comfortable with managing their own services and who need a minimal, API-compliant backend.

*   **Best for:** Teams looking for a minimal, API-compatible, self-hosted backend for Terraform state and runs, and who don't need the extra features of a full management platform.

### 4. Terramate: Stack Orchestration and Change Detection

[Terramate](https://terramate.io/) is an open-source CLI (MPL 2.0) that adds orchestration, code generation, and change detection capabilities to your Terraform or OpenTofu workflow. It excels at managing complex infrastructure with multiple stacks and environments by keeping code DRY (Don't Repeat Yourself). Terramate can detect which stacks are affected by a code change and run commands only on those stacks. It also offers an optional cloud dashboard for better visibility.

*   **Best for:** Teams managing many interconnected Terraform stacks who need to improve code organization, reduce duplication, and speed up their CI/CD pipelines through efficient change detection.

### 5. Spacelift: IaC Governance and Automation

[Spacelift](https://spacelift.io/) is a mature commercial platform for IaC management that offers sophisticated policy-as-code, GitOps workflows, and environment management. It supports Terraform, OpenTofu, Pulumi, and Ansible, making it a versatile choice for organizations with diverse toolchains. Its main strength is its OPA-based policy engine, which allows for fine-grained control over every step of the IaC lifecycle.

*   **Best for:** Large enterprises with complex IaC governance needs, strict compliance requirements, and multi-cloud, multi-tool environments. 

### 6. env0, Scalr, and Pulumi Cloud

These commercial platforms offer mature alternatives, each with a unique focus. They are covered in detail, with Spacelift, in our [Spacelift alternatives](/resources/infrastructure/spacelift-alternatives) article.

*   **[env0](https://www.env0.com/):** Focuses on self-service infrastructure environments with cost visibility, so developers can provision their own environments within predefined guardrails.
*   **[Scalr](https://docs.scalr.io/):** Offers a hierarchical model for environments and workspaces that maps well to large organizations, with self-hosted agents for runs and direct compatibility with the Terraform CLI.
*   **[Pulumi Cloud](https://www.pulumi.com/docs/pulumi-cloud/):** A different paradigm where you define infrastructure using general-purpose programming languages like Python, TypeScript, or Go. It's best for development teams who want to apply software engineering practices like testing and abstraction to their IaC.

### 7. Atlantis: GitOps-Driven Pull Request Automation

[Atlantis](https://www.runatlantis.io/) is a popular open-source (Apache 2.0), self-hosted application that automates Terraform and OpenTofu workflows directly within pull requests. When a developer opens a PR with IaC changes, Atlantis automatically runs a `plan` and posts the output as a comment. Team members can then review the plan and approve it by commenting `atlantis apply`. This keeps the entire workflow within the familiar GitOps process.

*   **Best for:** GitOps-focused teams who want a simple way to automate Terraform/OpenTofu runs directly from pull requests and don't require a complex UI or advanced governance features.

### 8. GitHub Actions / GitLab CI/CD: Using Existing CI/CD

For many teams, the existing CI/CD platform is a natural place to run IaC workflows. Both [GitHub Actions](/resources/infrastructure/kestra-vs-github-actions) and [GitLab CI/CD](/resources/infrastructure/kestra-vs-gitlab) can be configured to run Terraform or OpenTofu plans and applies. This approach has the benefit of being familiar to developers and integrated with the software delivery lifecycle.

Generic CI/CD tools are not purpose-built for IaC, though. They often lack features like state locking, drift detection, and advanced policy enforcement, requiring custom scripting to implement. This can lead to brittle and hard-to-maintain pipelines. For a broader look at this category, see our guide on [CI/CD tools alternatives](/resources/infrastructure/ci-cd-tools-alternatives).

*   **Best for:** Teams already heavily invested in these CI/CD platforms who have simple IaC needs and are willing to build and maintain custom scripting for state management and governance.

## Comparison Table: Terraform Cloud Alternatives at a Glance

| Tool | License | Deployment | OpenTofu Support | Replaces... | Best For |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Kestra** | Apache 2.0 (open source) + Enterprise | Self-hosted, Kestra Cloud | Yes | Runs, Policies, VCS, Workspaces | Unified orchestration across IaC, data, and AI. |
| **Terrakube** | Apache 2.0 | Self-hosted | Yes | State, Runs, Registry, Workspaces | Self-hosted HCP Terraform clone. |
| **OTF** | MPL 2.0 | Self-hosted | Yes | State, Runs | Minimal, API-compatible self-hosted backend. |
| **Terramate** | MPL 2.0 | Self-hosted CLI, Cloud Dashboard | Yes | Workspaces, Change Detection | Managing complex stacks and code generation. |
| **Spacelift** | Commercial | SaaS | Yes | State, Runs, Registry, Policies | Large enterprises with complex governance. |
| **env0** | Commercial | SaaS | Yes | State, Runs, Policies, Workspaces | Self-service environments with cost control. |
| **Scalr** | Commercial | SaaS, Self-hosted Agents | Yes | State, Runs, Registry, Policies | Organizations with hierarchical team structures. |
| **Atlantis** | Apache 2.0 | Self-hosted | Yes | Runs (in PRs) | GitOps teams focused on PR automation. |
| **GitHub/GitLab** | Commercial/OSS | SaaS, Self-hosted | Yes | Runs, VCS | Basic IaC automation inside existing CI/CD. |

## Choosing the Right Terraform Cloud Alternative

The best choice depends on your team's specific needs, scale, and philosophy.

*   **For small teams or those starting with IaC:** **Atlantis** offers a simple, self-hosted path to PR automation. **Kestra's open-source edition** adds scheduling, event triggers and approvals around your runs.
*   **For large enterprises with complex governance:** **Spacelift** and **Scalr** provide policy-driven platforms. **Kestra Enterprise Edition** adds features like RBAC, SSO, and audit trails for governing infrastructure workflows at scale. CAGIP, Crédit Agricole's IT production arm, used Kestra to transform its infrastructure operations and scale data workflows across more than 100 clusters.
*   **For developer-centric teams:** **Pulumi Cloud** is a strong fit if your team prefers writing code in languages like Python or TypeScript.
*   **For a self-hosted HCP Terraform-like experience:** **Terrakube** or **OTF** are the most direct open-source replacements, offering similar features on your own infrastructure.
*   **For cost visibility and environment management:** **env0** focuses on cloud cost visibility and the lifecycle of temporary environments.
*   **For unified orchestration across all domains:** **Kestra** fits when Terraform is one piece of a larger process that also involves data pipelines, AI models or legacy systems. A Fortune 500 industrial company replaced VMware Aria Automation with Kestra to cut costs and secure hybrid cloud automation across IT and OT.

Explore our hubs for [infrastructure automation](/infra-automation), [data orchestration](/data), and [AI automation](/ai-automation) to see how a unified approach can work.

## Migrating from Terraform Cloud: A Practical Guide

Migrating off HCP Terraform involves several steps to securely transfer your state and reconfigure your workflows.

1.  **Inventory Your Workspaces:** Document all your HCP Terraform workspaces, their associated VCS repositories, variables (both Terraform and environment), and any Sentinel policies.
2.  **Configure a New Backend:** Choose and configure your new state backend, such as an AWS S3 bucket with a DynamoDB table for state locking, a GCS bucket, or an Azure Blob Storage container.
3.  **Migrate State:** For each workspace, update your Terraform configuration to remove the `cloud` block and add a [`backend` block](https://developer.hashicorp.com/terraform/language/backend) pointing to your new backend. Then run [`terraform init -migrate-state`](https://developer.hashicorp.com/terraform/cli/commands/init). Terraform will prompt you to confirm the migration, download the state from HCP Terraform, and upload it to the new backend.
4.  **Recreate Variables:** Recreate your workspace variables in your new platform's secrets management system (e.g., Kestra's secrets, GitHub Actions secrets, or Vault).
5.  **Rebuild Triggers:** Replace HCP Terraform's VCS triggers by setting up webhooks in your Git repository that point to your new platform's API endpoint.
6.  **Port Policies:** If you use Sentinel, you will need to rewrite your policies using a new framework like OPA/Conftest.
7.  **Final Verification:** Before running your first `apply`, run a `terraform plan -refresh-only` in your new setup to confirm that your configuration matches the migrated state and there is no unexpected drift.

Here is an example Kestra flow that replaces a VCS-driven run with an approval gate. The plan file is saved as an output and passed to the apply step, so what gets applied is exactly what was approved:

```yaml
id: terraform-approval-workflow
namespace: company.infra

triggers:
  - id: on_git_push
    type: io.kestra.plugin.core.trigger.Webhook
    key: "{{ secret('GIT_WEBHOOK_KEY') }}"

tasks:
  - id: plan_workspace
    type: io.kestra.plugin.core.flow.WorkingDirectory
    tasks:
      - id: clone_for_plan
        type: io.kestra.plugin.git.Clone
        url: https://github.com/your-org/your-infra-repo
        branch: main
        password: "{{ secret('GITHUB_TOKEN') }}"

      - id: terraform_plan
        type: io.kestra.plugin.terraform.cli.TerraformCLI
        env:
          AWS_ACCESS_KEY_ID: "{{ secret('AWS_ACCESS_KEY_ID') }}"
          AWS_SECRET_ACCESS_KEY: "{{ secret('AWS_SECRET_ACCESS_KEY') }}"
        beforeCommands:
          - terraform init -input=false
        commands:
          - terraform plan -input=false -out=tfplan
        outputFiles:
          - tfplan

  - id: approval_gate
    type: io.kestra.plugin.core.flow.Pause
    description: Review the Terraform plan in the logs, then resume to apply.
    pauseDuration: PT8H
    behavior: CANCEL

  - id: apply_workspace
    type: io.kestra.plugin.core.flow.WorkingDirectory
    tasks:
      - id: clone_for_apply
        type: io.kestra.plugin.git.Clone
        url: https://github.com/your-org/your-infra-repo
        branch: main
        password: "{{ secret('GITHUB_TOKEN') }}"

      - id: terraform_apply
        type: io.kestra.plugin.terraform.cli.TerraformCLI
        env:
          AWS_ACCESS_KEY_ID: "{{ secret('AWS_ACCESS_KEY_ID') }}"
          AWS_SECRET_ACCESS_KEY: "{{ secret('AWS_SECRET_ACCESS_KEY') }}"
        inputFiles:
          tfplan: "{{ outputs.terraform_plan.outputFiles['tfplan'] }}"
        beforeCommands:
          - terraform init -input=false
        commands:
          - terraform apply -input=false tfplan

errors:
  - id: send_failure_alert
    type: io.kestra.plugin.slack.notifications.SlackIncomingWebhook
    url: "{{ secret('SLACK_WEBHOOK_URL') }}"
    payload: |
      {"text": "Terraform workflow failed: {{ flow.namespace }}.{{ flow.id }} (execution {{ execution.id }})."}
```

This workflow is triggered by a webhook from your Git repository. It clones the code, saves a `plan`, and pauses for a manual approval in the Kestra UI. If nobody approves within 8 hours, the execution is cancelled instead of applying. After approval, the saved plan is applied. If any step fails, a Slack notification is sent.

## Conclusion

HCP Terraform remains a capable platform, but licensing, its pricing model and vendor lock-in are pushing many organizations to look at alternatives. Whether you need a dedicated commercial TACO like Spacelift, a self-hosted open-source solution like Terrakube, or a broader orchestration platform like Kestra, there are more options than ever.

The right choice depends on your goals. If you want to keep the HCP Terraform experience but host it yourself, Terrakube is a strong contender. If your primary need is PR-based automation, Atlantis is simple and effective. But if you see IaC as one component of a larger, interconnected system of automated workflows, an orchestrator like Kestra runs those workflows, IaC included, from a single platform.

For more on infrastructure automation with Kestra, see our [infrastructure resources](/resources/infrastructure) and [HCP Terraform's own documentation](https://developer.hashicorp.com/terraform/cloud-docs) for the features you are replacing.
