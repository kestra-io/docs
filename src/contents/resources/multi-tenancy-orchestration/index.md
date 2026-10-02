---
title: "Multi-Tenancy Orchestration: Unifying Workflows for Isolated Environments"
description: "Multi-tenancy orchestration runs workflows for many teams or customers on one platform while keeping their flows, data, and secrets isolated. Learn the isolation models, the trade-offs, and how tenants work in Kestra."
metaTitle: "Multi-Tenancy Orchestration Explained"
metaDescription: "Multi-tenancy orchestration runs workflows for many teams or customers on one platform. Learn the isolation models, trade-offs, and how Kestra tenants work."
tag: infrastructure
date: 2026-10-02
slug: multi-tenancy-orchestration
faq:
  - question: What is multi-tenancy in the context of orchestration?
    answer: Multi-tenancy in orchestration refers to a single instance of an orchestrator serving multiple independent tenants. Each tenant's workflows, data, and resources are isolated, yet managed from a shared platform, ensuring efficiency and cost-effectiveness while maintaining security and performance.
  - question: Why is isolation critical for multi-tenant orchestration?
    answer: Isolation prevents data leakage, maintain security, and ensure performance fairness between tenants. It guarantees that one tenant's activities or failures do not impact others, protecting sensitive information and maintaining service level agreements.
  - question: How does multi-tenancy orchestration benefit cloud-native applications?
    answer: Multi-tenancy orchestration allows cloud-native applications to efficiently share underlying infrastructure, reducing operational costs and keeping shared resources busy. It enables rapid scaling and simplified management of diverse customer workloads on a single, unified platform.
  - question: Can Kestra support multi-tenancy for different programming languages?
    answer: Yes, Kestra is language-agnostic. While workflows are defined in YAML, tasks can be executed in any language (Python, Java, Shell, etc.). This allows multi-tenant environments to support diverse developer preferences and existing codebases without vendor lock-in.
  - question: What are common challenges in implementing multi-tenancy orchestration?
    answer: Key challenges include data isolation, managing dynamic resource allocation, handling tenant-specific configurations, and providing granular access control. Orchestration platforms must address these to prevent cross-tenant interference and maintain service quality.
  - question: How does Kestra ensure tenant isolation?
    answer: "In Kestra Enterprise and Kestra Cloud, a tenant is an isolated environment inside one instance: flows, triggers, executions, logs, secrets, RBAC, and internal storage are all scoped to it, and the same flow ID can exist in several tenants. Each tenant can also use its own storage and secrets backend. Namespaces then organize work inside a tenant, and worker groups can route tasks to dedicated workers."
---
> **TL;DR** — Multi-tenancy orchestration runs workflows for several teams, business units, or customers on one shared orchestration platform, while each tenant's flows, executions, secrets, and data stay isolated from the others. The design choice is how strong that isolation must be: a logical boundary in one instance, dedicated storage and secrets per tenant, or separate instances.

Managing diverse workloads for multiple customers or internal teams on a shared platform presents a unique set of challenges. Keeping these "tenants" isolated, sharing resources fairly, and controlling who can see what gets harder with every new team. Without a clear model, the savings of shared infrastructure are eaten by one-off exceptions, duplicated instances, and access reviews nobody can complete. Multi-tenancy orchestration is the answer to that problem.

## How Multi-Tenancy Orchestration Works

Multi-tenancy orchestration is an architectural approach where a single instance of an orchestration platform serves multiple, independent tenants. Each tenant operates as if they have their own dedicated environment, but they are all running on a shared, centrally managed infrastructure.

### Defining Multi-Tenancy

In a multi-tenant architecture, a single software application and its supporting infrastructure serve multiple customers or user groups (tenants). Each tenant's data is isolated and remains invisible to other tenants. This model is common in SaaS applications, internal developer platforms, and cloud services, where it allows for efficient resource sharing and economies of scale. The same idea exists one layer down: [Kubernetes multi-tenancy](https://kubernetes.io/docs/concepts/security/multi-tenancy/) isolates workloads at the cluster level, while an orchestrator isolates the workflows, secrets, and execution history that run on top.

### Key Components of Multi-Tenancy Orchestration

A multi-tenancy orchestration system is built on several core components that work together to provide isolation, efficiency, and scalability:

*   **Shared Infrastructure:** All tenants use the same underlying compute, storage, and networking resources. This pooling is the foundation for cost efficiency.
*   **Logical Separation:** Tenants are separated through logical constructs like namespaces, not physical hardware. This allows for flexible and dynamic allocation of resources.
*   **Resource Pooling and Management:** The orchestrator manages a pool of resources and allocates them to tenants based on demand, policies, and quotas, preventing any single tenant from monopolizing the system.
*   **Tenant-Specific Configuration:** Each tenant can have unique configurations, workflows, and secrets, which the orchestrator manages securely and applies at runtime. This matters for supporting diverse use cases on a single platform, especially in complex [Kubernetes workflow orchestration](/resources/infrastructure/kubernetes-workflow-orchestration) environments.

### Choosing an isolation model

There is no single right level of isolation; it depends on who the tenants are and what a breach would cost.

| Model | How it isolates | Good fit | Trade-off |
|---|---|---|---|
| **Shared instance, logical tenants** | Flows, executions, secrets, and permissions scoped per tenant in one deployment | Internal teams, environments such as dev/staging/prod | Tenants share the same storage and secrets backend by default |
| **Shared instance, dedicated backends** | Logical tenants plus a separate storage bucket and secrets manager per tenant | External customers, regulated business units | More configuration per tenant |
| **Instance per tenant** | A separate deployment for each tenant | Strict contractual or sovereignty requirements | Highest cost and the most upgrades to run |

Most platforms combine the first two: logical tenants by default, dedicated backends for the tenants whose data needs it. The [silo, pool, and bridge models](https://docs.aws.amazon.com/whitepapers/latest/saas-architecture-fundamentals/tenant-isolation.html) described in AWS's SaaS guidance follow the same logic.

## Why Multi-Tenancy Needs Orchestration

Simply running multiple tenants on shared hardware is not enough. Orchestration is the layer that makes the architecture viable, secure, and efficient by addressing several key challenges.

### Ensuring Isolation and Security

The primary concern in any multi-tenant system is preventing cross-tenant access. An orchestrator enforces strict boundaries to protect data and processes.

*   **Data Isolation:** Workflows and their artifacts must be strictly confined to their own tenant's context. The orchestrator ensures that a workflow from Tenant A cannot read or write data belonging to Tenant B.
*   **Access Control:** [Role-Based Access Control (RBAC)](/resources/infrastructure/rbac-workflow-orchestration) is required. The orchestration platform must manage permissions granularly, ensuring users can only see and interact with their own tenant's resources.
*   **Preventing "Noisy Neighbors":** One tenant's high resource consumption or faulty workflow should not impact the performance of others. The orchestrator implements resource quotas and throttling to guarantee fair use.
*   **Compliance:** For regulated industries, provable isolation is a compliance requirement. The orchestrator provides the necessary audit trails and controls to meet these standards, forming a cornerstone of [workflow orchestration security](/resources/infrastructure/workflow-orchestration-security).

### Managing Resource Allocation and Cost

Effective orchestration turns shared infrastructure from a potential liability into a significant cost advantage.

*   **Dynamic Scaling:** The orchestrator can scale resources up or down based on the collective demand of all tenants, which keeps resources busier than dedicating resources to each tenant.
*   **Resource Quotas:** By setting limits on CPU, memory, and concurrency per tenant, the platform ensures predictable performance and prevents cost overruns in a [multi-cloud orchestration](/resources/infrastructure/multi-cloud-orchestration) setup.
*   **Cost Attribution:** The orchestrator tracks resource usage per tenant, allowing for accurate cost allocation and chargeback models. This turns IT from a cost center into a value-driven service provider.
*   **Optimizing Shared Compute:** By scheduling workflows from different tenants across the same resource pool, the platform keeps hardware busy, which is where most [open-source orchestration cost savings](/resources/infrastructure/open-source-orchestration-cost-savings) come from.

### Automating Tenant Onboarding and Lifecycle

Manual tenant management is not scalable. Orchestration automates the entire tenant lifecycle, from initial setup to decommissioning.

*   **Automated Provisioning:** New tenants can be onboarded via API calls, automatically creating their namespaces, setting up default workflows, and configuring permissions.
*   **Configuration Management:** The orchestrator is the central point for managing tenant-specific configurations, integrating with tools like Git to enable [GitOps](/resources/infrastructure/gitops) practices.
*   **Tenant-Specific Workflow Deployment:** Workflows can be deployed, updated, and versioned on a per-tenant basis, integrating with [CI/CD orchestration](/resources/infrastructure/ci-cd-orchestration) pipelines.

## Orchestrate Multi-Tenant Workflows with Kestra: Isolated Environments for Every Team

In [Kestra Enterprise and Kestra Cloud](/docs/enterprise/governance/tenants), a tenant is an isolated environment inside a single instance. Flows, triggers, executions, logs, audit logs, secrets, and RBAC are all scoped to the tenant, internal storage is separated by tenant, and most API endpoints carry the tenant ID in their path. Because of that, the same flow, with the same ID and namespace, can be deployed in several tenants without collision. Namespaces then organize work inside each tenant. Kestra's [multi-tenancy architecture](/docs/architecture/multi-tenancy) page describes how this is implemented.

Tenants can be created from the UI, the CLI, the API, or Terraform, which makes onboarding scriptable:

```hcl
resource "kestra_tenant" "acme" {
  tenant_id = "acme"
  name      = "Acme Corp"
}
```

Once the tenant exists, the same flow definition can be deployed into it. The flow below handles a request for whichever tenant it runs in:

```yaml
id: tenant-report
namespace: company.platform

inputs:
  - id: reportType
    type: STRING
    defaults: daily

triggers:
  - id: webhook
    type: io.kestra.plugin.core.trigger.Webhook
    key: replace-with-a-long-random-key
    inputs:
      reportType: "{{ trigger.body.reportType ?? 'daily' }}"

tasks:
  - id: log-request
    type: io.kestra.plugin.core.log.Log
    message: "Report '{{ inputs.reportType }}' requested"

  - id: build-report
    type: io.kestra.plugin.core.flow.WorkingDirectory
    tasks:
      - id: run-report-script
        type: io.kestra.plugin.scripts.shell.Commands
        env:
          REPORT_TYPE: "{{ inputs.reportType }}"
          API_TOKEN: "{{ secret('REPORTING_API_TOKEN') }}"
        commands:
          - mkdir -p output
          - echo "Building $REPORT_TYPE report at $(date)" > output/report.txt
```

### What's worth noticing in this flow:

*   **One definition, many tenants:** The flow is identical in every tenant. Its webhook URL includes the tenant ID (`/api/v1/{tenant}/executions/webhook/company.platform/tenant-report/{key}`), so each tenant gets its own endpoint and its own execution history.
*   **Tenant-scoped secrets:** `secret('REPORTING_API_TOKEN')` resolves inside the tenant that runs the flow, so each customer or team keeps its own credentials, and with a dedicated secrets backend, its own vault.
*   **Isolated working files:** The `WorkingDirectory` task gives the execution its own temporary filesystem, and the shell task runs in a container by default, so files from one run are not visible to another.
*   **Inputs passed as environment variables:** The webhook input reaches the script through `env` rather than being pasted into the command line, which keeps tenant-supplied values out of the shell syntax.

Beyond the logical boundary, each tenant can be given a dedicated storage and secrets backend, and [worker groups](/docs/enterprise/scalability/worker-group) can route a tenant's tasks to dedicated workers when compute must be separated too. This lets teams run the whole [infrastructure from one control plane](/infra-automation), including [Kubernetes](/orchestration/kubernetes) workloads, without giving every tenant its own instance.

## Where Multi-Tenancy Orchestration Pays Off

This architectural pattern delivers significant value across various industries and use cases:

*   **SaaS Provider Backends:** Automate customer-specific data processing, reporting, and integration workflows while maintaining strict data isolation. This is a core use case for [workflow orchestration for software providers](/use-cases/software-providers).
*   **Internal Developer Platforms (IDPs):** Provide engineering teams with self-service, isolated environments for CI/CD, testing, and application deployment on a shared platform infrastructure.
*   **Public Sector and Regulated Industries:** Manage workflows for different business units or clients while enforcing strict compliance and auditability. [Dataport](/customers/dataport), Germany's public-sector IT services provider, standardized API-driven cloud orchestration on private cloud with Kestra, a government-grade orchestration control plane.
*   **Shared Platforms at Scale:** [CAGIP, Crédit Agricole's IT production arm](/customers/credit-agricole), transformed infrastructure operations and scaled data workflows across more than 100 clusters, and [Acxiom](/customers/acxiom) modernized its Big Data orchestration with Kestra while keeping its existing DevOps and GitOps practices.
*   **Cost Reduction:** Consolidate disparate automation scripts and scheduling tools onto a single platform, reducing infrastructure footprint and operational overhead.

## Related concepts

*   [Kubernetes Workflow](/resources/infrastructure/kubernetes-workflow)
*   [Workflow Engine](/resources/infrastructure/workflow-engine)
*   [Job Orchestration](/resources/infrastructure/job-orchestration)
*   [Event-Driven Orchestration](/resources/infrastructure/event-driven-orchestration)
*   [Infrastructure Orchestration](/resources/infrastructure/infrastructure-orchestration)
*   [Self-Hosted Workflow Orchestration](/resources/infrastructure/self-hosted-workflow-orchestration)
