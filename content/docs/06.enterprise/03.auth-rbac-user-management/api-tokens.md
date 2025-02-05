---
title: API Tokens
icon: /docs/icons/admin.svg
editions: ["EE"]
version: ">= 0.15.0"
---

How to manage API tokens in Kestra.


## What is an API token

API tokens are used to authenticate API requests to the Kestra API. You can create an API token for a user or a [service account](../06.enterprise/service-accounts.md).

## Where you can use API tokens

API tokens are used anytime you want to grant programmatic access to the Kestra API. To authenticate your custom API calls, you can pass a bearer token to the request header. For example, you can use API tokens to authenticate with the Kestra API from a CI/CD pipeline, or from a custom application.

Currently, we support API tokens as authentication mechanism for the following services:
1. [GitHub Actions](https://github.com/kestra-io/deploy-action)
2. [Terraform Provider](https://registry.terraform.io/providers/kestra-io/kestra/latest/docs)
3. [Kestra CLI](../06.enterprise/cli.md)
4. [Kestra API](../06.enterprise/api.md)

## How to create an API token

To create an API token, navigate to the `Administration` section and click on the `Service Accounts` or `Users` page, depending on whether you want to create an API token for a service account (bot) or a regular user (human).

Then, go to the `API Tokens` tab and click on the `Create` button:

![api-token](/docs/enterprise/api-token.png)

Fill in the form with the required information including the `Name`, `Description` and `Max age`, and click `Generate`:

![api-token2](/docs/enterprise/api-token2.png)

::alert{type="info"}
**Note:** you can configure the token to expire after a certain period of time, or to never expire. Also, there is a toggle called `Extended` that will automatically prolong the token's expiration date by the specified number of days (`Max Age`) if the token is actively used. That toggle is disabled by default.
::

Once you confirm the API token creation via the **Generate** button, the token will be generated and displayed in the UI. Make sure to copy the token and store it in a secure location as it will not be displayed again.

![api-token3](/docs/enterprise/api-token3.png)


## How to use an API token in an API request

To authenticate your custom API calls, you can pass a `Bearer` token to the request's `Authorization` header. Here is an example that will trigger a flow execution using the Kestra API:

```bash
curl -X POST http://localhost:8080/api/v1/executions/dev/hello-world \
-H "Authorization: Bearer YOUR_API_TOKEN"
```