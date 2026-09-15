---
title: Instance Owner Console in Kestra Enterprise
h1: Manage Your Instance with the Instance Owner Console
description: Use the Instance Owner console in Kestra Enterprise to manage tenants, instance-wide IAM, infrastructure, and governance from a single interface.
sidebarTitle: Instance Owner
icon: /src/contents/docs/icons/admin.svg
editions: ["EE", "Cloud"]
---

The Instance Owner console provides instance-wide administration for tenants, IAM, infrastructure, and governance — separate from the tenant workspace you work in day to day.

:::alert{type="warning"}
Instance Owner operations are instance-wide. Changes to tenants, users, worker groups, and instance-level policies affect the entire Kestra instance, not just the tenant you are currently logged into.
:::

## Entering Instance Owner

In the sidebar, click **Instance Owner**. The entry is only visible to users with the Instance Owner privilege.

The UI switches to the Instance Owner console and shows a banner confirming you are administering the whole instance. Your regular tenant workspace is unaffected — you can return to it at any time.

## The Instance Owner console

The console organizes instance-wide administration into five sections:

![Instance Owner console overview](./super-admin-console.png)

| Section | What you can manage |
| :--- | :--- |
| **Instance** | Overview, System Overview, Services, Kill Switch, Announcements |
| **Tenants** | Create, edit, and delete tenants; configure dedicated storage and secrets backends per tenant |
| **Instance IAM** | Users and Service Accounts that exist at the instance level, independently of any tenant |
| **Infrastructure** | Worker Groups, Worker Queues, Versioned Plugins, MCP Servers |
| **Governance** | Instance-level Policies and Audit Logs across all tenants |

## Exiting Instance Owner

Click **Exit Instance Owner** at the top of the left sidebar to return to your tenant workspace.

## Who can access Instance Owner

Only users with the Instance Owner privilege can enter the Instance Owner console.

## Creating an Instance Owner user

### Through the setup wizard

When you launch Kestra for the first time, the [setup wizard](../../01.overview/02.setup/index.md) invites you to create the first user, which is automatically assigned the Instance Owner privilege.

### Through the CLI

To create a new user with the Instance Owner privilege:

```bash
kestra auths users create admin@kestra.io TopSecret42 --instance-owner

# with tenant scoping:
kestra auths users create <username> <password> \
--tenant=<tenant-id> --instance-owner
```

:::alert{type="info"}
`--superadmin` is a deprecated alias for `--instance-owner` and still works.
:::

### Through configuration

An Instance Owner can also be defined in the configuration file:

```yaml
kestra:
  security:
    instance-owner:
      username: <username>
      password: <password>
      tenant-admin-access:
        - <optional>
```

:::alert{type="info"}
`kestra.security.super-admin` is a deprecated alias for `kestra.security.instance-owner` and still works.
:::

For the full list of security configuration options, see [Security and Secrets configuration](../../../configuration/05.security-and-secrets/index.md).

## Granting and revoking Instance Owner access

You must be an Instance Owner yourself to grant or revoke the privilege.

### Through the UI

Open the user's detail page and toggle the Instance Owner switch:

![Instance Owner toggle in the user edit page](./superadmin_switch.png)

### Through the CLI

```bash
kestra auths users set-instance-owner admin@kestra.io true   # grant
kestra auths users set-instance-owner admin@kestra.io false  # revoke
```

:::alert{type="info"}
`set-superadmin` is a deprecated alias for `set-instance-owner` and still works.
:::
