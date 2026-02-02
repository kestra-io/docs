---
title: Kestra Enterprise Features – High-Availability Platform
description: Learn about the Enterprise Edition and how it can help you run Kestra securely and reliably at scale.
sidebarTitle: Features
icon: /src/contents/docs/icons/kestra.svg
editions: ["EE", "Cloud"]
---

Learn about the Enterprise Edition and how it can help you run Kestra securely and reliably at scale.

## Kestra Enterprise features – high-availability platform

Designed for production workloads with high security and compliance requirements, deployed wherever you need.

---

## Key Features

Kestra Enterprise is built on top of the [Open Source Edition](https://github.com/kestra-io/kestra) but features a different architecture. Below are the key differences between the two.

⚡️**High Availability**: Kestra Enterprise is designed to be highly available and fault-tolerant. It uses a **Kafka** cluster as a backend for event-driven orchestration and **Elasticsearch** for storing logs and metrics. This not only improves performance but also eliminates single points of failure and enables the system to scale for large workloads.

⚡️**Multi-Tenancy**: The Enterprise Edition supports multi-tenancy, enabling separate environments for different teams or projects. Each tenant is fully isolated and can have its own access control policies.

⚡️**Security and Access Control**: Kestra Enterprise supports Single Sign-On (SSO) and Role-Based Access Control (RBAC), enabling you to integrate with your existing identity provider and manage user access to workflows and resources.

⚡️**Enterprise Features**: This edition of Kestra includes additional enterprise features such as Audit Logs, Worker Groups, Custom Blueprints, Namespace-level Secrets, Variables, Unit Tests, and Plugin Defaults.

⚡️**Secrets Management**: Kestra Enterprise securely stores and manages secrets. It also supports integration with existing secret managers such as AWS Secrets Manager, Azure Key Vault, Elasticsearch, Google Secret Manager, HashiCorp Vault, Doppler, 1Password, and more to come.

⚡️**Support**: The Enterprise Edition comes with guaranteed SLAs and priority support.

⚡️**Onboarding**: We provide onboarding and training for your team to ensure a fast and confident start.

If you're interested to learn more, [get in touch!](/demo)

:::alert{type="info"}
**Kestra Cloud:** If you’re unable to host Kestra Enterprise yourself, you can try Kestra Cloud — a fully managed SaaS solution hosted by the Kestra team. Kestra Cloud is currently in early access. If you are interested in trying it out, [sign up here](/cloud).
:::
