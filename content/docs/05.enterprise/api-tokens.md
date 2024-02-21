---
title: API Tokens
icon: /docs/icons/admin.svg
---

This page describes how you can manage API tokens in Kestra.

## What is an API token

API tokens are used to authenticate requests to the Kestra API. You can create an API token for a user or a [service account](./service-accounts.md).

## Where you can use API tokens

API tokens are used anytime you want to grant programmatic access to the Kestra API. To authenticate your custom API calls, you can pass a bearer token to the request header. For example, you can use API tokens to authenticate with the Kestra API from a CI/CD pipeline, or from a custom application.

Currently, we support API tokens as authentication mechanism for the following services:
1. [GitHub Actions](https://github.com/kestra-io/deploy-action)
2. [Terraform Provider](https://registry.terraform.io/providers/kestra-io/kestra/latest/docs)
3. [Kestra CLI](./cli.md)
4. [Kestra API](./api.md)

