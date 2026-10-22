---
title: Open-Source vs. Enterprise Edition of Kestra
h1: "Choose the Right Kestra Edition: OSS vs. Enterprise"
description: Compare Kestra Open-Source and Enterprise editions to choose the right solution for your orchestration, security, and scalability needs.
---

Understand the differences between Kestra's Open-Source and Enterprise Editions, and learn how the commercial offering supports teams running mission-critical workflows at scale.

## Choose the right Kestra edition

Kestra's Open-Source Edition is a fully functional orchestration platform suitable for individuals, teams, and production deployments that don't require enterprise security, multi-tenancy, or compliance controls.

The [Enterprise Edition](../07.enterprise/index.mdx) adds enterprise-grade security, scalability, and governance for organizations managing complex workflows across multiple teams or environments: SSO, SCIM, and RBAC for access control; multi-tenancy and worker isolation for separation; high-throughput queue backends and dedicated worker groups for scale; audit logs, log shipper, and service health monitoring for observability; asset lineage, versioned plugins, read-only secrets, and allowed-plugin lists for governance; apps, custom blueprints, and policies for productivity; and dedicated support with SLAs. Together, these cover production deployments with strict security, compliance, or support requirements.

---

## Security and access control

The Open-Source Edition supports a single Basic Authentication account, so everyone who uses the instance shares one username and password. The Enterprise Edition adds individual user accounts: add collaborators with [invitations](../07.enterprise/03.auth/invitations/index.md), sync users and groups from your identity provider with [SCIM Directory Sync](../07.enterprise/03.auth/scim/index.mdx), and sign in through [Single Sign-On (SSO)](../07.enterprise/03.auth/sso/index.md) with OpenID Connect (OIDC) or LDAP.

[Role-Based Access Control (RBAC)](../07.enterprise/03.auth/rbac/index.md) uses a resource and action model, such as `FLOW: EXECUTE`, `EXECUTION: ACCESS_LOGS`, or `TRIGGER: BACKFILL`, so you can grant exactly what a user needs without over-provisioning. Assign roles to users, groups, or service accounts, and limit each assignment to specific namespaces, for example restricting developers to their team's namespaces while granting auditors read-only access. [Namespace-level secrets](../06.concepts/04.secret/index.md#enterprise-edition) keep sensitive credentials isolated between projects. [Service accounts](../07.enterprise/03.auth/service-accounts/index.md) and [API tokens](../07.enterprise/03.auth/api-tokens/index.md) enable secure automation, such as [CI/CD pipelines](../version-control-cicd/index.mdx) deploying workflows without requiring user credentials.

For organizations using external [secrets managers](../07.enterprise/02.governance/secrets-manager/index.md) such as Azure Key Vault or HashiCorp Vault, Enterprise Edition integrates directly with these systems.

Enterprise-only safeguards include [read-only secrets](../07.enterprise/02.governance/secrets-manager/index.md) for least-privilege access, [allowed plugins](../07.enterprise/02.governance/allowed-plugins/index.md) to centrally control which plugins may run, and [Policies](../07.enterprise/02.governance/policies/index.md) to inject, validate, or enforce flow and plugin configuration across namespaces and tenants.

---

## Governance and compliance

Enterprise Edition provides [audit logs](../07.enterprise/02.governance/06.audit-logs/index.md) that track every user action and resource change, which are critical in highly regulated industries. Logs can be automatically exported to observability platforms such as Datadog or Elasticsearch using the [Log Shipper](../07.enterprise/02.governance/logshipper/index.md).

[Multi-tenancy](../07.enterprise/02.governance/tenants/index.md) allows you to create fully isolated environments, e.g. separate tenants for specific [teams or business units](../14.best-practices/8.business-unit-separation/index.md). Each tenant can use separate secrets managers or dedicated internal storage backends (e.g., AWS S3 for Tenant A, GCS for Tenant B).

[Worker Groups](../07.enterprise/04.scalability/worker-group/index.md) route tasks to dedicated worker pools through Worker Queues. Restrict a queue to specific tenants and reserve capacity for each one, so tenants don't compete for the same workers. [Worker Isolation](../07.enterprise/02.governance/worker-isolation/index.md) restricts file system access and plugin classes on shared workers and isolates script tasks. Enterprise Edition also encrypts traffic between workers and the Worker Controller with [TLS or mutual TLS](../security-hardening/index.md).

---

## Scalability and reliability

Both editions run in production, either as a standalone server or as a distributed cluster where each server role scales independently. Enterprise Edition raises the throughput ceiling with additional queue backends: Kafka (optionally paired with Elasticsearch as the repository backend), Redis, and AMQP. To compare deployment modes and backends, see [Deployment Architecture](../08.architecture/03.deployment-architecture/index.md).

[Worker Groups](../07.enterprise/04.scalability/worker-group/index.md) also route tasks to specialized infrastructure. A task declares tags such as `gpu`, and any worker group subscribed to the matching Worker Queue picks it up, whether that group runs on NVIDIA GPU machines or cost-optimized spot instances. [Task Runners](../task-runners/index.mdx) offload compute-intensive scripts on demand, preventing resource contention and scaling costs with usage. Process and Docker task runners are available in both editions; Enterprise Edition adds [runners](../task-runners/04.types/index.mdx) for Kubernetes and cloud services such as AWS Batch, Azure Batch, Google Batch, and Google Cloud Run.

The [External Log Data Store](../10.administrator-guide/log-data-store/index.md) (EE) routes execution logs to a dedicated backend (a JDBC database, Elasticsearch, Splunk, or Datadog), separate from the main backend, keeping the main database lean and reducing schema migration time.

[Maintenance Mode](../07.enterprise/05.instance/maintenance-mode/index.md) allows safe upgrades: new and restarted executions are held while workers finish their current tasks, and everything resumes when maintenance ends. The [Instance Owner console](../07.enterprise/05.instance/index.mdx) shows the health and state of every Kestra service, with per-service metrics such as CPU usage. [Custom Dashboards](../09.ui/00.dashboard/index.md#custom-dashboards) let you create custom views to track specific metrics, logs, or executions. A built-in [metadata backup and restore](../10.administrator-guide/backup-and-restore/index.md) supports disaster recovery and migration between instances, versions, or backends.

[Versioned Plugins](../07.enterprise/05.instance/versioned-plugins/index.md) let you pin plugin versions per task, flow, namespace, or instance for safe rollouts, while the [Kill Switch](../07.enterprise/05.instance/kill-switch/index.md) lets administrators instantly kill, cancel, or ignore runaway executions across a tenant, namespace, flow, or single execution. [Announcements](../07.enterprise/05.instance/announcements/index.md) display in-app banners for maintenance or policy updates.

---

## Productivity and collaboration

[Custom Blueprints](../07.enterprise/02.governance/custom-blueprints/index.md) act as reusable workflow templates, e.g. a standardized data ingestion pattern that all teams can consistently adopt. [Templated Blueprints](../07.enterprise/02.governance/custom-blueprints/index.md#templated-blueprints) extend this further: non-technical users fill in a form and Kestra generates the flow YAML. Blueprint libraries can be [version-controlled with Git](../07.enterprise/02.governance/custom-blueprints/index.md#version-control-for-custom-blueprints) using `PushBlueprints` and `SyncBlueprints`, the same GitOps pattern as flows.

[Policies](../07.enterprise/02.governance/policies/index.md) let administrators inject, validate, and enforce plugin configuration across namespaces. A policy can automatically add credentials to every task of a given plugin type, block flows that use disallowed plugins, or enforce required properties at the namespace level. Injected values apply without editing each flow, and validation rules reject non-compliant flows when they are saved.

[Impersonation](../07.enterprise/03.auth/rbac/index.md#impersonate) lets Instance Owners view Kestra as a specific user to verify that user's effective permissions and troubleshoot access issues.

[Apps](../07.enterprise/04.scalability/apps/index.md) turn workflows into user-friendly interfaces. A finance team can build a self-service tool for expense approvals, where non-technical stakeholders can submit requests via a form. Approved requests automatically trigger downstream tasks to process payments.

[Reusable Inputs](../05.workflow-components/22.reusable-inputs/index.md) let teams define shared input groups once at the namespace level and reference them across flows. Flows that don't pin a `revision` pick up changes on their next execution.

[Asset Lineage](../07.enterprise/02.governance/01.assets/index.md) tracks data dependencies across flows, and [Unit Tests](../07.enterprise/02.governance/unit-tests/index.md) let teams validate flows early to prevent regressions.

---

## Support and services

Enterprise Edition includes **SLAs with guaranteed response times** for support tickets, which is critical for teams running 24/7 operations. Onboarding support helps customize Kestra to your stack and deployment requirements.

Customers’ feature requests are prioritized over those from open-source users. They also get early access to beta features and roadmap previews, allowing teams to plan upgrades around upcoming capabilities. The dedicated customer portal provides direct access to Kestra’s engineering team for architecture reviews or best practices.

---

## When to choose Enterprise Edition

**Stick with Open-Source if:**
- You’re an individual or a team that doesn't need SSO, RBAC, or multi-tenant isolation
- Your team can operate and support the deployment in-house
- Your team has minimal compliance requirements
- A shared login and secrets supplied as environment variables meet your security requirements

**Upgrade to Enterprise if:**
- Multiple users or teams share the same Kestra instance
- Workflows handle sensitive data (PII, financial records)
- You need SLA-backed support for business-critical workflows
- You need to meet audit or regulatory standards

---

## How upgrading works

Moving to Enterprise Edition means deploying the Enterprise image or binary with your license and completing the first-run setup. Flow YAML carries over unchanged: export your flows from the Open-Source UI and import them into Enterprise. Namespace Files, KV Store entries, and secrets are migrated separately. See [Set up Enterprise Edition](../07.enterprise/01.overview/02.setup/index.md) and [Migrate from Open Source](../07.enterprise/01.overview/03.migrate-from-oss/index.md).
