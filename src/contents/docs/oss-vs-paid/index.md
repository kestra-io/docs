---
title: Open-Source vs. Enterprise Edition of Kestra
h1: "Choose the Right Kestra Edition: OSS vs. Enterprise"
description: Compare Kestra Open-Source and Enterprise editions to choose the right solution for your orchestration, security, and scalability needs.
---

Understand the differences between Kestra's Open-Source and Enterprise Editions, and learn how the commercial offering supports teams running mission-critical workflows at scale.

## Choose the right Kestra edition

Kestra's Open-Source Edition is a fully functional orchestration platform suitable for individuals, teams, and production deployments that don't require enterprise security, multi-tenancy, or compliance controls.

The [Enterprise Edition](../07.enterprise/index.mdx) adds enterprise-grade security, scalability, and governance for organizations managing complex workflows across multiple teams or environments: SSO, SCIM, and RBAC for access control; multi-tenancy and worker isolation for separation; high availability and dedicated worker groups for scale; audit logs, log shipper, and cluster monitoring for observability; asset lineage, versioned plugins, read-only secrets, and allowed-plugin lists for governance; apps, custom blueprints, and policies for productivity; and dedicated support with SLAs. Everything you need for production deployments with strict compliance or reliability requirements.

---

## Security and access control

The Open-Source Edition supports basic authentication, suitable for one-person projects or small teams with shared credentials. In contrast, the Enterprise Edition has an easy way to add collaborators via [invitations](../07.enterprise/03.auth/invitations/index.md) and manage permissions at scale using [SCIM Directory Sync](../07.enterprise/03.auth/scim/index.mdx). It integrates with many identity providers via [Single Sign-On (SSO)](../07.enterprise/03.auth/sso/index.md) and OpenID Connect (OIDC), simplifying user management for large teams.

[Role-Based Access Control (RBAC)](../07.enterprise/03.auth/rbac/index.md) uses a resource and action model — `FLOW: EXECUTE`, `EXECUTION: ACCESS_LOGS`, `TRIGGER: BACKFILL` — so you can grant exactly what a user needs without over-provisioning. Define permissions at user, group, and namespace level, e.g. restricting developer access to specific namespaces while granting auditors read-only access. [Namespace-level secrets management](../07.enterprise/02.governance/secrets-manager/index.md) ensures that sensitive credentials stay isolated between projects. [Service accounts](../07.enterprise/03.auth/service-accounts/index.md) and [API tokens](../07.enterprise/03.auth/api-tokens/index.md) enable secure automation, such as [CI/CD pipelines](../version-control-cicd/index.mdx) deploying workflows without requiring user credentials.

For organizations using external [secrets managers](../07.enterprise/02.governance/secrets-manager/index.md) such as Azure Key Vault or HashiCorp Vault, Enterprise Edition integrates directly with these systems. [SCIM directory sync](../07.enterprise/03.auth/scim/index.mdx) automates user (de)provisioning at scale, reducing administrative overhead when onboarding or offboarding team members.

Enterprise-only safeguards include [read-only secrets](../07.enterprise/02.governance/secrets-manager/index.md) for least-privilege access, [allowed plugins](../07.enterprise/02.governance/allowed-plugins/index.md) to centrally control which plugins may run, and [Policies](../07.enterprise/02.governance/policies/index.md) to inject or enforce plugin configuration across namespaces without modifying flow YAML.

---

## Governance and compliance

Enterprise Edition provides [audit logs](../07.enterprise/02.governance/06.audit-logs/index.md) that track every user action and resource change, which are critical in highly regulated industries. Logs can be automatically exported to observability platforms such as Datadog or Elasticsearch using the [Log Shipper](../07.enterprise/02.governance/logshipper/index.md).

[Multi-tenancy](../07.enterprise/02.governance/tenants/index.md) allows you to create fully isolated environments, e.g. separate tenants for specific [teams or business units](../14.best-practices/8.business-unit-separation/index.md). Each tenant can use separate secrets managers or dedicated internal storage backends (e.g., AWS S3 for Tenant A, GCS for Tenant B).

[Worker Groups](../07.enterprise/04.scalability/worker-group/index.md) ensure tasks from different tenants run on separate infrastructure, reducing the risk of resource contention or cross-tenant breaches. [Worker Isolation](../07.enterprise/02.governance/worker-isolation/index.md) adds hard isolation policies when you need stricter separation. Encryption safeguards data at rest and in transit, meeting regulatory standards.

---

## Scalability and reliability

The Open-Source Edition runs by default on a single server, which can become a bottleneck for large workloads. Enterprise Edition can use Kafka (paired with Elasticsearch for the search and read model), Redis, AMQP, or GCP Pub/Sub as the queue backend, enabling horizontal scaling and high throughput. High Availability (HA) architecture eliminates single points of failure — if a worker node fails, tasks automatically reroute to healthy nodes.

[Worker Groups](../07.enterprise/04.scalability/worker-group/index.md) let you assign tasks to specialized infrastructure. For example, GPU-heavy machine learning workflows can target a worker group with NVIDIA GPUs, while ETL jobs run on cost-optimized spot instances. [Task Runners](../07.enterprise/04.scalability/task-runners/index.md) offload compute-intensive scripts on-demand to Kubernetes or cloud batch services such as Azure Batch, Google Cloud Run, or AWS ECS Fargate, preventing resource contention and scaling costs with usage.

:::alert{type="info"}
Worker Groups are available in Kestra Enterprise Edition only, not in Kestra Cloud.
:::

The [External Log Data Store](../10.administrator-guide/log-data-store/index.md) routes execution logs to a dedicated JDBC database (OSS) or Elasticsearch (EE), keeping the main database lean and reducing schema migration time.

[Maintenance Mode](../07.enterprise/05.instance/maintenance-mode/index.md) allows safe upgrades: new executions queue while in-progress tasks complete gracefully, avoiding abrupt workflow termination. [Cluster monitoring](../07.enterprise/05.instance/index.mdx) provides real-time visibility into resource usage, helping teams proactively address infrastructure bottlenecks. **Custom Dashboards** let you create custom views to track specific metrics, logs, or executions. [Backup and Restore](../10.administrator-guide/backup-and-restore/index.md) lets you recover from accidental deletions, data corruption, or failed upgrades.

[Versioned Plugins](../07.enterprise/05.instance/versioned-plugins/index.md) let you pin plugin versions per environment for safe rollouts, while the [Kill Switch](../07.enterprise/05.instance/kill-switch/index.md) can pause risky changes instantly. [Announcements](../07.enterprise/05.instance/announcements/index.md) provide in-product notifications for maintenance or policy updates.

---

## Productivity and collaboration

[Custom Blueprints](../07.enterprise/02.governance/custom-blueprints/index.md) act as reusable workflow templates, e.g. a standardized data ingestion pattern that all teams can consistently adopt. Templated Blueprints extend this further: non-technical users fill in a form and Kestra generates the flow YAML — no YAML editing required. Blueprint libraries can be version-controlled with Git using `PushBlueprints` and `SyncBlueprints`, the same GitOps pattern as flows. **Full-text search across task runs** speeds up navigation — e.g. engineers can quickly find logs for a failed Python script without manually filtering through thousands of executions.

[Policies](../07.enterprise/02.governance/policies/index.md) let administrators inject, validate, and enforce plugin configuration across namespaces without touching individual flow YAML. A policy can automatically add credentials to every task of a given plugin type, block flows that use disallowed plugins, or enforce required properties at the namespace level — all without requiring developers to change their flows.

**Impersonation** lets admins assume a user’s role temporarily to validate permissions and troubleshoot access issues.

[Apps](../07.enterprise/04.scalability/apps/index.md) turn workflows into user-friendly interfaces. A finance team can build a self-service tool for expense approvals, where non-technical stakeholders can submit requests via a form. Approved requests automatically trigger downstream tasks to process payments.

[Reusable Inputs](../05.workflow-components/22.reusable-inputs/index.md) let teams define shared input groups once at the namespace level and reference them across flows — no repeated declarations, and updates propagate automatically on the next execution.

[Asset Lineage](../07.enterprise/02.governance/01.assets/index.md) tracks data dependencies across flows, and [Unit Tests](../07.enterprise/02.governance/unit-tests/index.md) let teams validate flows early to prevent regressions.

---

## Support and services

Enterprise Edition includes **SLAs with guaranteed response times** for support tickets, which is critical for teams running 24/7 operations. Onboarding support helps customize Kestra to your stack and deployment requirements.

Customers’ feature requests are prioritized over those from open-source users. They also get early access to beta features and roadmap previews, allowing teams to plan upgrades around upcoming capabilities. The dedicated customer portal provides direct access to Kestra’s engineering team for architecture reviews or best practices.

---

## When to choose Enterprise Edition

**Stick with Open-Source if:**
- You’re a solo developer
- You’re prototyping or running non-critical workflows
- Your team has minimal compliance requirements
- You can manage secrets and access controls manually

**Upgrade to Enterprise if:**
- Multiple users or teams share the same Kestra instance
- Workflows handle sensitive data (PII, financial records)
- Downtime would impact business operations
- You need to meet audit or regulatory standards

---

## How upgrading works

Switching to Enterprise involves adding a license key to your configuration and restarting Kestra — no code changes required. All existing workflows and plugins remain compatible. For hybrid setups, you can run Open-Source and Enterprise instances side-by-side during transition periods.
