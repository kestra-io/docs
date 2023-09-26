---
title: AWS Secret Manager configuration
---

With this integration, Namespace Secrets will be stored in [AWS Secret Manager](https://aws.amazon.com/secrets-manager/). The [AWS IAM user or role](https://docs.aws.amazon.com/secretsmanager/latest/userguide/reference_iam-permissions.html) for this integration needs to have the following permissions: `CreateSecret, DeleteSecret, DescribeSecret, GetSecretValue, ListSecrets, PutSecretValue, RestoreSecret, TagResource, UpdateSecret`.

## Authentication

You can configure the authentication to AWS Cloud in multiple ways:
- Using `accessKeyId` and `secretKeyId` properties
- Adding `sessionToken`,  `accessKeyId` and `secretKeyId` properties
- If the above properties are not set, Kestra will use the default AWS authentication, in the same way as AWS CLI handles it (i.e. trying to use the AWS CLI profile or the default environment variables `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` and `AWS_DEFAULT_REGION`)

```yaml
kestra:
  secret:
    aws-secret-manager:
      accessKeyId: "test"
      secretKeyId: "test"
      sessionToken: "token"
```

## Additional configuration

### `kestra.secret.aws-secret-manager.region`
The AWS region to be used by the Secrets Manager

### `kestra.secret.aws-secret-manager.prefix`
Optional property to store secrets separately for a different namespace, tenant, or instance. If configured, Kestra will prefix all Secret keys using that prefix. The main purpose of a prefix is to share the same secret manager between multiple Kestra instances.

### `kestra.secret.aws-secret-manager.endpointOverride`
Optional property to replace AWS default endpoint by an AWS-compatible service such as [MinIO](https://min.io/).
