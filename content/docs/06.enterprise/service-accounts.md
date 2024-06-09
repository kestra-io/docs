---
title: Service Accounts
icon: /docs/icons/admin.svg
editions: ["EE"]
---

How to create and manage Service Accounts.


A Service Account represents an **application** that can access Kestra. It is not tied to a specific person, and does not have personal information (such as the first name, last name or email) attached to it. Instead, it only has a name, an optional description, an optional allocation to a group, and a list of Roles that grant it permissions to access specific resources.

## Service Accounts vs. Users

In contrast to regular users, Service Accounts don't have a password and their access doesn't provide access to the Kestra UI — they only have a programmatic API access to Kestra. You can think of Service Accounts as bots authenticating with Kestra using an API token.

## Creating a Service Account

To create a new service account, go to the Service Accounts page under the Administration section and click on the **Create** button. Fill in the form with the required information including the name and description, and click **Save**:

![service_account_create](/docs/user-interface-guide/service_account_create.png)

Once you have created a service account, you can add a Role that will grant the service account permissions to specific resources. To do this, click on the **Add** button and select the role you want to assign to the service account.

![service_account_create](/docs/user-interface-guide/service_account_create.png)

Finally, you can generate an API token for the service account by clicking on the **Create** button. This will generate a token that you can use to authenticate the service account with Kestra from external applications such as CI/CD pipelines (e.g. in Terraform provider configuration or GitHub Actions secrets).

![service_account_create](/docs/user-interface-guide/service_account_create.png)

::alert{type="info"}
**Note:** You can configure the token to expire after a certain period of time, or to never expire. Also, there is a toggle called `Extended` that will automatically prolong the token's expiration date by the specified number of days (`Max Age`) if the token is actively used. That toggle is disabled by default.
::

Once you confirm the API token creation via the **Generate** button, the token will be generated and displayed in the UI. Make sure to copy the token and store it in a secure location as it will not be displayed again.

![service_account_create_2](/docs/user-interface-guide/service_account_create_2.png)

## Users vs. Service Accounts vs. API Tokens

You can create an **API token** for a regular **User** as well. While Service Accounts are recommended for programmatic API access to Kestra from CI/CD or other external applications, it's often useful to create an API token for a regular user, so that programmatic actions performed by that user can be tracked and audited.

![service_account_create_3](/docs/user-interface-guide/service_account_create_3.png)

Therefore, the difference between a Service Account and a User is that a Service Account is designed for programmatic access, and doesn't have a password or personal information attached to it. Instead, it is authenticated exclusively using an API token. A User, on the other hand, can interact with both the Kestra UI and the API, and can be authenticated using a password or an API token.

## The Purpose of Service Accounts

Service Accounts are intended for programmatic access to Kestra from any other application, such as CI/CD pipelines or your own custom APIs. For example, you can use the token **to authenticate with Kestra Terraform provider or Kestra's GitHub Actions CI/CD pipeline**.

## Allocating Service Accounts to Groups

Each Service Account can be attached to one or more Groups e.g. a group “Bots” that centrally governs programmatic access for CI/CD across multiple projects with just one Role. This is useful to manage programmatic access used by Terraform, GitHub Action, or other external applications, in one place by attaching a single Role to that Group.

Speaking of CI/CD, note that currently Kestra supports authenticating with both Basic Authentication User, as well as with an API token:

1. Use the `--api-token=mytoken` CLI property to allow authenticating with a service account token, e.g.:

```
./kestra namespace files update prod scripts . \
--server=https://demo.kestra.io --api-token yourtoken
```

2. Use the `--user user_email:password` flag to the CLI to allow authenticating with a Basic Authentication access, e.g.:

```
./kestra namespace files update prod scripts . \
--server=https://demo.kestra.io --user=rick.astely@kestra.io:password42
```

