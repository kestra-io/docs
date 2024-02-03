---
title: Azure Key Vault configuration
---

This integration will store secrets in [Azure Key Vault](https://azure.microsoft.com/products/key-vault/). Kestra authentications must have `"Get", "List", "Set", "Delete", "Recover", "Backup", "Restore", "Purge"` permissions.

## Authentication
You can authenticate the Secrets Manager with Azure Cloud in multiple ways:
- Using a user or a service principal secret by setting properties `client-id` and `client-secret`.
- If none is set, the default authentication will be used e.g. in a similar way as Azure CLI does it.

```yaml
kestra:
  secret:
    type: azure-key-vault
    azure-key-vault:
      client-secret:
        tenant-id: "<tenant-id>"
        client-id: "<client-id>"
        client-secret: "<client-secret>"
      key-vault-uri: "<key-vault-uri>"
      vault-name: "<vault-name>"
```

## Other configurations
### `kestra.secret.azure-key-vault.vault-name`
Name of the Azure Key Vault to use.

### `kestra.secret.azure-key-vault.key-vault-uri`
Optionally you can provide the full Azure Key Vault url instead of its name.

### `kestra.secret.azure-key-vault.prefix`
Optional. All key handled by Kestra will be prefixed with this. Can be useful to share the same secret manager between Kestra instances.
