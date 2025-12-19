---
title: Open-Source vs. Enterprise Edition
---

Understand the differences between Kestra's Open-Source and Enterprise Editions, and learn how the commercial offering supports teams running mission-critical workflows at scale.

## Overview

Kestra's Open-Source Edition provides a foundation for workflow automation — it's best suited for solo-developers or small teams exploring workflow orchestration.

The [Enterprise Edition](07.enterprise/index.md) adds enterprise-grade security, scalability, and governance features required by organizations managing complex workflows across multiple teams or environments. It includes advanced authentication and access controls with SSO, SCIM & RBAC, multi-tenancy, high availability, dedicated secrets manager and storage backends per team, dedicated worker groups or on-demand remote task runners, audit logs, service accounts, apps, revision history for every resource, maintenance mode, log shipper, cluster monitoring, backup and restore, and dedicated support with SLAs. In short, everything you need for production deployments with strict compliance or reliability requirements is available in the Enterprise Edition.

---

## Security and Access Control

The Open-Source Edition supports basic authentication, suitable for one-person projects or small teams with shared credentials. In contrast, the Enterprise Edition has an easy way to add collaborators via [invitations](07.enterprise/03.auth/invitations.md) and manage permissions at scale using [SCIM Directory Sync](07.enterprise/03.auth/scim/index.md). It integrates with many identity providers via [Single Sign-On (SSO)](07.enterprise/03.auth/sso/index.md) and **OpenID Connect (OIDC)**, simplifying user management for large teams.

[Role-Based Access Control (RBAC)](07.enterprise/03.auth/rbac.md) lets you define granular permissions at user, group and namespace level, e.g. restricting developer access to specific namespaces while granting auditors read-only access. [Namespace-level secrets management](07.enterprise/02.governance/secrets.md) ensures that sensitive credentials stay isolated between projects. [Service accounts](07.enterprise/03.auth/service-accounts.md) and [API tokens](07.enterprise/03.auth/api-tokens.md) enable secure automation, such as [CI/CD pipelines](version-control-cicd/index.md) deploying workflows without requiring user credentials.

For organizations using external [secrets managers](07.enterprise/02.governance/secrets-manager.md) such as Azure Key Vault or HashiCorp Vault, Enterprise Edition integrates directly with these systems. [SCIM directory sync](07.enterprise/03.auth/scim/index.md) automates user (de)provisioning at scale, reducing administrative overhead when onboarding or offboarding team members.

---

## Governance and Compliance

Enterprise Edition provides [audit logs](07.enterprise/02.governance/06.audit-logs.md) that track every user action and resource change, which are critical in highly regulated industries. Logs can be automatically exported to observability platforms such as Datadog or Elasticsearch using the [Log Shipper](07.enterprise/02.governance/logshipper.md).

[Multi-tenancy](07.enterprise/02.governance/tenants.md) allows you to create fully isolated environments, e.g. separate tenants for specific [teams or business units](14.best-practices/8.business-unit-separation.md). Each tenant can use separate secrets managers or dedicated internal storage backends (e.g., AWS S3 for Tenant A, GCS for Tenant B).

[Worker isolation](07.enterprise/04.scalability/worker-isolation.md) ensures tasks from different tenants run on separate infrastructure, reducing the risk of resource contention or cross-tenant breaches. Encryption safeguards data at rest and in transit, meeting regulatory standards.

---

## Scalability and Reliability

The Open-Source Edition runs by default on a single server, which can become a bottleneck for large workloads. Enterprise Edition can use Kafka and Elasticsearch for distributed event processing, enabling horizontal scaling and high throughput. High Availability (HA) architecture eliminates single points of failure — if a worker node fails, tasks automatically reroute to healthy nodes.

[Worker Groups](07.enterprise/04.scalability/worker-group.md) let you assign tasks to specialized infrastructure. For example, GPU-heavy machine learning workflows can target a worker group with NVIDIA GPUs, while ETL jobs run on cost-optimized spot instances. [Task Runners](07.enterprise/04.scalability/task-runners.md) offload compute-intensive scripts on-demand to Kubernetes or cloud batch services such as Azure Batch, Google Cloud Run or AWS ECS Fargate to prevent resource contention and making it easy to scale in a cost-effective way.

:::alert{type="info"}
Please note that Worker Groups are not yet available in Kestra Cloud, only in Kestra Enterprise Edition.
:::

[Maintenance Mode](07.enterprise/05.instance/maintenance-mode.md) allows safe upgrades: new executions queue while in-progress tasks complete gracefully, avoiding abrupt workflow termination. [Cluster monitoring](07.enterprise/05.instance/index.md) provides real-time visibility into resource usage, helping teams proactively address infrastructure bottlenecks. Additionally, using **Custom Dashboards**, you can create custom views to track specific metrics, logs, or executions. The [Backup and Restore](10.administrator-guide/backup-and-restore.md) eliminates the risk of data loss or corruption during upgrades, allowing you to recover from accidental deletions or system failures.

---

## Productivity and Collaboration

[Custom Blueprints](07.enterprise/02.governance/custom-blueprints.md) act as reusable workflow templates, e.g. a **standardized** data ingestion pattern that all teams can consistently adopt. **Full-text search across task runs** speeds up navigation — e.g. engineers can quickly find logs for a failed Python script without manually filtering through thousands of executions.

**Centralized** namespace-level [plugin defaults](07.enterprise/02.governance/07.namespace-management.md) simplify configuration. A [namespace-wide setting](07.enterprise/02.governance/07.namespace-management.md) on a root namespace might **define AWS credentials** that will be automatically inherited, and optionally also enforced, by all child namespaces, eliminating redundant code and allowing admins to centrally govern secrets and plugin configurations.

**Impersonation** lets admins validate permissions by temporarily assuming a user’s role, which significantly helps with troubleshooting access management issues.

[Apps](07.enterprise/04.scalability/apps.md) turn workflows into user-friendly interfaces. A finance team can build a self-service tool for expense approvals, where non-technical stakeholders can submit requests via a form. Approved requests automatically trigger downstream tasks to process payments.

---

## Support and Services

Enterprise Edition includes **SLAs with guaranteed response times** for support tickets, which is critical for teams running 24/7-operations. Onboarding support helps customize Kestra to your stack and deployment requirements.

Customers’ feature requests are prioritized over those from open-source users. They also get early access to beta features and roadmap previews, allowing teams to plan upgrades around upcoming capabilities. The dedicated customer portal provides direct access to Kestra’s engineering team for architecture reviews or best practices.

---

## When to Choose Enterprise Edition

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

## How Upgrading Works

Switching to Enterprise involves adding a license key to your configuration and restarting Kestra — no code changes required. All existing workflows and plugins remain compatible. For hybrid setups, you can run Open-Source and Enterprise instances side-by-side during transition periods.
