---
title: Secret Manager configuration
---

Kestra offers integration with secret managers. Secrets will be stored directly on a secret back-end and workers will read them at runtime only (in memory only).

Secrets can be set using the user interface or via [Terraform](/docs/terraform/resources/namespace_secret.md).

For now, we provide integration only using [Vault](https://www.vaultproject.io/) or [Elasticsearch](https://elastic.co),  but other options will be added in the future.

<ChildTableOfContents />
