---
title: "Credentials in Kestra: Authenticate External Systems"
h1: Securely Connect Flows to External Systems with Credentials
description: Authenticate to external systems securely with Kestra Credentials. Store and manage server-to-server auth tokens for use across flows and namespaces.
sidebarTitle: Credentials
icon: /src/contents/docs/icons/concepts.svg
editions: ["EE", "Cloud"]
---

Credentials let you configure server-to-server authentication once and reuse it across tasks. Instead of embedding token minting and refresh logic in each plugin, Kestra handles this at runtime and you reference the current token with a simple expression.

Many APIs are moving away from long-lived static API keys toward **short-lived tokens** (e.g. OAuth 2.0), which improves security and simplifies rotation and revocation.

For simple static values (API keys, usernames/passwords), use [Secrets](../../../06.concepts/04.secret/index.md) directly.

Sensitive material used by a credential (client secrets, private keys, certificates) is referenced via [Secrets](../../../06.concepts/04.secret/index.md) so it can be stored in an external secret manager and never appears in plain text in the credential config.

## Availability and scope

Credentials can be accessed and created at:

- **Tenant level** (reusable across namespaces in that tenant)
- **Namespace level** (scoped to a single namespace)

During setup, Kestra lets you **test token retrieval** from the UI to ensure your configuration is correct.

## The credential() function

The `credential()` Pebble function retrieves the current access token for a credential key.

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

For non-sensitive configuration (e.g., hostnames, table names, feature flags), prefer [Variables](../../../05.workflow-components/04.variables/index.md).

## Credential types

Credentials cover common server-to-server authentication patterns, including:

- OAuth2 `client_credentials` (generic)
- OAuth2 JWT Bearer extension grant (`jwt_bearer`, RFC 7523)
- OAuth2 `private_key_jwt` (client authentication)
- GitHub App

Credentials can reference sensitive inputs via existing [Secrets](../../../06.concepts/04.secret/index.md) (e.g., client secrets, private keys, certificates), including secrets stored in an external or [read-only secrets manager](../../02.governance/secrets-manager/index.md).

## Example: Google service account with JWT Bearer

The following example shows how to use a Google Cloud service account with an OAuth2 JWT Bearer credential in Kestra.

### Google Cloud service account

Create a Google Cloud service account and download a JSON key file. The credential requires `client_email`, `private_key`, `private_key_id`, and `token_uri` from that file. See the [Google service account guide](https://cloud.google.com/iam/docs/service-account-overview).

Store the private key as a Kestra secret (for example, `GCP_PRIVATE_KEY`). The secret can be managed from the Kestra UI or an external [Secrets Manager](../../02.governance/secrets-manager/index.md).

### Credential configuration

Create a new credential in the Credentials UI with the following values:

- **Credential Type:** `OAUTH2`
- **Auth Config Type:** `JWT_BEARER`
- **Token Endpoint:** `https://oauth2.googleapis.com/token`
- **Issuer:** the `client_email` value from the JSON key
- **Subject:** use the service account email for a standard service account flow; for Google Workspace domain-wide delegation, use the delegated user instead
- **Private Key:** reference the `GCP_PRIVATE_KEY` secret
- **Key ID:** the `private_key_id` value from the JSON key
- **Algorithm:** `RS256`
- **Additional Claims:** add a `scope` claim containing the Google OAuth scopes required by the API, for example `https://www.googleapis.com/auth/cloud-platform.read-only`

For Google service accounts, the scope must be included in the JWT claims. If you need multiple scopes, provide them as a single space-delimited string in the `scope` claim, for example:

```plaintext
https://www.googleapis.com/auth/cloud-platform.read-only https://www.googleapis.com/auth/bigquery.readonly
```

:::alert{type="info"}
The **Test connection** action in the Credentials UI confirms that Kestra can mint an access token before using the credential in a flow.
:::

### Flow usage

The `credential()` Pebble function references the saved credential. The example below calls the Google Cloud Resource Manager API with the access token as a Bearer token:

```yaml
id: google_api_with_credential
namespace: company.team

inputs:
  - id: project_id
    type: STRING

tasks:
  - id: request
    type: io.kestra.plugin.core.http.Request
    method: GET
    uri: "https://cloudresourcemanager.googleapis.com/v1/projects/{{ inputs.project_id }}"
    options:
      auth:
        type: BEARER
        token: "{{ credential('gcp-service-account') }}"

  - id: log_result
    type: io.kestra.plugin.core.log.Log
    message: |
      code={{ outputs.request.code }}
      body={{ outputs.request.body }}
```

If the service account has the required permissions on the target project, the request should return `200` and the project metadata in the response body.

## Token lifecycle and caching

- Tokens are **not persisted**.
- The token cache is **in-memory only** (when enabled).
- Tokens are retrieved during **task execution** and refreshed based on the **Refresh before expiry** setting configured on the credential.
- Token caching can be **enabled or disabled** per credential.

:::alert{type="warning"}
Avoid storing long-lived secrets directly in flow YAML. Prefer credentials + secrets so Kestra can handle token minting/refresh and reduce exposure risk.
:::

See [Best Practices for Secrets](../../../14.best-practices/9.secrets-management/index.md) for guidance on token exposure and key rotation.
