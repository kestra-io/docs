---
title: Cloud & Enterprise Edition
editions: ["EE", "Cloud"]
---

How to configure Kestra Enterprise Edition and Kestra Cloud.

[Enterprise Edition](/enterprise) is a robust, enterprise-grade version of Kestra deployed to your private infrastructure. It offers security and governance features including multi-tenancy, authentication, SSO, RBAC, namespace-level management, distributed worker groups, worker isolation, secrets manager integrations, audit logs, and more.

[Kestra Cloud](/cloud) is a fully managed version of Kestra EE, hosted and maintained by the Kestra team. It provides most of the features of the Enterprise Edition, plus the additional benefits of automatic updates, backups, and infrastructure monitoring.

## Key Differences Between Kestra Enterprise and Kestra Cloud

While Kestra Cloud provides a fully managed, hassle-free experience, it differs from Kestra Enterprise (EE) in several important ways, primarily around infrastructure control, customization, and direct access to backend components.

| Feature / Area                    | Kestra Cloud                                       | Kestra Enterprise                        |
| :--------------------------------- | :------------------------------------------------ | :--------------------------------------- |
| **Infrastructure Control**         | Fully managed by Kestra for simplicity and reliability               | Full control and customization          |
| **Backend Technology**             | Postgres JDBC only                                | Customizable Kafka, Postgres, MySQL, SQL Server, H2 (testing)   |
| **Workers**                        | Managed worker pools sized for stability                  | Remote [Worker Groups](04.scalability/worker-group.md), autoscaling        |
| **Custom Internal Storage & Secrets**              | No instance-level control, **tenant/namespace-level only** backends            | Fully customizable backends              |
| **Network Configuration**          | Secure access over public Internet                             | Private networking (self-hosted, VPC peering, etc.)   |
| **Backup Access**                  | Automatic backups handled by Kestra                 | Customer-controlled backups              |
| **Plugins**                        | Curated plugin environment                                | Full plugin customization                |
| **Identity Providers (IdP)**        | Built-in Google, Microsoft, or Basic Authentication                | Custom SSO/SCIM supported                 |
| **Log Retention**                  | Automatic retention protocol managed by Kestra      | Unlimited (based on customer setup)      |
| **Deployment Regions**             | US & EU (Belgium) on GCP                          | Any cloud, any region                    |
| **Task Runners**             | Compatible with most, [Process Task Runner](../task-runners/04.types/01.process-task-runner.md) excluded                          | Compatible with all, however [Kubernetes Task Runner](../task-runners/04.types/03.kubernetes-task-runner.md) better suited for Cloud                    |

This section describes those features in detail and explains how to configure them.

If you're interested to learn more, check our [Open-Source and Paid Editions comparison](../oss-vs-paid.md), explore our [Pricing](/pricing), and [get in touch](/demo) to discuss your requirements.

::ChildCard
::
