---
order: 1
---
# Secret Manager configuration

Kestra add integration with secret manager. Secrets will be stored directly on secret backend and worker will read them at runtime only (in memory only).

Secret can be set using the user interface or with [terraform](/docs/terraform/resources/namespace_secret.md)

For now, we provide integration only for [Vault](https://www.vaultproject.io/), but others will be added in the future.

<ChildTableOfContents />
