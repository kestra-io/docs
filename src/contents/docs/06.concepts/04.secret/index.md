---
title: "Secrets in Kestra: Store Sensitive Values Securely"
h1: Store and Access Sensitive Information Securely
description: Store and access sensitive information securely in Kestra. Use Secrets to protect API keys, passwords, and credentials without exposing plain-text values.
sidebarTitle: Secrets
icon: /src/contents/docs/icons/concepts.svg
---

Secrets let you store sensitive values (API keys, passwords, certificates) outside your flow definitions and inject them at runtime via the `secret()` function.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/u0yuOYG-qMI?si=9T-mMYgs-_SOIPoG" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

How secrets are stored depends on your edition. Enterprise Edition connects to a dedicated Secrets Manager backed by AWS Secrets Manager, Azure Key Vault, HashiCorp Vault, or Kestra's own store. Open-Source has no secret store — `secret()` reads a base64-encoded environment variable instead.

## Enterprise Edition

Secrets are the right choice for static sensitive values: API keys, passwords, webhook URLs, certificates, and long-lived tokens. For reusable server-to-server authentication — where Kestra needs to mint or refresh short-lived tokens at runtime — use [Credentials](../../07.enterprise/03.auth/credentials/index.md) instead. Credentials can reference secrets for sensitive inputs such as client secrets and private keys.

Secrets are available under **Namespaces → [namespace] → Secrets** or under **Tenant → Secrets** in the sidebar. Click **New secret**, set a key name such as `MY_SECRET`, and optionally add a description and tags. From the same tab you can edit, delete, or copy a secret as a Pebble expression — for example, `"{{ secret('API_TOKEN') }}"` — ready to paste into a flow.

For available backends, see the [Secrets Manager](../../07.enterprise/02.governance/secrets-manager/index.md) page. For best practices, see [Secrets management](../../14.best-practices/9.secrets-management/index.md) and [Choosing where to store sensitive and shared values](../../14.best-practices/10.credentials-vs-secrets-vs-kv-store/index.md).

### Reading secrets from another namespace

By default, `secret()` reads from the flow's own namespace. You can pass a `namespace` argument to read a secret stored in a different namespace:

```yaml
tasks:
  - id: use_shared_secret
    type: io.kestra.plugin.core.log.Log
    message: "{{ secret('SHARED_TOKEN', namespace='shared.secrets') }}"
```

The secret resolves using the target namespace's own backend, so a flow can read a value from a namespace backed by a different secrets manager. Cross-namespace reads stay within the same tenant. Access is allowed by default; restrict it by configuring `allowedNamespaces` on the target namespace.

## Secrets in Open-Source

Open-Source has no dedicated secret store. Kestra reads base64-encoded environment variables prefixed with `SECRET_` and exposes them via the `secret()` function. This keeps sensitive values out of flow YAML, but offers no encryption at rest, no audit trail, and no access control beyond what your host environment provides.

See [Configure secrets in Kestra (OSS)](../../15.how-to-guides/secrets/index.md) for step-by-step instructions on encoding values and wiring them into your Docker Compose file.

