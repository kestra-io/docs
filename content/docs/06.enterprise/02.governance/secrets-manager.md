---
title: Secrets Manager
icon: /docs/icons/admin.svg
editions: ["EE", "Cloud"]
---

How to configure the secrets manager.


Kestra integrates with various secret managers to provide secure storage and handling of sensitive data.

Kestra respects your privacy. Therefore, Secrets are persisted externally in a backend of your choice. They are accessed by workers at runtime and stored only in memory.

You can add, modify, or delete secrets from the **Secrets** tab of any given namespace in the Kestra UI or programmatically via [Terraform](https://registry.terraform.io/providers/kestra-io/kestra/latest/docs/resources/namespace_secret).

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/U0cNzNQ-bkw?si=20ltjCZBXJW8_QAe" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## AWS Secrets Manager Configuration

In order to use [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/) as a secrets backend, make sure that your AWS IAM user or role have the required permissions including `CreateSecret`, `DeleteSecret`, `DescribeSecret`, `GetSecretValue`, `ListSecrets`, `PutSecretValue`, `RestoreSecret`, `TagResource`, `UpdateSecret`.

You can configure the authentication to AWS Cloud in multiple ways:
- Use `accessKeyId`, `secretKeyId`, and `region` properties.
- Include a `sessionToken` alongside the above credentials.
- If the above properties are not set, Kestra will use the default AWS authentication in the same way as AWS CLI handles it (i.e., trying to use the AWS CLI profile or the default environment variables `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_DEFAULT_REGION`).

```yaml
kestra:
  secret:
    type: aws-secret-manager
    awsSecretManager:
      accessKeyId: mysuperaccesskey
      secretKeyId: mysupersecretkey
      sessionToken: mysupersessiontoken
      region: us-east-1
```

Additionally, you can configure the following properties:

- **Prefix**: `kestra.secret.awsSecretManager.prefix` is an optional property to store secrets separately for a different namespace, tenant, or instance. If configured, Kestra will prefix all Secret keys using that prefix. The main purpose of a prefix is to share the same secret manager between multiple Kestra instances.
- **Endpoint Override**: `kestra.secret.awsSecretManager.endpointOverride` is an optional property to replace AWS default endpoint by an AWS-compatible service such as [MinIO](https://min.io/).

When adding a secret in AWS, you will need to specify the following tags:
- `namespace`: the namespace this secret should appear in.
- `key`: the key which you will use to access the secret inside of your workflow.
- `prefix`: used to store secrets separately. Will be set to `kestra` by default if secret is created inside Kestra.

::alert{type="info"}
The secret name in AWS will not display inside of Kestra. Instead set this to something easy to differentiate between other secrets.
::

## Azure Key Vault Configuration

To configure [Azure Key Vault](https://azure.microsoft.com/products/key-vault/) as your secrets backend, make sure that Kestra's user or service principal (`clientId`) has the necessary permissions, including `"Get", "List", "Set", "Delete", "Recover", "Backup", "Restore", "Purge"`. Then, paste the `clientSecret` from the Azure portal to the `clientSecret` property in the configuration below.

```yaml
kestra:
  secret:
    type: azure-key-vault
    azureKeyVault:
      clientSecret:
        tenantId: "id"
        clientId: "id"
        clientSecret: "secret"
```

If no credentials are set in the above configuration, Kestra will use the default Azure authentication akin to the Azure CLI.

Additionally, you can configure the following properties:

- **Vault Name**: `kestra.secret.azureKeyVault.vaultName` is the name of the Azure Key Vault.
- **Key Vault URI**: `kestra.secret.azureKeyVault.keyVaultUri` is an optional property allowing you to replace the Azure Key Vault name with a full URL.
- **Prefix**: `kestra.secret.azureKeyVault.prefix` is an optional property to store secrets separately for a different namespace, tenant, or instance. If configured, Kestra will prefix all Secret keys using that prefix. The main purpose of a prefix is to share the same secret manager between multiple Kestra instances.

## Elasticsearch Configuration

Elasticsearch backend stores secrets with an additional layer of security using [AES encryption](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard). You need to provide a cryptographic key (at least 32 characters-long string) in order to encrypt and decrypt secrets stored in Elasticsearch.

```yaml
kestra:
  secret:
    type: elasticsearch
    elasticsearch:
      secret: "a-secure-32-character-minimum-key"
```

For Kestra instance deployed using the Kafka/Elastic backend, you can use the same configuration.

Your secret key should be encrypted. You can find an example key in our [encryption configuration documentation](../../configuration/index.md#encryption).


## Google Secret Manager Configuration

To leverage [Google Secret Manager](https://cloud.google.com/secret-manager) as your secrets backend, you need to create a service account with the [roles/secretmanager.admin](https://cloud.google.com/secret-manager/docs/access-control) permission. Paste the contents of the service account JSON key file to the `serviceAccount` property in the configuration below. Alternatively, set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable to point to the credentials file.

```yaml
kestra:
  secret:
    type: google-secret-manager
    googleSecretManager:
      project: gcp-project-id
      serviceAccount: |
        Paste here the contents of the service account JSON key file
```

If you opt for authentication using the `GOOGLE_APPLICATION_CREDENTIALS` environment variable, make sure that it's set on all worker nodes. Keep in mind that this authentication method is less secure than using the `serviceAccount` property.

If no credentials are set in the above configuration, Kestra will use the default Google authentication akin to the Google Cloud SDK.

Additionally, you can configure the `kestra.secret.googleSecretManager.prefix` property to store secrets separately for a different namespace, tenant, or instance. If configured, Kestra will prefix all Secret keys using that prefix. The main purpose of a prefix is to share the same secret manager between multiple Kestra instances.

## Vault Configuration

Kestra currently supports the [KV secrets engine - version 2](https://developer.hashicorp.com/vault/docs/secrets/kv/kv-v2) as a secrets backend. If you are considering alternative Vault secrets engines, please note the following:
- The [Vault's database secrets engine](https://developer.hashicorp.com/vault/docs/secrets/databases), often referred to as "dynamic secrets", is not supported as we need long-term secret storage.
- The [Vault Secrets Operator on Kubernetes](https://developer.hashicorp.com/vault/tutorials/kubernetes/vault-secrets-operator) creates a Kubernetes secret which is compatible with Kestra with some additional steps. If you are interested about this option, [reach out to us](/demo) and we can advise how you can set this up.

Follow the steps below to configure the [KV Secrets Engine - Version 2](https://www.vaultproject.io/docs/secrets/kv/kv-v2) as your secrets backend.

### KV Secrets Engine - Version 2

To authenticate Kestra with [HashiCorp Vault](https://www.vaultproject.io/), you can use Userpass, Token, or AppRole Auth Methods, all of which requires full [read and write policies](https://www.vaultproject.io/docs/concepts/policies). You can optionally change `rootEngine` or `namespace` (_if you use Vault Enterprise_).


1. Here is how you can set up [Userpass Auth Method](https://www.vaultproject.io/docs/auth/userpass) in your Kestra configuration:

```yaml
kestra:
  secret:
    type: vault
    vault:
      address: "http://localhost:8200"
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
      address: "http://localhost:8200"
      token:
        token: your-secret-token
```

3. Finally, here is how you can set up [AppRole Auth Method](https://www.vaultproject.io/docs/auth/approle) in your Kestra configuration:

```yaml
kestra:
  secret:
    type: vault
    vault:
      address: "http://localhost:8200"
      appRole:
        path: approle
        roleId: your-role-id
        secretId: your-secret-id
```

Additionally, you can configure the following properties:

- **Address**: `kestra.secret.vault.address` is a fully qualified address with scheme and port to your Vault instance.
- **Namespace**: `kestra.secret.vault.namespace` is an optional configuration available on [Vault Enterprise Pro](https://learn.hashicorp.com/vault/operations/namespaces) allowing you to set a global namespace for the Vault server instance.
- **Engine Version**: `kestra.secret.vault.engineVersion` is an optional property allowing you to set the KV Secrets Engine version of the Vault server instance. Default is `2`.
- **Root Engine**: `kestra.secret.vault.rootEngine` is an optional property allowing you to set the KV Secrets Engine of the Vault server instance. Default is `secret`.


## JDBC (Postgres, H2, MySQL) Secret Manager

Kestra also supports internal secret backend. For the JDBC backend (H2, PostgreSQL, or MySQL), the following configuration allows you to set secret backend:

```yaml
kestra:
  secret:
    type: jdbc
    jdbc:
      secret: "your-secret-key"
```

Your secret key should be encrypted. You can find an example key in our [encryption configuration documentation](../../configuration/index.md#encryption).

## Default Tags

For each secret manager, you can configure the default tags that will be added to all newly created or updated secrets.

Configuration example:

```yaml
kestra:
  secret:
    <secret-type>:
      # a map of default key/value tags
      tags:
        application: kestra-production
```

## Enable Caching

If you use a secret manager provided by a cloud service provider, it may be worth enabling the secret cache to reduce
the number of calls to the secret manager API.

Configuration example:

```yaml
kestra:
  secret:
    cache:
      enabled: true
      maximumSize: 1000
      expireAfterWrite: 60s
```

* **`kestra.secret.cache.enabled`**: Specifies whether to enable caching for secrets.
* **`kestra.secret.cache.maximumSize`**:  The maximum number of entries the cache may contain.
* **`kestra.secret.cache.expireAfterWrite`**:  Specifies that each entry should be automatically removed from the cache once this duration has elapsed after the entry's creation.
