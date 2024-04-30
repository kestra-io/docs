---
title: Secrets Manager
icon: /docs/icons/admin.svg
---

How to configure the secrets manager.

::alert{type="info"}
This feature requires a [commercial license](https://kestra.io/pricing).
::

Kestra integrates with various secret managers to provide secure storage and handling of sensitive data.

Kestra respects your privacy. Therefore, Secrets are persisted externally in a backend of your choice. They are accessed by workers at runtime and stored only in memory.

You can add, modify or delete secrets from the Secrets tab of any given namespace in the Kestra UI, or programmatically via [Terraform](https://registry.terraform.io/providers/kestra-io/kestra/latest/docs/resources/namespace_secret).

## AWS Secret Manager Configuration

In order to use [AWS Secret Manager](https://aws.amazon.com/secrets-manager/) as a secrets backend, make sure that your AWS IAM user or role have the required permissions including `CreateSecret`, `DeleteSecret`, `DescribeSecret`, `GetSecretValue`, `ListSecrets`, `PutSecretValue`, `RestoreSecret`, `TagResource`, `UpdateSecret`.

You can configure the authentication to AWS Cloud in multiple ways:
- Using `accessKeyId`, `secretKeyId`, and `region` properties.
- Including a `sessionToken` alongside the above credentials.
- If the above properties are not set, Kestra will use the default AWS authentication, in the same way as AWS CLI handles it (i.e. trying to use the AWS CLI profile or the default environment variables `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` and `AWS_DEFAULT_REGION`).

```yaml
kestra:
  secret:
    type: aws-secret-manager
    aws-secret-manager:
      accessKeyId: mysuperaccesskey
      secretKeyId: mysupersecretkey
      sessionToken: mysupersessiontoken
      region: us-east-1
```

Additionally, you can configure the following properties:

- **Prefix**: `kestra.secret.aws-secret-manager.prefix` is an optional property to store secrets separately for a different namespace, tenant, or instance. If configured, Kestra will prefix all Secret keys using that prefix. The main purpose of a prefix is to share the same secret manager between multiple Kestra instances.
- **Endpoint Override**: `kestra.secret.aws-secret-manager.endpointOverride` is an optional property to replace AWS default endpoint by an AWS-compatible service such as [MinIO](https://min.io/).

## Azure Key Vault Configuration

To configure [Azure Key Vault](https://azure.microsoft.com/products/key-vault/) as your secrets backend, make sure that kestra's user or service principal (`clientId`) has the necessary permissions, including `"Get", "List", "Set", "Delete", "Recover", "Backup", "Restore", "Purge"`. Then, paste the `clientSecret` from the Azure portal to the `clientSecret` property in the configuration below.

```yaml
kestra:
  secret:
    type: azure-secret-manager
    azure-key-vault:
      clientSecret:
        tenantId: "id"
        clientId: "id"
        clientSecret: "secret"
```

If no credentials are set in the above configuration, Kestra will use the default Azure authentication akin to the Azure CLI.

Additionally, you can configure the following properties:

- **Vault Name**: `kestra.secret.azure-key-vault.vaultName` is the name of the Azure Key Vault.
- **Key Vault URI**: `kestra.secret.azure-key-vault.keyVaultUri` is an optional property allowing you to replace the Azure Key Vault name with a full URL.
- **Prefix**: `kestra.secret.azure-key-vault.prefix` is an optional property to store secrets separately for a different namespace, tenant, or instance. If configured, Kestra will prefix all Secret keys using that prefix. The main purpose of a prefix is to share the same secret manager between multiple Kestra instances.

## Elasticsearch Configuration

Elasticsearch backend stores secrets with an additional layer of security using [AES encryption](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard). You will need to provide a cryptographic key (at least 32 characters-long string) in order to encrypt and decrypt secrets stored in Elasticsearch.

```yaml
kestra:
  secret:
    type: elasticsearch
    elasticsearch:
      secret: "a-secure-32-character-minimum-key"
```

## Google Secret Manager Configuration

To leverage [Google Secret Manager](https://cloud.google.com/secret-manager) as your secrets backend, you will need to create a service account with the [roles/secretmanager.admin](https://cloud.google.com/secret-manager/docs/access-control) permission. Paste the contents of the service account JSON key file to the `serviceAccount` property in the configuration below. Alternatively, set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable to point to the credentials file.

```yaml
kestra:
  secret:
    type: google-secret-manager
    google-secret-manager:
      project: gcp-project-id
      serviceAccount: |
        Paste here the contents of the service account JSON key file
```

If you opt for authentication using the `GOOGLE_APPLICATION_CREDENTIALS` environment variable, make sure that it's set on all worker nodes. Keep in mind that this authentication method is less secure than using the `serviceAccount` property.

If no credentials are set in the above configuration, Kestra will use the default Google authentication akin to the Google Cloud SDK.

Additionally, you can configure the `kestra.secret.google-secret-manager.prefix` property to store secrets separately for a different namespace, tenant, or instance. If configured, Kestra will prefix all Secret keys using that prefix. The main purpose of a prefix is to share the same secret manager between multiple Kestra instances.

## Vault Configuration

Kestra also supports the [KV Secrets Engine - Version 2](https://www.vaultproject.io/docs/secrets/kv/kv-v2) as a secrets backend.

To authenticate Kestra with [HashiCorp Vault](https://www.vaultproject.io/), you can use Userpass, Token or AppRole Auth Methods, all of which requires full [read and write policies](https://www.vaultproject.io/docs/concepts/policies). You can optionally change `root-engine` or `namespace` (_if you use Vault Enterprise_).


1. Here is how you can set up [Userpass Auth Method](https://www.vaultproject.io/docs/auth/userpass) in your Kestra configuration:

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

2. Here is how you can set up [Token Auth Method](https://www.vaultproject.io/docs/auth/token) in your Kestra configuration:

```yaml
kestra:
  secret:
    type: vault
    vault:
      address: "http://localhostt:8200"
      token:
        token: your-secret-token
```

3. Finally, here is how you can set up [AppRole Auth Method](https://www.vaultproject.io/docs/auth/approle) in your Kestra configuration:

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

Additionally, you can configure the following properties:

- **Address**: `kestra.secret.vault.address` is a fully qualified address with scheme and port to your Vault instance.
- **Namespace**: `kestra.secret.vault.namespace` is an optional configuration available on [Vault Enterprise Pro](https://learn.hashicorp.com/vault/operations/namespaces) allowing you to set a global namespace for the Vault server instance.
- **Engine Version**: `kestra.secret.vault.engine-version` is an optional property allowing you to set the KV Secrets Engine version of the Vault server instance. Default is `2`.
- **Root Engine**: `kestra.secret.vault.root-engine` is an optional property allowing you to set the KV Secrets Engine of the Vault server instance. Default is `secret`.
