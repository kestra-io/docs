---
title: "Service Accounts in Kestra Enterprise: CI/CD Auth"
h1: Create Service Accounts for Programmatic and CI/CD Access
description: Create and manage Service Accounts in Kestra. Securely authenticate external applications and CI/CD pipelines with programmatic access tokens.
sidebarTitle: Service Accounts
icon: /src/contents/docs/icons/admin.svg
editions: ["EE", "Cloud"]
version: ">= 0.15.0"
---

Service accounts represent applications or CI/CD systems that access Kestra programmatically, without a password or UI access. Each service account has a name, an optional description, an optional group assignment, and a list of roles that grant it permissions to specific resources.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/5_rVseynye4?si=LdgbY4LOwYLgIat2" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Service accounts vs. users

Service accounts have no password and no access to the Kestra UI — they authenticate exclusively via API token. Users, by contrast, can interact with both the UI and the API using a password or an API token.

## Creating a service account

To create a new service account, go to **IAM** in the sidebar, open the **Service Accounts** tab, and click **Create**. Fill in the name and optional description, then click **Save**.

Once the service account is created, switch to the **Access** tab, click **Add**, and select the role to assign.

To generate an API token, click **Create API Token** in the service account details. You can configure the token to expire after a set period or never expire. The **Extended** toggle (disabled by default) automatically resets the expiry each time the token is used. Click **Generate**, then copy the token immediately — it is shown only once.

## Users, service accounts, and API tokens

You can create an API token for a regular user as well. While service accounts are recommended for programmatic access from CI/CD or external applications, user API tokens are useful when you want programmatic actions to be tracked and audited against a specific person.

The key difference: a service account has no password or personal information and is authenticated exclusively with an API token. A user can interact with both the UI and the API, using either a password or an API token.

## Allocating service accounts to groups

Each service account can be attached to one or more groups, such as a “Bots” group that centrally governs programmatic access for CI/CD across multiple projects with a single role. This simplifies managing Terraform, GitHub Actions, or other external application access in one place.

## CLI authentication

When using the Kestra CLI, you can authenticate with either an API token or a username and password:

1. Use `--api-token` to authenticate with a service account token:

```bash
./kestra namespace files update prod scripts . \
--server=https://demo.kestra.io --api-token yourtoken
```

2. Use `--user` to authenticate with Basic Auth credentials:

```bash
./kestra namespace files update prod scripts . \
--server=https://demo.kestra.io --user=rick.astely@kestra.io:password42
```

## Service account name convention

Follow the DNS naming convention when naming service accounts. The `name` property must:
- contain at most 63 characters
- contain only lowercase alphanumeric characters or hyphens (`-`)
- start with an alphanumeric character
- end with an alphanumeric character.

Examples:
- ✅ `my-service-account` is a valid name
- ✅ `my-service-account-1` is a valid name
- ❌ `MY_SERVICE_ACCOUNT` is not a valid name because it contains uppercase characters and underscores
- ❌ `myServiceAccount` is not a valid name because it contains uppercase characters and camel case
- ❌ `my-service-account-` is not a valid name because it ends with a hyphen.

Kestra uses the DNS-style naming convention so that service account names remain valid across contexts where they may be forwarded, such as Kubernetes pod labels.
