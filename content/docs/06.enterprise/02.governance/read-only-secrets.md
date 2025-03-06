---
title: Read-only Secrets
icon: /docs/icons/kestra.svg
editions: ["EE"]
---

Integrate external secrets managers in a read-only mode.

## Read-only secrets

When integrating an external [secrets manager](secrets-manager.md) with Kestra, you may want to ensure that those secrets cannot be modified within Kestra, maintaining immutability.
Currently, read-only secrets can be configured for [AWS Secret Manager](secrets-manager.md#aws-secret-manager-configuration), [Azure Key Vault](secrets-manager.md#azure-key-vault-configuration), [Google Secret Manager](secrets-manager.md#google-secret-manager-configuration), and [Vault](secrets-manager.md#vault-configuration).

## Configure read-only secrets

Read-only secrets can be configured globally in the configuration file as well as enabled from the UI in the [Namespace](../../04.workflow-components/02.namespace.md) edit page.
To configure globally, add `readOnly: true` to the configuration of your external secret manager:

```yaml
secret:
    readOnly: true
    type: vault # Replace with your external secret manager
    vault:
        secretPathPrefix: my-team-a
```
