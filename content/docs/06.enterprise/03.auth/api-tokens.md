---
title: API Tokens
icon: /docs/icons/admin.svg
editions: ["EE", "Cloud"]
version: ">= 0.15.0"
---

How to manage API tokens in Kestra.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/g-740VZLRdA?si=lHUE7qeI6ehOyfsf" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## What is an API token

API tokens authenticate requests to the Kestra API. You can create an API token for a user or a [service account](../06.enterprise/service-accounts.md).

## Where you can use API tokens

API tokens are used anytime you want to grant programmatic access to the Kestra API. To authenticate your custom API calls, you can pass a bearer token to the request header. For example, you can use API tokens to authenticate with the Kestra API from a CI/CD pipeline or from a custom application.

Currently, we support API tokens as an authentication mechanism for the following services:
1. [GitHub Actions](https://github.com/kestra-io/deploy-action)
2. [Terraform Provider](https://registry.terraform.io/providers/kestra-io/kestra/latest/docs)
3. [Kestra CLI](../../ee-server-cli/index.md)
4. [Kestra API](./api.md)

## How to create a User API token

To create an API token, navigate to your profile in the bottom left corner of the Kestra UI and click on **+ Create API Token**.

![user-api-token](/docs/enterprise/user-api-token.png)

Once in your profile, click **+ Create API Token** in the **Manage your API Tokens** section.

![create-api-token](/docs/enterprise/create-api-token.png)

Fill in the form with the required information, including the `Name`, `Description`, and `Max age`. Once satisfied, click `Generate`:

![new-token-details](/docs/enterprise/new-token-details.png)

:::alert{type="info"}
**Note:** you can configure the token to expire after a certain period of time or to never expire. Also, there is a toggle called `Extended` that automatically prolongs the token's expiration date by the specified number of days (`Max Age`) if the token is actively used. This toggle is disabled by default.
:::

Once you confirm the API token creation, the token will be generated and displayed in the UI. Make sure to copy the token and store it in a secure location, as it will not be displayed again.

![copy-and-save](/public/docs/enterprise/copy-and-save.png)

## How to create a Service Account API token

To create an API token for a Service Account, navigate to the `Administration` section and click the `Service Accounts` page.

Then, go to the `API Tokens` tab and click the `Create` button:

![api-token](/docs/enterprise/api-token.png)

Fill in the form with the required information including the `Name`, `Description`, and `Max age`. Once satisfied, click `Generate`:

![api-token2](/docs/enterprise/api-token2.png)

:::alert{type="info"}
**Note:** same as for a user token, you can configure the token to expire after a certain period of time or to never expire. Also, there is a toggle called `Extended` that will automatically prolong the token's expiration date by the specified number of days (`Max Age`) if the token is actively used. That toggle is disabled by default.
:::

Once you confirm the API token creation via the **Generate** button, the token will be generated and displayed in the UI. Make sure to copy the token and store it in a secure location as it will not be displayed again.

![api-token3](/docs/enterprise/api-token3.png)


## How to use an API token in an API request

To authenticate your custom API calls, pass a `Bearer` token to the request's `Authorization` header. Here is an example that will trigger a flow execution using the Kestra API:

```bash
curl -X POST http://localhost:8080/api/v1/executions/dev/hello-world \
-H "Authorization: Bearer YOUR_API_TOKEN"
```
