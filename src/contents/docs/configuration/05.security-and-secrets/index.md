---
title: Kestra Security and Secrets Configuration
description: Configure encryption, secret backends, auth-related security settings, RBAC-adjacent platform security, and secure server behavior in Kestra.
sidebarTitle: Security and Secrets
icon: /src/contents/docs/icons/admin.svg
---

Use this page when you need to protect sensitive values or harden a Kestra deployment.

## Encryption

This is the minimum security configuration most self-managed instances should think about early, because it determines whether sensitive flow values can be stored safely at rest.

Kestra supports encryption of sensitive inputs and outputs at rest through `kestra.encryption.secret-key`.

Example:

```yaml
kestra:
  encryption:
    secret-key: BASE64_ENCODED_STRING_OF_32_CHARACTERS
```

Generate a key with:

```bash
openssl rand -base64 32
```

Without `kestra.encryption.secret-key`, `SECRET` inputs and outputs fail at runtime because Kestra cannot encrypt the value at rest.

Example flow using `SECRET` types:

```yaml
id: my_secret_flow
namespace: company.team

inputs:
  - id: secret
    type: SECRET

tasks:
  - id: mytask
    type: io.kestra.plugin.core.log.Log
    message: task that needs the secret to connect to an external system

outputs:
  - id: secret_output
    type: SECRET
    value: "{{ inputs.secret }}"
```

## Secret backends

Choose the backend based on where your organization already stores secrets. In practice, most teams want Kestra to consume an existing cloud or Vault-based secret system rather than create a separate one just for workflows.

Kestra can be configured to use a secrets backend through `kestra.secret.*`.

The full reference covers:

- AWS Secrets Manager
- Azure Key Vault
- Google Secret Manager
- HashiCorp Vault
- JDBC
- secret tags
- secret cache
- isolation options

Base structure:

```yaml
kestra:
  secret:
    type: azure-key-vault
    azure-key-vault:
      client-secret:
        tenant-id: "id"
        client-id: "id"
        client-secret: "secret"
    isolation:
      enabled: true
      denied-services:
        - EXECUTOR
```

`isolation` is the key control to understand here: it limits which Kestra services are allowed to resolve secrets, which is useful when you want workers or executors to have narrower access than the whole platform.

Representative backend examples:

```yaml
kestra:
  secret:
    type: aws-secret-manager
    aws-secret-manager:
      access-key-id: mysuperaccesskey
      secret-key-id: mysupersecret-key
      session-token: mysupersessiontoken
      region: us-east-1
```

```yaml
kestra:
  secret:
    type: google-secret-manager
    google-secret-manager:
      project: gcp-project-id
      service-account: |
        <service-account JSON>
```

```yaml
kestra:
  secret:
    type: elasticsearch
    elasticsearch:
      secret: "a-secure-32-character-minimum-key"
```

Supported Vault auth methods in the full reference are Userpass, Token, and AppRole. The full reference also documents JDBC-backed secrets, secret tags, and secret caching.

![Secrets UI Configuration](../is-secrets-configuration.png)

## Security settings

This section is about hardening the running platform rather than managing secret values. Reach for it when you are locking down access, controlling invitations and roles, or tuning how the server reacts to component health issues.

This group includes:

- super-admin behavior
- default roles
- invitation expiration
- password rules
- server basic auth
- deletion of configuration files

Server and endpoint hardening examples:

```yaml
kestra:
  server:
    basic-auth:
      username: admin@kestra.io
      password: change-me
      open-urls:
        - "/api/v1/main/executions/webhook/"
```

```yaml
endpoints:
  all:
    basic-auth:
      username: your-user
      password: your-password
```

Liveness and heartbeat settings also belong here:

```yaml
kestra:
  server:
    liveness:
      enabled: true
      interval: 5s
      timeout: 45s
      initial-delay: 45s
      heartbeat-interval: 3s
```

The full reference also documents heartbeat frequency, missed-heartbeat handling, worker task restart strategy, termination grace period, and server service instance purge retention.

## Related docs

- Secrets manager concepts: [External Secrets Manager](../../07.enterprise/02.governance/secrets-manager/index.md)
- Enterprise auth and RBAC: [Authentication and Users](../../07.enterprise/03.auth/index.mdx)
- Full property list: [Full Reference](../99.full-reference/index.md#secret-managers)
