---
title: Security & Secrets Configuration in Kestra
h1: Configure Encryption, Secret Backends & Auth Security
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

This page covers:

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

The Azure service principal referenced in the base structure above must have the following Key Vault access policy permissions: `Get`, `List`, `Set`, `Delete`, `Recover`, `Backup`, `Restore`, `Purge`.

Representative backend examples:

AWS Secrets Manager requires the following IAM permissions: `CreateSecret`, `DeleteSecret`, `DescribeSecret`, `GetSecretValue`, `ListSecrets`, `PutSecretValue`, `RestoreSecret`, `TagResource`, `UpdateSecret`.

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

Google Secret Manager requires the `roles/secretmanager.admin` role. Omit `service-account` to fall back to `GOOGLE_APPLICATION_CREDENTIALS` or the environment's default credentials:

```yaml
kestra:
  secret:
    type: google-secret-manager
    google-secret-manager:
      project: gcp-project-id
      service-account: |
        <service-account JSON>
```

Elasticsearch secrets are additionally encrypted with AES. The key must be at least 32 characters:

```yaml
kestra:
  secret:
    type: elasticsearch
    elasticsearch:
      secret: "a-secure-32-character-minimum-key"
```

HashiCorp Vault (KV v2) supports Userpass, Token, and AppRole authentication.

Userpass:

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

Token:

```yaml
kestra:
  secret:
    type: vault
    vault:
      address: "http://localhost:8200"
      token:
        token: your-secret-token
```

AppRole:

```yaml
kestra:
  secret:
    type: vault
    vault:
      address: "http://localhost:8200"
      app-role:
        path: approle
        role-id: your-role-id
        secret-id: your-secret-id
```

JDBC-backed secrets, secret tags, and secret caching are covered below.

### JDBC secret backend

Use JDBC-backed secrets only when secrets must stay inside the same database boundary as Kestra and you do not already have a dedicated secret manager:

```yaml
kestra:
  secret:
    type: jdbc
    jdbc:
      secret: "your-secret-key"
```

### Secret tags

Some backends let you scope lookups with tags so the same secret manager can serve multiple environments:

```yaml
kestra:
  secret:
    <secret-type>:
      tags:
        application: kestra-production
```

Tags are useful when secrets are selected by metadata rather than by one fixed path convention.

### Secret cache

Caching reduces repeated secret-manager calls for frequently used values:

```yaml
kestra:
  secret:
    cache:
      enabled: true
      maximum-size: 1000
      expire-after-write: 60s
```

Use a cache when executions hit the same secret names repeatedly, but keep TTLs conservative if secret rotation happens often.

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

### Super-admin

The super-admin account has the highest level of platform access and should be reserved for break-glass administration:

```yaml
kestra:
  security:
    super-admin:
      username: your_username
      password: ${KESTRA_SUPERADMIN_PASSWORD}
      tenant-admin-access:
        - <optional>
```

:::alert{type="warning"}
Never store clear-text passwords in config. Use environment variables or your platform secret mechanism.
:::

### Default role

Assign a default role to newly created users when you want them to land with a predictable permission set:

```yaml
kestra:
  security:
    default-role:
      name: default
      description: "Default role"
      permissions:
        FLOW: ["CREATE", "READ", "UPDATE", "DELETE"]
```

In multi-tenant environments, scope that role to one tenant:

```yaml
kestra:
  security:
    default-role:
      name: default
      description: "Default role"
      permissions:
        FLOW: ["CREATE", "READ", "UPDATE", "DELETE"]
      tenant-id: staging
```

:::alert{type="info"}
Place `default-role` under `kestra.security`, not `micronaut.security`.
:::

### Invitation expiration and password rules

Invitation links expire after seven days by default. Extend them if user onboarding happens through slower approval processes:

```yaml
kestra:
  security:
    invitations:
      expire-after: P30D
```

For username/password auth, enforce password complexity explicitly:

```yaml
kestra:
  security:
    basic-auth:
      password-regexp: "<regexp-rule>"
```

### Delete configuration files after startup

If the runtime reads secrets from configuration files, delete them after startup so tasks cannot read them later from disk:

```yaml
kestra:
  configurations:
    delete-files-on-start: true
```

Liveness and heartbeat settings also belong here. The parameter constraints below affect cluster stability:

- `timeout` — must match across **all Executors**
- `initial-delay` — must match across **all Executors**
- `heartbeat-interval` — must be strictly less than `timeout`

Recommended settings for JDBC-backed (OSS) deployments:

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

Recommended settings for Kafka-based (EE) deployments:

```yaml
kestra:
  server:
    liveness:
      timeout: 1m
      initial-delay: 1m
```

:::alert{type="warning"}
Worker liveness in Kafka mode is handled by Kafka's protocol guarantees, so you only need to set `timeout` and `initial-delay` for the EE stack.
:::

Heartbeat and restart behavior also belong here:

- `kestra.heartbeat.frequency` controls how often workers emit heartbeats. Default: `10s`.
- `kestra.heartbeat.heartbeat-missed` controls how many missed heartbeats mark a worker as dead. Default: `3`.
- `kestra.server.worker-task-restart-strategy` accepts `NEVER`, `IMMEDIATELY`, or `AFTER_TERMINATION_GRACE_PERIOD` and determines what happens to running worker tasks during shutdown.

Set the termination grace period long enough for tasks to exit cleanly:

```yaml
kestra:
  server:
    termination-grace-period: 5m
```

If the deployment regularly creates empty server instances, adjust how often purge runs:

```yaml
kestra:
  server:
    service:
      purge:
        retention: 7d
```

:::alert{type="warning"}
Keep the external process manager timeout longer than Kestra's own termination grace period. Otherwise Kubernetes, Docker, or systemd can kill the process before graceful shutdown finishes.
:::

## Regex timeout

Kestra protects worker threads from ReDoS (catastrophic backtracking) by enforcing a timeout on all regex operations. This applies to [Pebble expression filters](../../expressions/index.mdx) (`regexMatch`, `regexReplace`, `regexExtract`, `replace` with `regexp=true`) and to `validator` patterns on `STRING` and `SECRET` inputs.

The default timeout is **10 seconds**. To change it, set `kestra.regex.timeout` in your configuration:

```yaml
kestra:
  regex:
    timeout: 30s
```

Accepts any [ISO 8601 duration](https://en.wikipedia.org/wiki/ISO_8601#Durations) string (e.g., `5s`, `PT30S`, `1m`).

:::alert{type="info"}
The timeout is set once at startup and cannot be changed at runtime without restarting the server.
:::

## Related docs

- Secrets manager concepts: [External Secrets Manager](../../07.enterprise/02.governance/secrets-manager/index.md)
- Enterprise auth and RBAC: [Authentication and Users](../../07.enterprise/03.auth/index.mdx)
- EE platform settings and advanced backends: [Enterprise and Advanced](../06.enterprise-and-advanced/index.md)
