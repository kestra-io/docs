---
title: Why Kestra Enterprise Edition?
icon: /docs/icons/admin.svg
---

Discover the features only available in Kestra Enterprise Edition and why it is the best option for teams using Kestra.

# Kestra Open-Source vs. Paid

## TL;DR

The Kestra Open-Source Edition is ideal for teams looking to explore workflow automation without additional costs. 
However, organizations that require enterprise-grade security, governance, performance, and dedicated support will benefit significantly from the Kestra Enterprise Edition.

## Security & Access Control

When it comes to access control, the Enterprise Edition has enhanced capabilities compared to open source.
While the basic authentication of the open-source version may be adequate for single-user applications or development projects, the security of the Enterprise Edition provided by integrated [**Single Sign-On (SSO)**](../03.auth-users/05.sso.md) and **OpenID Connect (OIDC)** authentication is desirable for multi-user instances.
The Enterprise Edition allows seamless access management through various identity providers. It also introduces [**Role-Based Access Control (RBAC)**](../03.auth-users/rbac.md) and [**Namespace-Level Permissions**](../02.governance/07.namespace-management.md), ensuring fine-grained control over user actions within specific workflow environments.

For managing sensitive credentials, the Enterprise Edition includes [**Secret Manager Integrations**](../02.governance/secrets-manager.md) and **Namespace-Level Secrets Management**, which help securely store and control access to secrets.
Secrets can be implemented in the open-source version with the [Key Value Store](../../05.concepts/05.kv-store.md), but this may not be enough for certain use cases.
Additionally, [Service Accounts](../03.auth-users/service-accounts.md) & [API Tokens](../03.auth-users/api-tokens.md) allow automated and programmatic interactions with the Kestra platform. To streamline user provisioning and governance, [**SCIM Directory Sync**](../03.auth-users/scim/index.md) ensures synchronization of users and groups with identity providers.

---

## Governance & Compliance

Organizations requiring strict compliance and audit capabilities benefit from [**Audit Logs**](../02.governance/06.audit-logs.md), which provide a complete history of user actions and workflow changes.
The Enterprise Edition also includes the [**Log Shipper**](../02.governance/logshipper.md) task for sending logs to whichever monitoring platform(s) your DevOps team uses.
[**Worker Security Isolation**](../04.scalability-productivity/worker-isolation.md) enhances operational security by segregating worker processes.
Encryption & Fault Tolerance ensures data protection and system resilience against failures.

For enterprises managing multiple teams, [**Multi-Tenancy Support**](../02.governance/tenants.md) allows the creation of isolated environments for different departments or projects.
Additionally, Dedicated Storage & Tenant Isolation ensures that data is segregated across different tenants for improved security and compliance.
This is essential for managing different Business Units that use Kestra but should only be concerned with workflow production and data in their own segment.

---

## Workflow Development & Productivity

The Enterprise Edition introduces several features to improve workflow development efficiency.
[**Custom Blueprints**](../02.governance/custom-blueprints.md) simplify workflow creation by providing reusable, predefined templates for organization users.
The Enterprise Edition streamlines task and flow development and promotes organizational consistency with reusable templates across your instance for whichever teams can benefit.

To facilitate rapid troubleshooting, **Full-Text Search** on Task Runs enables quick retrieval of task execution details.
Administrators benefit from [**Centralized User & Permission Management**](../02.governance/08.centralized-task-configuration.md), which simplifies access control across teams.
Admins can impersonate users to guarantee correct permissions and access. Additionally, enterprises can build [Apps](../04.scalability-productivity/apps.md) to create **custom UIs for flows**, allowing users to interact with Kestra from the outside world.

---

## Enterprise Support & Services

Companies using the Enterprise Edition gain access to Onboarding & Training Support, ensuring teams can quickly get up to speed with Kestra’s features.
Additionally, Kestra provides a Customer Success Program with Service-Level Agreements (SLAs), offering dedicated support, guaranteed response times, and expert guidance to optimize workflow execution.
Enterprise Edition also keeps you one step ahead with a preview of the product roadmap and upcoming features.

---

## Scalability & Performance

For organizations requiring high availability, the Enterprise Edition includes **High Availability (HA) Architecture**, ensuring that no single point of failure disrupts workflows.
[**Worker Groups**](../04.scalability-productivity/worker-group.md) for Distributed Tasks optimize resource utilization by allowing workers to be grouped and assigned specific workloads.
This is especially useful for tasks with bursts in resource demand and always-on, intensive tasks.
[**Task Runners**](../04.scalability-productivity/task-runners.md) further improve execution efficiency by managing task distribution intelligently by offloading compute-intensive tasks to remote environments.

To enhance observability and performance monitoring, [**Cluster Monitoring & Custom Storage**](../05.instance-management/index.md) enables real-time infrastructure insights and customized storage solutions.
Enterprise Edition also support a [**maintenance mode**](../05.instance-management/maintenance-mode.md) for pausing your Kestra instance for migrations and upgrades.
Finally, for organizations handling massive data processing workloads, **High-Throughput Event Handling** ensures that workflows can scale efficiently while maintaining performance.

## So why pay?

By offering advanced access controls, compliance features, high availability, and tailored support, the Enterprise Edition ensures a robust, scalable, and secure workflow orchestration solution for large-scale and mission-critical deployments.