---
title: "API Tokens in Kestra: Manage Programmatic Access"
h1: Create and Control API Tokens for Users and Service Accounts
description: Manage programmatic access with API Tokens in Kestra. Create and control tokens for users and service accounts to securely interact with the Kestra API.
sidebarTitle: API Tokens
icon: /src/contents/docs/icons/admin.svg
editions: ["EE", "Cloud"]
version: ">= 0.15.0"
---

API tokens grant programmatic access to the Kestra API for users and [service accounts](../service-accounts/index.md).

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/g-740VZLRdA?si=lHUE7qeI6ehOyfsf" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Where you can use API tokens

Pass a token as a `Bearer` header to authenticate any Kestra API call — from a CI/CD pipeline, a custom application, or any of the following:

- [GitHub Actions](https://github.com/kestra-io/kestra-actions)
- [Terraform Provider](https://registry.terraform.io/providers/kestra-io/kestra/latest/docs)
- [Kestra Server CLI](../../../kestra-cli/kestra-server/index.md)
- [kestractl](../../../kestra-cli/kestractl/index.md)
- [Kestra API](../api/index.md)

## User API tokens

User tokens are created via **Settings → API Tokens** or the user avatar menu. Each token has a name, optional description, and maximum age. Leaving max age blank creates a non-expiring token. Extended mode resets the expiry on each use. The token is shown only at creation.

## Service account API tokens

Service account tokens are created from **IAM → Service Accounts**: open the service account, select the **API Tokens** tab, and click **Create**. The form fields and expiry options are the same as for user tokens.

## API request authentication

To authenticate your custom API calls, pass a `Bearer` token to the request's `Authorization` header. The following example triggers a flow execution via the Kestra API:

```bash
curl -X POST http://localhost:8080/api/v1/executions/dev/hello-world \
-H "Authorization: Bearer YOUR_API_TOKEN"
```

## How API tokens are secured

An API token is an **opaque bearer credential** — a high-entropy random value generated with a cryptographically secure random number generator. It is **not** a [JWT](https://datatracker.ietf.org/doc/html/rfc7519): it carries no claims and is not signed. This is different from the JWT session cookie used for interactive [UI login](../04.authentication/index.md), which service accounts never use.

- **At rest**, Kestra does not store the token itself. Only a salted SHA-512 hash of the token's secret is persisted, alongside a short prefix used to identify the token in the UI. The plaintext token is shown only once, at creation, and cannot be retrieved afterwards.
- **On each request**, the presented token is re-hashed and compared against the stored hash in constant time, the owning user or service account must still be active, and the token must not have expired (see maximum age above).
- **In transit**, the token is sent in the `Authorization: Bearer` header, so API traffic should always run over HTTPS. Treat a token like a password: store it in a secret manager, never commit it to source control, and revoke it if it may have been exposed.
