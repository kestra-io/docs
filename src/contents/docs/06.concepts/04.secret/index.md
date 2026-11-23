---
title: "Secrets in Kestra: Store Sensitive Values Securely"
h1: Store and Access Sensitive Information Securely
description: Store and access sensitive information securely in Kestra. Use Secrets to protect API keys, passwords, and credentials without exposing plain-text values.
sidebarTitle: Secrets
icon: /src/contents/docs/icons/concepts.svg
docId: secrets
---

Secrets let you store sensitive values (API keys, passwords, certificates) outside your flow definitions and inject them at runtime via the `secret()` function.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/u0yuOYG-qMI?si=9T-mMYgs-_SOIPoG" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

How secrets are stored depends on your edition. Enterprise Edition and Kestra Cloud connect to a dedicated Secrets Manager backed by AWS Secrets Manager, Azure Key Vault, HashiCorp Vault, or Kestra's own store. Open-Source has no secret store; `secret()` reads base64-encoded environment variables instead. In every edition, flows read secrets the same way.

## Use a secret in a flow

Reference a secret by its key with the `secret()` function:

```yaml
id: postgres_to_s3
namespace: company.team

tasks:
  - id: fetch
    type: io.kestra.plugin.jdbc.postgresql.Query
    url: jdbc:postgresql://127.0.0.1:56982/
    username: pg_user
    password: "{{ secret('POSTGRES_PASSWORD') }}"
    sql: select id, first_name, last_name, city from users
    fetchType: STORE

  - id: write_to_s3
    type: io.kestra.plugin.aws.s3.Upload
    accessKeyId: "{{ secret('AWS_ACCESS_KEY') }}"
    secretKeyId: "{{ secret('AWS_SECRET_KEY') }}"
    region: "eu-central-1"
    from: "{{ outputs.fetch.uri }}"
    bucket: "kestra-bucket"
    key: "data/users.csv"
```

`secret()` also reads a single field from a JSON secret, returns secret metadata, and can return `null` instead of failing when a key is missing. See the [`secret()` function reference](../../expressions/04.functions/02.data-access/index.mdx#secret) for all arguments.

## Secrets in Open-Source

Open-Source has no dedicated secret store. Kestra reads environment variables prefixed with `SECRET_`, base64-decodes their values at startup, and exposes them through `secret()`. This keeps sensitive values out of flow YAML, but offers no encryption at rest, no audit trail, and no access control beyond what your host environment provides.

The steps below load secrets into a Kestra instance that runs with Docker Compose.

### Encode your secrets

1. Define your secrets in a `.env` file:

   ```bash
   POSTGRES_PASSWORD=actual_postgres_password
   AWS_ACCESS_KEY=actual_aws_access_key
   AWS_SECRET_KEY=actual_aws_secret_key
   ```

2. Generate an `.env_encoded` file that adds the `SECRET_` prefix to each name and base64-encodes each value:

   ```bash
   while IFS='=' read -r key value; do
       echo "SECRET_$key=$(echo -n "$value" | openssl base64 -A)";
   done < .env > .env_encoded
   ```

   Each line of `.env_encoded` now looks like `SECRET_POSTGRES_PASSWORD=YWN0dWFsX3Bvc3RncmVzX3Bhc3N3b3Jk`. To encode a single value, run `echo -n "<SECRET>" | openssl base64 -A`.

The script uses `openssl base64 -A` instead of plain `base64` because each encoded value must stay on one line. On Linux, `base64` wraps its output every 76 characters, so a long value such as an API token or private key splits across several lines. Docker Compose reads only the first line, and Kestra receives a truncated secret without logging an error. The `-A` flag disables wrapping, and the command works the same on Linux and macOS.

:::alert{type="warning"}
Encode values without a trailing newline: use `echo -n`, and save `.env` with LF (not CRLF) line endings. Otherwise the newline becomes part of the secret and API calls fail with authentication errors. As a fallback, strip it in the flow with `{{ secret('POSTGRES_PASSWORD') | trim }}`.
:::

### Load the encoded file

Point the Kestra service in your `docker-compose.yml` to the encoded file, then restart Kestra:

```yaml
kestra:
  image: kestra/kestra:latest
  env_file:
    - .env_encoded
```

Kestra reads `SECRET_` variables only at startup, so restart it after adding or changing a secret. If a value isn't valid base64, Kestra logs `Could not decode secret` at startup and skips that secret.

### Reference the secrets

In flows, drop the `SECRET_` prefix: `SECRET_POSTGRES_PASSWORD` becomes `{{ secret('POSTGRES_PASSWORD') }}`. Keys aren't case-sensitive, so `secret('postgres_password')` resolves to the same value. Every flow on the instance can read every secret, whatever its namespace.

## Secrets in Enterprise Edition and Cloud

Secrets are the right choice for static sensitive values: API keys, passwords, webhook URLs, certificates, and long-lived tokens. For reusable server-to-server authentication, where Kestra needs to mint or refresh short-lived tokens at runtime, use [Credentials](../../07.enterprise/03.auth/credentials/index.md) instead. Credentials can reference secrets for sensitive inputs such as client secrets and private keys.

Secrets are available under **Namespaces → [namespace] → Secrets** or under **Tenant → Secrets** in the sidebar. Each secret has a key name, optional description, and tags. From the same tab, edit, delete, or copy a secret as a Pebble expression, such as `"{{ secret('API_TOKEN') }}"`, ready to paste into a flow.

For available backends, see the [Secrets Manager](../../07.enterprise/02.governance/secrets-manager/index.md) page. For choosing between secrets, credentials, and the KV Store, see [Choosing where to store sensitive and shared values](../../14.best-practices/10.credentials-vs-secrets-vs-kv-store/index.md).

### Namespace inheritance

`secret()` looks for the key in the flow's namespace first, then in each parent namespace up to the root. The closest match wins, so a secret in `company.team` overrides one with the same key in `company`. If no namespace holds the key, Kestra falls back to the `SECRET_` environment variables described in [Secrets in Open-Source](#secrets-in-open-source).

Because child namespaces inherit them, secrets stored at a root namespace are readable by every flow below it. Store each secret at the lowest namespace that still covers the flows that need it. If you need inheritance without allowing downstream edits, consider [read-only secrets](../../07.enterprise/02.governance/secrets-manager/index.md).

### Reading secrets from another namespace

You can pass a `namespace` argument to read a secret stored in a namespace outside the flow's hierarchy:

```yaml
tasks:
  - id: use_shared_secret
    type: io.kestra.plugin.core.log.Log
    message: "{{ secret('SHARED_TOKEN', namespace='shared.secrets') }}"
```

The secret resolves using the target namespace's own backend, so a flow can read a value from a namespace backed by a different secrets manager. Cross-namespace reads stay within the same tenant. Access is allowed by default; restrict it by configuring `allowedNamespaces` on the target namespace.

## Keep secrets out of logs

Kestra masks secrets in task logs on a best-effort basis. Every value returned by `secret()` during an execution, and its base64-encoded form, is replaced with `******` in log messages. Masking matches the exact value only. If a flow transforms a secret, for example by extracting a substring, concatenating it, encoding it another way, or reading part of it with `jq()`, the result isn't masked.

For example, this flow reads one field from a JSON secret and logs it:

```yaml
id: secret_test
namespace: company.team

tasks:
  - id: hello
    type: io.kestra.plugin.core.log.Log
    message: "You can see my secret token {{ secret('JSON_SECRET') | jq('.token') }}"
```

Only the full JSON value is registered for masking, so the token appears in the log in plain text:

```text
You can see my secret token ["SUPER_SECRET"]
```

The **Debug Expression** tool on an execution's **Outputs** tab never reveals secrets: `secret()` returns `******` there.

To limit exposure:

- Never log secrets, even in debug or test flows.
- Avoid filters and string functions on secrets in messages or outputs. See the [filter reference](../../expressions/03.filters/index.mdx) for the transformations that can bypass masking.
- Pass secrets only to the tasks that need them, and keep them out of flow outputs.
- In Enterprise Edition, use [RBAC](../../07.enterprise/03.auth/rbac/index.md) to control who can view and manage secrets.
