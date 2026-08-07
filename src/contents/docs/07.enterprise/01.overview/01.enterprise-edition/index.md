---
title: "Enterprise Features in Kestra: High-Availability"
h1: Run Kestra Securely and Reliably at Scale
description: Learn about the Enterprise Edition and how it can help you run Kestra securely and reliably at scale.
sidebarTitle: Features
icon: /src/contents/docs/icons/kestra.svg
editions: ["EE", "Cloud"]
---

Kestra Enterprise Edition is built for production workloads with high security and compliance requirements, deployable wherever you need.

## Key features

Kestra Enterprise is an additive overlay on the [Open Source Edition](https://github.com/kestra-io/kestra) — it shares one codebase and preserves all open-source behavior while adding enterprise capabilities on top.

**High availability**: Designed to be highly available and fault-tolerant. Supports **Kafka**, **Redis**, **AMQP**, or **GCP Pub/Sub** as the queue backend, and **Elasticsearch** for the search and read model — eliminating single points of failure and enabling horizontal scaling for large workloads.

**Multi-tenancy**: Separate environments for different teams or projects. Each tenant is fully isolated, with its own access control policies, and can optionally run with Worker Isolation and dedicated worker groups to prevent cross-tenant contention.

**Security and access control**: SSO and RBAC let you integrate with your existing identity provider and manage user access to workflows and resources. Enforce plugin allow-lists, apply read-only secrets for least privilege, and use audit logs for full traceability.

**Enterprise features**: Audit Logs, Custom Blueprints, namespace-level secrets, variables and plugin defaults, Assets packaging, declarative Unit Tests for flows, Versioned Plugins for safe upgrades, and operational safeguards like the Kill Switch and in-product Announcements.

**Secrets management**: Securely stores and manages secrets. Supports read-only secrets for sensitive values and integrates with AWS Secrets Manager, Azure Key Vault, Elasticsearch, Google Secret Manager, HashiCorp Vault, Doppler, 1Password, and more.

**Support**: Guaranteed SLAs and priority support, with onboarding and training to ensure a fast and confident start.

[Get in touch](/demo) to learn more.

:::alert{type="info"}
**Kestra Cloud:** If you’re unable to host Kestra Enterprise yourself, you can try Kestra Cloud — a fully managed SaaS solution hosted by the Kestra team. Kestra Cloud is currently in early access. If you are interested in trying it out, [sign up here](/cloud).
:::
