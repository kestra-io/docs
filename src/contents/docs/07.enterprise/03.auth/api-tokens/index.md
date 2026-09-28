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
