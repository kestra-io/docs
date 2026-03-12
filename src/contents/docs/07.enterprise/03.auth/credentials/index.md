---
title: Credentials in Kestra – Secure Authentication to External Systems
description: Authenticate to external systems securely.
sidebarTitle: Credentials
icon: /src/contents/docs/icons/concepts.svg
editions: ["EE"]
---

Authenticate to external systems securely.

## Credentials – Server to Server authentication for Flows

Credentials are a reusable way to configure server-to-server authentication credentials once and use it across tasks.

Instead of embedding token minting/refresh logic in each plugin, Kestra can mint and refresh access tokens at runtime and you reference them in your workflow with a simple expression.

Many APIs are moving away from long-lived static API keys toward **short-lived tokens** (e.g. OAuth 2.0), which improves security and simplifies rotation and revocation.

For simple static values (API keys, usernames/passwords), use [Secrets](../../../06.concepts/04.secret/index.md) directly.

Sensitive material used by a credential (client secrets, private keys, certificates) is referenced via [Secrets](../../../06.concepts/04.secret/index.md) so it can be stored in external or read-only secret managers (e.g., [Secrets Manager](../../02.governance/secrets-manager/index.md) or [Read-only Secrets](../../02.governance/read-only-secrets/index.md)) and never appears in plain text in the credential config.

---

## Availability and scope

Credentials can be accessed and created at:

- **Tenant level** (reusable across namespaces in that tenant)
- **Namespace level** (scoped to a single namespace)

During setup, Kestra lets you **test token retrieval** from the UI to ensure your configuration is correct.

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

For non-sensitive configuration (e.g., hostnames, table names, feature flags), prefer [Variables](../../../05.workflow-components/04.variables/index.md).

---

## Example: Google service account with JWT Bearer

The following example shows how to use a Google Cloud service account with an OAuth2 JWT Bearer credential in Kestra.

### 1. Create a service account in Google Cloud

In Google Cloud:

1. Go to **IAM & Admin** -> **Service Accounts**.
2. Create a new service account and grant it only the roles required for your use case.
3. Open the service account, go to **Keys**, and create a new **JSON** key.
4. Download the JSON key file.

From that JSON file, you will use:

- `client_email`
- `private_key`
- `private_key_id`
- `token_uri`

For more information, see the [Google service account guide](https://cloud.google.com/iam/docs/service-account-overview).

### 2. Create a secret for the private key

Store the private key from the downloaded JSON in a Kestra secret rather than embedding it directly in the credential.

For example, create a secret named `GCP_PRIVATE_KEY` with the value of the `private_key` field from the JSON file.

You can manage that secret from the Kestra UI or by using an external [Secrets Manager](../../02.governance/secrets-manager/index.md).

### 3. Create the credential in Kestra

In the Credentials UI, create a new credential with the following values:

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

```text
https://www.googleapis.com/auth/cloud-platform.read-only https://www.googleapis.com/auth/bigquery.readonly
```

:::alert{type="info"}
Use the **Test connection** action in the Credentials UI to confirm that Kestra can mint an access token before using the credential in a flow.
:::

### 4. Use the credential in a flow

Once the credential is saved, you can use it in a flow with the `credential()` Pebble function.

The example below calls the Google Cloud Resource Manager API and sends the access token as a Bearer token in the request header:

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

---

## Credential types

Credentials cover common server-to-server authentication patterns, including:

- OAuth2 `client_credentials` (generic)
- OAuth2 JWT Bearer extension grant (`jwt_bearer`, RFC 7523)
- OAuth2 `private_key_jwt` (client authentication)
- GitHub App

Credentials can reference sensitive inputs via existing [Secrets](../../../06.concepts/04.secret/index.md) (e.g., client secrets, private keys, certificates), including secrets stored in an external or [read-only secrets manager](../../02.governance/read-only-secrets/index.md).

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
- **Avoid leaking values:** don’t print tokens or derived values (e.g., substrings) to logs; see [Best Practices for Secrets](../../../14.best-practices/9.secrets-management/index.md).
