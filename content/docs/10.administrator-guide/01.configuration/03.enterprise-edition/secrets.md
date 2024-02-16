---
title: Secret Manager Configuration
icon: /docs/icons/admin.svg
---

Connect your preferred secret manager backend to store and manage your secrets.

Kestra offers integration with secret managers. Secrets will be stored directly on a secret back-end and workers will read them at runtime only (in memory only).

Secrets can be set using the user interface or via [Terraform](https://registry.terraform.io/providers/kestra-io/kestra/latest/docs/resources/namespace_secret).

# AWS Secret Manager configuration

With this integration, Namespace Secrets will be stored in [AWS Secret Manager](https://aws.amazon.com/secrets-manager/). The [AWS IAM user or role](https://docs.aws.amazon.com/secretsmanager/latest/userguide/reference_iam-permissions.html) for this integration needs to have the following permissions: `CreateSecret, DeleteSecret, DescribeSecret, GetSecretValue, ListSecrets, PutSecretValue, RestoreSecret, TagResource, UpdateSecret`.

## Authentication

You can configure the authentication to AWS Cloud in multiple ways:
- Using `access-key-id`, `secret-key-id` and `region` properties
- Adding `session-token`,  alongside `access-key-id`, `secret-key-id` and `region` properties
- If the above properties are not set, Kestra will use the default AWS authentication, in the same way as AWS CLI handles it (i.e. trying to use the AWS CLI profile or the default environment variables `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` and `AWS_DEFAULT_REGION`)

```yaml
kestra:
  secret:
    type: aws-secret-manager
    aws-secret-manager:
      access-key-id: "<access-key-id>"
      secret-key-id: "<secretKeyId>"
      session-token: "<session-token>"
      region: "<region>"
```

## Additional configuration


### `kestra.secret.aws-secret-manager.prefix`
Optional property to store secrets separately for a different namespace, tenant, or instance. If configured, Kestra will prefix all Secret keys using that prefix. The main purpose of a prefix is to share the same secret manager between multiple Kestra instances.

### `kestra.secret.aws-secret-manager.endpoint-override`
Optional property to replace AWS default endpoint by an AWS-compatible service such as [MinIO](https://min.io/).



# Azure Key Vault configuration

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



# Elasticsearch configuration

This integration will store secrets in Elasticsearch. Since Elasticsearch is not a secured secret store, Kestra will store the secrets using [AES encryption,](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard), and you will need to provide a cryptographic key `secret` in order to encrypt and decrypt secrets stored inside Elasticsearch. The cryptographic key must be at least a 32 characters.

```yaml
kestra:
  secret:
    type: elasticsearch
    elasticsearch:
      secret: "<random-secret-to-crypt-password>"
```

# Google Secret Manager configuration

This integration will store secrets in [Google Secret Manager](https://cloud.google.com/secret-manager). Kestra authentication must have [roles/secretmanager.admin](https://cloud.google.com/secret-manager/docs/access-control) permission.

## Authentication
You can authenticate the Secrets Manager with Google Cloud in multiple ways:
- By setting the `service-account` property that must contain the contents of the service account JSON key file.
- By setting the `GOOGLE_APPLICATION_CREDENTIALS` environment variable on the nodes (or server) running Kestra. It must point to a JSON credentials file. Keep in mind that you'd need to use the same variable on all worker nodes and that this authentication method can cause some security concerns.
- If none is set, the default service account will be used.

```yaml
kestra:
  secret:
    type: azure-key-vault
    google-secret-manager:
      project: kestra-unit-test
      service-account: 'JSON content of the service account'
```

## Other configurations

### `kestra.secret.google-secret-manager.project`
Google Cloud project ID that Kestra will use.

### `kestra.secret.google-secret-manager.prefix`
Optional. All key handled by Kestra will be prefixed with this. Can be useful to share the same secret manager between Kestra instances.


# Vault configuration

This integration will store secrets in the Vault [KV Secrets Engine - Version 2](https://www.vaultproject.io/docs/secrets/kv/kv-v2). Kestra authentications must have full [read and write policies](https://www.vaultproject.io/docs/concepts/policies) on this secrets store. You can optionally change `root-engine` or `namespace` (if you use Vault Enterprise).


## Authentication
### Password authentication

You can use a [Userpass Auth Method](https://www.vaultproject.io/docs/auth/userpass) using the following configuration:

```yaml
kestra:
  secret:
    type: vault
    vault:
      address: "http://localhostt:8200"
      password:
        user: john
        password: foo
```

### Token authentication
You can use a [Token Auth Method](https://www.vaultproject.io/docs/auth/token) using the following configuration:

```yaml
kestra:
  secret:
    type: vault
    vault:
      address: "http://localhostt:8200"
      token:
        token: your-secret-token
```

### AppRole authentication
You can use an [AppRole Auth Method](https://www.vaultproject.io/docs/auth/approle) using the following configuration:

```yaml
kestra:
  secret:
    type: vault
    vault:
      address: "http://localhostt:8200"
      app-role:
        path: approle
        role-id: your-role-id
        secret-id: your-secret-id
```

## Other configurations

### `kestra.secret.vault.address`
The fully qualified address with scheme and port to your Vault instance.

### `kestra.secret.vault.namespace`
Optional. Sets a global namespace to the Vault server instance. Namespace support requires [Vault Enterprise Pro](https://learn.hashicorp.com/vault/operations/namespaces).

### `kestra.secret.vault.engine-version`
Optional. Sets the KV Secrets Engine version of the Vault server instance. Default is `2`.

### `kestra.secret.vault.root-engine`
Optional. Sets the KV Secrets Engine of the Vault server instance. Default is `secret`.






