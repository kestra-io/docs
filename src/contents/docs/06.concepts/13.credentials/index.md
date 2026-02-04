---
title: Credentials in Kestra – Secure Authentication to External Systems
description: Authenticate to external systems securely.
sidebarTitle: Credentials
icon: /src/contents/docs/icons/concepts.svg
editions: ["EE"]
---

Authenticate to external systems securely.

<!-- needs replacement -->
<div class="video-container">
  <iframe src="https://www.youtube.com/embed/u0yuOYG-qMI?si=9T-mMYgs-_SOIPoG" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Credentials – Server to Server authentication for Flows

Credentials are a reusable way to configure server-to-server authentication credentials once and use it across tasks.

Instead of embedding token minting/refresh logic in each plugin, Kestra can mint and refresh access tokens at runtime and you reference them in your workflow with a simple expression.

Many APIs are moving away from long-lived static API keys toward **short-lived tokens** (e.g. OAuth 2.0), which improves security and simplifies rotation and revocation.

For simple static values (API keys, usernames/passwords), use [Secrets](../04.secret/index.md) directly.

Sensitive material used by a credential (client secrets, private keys, certificates) is referenced via [Secrets](../04.secret/index.md) so it can be stored in external or read-only secret managers (e.g., [Secrets Manager](../../07.enterprise/02.governance/secrets-manager/index.md) or [Read-only Secrets](../../07.enterprise/02.governance/read-only-secrets/index.md)) and never appears in plain text in the credential config.

---

## Availability and scope

Credentials are available in the **Enterprise Edition** only.

Credentials can be created at:

- **Tenant level** (reusable across namespaces in that tenant)
- **Namespace level** (scoped to a single namespace)

During setup, Kestra lets you **test token retrieval** from the UI.

---

## Use a credential in a flow

Use the `credential()` Pebble function to retrieve the **current access token** for a credential key.

```yaml
id: api_call
namespace: company.team

tasks:
  - id: request
    type: io.kestra.plugin.core.http.Request
    uri: https://api.example.com/v1/ping
    method: GET
    auth:
      type: BEARER
      token: "{{ credential('my_oauth') }}"
```

`credential()` returns the access token only.

For non-sensitive configuration (e.g., hostnames, table names, feature flags), prefer [Variables](../../05.workflow-components/04.variables/index.md).

---

## Credential types

Credentials cover common server-to-server authentication patterns, including:

- OAuth2 `client_credentials` (generic)
- OAuth2 JWT Bearer extension grant (`jwt_bearer`, RFC 7523)
- OAuth2 `private_key_jwt` (client authentication)
- GitHub App

Credentials can reference sensitive inputs via existing [Secrets](../04.secret/index.md) (e.g., client secrets, private keys, certificates), including secrets stored in an external or read-only secrets manager.

---

## Token lifecycle and caching

- Tokens are **not persisted**.
- The token cache is **in-memory only** (when enabled).
- Tokens are retrieved during **task execution** and refreshed based on the **Refresh before expiry** setting configured on the credential.
- Token caching can be **enabled or disabled** per credential.

:::alert{type="warning"}
Avoid storing long-lived secrets directly in flow YAML. Prefer credentials + secrets so Kestra can handle token minting/refresh and reduce exposure risk.
:::

---

## Credential hygiene

- **Least privilege:** scope credentials to the smallest set of permissions required.
- **Rotate regularly:** prefer short-lived tokens where possible; rotate long-lived keys.
- **Avoid leaking values:** don’t print tokens or derived values (e.g., substrings) to logs; see [Best Practices for Secrets](../../14.best-practices/9.secrets-management/index.md).
