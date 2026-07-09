---
title: Automate IAM Management with Tasks
h1: Automate User, Group, and Access Management from Inside Flows
icon: /src/contents/docs/icons/tutorial.svg
stage: Advanced
topics:
  - Kestra Concepts
editions: ["EE", "Cloud"]
description: Use Kestra's IAM tasks to automate user onboarding, offboarding, group management, and service account provisioning directly from flows.
---

Automate Identity and Access Management (IAM) operations from inside a Kestra flow using the `io.kestra.plugin.kestra.ee.iam` task family.

These tasks let you manage users, groups, roles, bindings, service accounts, invitations, and tenant access programmatically — enabling event-driven onboarding from HR webhooks, scheduled access reviews, and automated service account provisioning.

:::alert{type="info"}
IAM tasks require Kestra Enterprise Edition or Kestra Cloud. The executing service account must hold the appropriate IAM permissions for each operation (see [RBAC permissions](../../07.enterprise/03.auth/rbac/index.md#resources)).
:::

## Authentication

All IAM tasks inherit `kestraUrl` and `auth` from `AbstractKestraTask`.

- `kestraUrl` defaults to `{{ kestra.url }}`, which resolves to the current Kestra instance. Omit it when targeting the same instance.
- `auth` accepts an API token or HTTP Basic credentials. When `auth` is omitted entirely, the task falls back to the execution's automatic authentication context.

The recommended pattern for production flows is an API token stored as a secret:

```yaml
auth:
  apiToken: "{{ secret('KESTRA_API_TOKEN') }}"
```

If the flow runs under a service account that already has IAM permissions, you can omit `auth` and the task uses that context automatically.

## Onboard a user

This flow is triggered by a webhook — for example, from an HRIS system when a new employee is added. It invites the user to the tenant and assigns them to an existing group in a single task.

```yaml
id: onboard_user
namespace: company.iam
editions: ["EE", "Cloud"]

inputs:
  - id: email
    type: STRING
    description: New user's email address
  - id: group_id
    type: STRING
    description: ID of the group to assign the user to

tasks:
  - id: invite
    type: io.kestra.plugin.kestra.ee.iam.invitations.Create
    auth:
      apiToken: "{{ secret('KESTRA_API_TOKEN') }}"
    email: "{{ inputs.email }}"
    groupIds:
      - "{{ inputs.group_id }}"

triggers:
  - id: from_hris
    type: io.kestra.plugin.core.trigger.Webhook
    key: "{{ secret('ONBOARD_WEBHOOK_KEY') }}"
```

The task outputs `invitationId`, which you can chain into downstream tasks if needed. If an email server is configured in Kestra, the user receives an invitation email automatically. Otherwise, retrieve the invitation link from the IAM page to share manually.

## Offboard a user

This flow removes a user from a group and revokes their tenant access. Both steps require the user's internal `userId` — retrieve it from the IAM Users page or via your IdP integration.

```yaml
id: offboard_user
namespace: company.iam

inputs:
  - id: user_id
    type: STRING
    description: Internal Kestra user ID
  - id: group_id
    type: STRING
    description: ID of the group to remove the user from

tasks:
  - id: remove_from_group
    type: io.kestra.plugin.kestra.ee.iam.groups.RemoveMember
    auth:
      apiToken: "{{ secret('KESTRA_API_TOKEN') }}"
    groupId: "{{ inputs.group_id }}"
    userId: "{{ inputs.user_id }}"

  - id: revoke_access
    type: io.kestra.plugin.kestra.ee.iam.tenantAccess.Delete
    auth:
      apiToken: "{{ secret('KESTRA_API_TOKEN') }}"
    userId: "{{ inputs.user_id }}"

triggers:
  - id: from_hris
    type: io.kestra.plugin.core.trigger.Webhook
    key: "{{ secret('OFFBOARD_WEBHOOK_KEY') }}"
```

## Provision a service account for CI/CD

This flow creates a service account and attaches a role to it. It outputs the service account ID so you can use it in downstream automation — for example, to generate an API token or configure a CI/CD secret.

```yaml
id: provision_service_account
namespace: company.iam

inputs:
  - id: name
    type: STRING
    description: Service account name
  - id: role_id
    type: STRING
    description: Role ID to assign

tasks:
  - id: create_sa
    type: io.kestra.plugin.kestra.ee.iam.serviceAccounts.Set
    auth:
      apiToken: "{{ secret('KESTRA_API_TOKEN') }}"
    name: "{{ inputs.name }}"

  - id: bind_role
    type: io.kestra.plugin.kestra.ee.iam.bindings.Set
    auth:
      apiToken: "{{ secret('KESTRA_API_TOKEN') }}"
    subjectType: SERVICE_ACCOUNT
    externalId: "{{ outputs.create_sa.id }}"
    roleId: "{{ inputs.role_id }}"

outputs:
  - id: service_account_id
    type: STRING
    value: "{{ outputs.create_sa.id }}"
```

`serviceAccounts.Set` upserts by name — running the flow again with the same name updates the existing service account rather than creating a duplicate.

## Create and manage groups

Use `groups.Set` to create or update a group, then manage membership with `groups.AddMember` and `groups.RemoveMember`.

```yaml
tasks:
  - id: create_group
    type: io.kestra.plugin.kestra.ee.iam.groups.Set
    auth:
      apiToken: "{{ secret('KESTRA_API_TOKEN') }}"
    name: data-engineering
    groupDescription: "Data Engineering team"

  - id: add_member
    type: io.kestra.plugin.kestra.ee.iam.groups.AddMember
    auth:
      apiToken: "{{ secret('KESTRA_API_TOKEN') }}"
    groupId: "{{ outputs.create_group.id }}"
    userId: "{{ inputs.user_id }}"
```

Like `serviceAccounts.Set`, `groups.Set` upserts by name and outputs the group `id` for chaining.

## Available IAM tasks

| Task | Purpose |
| --- | --- |
| `io.kestra.plugin.kestra.ee.iam.invitations.Create` | Invite a user; optionally assign to groups |
| `io.kestra.plugin.kestra.ee.iam.invitations.List` | List pending invitations |
| `io.kestra.plugin.kestra.ee.iam.invitations.Delete` | Cancel a pending invitation |
| `io.kestra.plugin.kestra.ee.iam.groups.Set` | Create or update a group (upsert by name) |
| `io.kestra.plugin.kestra.ee.iam.groups.List` | List groups |
| `io.kestra.plugin.kestra.ee.iam.groups.Delete` | Delete a group by ID |
| `io.kestra.plugin.kestra.ee.iam.groups.AddMember` | Add a user to a group |
| `io.kestra.plugin.kestra.ee.iam.groups.RemoveMember` | Remove a user from a group |
| `io.kestra.plugin.kestra.ee.iam.roles.Set` | Create or update a role (upsert by name) |
| `io.kestra.plugin.kestra.ee.iam.roles.List` | List roles |
| `io.kestra.plugin.kestra.ee.iam.roles.Delete` | Delete a role by ID |
| `io.kestra.plugin.kestra.ee.iam.bindings.Set` | Attach a role to a user, group, or service account |
| `io.kestra.plugin.kestra.ee.iam.serviceAccounts.Set` | Create or update a service account (upsert by name) |
| `io.kestra.plugin.kestra.ee.iam.serviceAccounts.List` | List service accounts |
| `io.kestra.plugin.kestra.ee.iam.serviceAccounts.Delete` | Delete a service account by ID |
| `io.kestra.plugin.kestra.ee.iam.tenantAccess.Set` | Grant a user access to the tenant by email |
| `io.kestra.plugin.kestra.ee.iam.tenantAccess.Delete` | Revoke a user's tenant access by user ID |

For full property reference, see the [plugin-kestra documentation](/plugins/plugin-kestra).
