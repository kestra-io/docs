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
To configure globally, add `readOnly: true` to the configuration of your external secret manager. The following example is a configuration using [Vault](secrets-manager.md#vault-configuration):

```yaml
secret:
    readOnly: true
    type: vault # Replace with your external secret manager
    vault:
        secretPathPrefix: my-team-a # Specific property only for Vault
```

For Vault secret manager, there is an optional property, `secretPathPrefix`, that can be used when `readOnly: true`. This property restricts available secrets to only be those that follow the specified path. For example, consider a vault that contains the following two secrets:

- `my-team-a/my-app/my-secret-1`
- `my-team-b/my-app/my-secret-2`

With the above configuration, where `secretPathPrefix: my-team-a` is specified, only the first secret, `my-team-a/my-app/my-secret-1` will be loaded into Kestra and accessible to the namespace.

To enable in the Kestra UI, go to **Namespace** and then to the Edit tab. From here, you can toggle on **Dedicated secrets manager**, select your Secret type, switch on Read-only mode, and enter your respective secret configuration for your secrets manager.

![read-only-secrets-1](/docs/enterprise/read-only-secrets-1.png)
